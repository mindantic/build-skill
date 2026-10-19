---
name: research
description: Research and analyze competitors, one file per competitor in docs/research/. Use when the user runs /build:research, names competitors, or wants to know how others solve the same problem before designing.
argument-hint: "[competitor names or URLs]"
---

# Build: Research

Read `../../reference/conventions.md` (relative to this skill's base directory) before anything else and follow it.

Input: `$ARGUMENTS`

## Steps

1. Read `docs/brief.md`. If it is missing, say so and recommend `/build:brief` first, but continue if the user wants to.
2. If no competitors were given, propose 3 to 6 from the brief and a quick search, each with one line on why it is relevant, and ask which to analyze.
3. Ask which angle matters most for this project (product scope, UX and interaction, visual design, pricing, positioning) with a recommendation based on the brief.
4. For each competitor, research from primary sources: their site, docs, pricing page, changelog, app if publicly usable. Use WebSearch and WebFetch. Use agent-browser for screenshots of key screens, saved to `docs/research/assets/<competitor>/`.
5. Write `docs/research/<competitor-slug>.md` with the template below. Mark every claim you could not verify as `unverified`.
6. Write or update `docs/research/summary.md`: a comparison table across competitors and a list of patterns to adopt and to avoid, each tied to a brief goal.
7. Log decisions that came out of the research in `docs/decisions.md`.

## Template

```markdown
# <Competitor>

URL:
Researched: <date>

## Positioning
## Target Users
## Core Features
## Key Flows
Step by step, with screenshots.
## UX and Interaction Details
What they get right in the small details, what they get wrong.
## Visual Design
## Pricing
## Strengths
## Weaknesses
## Take
What we adopt, what we avoid, and why, tied to goals in docs/brief.md.
## Sources
```
