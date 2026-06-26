import fs from "node:fs";
import path from "node:path";
import { DEFAULT_MODE, normalizeMode, type SeniorModeMode } from "./modes.mjs";
import { userConfigPath } from "./paths.mjs";

export interface SeniorModeConfig {
  defaultMode: SeniorModeMode;
  stateFile: string;
  enableSubagents: boolean;
  enableReviewCommand: boolean;
  enableAuditCommand: boolean;
}

export interface LoadedConfig {
  config: SeniorModeConfig;
  path: string | null;
}

const DEFAULT_CONFIG: SeniorModeConfig = {
  defaultMode: DEFAULT_MODE,
  stateFile: ".seniormode-active",
  enableSubagents: true,
  enableReviewCommand: true,
  enableAuditCommand: true,
};

const PROJECT_CONFIG_FILES = [".seniormoderc.json", "seniormode.config.json"];

function readJson(filePath: string): Record<string, unknown> | null {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "")) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function mergeConfig(base: SeniorModeConfig, input: Record<string, unknown> | null): SeniorModeConfig {
  if (!input) return base;

  return {
    defaultMode: normalizeMode(input.defaultMode) || base.defaultMode,
    stateFile: typeof input.stateFile === "string" && input.stateFile.trim()
      ? input.stateFile.trim()
      : base.stateFile,
    enableSubagents: typeof input.enableSubagents === "boolean" ? input.enableSubagents : base.enableSubagents,
    enableReviewCommand: typeof input.enableReviewCommand === "boolean"
      ? input.enableReviewCommand
      : base.enableReviewCommand,
    enableAuditCommand: typeof input.enableAuditCommand === "boolean"
      ? input.enableAuditCommand
      : base.enableAuditCommand,
  };
}

export function findProjectConfig(cwd = process.cwd()): string | null {
  for (const fileName of PROJECT_CONFIG_FILES) {
    const candidate = path.resolve(cwd, fileName);
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

export function loadConfig(cwd = process.cwd()): LoadedConfig {
  const userPath = userConfigPath();
  const projectPath = findProjectConfig(cwd);

  let config = mergeConfig(DEFAULT_CONFIG, readJson(userPath));
  config = mergeConfig(config, projectPath ? readJson(projectPath) : null);

  const envMode = normalizeMode(process.env.SENIORMODE_MODE || process.env.SENIORMODE_DEFAULT_MODE);
  if (envMode) config = { ...config, defaultMode: envMode };

  return {
    config,
    path: projectPath || (fs.existsSync(userPath) ? userPath : null),
  };
}

export function resolveDefaultMode(explicitMode?: unknown, cwd = process.cwd()): SeniorModeMode {
  return normalizeMode(explicitMode) || loadConfig(cwd).config.defaultMode;
}

export function defaultConfig(): SeniorModeConfig {
  return { ...DEFAULT_CONFIG };
}
