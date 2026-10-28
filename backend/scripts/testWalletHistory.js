require("dotenv").config();

const { fetchWalletHistory } = require("../services/transactionHistory");

async function main() {
  const address = process.argv[2];

  if (!address) {
    throw new Error(
      "Usage: node scripts/testWalletHistory.js <wallet-address>",
    );
  }

  console.log("Fetching history for:", address);

  const history = await fetchWalletHistory(address);

  console.log("\nWallet:", history.address);
  console.log("Transfers found:", history.transfers.length);

  console.log("\nLatest transfers:");

  console.dir(
    history.transfers.slice(0, 10).map((tx) => ({
      hash: tx.hash,
      category: tx.category,
      from: tx.from,
      to: tx.to,
      asset: tx.asset,
      value: tx.value,
      timestamp: tx.metadata?.blockTimestamp,
    })),
    { depth: null },
  );
}

main().catch((error) => {
  console.error("\nTest failed:", error.response?.data || error.message);

  process.exitCode = 1;
});
