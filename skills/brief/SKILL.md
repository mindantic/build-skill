---
name: brief
description: Collect a project brief and turn it into docs/brief.md, docs/project.md and docs/decisions.md. Use at the start of a new project or feature, when the user says "here's what I want to build", or runs /build:brief with or without a brief.
argument-hint: "[brief text, file path or link]"
---

# Build: Brief

Read `../../reference/conventions.md` (relative to this skill's base directory) before anything else and follow it.

Input: `$ARGUMENTS`

## Steps

1. If the input is a file path or link, read it. If `docs/brief.md` already exists, read it and treat this run as an update, not a rewrite.
2. Extract everything the input already answers. Only ask about the gaps.
3. Ask, one question at a time with options, until each of these is known:
   - The problem, in one sentence, and who has it
   - Primary users and their main job to be done
   - Goals, each with a way to tell it was met
   - Constraints: deadline, budget, platform, stack already fixed, compliance
   - In scope and explicitly out of scope
   - Known competitors or references (feeds `/build:research`)
   - Project name, repo, people involved, links
4. Write the three files below. Every statement must come from the input or an answer. Unknowns go under Open Questions.
5. Show the user the Open Questions list and the next recommended command.

## docs/brief.md

```markdown
# Brief: <Project Name>

## Problem
## Users
## Goals
| Goal | How we know it is met |
## Constraints
## In Scope
## Out of Scope
## Competitors and References
## Open Questions
```

## docs/project.md

```markdown
# <Project Name>

## Summary
## Repo and Environments
## People
## Timeline
## Links
## Glossary
```

## docs/decisions.md

Create it with a `# Decisions` heading if missing, then append one entry per settled answer.
