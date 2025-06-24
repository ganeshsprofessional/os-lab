import mongoose from "mongoose";

const options = { timestamps: true };
const SALT_ROUNDS = process.env.SALT_ROUNDS || 14;

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

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  }
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);
