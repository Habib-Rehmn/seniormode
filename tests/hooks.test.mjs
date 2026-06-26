import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = path.resolve(new URL("..", import.meta.url).pathname);

function runHook(script, env, input) {
  return spawnSync(process.execPath, [path.join(root, "dist", "hooks", script)], {
    cwd: root,
    env: {
      PATH: process.env.PATH,
      HOME: env.HOME,
      USERPROFILE: env.USERPROFILE || env.HOME,
      ...env,
      ...(input === undefined ? {} : { SENIORMODE_HOOK_INPUT: input }),
    },
    encoding: "utf8",
    timeout: 5000,
  });
}

test("Codex activation writes state and emits JSON context", () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "seniormode-hooks-"));
  const pluginData = path.join(temp, "plugin-data");
  const env = {
    HOME: path.join(temp, "home"),
    USERPROFILE: path.join(temp, "home"),
    PLUGIN_DATA: pluginData,
    SENIORMODE_MODE: "strict",
  };

  const result = runHook("activate.mjs", env);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(fs.readFileSync(path.join(pluginData, ".seniormode-active"), "utf8"), "strict");

  const output = JSON.parse(result.stdout);
  assert.equal(output.systemMessage, "SENIORMODE:STRICT");
  assert.match(output.hookSpecificOutput.additionalContext, /mode: strict/);
});

test("mode tracker switches mode and ignores incidental normal mode text", () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "seniormode-hooks-"));
  const pluginData = path.join(temp, "plugin-data");
  const env = {
    HOME: path.join(temp, "home"),
    USERPROFILE: path.join(temp, "home"),
    PLUGIN_DATA: pluginData,
  };

  let result = runHook("mode-tracker.mjs", env, JSON.stringify({ prompt: "@seniormode lite" }));
  assert.equal(result.status, 0, result.stderr);
  assert.equal(fs.readFileSync(path.join(pluginData, ".seniormode-active"), "utf8"), "lite");
  assert.equal(JSON.parse(result.stdout).systemMessage, "SENIORMODE:LITE");

  result = runHook("mode-tracker.mjs", env, JSON.stringify({ prompt: "add a normal mode toggle" }));
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, "");
  assert.equal(fs.readFileSync(path.join(pluginData, ".seniormode-active"), "utf8"), "lite");

  result = runHook("mode-tracker.mjs", env, JSON.stringify({ prompt: "normal mode" }));
  assert.equal(result.status, 0, result.stderr);
  assert.equal(fs.existsSync(path.join(pluginData, ".seniormode-active")), false);
  assert.equal(JSON.parse(result.stdout).systemMessage, "SENIORMODE:OFF");
});

test("subagent hook stays silent when off and injects when active", () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "seniormode-hooks-"));
  const pluginData = path.join(temp, "plugin-data");
  const env = {
    HOME: path.join(temp, "home"),
    USERPROFILE: path.join(temp, "home"),
    PLUGIN_DATA: pluginData,
  };

  let result = runHook("subagent.mjs", env);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, "");

  fs.mkdirSync(pluginData, { recursive: true });
  fs.writeFileSync(path.join(pluginData, ".seniormode-active"), "full", "utf8");
  result = runHook("subagent.mjs", env);
  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.equal(output.systemMessage, "SENIORMODE:FULL");
  assert.equal(output.hookSpecificOutput.hookEventName, "SubagentStart");
});
