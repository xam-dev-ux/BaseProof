import { expect } from "chai";
import { ethers } from "hardhat";
import { BaseProof } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("BaseProof", function () {
  let baseProof: BaseProof;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let commissionWallet: SignerWithAddress;

  const certificationFee = ethers.parseEther("0.001");
  const transferFee = ethers.parseEther("0.0005");
  const revocationCooldown = 30 * 24 * 60 * 60; // 30 days
  const disputePeriod = 90 * 24 * 60 * 60; // 90 days
  const challengeBond = ethers.parseEther("0.01");

  beforeEach(async function () {
    [owner, user1, user2, commissionWallet] = await ethers.getSigners();

    const BaseProof = await ethers.getContractFactory("BaseProof");
    baseProof = await BaseProof.deploy(
      certificationFee,
      transferFee,
      revocationCooldown,
      disputePeriod,
      challengeBond,
      [commissionWallet.address]
    );

    await baseProof.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct configuration", async function () {
      expect(await baseProof.certificationFee()).to.equal(certificationFee);
      expect(await baseProof.transferFee()).to.equal(transferFee);
      expect(await baseProof.revocationCooldown()).to.equal(revocationCooldown);
      expect(await baseProof.disputePeriod()).to.equal(disputePeriod);
    });

    it("Should set the correct owner", async function () {
      expect(await baseProof.owner()).to.equal(owner.address);
    });

    it("Should have zero certificates initially", async function () {
      expect(await baseProof.getTotalCertificates()).to.equal(0);
    });
  });

  describe("Document Certification", function () {
    const documentHash = ethers.keccak256(ethers.toUtf8Bytes("Test Document Content"));
    const title = "Test Patent Application";
    const category = 1; // INTELLECTUAL_PROPERTY
    const metadataIPFS = "QmTest123";
    const descriptionIPFS = "QmDesc123";
    const isPublic = true;
    const tags = ["patent", "invention", "2026"];

    it("Should certify a document", async function () {
      const tx = await baseProof.connect(user1).certifyDocument(
        documentHash,
        title,
        category,
        metadataIPFS,
        descriptionIPFS,
        isPublic,
        [], // no co-certifiers
        0, // no expiration
        tags,
        "patent.pdf",
        "pdf",
        { value: certificationFee }
      );

      await expect(tx)
        .to.emit(baseProof, "DocumentCertified")
        .withArgs(1, documentHash, user1.address, title, category, await ethers.provider.getBlockNumber(), isPublic);

      expect(await baseProof.getTotalCertificates()).to.equal(1);
    });

    it("Should reject certification with insufficient fee", async function () {
      await expect(
        baseProof.connect(user1).certifyDocument(
          documentHash,
          title,
          category,
          metadataIPFS,
          descriptionIPFS,
          isPublic,
          [],
          0,
          tags,
          "patent.pdf",
          "pdf",
          { value: ethers.parseEther("0.0001") }
        )
      ).to.be.revertedWithCustomError(baseProof, "InvalidFee");
    });

    it("Should reject duplicate document hash", async function () {
      await baseProof.connect(user1).certifyDocument(
        documentHash,
        title,
        category,
        metadataIPFS,
        descriptionIPFS,
        isPublic,
        [],
        0,
        tags,
        "patent.pdf",
        "pdf",
        { value: certificationFee }
      );

      await expect(
        baseProof.connect(user2).certifyDocument(
          documentHash,
          "Different Title",
          category,
          metadataIPFS,
          descriptionIPFS,
          isPublic,
          [],
          0,
          tags,
          "other.pdf",
          "pdf",
          { value: certificationFee }
        )
      ).to.be.revertedWithCustomError(baseProof, "HashAlreadyExists");
    });

    it("Should verify a certified document", async function () {
      await baseProof.connect(user1).certifyDocument(
        documentHash,
        title,
        category,
        metadataIPFS,
        descriptionIPFS,
        isPublic,
        [],
        0,
        tags,
        "patent.pdf",
        "pdf",
        { value: certificationFee }
      );

      const verification = await baseProof.verifyDocument(documentHash);
      expect(verification.exists).to.be.true;
      expect(verification.certificateId).to.equal(1);
      expect(verification.issuer).to.equal(user1.address);
      expect(verification.title).to.equal(title);
    });

    it("Should return false for non-existent document", async function () {
      const randomHash = ethers.keccak256(ethers.toUtf8Bytes("Non-existent"));
      const verification = await baseProof.verifyDocument(randomHash);
      expect(verification.exists).to.be.false;
    });
  });

  describe("Bulk Certification", function () {
    it("Should certify multiple documents with discount", async function () {
      const hashes = [];
      const titles = [];
      const categories = [];
      const metadataIPFSHashes = [];
      const descriptionIPFSHashes = [];

      for (let i = 0; i < 15; i++) {
        hashes.push(ethers.keccak256(ethers.toUtf8Bytes(`Document ${i}`)));
        titles.push(`Document Title ${i}`);
        categories.push(1); // INTELLECTUAL_PROPERTY
        metadataIPFSHashes.push(`QmMeta${i}`);
        descriptionIPFSHashes.push(`QmDesc${i}`);
      }

      // 15 documents = 10% discount
      const expectedFee = (certificationFee * BigInt(15) * BigInt(90)) / BigInt(100);

      const tx = await baseProof.connect(user1).certifyBulk(
        hashes,
        titles,
        categories,
        metadataIPFSHashes,
        descriptionIPFSHashes,
        true,
        ["bulk", "test"],
        { value: expectedFee }
      );

      await expect(tx).to.emit(baseProof, "BulkCertification");
      expect(await baseProof.getTotalCertificates()).to.equal(15);
    });
  });

  describe("Certificate Transfer", function () {
    let certificateId: number;
    const documentHash = ethers.keccak256(ethers.toUtf8Bytes("Transfer Test"));

    beforeEach(async function () {
      const tx = await baseProof.connect(user1).certifyDocument(
        documentHash,
        "Transfer Test",
        1,
        "QmMeta",
        "QmDesc",
        true,
        [],
        0,
        ["test"],
        "test.pdf",
        "pdf",
        { value: certificationFee }
      );

      certificateId = 1;
    });

    it("Should transfer certificate ownership", async function () {
      await expect(
        baseProof.connect(user1).transferCertificate(certificateId, user2.address, {
          value: transferFee,
        })
      )
        .to.emit(baseProof, "CertificateTransferred")
        .withArgs(certificateId, user1.address, user2.address, await ethers.provider.getBlockNumber());

      const cert = await baseProof.connect(user2).getCertificate(certificateId);
      expect(cert.owner).to.equal(user2.address);
    });

    it("Should reject transfer by non-owner", async function () {
      await expect(
        baseProof.connect(user2).transferCertificate(certificateId, user2.address, {
          value: transferFee,
        })
      ).to.be.revertedWithCustomError(baseProof, "NotAuthorized");
    });

    it("Should track transfer history", async function () {
      await baseProof.connect(user1).transferCertificate(certificateId, user2.address, {
        value: transferFee,
      });

      const history = await baseProof.getTransferHistory(certificateId);
      expect(history.length).to.equal(1);
      expect(history[0].from).to.equal(user1.address);
      expect(history[0].to).to.equal(user2.address);
    });
  });

  describe("Certificate Revocation", function () {
    let certificateId: number;

    beforeEach(async function () {
      const documentHash = ethers.keccak256(ethers.toUtf8Bytes("Revocation Test"));
      await baseProof.connect(user1).certifyDocument(
        documentHash,
        "Revocation Test",
        1,
        "QmMeta",
        "QmDesc",
        true,
        [],
        0,
        ["test"],
        "test.pdf",
        "pdf",
        { value: certificationFee }
      );
      certificateId = 1;
    });

    it("Should allow owner to revoke immediately", async function () {
      // Fast forward time past cooldown
      await ethers.provider.send("evm_increaseTime", [revocationCooldown + 1]);
      await ethers.provider.send("evm_mine", []);

      await expect(baseProof.connect(user1).revokeCertificate(certificateId, "QmReason"))
        .to.emit(baseProof, "CertificateRevoked")
        .withArgs(certificateId, user1.address, "QmReason", await ethers.provider.getBlockNumber());

      const cert = await baseProof.connect(user1).getCertificate(certificateId);
      expect(cert.isRevoked).to.be.true;
    });

    it("Should enforce cooldown period", async function () {
      await expect(
        baseProof.connect(user1).revokeCertificate(certificateId, "QmReason")
      ).to.be.revertedWithCustomError(baseProof, "RevocationCooldownNotMet");
    });
  });

  describe("Co-Certification", function () {
    let certificateId: number;

    beforeEach(async function () {
      const documentHash = ethers.keccak256(ethers.toUtf8Bytes("CoCert Test"));
      await baseProof.connect(user1).certifyDocument(
        documentHash,
        "CoCert Test",
        1,
        "QmMeta",
        "QmDesc",
        true,
        [user2.address],
        0,
        ["test"],
        "test.pdf",
        "pdf",
        { value: certificationFee }
      );
      certificateId = 1;
    });

    it("Should accept co-certification", async function () {
      await expect(baseProof.connect(user2).acceptCoCertification(certificateId))
        .to.emit(baseProof, "CoCertifierAccepted")
        .withArgs(certificateId, user2.address);

      const cert = await baseProof.connect(user1).getCertificate(certificateId);
      expect(cert.coCertifiers.length).to.equal(1);
      expect(cert.coCertifiers[0]).to.equal(user2.address);
    });

    it("Should allow adding co-certifier after creation", async function () {
      const [, , , newCoCert] = await ethers.getSigners();

      await expect(baseProof.connect(user1).addCoCertifier(certificateId, newCoCert.address))
        .to.emit(baseProof, "CoCertifierAdded")
        .withArgs(certificateId, newCoCert.address, user1.address);
    });
  });

  describe("Privacy", function () {
    let publicCertId: number;
    let privateCertId: number;

    beforeEach(async function () {
      // Public certificate
      await baseProof.connect(user1).certifyDocument(
        ethers.keccak256(ethers.toUtf8Bytes("Public Doc")),
        "Public Certificate",
        1,
        "QmMeta",
        "QmDesc",
        true,
        [],
        0,
        ["public"],
        "public.pdf",
        "pdf",
        { value: certificationFee }
      );
      publicCertId = 1;

      // Private certificate
      await baseProof.connect(user1).certifyDocument(
        ethers.keccak256(ethers.toUtf8Bytes("Private Doc")),
        "Private Certificate",
        1,
        "QmMeta",
        "QmDesc",
        false,
        [],
        0,
        ["private"],
        "private.pdf",
        "pdf",
        { value: certificationFee }
      );
      privateCertId = 2;
    });

    it("Should show full details for public certificates", async function () {
      const cert = await baseProof.connect(user2).getCertificate(publicCertId);
      expect(cert.title).to.equal("Public Certificate");
      expect(cert.issuer).to.equal(user1.address);
    });

    it("Should hide details for private certificates", async function () {
      const cert = await baseProof.connect(user2).getCertificate(privateCertId);
      expect(cert.title).to.equal("");
      expect(cert.issuer).to.equal(ethers.ZeroAddress);
      expect(cert.isPublic).to.be.false;
    });

    it("Should show full details to owner of private certificate", async function () {
      const cert = await baseProof.connect(user1).getCertificate(privateCertId);
      expect(cert.title).to.equal("Private Certificate");
      expect(cert.issuer).to.equal(user1.address);
    });
  });

  describe("Statistics", function () {
    it("Should track platform statistics", async function () {
      // Certify some documents
      for (let i = 0; i < 5; i++) {
        await baseProof.connect(user1).certifyDocument(
          ethers.keccak256(ethers.toUtf8Bytes(`Doc ${i}`)),
          `Title ${i}`,
          1,
          "QmMeta",
          "QmDesc",
          i % 2 === 0,
          [],
          0,
          ["test"],
          "test.pdf",
          "pdf",
          { value: certificationFee }
        );
      }

      const stats = await baseProof.getPlatformStats();
      expect(stats._totalCertificates).to.equal(5);
      expect(stats._totalIssuers).to.equal(1);
    });

    it("Should track issuer statistics", async function () {
      await baseProof.connect(user1).certifyDocument(
        ethers.keccak256(ethers.toUtf8Bytes("Doc1")),
        "Title 1",
        1,
        "QmMeta",
        "QmDesc",
        true,
        [],
        0,
        ["test"],
        "test.pdf",
        "pdf",
        { value: certificationFee }
      );

      const issuerStats = await baseProof.getIssuerStats(user1.address);
      expect(issuerStats.totalIssued).to.equal(1);
      expect(issuerStats.certificateIds.length).to.equal(1);
    });
  });
});
