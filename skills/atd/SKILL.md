---
name: atd
description: Attention to detail gate. Zooms into each task's UI in the browser and checks every item of the detail baseline and docs/rules.md, fixes what fails and re-verifies. Use when the user runs /build:atd with a phase or task, after /build:execute, or whenever UI work needs a detail pass before it can be called done.
argument-hint: "[phase-01 | task-005]"
---

# Build: ATD (Attention to Detail)

Read `../../reference/conventions.md` and `../../reference/baseline.md` (relative to this skill's base directory) before anything else and follow them.

Input: `$ARGUMENTS`

This gate exists because the last 20% is where work becomes usable or unusable. Go slowly. Measure first, then look at every pixel you are judging. A skimmed pass is worse than no pass.

## Setup

1. Resolve the input to tasks in `Review` status. Empty input: every task in `Review`.
2. Read `docs/rules.md`, `docs/design.md`, `docs/dev.md` and the task specs. Merge rules.md over the baseline into one checklist.
3. Start the dev server from `docs/dev.md`, or confirm it is running. Run `agent-browser skills get core` once to load usage.

## Per task

1. **Capture.** For every screen the task touches, take screenshots at 375, 768, 1024 and 1440, in every state the task defines: default, hover and focus on key elements, loading, empty, error, overflow with long text and many items, disabled. Force states with seed data, network throttling or devtools when needed. Save to `docs/evidence/task-NNN/atd-<state>-<width>.png`.
2. **Measure.** Run `node <plugin>/reference/measure.mjs <url> [url...] --out docs/evidence/task-NNN` from the project root for every page the task touches, where `<plugin>` is two levels up from this skill's base directory. It reads `docs/measure.json` (widths, themes, line limits per selector, console patterns to ignore) and checks, at every width and theme: horizontal scroll, line limits, touch targets under 44px at phone width, clipped text, missing alt and accessible names, AA contrast, layout shift while idle (autoplay, carousels, late content), focus rings on a Tab walk, console and hydration errors, and errors or looping animations under reduced motion. Every failure it prints is a checklist fail. If the project has no `docs/measure.json`, create one from the line limits and rules in `docs/rules.md`. A visual judgment never overrides a measured failure.
3. **Look.** Open every screenshot with the Read tool. Do not judge a screenshot you have not looked at. Judge what measuring cannot: hierarchy, rhythm, cropping of photos, whether a section reads as broken or unfinished.
4. **Read the copy as the buyer.** For every visible string ask: is it true, is it specific, will it go stale (counts, dates, "new"), does it fit its line limit, does it repeat another section. Stale or vague copy is a fail.
5. **Check the code.** Read the diff for the task. Look for hardcoded values outside tokens, duplicate components, leftover logs, TODOs, unused elements.
6. **Walk the checklist.** Go through the merged checklist item by item, section by section. Write one line per item: `pass`, `fail` with what is wrong and where, or `n/a` with a reason. No item may be skipped or grouped as "all good".
7. **Fix.** Fix every fail. Then re-run measure and capture and look again for the affected screens and states.
8. **Repeat** until clean, for at most 3 rounds. Anything still failing after round 3 is reported, not hidden.

## Report

Write `docs/evidence/task-NNN/atd.md`:

```markdown
# ATD: Task-NNN, <date>

Result: pass | fail
Rounds: N
Measure: pass | N failures (from measure.mjs, last run)

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
