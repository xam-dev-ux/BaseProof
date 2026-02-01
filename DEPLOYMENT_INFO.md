# BaseProof Deployment Information

## Smart Contract Deployed & Verified ✅

**Network**: Base Mainnet
**Contract Address**: `0x4e98A4D69aE565908A09F73562736d5637bafd42`
**Deployer**: `0x8F058fE6b568D97f85d517Ac441b52B95722fDDe`
**Deployment Date**: February 1, 2026
**Verification Status**: ✅ **VERIFIED**

### 🔗 Links

- **Contract Code**: https://basescan.org/address/0x4e98A4D69aE565908A09F73562736d5637bafd42#code
- **Read Contract**: https://basescan.org/address/0x4e98A4D69aE565908A09F73562736d5637bafd42#readContract
- **Write Contract**: https://basescan.org/address/0x4e98A4D69aE565908A09F73562736d5637bafd42#writeContract
- **Events**: https://basescan.org/address/0x4e98A4D69aE565908A09F73562736d5637bafd42#events

## Configuration

- **Certification Fee**: 0.001 ETH (~$2.50)
- **Transfer Fee**: 0.0005 ETH (~$1.25)
- **Revocation Cooldown**: 30 days (2,592,000 seconds)
- **Dispute Period**: 90 days (7,776,000 seconds)
- **Challenge Bond**: 0.01 ETH
- **Commission Wallet**: 0x8f058fe6b568d97f85d517ac441b52b95722fdde

## Compiler Details

- **Compiler**: Solidity 0.8.24
- **Optimization**: Enabled (200 runs)
- **EVM Version**: paris
- **License**: MIT

## Contract Functions

### Read Functions (Free - No Gas)

```solidity
// View total certificates
getTotalCertificates() → uint256

// View fees
certificationFee() → uint256
transferFee() → uint256
revocationCooldown() → uint256
disputePeriod() → uint256

// Verify any document
verifyDocument(bytes32 documentHash) → (bool exists, uint256 certificateId, ...)

// Get certificate details
getCertificate(uint256 certificateId) → Certificate

// Get statistics
getPlatformStats() → (uint256 totalCerts, uint256 totalIssuers, ...)
getIssuerStats(address issuer) → (uint256 totalIssued, ...)

// Check document existence
documentExists(bytes32 documentHash) → bool
getCertificateIdByHash(bytes32 documentHash) → uint256
```

### Write Functions (Requires ETH + Gas)

```solidity
// Certify documents
certifyDocument(...) → uint256 certificateId
certifyBulk(...) → uint256[] certificateIds

// Transfer ownership
transferCertificate(uint256 certificateId, address newOwner)
batchTransfer(uint256[] certificateIds, address newOwner)

// Revoke certificates
revokeCertificate(uint256 certificateId, string reasonIPFS)
batchRevoke(uint256[] certificateIds, string reasonIPFS)

// Renewal
renewCertificate(uint256 certificateId, uint256 newExpirationDate)

// Co-certification
addCoCertifier(uint256 certificateId, address coCertifier)
acceptCoCertification(uint256 certificateId)

// Challenge system
challengeCertificate(uint256 certificateId, string challengeIPFS)
```

## Events

```solidity
DocumentCertified(uint256 certificateId, bytes32 documentHash, address issuer, ...)
BulkCertification(address issuer, uint256[] certificateIds, uint256 totalCount, ...)
CertificateTransferred(uint256 certificateId, address previousOwner, address newOwner, ...)
CertificateRevoked(uint256 certificateId, address revokedBy, string reasonIPFS, ...)
CertificateRenewed(uint256 certificateId, address renewedBy, ...)
CoCertifierAdded(uint256 certificateId, address coCertifier, address addedBy)
CoCertifierAccepted(uint256 certificateId, address coCertifier)
```

## Next Steps

### 1. ✅ Smart Contract (COMPLETED)
- [x] Deployed to Base Mainnet
- [x] Verified on BaseScan
- [x] ABI publicly available
- [x] All tests passing (21/21)

### 2. ⏳ Frontend Deployment

```bash
cd frontend
vercel --prod
```

After deployment, update `frontend/public/farcaster.json` with production URL.

### 3. ⏳ Base Mini App Indexing

1. Deploy frontend to production
2. Update all URLs in farcaster.json
3. Share URL in Farcaster feed
4. Verify at: https://warpcast.com/~/developers/miniapps

### 4. ⏳ Testing & Launch

- Test certification on production
- Verify document verification works
- Test transfers and revocations
- Monitor events on BaseScan
- Announce launch

## Support & Resources

- **GitHub**: https://github.com/xam-dev-ux/BaseProof
- **Documentation**: See `/docs` folder
- **Contract**: https://basescan.org/address/0x4e98A4D69aE565908A09F73562736d5637bafd42

---

## 🎉 Status Summary

```
✅ Smart Contract: DEPLOYED & VERIFIED
✅ Base Mainnet: LIVE
✅ BaseScan: VERIFIED
✅ ABI: PUBLIC
✅ Source Code: VISIBLE
✅ Tests: 21/21 PASSING
⏳ Frontend: Ready to Deploy
⏳ Base Mini App: Ready to Index
```

---

**Deployment Successful!** 🛡️

BaseProof is live on Base Mainnet with verified source code!
