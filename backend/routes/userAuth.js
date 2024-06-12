const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    res.status(401).json({ message: "Authentication token required" });
  }

  jwt.verify(token, "bookstore123", (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Token expired. Please Sign-in again" });
    }
    req.user = user;
    next();
  });
};

module.exports = authentication;
