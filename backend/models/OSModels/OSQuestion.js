import mongoose from "mongoose";
import Question from "../Question";

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

const OSQuestionSchema = new mongoose.Schema({
  description: { type: String, required: true },
  hint: { type: String, required: true },
  validator: { type: OSValidatorSchema, required: true },
});

export default Question.discriminator("OSQuestion", OSQuestionSchema);
