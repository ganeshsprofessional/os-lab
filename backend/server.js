import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
// import { WebSocketServer } from "ws";

// import models from "./models/index.js";
import connectDB from "./config/connectDB.js";
import * as models from "./models/index.js";

import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/student.js";
import teacherRoutes from "./routes/teacher.js";

// import { sessionManager } from "./SessionManager.js";
// import { buildListeners, buildModuleImage } from "./services/imageBuilder.js";

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

app.listen(PORT, INTERFACE, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});

// const wss = new WebSocketServer({ noServer: true });

// server.on("upgrade", (request, socket, head) => {
//   const { pathname } = url.parse(request.url);

//   if (pathname === "/build-status") {
//     wss.handleUpgrade(request, socket, head, (ws) => {
//       wss.emit("connection:build", ws, request);
//     });
//   } else {
//     // Handle the student terminal connection
//     wss.handleUpgrade(request, socket, head, (ws) => {
//       wss.emit("connection:student", ws, request);
//     });
//   }
// });

// // Listener for build status connections
// wss.on("connection:build", async (ws, req) => {
//   const parameters = url.parse(req.url, true).query;
//   const buildId = parameters.buildId;

//   if (!buildId) {
//     ws.close(1008, "Build ID is required.");
//     return;
//   }

//   console.log(`Build listener connected for buildId: ${buildId}`);
//   const module = await Module.findById(buildId);
//   console.log({ module });
//   buildListeners.set(buildId, ws);

//   await buildModuleImage(module._id, module.toObject());

//   ws.on("close", () => {
//     buildListeners.delete(buildId);
//     console.log(`Build listener disconnected for buildId: ${buildId}`);
//   });
// });

// // Listener for student terminal connections
// wss.on("connection:student", async (ws, req) => {
//   console.log(req.url);
//   const parameters = url.parse(req.url, true).query;
//   const { userId, moduleId } = parameters;

//   if (!userId || !moduleId) {
//     ws.send(
//       JSON.stringify({
//         type: "error",
//         data: "User ID and Module ID are required.",
//       })
//     );
//     ws.close();
//     return;
//   }

//   const module = await Module.findById(moduleId);
//   if (!module) {
//     ws.send(JSON.stringify({ type: "error", data: "Module not found." }));
//     ws.close();
//     return;
//   }

//   console.log(
//     `New connection from user: ${userId} for module: ${module.title}`
//   );

//   sessionManager.createSession(
//     userId,
//     module.imageName,
//     module.volumeName,
//     ws,
//     module.challenges
//   );

//   ws.on("close", () => {
//     console.log(`Connection closed for user: ${userId}`);
//     sessionManager.removeSession(userId);
//   });
// });

// process.on("SIGINT", () => {
//   console.log("Shutting down server...");
//   wss.clients.forEach((ws) => ws.close());
//   server.close(() => {
//     console.log("Server shut down.");
//     process.exit(0);
//   });
// });
