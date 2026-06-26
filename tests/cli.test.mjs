import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = path.resolve(new URL("..", import.meta.url).pathname);

function runCli(args, env = {}) {
  return spawnSync(process.execPath, [path.join(root, "dist", "cli", "index.mjs"), ...args], {
    cwd: root,
    env: {
      ...process.env,
      ...env,
    },
    encoding: "utf8",
  });
}

test("install-codex installs skills to the user skill directory", () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), "seniormode-cli-home-"));
  const result = runCli(["install-codex", "--global"], {
    HOME: home,
    USERPROFILE: home,
  });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Installed SeniorMode skills/);
  assert.ok(fs.existsSync(path.join(home, ".agents", "skills", "seniormode", "SKILL.md")));
  assert.ok(fs.existsSync(path.join(home, ".agents", "skills", "seniormode-review", "SKILL.md")));
});

test("install-codex --project installs skills to the current repo", () => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "seniormode-cli-project-"));
  const result = spawnSync(process.execPath, [path.join(root, "dist", "cli", "index.mjs"), "install-codex", "--project"], {
    cwd,
    env: process.env,
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr);
  assert.ok(fs.existsSync(path.join(cwd, ".agents", "skills", "seniormode", "SKILL.md")));
});
