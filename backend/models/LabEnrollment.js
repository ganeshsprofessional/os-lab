import mongoose from "mongoose";

const LABS = process.env.LABS.trim().split(/\s+/);

const baseLabEnrollmentSchema = new mongoose.Schema(
  {
    lab_id: { type: mongoose.Types.ObjectId, ref: "Lab", required: true },
    student_id: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    labType: { type: String, enum: LABS.map((lab) => lab + "labEnrollment") },
  },
  { discriminatorKey: "labType", timestamps: true }
);
baseLabEnrollmentSchema.index({ lab_id: 1, student_id: 1 }, { unique: true });

export default mongoose.model("LabEnrollment", baseLabEnrollmentSchema);
