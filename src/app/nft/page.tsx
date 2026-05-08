const POLICY_ID = "d17b9b240ee5953793c4cfb6b490ab69b6dbc0a4c5bb0698e534849c"
const POOL_STAKE = "stake1uyadmnpu537qq43jc7gqg8usq0l7wv70n2vun3xjnzqz6dsp2kwva"

interface NftAsset {
  id: number
  name: string
  fingerprint: string
  ipfsCid: string
  rarity: number
  owner: string
  isPoolOwned: boolean
}

async function fetchNfts(): Promise<NftAsset[]> {
  const [infoRes, addrRes] = await Promise.all([
    fetch("https://api.koios.rest/api/v1/policy_asset_info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _asset_policy: POLICY_ID }),
      next: { revalidate: 3600 },
    }),
    fetch("https://api.koios.rest/api/v1/policy_asset_addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _asset_policy: POLICY_ID }),
      next: { revalidate: 3600 },
    }),
  ])

  const info: any[] = await infoRes.json()
  const addresses: any[] = await addrRes.json()

  const ownerMap = new Map<string, string>()
  for (const item of addresses) {
    ownerMap.set(item.asset_name, item.stake_address || item.payment_address)
  }

  const nfts: NftAsset[] = []

  for (const asset of info) {
    if (asset.total_supply === "0") continue

    const nameHex = asset.asset_name
    const name = hexToStr(nameHex)
    const idMatch = name.match(/roam_llama_(\d+)/)
    if (!idMatch) continue

    const meta =
      asset.minting_tx_metadata?.["721"]?.[POLICY_ID]?.[nameHex] ||
      asset.minting_tx_metadata?.["777"]?.[POLICY_ID]?.[nameHex] ||
      {}

    const stakeAddr = ownerMap.get(nameHex) || ""

    nfts.push({
      id: parseInt(idMatch[1]),
      name: name.replace(".png", ""),
      fingerprint: asset.fingerprint,
      ipfsCid: (meta.image || "").replace("ipfs://", ""),
      rarity: parseFloat(meta.rarity_per_mil || "0"),
      owner: stakeAddr,
      isPoolOwned: stakeAddr === POOL_STAKE,
    })
  }

  return nfts.sort((a, b) => a.id - b.id)
}

function hexToStr(hex: string): string {
  let str = ""
  for (let i = 0; i < hex.length; i += 2) {
    const code = parseInt(hex.substr(i, 2), 16)
    if (code >= 32 && code < 127) str += String.fromCharCode(code)
  }
  return str
}

function shortenAddr(addr: string): string {
  if (!addr || addr.length < 20) return addr
  return addr.slice(0, 12) + "..." + addr.slice(-6)
}

function rarityLabel(rarity: number): { text: string; color: string } {
  if (rarity < 1) return { text: "Legendary", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" }
  if (rarity < 3) return { text: "Epic", color: "text-purple-400 border-purple-500/30 bg-purple-500/10" }
  if (rarity < 5) return { text: "Rare", color: "text-blue-400 border-blue-500/30 bg-blue-500/10" }
  if (rarity < 10) return { text: "Uncommon", color: "text-green-400 border-green-500/30 bg-green-500/10" }
  return { text: "Common", color: "text-white/40 border-white/10 bg-white/5" }
}

export default async function NftPage() {
  const nfts = await fetchNfts()
  const poolOwned = nfts.filter((n) => n.isPoolOwned).length
  const distributed = nfts.filter((n) => !n.isPoolOwned).length

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
            <a href="/#staking" className="hover:text-white/80 transition-colors">Staking</a>
            <a href="/nft" className="text-violet-400">NFTs</a>
            <a href="/#team" className="hover:text-white/80 transition-colors">Team</a>
            <a href="/docs" className="hover:text-white/80 transition-colors">Docs</a>
          </nav>
        </div>
      </header>

      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Roam Llamas
            </span>
          </h1>
          <p className="text-white/40 max-w-2xl mx-auto mb-10">
            Unique generative llama NFTs minted on Cardano and awarded to roampool delegators.
            Each llama is one-of-a-kind with its own rarity score.
          </p>

          <div className="flex justify-center gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-white/90">{nfts.length}</div>
              <div className="text-xs text-white/30">Minted</div>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <div className="text-2xl font-bold text-green-400">{distributed}</div>
              <div className="text-xs text-white/30">Distributed</div>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <div className="text-2xl font-bold text-violet-400">{poolOwned}</div>
              <div className="text-xs text-white/30">In Pool</div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {nfts.map((nft) => {
            const rarity = rarityLabel(nft.rarity)
            return (
              <div
                key={nft.id}
                className="group rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all duration-300 hover:border-violet-500/20 hover:shadow-[0_0_30px_rgba(139,92,246,0.08)]"
              >
                <div className="aspect-square bg-white/[0.03] relative overflow-hidden">
                  <img
                    src={`/llamas/images/roam_llama_${nft.id}.png`}
                    alt={nft.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white/80">#{nft.id}</span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${rarity.color}`}>
                      {rarity.text}
                    </span>
                  </div>
                  <div className="text-[10px] text-white/25 mb-1">
                    {nft.rarity.toFixed(2)}‰ rarity
                  </div>
                  <div className="text-[10px] font-mono">
                    {nft.isPoolOwned ? (
                      <span className="text-violet-400/60">roampool</span>
                    ) : (
                      <a
                        href={`https://cardanoscan.io/stakekey/${nft.owner}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/25 hover:text-white/50 transition-colors"
                      >
                        {shortenAddr(nft.owner)}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 text-sm text-white/30 space-y-2">
            <h3 className="text-white/60 font-semibold mb-3">Collection Details</h3>
            <div className="flex justify-between">
              <span>Policy ID</span>
              <a
                href={`https://cardanoscan.io/tokenPolicy/${POLICY_ID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-violet-400/50 hover:text-violet-400 transition-colors"
              >
                {POLICY_ID.slice(0, 16)}...{POLICY_ID.slice(-8)}
              </a>
            </div>
            <div className="flex justify-between">
              <span>Blockchain</span>
              <span className="text-white/50">Cardano</span>
            </div>
            <div className="flex justify-between">
              <span>Token Standard</span>
              <span className="text-white/50">CIP-25 (721)</span>
            </div>
            <div className="flex justify-between">
              <span>Storage</span>
              <span className="text-white/50">IPFS</span>
            </div>
            <div className="flex justify-between">
              <span>Generated From</span>
              <span className="text-white/50">1,000 unique llamas</span>
            </div>
          </div>
        </div>
      </section>

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
