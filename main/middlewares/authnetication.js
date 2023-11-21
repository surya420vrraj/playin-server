const jwt = require("jsonwebtoken");
exports.authenticateToken = (req, res, next) => {
  let token = req.header("Authorization");
  if (!token) return res.status(401).send("Access denied.");

  token = token.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("err", err);
      return res.status(403).send("Invalid token.");
    }
    req.user = user;
    next();
  });
};
