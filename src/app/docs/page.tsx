export default function DocsPage() {
  return (
    <div className="min-h-screen">
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050008]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold tracking-tight">
              <span className="text-violet-400 group-hover:text-violet-300 transition-colors">ROAM</span>
              <span className="text-white/90">VERSE</span>
            </span>
          </a>
          <nav className="flex items-center gap-6 text-sm text-white/40">
            <a href="/#projects" className="hover:text-white/80 transition-colors">Projects</a>
            <a href="/nft" className="hover:text-white/80 transition-colors">NFTs</a>
            <a href="/docs" className="text-violet-400">Docs</a>
            <a href="/#team" className="hover:text-white/80 transition-colors">Team</a>
          </nav>
        </div>
      </header>

      <article className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Documentation
            </span>
          </h1>
          <p className="text-white/30 mb-16 text-sm">Project history, technical details, and on-chain references</p>

          <Section title="History">
            <P>
              Roamverse started in late 2021 during the Cardano Shelley era, when staking pools were
              opening up to independent operators. The project was founded by Jason Sun and Kun (Douby) Qiu
              with a simple thesis: run a stake pool on bare-metal hardware with the lowest possible fees,
              and reward delegators with unique generative art.
            </P>
            <P>
              The original site launched as <Code>roampool.com</Code> using Next.js 12, Chakra UI, and a
              GraphQL API backed by Prisma and PostgreSQL. In 2022, the NFT collection was minted — 25
              unique llamas selected from a pool of 1,000 generated candidates, each assigned a rarity
              score based on trait combinations. The llamas were airdropped to delegators who held 1,000+
              ADA with the pool.
            </P>
            <P>
              In 2026, the brand consolidated from roampool.com to <Code>roamverse.io</Code>. The site was
              rebuilt from scratch with Next.js 16, React 19, and Tailwind CSS, replacing the original
              Chakra UI stack. The NFT gallery was added with live on-chain data from the Koios API.
            </P>
          </Section>

          <Section title="Stake Pool">
            <Table
              rows={[
                ["Pool ID", "07c3280a92a3010a1713e3cb22bfa82624a33061ad20c7b359e7252d"],
                ["Ticker", "ROAM"],
                ["Margin", "0%"],
                ["Fixed Cost", "340 ADA (protocol minimum)"],
                ["Infrastructure", "Bare-metal, dedicated hardware"],
                ["Active Since", "Epoch 315"],
                ["Blocks Minted", "51+"],
              ]}
            />
            <P>
              The pool runs on dedicated hardware — no cloud, no virtualization. This was a deliberate
              choice for reliability. The infrastructure is monitored 24/7 with UPS backup power.
            </P>
            <ExtLink href="https://pooltool.io/pool/07c3280a92a3010a1713e3cb22bfa82624a33061ad20c7b359e7252d/">
              View on PoolTool
            </ExtLink>
          </Section>

          <Section title="NFT Collection">
            <P>
              The Roam Llamas are a collection of generative NFTs minted on Cardano using the CIP-25
              metadata standard (label 721). Each NFT represents a unique llama generated from trait
              combinations, with rarity scores expressed in permille (per thousand).
            </P>
            <Table
              rows={[
                ["Policy ID", "d17b9b240ee5953793c4cfb6b490ab69b6dbc0a4c5bb0698e534849c"],
                ["Token Standard", "CIP-25 (Cardano NFT Metadata)"],
                ["Total Generated", "1,000 unique llamas"],
                ["Total Minted", "25 on-chain"],
                ["Image Storage", "IPFS"],
                ["First Mint", "January 26, 2022"],
                ["Latest Mint", "Epoch-based, ongoing"],
              ]}
            />

            <h3 className="text-lg font-semibold text-white/80 mt-8 mb-3">Rarity Tiers</h3>
            <P>
              Rarity is based on <Code>rarity_per_mil</Code> from the minting metadata — the statistical
              frequency of a llama&apos;s trait combination across all 1,000 generated candidates.
              Lower values mean the combination is rarer.
            </P>
            <div className="space-y-2 my-4">
              <RarityRow tier="Legendary" range="< 1‰" color="text-amber-400" examples="#4, #5, #19, #22" />
              <RarityRow tier="Epic" range="1–3‰" color="text-purple-400" examples="#2, #7" />
              <RarityRow tier="Rare" range="3–5‰" color="text-blue-400" examples="#3, #10, #15, #18, #21, #24, #25" />
              <RarityRow tier="Uncommon" range="5–10‰" color="text-green-400" examples="#11, #12, #13, #23" />
              <RarityRow tier="Common" range="10‰+" color="text-white/40" examples="#1, #6, #8, #9, #14, #16, #17, #20" />
            </div>

            <h3 className="text-lg font-semibold text-white/80 mt-8 mb-3">How Rewards Work</h3>
            <P>
              When the pool mints a block in an epoch, delegators holding 1,000+ ADA are entered into a
              lottery. The winner receives a unique llama NFT airdropped directly to their wallet in the
              following epoch. If a winner doesn&apos;t want the NFT, a buyback guarantee allows them to list
              it on a marketplace and the team will purchase it back after 5 days.
            </P>

            <ExtLink href="/nft">View the full gallery</ExtLink>
          </Section>

          <Section title="On-Chain References">
            <P>
              All data can be independently verified on the Cardano blockchain. The NFT gallery on this
              site fetches live ownership data from the{" "}
              <a href="https://api.koios.rest/" target="_blank" rel="noopener noreferrer" className="text-violet-400/70 hover:text-violet-400 transition-colors">
                Koios API
              </a>
              , a decentralized Cardano query layer.
            </P>
            <div className="space-y-2 mt-4">
              <RefLink
                label="Pool on CardanoScan"
                href="https://cardanoscan.io/pool/07c3280a92a3010a1713e3cb22bfa82624a33061ad20c7b359e7252d"
              />
              <RefLink
                label="NFT Policy on CardanoScan"
                href="https://cardanoscan.io/tokenPolicy/d17b9b240ee5953793c4cfb6b490ab69b6dbc0a4c5bb0698e534849c"
              />
              <RefLink
                label="Pool on PoolTool"
                href="https://pooltool.io/pool/07c3280a92a3010a1713e3cb22bfa82624a33061ad20c7b359e7252d/"
              />
              <RefLink
                label="Source Code"
                href="https://github.com/sunapi386/roamverse"
              />
              <RefLink
                label="Stakepool Tools"
                href="https://github.com/sunapi386/stakepool"
              />
            </div>
          </Section>

          <Section title="Tech Stack">
            <Table
              rows={[
                ["Framework", "Next.js 16 (App Router)"],
                ["UI", "React 19 + Tailwind CSS 3.4"],
                ["Language", "TypeScript 5"],
                ["Chain Data", "Koios REST API (revalidates hourly)"],
                ["Hosting", "Self-hosted, bare-metal"],
                ["Process Manager", "PM2"],
                ["Reverse Proxy", "nginx with Let's Encrypt TLS"],
              ]}
            />
          </Section>
        </div>
      </article>

      <footer className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent mb-10" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <a href="/" className="text-sm font-semibold tracking-tight">
              <span className="text-violet-400">ROAM</span>
              <span className="text-white/70">VERSE</span>
            </a>
            <span className="text-xs text-white/20">&copy; 2022–2026 roamverse</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold text-white/90 mb-6">{title}</h2>
      {children}
    </section>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-white/40 leading-relaxed mb-4">{children}</p>
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="text-xs bg-white/[0.06] text-violet-300/80 px-1.5 py-0.5 rounded">
      {children}
    </code>
  )
}

function Table({ rows }: { rows: [string, string][] }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden my-4">
      {rows.map(([label, value], i) => (
        <div
          key={label}
          className={`flex justify-between px-5 py-3 text-sm ${i < rows.length - 1 ? "border-b border-white/[0.04]" : ""}`}
        >
          <span className="text-white/30">{label}</span>
          <span className="text-white/60 font-mono text-xs max-w-[60%] text-right break-all">{value}</span>
        </div>
      ))}
    </div>
  )
}

function RarityRow({ tier, range, color, examples }: { tier: string; range: string; color: string; examples: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className={`${color} font-semibold w-24`}>{tier}</span>
      <span className="text-white/30 w-16">{range}</span>
      <span className="text-white/20 text-xs">{examples}</span>
    </div>
  )
}

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  const isExternal = href.startsWith("http")
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="inline-flex items-center gap-1 text-sm text-violet-400/60 hover:text-violet-400 transition-colors mt-2"
    >
      {children}
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </a>
  )
}

function RefLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm group hover:border-violet-500/20 transition-colors"
    >
      <span className="text-white/50 group-hover:text-white/70 transition-colors">{label}</span>
      <svg className="w-4 h-4 text-white/20 group-hover:text-violet-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  )
}
