# BaseProof Deployment Guide

This guide covers deploying BaseProof to production on Base Mainnet.

## Prerequisites

- Deployment wallet with BASE ETH (minimum 0.05 ETH recommended)
- BaseScan API key for contract verification
- Web3.Storage or Pinata account for IPFS
- Domain name (optional but recommended)
- Hosting platform account (Vercel, Netlify, or Fleek)

## Pre-Deployment Checklist

- [ ] Smart contract audited (for production)
- [ ] All tests passing (`npm run test`)
- [ ] Environment variables configured
- [ ] Commission wallets decided
- [ ] Gas price acceptable on Base
- [ ] Backup of deployment wallet private key
- [ ] BaseScan API key obtained

## Smart Contract Deployment

### Step 1: Final Configuration

Edit `.env` with production values:

```env
# Deployment Wallet
PRIVATE_KEY=your_secure_private_key

# Network
BASE_RPC_URL=https://mainnet.base.org

# Contract Verification
BASESCAN_API_KEY=your_basescan_api_key

# Platform Configuration
COMMISSION_WALLETS=0xWallet1,0xWallet2,0xWallet3
```

### Step 2: Review Deployment Parameters

Edit `contracts/scripts/deploy.ts` if needed:

```typescript
const certificationFee = ethers.parseEther("0.001"); // 0.001 ETH
const transferFee = ethers.parseEther("0.0005"); // 0.0005 ETH
const revocationCooldown = 30 * 24 * 60 * 60; // 30 days
const disputePeriod = 90 * 24 * 60 * 60; // 90 days
const challengeBond = ethers.parseEther("0.01"); // 0.01 ETH
```

### Step 3: Deploy Contract

```bash
cd contracts
npm run deploy
```

Expected output:
```
🚀 Deploying BaseProof to Base Mainnet...

📝 Deploying with account: 0x...
💰 Account balance: 0.05 ETH

⚙️  Configuration:
   Certification Fee: 0.001 ETH
   Transfer Fee: 0.0005 ETH
   Revocation Cooldown: 30 days
   Dispute Period: 90 days
   Challenge Bond: 0.01 ETH
   Commission Wallets: 0x..., 0x..., 0x...

📦 Deploying BaseProof contract...
✅ BaseProof deployed to: 0x1234567890abcdef...

🔍 Verifying deployment...
   Total Certificates: 0
   Certification Fee: 0.001 ETH

🎉 Deployment complete!

📋 Next steps:
   1. Update frontend .env with contract address:
      VITE_PROOF_CONTRACT_ADDRESS=0x1234567890abcdef...
   2. Verify contract on BaseScan
   3. Test certification
```

### Step 4: Save Contract Address

**IMPORTANT**: Save the deployed contract address!

Update `frontend/.env`:
```env
VITE_PROOF_CONTRACT_ADDRESS=0x1234567890abcdef...
```

### Step 5: Verify Contract on BaseScan

```bash
cd contracts
npx hardhat verify --network base <CONTRACT_ADDRESS> \
  "1000000000000000" \
  "500000000000000" \
  "2592000" \
  "7776000" \
  "10000000000000000" \
  "[\"0xWallet1\",\"0xWallet2\",\"0xWallet3\"]"
```

Replace:
- `<CONTRACT_ADDRESS>` with your deployed address
- Constructor parameters with your values (in wei/seconds)

Successful verification:
```
Successfully submitted source code for contract
contracts/BaseProof.sol:BaseProof at 0x...
for verification on the block explorer. Waiting for verification result...

Successfully verified contract BaseProof on Etherscan.
https://basescan.org/address/0x...#code
```

### Step 6: Test Deployed Contract

Test a certification:

```bash
# Using Hardhat console
cd contracts
npx hardhat console --network base

> const BaseProof = await ethers.getContractFactory("BaseProof")
> const contract = await BaseProof.attach("0xYourContractAddress")
> await contract.certificationFee()
// Should return: 1000000000000000n (0.001 ETH in wei)
```

## Frontend Deployment

### Step 1: Configure Environment

Create `frontend/.env.production`:

```env
# Contract
VITE_PROOF_CONTRACT_ADDRESS=0x...your_deployed_address

# Network
VITE_BASE_RPC_URL=https://mainnet.base.org
VITE_BASE_CHAIN_ID=8453
VITE_BASE_EXPLORER=https://basescan.org

# IPFS
VITE_WEB3_STORAGE_TOKEN=your_web3_storage_token
VITE_IPFS_GATEWAY=https://ipfs.io/ipfs/

# Platform
VITE_CERTIFICATION_FEE=0.001
VITE_TRANSFER_FEE=0.0005
VITE_ENABLE_ANALYTICS=true
```

### Step 2: Build Frontend

```bash
cd frontend
npm run build
```

This creates an optimized production build in `frontend/dist/`

### Step 3: Deploy to Vercel

#### Option A: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod
```

#### Option B: Vercel Git Integration

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add environment variables from `.env.production`
7. Click "Deploy"

### Step 4: Deploy to Netlify

#### Option A: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd frontend
netlify deploy --prod
```

#### Option B: Netlify UI

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site"
4. Choose "Import from Git"
5. Select your repository
6. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
7. Add environment variables
8. Click "Deploy site"

### Step 5: Deploy to Fleek (IPFS)

```bash
# Install Fleek CLI
npm install -g @fleek-platform/cli

# Login
fleek login

# Deploy
cd frontend
fleek site:deploy
```

### Step 6: Configure Custom Domain

#### For Vercel:
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

#### For Netlify:
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Update DNS records

## Post-Deployment

### 1. Verify Everything Works

Test all core features:

- [ ] Connect wallet
- [ ] Certify a document
- [ ] Verify a document
- [ ] View certificate details
- [ ] Transfer certificate
- [ ] Revoke certificate
- [ ] Download PDF certificate

### 2. Set Up Monitoring

Monitor your contract:

```bash
# Watch for events
npx hardhat run scripts/monitor.ts --network base
```

### 3. Set Up Analytics (Optional)

Add Google Analytics or Mixpanel:

```typescript
// In frontend/src/main.tsx
import ReactGA from 'react-ga4';

if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
  ReactGA.initialize('G-XXXXXXXXXX');
}
```

### 4. Security Hardening

Production checklist:

- [ ] Contract verified on BaseScan
- [ ] All admin functions secured
- [ ] Rate limiting implemented
- [ ] CORS configured correctly
- [ ] CSP headers set
- [ ] SSL/TLS enabled
- [ ] Environment variables secured
- [ ] No private keys in code

### 5. Update Documentation

Update README.md with:
- Live contract address
- Live website URL
- Updated screenshots
- Production statistics

## Maintenance

### Updating the Frontend

1. Make changes
2. Test locally
3. Build: `npm run build`
4. Deploy:
   ```bash
   vercel --prod
   # or
   netlify deploy --prod
   ```

### Updating Smart Contract

**Warning**: Smart contracts cannot be updated once deployed!

Options:
1. **Pause contract** (emergency): `contract.pause()`
2. **Deploy new version**: Deploy a new contract with fixes
3. **Migration**: Write migration contract to move data

### Emergency Procedures

#### Pause Contract
```bash
npx hardhat console --network base

> const BaseProof = await ethers.getContractFactory("BaseProof")
> const contract = await BaseProof.attach("0xYourContractAddress")
> await contract.pause()
```

#### Unpause Contract
```bash
> await contract.unpause()
```

#### Emergency Withdraw (if needed)
```bash
> await contract.emergencyWithdraw()
```

## Production Checklist

Before going live:

- [ ] Smart contract deployed to Base Mainnet
- [ ] Contract verified on BaseScan
- [ ] Frontend deployed to hosting platform
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] All environment variables set
- [ ] Test certification completed
- [ ] Monitoring set up
- [ ] Documentation updated
- [ ] Social media accounts created
- [ ] Marketing materials ready
- [ ] Support email configured

## Support & Resources

- Base Documentation: https://docs.base.org
- BaseScan: https://basescan.org
- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com

---

**Congratulations!** 🎉 BaseProof is now live on Base Mainnet!
