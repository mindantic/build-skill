---
name: handoff
description: Final gate for a phase or task. Verifies that atd and qa passed on the current code, every acceptance criterion is ticked, the build is clean and the docs are current, then marks tasks Done. Use when the user runs /build:handoff, asks whether a phase is ready, or wants to close out work.
argument-hint: "[phase-01 | task-005]"
---

# Build: Handoff

Read `../../reference/conventions.md` (relative to this skill's base directory) before anything else and follow it.

Input: `$ARGUMENTS`

This skill does not fix anything. It checks and either marks Done or says exactly what stands in the way.

## Checks per task

| Check | How |
|---|---|
| atd passed | Status line has `atd: pass`, not stale |
| qa passed | Status line has `qa: pass`, not stale |
| No code changed since the gates | Compare the latest commit touching the task's files with the gate report dates |
| Every acceptance criterion ticked | Read the spec |
| Reports exist | `docs/evidence/task-NNN/atd.md` and `qa.md` both say pass |
| Build is clean | Run build, typecheck, lint and tests from `docs/dev.md` now |
| No leftovers | Search changed files for TODO, FIXME, console.log, debugger, lorem, placeholder |
| Docs current | Spec Q&A and `docs/decisions.md` reflect what was built |

For a phase, also check every task in the phase is covered, and that the phase dependencies are Done.

## Result

- All checks pass: set the task to `Done`.
- Any check fails: leave the status, list each failing check with the command to fix it.

Reply with:

```markdown
# Handoff: <phase or task>, <date>

Result: ready | not ready

| Task | atd | qa | ACs | Build | Leftovers | Docs | Result |

## Blocking
## Summary of what was built
## Known limitations and deferred items
```

The summary section is written for someone who did not follow the work: what was built, where, and how to try it.
