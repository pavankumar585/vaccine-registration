const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const header = req.headers["Authorization"].split(" ")[1];
  if (!header) return res.status(401).send("Access denied");

  try {
    const decoded = jwt.verify(header, process.env.jwtPrivateKey);
    req.user = decoded;

    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
}

module.exports = auth;
