export const DEFAULT_MODE = "full";
export const RUNTIME_MODES = ["off", "lite", "full", "strict"];
export const TASK_MODES = ["review", "audit", "debt", "gain", "help"];
export const VALID_MODES = [...RUNTIME_MODES, ...TASK_MODES];
const runtimeModes = new Set(RUNTIME_MODES);
const validModes = new Set(VALID_MODES);
export function normalizeRuntimeMode(value) {
    if (typeof value !== "string")
        return null;
    const normalized = value.trim().toLowerCase();
    return runtimeModes.has(normalized) ? normalized : null;
}
export function normalizeMode(value) {
    if (typeof value !== "string")
        return null;
    const normalized = value.trim().toLowerCase();
    return validModes.has(normalized) ? normalized : null;
}
export function isTaskMode(mode) {
    return TASK_MODES.includes(mode);
}
//# sourceMappingURL=modes.mjs.map