import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";

import plugin, { parseCommandFile } from "../dist/opencode/plugin.mjs";

const root = path.resolve(new URL("..", import.meta.url).pathname);

test("parses OpenCode command frontmatter", () => {
  const parsed = parseCommandFile(path.join(root, ".opencode", "command", "seniormode.md"));
  assert.equal(parsed.description, "Switch SeniorMode intensity level (lite/full/strict/off)");
  assert.match(parsed.template, /Switch to SeniorMode/);
});

test("OpenCode plugin registers commands and injects instructions", async () => {
  const instance = await plugin();
  const config = {};
  await instance.config(config);

  assert.ok(config.command.seniormode);
  assert.ok(config.skills.paths.some((entry) => entry.endsWith("skills")));

  const output = { system: [] };
  await instance["experimental.chat.system.transform"]({}, output);
  assert.equal(output.system.length, 1);
  assert.match(output.system[0], /SENIORMODE ACTIVE/);
});
