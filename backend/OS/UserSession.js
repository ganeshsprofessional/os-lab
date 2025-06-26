import { PassThrough } from "stream";
import { getOrCreateContainer, cleanupContainer } from "./ContainerManager.js";
import { validators } from "./validators/index.js";

export class UserSession {
  constructor(userId, imageName, volumeName, ws, challenges) {
    this.userId = userId;
    this.ws = ws;
    this.container = null;
    this.stream = null;
    this.challenges = challenges;
    this.completedChallenges = new Set();
    this.currentChallengeIndex = 0;
    this.challengeStats = new Map(); // To store { attempts, startTime, endTime }
    this.imageName = imageName;
    this.volumeName = volumeName;
  }

  async initialize() {
    try {
      this.container = await getOrCreateContainer(
        this.userId,
        this.imageName,
        this.volumeName
      );
      const exec = await this.container.exec({
        Cmd: ["/bin/bash"],
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
      });
      this.stream = await exec.start({ hijack: true, stdin: true });

      const stdout = new PassThrough();
      const stderr = new PassThrough();
      this.container.modem.demuxStream(this.stream, stdout, stderr);

      // Just pipe output to the user, no validation logic here anymore
      const handleOutput = (chunk) => {
        this.ws.send(
          JSON.stringify({ type: "output", data: chunk.toString() })
        );
      };
      stdout.on("data", handleOutput);
      stderr.on("data", handleOutput);

      this.ws.on("message", (msg) => this.handleMessage(msg));
      this.ws.on("close", () => this.destroy());

      // Send the first challenge to the client to kick things off
      this.ws.send(
        JSON.stringify({ type: "initial_challenge", data: this.challenges[0] })
      );
      this.recordAttempt(this.challenges[0]._id.toString()); // Start the timer for the first question

      console.log(`Session initialized for user ${this.userId}`);
    } catch (error) {
      console.error(`Failed to initialize session for ${this.userId}:`, error);
      this.ws.send(
        JSON.stringify({
          type: "error",
          data: "Failed to start terminal session.",
        })
      );
      this.ws.close();
    }
  }

  async handleMessage(msg) {
    const message = JSON.parse(msg.toString());

    switch (message.type) {
      case "input":
        this.stream.write(message.data);
        break;
      case "validate_challenge":
        await this.handleValidationRequest(message.data.challengeId);
        break;
      case "request_next_challenge":
        this.handleNextChallengeRequest();
        break;
      case "retry_challenge":
        this.handleRetryRequest(message.data.challengeId);
        break;
      default:
        console.warn(`Unknown message type: ${message.type}`);
    }
  }

  recordAttempt(challengeId) {
    if (!this.challengeStats.has(challengeId)) {
      this.challengeStats.set(challengeId, {
        attempts: 1,
        startTime: new Date(),
        endTime: null,
      });
    } else {
      const stats = this.challengeStats.get(challengeId);
      stats.attempts++;
      stats.startTime = new Date(); // Reset timer for the new attempt
      stats.endTime = null;
    }
  }

  async handleValidationRequest(challengeId) {
    this.recordAttempt(challengeId); // This will now increment attempt count
    console.log({ challengeId });

    const challenge = this.challenges.find(
      (c) => c._id.toString() === challengeId
    );
    if (!challenge) return;

    const context = { command: "", output: "", session: this };
    const validatorFn = validators[challenge.validator.type];
    const isCompleted = await validatorFn(context, challenge.validator.options);

    if (isCompleted) {
      this.challengeStats.get(challengeId).endTime = new Date(); // Mark end time for this successful attempt

      // Simply send a success message. Do NOT send the next challenge.
      this.ws.send(
        JSON.stringify({
          type: "validation_success",
          data: { challengeId },
        })
      );
    } else {
      this.ws.send(
        JSON.stringify({
          type: "validation_failure",
          data: { challengeId, hint: challenge.hint },
        })
      );
    }
  }

  handleNextChallengeRequest() {
    this.currentChallengeIndex++;

    if (this.currentChallengeIndex < this.challenges.length) {
      const nextChallenge = this.challenges[this.currentChallengeIndex];
      this.recordAttempt(nextChallenge._id.toString()); // Start timer for the new challenge

      this.ws.send(
        JSON.stringify({
          type: "next_challenge_data",
          data: { challenge: nextChallenge },
        })
      );
    } else {
      // We've run out of challenges
      this.ws.send(
        JSON.stringify({
          type: "all_challenges_complete",
          data: { message: "Congratulations! You have mastered the shell." },
        })
      );
    }
  }

  handleRetryRequest(challengeId) {
    // The user wants to try again. We just need to reset the timer.
    this.recordAttempt(challengeId);
    console.log(
      `User ${this.userId} is re-attempting challenge ${challengeId}`
    );
  }

  // Helper for validators that need to run commands
  async runVerificationCommand(cmd) {
    if (!this.container) throw new Error("Container not available");

    const exec = await this.container.exec({
      Cmd: ["/bin/bash", "-c", cmd],
      AttachStdout: true,
      AttachStderr: true,
    });

    let output = "";
    const outputStream = new PassThrough();
    outputStream.on("data", (chunk) => (output += chunk.toString("utf8")));

    const stream = await exec.start({ hijack: true, stdin: true });
    this.container.modem.demuxStream(stream, outputStream, outputStream);

    // Wait for the stream to end to ensure all output is captured
    await new Promise((resolve) => {
      stream.on("end", resolve);
    });

    const { ExitCode } = await exec.inspect();
    return { ExitCode, output };
  }
  async destroy() {
    console.log(`Destroying session for user ${this.userId}`);
    await cleanupContainer(this.container);
    // Remove session from SessionManager (handled in SessionManager.js)
  }
}
