import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import url from "node:url";
import connectDB from "./config/connectDB.js";
import * as models from "./models/index.js";

import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/student.js";
import teacherRoutes from "./routes/teacher.js";

import buildHandler from "./OS/wsHandlers/buildHandler.js";
import studentHandler from "./OS/wsHandlers/studentHandler.js";

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

const server = app.listen(PORT, INTERFACE, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});

const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (request, socket, head) => {
  const { pathname } = url.parse(request.url);

  if (pathname === "/os/build-status") {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection:build", ws, request);
    });
  } else if (pathname === "/os/student") {
    // Handle the OS student terminal connection
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection:student", ws, request);
    });
  }
});

// Listener for OS module build status connections
wss.on("connection:build", buildHandler);

// Listener for OS student terminal connections
wss.on("connection:student", studentHandler);

process.on("SIGINT", () => {
  console.log("Shutting down server...");
  wss.clients.forEach((ws) => ws.close());
  server.close(() => {
    console.log("Server shut down.");
    process.exit(0);
  });
});
