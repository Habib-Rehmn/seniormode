import test from "node:test";
import assert from "node:assert/strict";

import {
  filterSkillBodyForMode,
  getSeniorModeInstructions,
  stripFrontmatter,
} from "../dist/core/index.mjs";

test("strips markdown frontmatter", () => {
  assert.equal(stripFrontmatter("---\nname: x\n---\n# Body"), "# Body");
});

test("loads primary instructions", () => {
  const instructions = getSeniorModeInstructions("full");
  assert.match(instructions, /SENIORMODE ACTIVE - mode: full/);
  assert.match(instructions, /The Ladder/);
  assert.match(instructions, /Safety Boundaries/);
});

test("loads task-mode skill instructions", () => {
  const instructions = getSeniorModeInstructions("review");
  assert.match(instructions, /SENIORMODE ACTIVE - mode: review/);
  assert.match(instructions, /Verdict: Ship/);
});

test("filters mode-specific table and examples", () => {
  const body = [
    "| **lite** | lite row |",
    "| **full** | full row |",
    "| **strict** | strict row |",
    "- lite: lite example",
    "- full: full example",
    "- strict: strict example",
    "- Normal bullet",
  ].join("\n");

  const filtered = filterSkillBodyForMode(body, "strict");
  assert.match(filtered, /strict row/);
  assert.doesNotMatch(filtered, /lite row/);
  assert.doesNotMatch(filtered, /full example/);
  assert.match(filtered, /Normal bullet/);
});
