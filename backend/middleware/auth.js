


const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("AUTH HEADER:", authHeader);
  console.log("JWT_SECRET:", process.env.JWT_SECRET);

  if (!authHeader) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(" ")[1];
  console.log("TOKEN RECEIVED:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};
