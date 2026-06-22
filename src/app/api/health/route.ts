// Server-side proxy + cache for ROAM node health (Proxmox-style summary).
//
// Source: the Prometheus instance running in the `nexus-prometheus` Docker
// container on this host. Prometheus' HTTP API is NOT published to the host
// (no localhost:9090), and the container IP is not stable across restarts, so
// we resolve it at runtime via `docker inspect` (this process runs as a user
// in the `docker` group) and cache it; on a connection failure we re-resolve.
//
// Public-safe: the response carries only health metrics and the human labels
// "Block Producer" / "Relay". Raw IPs, hostnames, VM ids and Prometheus
// internals never leave the server.

import { execFile } from "node:child_process"
import { promisify } from "node:util"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const execFileAsync = promisify(execFile)

const PROM_CONTAINER = "nexus-prometheus"
const DOCKER_BIN = "/usr/bin/docker"
const CACHE_TTL_MS = 30_000 // serve cached data for ~30s before refetching
const TIMELINE_HOURS = 24
const TIMELINE_STEP_S = 30 * 60 // 30-minute buckets -> 48 points over 24h

// Map Prometheus `instance` label -> public-facing role label. Keeps IPs and
// hostnames out of the response entirely.
const ROLE_LABELS: Record<string, string> = {
  producer: "Block Producer",
  relay: "Relay",
}

type NodeHealth = {
  id: string // "producer" | "relay" (stable key, not an IP)
  label: string // "Block Producer" | "Relay"
  up: boolean
  cpuPct: number | null
  memUsedBytes: number | null
  memTotalBytes: number | null
  uptimeSeconds: number | null
  // up/down series for the sparkline: 1 = up, 0 = down, null = no data yet
  timeline: (number | null)[]
}

type HealthPayload = {
  nodes: NodeHealth[]
  timelineHours: number
  fetchedAt: number
  stale: boolean
}

let cache: { data: HealthPayload; ts: number } | null = null
let inflight: Promise<HealthPayload> | null = null
let promIp: string | null = null

async function resolvePromIp(force = false): Promise<string> {
  if (promIp && !force) return promIp
  const { stdout } = await execFileAsync(DOCKER_BIN, [
    "inspect",
    "-f",
    "{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}",
    PROM_CONTAINER,
  ])
  const ip = stdout.trim()
  if (!ip) throw new Error("could not resolve prometheus container IP")
  promIp = ip
  return ip
}

async function promFetch(path: string, params: Record<string, string>): Promise<any> {
  const run = async (ip: string) => {
    const qs = new URLSearchParams(params).toString()
    const res = await fetch(`http://${ip}:9090${path}?${qs}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) throw new Error(`prometheus ${path} -> ${res.status}`)
    const json = await res.json()
    if (json.status !== "success") {
      throw new Error(`prometheus ${path} status=${json.status}`)
    }
    return json.data
  }
  try {
    return await run(await resolvePromIp())
  } catch (err) {
    // container may have restarted -> stale IP. Re-resolve once and retry.
    return await run(await resolvePromIp(true))
  }
}

function instantQuery(query: string) {
  return promFetch("/api/v1/query", { query })
}

// Build {instance -> value} from an instant vector result.
function vectorMap(data: any): Record<string, number> {
  const out: Record<string, number> = {}
  for (const r of data?.result ?? []) {
    const inst = r.metric?.instance
    if (inst) out[inst] = Number(r.value[1])
  }
  return out
}

async function fetchFresh(): Promise<HealthPayload> {
  const job = 'job="cardano-host"'
  const now = Math.floor(Date.now() / 1000)
  const start = now - TIMELINE_HOURS * 3600

  const [cpu, memTotal, memAvail, uptime, up, range] = await Promise.all([
    instantQuery(
      `100 * (1 - avg by (instance)(rate(node_cpu_seconds_total{${job},mode="idle"}[5m])))`,
    ),
    instantQuery(`node_memory_MemTotal_bytes{${job}}`),
    instantQuery(`node_memory_MemAvailable_bytes{${job}}`),
    instantQuery(`node_time_seconds{${job}} - node_boot_time_seconds{${job}}`),
    instantQuery(`up{${job}}`),
    promFetch("/api/v1/query_range", {
      query: `avg_over_time(up{${job}}[${TIMELINE_STEP_S}s])`,
      start: String(start),
      end: String(now),
      step: String(TIMELINE_STEP_S),
    }),
  ])

  const cpuM = vectorMap(cpu)
  const memTotalM = vectorMap(memTotal)
  const memAvailM = vectorMap(memAvail)
  const uptimeM = vectorMap(uptime)
  const upM = vectorMap(up)

  // timeline: instance -> array of 0/1 (averaged up over the bucket)
  const timelineM: Record<string, (number | null)[]> = {}
  for (const r of range?.result ?? []) {
    const inst = r.metric?.instance
    if (!inst) continue
    timelineM[inst] = (r.values ?? []).map((v: [number, string]) =>
      v[1] === undefined ? null : Number(v[1]),
    )
  }

  const nodes: NodeHealth[] = Object.entries(ROLE_LABELS).map(([id, label]) => {
    const memTotalBytes = memTotalM[id] ?? null
    const memAvailBytes = memAvailM[id] ?? null
    const memUsedBytes =
      memTotalBytes !== null && memAvailBytes !== null
        ? memTotalBytes - memAvailBytes
        : null
    return {
      id,
      label,
      up: upM[id] === 1,
      cpuPct: id in cpuM ? Math.max(0, Math.min(100, cpuM[id])) : null,
      memUsedBytes,
      memTotalBytes,
      uptimeSeconds: id in uptimeM ? Math.max(0, Math.round(uptimeM[id])) : null,
      timeline: timelineM[id] ?? [],
    }
  })

  return {
    nodes,
    timelineHours: TIMELINE_HOURS,
    fetchedAt: Date.now(),
    stale: false,
  }
}

export async function GET() {
  const now = Date.now()

  if (cache && now - cache.ts < CACHE_TTL_MS) {
    return Response.json(cache.data)
  }

  if (!inflight) {
    inflight = fetchFresh()
      .then((data) => {
        cache = { data, ts: Date.now() }
        return data
      })
      .finally(() => {
        inflight = null
      })
  }

  try {
    const data = await inflight
    return Response.json(data)
  } catch (err) {
    if (cache) {
      return Response.json({ ...cache.data, stale: true })
    }
    return Response.json(
      { error: "Node health unavailable", message: String(err) },
      { status: 502 },
    )
  }
}
