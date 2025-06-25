import mongoose from "mongoose";
import bcrypt from "bcrypt";

const options = { timestamps: true };
const SALT_ROUNDS = process.env.SALT_ROUNDS || 15;

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      required: true,
    },
    roll_no: {
      type: String,
      required: function () {
        return this.role === "student";
      },
      unique: true,
      sparse: true,
    },
  },
  options
);

userSchema.pre("insertMany", async function (next, docs) {
  for (const doc of docs) {
    if (doc.password) {
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      doc.password = await bcrypt.hash(doc.password, salt);
    }
  }
  next();
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update && update.password) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    update.password = await bcrypt.hash(update.password, salt);
    this.setUpdate(update);
  }
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
