import Stream from "stream";

export async function fileExists(context, options) {
  const { path, isDir = false } = options;
  const checkCmd = isDir ? `test -d "${path}"` : `test -f "${path}"`;
  console.dir({ context, options });
  try {
    const exec = await context.session.container.exec({
      Cmd: ["/bin/sh", "-c", checkCmd],
      AttachStdout: true,
      AttachStderr: true,
    });

    console.dir({ exec });

    const stream = await exec.start({ hijack: true, stdin: false });

    console.dir({ stream });
    // Consume the stream data to ensure it ends
    await new Promise((resolve, reject) => {
      stream.on("data", () => {
        /* discard data */
      });
      stream.on("end", resolve);
      stream.on("close", resolve); // also listen for close event
      stream.on("error", reject);
    });

    console.log("hello");

    const inspectData = await exec.inspect();
    console.log({ inspectData });
    return inspectData.ExitCode === 0;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function fileContentEquals(context, options) {
  const { path, content } = options;
  const checkCmd = `cat "${path}"`;

  try {
    const exec = await context.session.container.exec({
      Cmd: ["/bin/sh", "-c", checkCmd],
      AttachStdout: true,
      AttachStderr: true,
    });

    const stream = await exec.start({ hijack: true, stdin: false });

    let execOutput = "";
    const outputStream = new Stream.PassThrough();

    // Docker multiplexes stdout and stderr in one stream, so demux it:
    context.session.container.modem.demuxStream(
      stream,
      outputStream,
      process.stderr
    );

    // Collect data from stdout stream
    outputStream.on("data", (chunk) => {
      execOutput += chunk.toString("utf8");
    });

    // Wait for the exec command to finish
    await new Promise((resolve, reject) => {
      stream.on("end", resolve);
      stream.on("close", resolve);
      stream.on("error", reject);
    });

    const { ExitCode } = await exec.inspect();

    if (ExitCode !== 0) return false;

    // Trim output and compare with expected content
    return execOutput.trim() === content.trim();
  } catch {
    return false;
  }
}

export async function fileContainsOutputOfCommand(context, options) {
  const { command, path } = options;

  if (!command || !path) {
    console.error(
      'Validator "fileContainsOutputOfCommand" requires both a "command" and a "path" option.'
    );
    return false;
  }

  try {
    const commandResult = await context.session.runVerificationCommand(command);

    if (commandResult.ExitCode !== 0) {
      return false;
    }
    const commandOutput = commandResult.output;

    const fileResult = await context.session.runVerificationCommand(
      `cat "${path}"`
    );

    if (fileResult.ExitCode !== 0) {
      return false;
    }
    const fileContent = fileResult.output;

    return commandOutput.trim() === fileContent.trim();
  } catch (error) {
    console.error(
      "Error during fileContainsOutputOfCommand validation:",
      error
    );
    return false;
  }
}
