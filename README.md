# SeniorMode

SeniorMode is a behavior package for AI coding agents.

It makes agents work more like a practical senior developer:

- Reuse existing code.
- Prefer small focused changes.
- Avoid unnecessary abstractions.
- Avoid new dependencies unless they clearly pay for themselves.
- Fix root causes instead of symptoms.
- Keep safeguards around security, validation, data loss, accessibility, and explicit requirements.

## Install

```bash
npm install -D seniormode
npx seniormode init
```

For Claude Code or Codex-style plugin installs, use:

```txt
hooks/claude-codex-hooks.json
```

For OpenCode, add:

```json
{
  "plugin": ["seniormode/opencode/plugin"]
}
```

For instruction-only agents, copy or reference `AGENTS.md`, `.cursor/rules`,
`.windsurf/rules`, `.clinerules`, or `.github/copilot-instructions.md`.

## Commands

```bash
npx seniormode status
npx seniormode mode full
npx seniormode mode strict
npx seniormode off
npx seniormode doctor
npx seniormode instructions
```

Agent slash commands:

```txt
/seniormode
/seniormode lite
/seniormode full
/seniormode strict
/seniormode off
/seniormode review
/seniormode audit
/seniormode debt
/seniormode gain
```

Aliases such as `/seniormode-review` and `/seniormode-audit` are also shipped
as command adapter files.

## Modes

| Mode | Purpose |
|------|---------|
| `off` | Disable SeniorMode |
| `lite` | Build what was asked and mention the simpler option |
| `full` | Default senior-dev behavior |
| `strict` | Stronger anti-overengineering mode |
| `review` | Review-only mode |
| `audit` | Project complexity audit |
| `debt` | Inspect intentional simplifications |
| `gain` | Summarize complexity avoided |

## Config

Project config:

```json
{
  "defaultMode": "full",
  "stateFile": ".seniormode-active",
  "enableSubagents": true,
  "enableReviewCommand": true,
  "enableAuditCommand": true
}
```

Resolution order:

1. Explicit command input
2. `SENIORMODE_MODE` or `SENIORMODE_DEFAULT_MODE`
3. Project `.seniormoderc.json` or `seniormode.config.json`
4. User config at `~/.config/seniormode/config.json`
5. Fallback `full`

## Development

```bash
npm install
npm test
```

The runtime package has no production dependencies.
