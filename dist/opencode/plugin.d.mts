export interface OpenCodeCommandFile {
    description?: string;
    template: string;
}
export declare function parseCommandFile(filePath: string): OpenCodeCommandFile | null;
export default function seniorModePlugin({ client }?: {
    client?: {
        app?: {
            log?: (input: unknown) => unknown;
        };
    };
}): Promise<{
    config: (config: Record<string, unknown>) => Promise<void>;
    "experimental.chat.system.transform": (_input: unknown, output: {
        system: string[];
    }) => Promise<void>;
    "command.execute.before": (input: {
        command?: string;
        arguments?: string;
    }) => Promise<void>;
}>;
