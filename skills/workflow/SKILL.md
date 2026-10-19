---
name: workflow
description: Define how the project's tasks get executed and the project rules, writing docs/workflow.md and docs/rules.md. Use when the user runs /build:workflow, wants to set how work is orchestrated, committed and reviewed, or wants to add project specific quality rules.
argument-hint: "[workflow preferences]"
---

# Build: Workflow

Read `../../reference/conventions.md` and `../../reference/baseline.md` (relative to this skill's base directory) before anything else and follow them.

Input: `$ARGUMENTS`

## Steps

1. Read existing docs and the repo: git branches, CI config, package scripts, test setup, lint config.
2. Ask, one question at a time with options, until each section below is settled. Recommend what fits the repo you just read.
3. Write `docs/workflow.md` and `docs/rules.md`. Log decisions.

## docs/workflow.md

```markdown
# Workflow

## Task Order
How tasks are picked: by phase, by dependency, one at a time or in parallel.

## Execution
Whether tasks run in the main session or subagents, and when to stop and ask.

## Branching and Commits
Branch naming, commit style, when to commit (per task recommended), who pushes.

## Gates
Order of gates per task: execute, atd, qa, handoff. Whether gates run per task or per phase.

## Review
What the user wants to see before a task or phase is Done.
```

## docs/rules.md

Project rules extend `reference/baseline.md`. Only write what is specific to this project or overrides the baseline. Each rule must be checkable by looking at a screenshot or the code.

```markdown
# Rules

## Overrides
Baseline items that do not apply here, each with a reason.

## Code
Naming, file structure, component patterns, forbidden libraries.

## Design
Project specific detail rules beyond the baseline.

## Copy
Voice, casing, terminology list.

## Hard Fails
Anything the user names as an instant fail.
```
