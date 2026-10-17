const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    eventId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // User who made the original payment
    walletAddress: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },

    // Original payment transaction on the blockchain
    txHash: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    // Optional purchase details
    description: {
      type: String,
      default: "Unknown purchase",
      trim: true,
    },

    // Merchant or recipient wallet
    recipientAddress: {
      type: String,
      lowercase: true,
      default: null,
    },

    // Original payment amount
    txAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Suggested savings amount
    roundupAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Selected roundup plan
    roundupPlan: {
      type: Number,
      enum: [1, 5, 10],
      required: true,
    },

    // Token and blockchain information
    tokenSymbol: {
      type: String,
      default: "USDC",
    },

    chainId: {
      type: Number,
      required: true,
    },

    // State of the original payment
    paymentStatus: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "FAILED"],
      default: "PENDING",
    },

    // State of the separate savings transaction
    roundupStatus: {
      type: String,
      enum: ["PENDING", "SAVED", "SKIPPED", "FAILED"],
      default: "PENDING",
    },

    // Transaction hash for the vault deposit
    roundupTxHash: {
      type: String,
      default: null,
      lowercase: true,
    },

    // Vault selected for the roundup
    vaultType: {
      type: String,
      enum: ["LOW_RISK", "MEDIUM_RISK", "HIGH_RISK"],
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Transaction", transactionSchema);
