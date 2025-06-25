import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware/auth.js";
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
  try {
    const { name, username, password, role, roll_no } = req.body;

    const user = new User({ name, username, password, role, roll_no });
    await user.save();

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  console.log(user, username, password);
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({ token, role: user.role });
});

router.get("/check", authMiddleware, (req, res) => {
  res.status(200).json({ message: "still logged in" });
});

export default router;
