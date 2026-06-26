# Agent Portability

SeniorMode is deliberately just Markdown rules plus small Node.js hooks.

Supported adapter styles:

- `AGENTS.md` for agents that auto-load project instructions
- `skills/*/SKILL.md` for skill-aware agents
- `hooks/claude-codex-hooks.json` for Claude/Codex lifecycle hooks
- `.opencode/command/*.md` and `dist/opencode/plugin.mjs` for OpenCode
- `.github/copilot-instructions.md` for GitHub Copilot fallback instructions
- `.cursor/rules`, `.windsurf/rules`, and `.clinerules` for editor agents

If an agent cannot run hooks, use the instruction-only files. You lose mode
persistence but keep the core behavior.
