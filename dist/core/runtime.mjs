import fs from "node:fs";
export function isCopilotRuntime() {
    return Boolean(process.env.COPILOT_PLUGIN_DATA);
}
export function isCodexRuntime() {
    return !isCopilotRuntime() && Boolean(process.env.PLUGIN_DATA);
}
export function formatHookOutput(event, mode, context = "") {
    if (isCopilotRuntime()) {
        return JSON.stringify(event === "SessionStart" && context ? { additionalContext: context } : {});
    }
    if (isCodexRuntime()) {
        const output = {
            systemMessage: `SENIORMODE:${mode.toUpperCase()}`,
        };
        if (context) {
            output.hookSpecificOutput = {
                hookEventName: event,
                additionalContext: context,
            };
        }
        return JSON.stringify(output);
    }
    if (event === "SubagentStart") {
        return JSON.stringify({
            hookSpecificOutput: {
                hookEventName: event,
                additionalContext: context,
            },
        });
    }
    return context;
}
export function writeHookOutput(event, mode, context = "") {
    fs.writeSync(1, formatHookOutput(event, mode, context));
}
//# sourceMappingURL=runtime.mjs.map