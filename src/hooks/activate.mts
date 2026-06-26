#!/usr/bin/env node
import { loadConfig, resolveDefaultMode } from "../core/config.mjs";
import { getSeniorModeInstructions } from "../core/instructions.mjs";
import { clearMode, writeMode } from "../core/state.mjs";
import { writeHookOutput } from "../core/runtime.mjs";

const { config } = loadConfig();
const mode = resolveDefaultMode(undefined);

try {
  if (mode === "off") {
    clearMode(config);
    writeHookOutput("SessionStart", "off", "");
    process.exit(0);
  }

  writeMode(mode, config);
  writeHookOutput("SessionStart", mode, getSeniorModeInstructions(mode));
} catch {
  // Hooks must not make the host agent fail because SeniorMode could not load.
}
