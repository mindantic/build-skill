# Attention to Detail Baseline

The global standard for every project. `docs/rules.md` extends or overrides it per project. Where they conflict, `docs/rules.md` wins.

Items marked **HARD** fail the gate on their own. Everything else is a fail when it is wrong in a way a senior frontend developer would notice at a glance.

## 1. Functionality (HARD)

- Every acceptance criterion works when exercised for real in the browser, not assumed from the code.
- Nothing requested is missing, stubbed, mocked, hardcoded or left as a TODO.
- Data actually persists, reloads and survives a page refresh where the spec implies it should.
- No dead buttons, no links to `#`, no handlers that only `console.log`.

## 2. Interaction (HARD)

- Every interactive element has hover, focus-visible, active and disabled states.
- Buttons that trigger async work show a pending state and cannot be double submitted.
- Overlays close on Escape and on click outside, trap focus while open, and return focus to the trigger on close.
- Forms: validation on submit and on blur, errors next to the field, the first invalid field gets focus, Enter submits.
- Keyboard only: every action is reachable with Tab, Shift+Tab, Enter, Space and Escape, in a logical order.
- Feedback for every action: success, failure and in-between are all visible.
- Behavior matches the platform convention unless `docs/design.md` says otherwise.

## 3. Consistency (HARD)

- Design tokens only. No hardcoded hex, px spacing, font sizes or shadows outside the token set.
- The same job uses the same component everywhere. No second button style, second card style, second input style.
- Spacing, radius, icon size, icon stroke, border width and shadow are identical for identical elements.
- Copy uses one voice, one casing style for labels and buttons, and one term per concept.

## 4. Polish (HARD)

- Every data view has loading (skeleton matching the final layout), empty (with a next action) and error (with a retry) states.
- No layout shift when data, images or fonts load.
- Alignment: elements share edges. Check left edges, baselines and centers in screenshots.
- Long text: long names, long words, long numbers and many items are handled with wrap, truncate plus title, or scroll. Nothing overflows its container.
- Responsive at 375, 768, 1024 and 1440. No horizontal scroll, nothing clipped, touch targets at least 44px on mobile.
- Images have fixed aspect ratios and sensible fallbacks.
- State changes have short transitions. Nothing snaps that should move, nothing animates for longer than it should.
- Console is clean: no errors, no warnings, no leftover logs.
- No placeholder text, lorem ipsum, fake data or "Coming soon" unless the spec asks for it.

## 5. No unnecessary components (HARD)

- Every element on the page has to answer: what does the user do with this? If nothing, remove it.
- No cards nested in cards, no decorative dividers, no badges or pills that carry no information.
- No stat counters, testimonials, feature grids or CTA bands that the spec did not ask for.
- No extra sections, wrappers or containers added for visual filler.
- When unsure whether an element earns its place, leave it out and mention it in the report.

## 6. No AI boringness (HARD)

The page must follow the direction in `docs/design.md`. Anything that reads as the default AI template fails, even if it is "clean".

Banned unless `docs/design.md` explicitly asks for it:

- **Layout:** centered hero with big headline and two buttons, then a three column icon card grid, then testimonials, then a CTA band.
- **Visuals:** purple or blue gradients, glassmorphism, glow blobs, a shadow on every card, everything heavily rounded, emoji used as icons.
- **Type:** default Inter at default weights with hierarchy carried by size alone.
- **Copy:** "Supercharge", "Seamless", "Unlock", "Elevate", "Effortless", vague benefit bullets, filler.
- **Rhythm:** every section with the same structure and the same visual weight, so nothing leads the eye.

The page must show the signature detail and type pairing that `docs/design.md` defines.

## 7. Typography

- Type scale only. Line height set on every style. Body line length capped around 60 to 75 characters.
- Hierarchy uses weight, color and spacing, not only size.
- No orphans in headings where it can be avoided. Numbers in tables use tabular figures.

## 8. Accessibility

- Text contrast meets WCAG AA. Focus rings are visible on every background.
- Images have alt text, icon buttons have accessible names, form fields have labels.
- Color is never the only signal for state.
- Respects `prefers-reduced-motion` and, if supported, `prefers-color-scheme`.
