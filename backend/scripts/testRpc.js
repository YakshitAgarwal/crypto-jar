require("dotenv").config();

const { publicClient } = require("../config/blockchain");

async function main() {
  const [chainId, blockNumber] = await Promise.all([
    publicClient.getChainId(),
    publicClient.getBlockNumber(),
  ]);

  console.log("Chain ID:", chainId);
  console.log("Latest block:", blockNumber);

  if (chainId !== 84532) {
    throw new Error("Wrong network: expected Base Sepolia (84532)");
  }

  console.log("Alchemy RPC connected successfully!");
}

main().catch(console.error);
