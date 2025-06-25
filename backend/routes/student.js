import express from "express";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import LabEnrollment from "../models/LabEnrollment.js";
import Lab from "../models/Lab.js";
const router = express.Router();

// Get labs enrolled by student
router.get(
  "/labs",
  authMiddleware,
  requireRole("student"),
  async (req, res) => {
    const enrollments = await LabEnrollment.find({
      student_id: req.user.id,
    }).populate("lab_id");
    res.json(enrollments);
  }
);

// Get modules in a specific lab
router.get(
  "/labs/:labId/modules",
  authMiddleware,
  requireRole("student"),
  async (req, res) => {
    const lab = await Lab.findById(req.params.labId).populate({
      path: "modules",
      model: "OSmodule",
    });

    if (!lab) return res.status(404).json({ error: "Lab not found" });
    res.json(lab.modules);
  }
);

export default router;
