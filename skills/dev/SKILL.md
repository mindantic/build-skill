---
name: dev
description: Make technical decisions for the project, presenting options with a recommendation, and record them in docs/dev.md. Use when the user runs /build:dev, needs to choose a stack, library, architecture or tooling, or before execution when commands and the dev server URL are unknown.
argument-hint: "[technical decision or question]"
---

# Build: Dev

Read `../../reference/conventions.md` (relative to this skill's base directory) before anything else and follow it.

Input: `$ARGUMENTS`

## Steps

1. Read the repo first: package files, lockfile, framework config, existing patterns. Never propose replacing something already in place without saying what it costs.
2. If a specific decision was given, settle that one. If not, walk through every section below that is still unknown.
3. For each decision, offer 2 to 4 real options with a recommendation. Each option states Why, Why not, and the cost of changing it later. Check current docs (context7) for any library you recommend.
4. Write or update `docs/dev.md`. Log decisions.

## docs/dev.md

```markdown
# Dev

## Stack
| Layer | Choice | Why |
Framework, language, styling, state, data fetching, forms, auth, database, hosting.

## Architecture
Folder structure, data flow, where business logic lives.

## Commands
| Purpose | Command |
Install, dev server, build, lint, typecheck, unit tests, e2e tests.

## Dev Server
URL, port, required env vars, seed data, test accounts.

## Conventions
Patterns every task must follow.

## Open Questions
```

The Commands and Dev Server sections are required. `/build:execute`, `/build:atd`, `/build:qa` and `/build:handoff` depend on them and ask for them if they are missing.
