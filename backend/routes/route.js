const express = require("express");
const {
  registerUser,
  returningUser,
} = require("../controllers/userController");
const {
  pendingRoundupTransactions,
} = require("../controllers/transactionController");
const router = express.Router();

router.get("/health", (req, res) => {
  return res.json({ message: "All Well" });
});

router.route("/users").get(returningUser);
router.route("/users/register").post(registerUser);

router.route("/transactions/pending").get(pendingRoundupTransactions);

module.exports = router;
