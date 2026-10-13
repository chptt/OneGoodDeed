# Implementation Plan — OneGoodDeed Migration

> Codebase root: `d:\OneGoodDeed`
> All paths below are relative to that root unless stated otherwise.
> Run every verification command from `d:\OneGoodDeed`.

---

- [ ] 1. **Rename `DonFanLogo.js` → `OneGoodDeedLogo.js` and update all imports**

  Create `components/OneGoodDeedLogo.js` by copying `components/DonFanLogo.js`, renaming the exported function from `DonFanLogo` to `OneGoodDeedLogo`. Delete the old file.
  Update imports in every file that references it:
  - `app/page.js`: `import DonFanLogo from '@/components/DonFanLogo'` → `import OneGoodDeedLogo from '@/components/OneGoodDeedLogo'`; replace all `<DonFanLogo` JSX usages with `<OneGoodDeedLogo`
  - `app/dashboard/page.js`: same import + JSX substitution
  - `app/campaign/[tokenId]/page.js`: same import + JSX substitution

  Files to create: `components/OneGoodDeedLogo.js`
  Files to modify: `app/page.js`, `app/dashboard/page.js`, `app/campaign/[tokenId]/page.js`
  Files to delete: `components/DonFanLogo.js`

  Verify: `npx next build` — build must complete with exit code 0 (or run after step 7 as a batch check).

---

- [ ] 2. **Rename `InfluencerAvatar.js` → `CampaignAvatar.js` and update all imports**

  Create `components/CampaignAvatar.js` by copying `components/InfluencerAvatar.js`, renaming the exported function from `InfluencerAvatar` to `CampaignAvatar`. Delete the old file.
  Update imports in every file that references it:
  - `app/page.js`: `import InfluencerAvatar from '@/components/InfluencerAvatar'` → `import CampaignAvatar from '@/components/CampaignAvatar'`; replace `<InfluencerAvatar` with `<CampaignAvatar`
  - `app/campaign/[tokenId]/page.js`: same import + JSX substitution

  Files to create: `components/CampaignAvatar.js`
  Files to modify: `app/page.js`, `app/campaign/[tokenId]/page.js`
  Files to delete: `components/InfluencerAvatar.js`

  Verify: `npx next build` — no import errors.

---

- [ ] 3. **Replace all DonFan brand text in app pages and layout**

  Make the following text replacements across these files:

  **`app/layout.js`**
  - `title: 'DonFan - Web3 Donation Platform'` → `title: 'OneGoodDeed - Transparent Donation Platform'`
  - `description: 'Support your favorite influencers and their charitable causes'` → `description: 'Support verified organisations and their charitable campaigns. Every donation is tracked transparently on the blockchain.'`

  **`app/page.js`** (all occurrences of the literal string `DonFan` in JSX / text):
  - Header `<h1>` text `DonFan` → `OneGoodDeed`
  - Footer `<span>DonFan</span>` → `<span>OneGoodDeed</span>`
  - Footer heading `Why DonFan?` → `Why OneGoodDeed?`
  - Footer copyright `© 2024 DonFan. Making charitable giving transparent and impactful.` → `© 2024 OneGoodDeed. Making charitable giving transparent and impactful.`
  - Hero paragraph "Join influencers and their communities..." → "Join organisations and donors in making a real difference. Every donation is tracked transparently, so you can see exactly how your contribution helps."
  - Footer tagline "Connecting generous donors with influencers making a positive impact in their communities." → "Connecting generous donors with verified organisations making a positive impact in their communities."
  - "Browse campaigns from influencers supporting causes..." → "Browse campaigns from organisations supporting causes..."

  **`app/dashboard/page.js`** (all `DonFan` text in JSX):
  - All four `DonFan` header instances → `OneGoodDeed`

  **`app/campaign/[tokenId]/page.js`**:
  - `DonFan` in header `<h1>` → `OneGoodDeed`

  **`app/create-campaign/page.js`**:
  - `DonFan` in header `<h1>` → `OneGoodDeed`

  **`app/my-contributions/page.js`**:
  - Both `DonFan` header instances → `OneGoodDeed`

  Files to modify: `app/layout.js`, `app/page.js`, `app/dashboard/page.js`, `app/campaign/[tokenId]/page.js`, `app/create-campaign/page.js`, `app/my-contributions/page.js`

  Verify: After this step, run:
  ```
  Get-ChildItem -Path . -Recurse -Include "*.js","*.ts","*.json","*.md","*.sol","*.css" | Where-Object { $_.FullName -notmatch "node_modules|\.next|artifacts|cache|steering" } | ForEach-Object { Select-String -Path $_.FullName -Pattern "DonFan|donfan|Donfan" }
  ```
  Expected: zero matches (steering docs are excluded as they reference the old name for documentation purposes).

---

- [ ] 4. **Rename `influencerName` → `creatorName` and remove "influencer" text from all JS files**

  This is a variable-level rename across the JavaScript layer (the contract ABI strings will be updated in step 6 together with the Solidity rename).

  **`app/page.js`**:
  - `influencerName: influencer[5] || ...` → `creatorName: influencer[5] || ...`
  - All JSX that renders `campaign.influencerName` → `campaign.creatorName`

  **`app/dashboard/page.js`**:
  - `influencerName: influencer[5] || ...` → `creatorName: influencer[5] || ...`
  - All access to `campaignData.influencerName` → `campaignData.creatorName`
  - Display of `campaign.influencerName` → `campaign.creatorName`

  **`app/campaign/[tokenId]/page.js`**:
  - `influencerName: influencer[5] || ...` → `creatorName: influencer[5] || ...`
  - All JSX rendering `campaign.influencerName` → `campaign.creatorName`

  **`app/create-campaign/page.js`**:
  - `formData` field `influencerName: ''` → `creatorName: ''`
  - All references to `formData.influencerName` → `formData.creatorName`
  - `name="influencerName"` input attr → `name="creatorName"`
  - `id="influencerName"` → `id="creatorName"`
  - Label text "Your Name / Influencer Name" → "Your Name / Campaign Creator Name"
  - Alert text "Please enter your name or influencer name" → "Please enter your name or campaign creator name"
  - Remove the dead `formData.campaignName` field from `useState` and its corresponding `<input>` element entirely (it is initialised in state but never sent to the contract — dead code, see design.md §12)
  - Remove the empty `useEffect` at lines 20-23 (body is a comment with no logic — dead code)
  - `disabled={loading || !formData.goalAmount || !formData.influencerName}` → `disabled={loading || !formData.goalAmount || !formData.creatorName}`

  Files to modify: `app/page.js`, `app/dashboard/page.js`, `app/campaign/[tokenId]/page.js`, `app/create-campaign/page.js`

  Verify: `npx next build` — no undefined variable errors.

---

- [ ] 5. **Rename the Solidity contract and its identifiers**

  Rename `contracts/InfluencerDonationNFT.sol` to `contracts/OrganisationDonationNFT.sol`.

  Inside the file, make these substitutions:
  - `contract InfluencerDonationNFT` → `contract OrganisationDonationNFT`
  - `struct InfluencerData` → `struct CampaignData`
  - `string influencerName;` (inside struct) → `string creatorName;`
  - `mapping(uint256 => InfluencerData) public influencers;` → `mapping(uint256 => CampaignData) public campaigns;`
  - `event NFTMinted(address indexed influencer, ...)` → `event NFTMinted(address indexed creator, ...)`
  - `event Withdrawn(uint256 indexed tokenId, address indexed influencer, ...)` → `event Withdrawn(uint256 indexed tokenId, address indexed creator, ...)`
  - Constructor: `ERC721("InfluencerDonationNFT", "IDNFT")` → `ERC721("OrganisationDonationNFT", "ODNFT")`
  - Function `mintMyNFT` parameter `string memory _influencerName` → `string memory _creatorName`; require messages remain the same; body: `influencerName: _influencerName` → `creatorName: _creatorName`
  - All `influencers[tokenId]` references → `campaigns[tokenId]`
  - All `influencers[i]` references → `campaigns[i]`
  - Log in `emit NFTMinted(msg.sender, ...)` — no change needed, the indexed address arg is already `msg.sender`

  Files to create: `contracts/OrganisationDonationNFT.sol`
  Files to delete: `contracts/InfluencerDonationNFT.sol`

  Verify: `npx hardhat compile` — compiles with zero errors.

---

- [ ] 6. **Update `lib/contract.js` and `scripts/deploy.js` to match renamed contract**

  **`lib/contract.js`**:
  - Update `CONTRACT_ABI` string entries:
    - `"function mintMyNFT(uint8 _charity, uint256 _goalAmount, string _influencerName, string _profileImageUrl) external"` → `"function mintMyNFT(uint8 _charity, uint256 _goalAmount, string _creatorName, string _profileImageUrl) external"`
    - `"function influencers(uint256) external view returns (uint8 charity, uint256 totalDonations, uint256 goalAmount, bool active, address creator, string influencerName, string profileImageUrl)"` → `"function campaigns(uint256) external view returns (uint8 charity, uint256 totalDonations, uint256 goalAmount, bool active, address creator, string creatorName, string profileImageUrl)"`
    - `"event NFTMinted(address indexed influencer, uint256 indexed tokenId, uint8 charity, uint256 goalAmount)"` → `"event NFTMinted(address indexed creator, uint256 indexed tokenId, uint8 charity, uint256 goalAmount)"`
    - `"event Withdrawn(uint256 indexed tokenId, address indexed influencer, uint256 amount)"` → `"event Withdrawn(uint256 indexed tokenId, address indexed creator, uint256 amount)"`
  - Note: the ABI function name `mintMyNFT`, `donate`, `withdraw`, `getTotalNFTs`, `getCampaignsByCreator`, `ownerOf`, `getCharityType`, `getTotalDonations` do not change.

  After updating the ABI, update all call-sites in JS pages that use the old getter name `contract.influencers(i)` → `contract.campaigns(i)`:
  - `app/page.js`: `contract.influencers(i)` → `contract.campaigns(i)`
  - `app/dashboard/page.js`: `contract.influencers(tokenId)` → `contract.campaigns(tokenId)`
  - `app/campaign/[tokenId]/page.js`: `contract.influencers(tokenId)` → `contract.campaigns(tokenId)`

  **`scripts/deploy.js`**:
  - `const InfluencerDonationNFT = await hre.ethers.getContractFactory("InfluencerDonationNFT")` → `const OrganisationDonationNFT = await hre.ethers.getContractFactory("OrganisationDonationNFT")`
  - `const contract = await InfluencerDonationNFT.deploy()` → `const contract = await OrganisationDonationNFT.deploy()`
  - Log message `"Deploying InfluencerDonationNFT contract..."` → `"Deploying OrganisationDonationNFT contract..."`

  Files to modify: `lib/contract.js`, `scripts/deploy.js`, `app/page.js`, `app/dashboard/page.js`, `app/campaign/[tokenId]/page.js`

  Verify: `npx hardhat compile` — still compiles. `npx next build` — no ABI mismatch or undefined function errors.

---

- [ ] 7. **Update `package.json` name field**

  Change `"name": "donfan"` → `"name": "onegooddeed"` in `package.json`.

  Also update `package-lock.json`:
  - Line 2: `"name": "donfan"` → `"name": "onegooddeed"`
  - Line 8 (inside the packages entry): `"name": "donfan"` → `"name": "onegooddeed"`
  *(Note: `package-lock.json` is regenerated on `npm install`; edit it directly or re-run `npm install` after editing `package.json`.)*

  Files to modify: `package.json`, `package-lock.json`

  Verify: `node -e "const p = require('./package.json'); console.log(p.name)"` → prints `onegooddeed`.

---

- [ ] 8. **Rewrite `README.md`**

  Replace the entire `README.md` with a clean version for OneGoodDeed. Key changes:
  - Title: `# OneGoodDeed — Transparent Donation Platform`
  - Remove all `DonFan` occurrences in text, badge URLs, GitHub links
  - Remove all "influencer" framing; use "organisation" / "campaign creator"
  - Update clone URL to the new repo (use a placeholder like `https://github.com/your-org/onegooddeed.git` if the final URL is not yet decided)
  - Update project structure tree to reflect renamed files (`OneGoodDeedLogo.js`, `CampaignAvatar.js`, `OrganisationDonationNFT.sol`)
  - Update contract name and symbol in the "Smart Contract" section
  - Live demo URL: replace `https://don-fan.vercel.app` with placeholder `https://onegooddeed.vercel.app` (update when real URL is known)

  Files to modify: `README.md`

  Verify: `Select-String -Path README.md -Pattern "DonFan|donfan|Donfan|influencer"` — zero matches.

---

- [ ] 9. **Update `DEPLOYMENT.md`**

  Replace all occurrences of `InfluencerDonationNFT` → `OrganisationDonationNFT` and remove any "influencer" mentions in the deployment instructions. File path references to the contract file should change from `contracts/InfluencerDonationNFT.sol` → `contracts/OrganisationDonationNFT.sol`.

  Files to modify: `DEPLOYMENT.md`

  Verify: `Select-String -Path DEPLOYMENT.md -Pattern "DonFan|donfan|Donfan|influencer|Influencer"` — zero matches.

---

- [ ] 10. **Fix `ProgressStats.js` — remove stray rupee symbol**

  In `components/ProgressStats.js`, the `getMilestone()` function prefixes ETH amounts with `₹` (Indian rupee symbol), which is wrong. Remove the `₹` prefix from all milestone return strings, leaving only the ETH value and label.

  Example: `₹${remaining.toFixed(4)} ETH to complete the goal!` → `${remaining.toFixed(4)} ETH to complete the goal!`

  Files to modify: `components/ProgressStats.js`

  Verify: Visual inspection — no `₹` in file. `npx next build` still passes.

---

- [ ] 11. **Create `.env.example`**

  Create `d:\OneGoodDeed\.env.example` with all required variables and placeholder values only. Include all variables from `.env.local.example` plus the Hardhat variables from `hardhat.config.js` that are not currently documented:

  ```env
  # OneGoodDeed — Environment Variables
  # Copy this file to .env.local and fill in your values.
  # NEVER commit .env.local or any file containing real secrets.

  # ── Next.js / Frontend ──────────────────────────────────────────────
  # Deployed contract address on Sepolia testnet
  NEXT_PUBLIC_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000

  # Sepolia chain ID (informational; used by WalletConnectButton)
  NEXT_PUBLIC_SEPOLIA_CHAIN_ID=11155111

  # ── Hardhat / Contract Deployment ───────────────────────────────────
  # Infura or Alchemy RPC URL for Sepolia
  SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

  # Private key of the deployer wallet (no 0x prefix)
  # WARNING: never commit a real private key
  PRIVATE_KEY=0000000000000000000000000000000000000000000000000000000000000000
  ```

  Files to create: `.env.example`

  Verify: File exists and contains no real credentials. `Select-String -Path .env.example -Pattern "0x[0-9a-fA-F]{40}"` — the only address match should be the all-zeros placeholder.

---

- [ ] 12. **Update `.gitignore`**

  Replace the current `.gitignore` with a clean version that satisfies the EARS requirement (exclude `.env*` except `.env.example`, `node_modules/`, `.next/`, `out/`, `artifacts/`, `cache/`):

  ```gitignore
  # Dependencies
  node_modules/

  # Next.js build output
  .next/
  out/

  # Hardhat artifacts and cache
  artifacts/
  cache/

  # Environment files — never commit secrets
  .env*
  !.env.example

  # OS and editor noise
  .DS_Store
  *.log
  dist/
  build/
  ```

  The existing `.gitignore` already excludes most of these but does NOT have the `!.env.example` exception, and does NOT exclude `.env` (without `.local` suffix) explicitly. This update adds the exception and consolidates the list.

  Files to modify: `.gitignore`

  Verify: `git check-ignore -v .env.example` — should print nothing (not ignored). `git check-ignore -v .env.local` — should print `.gitignore:... .env*`.

---

- [ ] 13. **Run `npm run build` and confirm it passes**

  From `d:\OneGoodDeed`:
  ```
  npm run build
  ```

  Expected: Next.js build completes with `✓ Compiled successfully` and exit code 0. No TypeScript or lint errors that would block the build.

  If the build fails:
  - Missing module errors → check that all component renames were applied to every import site.
  - Type errors → fix the offending file.
  - Solidity errors are not a build concern (Next.js doesn't compile Solidity).

  Verify: exit code 0. The `.next/` directory is populated.

---

- [ ] 14. **Final grep — confirm zero DonFan / influencer references remain**

  Run these two checks from `d:\OneGoodDeed`:

  ```powershell
  # Check 1 — DonFan brand names
  Get-ChildItem -Path . -Recurse -Include "*.js","*.ts","*.json","*.md","*.sol","*.css" |
    Where-Object { $_.FullName -notmatch "node_modules|\.next|artifacts|cache|steering|\.agents" } |
    ForEach-Object { Select-String -Path $_.FullName -Pattern "DonFan|donfan|Donfan" }

  # Check 2 — influencer keyword (case-insensitive) in user-visible strings and identifiers
  Get-ChildItem -Path . -Recurse -Include "*.js","*.ts","*.json","*.md","*.sol","*.css" |
    Where-Object { $_.FullName -notmatch "node_modules|\.next|artifacts|cache|steering|\.agents" } |
    ForEach-Object { Select-String -Path $_.FullName -CaseSensitive:$false -Pattern "\binfluencer\b" }
  ```

  Expected: Both commands return zero matches. Any remaining hits must be fixed before the task is marked done.

  Note: `steering/` docs are excluded because they contain historical references used for documentation context only. `\.agents/` is excluded because `plan.md` and `design.md` necessarily mention the old names.

---

## Summary of files changed

| Action | File(s) |
|---|---|
| Create (rename from) | `components/OneGoodDeedLogo.js` (from `DonFanLogo.js`) |
| Create (rename from) | `components/CampaignAvatar.js` (from `InfluencerAvatar.js`) |
| Create (rename from) | `contracts/OrganisationDonationNFT.sol` (from `InfluencerDonationNFT.sol`) |
| Create | `.env.example` |
| Delete | `components/DonFanLogo.js` |
| Delete | `components/InfluencerAvatar.js` |
| Delete | `contracts/InfluencerDonationNFT.sol` |
| Modify | `app/layout.js` |
| Modify | `app/page.js` |
| Modify | `app/dashboard/page.js` |
| Modify | `app/campaign/[tokenId]/page.js` |
| Modify | `app/create-campaign/page.js` |
| Modify | `app/my-contributions/page.js` |
| Modify | `lib/contract.js` |
| Modify | `scripts/deploy.js` |
| Modify | `components/ProgressStats.js` |
| Modify | `package.json` |
| Modify | `package-lock.json` |
| Modify | `README.md` |
| Modify | `DEPLOYMENT.md` |
| Modify | `.gitignore` |
