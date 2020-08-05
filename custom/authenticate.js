const jwt = require("jsonwebtoken");
const config = require("../config");

exports.verifyToken = (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined" || bearerHeader !== null) {
      const bearer = bearerHeader.split(" ");

      const bearerToken = bearer[1];
      req.token = bearerToken;
      jwt.verify(bearerToken, config.tokenInfo.secreteKey);
      next();
    }
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized ", err });
  }
};
