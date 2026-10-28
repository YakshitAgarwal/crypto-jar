const express = require("express");
const {
  registerUser,
  returningUser,
  getUserDetails,
} = require("../controllers/userController");
const {
  pendingRoundupTransactions,
  completeRoundupTransactions,
  getWalletHistory,
} = require("../controllers/transactionController");
const router = express.Router();

router.get("/health", (req, res) => {
  return res.json({ message: "All Well" });
});

router.route("/users").get(returningUser);
router.route("/users/register").post(registerUser);
router.route("/users/details").get(getUserDetails);
router.get("/users/details-test", (req, res) => {
  return res.json({
    message: "User details route works",
    address: req.query.address,
  });
});

router.route("/transactions/pending").get(pendingRoundupTransactions);
router.route("/transactions/complete").post(completeRoundupTransactions);
router.route("/transactions/history").get(getWalletHistory);

module.exports = router;
