// Server-side proxy + cache for ROAM stake-pool stats.
// Calls Koios (public, no API key) and caches the merged result in-memory so
// the browser polls this route (not Koios). Handles Koios errors with
// stale-while-error: if a refresh fails, the last good payload is served with
// `stale: true` so the UI keeps showing numbers instead of breaking.

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const KOIOS = "https://api.koios.rest/api/v1"
const POOL_BECH32 = "pool1qlpjsz5j5vqs59cnu09j90agycj2xvrp45sv0v6euujj60up6dw"
const CACHE_TTL_MS = 30_000 // serve cached data for ~30s before refetching
const HISTORY_EPOCHS = 12 // recent epochs to chart

type StatsPayload = {
  pool: {
    poolIdBech32: string
    ticker: string | null
    name: string | null
    homepage: string | null
    description: string | null
    status: string | null
    marginPct: number
    fixedCostAda: number
    pledgeAda: number
    livePledgeAda: number
    pledgeMet: boolean
    liveStakeAda: number
    activeStakeAda: number
    liveSaturationPct: number
    liveDelegators: number
    blocksLifetime: number
    relays: { dns: string | null; ipv4: string | null; port: number | null }[]
  }
  epoch: {
    current: number
    startTime: number
    endTime: number
    blocksThisEpoch: number
  }
  history: {
    epoch: number
    activeStakeAda: number
    saturationPct: number | null
    delegators: number
    blocks: number
  }[]
  fetchedAt: number
  stale: boolean
}

let cache: { data: StatsPayload; ts: number } | null = null
let inflight: Promise<StatsPayload> | null = null

const lovelaceToAda = (v: string | number | null | undefined): number => {
  if (v === null || v === undefined) return 0
  return Number(v) / 1e6
}

async function koios(path: string, init?: RequestInit): Promise<any> {
  const res = await fetch(`${KOIOS}${path}`, {
    ...init,
    headers: {
      accept: "application/json",
      ...(init?.body ? { "content-type": "application/json" } : {}),
      ...(init?.headers || {}),
    },
    cache: "no-store",
  })
  if (!res.ok) {
    throw new Error(`Koios ${path} -> ${res.status}`)
  }
  return res.json()
}

async function fetchFresh(): Promise<StatsPayload> {
  // tip first so we know the current epoch (for this-epoch block count + countdown)
  const tip = (await koios("/tip"))[0]
  const currentEpoch: number = tip.epoch_no

  const [poolInfoArr, blocks, historyArr, epochInfoArr] = await Promise.all([
    koios("/pool_info", {
      method: "POST",
      body: JSON.stringify({ _pool_bech32_ids: [POOL_BECH32] }),
    }),
    koios(`/pool_blocks?_pool_bech32=${POOL_BECH32}`),
    koios(`/pool_history?_pool_bech32=${POOL_BECH32}`),
    koios(`/epoch_info?_epoch_no=${currentEpoch}`),
  ])

  const info = poolInfoArr[0]
  if (!info) throw new Error("pool_info empty")
  const epochInfo = epochInfoArr[0] || {}

  const pledgeAda = lovelaceToAda(info.pledge)
  const livePledgeAda = lovelaceToAda(info.live_pledge)

  // pool_history lags the tip, so derive this-epoch blocks from pool_blocks
  const blocksThisEpoch = Array.isArray(blocks)
    ? blocks.filter((b: any) => b.epoch_no === currentEpoch).length
    : 0

  const history = (Array.isArray(historyArr) ? historyArr : [])
    .slice(0, HISTORY_EPOCHS)
    .map((h: any) => ({
      epoch: h.epoch_no as number,
      activeStakeAda: lovelaceToAda(h.active_stake),
      saturationPct: h.saturation_pct === null ? null : Number(h.saturation_pct),
      delegators: Number(h.delegator_cnt),
      blocks: Number(h.block_cnt),
    }))
    .sort((a, b) => a.epoch - b.epoch)

  return {
    pool: {
      poolIdBech32: info.pool_id_bech32,
      ticker: info.meta_json?.ticker ?? null,
      name: info.meta_json?.name ?? null,
      homepage: info.meta_json?.homepage ?? null,
      description: info.meta_json?.description ?? null,
      status: info.pool_status ?? null,
      marginPct: Number(info.margin) * 100, // margin is a fraction (0..1)
      fixedCostAda: lovelaceToAda(info.fixed_cost),
      pledgeAda,
      livePledgeAda,
      pledgeMet: livePledgeAda >= pledgeAda,
      liveStakeAda: lovelaceToAda(info.live_stake),
      activeStakeAda: lovelaceToAda(info.active_stake),
      liveSaturationPct: Number(info.live_saturation), // already a percent
      liveDelegators: Number(info.live_delegators),
      blocksLifetime: Number(info.block_count),
      relays: Array.isArray(info.relays)
        ? info.relays.map((r: any) => ({
            dns: r.dns ?? null,
            ipv4: r.ipv4 ?? null,
            port: r.port ?? null,
          }))
        : [],
    },
    epoch: {
      current: currentEpoch,
      startTime: Number(epochInfo.start_time) || 0,
      endTime: Number(epochInfo.end_time) || 0,
      blocksThisEpoch,
    },
    history,
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
      { error: "Koios unavailable", message: String(err) },
      { status: 502 },
    )
  }
}
