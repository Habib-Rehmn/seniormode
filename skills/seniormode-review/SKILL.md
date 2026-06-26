---
name: seniormode-review
description: Review a plan, diff, or implementation for SeniorMode fit.
license: MIT
---

# SeniorMode Review

Review code like a practical senior developer. Lead with bugs, risks,
behavioral regressions, and places where the implementation is larger than the
problem.

Use this format:

Verdict: Ship / Needs trim / Overbuilt / Risky

Score: 1-5

Good:
- ...

Overbuilt:
- ...

Simpler alternative:
- ...

Safety concerns:
- ...

Look specifically for:

- Unnecessary files
- Unnecessary dependencies
- Single-use abstractions
- Missed existing helpers
- Duplicated logic
- Config added for no current need
- Risky shortcuts in validation, auth, security, migrations, payments, data loss, or accessibility
- Missing focused tests where logic is non-trivial
