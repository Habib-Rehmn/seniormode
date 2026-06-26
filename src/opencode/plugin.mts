import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { getSeniorModeInstructions } from "../core/instructions.mjs";
import { DEFAULT_MODE, normalizeMode, type SeniorModeMode } from "../core/modes.mjs";
import { packageRoot, skillsDir } from "../core/paths.mjs";

const statePath = path.join(
  process.env.XDG_CONFIG_HOME || path.join(os.homedir(), ".config"),
  "opencode",
  ".seniormode-active",
);

export interface OpenCodeCommandFile {
  description?: string;
  template: string;
}

export function parseCommandFile(filePath: string): OpenCodeCommandFile | null {
  const content = fs.readFileSync(filePath, "utf8");
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return null;

  const description = match[1].match(/description:\s*(.+)/)?.[1]?.trim();
  return {
    description,
    template: match[2].trim(),
  };
}

function readMode(): SeniorModeMode {
  try {
    return normalizeMode(fs.readFileSync(statePath, "utf8").trim()) || DEFAULT_MODE;
  } catch {
    return DEFAULT_MODE;
  }
}

function writeMode(mode: SeniorModeMode): void {
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  fs.writeFileSync(statePath, mode, "utf8");
}

function commandMode(argumentsText: string | undefined): SeniorModeMode {
  return normalizeMode((argumentsText || "").trim()) || DEFAULT_MODE;
}

export default async function seniorModePlugin({ client }: { client?: { app?: { log?: (input: unknown) => unknown } } } = {}) {
  const log = (level: string, message: string) => {
    try {
      client?.app?.log?.({ body: { service: "seniormode", level, message } });
    } catch {
      // Logging is optional.
    }
  };

  return {
    config: async (config: Record<string, unknown>) => {
      const commandConfig = (config.command ||= {}) as Record<string, OpenCodeCommandFile>;
      const commandDir = path.join(packageRoot(), ".opencode", "command");

      try {
        for (const fileName of fs.readdirSync(commandDir).filter((file) => file.endsWith(".md"))) {
          const parsed = parseCommandFile(path.join(commandDir, fileName));
          if (parsed) commandConfig[path.basename(fileName, ".md")] = parsed;
        }
      } catch {
        // Package can still inject rules without command files.
      }

      const skillsConfig = (config.skills ||= {}) as { paths?: string[] };
      skillsConfig.paths ||= [];
      const packageSkills = skillsDir();
      if (!skillsConfig.paths.includes(packageSkills)) {
        skillsConfig.paths.push(packageSkills);
      }
    },

    "experimental.chat.system.transform": async (_input: unknown, output: { system: string[] }) => {
      const mode = readMode();
      if (mode !== "off") output.system.push(getSeniorModeInstructions(mode));
    },

    "command.execute.before": async (input: { command?: string; arguments?: string }) => {
      if (!input || input.command !== "seniormode") return;

      const mode = commandMode(input.arguments);
      writeMode(mode);
      log("info", `seniormode ${mode}`);
    },
  };
}
