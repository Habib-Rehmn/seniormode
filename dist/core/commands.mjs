import { DEFAULT_MODE, normalizeMode } from "./modes.mjs";
export function isDeactivationCommand(input) {
    const text = String(input || "")
        .trim()
        .toLowerCase()
        .replace(/[.!?\s]+$/, "");
    return text === "stop seniormode" || text === "normal mode" || text === "disable seniormode";
}
export function parseSeniorModeCommand(input) {
    const prompt = String(input || "").trim();
    if (!prompt)
        return null;
    if (isDeactivationCommand(prompt))
        return { mode: "off", raw: prompt };
    const text = prompt.toLowerCase();
    const [first = "", second = ""] = text.split(/\s+/);
    const command = first.replace(/^[@$]/, "/");
    const namespaced = command.match(/^\/seniormode:seniormode(?:-(review|audit|debt|gain|help))?$/);
    const dashed = command.match(/^\/seniormode-(review|audit|debt|gain|help)$/);
    if (namespaced?.[1] || dashed?.[1]) {
        return { mode: (namespaced?.[1] || dashed?.[1]), raw: prompt };
    }
    if (command !== "/seniormode" && command !== "/seniormode:seniormode") {
        return null;
    }
    return {
        mode: normalizeMode(second) || DEFAULT_MODE,
        raw: prompt,
    };
}
//# sourceMappingURL=commands.mjs.map