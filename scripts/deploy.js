// deploy.js - Script for deploying the SimpleToken contract to an Ethereum test network
const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying SimpleToken contract...");

  // Get the contract factory
  const SimpleToken = await ethers.getContractFactory("SimpleToken");

  // Deploy the contract with constructor arguments
  // name, symbol, decimals, initialSupply
  const simpleToken = await SimpleToken.deploy(
    "Simple Token", // Token name
    "SIM", // Token symbol
    18, // Decimals (standard is 18)
    1000000, // Initial supply (1 million tokens)
  );

  // Wait for the contract to be deployed
  await simpleToken.deployed();

  console.log("SimpleToken deployed to:", simpleToken.address);
  console.log("Token details:");
  console.log("  Name:", await simpleToken.name());
  console.log("  Symbol:", await simpleToken.symbol());
  console.log("  Decimals:", await simpleToken.decimals());
  console.log(
    "  Total Supply:",
    ethers.utils.formatEther(await simpleToken.totalSupply()),
  );

  // Log the transaction hash for reference
  console.log("Deployment transaction:", simpleToken.deployTransaction.hash);

  // Verify the contract on Etherscan (only for public test networks)
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("Waiting for block confirmations...");

    // Wait for 6 block confirmations
    await simpleToken.deployTransaction.wait(6);

    console.log("Verifying contract on Etherscan...");

    // Verify the contract on Etherscan
    await hre.run("verify:verify", {
      address: simpleToken.address,
      constructorArguments: ["Simple Token", "SIM", 18, 1000000],
    });

    console.log("Contract verified on Etherscan!");
  }
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
