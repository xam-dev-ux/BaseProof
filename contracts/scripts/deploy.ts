import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config({ path: "../.env" });

async function main() {
  console.log("🚀 Deploying BaseProof to Base Mainnet...\n");

  // Get deployer
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH\n");

  // Configuration
  const certificationFee = ethers.parseEther("0.001"); // 0.001 ETH
  const transferFee = ethers.parseEther("0.0005"); // 0.0005 ETH
  const revocationCooldown = 30 * 24 * 60 * 60; // 30 days in seconds
  const disputePeriod = 90 * 24 * 60 * 60; // 90 days in seconds
  const challengeBond = ethers.parseEther("0.01"); // 0.01 ETH

  // Commission wallets from environment or default to deployer
  let commissionWallets: string[];
  if (process.env.COMMISSION_WALLETS) {
    commissionWallets = process.env.COMMISSION_WALLETS.split(",").map(w => w.trim());
  } else {
    commissionWallets = [deployer.address];
  }

  console.log("⚙️  Configuration:");
  console.log("   Certification Fee:", ethers.formatEther(certificationFee), "ETH");
  console.log("   Transfer Fee:", ethers.formatEther(transferFee), "ETH");
  console.log("   Revocation Cooldown:", revocationCooldown / (24 * 60 * 60), "days");
  console.log("   Dispute Period:", disputePeriod / (24 * 60 * 60), "days");
  console.log("   Challenge Bond:", ethers.formatEther(challengeBond), "ETH");
  console.log("   Commission Wallets:", commissionWallets.join(", "));
  console.log("");

  // Deploy contract
  console.log("📦 Deploying BaseProof contract...");
  const BaseProof = await ethers.getContractFactory("BaseProof");
  const baseProof = await BaseProof.deploy(
    certificationFee,
    transferFee,
    revocationCooldown,
    disputePeriod,
    challengeBond,
    commissionWallets
  );

  await baseProof.waitForDeployment();
  const contractAddress = await baseProof.getAddress();

  console.log("✅ BaseProof deployed to:", contractAddress);
  console.log("");

  // Wait for contract to be fully deployed
  console.log("⏳ Waiting for contract confirmation...");
  console.log("   (Waiting 10 seconds for blockchain sync)");
  await new Promise(resolve => setTimeout(resolve, 10000));

  // Verify deployment
  console.log("🔍 Verifying deployment...");
  try {
    const totalCertificates = await baseProof.getTotalCertificates();
    const certFee = await baseProof.certificationFee();

    console.log("   Total Certificates:", totalCertificates.toString());
    console.log("   Certification Fee:", ethers.formatEther(certFee), "ETH");
  } catch (error) {
    console.log("   ⚠️  Could not verify immediately (blockchain sync delay)");
    console.log("   Contract deployed successfully - verify manually on BaseScan");
  }
  console.log("");

  // Save deployment info
  const deploymentInfo = {
    network: "base",
    contractAddress: contractAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    configuration: {
      certificationFee: ethers.formatEther(certificationFee),
      transferFee: ethers.formatEther(transferFee),
      revocationCooldown: revocationCooldown / (24 * 60 * 60) + " days",
      disputePeriod: disputePeriod / (24 * 60 * 60) + " days",
      challengeBond: ethers.formatEther(challengeBond),
      commissionWallets,
    },
  };

  console.log("📄 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  console.log("");

  console.log("🎉 Deployment complete!");
  console.log("");
  console.log("📋 Next steps:");
  console.log("   1. Update frontend .env with contract address:");
  console.log("      VITE_PROOF_CONTRACT_ADDRESS=" + contractAddress);
  console.log("   2. Verify contract on BaseScan:");
  console.log("      npx hardhat verify --network base " + contractAddress);
  console.log("   3. Test certification:");
  console.log("      Visit: https://basescan.org/address/" + contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
