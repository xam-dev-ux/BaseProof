# BaseProof Project Structure

```
baseproof/
│
├── contracts/                          # Smart contract workspace
│   ├── contracts/
│   │   └── BaseProof.sol              # Main certification contract
│   ├── scripts/
│   │   └── deploy.ts                  # Deployment script
│   ├── test/
│   │   └── BaseProof.test.ts         # Comprehensive test suite
│   ├── hardhat.config.ts              # Hardhat configuration
│   ├── package.json                   # Contract dependencies
│   └── tsconfig.json                  # TypeScript config
│
├── frontend/                           # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   └── shared/
│   │   │       ├── Header.tsx         # Navigation header
│   │   │       └── Footer.tsx         # Footer component
│   │   ├── contracts/
│   │   │   └── BaseProofABI.ts       # Contract ABI
│   │   ├── hooks/
│   │   │   ├── useWallet.ts          # Wallet connection
│   │   │   ├── useContract.ts        # Contract instance
│   │   │   └── useCertificate.ts     # Certificate operations
│   │   ├── pages/
│   │   │   ├── Home.tsx              # Landing page
│   │   │   ├── Certify.tsx           # Certification page
│   │   │   ├── Verify.tsx            # Verification portal
│   │   │   ├── MyCertificates.tsx    # User dashboard
│   │   │   ├── CertificateDetail.tsx # Certificate details
│   │   │   └── Explorer.tsx          # Public explorer
│   │   ├── types/
│   │   │   └── index.ts              # TypeScript types
│   │   ├── utils/
│   │   │   ├── hash.ts               # SHA-256 hashing
│   │   │   ├── ipfs.ts               # IPFS utilities
│   │   │   ├── pdf.ts                # PDF generation
│   │   │   └── format.ts             # Formatting helpers
│   │   ├── App.tsx                   # Main app component
│   │   ├── main.tsx                  # App entry point
│   │   └── index.css                 # Global styles
│   ├── index.html                     # HTML template
│   ├── package.json                   # Frontend dependencies
│   ├── vite.config.ts                # Vite configuration
│   ├── tailwind.config.js            # TailwindCSS config
│   ├── postcss.config.js             # PostCSS config
│   └── tsconfig.json                 # TypeScript config
│
├── docs/                              # Documentation
│   ├── SETUP.md                      # Setup instructions
│   ├── DEPLOYMENT.md                 # Deployment guide
│   └── USER_GUIDE.md                 # User documentation
│
├── .env.example                      # Environment template
├── .gitignore                        # Git ignore rules
├── package.json                      # Root package file
├── install.sh                        # Installation script
├── README.md                         # Main documentation
└── PROJECT_STRUCTURE.md             # This file
```

## Key Files

### Smart Contract
- **BaseProof.sol** (800+ lines): Complete certification contract with all features
  - Document certification (single & bulk)
  - Transfer & revocation
  - Co-certification
  - Challenge system
  - Privacy controls
  - Statistics & queries

### Frontend Core
- **App.tsx**: Main application with routing
- **Home.tsx**: Landing page with stats
- **Certify.tsx**: Multi-step certification wizard
- **Verify.tsx**: Public verification portal
- **CertificateDetail.tsx**: Full certificate view
- **MyCertificates.tsx**: User dashboard

### Utilities
- **hash.ts**: Client-side SHA-256 computation
- **pdf.ts**: Certificate PDF generation with QR codes
- **ipfs.ts**: Metadata storage integration
- **format.ts**: Blockchain data formatting

### Hooks
- **useWallet.ts**: Web3 wallet connection & network management
- **useContract.ts**: Smart contract instance provider
- **useCertificate.ts**: All certificate operations (certify, verify, transfer, revoke)

## Technology Stack

- **Blockchain**: Base Mainnet, Solidity 0.8.24
- **Frontend**: React 18, TypeScript, Vite 5
- **Styling**: TailwindCSS 3
- **State**: React Query, Zustand
- **Web3**: Ethers.js v6
- **Build**: Hardhat, Vite
- **Testing**: Chai, Mocha

## Total Lines of Code

- Smart Contract: ~800 lines
- Frontend: ~2,500+ lines
- Tests: ~400 lines
- Documentation: ~1,500 lines
- **Total: ~5,200+ lines**

## Features Implemented

✅ Single & bulk document certification
✅ Public/private certificates
✅ Document verification portal
✅ Certificate ownership transfers
✅ Co-certification (multi-party)
✅ Certificate revocation
✅ Expiration & renewal
✅ Challenge system
✅ Transfer history tracking
✅ Platform statistics
✅ PDF certificate generation
✅ Client-side hashing
✅ IPFS metadata storage
✅ Responsive UI
✅ Wallet integration
✅ Gas optimization
✅ Security features
✅ Comprehensive documentation
