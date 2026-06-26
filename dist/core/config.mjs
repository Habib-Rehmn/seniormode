import fs from "node:fs";
import path from "node:path";
import { DEFAULT_MODE, normalizeMode } from "./modes.mjs";
import { userConfigPath } from "./paths.mjs";
const DEFAULT_CONFIG = {
    defaultMode: DEFAULT_MODE,
    stateFile: ".seniormode-active",
    enableSubagents: true,
    enableReviewCommand: true,
    enableAuditCommand: true,
};
const PROJECT_CONFIG_FILES = [".seniormoderc.json", "seniormode.config.json"];
function readJson(filePath) {
    try {
        return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
    }
    catch {
        return null;
    }
}
function mergeConfig(base, input) {
    if (!input)
        return base;
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
export function findProjectConfig(cwd = process.cwd()) {
    for (const fileName of PROJECT_CONFIG_FILES) {
        const candidate = path.resolve(cwd, fileName);
        if (fs.existsSync(candidate))
            return candidate;
    }
    return null;
}
export function loadConfig(cwd = process.cwd()) {
    const userPath = userConfigPath();
    const projectPath = findProjectConfig(cwd);
    let config = mergeConfig(DEFAULT_CONFIG, readJson(userPath));
    config = mergeConfig(config, projectPath ? readJson(projectPath) : null);
    const envMode = normalizeMode(process.env.SENIORMODE_MODE || process.env.SENIORMODE_DEFAULT_MODE);
    if (envMode)
        config = { ...config, defaultMode: envMode };
    return {
        config,
        path: projectPath || (fs.existsSync(userPath) ? userPath : null),
    };
}
export function resolveDefaultMode(explicitMode, cwd = process.cwd()) {
    return normalizeMode(explicitMode) || loadConfig(cwd).config.defaultMode;
}
export function defaultConfig() {
    return { ...DEFAULT_CONFIG };
}
//# sourceMappingURL=config.mjs.map