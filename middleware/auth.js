const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");
  // check if theres a token
  if (!token) return res.status(401).send("Access denied, No token provided");

  // if the token is ok then...
  try {
    const decoded = jwt.verify(token, config.get("jwtKey"));
    req.user = decoded;
    next();
    // if the token is not ok
  } catch (ex) {
    res.status(400).send("Invalid token");
  }
};
