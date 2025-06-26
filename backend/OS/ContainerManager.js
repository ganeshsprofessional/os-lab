// ContainerManager.js
import Docker from "dockerode";
const docker = new Docker();

export async function getOrCreateContainer(userId, imageName, volName) {
  const containerName = `terminal_user_${userId}_${imageName}`;
  const volumeName = `volume_user_${userId}_${volName}`;

  const containers = await docker.listContainers({ all: true });
  console.log(containers);
  const existing = containers.find((c) =>
    c.Names.includes("/" + containerName)
  );

  if (existing) {
    const container = docker.getContainer(existing.Id);
    await cleanupContainer(container);
    // const info = await container.inspect();
    // if (info.State.Status !== "running") {
    //   await container.start();
    // }
    // console.log(`Reusing existing container: ${containerName}`);
    // return container;
  }

  console.log(`Creating new container for user: ${userId} with ${imageName}`);
  const container = await docker.createContainer({
    name: containerName,
    Image: imageName,
    Tty: true,
    Cmd: ["/bin/bash"],
    OpenStdin: true,
    AttachStdin: true,
    AttachStdout: true,
    AttachStderr: true,
    HostConfig: {
      Memory: 256 * 1024 * 1024,
      CpuShares: 256,
      Binds: [`${volumeName}:/home/student`],
      AutoRemove: true,
      CapDrop: ["ALL"],
      NetworkMode: "none",
    },
  });

  await container.start();
  return container;
}

export async function cleanupContainer(container) {
  if (!container) return;
  try {
    await container.stop();
    console.log(`Stopped container ${container.id}`);
    // AutoRemove is on, so no need to call remove.
  } catch (error) {
    // Ignore errors if container is already stopped/removed
    if (error.statusCode !== 304 && error.statusCode !== 404) {
      console.error(`Error stopping container ${container.id}:`, error);
    }
  }
}
