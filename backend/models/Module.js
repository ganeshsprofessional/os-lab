import mongoose from "mongoose";

const LABS = process.env.LABS.trim().split(/\s+/);

const baseModuleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["Observation", "Execution", "Spot", "Exam"],
    },
    labType: { type: String, enum: LABS.map((lab) => lab + "Module") },
  },
  { timestamps: true, discriminatorKey: "labType" }
);

export default mongoose.model("Module", baseModuleSchema);
