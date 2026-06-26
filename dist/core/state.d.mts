import { type SeniorModeMode } from "./modes.mjs";
import type { SeniorModeConfig } from "./config.mjs";
export declare const STATE_FILE = ".seniormode-active";
export declare function getStatePath(config?: Pick<SeniorModeConfig, "stateFile">, cwd?: string): string;
export declare function writeMode(mode: SeniorModeMode, config?: Pick<SeniorModeConfig, "stateFile">, cwd?: string): void;
export declare function clearMode(config?: Pick<SeniorModeConfig, "stateFile">, cwd?: string): void;
export declare function readMode(config?: Pick<SeniorModeConfig, "stateFile">, cwd?: string): SeniorModeMode | null;
