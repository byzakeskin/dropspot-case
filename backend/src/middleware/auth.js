const jwt = require('jsonwebtoken');
const SECRET_KEY = "dropspot_secret_key";

module.exports = function(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if(!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if(err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};
