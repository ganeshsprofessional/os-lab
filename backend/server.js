import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import models from "./models/index.js";
import connectDB from "./config/connectDB.js";

import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/student.js";
import teacherRoutes from "./routes/teacher.js";

// import authRoutes from "./routes/auth.js";
// import studentRoutes from "./routes/students.js";
// import teacherRoutes from "./routes/teachers.js";
// import adminRoutes from "./routes/admins.js";
// import labRoutes from "./routes/labs.js";
// import moduleRoutes from "./routes/modules.js";
// import questionRoutes from "./routes/questions.js";

const NODE_ENV = process.env.NODE_ENV;

const PORT = process.env.PORT;
const INTERFACE = "0.0.0.0";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: function (origin, callback) {
      console.log({ origin });
      callback(null, origin);
    },
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);

// app.use("/api/auth", authRoutes);
// app.use("/api/students", studentRoutes);
// app.use("/api/teachers", teacherRoutes);
// app.use("/api/admins", adminRoutes);
// app.use("/api/labs", labRoutes);
// app.use("/api/modules", moduleRoutes);
// app.use("/api/questions", questionRoutes);

app.listen(PORT, INTERFACE, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
