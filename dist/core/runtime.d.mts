import type { SeniorModeMode } from "./modes.mjs";
export type HookEvent = "SessionStart" | "UserPromptSubmit" | "SubagentStart";
export declare function isCopilotRuntime(): boolean;
export declare function isCodexRuntime(): boolean;
export declare function formatHookOutput(event: HookEvent, mode: SeniorModeMode, context?: string): string;
export declare function writeHookOutput(event: HookEvent, mode: SeniorModeMode, context?: string): void;
