---
name: seniormode-help
description: Explain SeniorMode commands and usage.
license: MIT
---

# SeniorMode Help

SeniorMode is a behavior layer for coding agents.

Commands:

- `/seniormode` - switch to full mode
- `/seniormode lite` - gentle simplicity suggestions
- `/seniormode full` - default senior-dev behavior
- `/seniormode strict` - stronger anti-overengineering mode
- `/seniormode off` - disable SeniorMode
- `/seniormode-review` or `/seniormode review` - review a plan, diff, or implementation
- `/seniormode-audit` or `/seniormode audit` - audit project complexity
- `/seniormode-debt` or `/seniormode debt` - inspect intentional simplifications
- `/seniormode-gain` or `/seniormode gain` - summarize complexity avoided

The ladder:

1. Avoid it if it is speculative.
2. Reuse existing code.
3. Reuse existing helpers.
4. Use the standard library.
5. Use native platform or framework features.
6. Use installed dependencies.
7. Write a small local function.
8. Only then create new abstractions or systems.
