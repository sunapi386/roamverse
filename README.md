# Roamverse

[roamverse.io](https://roamverse.io) — building on Cardano blockchain.

## Projects

- **roampool** — independent bare-metal Cardano stake pool with 0% margin fees. Pool ID: `07c3280a92a3010a1713e3cb22bfa82624a33061ad20c7b359e7252d` ([pooltool](https://pooltool.io/pool/07c3280a92a3010a1713e3cb22bfa82624a33061ad20c7b359e7252d/))
- **roamllamas** — collection of 1,000 generative llama NFTs, 25 minted and distributed to delegators. Policy ID: `d17b9b240ee5953793c4cfb6b490ab69b6dbc0a4c5bb0698e534849c`
- **cardano tools** — open source developer tooling ([github.com/sunapi386/stakepool](https://github.com/sunapi386/stakepool))

## Tech Stack

- [Next.js](https://nextjs.org/) 16 (App Router)
- [React](https://react.dev/) 19
- [Tailwind CSS](https://tailwindcss.com/) 3.4
- [TypeScript](https://www.typescriptlang.org/) 5
- [Koios API](https://api.koios.rest/) for on-chain Cardano data

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — projects, staking info, epoch explainer, NFT rewards, team |
| `/nft` | Llama NFT gallery with on-chain ownership and rarity data |
| `/docs` | Project history, technical docs, and on-chain references |

## Development

```bash
npm install
npm run dev
```

## NFT Collection

25 unique llamas minted on Cardano, each with a rarity score derived from trait generation across 1,000 candidates. NFT metadata follows CIP-25 (label 721) with images stored on IPFS.

Rarity tiers (based on `rarity_per_mil` — lower = rarer):

| Tier | Range | Count |
|------|-------|-------|
| Legendary | < 1‰ | 4 |
| Epic | 1–3‰ | 2 |
| Rare | 3–5‰ | 7 |
| Uncommon | 5–10‰ | 4 |
| Common | 10‰+ | 8 |

Ownership data is fetched from [Koios](https://api.koios.rest/) at build time and revalidates hourly.

## License

MIT
