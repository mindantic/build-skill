# Build

A spec driven build pipeline for Claude Code. Every feature goes from a brief to a spec with acceptance criteria, then through attention to detail, QA and handoff gates, so nothing ships half done or unpolished.

## Install

```bash
claude plugins marketplace add mindantic/build-skill
claude plugins install build@build-local
```

## Pipeline

| Command | What it does | Writes |
|---|---|---|
| `/build:build` | Works out the next step and runs it | |
| `/build:brief` | Collects the brief | `docs/brief.md`, `docs/project.md`, `docs/decisions.md` |
| `/build:research` | Competitor analysis | `docs/research/<competitor>.md` |
| `/build:workflow` | How tasks run, project rules | `docs/workflow.md`, `docs/rules.md` |
| `/build:design` | Design direction from inspiration | `docs/design.md` |
| `/build:dev` | Technical decisions | `docs/dev.md` |
| `/build:srs` | Phases, features and tasks with acceptance criteria | `docs/specs/phase-NN-<slug>.md` |
| `/build:execute` | Builds a phase or task | code |
| `/build:atd` | Attention to detail gate | `docs/evidence/task-NNN/atd.md` |
| `/build:qa` | Functional QA gate | `docs/evidence/task-NNN/qa.md` |
| `/build:handoff` | Final gate, marks tasks Done | |
| `/build:check` | Current status and next step | |

Every command works with no arguments. Claude asks one question at a time, each with options, a recommendation, and why or why not, until nothing is left to guess.

## Rules that make it work

- Only `/build:handoff` can mark a task Done, and only when atd and qa both passed on the current code.
- Every expected behavior is an acceptance criterion. If it is not one, it is not built or checked.
- Gates verify in a real browser with agent-browser at 375, 768, 1024 and 1440, and every pass needs evidence.
- `reference/baseline.md` is the global detail standard. A project's `docs/rules.md` extends it.

## License

MIT
