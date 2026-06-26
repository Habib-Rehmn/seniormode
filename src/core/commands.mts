import { DEFAULT_MODE, normalizeMode, type SeniorModeMode } from "./modes.mjs";

export interface SeniorModeCommand {
  mode: SeniorModeMode;
  raw: string;
}

export function isDeactivationCommand(input: unknown): boolean {
  const text = String(input || "")
    .trim()
    .toLowerCase()
    .replace(/[.!?\s]+$/, "");

  return text === "stop seniormode" || text === "normal mode" || text === "disable seniormode";
}

export function parseSeniorModeCommand(input: unknown): SeniorModeCommand | null {
  const prompt = String(input || "").trim();
  if (!prompt) return null;

  if (isDeactivationCommand(prompt)) return { mode: "off", raw: prompt };

  const text = prompt.toLowerCase();
  const [first = "", second = ""] = text.split(/\s+/);
  const command = first.replace(/^[@$]/, "/");

  const namespaced = command.match(/^\/seniormode:seniormode(?:-(review|audit|debt|gain|help))?$/);
  const dashed = command.match(/^\/seniormode-(review|audit|debt|gain|help)$/);

  if (namespaced?.[1] || dashed?.[1]) {
    return { mode: (namespaced?.[1] || dashed?.[1]) as SeniorModeMode, raw: prompt };
  }

  if (command !== "/seniormode" && command !== "/seniormode:seniormode") {
    return null;
  }

  return {
    mode: normalizeMode(second) || DEFAULT_MODE,
    raw: prompt,
  };
}
