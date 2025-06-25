import express from "express";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import Lab from "../models/Lab.js";
import OSModule from "../models/OSModule.js";
const router = express.Router();

// Get labs taught by teacher
router.get(
  "/labs",
  authMiddleware,
  requireRole("teacher"),
  async (req, res) => {
    const labs = await Lab.find({ teachers: req.user.id }).populate(
      "course_id"
    );
    res.json(labs);
  }
);

// Add module to lab
router.post(
  "/labs/:labId/modules",
  authMiddleware,
  requireRole("teacher"),
  async (req, res) => {
    const { title, description, type, challenges } = req.body;

    const lab = await Lab.findById(req.params.labId);
    if (!lab) return res.status(404).json({ error: "Lab not found" });

    // Optional: Check teacher belongs to this lab
    if (!lab.teachers.includes(req.user.id))
      return res.status(403).json({ error: "Not your lab" });

    const newModule = new OSModule({
      title,
      description,
      type,
      challenges,
      labType: "OSmodule",
    });

    await newModule.save();
    lab.modules.push(newModule._id);
    await lab.save();

    res.status(201).json(newModule);
  }
);

export default router;
