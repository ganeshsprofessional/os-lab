import { url } from "node:url";
import { Module } from "../../models/index.js";
import { sessionManager } from "../SessionManager";

export default async function studentHandler(ws, req) {
  console.log(req.url);
  const parameters = url.parse(req.url, true).query;
  const { userId, moduleId } = parameters;

  if (!userId || !moduleId) {
    ws.send(
      JSON.stringify({
        type: "error",
        data: "User ID and Module ID are required.",
      })
    );
    ws.close();
    return;
  }

  const module = await Module.findById(moduleId);
  if (!module) {
    ws.send(JSON.stringify({ type: "error", data: "Module not found." }));
    ws.close();
    return;
  }

  console.log(
    `New connection from user: ${userId} for module: ${module.title}`
  );

  sessionManager.createSession(
    userId,
    module.imageName,
    module.volumeName,
    ws,
    module.challenges
  );

  ws.on("close", () => {
    console.log(`Connection closed for user: ${userId}`);
    sessionManager.removeSession(userId);
  });
}
