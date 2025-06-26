import express from "express";
import { Module, OSModule } from "../../models/index.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const moduleData = req.body;

    // Create the module entry first to get an ID
    const module = new OSModule({
      ...moduleData,
      status: "BUILDING",
    });

    // Generate unique names based on the new module's ID
    module.imageName = `module-image-${module._id}`;
    module.volumeName = `module-volume-${module._id}`;

    await module.save();

    // Respond to the client immediately
    res.status(202).json({
      success: true,
      message: "Build process initiated.",
      moduleId: module._id,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// @desc    Get all modules (titles and descriptions only)
// @route   GET /api/modules
router.get("/", async (req, res) => {
  try {
    const { type } = req.params;
    let filter = { type };
    if (!type) filter = {};
    const modules = await Module.find(filter);
    res.status(200).json({ success: true, data: modules });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

export default router;
