import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function requireAuth(req, res, next) {
  const token = req.cookies[process.env.COOKIE_NAME || "token"];
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
