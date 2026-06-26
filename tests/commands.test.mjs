import test from "node:test";
import assert from "node:assert/strict";

import {
  isDeactivationCommand,
  parseSeniorModeCommand,
} from "../dist/core/index.mjs";

test("parses base mode commands", () => {
  assert.deepEqual(parseSeniorModeCommand("/seniormode"), {
    mode: "full",
    raw: "/seniormode",
  });
  assert.equal(parseSeniorModeCommand("@seniormode lite")?.mode, "lite");
  assert.equal(parseSeniorModeCommand("$seniormode strict")?.mode, "strict");
  assert.equal(parseSeniorModeCommand("/seniormode off")?.mode, "off");
});

test("parses task command aliases", () => {
  assert.equal(parseSeniorModeCommand("/seniormode-review")?.mode, "review");
  assert.equal(parseSeniorModeCommand("/seniormode audit")?.mode, "audit");
  assert.equal(parseSeniorModeCommand("/seniormode:seniormode-debt")?.mode, "debt");
  assert.equal(parseSeniorModeCommand("/seniormode gain")?.mode, "gain");
});

test("deactivation requires a standalone phrase", () => {
  assert.equal(isDeactivationCommand("normal mode"), true);
  assert.equal(parseSeniorModeCommand("disable seniormode!")?.mode, "off");
  assert.equal(parseSeniorModeCommand("add a normal mode toggle"), null);
});
