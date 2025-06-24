import mongoose from "mongoose";

const LABS = process.env.LABS.trim().split(/\s+/);

const baseModuleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true, enum: ["Practice", "Exam"] },
    labType: { type: String, enum: LABS.map((lab) => lab + "module") },
  },
  { timestamps: true, discriminatorKey: "labType" }
);

export default mongoose.model("Module", baseModuleSchema);
