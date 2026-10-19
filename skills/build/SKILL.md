---
name: build
description: Entry point for the build pipeline. Works out where the project is and runs the right build skill, or routes a free text request to it. Use when the user runs /build, asks to start a new project the spec driven way, or asks what to do next on a project with a docs/ folder.
argument-hint: "[anything, or empty to continue]"
---

# Build

Read `../../reference/conventions.md` (relative to this skill's base directory) before anything else.

Input: `$ARGUMENTS`

## Pipeline

| Step | Skill | Produces |
|---|---|---|
| 1 | `build:brief` | brief.md, project.md, decisions.md |
| 2 | `build:research` | research/*.md |
| 3 | `build:workflow` | workflow.md, rules.md |
| 4 | `build:design` | design.md |
| 5 | `build:dev` | dev.md |
| 6 | `build:srs` | specs/phase-NN-*.md |
| 7 | `build:execute` | code, task in Review |
| 8 | `build:atd` | detail gate |
| 9 | `build:qa` | functional gate |
| 10 | `build:handoff` | task or phase Done |
| any | `build:check` | status |

Research is optional. Design is skipped for projects without UI, with a decision logged.

## Routing

1. If the input clearly names a step or its intent ("research Linear", "fix the details on task 5", "is phase 1 ready"), invoke that skill with the Skill tool and pass the relevant part of the input as args.
2. If the input is empty, run the same reading as `build:check`, then pick the next step:
   - First missing doc in pipeline order
   - Otherwise the first task in `Review` missing a gate, in gate order atd, qa, handoff
   - Otherwise the next `Not Started` task whose dependencies are Done
3. Tell the user in one line which step you are running and why, then invoke it.
4. If the input is ambiguous between two steps, ask with options and a recommendation.

Never skip a gate to save time. If the user asks to skip one, log it as a decision with their reason.
