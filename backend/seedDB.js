import mongoose from "mongoose";
import bcrypt from "bcrypt";
import models from "./models/index.js";

(async () => {
  await mongoose.connect("mongodb://localhost:27017/labeval");

  await mongoose.connection.db.dropDatabase();

  // Create courses
  const osCourse = await models.Course.create({
    title: "Operating Systems",
    code: "OS101",
    description: "OS Course",
  });
  const dbmsCourse = await models.Course.create({
    title: "DBMS",
    code: "DB101",
    description: "DBMS Course",
  });

  // Create users
  const student = await models.Student.create({
    roll_no: "S101",
    name: "John Doe",
    password: await bcrypt.hash("studentpass", 10),
    email: "student@example.com",
  });
  const teacher = await models.Teacher.create({
    username: "teach1",
    name: "Prof. Smith",
    password: await bcrypt.hash("teacherpass", 10),
    email: "teacher@example.com",
  });
  const admin = await models.Admin.create({
    username: "admin1",
    name: "Admin User",
    password: await bcrypt.hash("adminpass", 10),
    email: "admin@example.com",
  });

  // Create a lab
  const lab = await models.Lab.create({
    course_id: osCourse._id,
    semester: 6,
    modules: [],
  });

  // Associations
  await models.StudentLabAssociation.create({
    lab_id: lab._id,
    student_id: student._id,
  });
  await models.TeacherLabAssociation.create({
    lab_id: lab._id,
    teacher_id: teacher._id,
  });

  // Create a module and question
  const module = await models.Module.create({
    lab_id: lab._id,
    title: "Module 1",
    description: "Intro to OS",
    isOpen: true,
    questions: [],
  });
  lab.modules.push(module._id);
  await lab.save();

  const question = await models.Question.create({
    module_id: module._id,
    title: "Q1",
    description: "What is an OS?",
    tracked_commands: [],
    isOrdered: false,
  });
  module.questions.push(question._id);
  await module.save();

  console.log("Database seeded!");
  process.exit();
})();
