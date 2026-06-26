# SeniorMode

SeniorMode is a behavior layer for AI coding agents.

It pushes coding agents toward practical senior-developer decisions:

- Reuse existing code before writing new code.
- Prefer small focused changes.
- Use standard library and native platform features first.
- Avoid unnecessary abstractions, config, and dependencies.
- Fix root causes instead of patching symptoms.
- Keep safeguards around security, validation, data loss, accessibility, and explicit requirements.

SeniorMode does not mean quick bad code. It means small code with serious
thinking behind it.

## Quick Start

Install the package:

```bash
npm install -D seniormode
```

Check that it works:

```bash
npx seniormode doctor
```

Print the rules for any mode:

```bash
npx seniormode instructions full
npx seniormode instructions strict
```

## Use With Codex

Codex supports skills through the skill picker and skill mentions. npm packages
do not automatically add custom commands to the `/` menu.

### Option 1: Install Skills From npm

Install SeniorMode skills globally for Codex:

```bash
npx seniormode install-codex --global
```

Or install them only in the current project:

```bash
cd path/to/your/project
npx seniormode install-codex --project
```

Restart Codex after installing. Then use:

```txt
/skills
```

or mention a skill directly:

```txt
$seniormode
$seniormode-review
$seniormode-audit
```

### Option 2: Codex Plugin Marketplace

For Ponytail-style installation, publish this repo on GitHub with a
`.agents/plugins/marketplace.json` file that points to your repo.

Example marketplace file:

```json
{
  "name": "seniormode",
  "interface": {
    "displayName": "SeniorMode"
  },
  "plugins": [
    {
      "name": "seniormode",
      "source": {
        "source": "url",
        "url": "https://github.com/Habib-Rehmn/seniormode.git",
        "ref": "main"
      },
      "policy": {
        "installation": "AVAILABLE",
        "authentication": "ON_INSTALL"
      },
      "category": "Productivity"
    }
  ]
}
```

Then install it in Codex:

```bash
codex plugin marketplace add Habib-Rehmn/seniormode
codex
```

Inside Codex:

```txt
/plugins
```

Install SeniorMode, then:

```txt
/hooks
```

Review and trust the SeniorMode lifecycle hooks. Start a new thread after
trusting the hooks.

The plugin uses:

- `skills/` for skill definitions
- `hooks/claude-codex-hooks.json` for lifecycle injection
- `dist/hooks/*.mjs` for runtime hook scripts

## Use With OpenCode

Add the plugin to `opencode.json`:

```json
{
  "plugin": ["seniormode/opencode/plugin"]
}
```

OpenCode will register the shipped command files and add the SeniorMode skill
directory to its skill paths.

## Use With Instruction-Only Agents

For agents that only read project instructions, generate an `AGENTS.md` file:

```bash
npx seniormode instructions full > AGENTS.md
```

For stricter anti-overengineering behavior:

```bash
npx seniormode instructions strict > AGENTS.md
```

The package also ships fallback instruction files for common agent tools:

- `AGENTS.md`
- `.cursor/rules/seniormode.mdc`
- `.windsurf/rules/seniormode.md`
- `.clinerules/seniormode.md`
- `.github/copilot-instructions.md`

## CLI Commands

```bash
npx seniormode init
npx seniormode status
npx seniormode doctor
npx seniormode mode full
npx seniormode mode strict
npx seniormode off
npx seniormode instructions [mode]
npx seniormode install-codex --global
npx seniormode install-codex --project
```

## Agent Commands And Skills

These command adapter files are shipped for hosts that support custom command
files:

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

Codex IDE currently exposes SeniorMode through `/skills` and `$seniormode`,
not as a custom `/seniormode` slash-menu item.

## Modes

| Mode | Purpose |
|------|---------|
| `off` | Disable SeniorMode |
| `lite` | Build what was asked and mention the simpler option |
| `full` | Default senior-dev behavior |
| `strict` | Stronger anti-overengineering behavior |
| `review` | Review a plan, diff, or implementation |
| `audit` | Audit project complexity |
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

Before publishing:

```bash
npm test
npm pack --dry-run
```
