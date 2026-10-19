---
name: execute
description: Implement a phase or a single task from docs/specs, every acceptance criterion and every state, then hand it to the gates. Use when the user runs /build:execute with a phase number or task number, or asks to build a specced task.
argument-hint: "[phase-01 | task-005]"
---

# Build: Execute

Read `../../reference/conventions.md` and `../../reference/baseline.md` (relative to this skill's base directory) before anything else and follow them.

Input: `$ARGUMENTS`

## Before writing code

1. Resolve the input to tasks. A phase means every task in it that is not `Done`, in dependency order. Empty input: pick the next task whose dependencies are all `Done` and confirm it with the user.
2. Stop on any task whose dependencies are not `Done`. Say which ones block it.
3. Read `docs/dev.md`, `docs/design.md`, `docs/rules.md` and `docs/workflow.md`. If Commands or Dev Server are missing from `docs/dev.md`, ask for them and record them.
4. Read the existing code the task touches. Reuse existing components and tokens before creating anything new.
5. Write an implementation checklist in the conversation, one line per acceptance criterion and one line per state in the task, each with the file or component that will satisfy it. Show it before coding.
6. If an acceptance criterion is ambiguous, ask with options and a recommendation, then record the answer in the task's Q&A. Never guess.

## Building

1. Set the task to `In Progress`.
2. Implement every line of the checklist. Not most of them, all of them. No stubs, mocks, hardcoded data, TODOs or placeholder copy unless the spec asks for it.
3. Use only tokens and components from `docs/design.md`. If something is missing there, ask instead of inventing.
4. Run typecheck, lint and tests from `docs/dev.md`. Fix what fails.
5. Open the page with agent-browser and click through every acceptance criterion once. This is a smoke check, not the gate.
6. Commit per `docs/workflow.md`.

## Finishing

1. If any acceptance criterion could not be implemented, set `Blocked (<reason>)`. Never drop it silently.
2. Otherwise set `Review`. Never set `Done`.
3. Report with this table, then recommend `/build:atd <task>`:

| Acceptance criterion | Implemented in | Smoke checked |

The first line of the report states plainly if anything is missing, blocked or unchecked.
