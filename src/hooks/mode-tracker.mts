#!/usr/bin/env node
import fs from "node:fs";
import { loadConfig } from "../core/config.mjs";
import { getSeniorModeInstructions } from "../core/instructions.mjs";
import { parseSeniorModeCommand } from "../core/commands.mjs";
import { clearMode, writeMode } from "../core/state.mjs";
import { writeHookOutput } from "../core/runtime.mjs";

try {
  const input = process.env.SENIORMODE_HOOK_INPUT ?? fs.readFileSync(0, "utf8");
  const data = JSON.parse(input.replace(/^\uFEFF/, "")) as { prompt?: string };
  const command = parseSeniorModeCommand(data.prompt || "");
  if (!command) process.exit(0);

  const { config } = loadConfig();

  if (command.mode === "off") {
    clearMode(config);
    writeHookOutput("UserPromptSubmit", "off", "SENIORMODE OFF");
    process.exit(0);
  }

  writeMode(command.mode, config);
  const context = command.mode === "review" || command.mode === "audit" || command.mode === "debt" || command.mode === "gain"
    ? getSeniorModeInstructions(command.mode)
    : `SENIORMODE MODE CHANGED - mode: ${command.mode}`;
  writeHookOutput("UserPromptSubmit", command.mode, context);
} catch {
  // Bad hook input should be ignored.
}
