# Build Conventions

Every `build` skill follows this file. Read it fully before doing anything else.

## Docs layout

All project docs live in `/docs` at the project root.

| File | Written by | Purpose |
|---|---|---|
| `docs/brief.md` | brief | Problem, users, goals, success metrics, constraints, scope |
| `docs/project.md` | brief | Name, repo, people, timeline, links, glossary |
| `docs/decisions.md` | every skill | Append-only decision log |
| `docs/research/<competitor>.md` | research | One file per competitor |
| `docs/workflow.md` | workflow | How tasks get executed, ordered, committed, reviewed |
| `docs/rules.md` | workflow | Project rules, extends `reference/baseline.md` |
| `docs/design.md` | design | Design direction, tokens, components, banned patterns |
| `docs/dev.md` | dev | Stack, commands, dev server URL, architecture decisions |
| `docs/specs/phase-NN-<slug>.md` | srs | Phase spec with tasks and acceptance criteria |
| `docs/evidence/task-NNN/` | atd, qa | Screenshots and gate reports, gitignored |

The first skill that creates `/docs` also adds `docs/evidence/` to the project `.gitignore`.

## Asking questions

1. If `$ARGUMENTS` is empty or does not give enough to write the target doc without guessing, ask.
2. Before asking, read the existing docs and the codebase. Never ask what you can find out yourself.
3. Ask one question at a time. Wait for the answer before asking the next.
4. Every question offers 2 to 4 options. The first is the recommendation, labelled `(Recommended)`. Every option states **Why** and **Why not**.
5. Use the AskUserQuestion tool when the options fit in it. Otherwise ask in plain text with the same structure.
6. Keep asking until every section of the target doc can be written without a single guess.
7. Before writing, list any remaining assumption in one message and get it confirmed.
8. Never invent a requirement, a number, a name, or a behavior. Unknown means ask, or record it under Open Questions.

## Decision log

Every answered question that settles something goes into `docs/decisions.md`:

```markdown
- D-012 (2026-10-20, srs): Empty state shows an inline create button. Why: users land here with zero items on day one. Rejected: illustration only.
```

IDs are sequential across the whole project. Never edit or delete an old entry; supersede it with a new one that names the old ID.

## Spec template

```markdown
# Phase-01: Phase Title
Phase description
Dependencies: None

## Task-005: Task Title
> Status: Not Started

Task description

### Context
Additional context for this task

### Q&A
- Question? → Answer
- Another question? → Answer

### Acceptance Criteria
- [ ] Clicking Save with empty title shows inline error
- [ ] Loading, empty and error states handled
- [ ] Out of scope: bulk edit

### Dependencies: Task-003, Task-004
```

Task IDs are three digits and sequential across all phases. Phase files are `phase-01-<slug>.md`, `phase-02-<slug>.md`.

## Status

`Not Started`, `In Progress`, `Review`, `Done`, `Blocked (<reason>)`

Gate results are appended to the status line:

```markdown
> Status: Review (atd: pass 2026-10-20, qa: fail 2026-10-20)
```

Who may set what:

| Skill | May set |
|---|---|
| execute | `In Progress`, `Review`, `Blocked` |
| atd | appends `atd: pass` or `atd: fail` |
| qa | appends `qa: pass` or `qa: fail`, ticks AC checkboxes |
| handoff | `Done`, only when atd and qa both pass on the current code |

No skill other than handoff ever sets `Done`. Any code change after a gate pass invalidates that pass: set the gate back to `fail` with the note `stale`.

## Evidence

Screenshots and reports go to `docs/evidence/task-NNN/`. Name screenshots `<gate>-<state>-<width>.png`, for example `atd-empty-375.png`. Every pass claim in a report links to a screenshot or a command output. A claim without evidence counts as fail.

## Reporting done

A skill never says "done", "complete" or "ready" unless every item it was responsible for is listed with its result. If anything was skipped, partially done, or unverified, say so first, in the first line.
