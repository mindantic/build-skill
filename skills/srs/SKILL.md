---
name: srs
description: Build the complete software requirements spec by grilling the user, broken into phases, features and tasks, written to docs/specs/phase-NN-<slug>.md. Use when the user runs /build:srs, wants to plan what to build in detail, or before any execution starts.
argument-hint: "[phase or feature to spec, empty for the whole project]"
---

# Build: SRS

Read `../../reference/conventions.md` and `../../reference/baseline.md` (relative to this skill's base directory) before anything else and follow them.

Input: `$ARGUMENTS`

This is the step that prevents half implemented work. Every behavior the user expects must end up as an acceptance criterion. If it is not an acceptance criterion, it will not be built or checked.

## Steps

1. Read every doc in `/docs` and the existing codebase. Read existing spec files and continue task numbering from the highest Task ID.
2. Propose the phase breakdown: each phase with a title, one line of purpose and dependencies. Ask the user to confirm or change it.
3. For each phase, propose its features, then its tasks. A task is small enough to build and verify in one sitting and produces something visible or testable.
4. Grill every task, one question at a time with options and a recommendation. Record each answer in the task's Q&A. For every task cover:
   - What the user does, step by step, and what they see after each step
   - Data: where it comes from, where it goes, what is validated
   - Interaction: hover, focus, keyboard, pending, success, failure, double submit, back button, refresh
   - States: loading, empty, error, overflow (long text, many items), disabled, permission denied
   - Responsive: what changes at 375, 768, 1024, 1440
   - What is explicitly out of scope
   Skip a point only when it truly does not apply, and say why in one line.
5. Turn every answer into acceptance criteria. Each criterion is one observable behavior that someone could check in the browser or a test, with no words like "properly", "nicely" or "correctly".
6. Write `docs/specs/phase-NN-<slug>.md` using the spec template from conventions. All tasks start at `Not Started`.
7. Run the coverage check below and show it. Fix every gap before finishing.
8. Log decisions.

## Coverage check

Before finishing, show the user:

| Goal or feature from brief | Covered by | Gap |

Every goal in `docs/brief.md` maps to at least one task or is listed as out of scope with a decision ID. Every task has at least one acceptance criterion for its main behavior and one for its states. Every dependency points to a real task ID. Nothing is left as Open Question without the user agreeing to defer it.
