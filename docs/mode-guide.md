# Mode Guide

Use `full` unless you have a reason not to.

- `lite`: useful when you want the agent to comply first and only mention a
  simpler option.
- `full`: default. Enforces reuse, stdlib/native-first choices, and small diffs.
- `strict`: useful in bloated codebases or when an agent keeps adding layers.
- `review`: use for reviewing plans, diffs, or implementations.
- `audit`: use for project-wide complexity scans.
- `debt`: use to inspect `seniormode:` comments and known simplifications.
- `gain`: use after a change to summarize avoided complexity.
