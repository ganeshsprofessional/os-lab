import express from "express";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import {
  getMyLabs,
  getLabDetails,
  addModuleToLab,
} from "../controllers/teacherController.js";
const router = express.Router();

router.use(authMiddleware, requireRole("teacher"));

router.get("/labs", getMyLabs);
router.get("/labs/:labId", getLabDetails);
router.post("/labs/:labId/modules", addModuleToLab);

export default router;
