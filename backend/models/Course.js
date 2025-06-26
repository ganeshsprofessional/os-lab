import mongoose from "mongoose";

const LABS = process.env.LABS.trim().split(/\s+/);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    labType: {
      type: String,
      //currently supported labs
      enum: LABS,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
