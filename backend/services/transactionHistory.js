const axios = require("axios");
const { isAddress, getAddress } = require("viem");

const RPC_URL = process.env.RPC_URL;

const CATEGORIES = ["external", "erc20", "erc721", "erc1155"];

async function fetchTransfers(address, direction, category) {
  const transfers = [];
  let pageKey;

  do {
    const params = {
      fromBlock: "0x0",
      toBlock: "latest",
      category: [category],
      withMetadata: true,
      excludeZeroValue: false,
      maxCount: "0x3e8",
      [direction === "from" ? "fromAddress" : "toAddress"]: address,
    };

    if (pageKey) {
      params.pageKey = pageKey;
    }

    const response = await axios.post(RPC_URL, {
      jsonrpc: "2.0",
      id: 1,
      method: "alchemy_getAssetTransfers",
      params: [params],
    });

    if (response.data.error) {
      throw new Error(response.data.error.message);
    }

    const result = response.data.result;

    transfers.push(...(result.transfers || []));
    pageKey = result.pageKey;
  } while (pageKey);

  return transfers;
}

async function fetchWalletHistory(address) {
  if (!RPC_URL) {
    throw new Error("RPC_URL is missing from .env");
  }

  if (!isAddress(address)) {
    throw new Error("Invalid wallet address");
  }

  const wallet = getAddress(address);

  const requests = CATEGORIES.flatMap((category) => [
    fetchTransfers(wallet, "from", category),
    fetchTransfers(wallet, "to", category),
  ]);

  const results = await Promise.all(requests);

  const uniqueTransfers = new Map();

  for (const transfer of results.flat()) {
    const key = transfer.uniqueId
      ? `${transfer.hash}-${transfer.uniqueId}`
      : `${transfer.hash}-${transfer.category}-${transfer.from}-${transfer.to}-${transfer.value}`;

    uniqueTransfers.set(key, transfer);
  }

  const transfers = [...uniqueTransfers.values()].sort(
    (a, b) =>
      new Date(b.metadata?.blockTimestamp || 0).getTime() -
      new Date(a.metadata?.blockTimestamp || 0).getTime(),
  );

  return {
    address: wallet,
    transfers,
    counts: {
      transfers: transfers.length,
    },
  };
}

module.exports = { fetchWalletHistory };
