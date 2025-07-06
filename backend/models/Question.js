import mongoose from "mongoose";

const LABS = process.env.LABS.trim().split(/\s+/);

const QuestionSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    labType: { type: String, enum: LABS.map((lab) => lab + "Question") },
  },
  { timestamps: true, discriminatorKey: "labType" }
);

export default mongoose.models("Question", QuestionSchema);
