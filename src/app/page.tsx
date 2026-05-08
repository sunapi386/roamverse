const projects = [
  {
    name: "roampool",
    desc: "A Cardano stake pool — independent, bare-metal infrastructure with 0% margin fees.",
    link: "https://pooltool.io/pool/07c3280a92a3010a1713e3cb22bfa82624a33061ad20c7b359e7252d/",
    tag: "Staking",
  },
  {
    name: "roamllamas",
    desc: "Artistic NFT collection rewarded to stake pool delegators. Unique generative llama artwork.",
    link: "/nft",
    tag: "NFTs",
  },
  {
    name: "cardano tools",
    desc: "Open source developer tooling for the Cardano ecosystem. Libraries, scripts, and utilities.",
    link: "https://github.com/sunapi386/stakepool",
    tag: "Open Source",
  },
]

const stakeFeatures = [
  {
    title: "Lowest Fees",
    text: "Our pool charges the lowest possible fees at 0% margin.",
  },
  {
    title: "Unique NFT Awards",
    text: "We mint artwork NFTs and award them to our delegators.",
  },
  {
    title: "Independent Hardware",
    text: "Uptime is utmost important. Dedicated hardware and monitored 24-7.",
  },
]

const epochs = [
  { title: "Epoch 1", text: "Your ₳ become registered with the pool after 1 epoch (=5 days)." },
  { title: "Epoch 2", text: "Your ₳ becomes active and start earning rewards." },
  { title: "Epoch 3", text: "Your rewards from Epoch 2 are being calculated for payout." },
  { title: "Epoch 4", text: "Your 1st payout from Epoch 2 are deposited to your account, rewards are also paid retroactively." },
  { title: "Epoch 5", text: "Your payout from Epoch 3 are deposited to your account, etc... and from now on, automatically deposited to your ₳ wallet directly." },
]

const nftFeatures = [
  {
    title: "Unique rewards",
    text: "If a block is minted in the epoch, then delegators with 1000 ADA+ will have an equal chance to win a unique NFT.",
  },
  {
    title: "NFT Buyback Guarantee",
    text: "If you don't want the NFT reward, list it on CNFT.io then ping us on Twitter, and we will buy it back after 5 listed days.",
  },
  {
    title: "Automatic Delivery",
    text: "The NFT will automatically be air-dropped to your wallet one epoch after the block minting epoch.",
  },
]

const team = [
  {
    name: "Jason Sun",
    role: "Co-Founder",
    bio: "Stay hungry stay foolish. Write the story for our future generations. During covid-19, I caught the travel bug. That's how my roam journey started.",
    twitter: "https://twitter.com/sunapi386",
    linkedin: "https://www.linkedin.com/in/sunapi386/",
    initials: "JS",
  },
  {
    name: "Kun (Douby) Qiu",
    role: "Co-Founder",
    bio: "A free roamer that loves nature and a simple life. A believer in the path for decentralization. If you spot me in the wild, call me a roamer!",
    initials: "KQ",
  },
]

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Projects />
      <StakeDetails />
      <WhatIsStaking />
      <NFTRewards />
      <Team />
      <Footer />
    </div>
  )
}

function Header() {
  return (
    <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050008]/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-bold tracking-tight">
            <span className="text-violet-400 group-hover:text-violet-300 transition-colors">ROAM</span>
            <span className="text-white/90">VERSE</span>
          </span>
        </a>
        <nav className="flex items-center gap-6 text-sm text-white/40">
          <a href="#projects" className="hover:text-white/80 transition-colors">Projects</a>
          <a href="#staking" className="hover:text-white/80 transition-colors">Staking</a>
          <a href="/nft" className="hover:text-white/80 transition-colors">NFTs</a>
          <a href="#team" className="hover:text-white/80 transition-colors">Team</a>
          <a href="/docs" className="hover:text-white/80 transition-colors">Docs</a>
          <a
            href="https://github.com/sunapi386/roamverse"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/80 transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative pt-40 pb-32 px-6 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            Roamverse
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
          We develop roamverse projects on Cardano blockchain
        </p>
      </div>

      <div className="mt-20 w-full max-w-4xl mx-auto h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
    </section>
  )
}

function Projects() {
  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4 text-white/90">Projects</h2>
        <p className="text-center text-white/30 mb-16 text-sm">What we&apos;ve been building</p>

        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((p) => (
            <a
              key={p.name}
              href={p.link}
              target={p.link.startsWith("http") ? "_blank" : undefined}
              rel={p.link.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 transition-all duration-300 hover:bg-white/[0.05] hover:border-violet-500/20 hover:shadow-[0_0_40px_rgba(139,92,246,0.08)] hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                  {p.tag}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white/90 mb-2 group-hover:text-violet-300 transition-colors">
                {p.name}
              </h3>
              <p className="text-sm text-white/40 leading-relaxed">{p.desc}</p>
              <div className="mt-6 flex items-center text-xs text-violet-400/60 group-hover:text-violet-400 transition-colors">
                <span>Explore</span>
                <svg className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function StakeDetails() {
  return (
    <section id="staking" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16 text-white/90">Why stake with us?</h2>

        <div className="grid md:grid-cols-3 gap-10">
          {stakeFeatures.map((f) => (
            <div key={f.title} className="flex gap-4">
              <div className="mt-1 flex-shrink-0">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white/90 mb-1">{f.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{f.text}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-sm text-white/40 text-center mt-16 max-w-3xl mx-auto leading-relaxed">
          Be automatically entered to win a unique Llama NFT by staking at least 1000₳ with us!
          Our stake pool does not operate in the cloud, or on any form of virtualization. Just simple{" "}
          <em className="text-white/60">bare-metal</em> staking in a safe location with reliable power
          grid with UPS backup and one of the fastest internet speeds in the world.
        </p>
      </div>
    </section>
  )
}

function WhatIsStaking() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4 text-white/90">What is staking?</h2>
        <p className="text-center text-white/40 mb-12 text-sm">
          Staking is kind of like banking your money and getting paid interest. Here&apos;s how it works.
        </p>

        <div className="space-y-4">
          {epochs.map((e) => (
            <div
              key={e.title}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6"
            >
              <h3 className="text-base font-semibold text-violet-400 mb-1">{e.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{e.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function NFTRewards() {
  return (
    <section id="nfts" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16 text-white/90">NFT Rewards</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {nftFeatures.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8"
            >
              <h3 className="text-lg font-semibold text-white/90 mb-3">{f.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Team() {
  return (
    <section id="team" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4 text-white/90">Team</h2>
        <p className="text-center text-white/30 mb-6 text-sm max-w-lg mx-auto">
          Our team brings combined 18 years of experience in software engineering, data science,
          and management.
        </p>
        <p className="text-center text-white/20 italic text-sm max-w-xl mx-auto mb-16">
          &ldquo;We think this blockchain has huge potential, for numerous reasons.
          To us, roam represents a lifestyle, freedom, and decentralization movement.&rdquo;
        </p>

        <div className="grid sm:grid-cols-2 gap-8">
          {team.map((m) => (
            <div
              key={m.name}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 border border-white/10 flex items-center justify-center mx-auto mb-5">
                <span className="text-2xl font-bold text-violet-300/80">{m.initials}</span>
              </div>
              <h3 className="text-lg font-semibold text-white/90">{m.name}</h3>
              <p className="text-xs font-medium text-violet-400/70 mb-4">{m.role}</p>
              <p className="text-sm text-white/35 leading-relaxed">{m.bio}</p>
              {(m.twitter || m.linkedin) && (
                <div className="flex justify-center gap-4 mt-5">
                  {m.twitter && (
                    <a href={m.twitter} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-violet-400 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                    </a>
                  )}
                  {m.linkedin && (
                    <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-violet-400 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
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
  )
}
