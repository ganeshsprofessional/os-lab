import mongoose from "mongoose";
import Lab from "../Lab.js";

const OSLabSchema = new mongoose.Schema({
  modules: [{ type: mongoose.Types.ObjectId, ref: "OSModule" }],
});
const OSLab = Lab.discriminator("OSlab", OSLabSchema);

export default OSLab;
