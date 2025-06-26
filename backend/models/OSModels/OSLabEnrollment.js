import mongoose from "mongoose";
import LabEnrollment from "../LabEnrollment.js";

const OSLabEnrollmentSchema = new mongoose.Schema({
  moduleProgress: [
    {
      module_id: {
        type: mongoose.Types.ObjectId,
        ref: "OSModule",
        required: true,
      },
      status: {
        type: String,
        enum: ["not-started", "in-progress", "completed"],
        default: "not-started",
      },
      marksObtained: { type: Number, default: 0 },
    },
  ],
});

export default LabEnrollment.discriminator(
  "OSlabEnrollment",
  OSLabEnrollmentSchema
);
