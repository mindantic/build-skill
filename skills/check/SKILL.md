---
name: check
description: Show the current status of the build pipeline, docs, phases, tasks, gates and blockers, and recommend the next command. Use when the user runs /build:check, asks "where are we", "what's next" or "status".
argument-hint: ""
---

# Build: Check

Read `../../reference/conventions.md` (relative to this skill's base directory) before anything else.

Read-only. Change nothing.

## Steps

1. List which docs exist in `/docs` and which are missing or have Open Questions.
2. Parse every `docs/specs/phase-*.md`. For each task: ID, title, status, gate results, ticked versus total acceptance criteria, unmet dependencies.
3. Flag problems: a gate pass older than the latest change to the task's files, `Done` without both gates, `Blocked` tasks, dependencies on tasks that are not Done.
4. Reply:

```markdown
## Docs
| Doc | State |

## Phases
| Phase | Tasks | Done | Review | In Progress | Blocked | Not Started |

## Tasks
| Task | Title | Status | atd | qa | ACs |

## Problems

## Next
The single most useful next command, and why.
```

Keep it to these tables. No commentary beyond Problems and Next.
