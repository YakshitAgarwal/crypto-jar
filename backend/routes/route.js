const express = require("express");
const {
  registerUser,
  returningUser,
} = require("../controllers/userController");
const router = express.Router();

router.get("/health", (req, res) => {
  return res.json({ message: "All Well" });
});

router.route("/users").get(returningUser);
router.route("/users/register").post(registerUser);

module.exports = router;
