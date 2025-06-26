import Docker from "dockerode";
import tar from "tar-stream";
import { generateDockerfile } from "./dockerfileGenerator.js";
import { Module } from "../../models/index.js";

const docker = new Docker();

// In-memory map to hold WebSocket connections for active builds
export const buildListeners = new Map();

export async function buildModuleImage(moduleId, moduleData) {
  const ws = buildListeners.get(moduleId.toString());

  const sendLog = (message) => {
    if (ws && ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({ type: "log", data: message }));
    }
  };

  try {
    console.log("building");
    sendLog("Build process started...");
    console.log(moduleData);
    const dockerfileContent = generateDockerfile(moduleData);
    sendLog("Dockerfile generated:\n---\n" + dockerfileContent + "---\n");

    // Create an in-memory tar stream for the build context
    const pack = tar.pack();
    pack.entry({ name: "Dockerfile" }, dockerfileContent);

    // Add initial files to the tar stream if they exist
    if (moduleData.initialFiles && moduleData.initialFiles.length > 0) {
      moduleData.initialFiles.forEach((file) => {
        // IMPORTANT: The path inside tar must match the COPY command in Dockerfile
        pack.entry({ name: `initial-files/${file.name}` }, file.content);
      });
    }
    pack.finalize();

    sendLog(`Building image: ${moduleData.imageName}...`);

    const stream = await docker.buildImage(pack, { t: moduleData.imageName });

    await new Promise((resolve, reject) => {
      docker.modem.followProgress(
        stream,
        (err, res) => (err ? reject(err) : resolve(res)),
        (event) => {
          if (event.stream) {
            sendLog(event.stream.trim());
          }
        }
      );
    });

    sendLog("Build completed successfully!");
    await Module.findByIdAndUpdate(moduleId, {
      status: "READY",
      buildLog: "Build Succeeded",
    });
    if (ws) ws.send(JSON.stringify({ type: "build_success" }));
  } catch (error) {
    console.error(`Build failed for module ${moduleId}:`, error);
    const errorMessage = error.message || "An unknown error occurred.";
    sendLog(`ERROR: ${errorMessage}`);
    await Module.findByIdAndUpdate(moduleId, {
      status: "FAILED",
      buildLog: errorMessage,
    });
    if (ws)
      ws.send(JSON.stringify({ type: "build_failure", data: errorMessage }));
  } finally {
    // Clean up the listener
    if (ws) ws.close();
    buildListeners.delete(moduleId.toString());
  }
}
