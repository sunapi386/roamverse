"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const POLL_MS = 25_000 // browser polls our cached /api/stats every ~25s
const POOL_ID = "pool1qlpjsz5j5vqs59cnu09j90agycj2xvrp45sv0v6euujj60up6dw"

type Stats = {
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

const fmtAda = (n: number) =>
  `₳${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`

const fmtNum = (n: number) =>
  n.toLocaleString("en-US", { maximumFractionDigits: 0 })

function CountdownMetric({ target }: { target: number }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const secs = Math.max(0, Math.floor(target - now / 1000))
  const d = Math.floor(secs / 86400)
  const h = Math.floor((secs % 86400) / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  const value = target ? `${d}d ${h}h ${m}m ${s}s` : "—"
  return <Metric label="Next epoch in" value={value} mono />
}

export default function PoolStats() {
  const [data, setData] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const mounted = useRef(true)

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/stats", { cache: "no-store" })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = (await res.json()) as Stats
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
        Loading live pool data…
      </div>
    )
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-12 text-center text-red-300/70 text-sm">
        Could not load pool data. {error}
      </div>
    )
  }

  const { pool, epoch, history } = data

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
          {data.stale ? "Showing cached data (Koios refresh failed)" : "Live"}
          <span className="text-white/20">
            · updated {new Date(data.fetchedAt).toLocaleTimeString()}
          </span>
        </div>
        <span className="text-white/20">
          Source: Koios · refreshes ~{POLL_MS / 1000}s
        </span>
      </div>

      {/* primary metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Metric label="Live Stake" value={fmtAda(pool.liveStakeAda)} />
        <Metric label="Active Stake" value={fmtAda(pool.activeStakeAda)} />
        <Metric
          label="Saturation"
          value={`${pool.liveSaturationPct.toFixed(2)}%`}
        />
        <Metric label="Delegators" value={fmtNum(pool.liveDelegators)} />
        <Metric
          label="Blocks (lifetime)"
          value={fmtNum(pool.blocksLifetime)}
        />
        <Metric
          label="Blocks (this epoch)"
          value={fmtNum(epoch.blocksThisEpoch)}
        />
        <Metric label="Epoch" value={`#${epoch.current}`} sub="current" />
        <CountdownMetric target={epoch.endTime} />
      </div>

      {/* pledge / cost / margin */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Panel title="Pledge">
          <Row k="Declared" v={fmtAda(pool.pledgeAda)} />
          <Row k="Live" v={fmtAda(pool.livePledgeAda)} />
          <div className="mt-3">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
                pool.pledgeMet
                  ? "bg-green-500/10 text-green-400 border-green-500/20"
                  : "bg-red-500/10 text-red-400 border-red-500/20"
              }`}
            >
              {pool.pledgeMet ? "Pledge met" : "Pledge not met"}
            </span>
          </div>
        </Panel>
        <Panel title="Fees">
          <Row k="Margin" v={`${pool.marginPct.toFixed(2)}%`} />
          <Row k="Fixed cost" v={`${fmtAda(pool.fixedCostAda)}/epoch`} />
        </Panel>
        <Panel title="Pool">
          <Row k="Ticker" v={pool.ticker ?? "—"} />
          <Row k="Status" v={pool.status ?? "—"} />
          <Row k="Relays" v={fmtNum(pool.relays.length)} />
        </Panel>
      </div>

      {/* charts */}
      <div className="grid md:grid-cols-2 gap-4">
        <ChartPanel
          title="Active stake (recent epochs)"
          history={history}
          pick={(h) => h.activeStakeAda}
          fmt={(v) => fmtAda(v)}
        />
        <ChartPanel
          title="Delegators (recent epochs)"
          history={history}
          pick={(h) => h.delegators}
          fmt={(v) => fmtNum(v)}
        />
      </div>

      {/* pool id footer */}
      <div className="text-center text-[11px] text-white/20 break-all">
        Pool ID: {pool.poolIdBech32 || POOL_ID}
      </div>
    </div>
  )
}

function Metric({
  label,
  value,
  sub,
  mono,
}: {
  label: string
  value: string
  sub?: string
  mono?: boolean
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <div className="text-[11px] uppercase tracking-wider text-white/30 mb-2">
        {label}
      </div>
      <div
        className={`text-xl font-semibold text-white/90 ${
          mono ? "tabular-nums" : ""
        }`}
      >
        {value}
      </div>
      {sub && <div className="text-[11px] text-white/25 mt-1">{sub}</div>}
    </div>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
      <h3 className="text-sm font-semibold text-violet-400 mb-4">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-white/40">{k}</span>
      <span className="text-white/80 font-medium">{v}</span>
    </div>
  )
}

function ChartPanel({
  title,
  history,
  pick,
  fmt,
}: {
  title: string
  history: Stats["history"]
  pick: (h: Stats["history"][number]) => number
  fmt: (v: number) => string
}) {
  const pts = history.map(pick)
  const latest = pts.length ? pts[pts.length - 1] : 0
  const epochs = history.map((h) => h.epoch)

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-sm font-semibold text-violet-400">{title}</h3>
        <span className="text-sm font-semibold text-white/80">{fmt(latest)}</span>
      </div>
      <Sparkline values={pts} />
      <div className="flex justify-between text-[10px] text-white/25 mt-2">
        <span>{epochs.length ? `epoch ${epochs[0]}` : ""}</span>
        <span>{epochs.length ? `epoch ${epochs[epochs.length - 1]}` : ""}</span>
      </div>
    </div>
  )
}

// Lightweight inline SVG line chart (no chart-lib dependency).
function Sparkline({ values }: { values: number[] }) {
  const W = 320
  const H = 80
  const PAD = 4
  if (values.length === 0) {
    return <div className="h-20 text-xs text-white/20">No history</div>
  }
  const min = Math.min(...values)
  const max = Math.max(...values)
  const flat = max === min
  const span = max - min || 1
  const stepX = values.length > 1 ? (W - PAD * 2) / (values.length - 1) : 0
  // A flat series (constant value) is centered vertically so it reads as
  // "steady" rather than pinned to the bottom looking like zero/broken.
  const y = (v: number) =>
    flat ? H / 2 : H - PAD - ((v - min) / span) * (H - PAD * 2)
  const x = (i: number) => PAD + i * stepX
  const line = values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join(" ")
  const area = `${line} L${x(values.length - 1)},${H - PAD} L${x(0)},${H - PAD} Z`

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-20"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="roamFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(139,92,246)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="rgb(139,92,246)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#roamFill)" />
      <path
        d={line}
        fill="none"
        stroke="rgb(167,139,250)"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      {values.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r={1.5} fill="rgb(196,181,253)" />
      ))}
    </svg>
  )
}
