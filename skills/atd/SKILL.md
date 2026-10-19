---
name: atd
description: Attention to detail gate. Zooms into each task's UI in the browser and checks every item of the detail baseline and docs/rules.md, fixes what fails and re-verifies. Use when the user runs /build:atd with a phase or task, after /build:execute, or whenever UI work needs a detail pass before it can be called done.
argument-hint: "[phase-01 | task-005]"
---

# Build: ATD (Attention to Detail)

Read `../../reference/conventions.md` and `../../reference/baseline.md` (relative to this skill's base directory) before anything else and follow them.

Input: `$ARGUMENTS`

This gate exists because the last 20% is where work becomes usable or unusable. Go slowly. Look at every pixel you are judging. A skimmed pass is worse than no pass.

## Setup

1. Resolve the input to tasks in `Review` status. Empty input: every task in `Review`.
2. Read `docs/rules.md`, `docs/design.md`, `docs/dev.md` and the task specs. Merge rules.md over the baseline into one checklist.
3. Start the dev server from `docs/dev.md`, or confirm it is running. Run `agent-browser skills get core` once to load usage.

## Per task

1. **Capture.** For every screen the task touches, take screenshots at 375, 768, 1024 and 1440, in every state the task defines: default, hover and focus on key elements, loading, empty, error, overflow with long text and many items, disabled. Force states with seed data, network throttling or devtools when needed. Save to `docs/evidence/task-NNN/atd-<state>-<width>.png`.
2. **Look.** Open every screenshot with the Read tool. Do not judge a screenshot you have not looked at.
3. **Check the code.** Read the diff for the task. Look for hardcoded values outside tokens, duplicate components, leftover logs, TODOs, unused elements.
4. **Walk the checklist.** Go through the merged checklist item by item, section by section. Write one line per item: `pass`, `fail` with what is wrong and where, or `n/a` with a reason. No item may be skipped or grouped as "all good".
5. **Fix.** Fix every fail. Then capture and look again for the affected screens and states.
6. **Repeat** until clean, for at most 3 rounds. Anything still failing after round 3 is reported, not hidden.

## Report

Write `docs/evidence/task-NNN/atd.md`:

```markdown
# ATD: Task-NNN, <date>

Result: pass | fail
Rounds: N

## Checklist
| Section | Item | Result | Evidence or note |

## Fixed
- <issue> → <fix>, <file>

## Still Failing
- <issue>, why it could not be fixed

## Judgment Calls
Elements removed or kept under "no unnecessary components", with reasons.
```

Then append `atd: pass <date>` or `atd: fail <date>` to the task status line. Fixes made here mean any earlier `qa: pass` is now stale.

Reply with the result per task, the count of items fixed, anything still failing, and the next command (`/build:qa <task>`).
