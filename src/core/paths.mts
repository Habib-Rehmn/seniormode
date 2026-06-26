import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export function packageRoot(): string {
  return path.resolve(dirname, "..", "..");
}

export function skillsDir(): string {
  return path.join(packageRoot(), "skills");
}

export function skillPath(name: string): string {
  return path.join(skillsDir(), name, "SKILL.md");
}

export function userConfigDir(): string {
  if (process.env.XDG_CONFIG_HOME) {
    return path.join(process.env.XDG_CONFIG_HOME, "seniormode");
  }

  if (process.platform === "win32") {
    return path.join(
      process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming"),
      "seniormode",
    );
  }

  return path.join(os.homedir(), ".config", "seniormode");
}

export function userConfigPath(): string {
  return path.join(userConfigDir(), "config.json");
}

export function claudeConfigDir(): string {
  return process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), ".claude");
}
