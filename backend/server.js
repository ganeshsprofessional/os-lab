import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import models from "./models/index.js";
import authRoutes from "./routes/auth.js";
// import studentRoutes from "./routes/students.js";
// import teacherRoutes from "./routes/teachers.js";
// import adminRoutes from "./routes/admins.js";
import labRoutes from "./routes/labs.js";
// import moduleRoutes from "./routes/modules.js";
// import questionRoutes from "./routes/questions.js";

dotenv.config();

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

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 6,
    },
  })
);

app.get("/", (req, res) => {
  console.log({ sess: req.session });
  if (req.session.isAuthenticated) {
    res.json({ message: req.session.user });
    return;
  }
  res.json({ message: "Unauthorized" });
});

app.get("/login", (req, res) => {
  req.session.isAuthenticated = true;
  req.session.user = { name: "john" };
  console.log({ sess: req.session });
  res.json({ message: "logged in" });
});

app.get("/logout", (req, res) => {
  console.log({ sess: req.session });
  req.session.destroy();
  res.json({ message: "logged out" });
});

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/labeval");

app.use("/api/auth", authRoutes);
// app.use("/api/students", studentRoutes);
// app.use("/api/teachers", teacherRoutes);
// app.use("/api/admins", adminRoutes);
app.use("/api/labs", labRoutes);
// app.use("/api/modules", moduleRoutes);
// app.use("/api/questions", questionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
