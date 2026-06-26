#!/usr/bin/env node
import { loadConfig } from "../core/config.mjs";
import { getSeniorModeInstructions } from "../core/instructions.mjs";
import { readMode } from "../core/state.mjs";
import { writeHookOutput } from "../core/runtime.mjs";

try {
  const { config } = loadConfig();
  if (!config.enableSubagents) process.exit(0);

  const mode = readMode(config);
  if (!mode || mode === "off") process.exit(0);

  writeHookOutput("SubagentStart", mode, getSeniorModeInstructions(mode));
} catch {
  // Silent hook failure: better no injection than a broken agent session.
}
