import { Module } from "../../models/index.js";
import { buildListeners, buildModuleImage } from "../services/imageBuilder.js";
import url from "node:url";

export default async function buildHandler(ws, req) {
  const parameters = url.parse(req.url, true).query;
  const buildId = parameters.buildId;

  if (!buildId) {
    ws.close(1008, "Build ID is required.");
    return;
  }

  console.log(`Build listener connected for buildId: ${buildId}`);
  const module = await Module.findById(buildId);
  console.log({ module });
  buildListeners.set(buildId, ws);

  await buildModuleImage(module._id, module.toObject());

  ws.on("close", () => {
    buildListeners.delete(buildId);
    console.log(`Build listener disconnected for buildId: ${buildId}`);
  });
}
