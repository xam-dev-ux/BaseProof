# BaseProof Deployment Information

## Smart Contract Deployed ✅

**Network**: Base Mainnet  
**Contract Address**: `0x4e98A4D69aE565908A09F73562736d5637bafd42`  
**Deployer**: `0x8F058fE6b568D97f85d517Ac441b52B95722fDDe`  
**Deployment Date**: February 1, 2026  
**Transaction**: https://basescan.org/address/0x4e98A4D69aE565908A09F73562736d5637bafd42

## Configuration

- **Certification Fee**: 0.001 ETH (~$2.50)
- **Transfer Fee**: 0.0005 ETH (~$1.25)
- **Revocation Cooldown**: 30 days
- **Dispute Period**: 90 days
- **Challenge Bond**: 0.01 ETH
- **Commission Wallet**: 0x8f058fe6b568d97f85d517ac441b52b95722fdde

## Next Steps

### 1. Verify Contract on BaseScan

```bash
cd contracts
npx hardhat verify --network base 0x4e98A4D69aE565908A09F73562736d5637bafd42 \
  "1000000000000000" \
  "500000000000000" \
  "2592000" \
  "7776000" \
  "10000000000000000" \
  "[\"0x8f058fe6b568d97f85d517ac441b52b95722fdde\"]"
```

### 2. Deploy Frontend to Vercel

```bash
cd frontend
vercel --prod
```

The `.env` file has been updated with the contract address.

### 3. Update Manifest

After Vercel deployment, update `frontend/public/farcaster.json` with your production URL.

### 4. Test the Platform

Visit BaseScan to interact with the contract:
https://basescan.org/address/0x4e98A4D69aE565908A09F73562736d5637bafd42#writeContract

### 5. Index Base Mini App

1. Deploy frontend to production
2. Share URL in Farcaster feed
3. Verify at: https://warpcast.com/~/developers/miniapps

## Contract Functions Available

### Read Functions
- `getTotalCertificates()` - View total certificates
- `certificationFee()` - View certification fee
- `verifyDocument(bytes32)` - Verify any document
- `getCertificate(uint256)` - Get certificate details
- `getPlatformStats()` - View platform statistics

### Write Functions (Requires Wallet)
- `certifyDocument()` - Certify a new document
- `certifyBulk()` - Bulk certification
- `transferCertificate()` - Transfer ownership
- `revokeCertificate()` - Revoke a certificate
- `renewCertificate()` - Renew expired certificate

## Status

- ✅ Smart Contract Deployed
- ✅ Frontend .env Updated
- ⏳ Contract Verification (run command above)
- ⏳ Frontend Deployment
- ⏳ Base Mini App Indexing

## Support

- **Contract**: https://basescan.org/address/0x4e98A4D69aE565908A09F73562736d5637bafd42
- **GitHub**: https://github.com/xam-dev-ux/BaseProof
- **Docs**: See `/docs` folder

---

**Deployment Successful!** 🎉

Your BaseProof contract is now live on Base Mainnet!
