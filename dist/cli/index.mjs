#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { defaultConfig, loadConfig } from "../core/config.mjs";
import { getSeniorModeInstructions } from "../core/instructions.mjs";
import { DEFAULT_MODE, normalizeMode, RUNTIME_MODES, VALID_MODES } from "../core/modes.mjs";
import { getStatePath, readMode, writeMode, clearMode } from "../core/state.mjs";
import { packageRoot, skillPath } from "../core/paths.mjs";
import { fail, info, warn } from "../core/logger.mjs";
const args = process.argv.slice(2);
const command = args[0] || "help";
function usage() {
    return [
        "SeniorMode - senior-dev rules for AI coding agents",
        "",
        "Usage:",
        "  seniormode init [--force]",
        "  seniormode status",
        "  seniormode doctor",
        "  seniormode install-codex [--global|--project] [--force]",
        "  seniormode mode <off|lite|full|strict|review|audit|debt|gain|help>",
        "  seniormode on",
        "  seniormode off",
        "  seniormode instructions [mode]",
    ].join("\n");
}
function ensureWritableJson(filePath, data, force) {
    if (fs.existsSync(filePath) && !force)
        return false;
    fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
    return true;
}
function initProject(force) {
    const configPath = path.resolve(process.cwd(), ".seniormoderc.json");
    const statePath = path.resolve(process.cwd(), ".seniormode-active");
    const createdConfig = ensureWritableJson(configPath, defaultConfig(), force);
    if (!fs.existsSync(statePath) || force)
        fs.writeFileSync(statePath, `${DEFAULT_MODE}\n`, "utf8");
    info(createdConfig ? `Created ${path.relative(process.cwd(), configPath)}` : `${path.relative(process.cwd(), configPath)} already exists`);
    info(`Active mode: ${DEFAULT_MODE}`);
    info("Hook templates are available in hooks/claude-codex-hooks.json.");
}
function status() {
    const { config, path: configPath } = loadConfig();
    const activeMode = readMode(config) || "off";
    info(activeMode === "off" ? "SeniorMode is off." : "SeniorMode is active.");
    info(`Mode: ${activeMode}`);
    info(`Config: ${configPath ? path.relative(process.cwd(), configPath) : "defaults"}`);
    info(`State: ${path.relative(process.cwd(), getStatePath(config))}`);
}
function setMode(mode) {
    const { config } = loadConfig();
    if (mode === "off") {
        clearMode(config);
        info("SeniorMode is off.");
        return;
    }
    writeMode(mode, config);
    info(`SeniorMode mode: ${mode}`);
}
function doctor() {
    const { config, path: configPath } = loadConfig();
    const checks = [
        ["Node >= 20", Number(process.versions.node.split(".")[0]) >= 20, process.versions.node],
        ["Main skill", fs.existsSync(skillPath("seniormode")), skillPath("seniormode")],
        ["Review skill", fs.existsSync(skillPath("seniormode-review")), skillPath("seniormode-review")],
        ["Hook config", fs.existsSync(path.join(packageRoot(), "hooks", "claude-codex-hooks.json")), "hooks/claude-codex-hooks.json"],
        ["Config readable", true, configPath || "defaults"],
        ["State path", true, getStatePath(config)],
    ];
    let failed = false;
    for (const [label, ok, detail] of checks) {
        info(`${ok ? "ok" : "fail"} ${label}: ${detail}`);
        failed ||= !ok;
    }
    if (failed)
        process.exitCode = 1;
}
function printInstructions(modeValue) {
    const mode = normalizeMode(modeValue || readMode(loadConfig().config) || DEFAULT_MODE);
    if (!mode)
        fail(`Invalid mode. Expected one of: ${VALID_MODES.join(", ")}`);
    info(getSeniorModeInstructions(mode));
}
function copyDirectory(source, destination, force) {
    if (fs.existsSync(destination)) {
        if (!force)
            return "skipped";
        fs.rmSync(destination, { recursive: true, force: true });
    }
    fs.cpSync(source, destination, { recursive: true });
    return "copied";
}
function installCodexSkills(options) {
    const useProject = options.includes("--project");
    const useGlobal = options.includes("--global") || !useProject;
    const force = options.includes("--force");
    const sourceDir = path.join(packageRoot(), "skills");
    const targetDir = useGlobal
        ? path.join(os.homedir(), ".agents", "skills")
        : path.resolve(process.cwd(), ".agents", "skills");
    if (!fs.existsSync(sourceDir)) {
        fail(`Cannot find packaged skills at ${sourceDir}`);
    }
    fs.mkdirSync(targetDir, { recursive: true });
    let copied = 0;
    let skipped = 0;
    for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
        if (!entry.isDirectory())
            continue;
        const result = copyDirectory(path.join(sourceDir, entry.name), path.join(targetDir, entry.name), force);
        if (result === "copied")
            copied += 1;
        else
            skipped += 1;
    }
    info(`Installed SeniorMode skills to ${targetDir}`);
    info(`Copied: ${copied}`);
    if (skipped)
        info(`Skipped existing skills: ${skipped} (use --force to overwrite)`);
    info("Restart Codex, then type /skills or mention $seniormode.");
}
switch (command) {
    case "init":
        initProject(args.includes("--force"));
        break;
    case "status":
        status();
        break;
    case "doctor":
        doctor();
        break;
    case "install-codex":
    case "codex-install":
        installCodexSkills(args.slice(1));
        break;
    case "mode": {
        const mode = normalizeMode(args[1]);
        if (!mode)
            fail(`Invalid mode. Expected one of: ${VALID_MODES.join(", ")}`);
        setMode(mode);
        break;
    }
    case "on":
        setMode("full");
        break;
    case "off":
        setMode("off");
        break;
    case "instructions":
        printInstructions(args[1]);
        break;
    case "help":
    case "--help":
    case "-h":
        info(usage());
        break;
    default:
        if (RUNTIME_MODES.includes(command)) {
            setMode(command);
        }
        else {
            warn(usage());
            process.exitCode = 1;
        }
}
//# sourceMappingURL=index.mjs.map