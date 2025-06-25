import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "../models/User.js";
import Course from "../models/Course.js";
import Lab from "../models/Lab.js";
import OSModule from "../models/OSModule.js";
import Module from "../models/OSModule.js";
import LabEnrollment from "../models/LabEnrollment.js";

dotenv.config();

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to DB. Seeding...");

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Lab.deleteMany({});
    await LabEnrollment.deleteMany({});
    await Module.deleteMany({});

    // Create Users
    // const password = await bcrypt.hash("password123", SALT_ROUNDS);
    const password = "password";

    const students = await User.insertMany([
      {
        name: "Alice",
        username: "alice",
        password,
        role: "student",
        roll_no: "S001",
      },
      {
        name: "Bob",
        username: "bob",
        password,
        role: "student",
        roll_no: "S002",
      },
      {
        name: "Charlie",
        username: "charlie",
        password,
        role: "student",
        roll_no: "S003",
      },
      {
        name: "Diana",
        username: "diana",
        password,
        role: "student",
        roll_no: "S004",
      },
    ]);

    const teachers = await User.insertMany([
      {
        name: "Prof. John",
        username: "john",
        password,
        role: "teacher",
      },
      { name: "Prof. Smith", username: "smith", password, role: "teacher" },
    ]);

    // Create Courses
    const courses = await Course.insertMany([
      {
        title: "Operating Systems",
        code: "OS101",
        description: "OS Lab Course",
        labType: "OS",
      },
      {
        title: "Computer Networks",
        code: "CN101",
        description: "CN Lab Course",
        labType: "CN",
      },
      {
        title: "Database Systems",
        code: "DBMS101",
        description: "DBMS Lab Course",
        labType: "DBMS",
      },
      {
        title: "Programming",
        code: "PROG101",
        description: "Programming Lab Course",
        labType: "PROG",
      },
    ]);

    const osCourse = courses.find((c) => c.labType === "OS");

    // Create OS Lab
    const osLab = await Lab.create({
      course_id: osCourse._id,
      semester: 6,
      teachers: [teachers[0]._id],
      students: [students[0]._id, students[1]._id],
      labType: "OSlab",
    });

    // Enroll Students in OS Lab
    await LabEnrollment.insertMany([
      {
        lab_id: osLab._id,
        student_id: students[0]._id,
        labType: "OSlabEnrollment",
        status: "not-started",
      },
      {
        lab_id: osLab._id,
        student_id: students[1]._id,
        labType: "OSlabEnrollment",
        status: "not-started",
      },
    ]);

    // Add OS Module to OS Lab
    const osModule = await OSModule.create({
      title: "Intro to Shell",
      description: "Learn basic shell commands",
      type: "Practice",
      labType: "OSmodule",
      baseImage: "ubuntu:22.04",
      systemPackages: ["bash"],
      initialFiles: [
        {
          name: "readme.txt",
          content: "This is a basic shell lab module.",
        },
      ],
      challenges: [
        {
          description: "Check if file exists",
          hint: "Use `ls` or `test`",
          validator: {
            type: "fileExists",
            options: { path: "/home/student/readme.txt" },
          },
        },
      ],
    });

    // Attach Module to Lab
    osLab.modules = [osModule._id];
    await osLab.save();

    console.log("Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding DB:", err);
    process.exit(1);
  }
}

seedDB();
