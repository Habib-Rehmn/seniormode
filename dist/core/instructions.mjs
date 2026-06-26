import fs from "node:fs";
import { DEFAULT_MODE, isTaskMode, normalizeMode, normalizeRuntimeMode } from "./modes.mjs";
import { skillPath } from "./paths.mjs";
const MODE_SKILLS = {
    review: "seniormode-review",
    audit: "seniormode-audit",
    debt: "seniormode-debt",
    gain: "seniormode-gain",
    help: "seniormode-help",
};
export function stripFrontmatter(markdown) {
    return markdown.replace(/^---[\s\S]*?---\s*/, "").trimStart();
}
export function filterSkillBodyForMode(body, mode) {
    const runtimeMode = normalizeRuntimeMode(mode) || DEFAULT_MODE;
    const withoutFrontmatter = stripFrontmatter(body);
    return withoutFrontmatter
        .split(/\r?\n/)
        .filter((line) => {
        const tableLabel = line.match(/^\|\s*\*\*(.+?)\*\*\s*\|/);
        if (tableLabel) {
            const labelMode = normalizeRuntimeMode(tableLabel[1]);
            if (labelMode)
                return labelMode === runtimeMode;
        }
        const exampleLabel = line.match(/^-\s*([^:]+):\s*/);
        if (exampleLabel) {
            const labelMode = normalizeRuntimeMode(exampleLabel[1]);
            if (labelMode)
                return labelMode === runtimeMode;
        }
        return true;
    })
        .join("\n")
        .trim();
}
export function getFallbackInstructions(mode = DEFAULT_MODE) {
    const effective = normalizeMode(mode) || DEFAULT_MODE;
    return [
        `SENIORMODE ACTIVE - mode: ${effective}`,
        "",
        "Act like a practical senior developer. Small code, serious thinking.",
        "",
        "Before coding, read the relevant code and stop at the first rung that holds:",
        "1. Can this be avoided?",
        "2. Can existing code solve it?",
        "3. Can an existing helper be reused?",
        "4. Can the standard library or platform solve it?",
        "5. Can an installed dependency solve it?",
        "6. Can a small local function solve it?",
        "7. Only then create a new abstraction, file, package, or system.",
        "",
        "Do not simplify away security, validation, auth, data-loss handling, accessibility, hardware calibration, migrations, or explicit user requirements.",
    ].join("\n");
}
export function readSkill(name) {
    try {
        return fs.readFileSync(skillPath(name), "utf8");
    }
    catch {
        return null;
    }
}
export function getSeniorModeInstructions(mode = DEFAULT_MODE) {
    const normalized = normalizeMode(mode) || DEFAULT_MODE;
    if (isTaskMode(normalized)) {
        const taskSkill = readSkill(MODE_SKILLS[normalized]);
        if (taskSkill) {
            return `SENIORMODE ACTIVE - mode: ${normalized}\n\n${stripFrontmatter(taskSkill).trim()}`;
        }
    }
    const base = readSkill("seniormode");
    if (!base)
        return getFallbackInstructions(normalized);
    return `SENIORMODE ACTIVE - mode: ${normalized}\n\n${filterSkillBodyForMode(base, normalized)}`;
}
//# sourceMappingURL=instructions.mjs.map