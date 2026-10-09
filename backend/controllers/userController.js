const User = require("../models/User");

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

    const user = await User.create({
      address,
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

module.exports = { registerUser, returningUser };
