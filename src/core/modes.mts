export const DEFAULT_MODE = "full" as const;

export const RUNTIME_MODES = ["off", "lite", "full", "strict"] as const;
export const TASK_MODES = ["review", "audit", "debt", "gain", "help"] as const;
export const VALID_MODES = [...RUNTIME_MODES, ...TASK_MODES] as const;

export type RuntimeMode = (typeof RUNTIME_MODES)[number];
export type TaskMode = (typeof TASK_MODES)[number];
export type SeniorModeMode = (typeof VALID_MODES)[number];

const runtimeModes = new Set<string>(RUNTIME_MODES);
const validModes = new Set<string>(VALID_MODES);

export function normalizeRuntimeMode(value: unknown): RuntimeMode | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  return runtimeModes.has(normalized) ? (normalized as RuntimeMode) : null;
}

export function normalizeMode(value: unknown): SeniorModeMode | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  return validModes.has(normalized) ? (normalized as SeniorModeMode) : null;
}

export function isTaskMode(mode: SeniorModeMode): mode is TaskMode {
  return (TASK_MODES as readonly string[]).includes(mode);
}
