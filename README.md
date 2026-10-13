# OneGoodDeed — Transparent Donation Platform

![OneGoodDeed](https://img.shields.io/badge/OneGoodDeed-Transparent%20Donations-10B981?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=flat-square&logo=next.js)
![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?style=flat-square&logo=solidity)
![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-3C3C3D?style=flat-square&logo=ethereum)

A transparent Web3 donation platform connecting verified organisations with donors to support charitable causes. Built on Ethereum blockchain with NFT-based campaign tracking.

## 🌟 Features

### For Donors
- **Browse Active Campaigns** - View all ongoing charitable campaigns
- **Transparent Donations** - Every donation is recorded on the blockchain
- **Real-time Progress** - Watch campaign progress with visual updates
- **Donation History** - Track all your contributions across campaigns
- **Mobile Support** - Full MetaMask mobile wallet integration

### For Campaign Creators
- **Create Campaigns** - Launch campaigns for different causes
- **Multiple Charity Types** - Support Housing, Meals, Medical, Education, Equipment, and River Cleaning
- **NFT Certificates** - Each campaign is an NFT with tamper-proof data
- **Profile Customisation** - Add your name and profile picture
- **Dashboard Analytics** - Track donations, donors, and campaign progress
- **Withdraw Funds** - Securely withdraw donations anytime

### Technical Features
- **Smart Contract** - Solidity-based ERC721 NFT contract
- **Web3 Integration** - Ethers.js for blockchain interactions
- **Responsive Design** - Works on desktop and mobile devices
- **Animated Visuals** - Interactive charity progress visualisations
- **Multiple RPC Fallbacks** - Reliable connection to Ethereum network

## 🚀 Live Demo

Visit the live application: [https://onegooddeed.vercel.app](https://onegooddeed.vercel.app)

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MetaMask** wallet ([Download](https://metamask.io/download/))
- **Sepolia ETH** for testing ([Get from faucet](https://sepoliafaucet.com/))

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/onegooddeed.git
cd onegooddeed
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your contract address:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address_here
NEXT_PUBLIC_SEPOLIA_CHAIN_ID=11155111
```

### 4. Deploy Smart Contract

#### Option A: Using Remix IDE (Recommended)

1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create a new file: `OrganisationDonationNFT.sol`
3. Copy the contract from `contracts/OrganisationDonationNFT.sol`
4. Compile with Solidity 0.8.20
5. Deploy to Sepolia testnet using MetaMask
6. Copy the deployed contract address

#### Option B: Using Hardhat

```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

### 5. Update Contract Address

Update `.env.local` with your deployed contract address:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddressHere
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Mobile Usage

### For Mobile Users:

1. **Install MetaMask Mobile App**
   - [iOS App Store](https://apps.apple.com/app/metamask/id1438144202)
   - [Google Play Store](https://play.google.com/store/apps/details?id=io.metamask)

2. **Access OneGoodDeed**
   - Open your mobile browser
   - Visit the OneGoodDeed website
   - Click "Connect Wallet"
   - App will automatically open MetaMask

3. **Connect & Donate**
   - Approve connection in MetaMask
   - Browse campaigns
   - Make donations securely

## 🏗️ Project Structure

```
onegooddeed/
├── app/                          # Next.js 14 app directory
│   ├── page.js                   # Home page with campaign list
│   ├── create-campaign/          # Campaign creation page
│   ├── campaign/[tokenId]/       # Individual campaign page
│   ├── dashboard/                # Creator dashboard
│   ├── my-contributions/         # Donor contribution history
│   ├── layout.js                 # Root layout with animations
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── CharityVisual/            # Animated charity visualisations
│   │   ├── HousingVisual.js
│   │   ├── MealsVisual.js
│   │   ├── MedicalVisual.js
│   │   ├── EducationVisual.js
│   │   └── RiverVisual.js
│   ├── DonationPanel.js          # Donation interface
│   ├── ProgressStats.js          # Campaign statistics
│   ├── WalletConnectButton.js    # Wallet connection
│   ├── CampaignAvatar.js         # Profile picture display
│   └── OneGoodDeedLogo.js        # Brand logo
├── contracts/                    # Smart contracts
│   └── OrganisationDonationNFT.sol  # Main NFT contract
├── lib/                          # Utilities
│   └── contract.js               # Contract ABI and helpers
├── scripts/                      # Deployment scripts
│   └── deploy.js                 # Hardhat deployment
├── .env.example                  # Environment template
├── DEPLOYMENT.md                 # Deployment guide
└── README.md                     # This file
```

## 🔧 Smart Contract

### Contract Details

- **Name**: `OrganisationDonationNFT`
- **Token Symbol**: `ODNFT`
- **Network**: Ethereum Sepolia Testnet
- **Standard**: ERC721 (NFT)
- **Compiler**: Solidity 0.8.20
- **Dependencies**: OpenZeppelin Contracts

### Key Functions

```solidity
// Create a new campaign
function mintMyNFT(
    CharityType _charity,
    uint256 _goalAmount,
    string memory _creatorName,
    string memory _profileImageUrl
) external

// Donate to a campaign
function donate(uint256 tokenId) external payable

// Withdraw campaign funds
function withdraw(uint256 tokenId) external

// Get campaign details
function campaigns(uint256 tokenId) external view returns (...)

// Get campaigns by creator
function getCampaignsByCreator(address creator) external view returns (uint256[])
```

### Charity Types

1. **Housing** - Shelter and housing support
2. **Meals** - Food and nutrition programs
3. **Medical** - Healthcare and medical aid
4. **Education** - Educational resources and scholarships
5. **Equipment** - Tools and equipment for communities
6. **RiverCleaning** - Environmental cleanup initiatives

## 🎨 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Ethers.js 6** - Ethereum library

### Blockchain
- **Solidity 0.8.20** - Smart contract language
- **OpenZeppelin** - Secure contract libraries
- **Hardhat** - Development environment
- **Ethereum Sepolia** - Test network

### Deployment
- **Vercel** - Frontend hosting
- **Remix IDE** - Contract deployment
- **IPFS** (optional) - Decentralised storage for images

## 🚢 Deployment

### Deploy Frontend to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial OneGoodDeed release"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Add environment variable: `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - Deploy

3. **Configure Domain** (Optional)
   - Add custom domain in Vercel settings
   - Update DNS records

### Deploy Smart Contract

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed contract deployment instructions.

## 🧪 Testing

### Test on Sepolia Testnet

1. **Get Test ETH**
   - Visit [Sepolia Faucet](https://sepoliafaucet.com/)
   - Enter your wallet address
   - Receive test ETH

2. **Create Test Campaign**
   - Connect wallet
   - Click "Create Campaign"
   - Fill in details
   - Submit transaction

3. **Make Test Donation**
   - Browse campaigns
   - Click "View & Donate"
   - Enter amount
   - Confirm transaction

## 📊 Features Roadmap

- [ ] Multi-chain support (Polygon, BSC)
- [ ] Campaign categories and filtering
- [ ] Social sharing integration
- [ ] Email notifications
- [ ] Campaign comments and updates
- [ ] Milestone-based fund release
- [ ] DAO governance for platform decisions
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔒 Security

### Smart Contract Security

- Uses OpenZeppelin's audited contracts
- ReentrancyGuard for withdrawal protection
- Access control for campaign management
- No admin privileges or backdoors

### Best Practices

- Never share your private keys
- Always verify contract addresses
- Test on testnet before mainnet
- Use hardware wallets for large amounts

## 📞 Support

### Get Help

- **Documentation**: Check [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Issues**: [GitHub Issues](https://github.com/your-org/onegooddeed/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/onegooddeed/discussions)

### Common Issues

**Q: Campaigns not loading on mobile?**
A: Click the "Retry Loading" button. Mobile networks may be slower.

**Q: MetaMask not connecting?**
A: Make sure you're on Sepolia network and have test ETH.

**Q: Transaction failed?**
A: Check you have enough ETH for gas fees and the campaign is active.

## 🙏 Acknowledgments

- [OpenZeppelin](https://openzeppelin.com/) - Smart contract libraries
- [Ethers.js](https://docs.ethers.org/) - Ethereum library
- [Next.js](https://nextjs.org/) - React framework
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [Vercel](https://vercel.com/) - Hosting platform

---

Made with ❤️ for transparent charitable giving

**OneGoodDeed** - Making a Difference Together 🌟
