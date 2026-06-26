import fs from "node:fs";
import type { SeniorModeMode } from "./modes.mjs";

export type HookEvent = "SessionStart" | "UserPromptSubmit" | "SubagentStart";

export function isCopilotRuntime(): boolean {
  return Boolean(process.env.COPILOT_PLUGIN_DATA);
}

export function isCodexRuntime(): boolean {
  return !isCopilotRuntime() && Boolean(process.env.PLUGIN_DATA);
}

export function formatHookOutput(event: HookEvent, mode: SeniorModeMode, context = ""): string {
  if (isCopilotRuntime()) {
    return JSON.stringify(event === "SessionStart" && context ? { additionalContext: context } : {});
  }

  if (isCodexRuntime()) {
    const output: {
      systemMessage: string;
      hookSpecificOutput?: { hookEventName: HookEvent; additionalContext: string };
    } = {
      systemMessage: `SENIORMODE:${mode.toUpperCase()}`,
    };

    if (context) {
      output.hookSpecificOutput = {
        hookEventName: event,
        additionalContext: context,
      };
    }

    return JSON.stringify(output);
  }

  if (event === "SubagentStart") {
    return JSON.stringify({
      hookSpecificOutput: {
        hookEventName: event,
        additionalContext: context,
      },
    });
  }

  return context;
}

export function writeHookOutput(event: HookEvent, mode: SeniorModeMode, context = ""): void {
  fs.writeSync(1, formatHookOutput(event, mode, context));
}
