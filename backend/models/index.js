import mongoose from "mongoose";

const options = { timestamps: true };

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    description: { type: String, required: true },
  },
  options
);

const studentSchema = new mongoose.Schema(
  {
    roll_no: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true },
  },
  options
);

const teacherSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true },
  },
  options
);

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true },
  },
  options
);

const labSchema = new mongoose.Schema({
  course_id: { type: mongoose.Types.ObjectId, ref: "Course", required: true },
  semester: { type: Number },
  modules: [{ type: mongoose.Types.ObjectId, ref: "Module" }],
});

const studentLabAssociationSchema = new mongoose.Schema({
  lab_id: { type: mongoose.Types.ObjectId, ref: "Lab", required: true },
  student_id: { type: mongoose.Types.ObjectId, ref: "Student", required: true },
});

const teacherLabAssociationSchema = new mongoose.Schema({
  lab_id: { type: mongoose.Types.ObjectId, ref: "Lab", required: true },
  teacher_id: { type: mongoose.Types.ObjectId, ref: "Teacher", required: true },
});

const moduleSchema = new mongoose.Schema({
  lab_id: { type: mongoose.Types.ObjectId, ref: "Lab", required: true },
  title: { type: String, required: true },
  description: { type: String },
  isOpen: { type: Boolean },
  questions: [{ type: mongoose.Types.ObjectId, ref: "Question" }],
});

const questionSchema = new mongoose.Schema({
  module_id: { type: mongoose.Types.ObjectId, ref: "Module" },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tracked_commands: [{ type: String }],
  isOrdered: { type: Boolean },
});

const studentModuleDataSchema = new mongoose.Schema({
  student_id: { type: mongoose.Types.ObjectId, ref: "Student", required: true },
  module_id: { type: mongoose.Types.ObjectId, ref: "Module", required: true },
  hasCompleted: { type: Boolean, default: false },
  marksObtained: { type: Number, default: 0 },
  containerName: { type: String },
});

const studentQuestionDataSchema = new mongoose.Schema({
  student_id: { type: mongoose.Types.ObjectId, ref: "Student", required: true },
  question_id: {
    type: mongoose.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  hasCompleted: { type: Boolean, default: true },
  marksObtained: { type: Number, default: 0 },
  containerName: { type: String },
});

export default {
  Course: mongoose.model("Course", courseSchema),
  Lab: mongoose.model("Lab", labSchema),
  Student: mongoose.model("Student", studentSchema),
  Teacher: mongoose.model("Teacher", teacherSchema),
  Admin: mongoose.model("Admin", adminSchema),
  StudentLabAssociation: mongoose.model(
    "StudentLabAssociation",
    studentLabAssociationSchema
  ),
  TeacherLabAssociation: mongoose.model(
    "TeacherLabAssociation",
    teacherLabAssociationSchema
  ),
  Module: mongoose.model("Module", moduleSchema),
  Question: mongoose.model("Question", questionSchema),
  StudentModuleData: mongoose.model(
    "StudentModuleData",
    studentModuleDataSchema
  ),
  StudentQuestionData: mongoose.model(
    "StudentQuestionData",
    studentQuestionDataSchema
  ),
};
