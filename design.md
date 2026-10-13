# OneGoodDeed — Design Document

> Migrated from the "DonFan" project. This document is the authoritative audit and design reference for the migration.

---

## 1. Tech Stack

| Layer | Technology | Version / Notes |
|---|---|---|
| Framework | Next.js (App Router) | `^14.0.0` |
| UI Library | React | `^18.2.0` |
| Styling | Tailwind CSS | `^3.3.0` |
| Animation | Framer Motion | `^10.16.0` |
| Blockchain client | Ethers.js | `^6.9.0` |
| Smart contract language | Solidity | `0.8.20` |
| Contract framework | Hardhat | `^2.19.0` |
| Contract base | OpenZeppelin Contracts | `^4.9.0` |
| Build toolchain | PostCSS + Autoprefixer | `^8.4.0` / `^10.4.0` |

No wallet abstraction library (RainbowKit, wagmi) is used. Wallet connection is handled directly with `ethers.BrowserProvider` via raw `window.ethereum`.

---

## 2. Routes / Pages

All routes live under `app/` using the Next.js 14 App Router.

| Route | File | Purpose |
|---|---|---|
| `/` | `app/page.js` | Home page. Lists all on-chain campaigns fetched from the contract. Shows hero, campaign cards, stats, "How It Works", trust indicators, and footer. |
| `/create-campaign` | `app/create-campaign/page.js` | Create-campaign form. Wallet-gated. Calls `mintMyNFT` on the contract. |
| `/campaign/[tokenId]` | `app/campaign/[tokenId]/page.js` | Individual campaign view. Shows campaign info, progress, donation panel, and charity animation. |
| `/dashboard` | `app/dashboard/page.js` | Campaign creator dashboard. Shows stats, donation event history, and withdraw button. |
| `/my-contributions` | `app/my-contributions/page.js` | Donor history page. Currently redirects to Etherscan; full on-chain indexing is a roadmap item. |
| (root layout) | `app/layout.js` | Root HTML shell. Sets `<title>` and `<meta>` description. Contains floating-hearts decorative animation. |
| (global styles) | `app/globals.css` | Tailwind directives plus custom animations (`backgroundShift`, `floatUp`, `.floating-hearts`, `.charity-background`). |

There are **no Next.js API routes** (`route.js` files or `pages/api/`). All data access goes directly to the Ethereum smart contract from the browser.

---

## 3. Components

| File | Responsibility |
|---|---|
| `components/DonFanLogo.js` | SVG brand logo with configurable `size` prop. **Must be renamed** to `OneGoodDeedLogo.js`. |
| `components/WalletConnectButton.js` | MetaMask connect button. Handles connection, account-change events, chain-switch to Sepolia, and mobile deep-link fallback. |
| `components/InfluencerAvatar.js` | Displays a campaign creator's avatar (image or initial fallback). Name reflects old "influencer" concept; **must be renamed** to `CampaignAvatar.js`. |
| `components/DonationPanel.js` | Donation input + submit button. Calls `contract.donate(tokenId)`. Shows transaction status and success modal. |
| `components/ProgressStats.js` | Progress bar and raised/goal stats for a campaign. Contains a rupee symbol (`₹`) in milestone text — **dead string artefact** from an earlier localisation, should be removed. |
| `components/CharityVisual/HousingVisual.js` | Animated SVG visual for Housing campaigns. |
| `components/CharityVisual/MealsVisual.js` | Animated SVG visual for Meals campaigns. |
| `components/CharityVisual/MedicalVisual.js` | Animated SVG visual for Medical campaigns. |
| `components/CharityVisual/EducationVisual.js` | Animated SVG visual for Education and Equipment campaigns (Equipment falls through to this). |
| `components/CharityVisual/RiverVisual.js` | Animated SVG visual for RiverCleaning campaigns. |

All components are React client components (`'use client'`).

---

## 4. Data Models

### 4.1 On-chain — Solidity contract (`contracts/InfluencerDonationNFT.sol`)

```solidity
enum CharityType { Housing, Meals, Medical, Education, Equipment, RiverCleaning }

struct InfluencerData {         // stored as influencers[tokenId]
    CharityType charity;        // index 0
    uint256 totalDonations;     // index 1 (wei)
    uint256 goalAmount;         // index 2 (wei)
    bool    active;             // index 3
    address creator;            // index 4
    string  influencerName;     // index 5 — will be renamed to creatorName / campaignName
    string  profileImageUrl;    // index 6
}
```

**Note:** The Solidity struct field `influencerName` and public mapping `influencers` must be renamed. Because the contract is already deployed on Sepolia, renaming requires a new contract deployment. The plan accounts for this.

Events emitted:
- `NFTMinted(address indexed influencer, uint256 indexed tokenId, CharityType charity, uint256 goalAmount)`
- `DonationReceived(uint256 indexed tokenId, address indexed donor, uint256 amount)`
- `Withdrawn(uint256 indexed tokenId, address indexed influencer, uint256 amount)`

### 4.2 Off-chain — JavaScript data shape (produced in `app/page.js`, `app/dashboard/page.js`, `app/campaign/[tokenId]/page.js`)

```js
{
  tokenId:        Number,   // ERC-721 token id
  owner:          String,   // checksummed Ethereum address
  charity:        String,   // CHARITY_TYPES[influencer[0]] e.g. "Housing"
  totalDonations: Number,   // ETH (formatted)
  goalAmount:     Number,   // ETH (formatted)
  active:         Boolean,
  creator:        String,   // Ethereum address
  influencerName: String,   // display name — will be renamed to creatorName
  profileImageUrl: String,  // URL or base64 data URI
  isDemo:         Boolean   // only in home page (false for real on-chain data)
}
```

### 4.3 localStorage

No `localStorage` keys are used anywhere in the codebase. The earlier DonFan project may have used them; they have already been removed or were never present.

---

## 5. API Endpoints

None. There are no Next.js API routes (`app/**/route.js` or `pages/api/**`). All data flows directly from the browser to the Ethereum node via Ethers.js.

---

## 6. Auth Mechanism

**Wallet-based auth only.** No NextAuth or session tokens.

- `components/WalletConnectButton.js` requests `eth_requestAccounts` via `window.ethereum` (MetaMask or compatible injected provider).
- On connect it switches the user to Sepolia (`wallet_switchEthereumChain` / `wallet_addEthereumChain`).
- The connected address is held in React state. On page refresh the component calls `provider.listAccounts()` to silently reconnect.
- Mobile: if `window.ethereum` is absent, the component redirects to `metamask.app.link/dapp/…` (MetaMask deep link).
- No JWT, no cookie, no server-side session.

---

## 7. Payment / Blockchain Mechanism

### Contract

| Item | Value |
|---|---|
| Contract name | `InfluencerDonationNFT` → will be renamed `OrganisationDonationNFT` |
| Token standard | ERC-721 |
| Network | Ethereum **Sepolia** testnet (chainId 11155111) |
| Solidity version | 0.8.20 |
| OpenZeppelin dependencies | `ERC721`, `ReentrancyGuard` |
| Token symbol | `IDNFT` → will be renamed `ODNFT` |

### Donation flow

1. Campaign creator calls `mintMyNFT(charityType, goalAmount, creatorName, profileImageUrl)` → mints an ERC-721 NFT; the token represents the campaign.
2. Donor calls `donate(tokenId)` with `msg.value > 0` ETH → funds are held in the contract keyed to that token.
3. Campaign creator calls `withdraw(tokenId)` → all accumulated ETH for that token is sent to the NFT owner.
4. No platform fee is taken. No escrow intermediary.

### Contract helpers (`lib/contract.js`)

Exports `CONTRACT_ADDRESS` (from `NEXT_PUBLIC_CONTRACT_ADDRESS`), `CONTRACT_ABI` (string-array ABI fragment), `CHARITY_TYPES` map, and `getContract`, `formatEther`, `parseEther` helpers.

### Deploy script (`scripts/deploy.js`)

Uses Hardhat. Configured for Sepolia via `SEPOLIA_RPC_URL` and `PRIVATE_KEY` env vars.

---

## 8. Environment Variables

Source: `.env.local.example`

| Variable | Purpose | Example / Placeholder |
|---|---|---|
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Deployed contract address on Sepolia | `0x0000000000000000000000000000000000000000` |
| `NEXT_PUBLIC_SEPOLIA_CHAIN_ID` | Sepolia chain ID (informational) | `11155111` |

Additional variables used in `hardhat.config.js` (not in `.env.local.example` — need adding to `.env.example`):

| Variable | Purpose | Example / Placeholder |
|---|---|---|
| `SEPOLIA_RPC_URL` | Infura/Alchemy RPC endpoint for Hardhat deploys | `https://sepolia.infura.io/v3/YOUR_INFURA_KEY` |
| `PRIVATE_KEY` | Deployer wallet private key | `0x0000000000000000000000000000000000000000000000000000000000000000` |

---

## 9. Vercel Incompatibilities

| Issue | Severity | Proposed Fix |
|---|---|---|
| **`localhost` network in `hardhat.config.js`** | Low — deploy scripts never run on Vercel; this is dev-only. No fix needed in app code. | No action needed. |
| **Base64 image data stored as `profileImageUrl`** in the contract | Medium — large base64 strings bloat on-chain storage and are expensive in gas. Not a Vercel issue per se, but the note in `create-campaign/page.js` already advises users to use a hosted URL instead. | Document this in `.env.example` and add guidance. No code change needed for Vercel compat. |
| **`images.unoptimized: true`** in `next.config.js` | Low — disables Vercel image optimisation. Acceptable for now given arbitrary user image URLs. | Leave as-is unless image optimisation is a priority. |
| **No long-running servers** | N/A — all server work is read-only calls to a public blockchain RPC. The app is fully stateless. | Nothing to fix. |
| **No local DB / file storage** | N/A — no SQLite, no file system writes in the app code. | Nothing to fix. |

Overall, the app is already serverless-compatible. The only thing to verify is that `npm run build` passes after the renaming work.

---

## 10. DonFan References to Rename

All files containing `DonFan`, `donfan`, or `Donfan` (case-sensitive search across `.js`, `.json`, `.md`, `.sol`, `.css`):

| File | What needs changing |
|---|---|
| `package.json` | `"name": "donfan"` → `"onegooddeed"` |
| `package-lock.json` | `"name": "donfan"` (2 occurrences) → `"onegooddeed"` |
| `README.md` | All occurrences of `DonFan`, `donfan` in text, URLs, badge links, file tree |
| `app/layout.js` | `title: 'DonFan - Web3 Donation Platform'` → `'OneGoodDeed - Transparent Donation Platform'`; description meta |
| `app/page.js` | Import `DonFanLogo` → `OneGoodDeedLogo`; JSX text `DonFan` (×5); footer copyright |
| `app/dashboard/page.js` | Import `DonFanLogo` → `OneGoodDeedLogo`; JSX text `DonFan` (×4) |
| `app/campaign/[tokenId]/page.js` | Import `DonFanLogo` → `OneGoodDeedLogo`; JSX text `DonFan` |
| `app/create-campaign/page.js` | JSX text `DonFan` (×1, in header) |
| `app/my-contributions/page.js` | JSX text `DonFan` (×2, in headers) |
| `components/DonFanLogo.js` | Rename file to `OneGoodDeedLogo.js`; rename exported function |
| `contracts/InfluencerDonationNFT.sol` | Rename contract to `OrganisationDonationNFT`; rename struct `InfluencerData` → `CampaignData`; rename field `influencerName` → `creatorName`; rename mapping `influencers` → `campaigns`; update event parameter names; update constructor ERC721 name/symbol |
| `lib/contract.js` | Update ABI strings to match renamed contract (`influencers` → `campaigns`, `influencerName` → `creatorName`, event args); update `CONTRACT_ABI` |
| `scripts/deploy.js` | `InfluencerDonationNFT` → `OrganisationDonationNFT` (factory name, log messages) |
| `DEPLOYMENT.md` | All references to `InfluencerDonationNFT`, `DonFan` in instructions |

---

## 11. "Influencer" References to Rename (separate from DonFan branding)

Per steering doc (`steering/product.md`): "influencer" must not appear in code, UI, comments, or docs.

| File | What needs changing |
|---|---|
| `app/layout.js` | `description: 'Support your favorite influencers...'` → `'Support verified organisations and their charitable campaigns'` |
| `app/page.js` | `influencerName` variable → `creatorName`; hero text "Join influencers..." → neutral donor-friendly text; footer copy "Connecting generous donors with influencers..." |
| `app/create-campaign/page.js` | Form field `influencerName` → `creatorName`; label text "Your Name / Influencer Name" → "Campaign Creator Name"; alert text |
| `app/campaign/[tokenId]/page.js` | `influencerName` → `creatorName` |
| `app/dashboard/page.js` | `influencerName` → `creatorName` |
| `components/InfluencerAvatar.js` | Rename file to `CampaignAvatar.js`; rename exported function |
| `contracts/InfluencerDonationNFT.sol` | (Covered above — contract/struct/field/event renames) |
| `lib/contract.js` | ABI string field `influencerName` → `creatorName`; `influencers(...)` getter → `campaigns(...)` |
| `scripts/deploy.js` | Log message "Deploying InfluencerDonationNFT contract..." |
| `README.md` | All "influencer" mentions in text |
| `DEPLOYMENT.md` | All "influencer" mentions in text |
| `components/ProgressStats.js` | Remove stray `₹` rupee symbol in milestone strings; replace with "ETH" or remove prefix |

---

## 12. Dead Code

| Item | Status | Notes |
|---|---|---|
| `formData.campaignName` field in `app/create-campaign/page.js` | **Dead field** | There is an input bound to `formData.campaignName` but `campaignName` is never initialised in the `useState` and is never passed to the contract. The contract uses `influencerName` (→ `creatorName`) for the display name. This unused field and its `<input>` should be removed. |
| `useEffect` in `app/create-campaign/page.js` lines 20–23 | **Dead effect** | The effect fires when `provider` and `account` are set but has an empty body (comment only). Remove it. |
| No unused imports detected in any component (all imports in each file are referenced). | — | — |

---

## 13. EARS Requirements

- **WHEN** the project is built with `npm run build` **THEN** the system **SHALL** complete without errors.
- **THE** codebase **SHALL** contain no references to `DonFan`, `donfan`, or `Donfan` in any `.js`, `.ts`, `.json`, `.md`, `.sol`, or `.css` source file.
- **THE** codebase **SHALL** contain no references to `influencer` or `Influencer` in any user-visible string, component name, variable name, function name, or file name (ABI field strings that are part of an already-deployed contract ABI signature are exempt until redeployment).
- **THE** `.env.example` file **SHALL** list every environment variable required to run the project (`NEXT_PUBLIC_CONTRACT_ADDRESS`, `NEXT_PUBLIC_SEPOLIA_CHAIN_ID`, `SEPOLIA_RPC_URL`, `PRIVATE_KEY`) with placeholder values only and no real secrets.
- **THE** `.gitignore` **SHALL** exclude `.env*` files **except** `.env.example`, and **SHALL** also exclude `node_modules/`, `.next/`, `out/`, `artifacts/`, and `cache/`.
- **THE** `design.md` file **SHALL** document tech stack, routes, components, data models, API endpoints, auth mechanism, blockchain mechanism, environment variables, and Vercel incompatibilities.
