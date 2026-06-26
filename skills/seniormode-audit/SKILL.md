---
name: seniormode-audit
description: Audit a project for complexity debt and over-engineering.
license: MIT
---

# SeniorMode Audit

Scan the project for complexity that can be removed without weakening safety or
explicit requirements.

Use this format:

SeniorMode Audit

High-impact trims:
1. ...

Medium-impact trims:
1. ...

Low-impact cleanup:
1. ...

Do not touch:
1. ...

Check for:

- Dead files
- Unused dependencies
- Single-use wrappers
- Unnecessary service layers
- Repeated helpers
- Bloated config
- Premature plugin systems
- Unneeded state management
- Duplicated validation
- Overly broad abstractions

Do not recommend removing safeguards around auth, validation, security,
payments, migrations, deletion, production deploys, accessibility, or explicit
user requirements.
