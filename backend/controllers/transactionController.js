const Transaction = require("../models/Transaction");

const pendingRoundupTransactions = async (req, res) => {
  try {
    const { address } = req.query;

    if (!address) {
      return res.status(400).json({
        message: "Wallet address is required",
      });
    }

    // Get the user's latest confirmed payment, regardless of roundup status.
    const latestTransaction = await Transaction.findOne({
      walletAddress: address.toLowerCase(),
      paymentStatus: "CONFIRMED",
    }).sort({ createdAt: -1 });

    // No confirmed payments exist for this user.
    if (!latestTransaction) {
      return res.status(200).json({
        exists: false,
        message: "No confirmed transactions found",
        transaction: null,
      });
    }

    // Only offer a roundup for the latest payment.
    if (latestTransaction.roundupStatus !== "PENDING") {
      return res.status(200).json({
        exists: false,
        message: "Latest transaction has no pending roundup",
        transaction: null,
      });
    }

    return res.status(200).json({
      exists: true,
      message: "Pending roundup found for latest transaction",
      transaction: latestTransaction,
    });
  } catch (error) {
    console.error("Error fetching latest roundup:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// const createRoundupTransaction = async (req, res) => {
//   try {
//   } catch (error) {
//     console.log(error);
//   }
// };

module.exports = { pendingRoundupTransactions };
