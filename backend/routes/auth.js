import express from "express";
import models from "../models/index.js";
import bcrypt from "bcrypt";

const router = express.Router();

const userTypes = [
  { model: models.Student, role: "student" },
  { model: models.Teacher, role: "teacher" },
  { model: models.Admin, role: "admin" },
];

router.post("/login", async (req, res) => {
  const { username, password, role } = req.body;
  const userType = userTypes.find((u) => u.role === role);
  if (!userType) return res.status(400).json({ error: "Invalid role" });

  const user = await userType.model.findOne(
    role === "student" ? { roll_no: username } : { username }
  );
  if (!user) return res.status(400).json({ error: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: "Invalid password" });

  req.session.user = { id: user._id, role, name: user.name };
  res.json({ message: "Login successful", user: req.session.user });
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out" });
});

export default router;
