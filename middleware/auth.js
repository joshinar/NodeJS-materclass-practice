const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function(req, res, next) {
  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization;
  }
  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorised to access the route" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decode);
    req.user = await User.findById(decode.id);
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Not authorised to access the route" });
  }
};
