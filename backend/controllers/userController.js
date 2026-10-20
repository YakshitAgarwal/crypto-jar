const User = require("../models/User");
const Transaction = require("../models/Transaction");

const isValidAddress = (address) =>
  typeof address === "string" && /^0x[a-fA-F0-9]{40}$/.test(address);

const registerUser = async (req, res) => {
  try {
    const { address, name, email, riskPreference } = req.body;

    if (!address || !name || !email || !riskPreference) {
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }

    const userExists = await User.findOne({ address });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const normalizedAddress = address.toLowerCase();

    const user = await User.create({
      address: normalizedAddress,
      name,
      email,
      riskPreference,
    });

    return res.status(201).json({
      _id: user._id,
      address: user.address,
      name: user.name,
      email: user.email,
      riskPreference: user.riskPreference,
    });
  } catch (error) {
    console.error("Register user error:", error);

    return res.status(500).json({
      message: "Failed to register user",
    });
  }
};

const returningUser = async (req, res) => {
  try {
    const { address } = req.query;

    if (!address) {
      return res.status(400).json({
        message: "Wallet address is required",
      });
    }

    const userExists = await User.findOne({
      address: address,
    });

    if (userExists) {
      return res.status(200).json({
        exists: true,
        message: "Welcome back",
        name: userExists.name,
      });
    }

    return res.status(200).json({
      exists: false,
      message: "New user detected",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const { address } = req.query;

    if (!isValidAddress(address)) {
      return res.status(400).json({
        message: "A valid wallet address is required",
      });
    }

    const walletAddress = address.toLowerCase();

    // Fetch the user's preferred jar
    const user = await User.findOne({ address: walletAddress }).select(
      "riskPreference",
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Start of the current UTC calendar month
    const now = new Date();
    const startOfMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
    );

    // Calculate savings from completed roundups
    const [stats] = await Transaction.aggregate([
      {
        $match: {
          walletAddress,
          roundupStatus: "COMPLETED",
        },
      },
      {
        $group: {
          _id: null,

          totalAmountSaved: {
            $sum: { $ifNull: ["$roundupAmount", 0] },
          },

          totalRoundups: {
            $sum: 1,
          },

          amountSavedThisMonth: {
            $sum: {
              $cond: [
                { $gte: ["$createdAt", startOfMonth] },
                { $ifNull: ["$roundupAmount", 0] },
                0,
              ],
            },
          },
        },
      },
    ]);

    return res.status(200).json({
      message: "User details fetched successfully",
      data: {
        preferredJar: user.riskPreference,
        totalAmountSaved: stats?.totalAmountSaved ?? 0,
        totalRoundups: stats?.totalRoundups ?? 0,
        amountSavedThisMonth: stats?.amountSavedThisMonth ?? 0,
      },
    });
  } catch (error) {
    console.error("Error fetching user details:", error);

    return res.status(500).json({
      message: "Failed to fetch user details",
    });
  }
};

module.exports = { registerUser, returningUser, getUserDetails };
