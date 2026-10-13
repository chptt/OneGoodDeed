# Deployment Guide

## Prerequisites
- MetaMask installed and configured
- Sepolia testnet ETH (get from faucet: https://sepoliafaucet.com/)
- Node.js and npm installed

## Method 1: Deploy Using Remix (Recommended for Beginners)

### Step 1: Prepare the Contract
1. Go to https://remix.ethereum.org/
2. Create a new file: `OrganisationDonationNFT.sol`
3. Copy the entire content from `contracts/OrganisationDonationNFT.sol`
4. Paste it into Remix

### Step 2: Install Dependencies
The contract uses OpenZeppelin. In Remix:
1. The imports will automatically resolve from GitHub
2. Or manually add: `@openzeppelin/contracts@4.9.0` in the plugin manager

### Step 3: Compile
1. Go to "Solidity Compiler" tab (left sidebar)
2. Select compiler version: `0.8.20`
3. Click "Compile OrganisationDonationNFT.sol"
4. Ensure no errors

### Step 4: Deploy
1. Go to "Deploy & Run Transactions" tab
2. Environment: Select "Injected Provider - MetaMask"
3. MetaMask will popup - make sure you're on Sepolia network
4. Contract: Select "OrganisationDonationNFT"
5. Click "Deploy" (orange button)
6. Confirm transaction in MetaMask
7. Wait for confirmation

### Step 5: Copy Contract Address
1. After deployment, you'll see the contract under "Deployed Contracts"
2. Click the copy icon next to the contract address
3. It will look like: `0x1234567890abcdef1234567890abcdef12345678`

### Step 6: Update Your App
1. Open `.env.local` in your project
2. Replace the contract address:
   ```
   NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_DEPLOYED_CONTRACT_ADDRESS
   ```
3. Save the file
4. Restart your dev server:
   ```bash
   npm run dev
   ```

## Method 2: Deploy Using Hardhat (Advanced)

### Step 1: Install Hardhat
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts
```

### Step 2: Configure Hardhat
Create or update `hardhat.config.js`:
```javascript
require("@nomicfoundation/hardhat-toolbox");

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 11155111,
    },
  },
};
```

### Step 3: Set Environment Variables
Copy `.env.example` to `.env.local` and fill in:
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_wallet_private_key_without_0x_prefix
```

### Step 4: Compile and Deploy
```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

### Step 5: Update .env.local
Copy the deployed address and update `.env.local`:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedAddressHere
```

## Verification

After deployment, verify your contract works:
1. Go to https://sepolia.etherscan.io/
2. Search for your contract address
3. You should see the `OrganisationDonationNFT` contract and transactions

## Get Sepolia ETH

You need Sepolia ETH for:
- Deploying the contract (~0.01 ETH)
- Creating campaigns (~0.001 ETH)
- Making donations (any amount)

Faucets:
- https://sepoliafaucet.com/
- https://www.infura.io/faucet/sepolia
- https://faucet.quicknode.com/ethereum/sepolia

## Troubleshooting

**"Insufficient funds"**
- Get more Sepolia ETH from faucets

**"Contract not found"**
- Make sure you updated `.env.local` with correct address
- Restart dev server after updating

**"Network mismatch"**
- Switch MetaMask to Sepolia network
- Chain ID should be 11155111

**"Transaction failed"**
- Check you have enough Sepolia ETH
- Verify contract is deployed correctly
- Check Etherscan for error details
