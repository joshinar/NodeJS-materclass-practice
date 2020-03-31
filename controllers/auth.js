const User = require("../models/User");
const sendEmail = require("../utils/sendemail");
const crypto = require("crypto");

// @desc : Register user
// @route : POST /api/v1/auth/register
// @access : public

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await new User(req.body).save();
    const token = user.getJwtToken();
    res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 900000),
        httpOnly: true
      })
      .json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
};

// @desc : Login user
// @route : POST /api/v1/auth/login
// @access : public

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: "invalid credentials" });
    } else {
      // check if pass matches
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, msg: "invalid credentials" });
      } else {
        const token = user.getJwtToken();
        res
          .status(200)
          .cookie("token", token, {
            expires: new Date(Date.now() + 900000),
            httpOnly: true
          })
          .json({ success: true, token });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
};

// @desc forgot password
// @route POST api/v1/auth/forgotpassword
// @access Public

exports.forgotpassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ msg: "No a/c found with that email" });
    }
    const resetToken = user.getResetPasswordToken();
    await user.save();

    // create reset URL
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/resetpassword/${resetToken}`;

    const message = `here is the link to reset the password \n ${resetUrl}`;
    try {
      await sendEmail({
        email: user.email,
        subject: "Password reset",
        message
      });
      return res.status(200).json({ success: true, data: "Email sent" });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      return res.status(400).json({ success: false, data: "Email not sent" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false });
  }
};

// @desc reset password
// @route PUT api/v1/auth/resetpassword/:resettoken
// @access Public

exports.resetPassword = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");
  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(404).json({ msg: "Invalid token" });
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    const token = user.getJwtToken();
    await sendEmail({
      email: user.email,
      subject: "Password reset",
      message: "Password has been reset succesfully"
    });
    return res
      .status(200)
      .json({ success: true, data: token, msg: "Password success mail sent" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false });
  }
};
