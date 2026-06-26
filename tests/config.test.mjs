import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  defaultConfig,
  findProjectConfig,
  loadConfig,
  resolveDefaultMode,
} from "../dist/core/index.mjs";

test("loads defaults without config files", () => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "seniormode-config-"));
  assert.deepEqual(loadConfig(cwd).config, defaultConfig());
  assert.equal(findProjectConfig(cwd), null);
});

test("project config overrides user config and env overrides both", () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "seniormode-config-"));
  const cwd = path.join(temp, "project");
  const xdg = path.join(temp, "xdg");
  fs.mkdirSync(cwd, { recursive: true });
  fs.mkdirSync(path.join(xdg, "seniormode"), { recursive: true });
  fs.writeFileSync(
    path.join(xdg, "seniormode", "config.json"),
    JSON.stringify({ defaultMode: "lite", stateFile: ".user-state" }),
  );
  fs.writeFileSync(
    path.join(cwd, ".seniormoderc.json"),
    JSON.stringify({ defaultMode: "strict", stateFile: ".project-state" }),
  );

  const oldXdg = process.env.XDG_CONFIG_HOME;
  const oldMode = process.env.SENIORMODE_MODE;
  process.env.XDG_CONFIG_HOME = xdg;
  delete process.env.SENIORMODE_MODE;

  try {
    assert.equal(loadConfig(cwd).config.defaultMode, "strict");
    assert.equal(loadConfig(cwd).config.stateFile, ".project-state");
    process.env.SENIORMODE_MODE = "audit";
    assert.equal(resolveDefaultMode(undefined, cwd), "audit");
  } finally {
    if (oldXdg === undefined) delete process.env.XDG_CONFIG_HOME;
    else process.env.XDG_CONFIG_HOME = oldXdg;
    if (oldMode === undefined) delete process.env.SENIORMODE_MODE;
    else process.env.SENIORMODE_MODE = oldMode;
  }
});
