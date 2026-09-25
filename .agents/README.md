# `.agents/` directory

**Skills** (`skills/<name>/SKILL.md`) — actionable workflows with YAML frontmatter for dispatch. Keep each skill focused; prefer under 500 lines. Put long examples in `docs/`.

**Docs** (plain files under `docs/`) — reference and examples only; no frontmatter; not auto-dispatched.

**Load order:** root `AGENTS.md` → matching `SKILL.md` → `docs/` when the skill points there.

## Authoring

| Add a skill when… | Add a doc when… |
| --- | --- |
| The agent must follow steps or rules for a task type | You need examples, audit notes, or rationale |
| It should trigger from frontmatter description | It is lookup material loaded on demand |

Register new skills in root `AGENTS.md` workflow or quick reference. For Cursor slash-menu discovery of Codex-enabled skills, symlink `.cursor/skills/<name>` → `../../.agents/skills/<name>`.

## Cursor (shared in git)

| Path | Purpose |
| --- | --- |
| `.cursor/cli.json` | Project CLI/agent attribution (`attributePRsToAgent` / `attributeCommitsToAgent` off). Overrides personal defaults for this repo. |
| `.cursor/rules/` | IDE agent rules (for example no Cursor footer on PR bodies). |
| `.cursor/mcp.json` | Shared MCP server entries for the app. |
| `.cursor/skills/` | Symlinks into `.agents/skills/` for slash-menu discovery. |

Personal `~/.cursor/cli-config.json` is not committed. In **Cursor Settings → Agent → Attribution**, turn off PR and commit attribution if the IDE still adds footers (enterprise policies can override local config).

**Codex:** optional `agents/openai.yaml` per skill. **Cursor:** frontmatter `icon`, `color`; ignores `openai.yaml`.

## Skills in this repo

`architecture`, `baseline-javascript`, `guide`, `orchestrate`, `security`, `ship-pr`, `styling`, `testing`, `visual-recap`, `web-animation-design` (manual invoke only), `web-interface-guidelines`, `worktree`.

**PR transport:** use `pr-cockpit owner/repo#N` for reads, waits, resolves, and `edit-body` — not raw `gh pr` when Cockpit is available.

**Checks:** `pnpm check:agents` validates backtick path references under `.agents/` and `docs/contributing/architecture/primitives.yaml`.
