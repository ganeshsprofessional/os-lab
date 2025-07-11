import mongoose from "mongoose";
import Course from "./Course.js";

const LABS = process.env.LABS.trim().split(/\s+/);

const baseLabSchema = new mongoose.Schema(
  {
    lab_name: { type: String, required: true, unique: true },
    course_id: { type: mongoose.Types.ObjectId, ref: "Course", required: true },
    semester: { type: Number },
    teachers: [{ type: mongoose.Types.ObjectId, ref: "User", required: true }],
    students: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    labType: { type: String, enum: LABS.map((lab) => lab + "Lab") },
  },
  { timestamps: true, discriminatorKey: "labType" } // Key to differentiate
);

baseLabSchema.pre("save", async function (next) {
  const course = await Course.findOne({ _id: this.course_id });
  this.labType = course.labType + "Lab";
  next();
});

export default mongoose.model("Lab", baseLabSchema);
