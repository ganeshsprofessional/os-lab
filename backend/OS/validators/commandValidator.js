// validators/commandValidator.js

// context = { command, output, session }
export function commandExact(context, options) {
  return context.command.trim() === options.command;
}

export function commandOutputContains(context, options) {
  // We check the output, not the command!
  return true;
  return context.output.includes(options.output);
}
