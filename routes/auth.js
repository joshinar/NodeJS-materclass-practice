const express = require("express");
const router = express.Router();
const {
  register,
  login,
  forgotpassword,
  resetPassword
} = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/forgotpassword", forgotpassword);
router.put("/resetpassword/:resetToken", resetPassword);

module.exports = router;
