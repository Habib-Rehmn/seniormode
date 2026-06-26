import fs from "node:fs";
import path from "node:path";
import { normalizeMode, type SeniorModeMode } from "./modes.mjs";
import { claudeConfigDir } from "./paths.mjs";
import type { SeniorModeConfig } from "./config.mjs";

export const STATE_FILE = ".seniormode-active";

function runtimeStateDir(): string | null {
  if (process.env.COPILOT_PLUGIN_DATA) return process.env.COPILOT_PLUGIN_DATA;
  if (process.env.PLUGIN_DATA) return process.env.PLUGIN_DATA;
  if (process.env.CLAUDE_PLUGIN_ROOT || process.env.CLAUDE_CONFIG_DIR) return claudeConfigDir();
  return null;
}

export function getStatePath(config?: Pick<SeniorModeConfig, "stateFile">, cwd = process.cwd()): string {
  const fileName = path.basename(config?.stateFile || STATE_FILE);
  const stateDir = runtimeStateDir();
  if (stateDir) return path.join(stateDir, fileName);

  const configured = config?.stateFile || STATE_FILE;
  return path.resolve(cwd, configured);
}

export function writeMode(mode: SeniorModeMode, config?: Pick<SeniorModeConfig, "stateFile">, cwd = process.cwd()): void {
  const filePath = getStatePath(config, cwd);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, mode, "utf8");
}

export function clearMode(config?: Pick<SeniorModeConfig, "stateFile">, cwd = process.cwd()): void {
  try {
    fs.unlinkSync(getStatePath(config, cwd));
  } catch {
    // State is best effort; missing file already means off.
  }
}

export function readMode(config?: Pick<SeniorModeConfig, "stateFile">, cwd = process.cwd()): SeniorModeMode | null {
  try {
    return normalizeMode(fs.readFileSync(getStatePath(config, cwd), "utf8").trim());
  } catch {
    return null;
  }
}
