export function generateDockerfile(config) {
  const { baseImage, systemPackages, initialFiles } = config;

  let dockerfile = `FROM ${baseImage}\n\n`;

  // Install system packages (sanitized)
  const sanitizedPackages = systemPackages
    .map((pkg) => pkg.trim().replace(/[^a-zA-Z0-9-_]/g, ""))
    .filter(Boolean);

  if (sanitizedPackages.length > 0) {
    dockerfile += `RUN apt-get update && apt-get install -y --no-install-recommends ${sanitizedPackages.join(
      " "
    )} \\\n`;
    dockerfile += `    && rm -rf /var/lib/apt/lists/*\n\n`;
  }

  // Create non-root user
  dockerfile += `ARG USERNAME=student\n`;
  dockerfile += `RUN useradd --create-home --shell /bin/bash $USERNAME\n\n`;

  // Switch to non-root user for safety
  dockerfile += `USER student\n`;
  dockerfile += `WORKDIR /home/student\n\n`;

  // Add initial files with `touch` and `echo`
  if (initialFiles && initialFiles.length > 0) {
    dockerfile += `# Add initial files using echo and touch\n`;
    for (const file of initialFiles) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._/-]/g, "_"); // sanitize file name
      const safeContent = (file.content || "")
        .replace(/(["\\$`])/g, "\\$1") // escape quotes, backslashes, $, and backticks
        .replace(/\n/g, "\\n"); // escape newlines

      dockerfile += `RUN mkdir -p "$(dirname ${safeName})" && echo "${safeContent}" > ${safeName}\n`;
    }
    dockerfile += `\n`;
  }

  // Set the shell prompt
  dockerfile += `ENV PS1='SHELL_PROMPT> '\n\n`;

  // Default shell
  dockerfile += `CMD ["/bin/bash"]\n`;

  return dockerfile;
}
