import { type SeniorModeMode } from "./modes.mjs";
export interface SeniorModeCommand {
    mode: SeniorModeMode;
    raw: string;
}
export declare function isDeactivationCommand(input: unknown): boolean;
export declare function parseSeniorModeCommand(input: unknown): SeniorModeCommand | null;
