import LabEnrollment from "../models/LabEnrollment.js";
import { OSLab } from "../models/index.js";

export const getMyLabs = async (req, res) => {
  try {
    const enrollments = await LabEnrollment.find({
      student_id: req.user.id,
    }).populate({
      path: "lab_id",
      populate: [{ path: "course_id" }, { path: "teachers", select: "name" }],
    });

    const labs = enrollments.map((e) => e.lab_id);
    res.json(labs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLabDetails = async (req, res) => {
  try {
    const { labId } = req.params;

    const lab = await OSLab.findById(labId)
      .populate("course_id")
      .populate({
        path: "modules",
        model: "Module",
      })
      .lean();

    if (!lab) {
      return res.status(404).json({ error: "Lab not found" });
    }

    const enrollment = await LabEnrollment.findOne({
      lab_id: labId,
      student_id: req.user.id,
    }).lean();

    if (!enrollment) {
      return res
        .status(403)
        .json({ error: "You are not enrolled in this lab." });
    }

    console.log(lab);

    const modulesWithProgress = lab.modules.map((module) => {
      const progress = enrollment.moduleProgress?.find((p) =>
        p.module_id.equals(module._id)
      );
      return {
        ...module,
        status: progress ? progress.status : "not-started",
        marksObtained: progress ? progress.marksObtained : 0,
      };
    });

    res.json({ ...lab, modules: modulesWithProgress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
