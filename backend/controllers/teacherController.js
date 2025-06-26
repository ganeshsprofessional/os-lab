import { Lab, OSLab, OSModule } from "../models/index.js";

export const getMyLabs = async (req, res) => {
  const labs = await Lab.find({ teachers: req.user.id })
    .populate("course_id")
    .populate("students", "name roll_no");
  res.json(labs);
};

export const getLabDetails = async (req, res) => {
  const lab = await OSLab.findById(req.params.labId)
    .populate("course_id")
    .populate({ path: "modules", model: "Module" });

  if (!lab) return res.status(404).json({ error: "Lab not found" });

  if (!lab.teachers.includes(req.user.id)) {
    return res.status(403).json({ error: "Forbidden: Not your lab" });
  }

  res.json(lab);
};

export const addModuleToLab = async (req, res) => {
  const { title, description, type, challenges } = req.body;

  const lab = await Lab.findById(req.params.labId);
  if (!lab) return res.status(404).json({ error: "Lab not found" });

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
};
