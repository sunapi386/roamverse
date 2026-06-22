"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const POLL_MS = 30_000 // browser polls our cached /api/health every ~30s

type NodeHealth = {
  id: string
  label: string
  up: boolean
  cpuPct: number | null
  memUsedBytes: number | null
  memTotalBytes: number | null
  uptimeSeconds: number | null
  timeline: (number | null)[]
}

type Health = {
  nodes: NodeHealth[]
  timelineHours: number
  fetchedAt: number
  stale: boolean
}

const fmtBytes = (n: number) => {
  const gb = n / 1024 ** 3
  if (gb >= 1) return `${gb.toFixed(1)} GB`
  return `${(n / 1024 ** 2).toFixed(0)} MB`
}

const fmtUptime = (secs: number) => {
  const d = Math.floor(secs / 86400)
  const h = Math.floor((secs % 86400) / 3600)
  const m = Math.floor((secs % 3600) / 60)
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export default function NodeHealth() {
  const [data, setData] = useState<Health | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const mounted = useRef(true)

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/health", { cache: "no-store" })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = (await res.json()) as Health
      if (!mounted.current) return
      setData(json)
      setError(null)
    } catch (e) {
      if (!mounted.current) return
      setError(String(e))
    } finally {
      if (mounted.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    mounted.current = true
    load()
    const id = setInterval(load, POLL_MS)
    return () => {
      mounted.current = false
      clearInterval(id)
    }
  }, [load])

  if (loading && !data) {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-12 text-center text-white/40 text-sm">
        Loading node health…
      </div>
    )
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-12 text-center text-red-300/70 text-sm">
        Could not load node health. {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* status strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-white/40">
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              data.stale ? "bg-amber-400" : "bg-green-400 animate-pulse"
            }`}
          />
          {data.stale ? "Showing cached data (metrics refresh failed)" : "Live"}
          <span className="text-white/20">
            · updated {new Date(data.fetchedAt).toLocaleTimeString()}
          </span>
        </div>
        <span className="text-white/20">
          Source: Prometheus · refreshes ~{POLL_MS / 1000}s
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {data.nodes.map((n) => (
          <NodeCard key={n.id} node={n} timelineHours={data.timelineHours} />
        ))}
      </div>
    </div>
  )
}

function NodeCard({
  node,
  timelineHours,
}: {
  node: NodeHealth
  timelineHours: number
}) {
  const memPct =
    node.memUsedBytes !== null && node.memTotalBytes
      ? (node.memUsedBytes / node.memTotalBytes) * 100
      : null

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
      {/* header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-violet-400">{node.label}</h3>
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full border ${
            node.up
              ? "bg-green-500/10 text-green-400 border-green-500/20"
              : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}
        >
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full ${
              node.up ? "bg-green-400 animate-pulse" : "bg-red-400"
            }`}
          />
          {node.up ? "Online" : "Offline"}
        </span>
      </div>

      {/* gauges */}
      <div className="space-y-4">
        <Gauge
          label="CPU"
          pct={node.cpuPct}
          valueText={node.cpuPct === null ? "—" : `${node.cpuPct.toFixed(0)}%`}
        />
        <Gauge
          label="Memory"
          pct={memPct}
          valueText={
            node.memUsedBytes !== null && node.memTotalBytes
              ? `${fmtBytes(node.memUsedBytes)} / ${fmtBytes(node.memTotalBytes)}`
              : "—"
          }
        />
      </div>

      {/* uptime */}
      <div className="flex items-center justify-between text-sm mt-5">
        <span className="text-white/40">Uptime</span>
        <span className="text-white/80 font-medium tabular-nums">
          {node.uptimeSeconds === null ? "—" : fmtUptime(node.uptimeSeconds)}
        </span>
      </div>

      {/* status timeline */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-[11px] text-white/30 mb-1.5">
          <span>Availability</span>
          <span>last {timelineHours}h</span>
        </div>
        <StatusTimeline series={node.timeline} />
      </div>
    </div>
  )
}

function Gauge({
  label,
  pct,
  valueText,
}: {
  label: string
  pct: number | null
  valueText: string
}) {
  const clamped = pct === null ? 0 : Math.max(0, Math.min(100, pct))
  // green under 70, amber 70-90, red above 90
  const color =
    pct === null
      ? "bg-white/10"
      : clamped >= 90
        ? "bg-red-400/70"
        : clamped >= 70
          ? "bg-amber-400/70"
          : "bg-violet-400/70"
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-white/40">{label}</span>
        <span className="text-white/70 font-medium tabular-nums">{valueText}</span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}

// Proxmox-style up/down bar: one cell per bucket, green = up, red = down,
// faint = no data yet (series still backfilling its first 24h of history).
function StatusTimeline({ series }: { series: (number | null)[] }) {
  if (!series || series.length === 0) {
    return (
      <div className="h-6 rounded-md bg-white/[0.04] flex items-center justify-center text-[10px] text-white/20">
        Collecting history…
      </div>
    )
  }
  return (
    <div className="flex gap-px h-6 rounded-md overflow-hidden">
      {series.map((v, i) => {
        const cls =
          v === null
            ? "bg-white/[0.06]"
            : v >= 0.99
              ? "bg-green-400/70"
              : v <= 0
                ? "bg-red-400/70"
                : "bg-amber-400/70"
        const title =
          v === null
            ? "no data"
            : v >= 0.99
              ? "up"
              : v <= 0
                ? "down"
                : `${Math.round(v * 100)}% up`
        return <div key={i} className={`flex-1 ${cls}`} title={title} />
      })}
    </div>
  )
}
