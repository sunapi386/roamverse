import type { Metadata } from "next"
import PoolStats from "@/components/PoolStats"
import NodeHealth from "@/components/NodeHealth"

export const metadata: Metadata = {
  title: "ROAM Pool Stats — Roamverse",
  description:
    "Live on-chain stats for the ROAM Cardano stake pool: stake, saturation, delegators, blocks, and pledge — sourced from Koios.",
}

export default function StatsPage() {
  return (
    <div className="min-h-screen">
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050008]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold tracking-tight">
              <span className="text-violet-400 group-hover:text-violet-300 transition-colors">
                ROAM
              </span>
              <span className="text-white/90">VERSE</span>
            </span>
          </a>
          <nav className="flex items-center gap-6 text-sm text-white/40">
            <a href="/#projects" className="hover:text-white/80 transition-colors">
              Projects
            </a>
            <a href="/#staking" className="hover:text-white/80 transition-colors">
              Staking
            </a>
            <a href="/nft" className="hover:text-white/80 transition-colors">
              NFTs
            </a>
            <a href="/stats" className="text-violet-400">
              Stats
            </a>
            <a href="/docs" className="hover:text-white/80 transition-colors">
              Docs
            </a>
          </nav>
        </div>
      </header>

      <section className="relative pt-32 pb-12 px-6 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              ROAM Pool Stats
            </span>
          </h1>
          <p className="text-white/40 text-sm max-w-xl mx-auto leading-relaxed">
            Live on-chain metrics for the ROAM Cardano stake pool. Public data
            from Koios, refreshed automatically.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <PoolStats />
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2 text-white/90">Node Health</h2>
          <p className="text-center text-white/30 mb-10 text-sm">
            Live infrastructure status for the block producer and relay
          </p>
          <NodeHealth />
        </div>
      </section>

      <footer className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent mb-10" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm font-semibold tracking-tight">
              <span className="text-violet-400">ROAM</span>
              <span className="text-white/70">VERSE</span>
            </span>
            <span className="text-xs text-white/20">&copy; 2022–2026 roamverse</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
