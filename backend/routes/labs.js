import express from "express";
import models from "../models/index.js";
import { ensureAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const labs = await models.Lab.find()
    .populate("course_id")
    .populate("modules");
  res.json(labs);
});

router.get("/modules");

// Add more endpoints for creating labs, etc.

export default router;
