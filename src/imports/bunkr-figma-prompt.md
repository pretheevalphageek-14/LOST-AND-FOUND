# Figma prompt — "Bunkr" student utility app

Paste the whole block below into Figma's AI design generator (First Draft / Make Design), or hand it to a designer as a brief. It's written to cover both desktop and mobile in one pass.

---

## Prompt

> Design a mobile-first student utility app called **"Bunkr"**, also adapted for desktop, for college students who need to track their timetable, attendance, grades and internal marks in one place. The tone is friendly, energetic and a little playful — like a well-kept physical planner, not a corporate dashboard.
>
> **Brand identity:** the logo is a rounded square with a bold letterform "B", tilted slightly (-6°), in the accent color. Product name "Bunkr" set in a bold geometric sans.
>
> **Typography:** use *Sora* (weights 600–800) for headings and display numbers-as-titles; *Inter* (400–700) for body text and UI labels; *IBM Plex Mono* (500–600) for numeric data specifically — percentages, GPA figures, countdown timers, timetable time slots — so numbers read as "data" against the friendlier body type. Sentence case everywhere, no all-caps labels except tiny status pills.
>
> **Layout — mobile (390px frame):** fixed bottom tab bar with 6 icon+label items (Today, Timetable, Bunk calc, SGPA/CGPA, Internals, Focus), frosted-glass translucent background. Header sits above scrollable content with a rounded-off greeting line, page title, and a small circular theme-picker button top-right. Content is single column, generous 20px side padding, rounded 14px cards with 1px hairline borders (no heavy drop shadows).
>
> **Layout — desktop (1440px frame):** fixed left sidebar (220px) in the primary/dark brand color holding the logo and the same 6 nav items stacked vertically with icon + label, active item highlighted with a soft accent-tinted pill. Main content area shifts right of the sidebar, max content width ~900px, comfortably centered, two-column card grids where it makes sense (e.g. side-by-side stat cards, planner inputs).
>
> **Signature interaction — reactive background:** behind all content, 3 large soft-focus blurred color blobs (radial gradients, ~300–360px, blur ~70px, opacity ~0.4) drift toward the user's cursor position on desktop and finger position on mobile touch, with slow eased motion (about 1 second ease-out) so it feels alive but never distracting. The blobs sit at z-index 0; all cards and text sit on solid opaque surfaces above them so legibility is never affected — only the page's empty margins and header reveal the movement.
>
> **Theme system:** build 4 selectable color themes, switched from a small palette-icon popover with 4 circular swatches:
> 1. **Notebook** (default, light) — ink navy `#1B2140` primary/header, off-white blue-grey `#F2F4F8` background, white cards, highlighter yellow `#FFD23F` accent, mint green `#2FBF88` success, coral red `#FF5A5F` danger.
> 2. **Midnight** (dark mode) — near-black `#0B0E1C` header, deep navy `#0F1222` background, `#171B2E` cards, lime `#C6FF3D` accent, soft violet and pink in the background blobs.
> 3. **Sunset** (warm light) — deep brown `#3A2A22` header, warm cream `#FFF7F0` background, burnt-orange `#FF7A45` accent, amber and coral in the blobs.
> 4. **Mint** (fresh light) — deep forest `#0B3D2E` header, pale mint `#F0FBF6` background, emerald `#12B886` accent, teal and light-green blobs.
>
> Every screen, card, button and chart must restyle instantly to the selected theme — treat color as tokens (primary, accent, background, surface, text, muted-text, border, success, danger), not hardcoded per-screen values.
>
> **Screens to design (each in both mobile and desktop frames):**
> 1. **Today (dashboard)** — greeting + date, "up next" class card with a small badge, today's remaining classes list, two stat cards (overall attendance %, current SGPA) with color-coded values, an "Exams & deadlines" module (list of upcoming items with a days-left pill, add-new-deadline mini form), and a row of quick-link chips to the other tools.
> 2. **Timetable** — three input modes as a segmented control: grid builder (period rows × day columns, editable time labels), paste-as-text (a textarea with a format hint and a "Parse into timetable" button), and PDF upload (drag/drop-style file zone with an honest note that extraction needs manual review). Weekly grid renders as a clean table with rounded cells.
> 3. **Bunk / attendance calculator** — a card per subject with subject name, classes held, classes attended, required percentage, a thin progress bar colored by status, and a result banner (green "you can bunk N more classes" or red "attend the next N to recover") with a checkmark or warning icon.
> 4. **SGPA / CGPA calculator** — subject rows (name, credits, grade point) feeding a bold SGPA result banner; semester rows (label, SGPA, credits) feeding a CGPA result banner; below both, a "Target CGPA planner" card that takes current CGPA, credits completed, target CGPA and credits remaining, and returns the average SGPA needed going forward.
> 5. **Internal marks calculator** — component rows (name, max marks, scored marks), an optional "scale total to" field, and a result banner showing the scaled total or raw percentage.
> 6. **Focus timer** — a centered circular countdown ring (Pomodoro-style, 25 min focus / 5 min break), big monospace time readout, start/pause and reset controls, a status pill ("Focus block" / "Short break"), and a small completed-sessions counter.
>
> **Components to define once, reuse everywhere:** primary button (accent-filled), ghost/toggle button (outlined, active state uses accent-tinted background), icon button (small square, red-tinted for destructive actions), text input (soft-filled, accent border on focus), result banner (dark surface, accent-colored large mono number), stat card, status/progress bar, bottom tab bar item, sidebar nav item, theme-swatch picker.
>
> **Motion notes:** background blobs drift continuously as described; progress bars and the timer ring animate width/offset changes smoothly (~300ms–1s ease); tab and theme switches are instant with no page transition; hover/press states on buttons darken or lighten by one step, no scale bounce.
>
> Keep the overall feel light-handed: the moving background and the color themes are the one bold, memorable idea — every card, input and button around them stays calm, consistent and easy to scan.

---

### Notes for using this in Figma

- If you're using Figma's **First Draft / "Make Design"** AI feature, paste the prompt above as-is — it understands frame sizes, component reuse, and color tokens described in prose.
- If you're briefing a **human designer**, this doubles as a written spec; the working React prototype I built alongside it (`bunkr-app-v2.jsx`) is the fastest way to see the exact interactions (cursor-reactive background, theme switching, all 6 screens) in action before redrawing them as static Figma frames.
- Color tokens and component names in the prompt intentionally match the code, so design and implementation stay in sync if you go back and forth between the two.
