const {
  createPublicClient,
  http,
  parseAbi,
  formatUnits,
  getAddress,
} = require("viem");

const { getIO } = require("../config/socket");

const { baseSepolia } = require("viem/chains");

const User = require("../models/User");
const Transaction = require("../models/Transaction");

const USDC_ADDRESS = process.env.USDC_ADDRESS;

if (!process.env.RPC_URL || !USDC_ADDRESS) {
  throw new Error("RPC_URL and USDC_ADDRESS must be configured");
}

const usdcAddress = getAddress(USDC_ADDRESS);

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(process.env.RPC_URL),
});

const usdcAbi = parseAbi([
  "event Transfer(address indexed from, address indexed to, uint256 value)",
]);

const JAR_CONFIG = {
  LOW: {
    roundupPlan: 1,
    vaultType: "LOW_RISK",
  },
  MEDIUM: {
    roundupPlan: 5,
    vaultType: "MEDIUM_RISK",
  },
  HIGH: {
    roundupPlan: 10,
    vaultType: "HIGH_RISK",
  },
};

function calculateRoundup(amount, plan) {
  // USDC uses 6 decimals.
  const unit = BigInt(plan) * 1_000_000n;
  const remainder = amount % unit;

  return remainder === 0n ? 0n : unit - remainder;
}

async function handleTransfer(log) {
  try {
    const { from, to, value } = log.args;

    if (!from || !to || value === undefined) return;
    if (!log.transactionHash || log.logIndex === undefined) return;

    const sender = from.toLowerCase();
    const recipient = to.toLowerCase();

    // Ignore transfers into your CryptoJar vault, if configured.
    if (
      process.env.VAULT_ADDRESS &&
      recipient === process.env.VAULT_ADDRESS.toLowerCase()
    ) {
      return;
    }

    // Only track outgoing transfers from registered users.
    const user = await User.findOne({ address: sender });

    if (!user) return;

    const config = JAR_CONFIG[user.riskPreference];

    if (!config) {
      console.warn("Invalid risk preference for:", sender);
      return;
    }

    const { roundupPlan: plan, vaultType } = config;

    if (![1, 5, 10].includes(plan) || !vaultType) {
      console.warn("Invalid roundup settings for:", sender);
      return;
    }

    // Ensure the transaction succeeded.
    const receipt = await publicClient.getTransactionReceipt({
      hash: log.transactionHash,
    });

    if (receipt.status !== "success") return;

    // Prevent processing the same event twice.
    // A transaction can contain multiple Transfer events, so include logIndex.
    const eventId = `${baseSepolia.id}-${log.transactionHash}-${log.logIndex}`;

    const existing = await Transaction.findOne({ eventId });

    if (existing) return;

    const roundup = calculateRoundup(value, plan);

    const transaction = await Transaction.create({
      userId: user._id,
      eventId,
      walletAddress: sender,
      txHash: log.transactionHash,
      recipientAddress: recipient,
      txAmount: Number(formatUnits(value, 6)),
      roundupAmount: Number(formatUnits(roundup, 6)),
      roundupPlan: plan,
      tokenSymbol: "USDC",
      chainId: baseSepolia.id,
      paymentStatus: "CONFIRMED",
      roundupStatus: roundup === 0n ? "SKIPPED" : "PENDING",
      vaultType,
    });

    console.log("USDC transfer detected:", {
      wallet: sender,
      amount: transaction.txAmount,
      roundupAmount: transaction.roundupAmount,
      status: transaction.roundupStatus,
      txHash: transaction.txHash,
    });

    if (roundup > 0n) {
      getIO().to(`wallet:${sender}`).emit("roundup:pending", {
        transactionId: transaction._id.toString(),
        txHash: transaction.txHash,
        txAmount: transaction.txAmount,
        roundupAmount: transaction.roundupAmount,
        vaultType: transaction.vaultType,
        chainId: transaction.chainId,
      });
    }
  } catch (error) {
    console.error("Error processing USDC transfer:", error);
  }
}

function startTransactionMonitor() {
  console.log("Monitoring Base Sepolia USDC:", usdcAddress);

  return publicClient.watchContractEvent({
    address: usdcAddress,
    abi: usdcAbi,
    eventName: "Transfer",
    pollingInterval: 4_000,

    onLogs: (logs) => {
      for (const log of logs) {
        void handleTransfer(log);
      }
    },

    onError: (error) => {
      console.error("USDC monitor error:", error);
    },
  });
}

module.exports = { startTransactionMonitor };
