---
name: design
description: Turn a design brief or inspiration into a concrete design direction in docs/design.md. Use when the user runs /build:design, shares inspiration links, screenshots or Figma files, or the project needs a visual direction before building UI.
argument-hint: "[design brief, inspiration links, images or Figma URL]"
---

# Build: Design

Read `../../reference/conventions.md` and `../../reference/baseline.md` (relative to this skill's base directory) before anything else and follow them.

Input: `$ARGUMENTS`

The goal is a specific direction that cannot be mistaken for a default AI template. Section 6 of the baseline lists what is banned. This doc defines what to aim for instead.

## Steps

1. Read `docs/brief.md`, `docs/research/summary.md` and any existing UI code, tokens or Tailwind config.
2. Study every inspiration given. Links: fetch and screenshot with agent-browser. Images: read them. Figma URLs: use the Figma tools. For each, name exactly what to take from it (a spacing rhythm, a type treatment, an interaction), not "the vibe".
3. If no inspiration was given, ask for some. Offer 3 directions that fit the brief, each with references, and recommend one.
4. Settle, one question at a time with options:
   - Direction statement: one paragraph, specific enough to reject a wrong screen
   - Type pairing and scale
   - Color tokens, including semantic colors and dark mode if needed
   - Spacing scale, radius, borders, elevation
   - Motion: durations, easing, what animates
   - Signature detail: the one thing that makes it recognizable
   - Component inventory: which components exist and which job each one does
   - Project specific banned patterns
5. Write `docs/design.md`. Log decisions.

## docs/design.md

```markdown
# Design

## Direction
## References
| Reference | What we take | What we leave |
## Typography
## Color
## Spacing, Radius, Elevation
## Motion
## Signature Detail
## Components
| Component | Job | Variants | Notes |
## Banned Patterns
Baseline section 6 plus project specific additions.
## Open Questions
```

Token values must be exact (hex, px, ms), so `/build:execute` can copy them without inventing anything.
