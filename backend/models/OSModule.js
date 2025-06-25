import mongoose from "mongoose";
import Module from "./Module.js";

const OSInitialFileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., 'script.py'
    content: { type: String, required: true },
  },
  { _id: false }
);

const OSValidatorSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "fileExists",
        "commandOutputContains",
        "fileContentEquals",
        "commandExact",
        "fileContainsOutputOfCommand",
      ],
    },
    options: {
      type: mongoose.Schema.Types.Mixed, // Allows for flexible options like { path, content, etc. }
      required: true,
    },
  },
  { _id: false }
);

const OSChallengeSchema = new mongoose.Schema({
  description: { type: String, required: true },
  hint: { type: String, required: true },
  validator: { type: OSValidatorSchema, required: true },
});

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

    challenges: [OSChallengeSchema],
  },
  { timestamps: true }
);
const OSModule = Module.discriminator("OSmodule", OSModuleSchema);

export default OSModule;
