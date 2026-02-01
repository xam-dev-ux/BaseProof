const hre = require("hardhat");

async function main() {
  console.log("Verifying BaseProof contract on BaseScan...\n");

  const contractAddress = "0x4e98A4D69aE565908A09F73562736d5637bafd42";
  
  const constructorArgs = [
    "1000000000000000",      // certificationFee: 0.001 ETH
    "500000000000000",       // transferFee: 0.0005 ETH
    "2592000",               // revocationCooldown: 30 days
    "7776000",               // disputePeriod: 90 days
    "10000000000000000",     // challengeBond: 0.01 ETH
    ["0x8f058fe6b568d97f85d517ac441b52b95722fdde"]  // commissionWallets
  ];

  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: constructorArgs,
    });
    
    console.log("\n✅ Contract verified successfully!");
    console.log("View at: https://basescan.org/address/" + contractAddress + "#code");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("\n✅ Contract already verified!");
      console.log("View at: https://basescan.org/address/" + contractAddress + "#code");
    } else {
      console.error("\n❌ Verification failed:");
      console.error(error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
