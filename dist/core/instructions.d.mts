import { type SeniorModeMode } from "./modes.mjs";
export declare function stripFrontmatter(markdown: string): string;
export declare function filterSkillBodyForMode(body: string, mode: SeniorModeMode): string;
export declare function getFallbackInstructions(mode?: SeniorModeMode): string;
export declare function readSkill(name: string): string | null;
export declare function getSeniorModeInstructions(mode?: SeniorModeMode): string;
