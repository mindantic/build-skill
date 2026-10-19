---
name: qa
description: Functional QA gate. Exercises every acceptance criterion and edge case of a phase or task for real in the browser, runs the test suite, fixes what fails and ticks criteria only with evidence. Use when the user runs /build:qa with a phase or task, after /build:atd, or when functionality needs to be proven before handoff.
argument-hint: "[phase-01 | task-005]"
---

# Build: QA

Read `../../reference/conventions.md` (relative to this skill's base directory) before anything else and follow it.

Input: `$ARGUMENTS`

Assume it is broken until you have seen it work.

## Setup

1. Resolve the input to tasks in `Review` status. Empty input: every task in `Review`.
2. Read the task specs, `docs/dev.md` and `docs/workflow.md`.
3. Start the dev server or confirm it is running. Run `agent-browser skills get core` once, and `agent-browser skills get dogfood` for exploratory testing patterns.

## Per task

1. **Automated.** Run typecheck, lint, unit tests, e2e tests and build from `docs/dev.md`. Record exact output.
2. **Acceptance criteria.** For each criterion, perform it in the browser exactly as a user would: real clicks, real typing, real navigation. Screenshot the result to `docs/evidence/task-NNN/qa-<criterion-number>.png` and look at it.
3. **Edge cases.** For every flow in the task, try:
   - Empty, whitespace only, very long, special character and emoji input
   - Double click and rapid repeat on every action
   - Refresh mid flow, browser back and forward, opening the URL directly
   - Slow and failed network for every request
   - Keyboard only
   - Mobile width 375
4. **Watch.** Check console and network after each flow. Any error, warning or failed request is a fail.
5. **Fix and re-run.** Fix every fail and re-run the affected criteria. At most 3 rounds. Anything still failing is reported.
6. **Tick.** Tick an acceptance criterion checkbox in the spec only when it passed with evidence in the last round.

## Report

Write `docs/evidence/task-NNN/qa.md`:

```markdown
# QA: Task-NNN, <date>

Result: pass | fail

## Automated
| Command | Result |

## Acceptance Criteria
| Criterion | Result | Evidence |

## Edge Cases
| Flow | Case | Result | Note |

## Fixed
## Still Failing
```

Append `qa: pass <date>` or `qa: fail <date>` to the status line. If fixes changed UI, mark `atd` as `fail (stale)` and say so.

Reply with the result per task, what was fixed, what still fails, and the next command (`/build:atd` if stale, otherwise `/build:handoff`).
