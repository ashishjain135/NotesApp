import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { body, validationResult } from "express-validator";

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "infinity";

console.log("✅ Auth routes loaded");

// --------------------------------------------------
// POST /api/auth/register
// --------------------------------------------------
router.post(
  "/register",
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array().map(e => ({ param: e.param, msg: e.msg })) });
    }

    const { name, email, password } = req.body;

    try {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Email already used" });
      }

      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashed });

      // 🔥 JWT TOKEN
      const token = jwt.sign(
        { id: user._id },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (err) {
      console.error("Register error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

// --------------------------------------------------
// POST /api/auth/login
// --------------------------------------------------
router.post(
  "/login",
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password").exists().withMessage("Password is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array().map(e => ({ param: e.param, msg: e.msg })) });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const ok = await bcrypt.compare(password, user.password);
      if (!ok) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // 🔥 JWT TOKEN
      const token = jwt.sign(
        { id: user._id },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

// --------------------------------------------------
// GET /api/auth/me  (OPTIONAL)
// --------------------------------------------------
router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.json({ user: null });
  }

  try {
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id).select("name email");

    if (!user) return res.json({ user: null });
    return res.json({ user });
  } catch (err) {
    console.error("ME error:", err);
    return res.json({ user: null });
  }
});

// --------------------------------------------------
// POST /api/auth/logout
// --------------------------------------------------
router.post("/logout", (req, res) => {
  // frontend will just remove token
  return res.json({ ok: true });
});

export default router;
