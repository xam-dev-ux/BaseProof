# BaseProof User Guide

Welcome to BaseProof! This guide will show you how to certify, verify, and manage your documents on the blockchain.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Certifying Documents](#certifying-documents)
3. [Verifying Documents](#verifying-documents)
4. [Managing Certificates](#managing-certificates)
5. [Advanced Features](#advanced-features)
6. [FAQ](#faq)

## Getting Started

### What You'll Need

- **MetaMask or Web3 Wallet**: To interact with the blockchain
- **Base Network ETH**: For transaction fees (~0.001 ETH per certification)
- **Your Document**: Any file you want to certify

### Connecting Your Wallet

1. Visit [baseproof.xyz](https://baseproof.xyz) (or your deployment URL)
2. Click **"Connect Wallet"** in the top right
3. MetaMask will prompt you to:
   - Connect your account
   - Switch to Base network (if not already)
4. Approve the connection
5. You're ready to go!

## Certifying Documents

### Single Document Certification

#### Step 1: Upload Document

1. Click **"Certify"** in the navigation menu
2. Drag and drop your file, or click to browse
3. BaseProof computes the document's SHA-256 hash
4. **Your file never leaves your device!** Only the hash is used.

#### Step 2: Enter Details

Fill in the certificate information:

- **Title** (required): Name of your document
  - Example: "Patent Application for Widget X"
  - 3-200 characters

- **Description** (optional): Additional context
  - Example: "Novel invention for improving widget efficiency"

- **Category** (required): Choose the document type
  - Legal, IP, Creative, Academic, Business, etc.

- **Tags** (optional): Keywords for organization
  - Example: "patent, invention, 2026"
  - Maximum 5 tags, comma-separated

- **Privacy Setting** (required):
  - **Public**: Anyone can verify full details
    - Use for: Public art, open research, transparent contracts
  - **Private**: Only you see full details, others only see existence
    - Use for: Confidential contracts, private IP, personal documents

- **Co-Certifiers** (optional): Add addresses for multi-party docs
  - Example: "0x123..., 0x456..."
  - They must accept afterward

- **Expiration** (optional): Set certificate expiration
  - Use for: Annual licenses, temporary agreements

#### Step 3: Review & Pay

1. Review all details
2. Check the fee breakdown:
   - Certification Fee: 0.001 ETH (~$2.50)
   - Gas Fee: ~0.00006 ETH (~$0.15)
   - Total: ~$2.65
3. Check: "I confirm I have rights to certify this document"
4. Click **"Certify Document"**
5. Approve the transaction in MetaMask
6. Wait for confirmation (~2 seconds)

#### Success!

You'll see:
- Certificate ID (e.g., #12345)
- Transaction hash (link to BaseScan)
- Options to:
  - View certificate
  - Download PDF
  - Share
  - Certify another

### Bulk Certification

Save time and money by certifying multiple documents at once!

1. Click **"Certify"** → **"Switch to Bulk Mode"**
2. Upload multiple files (drag & drop folder)
3. Each file gets its hash computed
4. Set shared details (category, privacy, tags)
5. Or customize each document individually
6. Get automatic discounts:
   - 10-49 docs: 10% off
   - 50-99 docs: 20% off
   - 100+ docs: 30% off
7. Click **"Certify All X Documents"**
8. Approve one transaction for all

**Use Cases**:
- Photographers: Certify entire photo shoot
- Musicians: Timestamp album of songs
- Researchers: Certify batch of papers
- Businesses: Certify monthly invoices

## Verifying Documents

### Anyone Can Verify (No Wallet Needed!)

#### Method 1: Upload File

1. Go to **"Verify"** page
2. Click **"Upload File"** tab
3. Drag & drop the document
4. BaseProof computes hash and checks blockchain
5. See verification result instantly

#### Method 2: Paste Hash

1. Go to **"Verify"** page
2. Click **"Paste Hash"** tab
3. Enter the document's SHA-256 hash
4. Click **"Verify Document"**

### Verification Results

#### If Document is Certified (Public):

You'll see:
- ✅ **VERIFIED** banner
- Certificate ID
- Title
- Certified by (address)
- Current owner (if transferred)
- Certification date
- Status (Active/Expired/Revoked)
- Link to full certificate details

#### If Document is Certified (Private):

You'll see:
- 🔒 **CERTIFIED (PRIVATE)** notice
- Exists: YES
- Certified on: [Date]
- Details: Hidden
- Message: "Connect wallet if you're the owner"

#### If Document is NOT Certified:

You'll see:
- ❌ **NOT FOUND** message
- Suggestions:
  - Certify it now
  - Check if correct file
  - Try uploading again
- Button to certify the document

## Managing Certificates

### Viewing Your Certificates

1. Click **"My Certificates"**
2. See two sections:
   - **Issued by Me**: Certificates you created
   - **Owned by Me**: Certificates transferred to you
3. Filter and search:
   - By category
   - By status (Active/Expired/Revoked)
   - By public/private

### Certificate Details

Click any certificate to see:

- **Document Information**
  - Hash (with copy button)
  - Title, description
  - Original filename
  - Tags

- **Certification Details**
  - Certified by
  - Current owner
  - Certification date
  - Expiration (if any)
  - Renewal count

- **Co-Certifiers** (if any)
  - Accepted
  - Pending

- **Transfer History**
  - Full ownership chain
  - Previous owners
  - Transfer dates

### Downloading Certificate PDF

1. View certificate details
2. Click **"Download Certificate PDF"**
3. Get professional certificate with:
   - Certificate ID and title
   - Document hash
   - Certification details
   - QR code for verification
   - BaseProof branding

Perfect for:
- Attaching to legal documents
- Submitting to authorities
- Printing for records
- Sharing with third parties

## Advanced Features

### Transferring Ownership

Transfer a certificate to a new owner:

1. View certificate details (must be owner)
2. Click **"Transfer Certificate"**
3. Enter new owner's address
4. Review transfer fee (0.0005 ETH)
5. Click **"Transfer"**
6. Approve transaction
7. Ownership transfers immediately
8. Transfer recorded in history

**Use Cases**:
- NFT sales: Artist sells work to collector
- IP transfers: Company acquires patent
- Property sales: Transfer deed certificate
- Freelance delivery: Transfer copyright to client

### Revoking Certificates

Permanently revoke a certificate:

1. View certificate (must be issuer or owner)
2. Click **"Revoke Certificate"**
3. Enter reason for revocation
4. Confirm (WARNING: Cannot be undone!)
5. Approve transaction
6. Certificate marked as revoked

**When to Revoke**:
- Contract voided or cancelled
- Error in original certification
- Legal requirement
- Fraud detected

**Note**: 30-day cooldown after certification before non-owner can revoke

### Co-Certification

For multi-party documents:

#### Adding Co-Certifiers:

1. **At Certification**:
   - Add addresses in "Co-Certifiers" field
   - They're added as pending

2. **After Certification**:
   - View certificate (must be issuer)
   - Click "Add Co-Certifier"
   - Enter address
   - They must accept

#### Accepting Co-Certification:

1. Receive notification (or check certificates)
2. View certificate with pending invitation
3. Click **"Accept Co-Certification"**
4. Approve transaction
5. You're now a co-certifier!

**Co-Certifier Privileges**:
- View full details (even if private)
- Name appears on certificate
- Cannot transfer or revoke

### Renewing Expired Certificates

If your certificate has an expiration date:

1. View expired certificate (must be owner)
2. Click **"Renew Certificate"**
3. Set new expiration date
4. Pay renewal fee (same as certification)
5. Approve transaction
6. Certificate renewed!
7. Renewal count increments

## FAQ

### General

**Q: What is BaseProof?**
A: A decentralized platform for certifying documents with immutable blockchain timestamps.

**Q: Why use BaseProof?**
A: Get legally recognized proof of existence and ownership for any document, instantly and affordably.

**Q: How much does it cost?**
A: ~0.001 ETH (~$2.50) per certification, plus small gas fees (~$0.15).

### Privacy & Security

**Q: Is my document stored on the blockchain?**
A: No! Only the cryptographic hash is stored. Your document never leaves your device.

**Q: Can I make a certificate private?**
A: Yes! Private certificates hide details from everyone except you and co-certifiers.

**Q: Can I delete a certificate?**
A: No. Blockchain is immutable. But you can revoke certificates if needed.

**Q: What if I lose the original document?**
A: You can't recreate it from the hash. Keep backups! The hash proves existence but can't restore the file.

### Certification

**Q: Can I certify the same document twice?**
A: No. Each hash can only be certified once (prevents duplicates).

**Q: What file types are supported?**
A: All file types! PDF, DOCX, JPG, PNG, MP3, MP4, ZIP, etc.

**Q: Can I update a certified document?**
A: No. If the document changes, its hash changes. You'd need to certify the new version.

**Q: How long does certification take?**
A: ~2 seconds for blockchain confirmation. Instant hash computation.

### Verification

**Q: Can anyone verify my document?**
A: For public certificates: Yes, anyone with the document. For private: Only you see details.

**Q: Do I need a wallet to verify?**
A: No! Verification is free and doesn't require a wallet.

**Q: What happens if I upload a different file to verify?**
A: Different file = different hash = shows as "Not Found".

### Transfers & Ownership

**Q: Can I transfer a certificate?**
A: Yes! Current owner can transfer to any address for a small fee (0.0005 ETH).

**Q: Is transfer history recorded?**
A: Yes! Complete ownership chain is stored onchain permanently.

**Q: Can I transfer back?**
A: Yes! New owner can transfer back to you (or anyone else).

### Legal

**Q: Is this legally recognized?**
A: Blockchain timestamps are increasingly admissible in courts. Consult a lawyer for your jurisdiction.

**Q: Does this replace a notary?**
A: BaseProof provides technical timestamping, not legal notarization. For legal matters, consult an attorney.

**Q: What if someone certifies my work without permission?**
A: Use the challenge mechanism to dispute validity. Platform governance can revoke fraudulent certificates.

### Technical

**Q: What blockchain does this use?**
A: Base Mainnet (Ethereum L2).

**Q: What is a hash?**
A: A unique digital fingerprint of your document. Same document = same hash. 1-bit change = completely different hash.

**Q: Where is metadata stored?**
A: Extended metadata stored on IPFS. Core data onchain.

**Q: Can the contract be upgraded?**
A: No. Smart contracts are immutable once deployed.

## Support

Need help?

- **Documentation**: Read more in [SETUP.md](./SETUP.md) and [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Issues**: Report bugs on [GitHub](https://github.com/yourusername/baseproof/issues)
- **Discussions**: Ask questions in [Discussions](https://github.com/yourusername/baseproof/discussions)

---

**Happy Certifying!** 🛡️
