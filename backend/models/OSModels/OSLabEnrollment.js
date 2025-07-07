import mongoose from "mongoose";
import LabEnrollment from "../LabEnrollment.js";

const OSSubmissionSchema = new mongoose.Schema(
  {
    question_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "OSQuestion",
    },
    marksObtained: { type: Number, default: 0 },
  },
  { timestamps: true }
);

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
      submissions: [OSSubmissionSchema],
      marksObtained: { type: Number, default: 0 },
    },
  ],
});

export default LabEnrollment.discriminator(
  "OSLabEnrollment",
  OSLabEnrollmentSchema
);
