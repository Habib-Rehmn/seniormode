import { type SeniorModeMode } from "./modes.mjs";
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
export declare function findProjectConfig(cwd?: string): string | null;
export declare function loadConfig(cwd?: string): LoadedConfig;
export declare function resolveDefaultMode(explicitMode?: unknown, cwd?: string): SeniorModeMode;
export declare function defaultConfig(): SeniorModeConfig;
