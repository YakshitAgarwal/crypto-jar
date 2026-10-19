const mongoose = require("mongoose");
const {
  createPublicClient,
  http,
  parseAbi,
  parseUnits,
  decodeEventLog,
  getAddress,
} = require("viem");
const { baseSepolia } = require("viem/chains");

const Transaction = require("../models/Transaction");

const VAULT_ADDRESS = process.env.VAULT_ADDRESS;
const RPC_URL = process.env.RPC_URL;

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(RPC_URL),
});

const vaultAbi = parseAbi([
  "event Deposited(address indexed user, uint8 indexed vaultNumber, uint256 amount, uint256 shares)",
]);

const vaultNumbers = {
  LOW_RISK: 1,
  MEDIUM_RISK: 2,
  HIGH_RISK: 3,
};

const isValidAddress = (address) =>
  typeof address === "string" && /^0x[a-fA-F0-9]{40}$/.test(address);

const pendingRoundupTransactions = async (req, res) => {
  try {
    const { address } = req.query;

    if (!isValidAddress(address)) {
      return res.status(400).json({
        message: "A valid wallet address is required",
      });
    }

    const transaction = await Transaction.findOne({
      walletAddress: address.toLowerCase(),
      paymentStatus: "CONFIRMED",
      roundupStatus: "PENDING",
    }).sort({ createdAt: -1 });

    if (!transaction) {
      return res.status(200).json({
        exists: false,
        message: "No pending roundup found",
        transaction: null,
      });
    }

    return res.status(200).json({
      exists: true,
      message: "Pending roundup found",
      transaction,
    });
  } catch (error) {
    console.error("Error fetching pending roundup:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const completeRoundupTransactions = async (req, res) => {
  try {
    const { transactionId, roundupTxHash } = req.body;

    console.log("Backend received roundup hash:", roundupTxHash);
    console.log("Backend configured vault:", process.env.VAULT_ADDRESS);

    if (!transactionId || !roundupTxHash) {
      return res.status(400).json({
        message: "transactionId and roundupTxHash are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      return res.status(400).json({
        message: "Invalid transaction ID",
      });
    }

    if (!/^0x[a-fA-F0-9]{64}$/.test(roundupTxHash)) {
      return res.status(400).json({
        message: "Invalid roundup transaction hash",
      });
    }

    if (!VAULT_ADDRESS || !RPC_URL) {
      return res.status(500).json({
        message: "Blockchain configuration is missing",
      });
    }

    // Find the original payment's pending roundup.
    const pendingTransaction = await Transaction.findOne({
      _id: transactionId,
      paymentStatus: "CONFIRMED",
      roundupStatus: "PENDING",
      roundupTxHash: null,
      chainId: baseSepolia.id,
    });

    if (!pendingTransaction) {
      return res.status(404).json({
        message: "Pending roundup not found or already completed",
      });
    }

    const expectedVaultNumber = vaultNumbers[pendingTransaction.vaultType];

    if (!expectedVaultNumber) {
      return res.status(400).json({
        message: "Invalid vault type on pending transaction",
      });
    }

    // 1. Fetch the transaction and receipt.
    const [receipt, depositTx] = await Promise.all([
      publicClient.getTransactionReceipt({
        hash: roundupTxHash,
      }),
      publicClient.getTransaction({
        hash: roundupTxHash,
      }),
    ]);

    if (receipt.status !== "success") {
      return res.status(400).json({
        message: "Roundup deposit transaction failed",
      });
    }

    console.log("Verifying roundup transaction:", {
      hash: depositTx.hash,
      from: depositTx.from,
      to: depositTx.to,
      configuredVault: VAULT_ADDRESS,
      chainId: depositTx.chainId,
    });

    // The top-level transaction may target DelegationManager
    // when a delegated/smart-account execution flow is used.
    // Verify the actual CryptoJar vault event instead.

    // 2. Find the Deposited event emitted by our vault.
    let verifiedDeposit = null;

    for (const log of receipt.logs) {
      if (log.address.toLowerCase() !== VAULT_ADDRESS.toLowerCase()) {
        continue;
      }

      try {
        const decoded = decodeEventLog({
          abi: vaultAbi,
          data: log.data,
          topics: log.topics,
        });

        if (decoded.eventName !== "Deposited") {
          continue;
        }

        const { user, vaultNumber, amount } = decoded.args;

        if (
          getAddress(user) === getAddress(pendingTransaction.walletAddress) &&
          Number(vaultNumber) === expectedVaultNumber
        ) {
          verifiedDeposit = { user, vaultNumber, amount };
          break;
        }
      } catch {
        // Ignore logs that don't match the Deposited event ABI.
      }
    }

    if (!verifiedDeposit) {
      console.error("No matching vault deposit event:", {
        roundupTxHash,
        expectedWallet: pendingTransaction.walletAddress,
        expectedVaultNumber,
        vaultAddress: VAULT_ADDRESS,
      });

      return res.status(400).json({
        message: "No matching CryptoJar deposit event found",
      });
    }

    // 3. Verify the exact USDC amount.
    const expectedAmount = parseUnits(
      String(pendingTransaction.roundupAmount),
      6,
    );

    if (verifiedDeposit.amount !== expectedAmount) {
      return res.status(400).json({
        message: "Deposit amount does not match the pending roundup",
      });
    }

    console.log("Vault deposit event verified:", {
      user: verifiedDeposit.user,
      vaultNumber: Number(verifiedDeposit.vaultNumber),
      amount: verifiedDeposit.amount.toString(),
    });

    // Atomically complete only if it is still pending.
    // This prevents two concurrent requests from completing the same record.
    const completedTransaction = await Transaction.findOneAndUpdate(
      {
        _id: transactionId,
        paymentStatus: "CONFIRMED",
        roundupStatus: "PENDING",
        roundupTxHash: null,
        chainId: baseSepolia.id,
      },
      {
        $set: {
          roundupStatus: "COMPLETED",
          roundupTxHash,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!completedTransaction) {
      return res.status(409).json({
        message: "Roundup has already been completed or updated",
      });
    }

    return res.status(200).json({
      message: "Roundup completed successfully",
      transaction: completedTransaction,
    });
  } catch (error) {
    console.error("Error completing roundup:", error);

    if (
      error.name === "TransactionReceiptNotFoundError" ||
      error.name === "TransactionNotFoundError"
    ) {
      return res.status(409).json({
        message: "Roundup transaction is not yet available on-chain",
      });
    }

    return res.status(500).json({
      message: "Failed to complete roundup",
    });
  }
};

module.exports = {
  pendingRoundupTransactions,
  completeRoundupTransactions,
};
