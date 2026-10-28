const { createPublicClient, http } = require("viem");
const { baseSepolia } = require("viem/chains");

if (!process.env.RPC_URL) {
  throw new Error("RPC_URL is missing from .env");
}

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(process.env.BASE_SEPOLIA_RPC_URL),
});

module.exports = { publicClient };
