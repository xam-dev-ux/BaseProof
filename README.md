# BaseProof - Document Certification & Timestamping

![BaseProof Logo](https://img.shields.io/badge/BaseProof-v1.0.0-blue)
![Blockchain](https://img.shields.io/badge/Blockchain-Base%20Mainnet-green)
![Solidity](https://img.shields.io/badge/Solidity-0.8.24-orange)
![React](https://img.shields.io/badge/React-18.2-blue)

**BaseProof** is a decentralized document certification and timestamping platform built on Base Mainnet. It allows anyone to certify documents, contracts, intellectual property, and creative works with immutable onchain proof of existence and ownership at a specific point in time.

## Features

### Smart Contract
- ✅ **Document Certification**: Single and bulk certification with SHA-256 hashing
- ✅ **Privacy Controls**: Public/Private certificates with granular access
- ✅ **Ownership Transfer**: Transfer certificates with full provenance tracking
- ✅ **Co-Certification**: Multi-party document signing
- ✅ **Revocation System**: Controlled revocation with cooldown period
- ✅ **Expiration & Renewal**: Time-limited certificates with renewal capability
- ✅ **Challenge Mechanism**: Community-policed certificate validity
- ✅ **Bulk Discounts**: Up to 30% off for bulk certifications
- ✅ **Gas Optimized**: Efficient storage and computation

### Frontend
- ✅ **Client-Side Hashing**: Documents never leave your device
- ✅ **Wallet Integration**: MetaMask and Web3 wallet support
- ✅ **Beautiful UI**: Professional design with TailwindCSS
- ✅ **PDF Certificates**: Download verification certificates
- ✅ **Real-Time Stats**: Live blockchain data
- ✅ **Responsive Design**: Mobile-friendly interface

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- Base Mainnet ETH for gas fees

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/baseproof.git
cd baseproof
```

2. **Install dependencies**
```bash
npm run install:all
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Deploy smart contract** (if needed)
```bash
cd contracts
npm run deploy
```

5. **Start frontend**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` to use BaseProof!

## Project Structure

```
baseproof/
├── contracts/              # Smart contracts (Hardhat)
│   ├── contracts/
│   │   └── BaseProof.sol  # Main contract
│   ├── scripts/
│   │   └── deploy.ts      # Deployment script
│   └── test/              # Contract tests
├── frontend/              # React frontend (Vite)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utilities
│   │   └── contracts/     # Contract ABI
│   └── public/
└── docs/                  # Documentation
```

## How It Works

### 1. Upload & Hash
Upload your document. BaseProof computes its unique SHA-256 fingerprint (hash). **Your document never leaves your device** - only the hash is stored onchain.

### 2. Certify Onchain
Pay a small fee (~0.001 ETH). Get an immutable timestamp and certificate on the Base blockchain. Choose public (anyone can verify) or private (only you can access details).

### 3. Verify Anytime
Anyone with the document can verify its certification. Prove who certified it, when, and if it's been altered since.

## Use Cases

- **Legal Contracts**: Timestamp agreements with irrefutable proof
- **Creative Works**: Prove authorship of art, music, writing
- **Patents & IP**: Establish prior art and invention dates
- **Academic Credentials**: Verify diplomas and certificates instantly
- **Business Documents**: Certify invoices, receipts, NDAs
- **Property Deeds**: Immutable proof of real estate ownership

## Smart Contract Details

### Deployment
- **Network**: Base Mainnet (Chain ID: 8453)
- **Contract**: `BaseProof.sol`
- **Compiler**: Solidity 0.8.24
- **License**: MIT

### Fees
- Certification: 0.001 ETH per document
- Transfer: 0.0005 ETH per transfer
- Bulk Discounts:
  - 10-49 docs: 10% off
  - 50-99 docs: 20% off
  - 100+ docs: 30% off

### Gas Costs (Estimated)
- Certify single: ~60,000 gas (~$0.08-0.10)
- Certify bulk (10): ~400,000 gas (~$0.05-0.06 per doc)
- Transfer: ~40,000 gas (~$0.05-0.06)
- Verify: FREE (view function)

## Security

- **ReentrancyGuard**: Protection against reentrancy attacks
- **Ownable2Step**: Secure ownership transfer
- **Pausable**: Emergency stop mechanism
- **Input Validation**: All user inputs validated
- **No Loops**: No unbounded array iterations
- **Hash Uniqueness**: Same document cannot be certified twice

## Development

### Running Tests
```bash
cd contracts
npm run test
```

### Deploy to Base Mainnet
```bash
cd contracts
npm run deploy
```

### Build Frontend
```bash
cd frontend
npm run build
```

## Documentation

- [Setup Guide](./docs/SETUP.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [User Guide](./docs/USER_GUIDE.md)
- [Smart Contract API](./docs/CONTRACT_API.md)

## Technology Stack

### Smart Contracts
- Solidity 0.8.24
- Hardhat
- OpenZeppelin Contracts
- Ethers.js v6

### Frontend
- React 18
- TypeScript
- Vite 5
- TailwindCSS 3
- React Router v6
- Zustand (state)
- React Query (caching)
- Ethers.js v6 (blockchain)
- Framer Motion (animations)
- jsPDF (PDF generation)

### Blockchain
- Base Mainnet
- IPFS (metadata storage)

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- Documentation: [docs/](./docs/)
- Issues: [GitHub Issues](https://github.com/yourusername/baseproof/issues)
- Discussions: [GitHub Discussions](https://github.com/yourusername/baseproof/discussions)

## Acknowledgments

- Built on [Base](https://base.org) - Ethereum L2
- Smart contracts secured by [OpenZeppelin](https://openzeppelin.com)
- Metadata stored on [IPFS](https://ipfs.io)

---

**Prove It. Protect It. Forever.** 🛡️

Made with ❤️ for the Base ecosystem
