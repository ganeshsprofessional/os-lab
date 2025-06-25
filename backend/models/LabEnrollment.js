import mongoose from "mongoose";
import Lab from "./Lab.js";

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

baseLabEnrollmentSchema.pre("save", async function (next) {
  const lab = await Lab.findOne({ _id: this.lab_id });
  this.labType = lab.labType.slice(0, -3) + "labEnrollment";
  next();
});

baseLabEnrollmentSchema.pre("insertMany", async function (next, docs) {
  for (let doc in docs) {
    const lab = await Lab.findOne({ _id: doc.lab_id });
    doc.labType = lab.labType.slice(0, -3) + "labEnrollment";
  }
  next();
});

export default mongoose.model("LabEnrollment", baseLabEnrollmentSchema);
