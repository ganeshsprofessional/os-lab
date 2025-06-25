// routes/student.js
import express from "express";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import { getMyLabs, getLabDetails } from "../controllers/studentController.js";

const router = express.Router();

router.use(authMiddleware, requireRole("student"));

router.get("/labs", getMyLabs);
router.get("/labs/:labId", getLabDetails);

export default router;
