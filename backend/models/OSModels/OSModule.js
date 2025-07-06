import mongoose from "mongoose";
import Module from "../Module.js";

const OSInitialFileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., 'script.py'
    content: { type: String, required: true },
  },
  { _id: false }
);

const OSModuleSchema = new mongoose.Schema(
  {
    baseImage: { type: String, required: true, default: "ubuntu:22.04" },
    systemPackages: [String], // e.g., ['git', 'python3', 'curl']
    initialFiles: [OSInitialFileSchema],

    imageName: { type: String, unique: true }, // e.g., 'module-image-64a5e3f1c3b2a1f8e8d4a5b6'
    volumeName: { type: String, unique: true },

    status: {
      type: String,
      enum: ["BUILDING", "READY", "FAILED"],
      default: "BUILDING",
    },
    buildLog: { type: String },

    questions: [
      {
        type: mongoose.Types.ObjectId,
        ref: "OSQuestion",
        required: true,
      },
    ],
  },
  { timestamps: true }
);
const OSModule = Module.discriminator("OSModule", OSModuleSchema);

export default OSModule;
