# BaseProof Setup Guide

This guide will walk you through setting up BaseProof for local development.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ and npm
- **Git**
- **MetaMask** or another Web3 wallet
- **Base Mainnet ETH** for deployment and testing

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/baseproof.git
cd baseproof
```

### 2. Install Dependencies

Install all dependencies for both contracts and frontend:

```bash
npm run install:all
```

Or install them separately:

```bash
# Root dependencies
npm install

# Contract dependencies
cd contracts
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Configuration

#### Root `.env` File

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
# Contract Deployment
PRIVATE_KEY=your_private_key_here
BASE_RPC_URL=https://mainnet.base.org
BASESCAN_API_KEY=your_basescan_api_key

# Frontend
VITE_PROOF_CONTRACT_ADDRESS=0x...deployed_contract_address
VITE_BASE_RPC_URL=https://mainnet.base.org
VITE_BASE_CHAIN_ID=8453
VITE_BASE_EXPLORER=https://basescan.org

# IPFS (optional for now)
VITE_WEB3_STORAGE_TOKEN=your_web3_storage_token
VITE_IPFS_GATEWAY=https://ipfs.io/ipfs/

# Platform
VITE_CERTIFICATION_FEE=0.001
VITE_TRANSFER_FEE=0.0005

# Commission Wallets
COMMISSION_WALLETS=0x...,0x...,0x...
```

#### Frontend `.env` File

The frontend has its own `.env.example`:

```bash
cd frontend
cp .env.example .env
```

### 4. Compile Smart Contracts

Compile the BaseProof smart contract:

```bash
cd contracts
npm run compile
```

This will:
- Compile `BaseProof.sol`
- Generate TypeScript types in `typechain-types/`
- Create artifacts in `artifacts/`

### 5. Run Tests

Run the contract test suite:

```bash
cd contracts
npm run test
```

Expected output:
```
  BaseProof
    Deployment
      ✓ Should set the correct configuration
      ✓ Should set the correct owner
      ✓ Should have zero certificates initially
    Document Certification
      ✓ Should certify a document
      ✓ Should reject certification with insufficient fee
      ✓ Should reject duplicate document hash
      ...
```

### 6. Deploy to Local Network (Optional)

For local testing, start a Hardhat node:

```bash
# Terminal 1
cd contracts
npx hardhat node
```

Deploy to local network:

```bash
# Terminal 2
cd contracts
npm run deploy:local
```

### 7. Deploy to Base Mainnet

**Important**: Make sure you have BASE ETH in your deployment wallet!

```bash
cd contracts
npm run deploy
```

This will:
1. Deploy the BaseProof contract
2. Print the contract address
3. Save deployment info

**Copy the contract address** and update your frontend `.env`:

```env
VITE_PROOF_CONTRACT_ADDRESS=0x...your_deployed_address
```

### 8. Verify Contract on BaseScan

After deployment, verify your contract:

```bash
cd contracts
npx hardhat verify --network base <CONTRACT_ADDRESS> \
  "1000000000000000" \
  "500000000000000" \
  "2592000" \
  "7776000" \
  "10000000000000000" \
  "[\"0x...\",\"0x...\"]"
```

Replace the parameters with your deployment configuration.

### 9. Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:3000`

### 10. Connect MetaMask

1. Open MetaMask
2. Add Base network (if not already added):
   - Network Name: Base
   - RPC URL: https://mainnet.base.org
   - Chain ID: 8453
   - Currency Symbol: ETH
   - Block Explorer: https://basescan.org

3. Switch to Base network
4. Visit `http://localhost:3000`
5. Click "Connect Wallet"

## Development Workflow

### Making Changes to Smart Contract

1. Edit `contracts/contracts/BaseProof.sol`
2. Compile: `npm run compile`
3. Test: `npm run test`
4. Deploy: `npm run deploy`
5. Update frontend contract address

### Making Changes to Frontend

1. Edit files in `frontend/src/`
2. Changes hot-reload automatically
3. Build for production: `npm run build`

## Common Issues & Solutions

### Issue: "Cannot find module '@nomicfoundation/hardhat-toolbox'"

**Solution**: Install contract dependencies:
```bash
cd contracts
npm install
```

### Issue: "Contract not deployed"

**Solution**:
1. Check that you've deployed the contract
2. Verify the contract address in `.env`
3. Ensure you're on the correct network

### Issue: "Insufficient funds"

**Solution**:
1. Get Base ETH from a faucet (for testnet)
2. Bridge ETH to Base (for mainnet)
3. Ensure your wallet has enough for gas

### Issue: "Transaction failed"

**Solution**:
1. Check gas settings
2. Ensure contract is not paused
3. Verify you're sending correct fees
4. Check console for error messages

## Next Steps

- Read the [User Guide](./USER_GUIDE.md) to learn how to use BaseProof
- Review the [Deployment Guide](./DEPLOYMENT.md) for production deployment
- Check the [Contract API](./CONTRACT_API.md) for smart contract details

## Support

If you encounter issues:

1. Check the [Troubleshooting](#common-issues--solutions) section above
2. Search [GitHub Issues](https://github.com/yourusername/baseproof/issues)
3. Create a new issue with:
   - Your environment details
   - Steps to reproduce
   - Error messages
   - Expected vs actual behavior

---

Happy building! 🚀
