# Theme Toggle + Design Token Foundation (Phase 1)

**Status:** Approved design, ready for implementation plan
**Date:** 2026-04-19

## Context

This is **Phase 1** of a two-phase effort to migrate the site to the "Synthetix Engineering" design system (Stitch project *"Professional Frontend Portfolio"*, design system *"The Architectural Blueprint"*).

- **Phase 1 (this spec):** Swap design tokens to the Synthetix Engineering palette (dark + derived light), introduce a user-facing `light / dark / system` theme toggle, replace the display font, and migrate existing components to use the new token names. No layout or structural changes. Site renders with same structure in both themes.
- **Phase 2 (separate spec, separate session):** Redesign each component's layout and visual treatment to match the Stitch screen — terminal code hero, asymmetric grids, status-LED project cards, glass nav, gradient CTAs, command-line form fields, etc.

Decomposing this way keeps Phase 1 safely scoped (a foundation layer), delivers a working theme toggle end-to-end, and lets Phase 2 focus purely on visual redesign on top of a stable token system.

## Goals

1. Every color, font, radius, and shadow used on the site resolves from a CSS custom property defined in a single token layer.
2. User can choose `Light`, `Dark`, or `System` via a visible toggle in the nav. Selection persists across reloads.
3. Default preference is `System`. When `System`, the site tracks `prefers-color-scheme` live (no reload needed on OS toggle).
4. No flash of wrong theme on page load (FOUC prevention via inline head script).
5. All 8 existing Svelte components render correctly in both themes. No layout changes.
6. If JS is disabled, the site still respects OS color preference via pure CSS.

## Non-goals

- Component layout / structural redesigns (Phase 2).
- New components beyond the theme toggle itself.
- Changing the display font for body copy (Inter stays).
- Terminal-aesthetic copy changes (Phase 2).
- Replacing the ambient/raised shadow styling to use tinted shadows (Phase 2).
- Visual regression tests (none exist today; manual verification only).

## Design

### 1. Design tokens

**Naming convention:** adopt Stitch's Material-style token names. Current token names (`--ink-*`, `--paper`, `--accent`, `--rule`, `--warm`) are removed entirely, not aliased.

**Color tokens — dark (exact Stitch "Synthetix Engineering" values):**

```
--surface: #0c0e11
--surface-container-lowest: #000000
--surface-container-low: #111417
--surface-container: #171a1d
--surface-container-high: #1d2024
--surface-container-highest: #23262a
--surface-bright: #292c31
--on-surface: #f9f9fd
--on-surface-variant: #aaabaf
--outline: #747579
--outline-variant: #46484b
--primary: #8ff5ff
--primary-container: #00eefc
--on-primary: #005d63
--secondary: #d575ff
--secondary-container: #9800d0
--tertiary: #65afff
--error: #ff716c
```

**Color tokens — light (derived counterpart, same brand identity, accessible contrast):**

```
--surface: #f9f9fd
--surface-container-lowest: #ffffff
--surface-container-low: #f3f4f5
--surface-container: #edeeef
--surface-container-high: #e7e8e9
--surface-container-highest: #e1e3e4
--surface-bright: #ffffff
--on-surface: #0c0e11
--on-surface-variant: #46484b
--outline: #747579
--outline-variant: #c7c4d8
--primary: #0891b2
--primary-container: #06b6d4
--on-primary: #ffffff
--secondary: #a21caf
--secondary-container: #c026d3
--tertiary: #2563eb
--error: #ba1a1a
```

Rationale for light primaries: the dark neons (`#8ff5ff`, `#d575ff`) have ~1.4:1 contrast on white — unusable. Light mode uses deeper hues at the same color families (cyan, magenta, blue) that meet WCAG AA on light surfaces while preserving the "electric" identity.

**Typography tokens:**

```
--font-display: 'Space Grotesk', system-ui, -apple-system, sans-serif
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif
--font-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Consolas, monospace
```

`--font-display` replaces the previous Fraunces serif. `--font-mono` is declared now so Phase 2's terminal block can reference it without touching the token layer again.

**Radius tokens:**

```
--radius-xs: 2px
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 12px
--radius-full: 9999px
```

Caps at 12px per Stitch design doc rule: *"No Rounded Corners over 12px."*

**Shadow tokens:**

`--shadow-sm`, `--shadow-md`, `--shadow-lg` are preserved with their current hardcoded-rgba values. They will appear muted on dark backgrounds — acknowledged limitation. Phase 2 replaces these with tinted ambient shadows per Stitch's "glow logic" rules. This is an accepted trade-off for Phase 1: shadows are primarily visible on raised surfaces/cards, which Phase 2 redesigns from scratch.

**Layout tokens:** `--container: 1120px` (preserved from current).

### 2. Theme resolution (CSS)

```css
:root {
  /* light tokens + all non-color tokens */
}
@media (prefers-color-scheme: dark) {
  :root {
    /* dark token overrides */
  }
}
:root[data-theme='light'] {
  /* light tokens again — explicit user override wins over media query */
}
:root[data-theme='dark'] {
  /* dark tokens — explicit user override wins over media query */
}
```

This ordering delivers the three behaviors:
- No JS: CSS alone respects `prefers-color-scheme`.
- JS sets `data-theme='dark'`: explicit user choice wins regardless of OS.
- JS sets `data-theme='light'`: explicit user choice wins regardless of OS.

### 3. FOUC prevention (inline script in `app.html` `<head>`)

Runs synchronously before first paint. Sits before `%sveltekit.head%`:

```html
<script>
  (function() {
    try {
      var p = localStorage.getItem('theme-preference') || 'system';
      var sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var resolved = p === 'system' ? (sysDark ? 'dark' : 'light') : p;
      document.documentElement.setAttribute('data-theme', resolved);
    } catch (e) {}
  })();
</script>
```

Wrapped in try/catch because localStorage throws in Safari private browsing. If it throws, `data-theme` is never set and the CSS media-query fallback from Section 2 takes over.

### 4. Svelte theme store

`src/lib/stores/theme.js`:

```js
import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'theme-preference';

export const preference = writable(
  browser ? (localStorage.getItem(STORAGE_KEY) ?? 'system') : 'system'
);

export const resolved = derived(preference, ($p, set) => {
  if (!browser) { set('light'); return; }
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const compute = () => $p === 'system' ? (mq.matches ? 'dark' : 'light') : $p;
  set(compute());
  const onChange = () => { if ($p === 'system') set(compute()); };
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
});

if (browser) {
  preference.subscribe(p => localStorage.setItem(STORAGE_KEY, p));
  resolved.subscribe(r => document.documentElement.setAttribute('data-theme', r));
}
```

**Contract:**
- `preference` — reactive `"light" | "dark" | "system"`, persists to localStorage, drives the UI toggle's active state.
- `resolved` — reactive `"light" | "dark"`, never `"system"`. Drives `data-theme` attribute. Updates automatically when OS preference changes *and* current preference is `"system"`.
- `browser` guard ensures prerender-safe (site uses `adapter-static`).

### 5. Theme selector UI

**Component:** `src/lib/components/ThemeToggle.svelte`

**Pattern:** Segmented control. Three icon buttons (Sun / Monitor / Moon), always visible, one active. Single click switches. ARIA radiogroup pattern.

**Placement:** In `Nav.svelte`, between the primary nav `<ul>` and the "Let's talk" CTA. Visible at all breakpoints (mobile shrinks to icons only, matching existing nav breakpoint behavior at 760px).

**Structure:**

```svelte
<div class="theme-toggle" role="radiogroup" aria-label="Color theme">
  {#each options as opt}
    <button
      role="radio"
      aria-checked={$preference === opt.value}
      aria-label={opt.label}
      class:active={$preference === opt.value}
      on:click={() => preference.set(opt.value)}
    >
      <svelte:component this={opt.icon} />
    </button>
  {/each}
</div>
```

Options: `[{value:'light', icon:Sun, label:'Light theme'}, {value:'system', icon:Monitor, label:'System theme'}, {value:'dark', icon:Moon, label:'Dark theme'}]`.

**Styling:**
- Container: `background: var(--surface-container-high)`, `border-radius: var(--radius-full)`, padding 4px, `display: inline-flex`, `gap: 2px`
- Button (inactive): transparent, `color: var(--on-surface-variant)`, 32×32px, `border-radius: var(--radius-full)`, no border, cursor pointer
- Button (hover): `background: var(--surface-container-highest)`, `color: var(--on-surface)`
- Button (active): `background: var(--surface-container-lowest)`, `color: var(--primary)`
- Focus-visible: `outline: 2px solid var(--primary); outline-offset: 2px`
- Transition: `background 150ms ease, color 150ms ease`

**Icons:** Inline SVG, defined as three tiny Svelte sub-components (Sun, Monitor, Moon) inside the same component file. No icon library dependency.

**Accessibility:**
- `role="radiogroup"` with `aria-label="Color theme"` on the container
- `role="radio"` + `aria-checked` + `aria-label` on each button
- Left/Right arrow keys move focus + select (handled via keydown on the container; Home/End optional)
- `:focus-visible` shows a 2px primary outline
- Icons marked `aria-hidden="true"` since each button has an aria-label

### 6. Migration plan

The migration is a pure token swap. No layout, no new features, no copy changes.

**Step A — `app.html` updates:**
- Replace Fraunces Google Fonts link with: Space Grotesk (weights 400, 500, 600, 700) + JetBrains Mono (weights 400, 500) + Inter (unchanged, weights 300, 400, 500, 600, 700)
- Add the inline FOUC-prevention `<script>` in `<head>` before `%sveltekit.head%`

**Step B — `src/app.css` rewrite:**
- Build the `:root` + `@media (prefers-color-scheme: dark)` + `:root[data-theme='light']` + `:root[data-theme='dark']` structure from Sections 1–2
- Replace `font-family: 'Fraunces', ...` in `h1,h2,h3,h4` with `var(--font-display)`
- Replace `font-family: 'Inter', ...` in body with `var(--font-body)`
- Update `::selection` colors to use `var(--primary)` / `var(--on-primary)`
- Remove `--warm` token (unused after Step D migration; confirmed via grep, only reference is inside `app.css` itself)
- `.container` and `.eyebrow` utility classes keep their structure; update color references to new tokens

**Step C — create new files:**
- `src/lib/stores/theme.js` (Section 4)
- `src/lib/components/ThemeToggle.svelte` (Section 5)

**Step D — component token migration.** Find/replace across all 8 components in `src/lib/components/`:

| Old token | New token |
|---|---|
| `--ink-900` | `--on-surface` |
| `--ink-700` | `--on-surface` |
| `--ink-500` | `--on-surface-variant` |
| `--ink-300` | `--outline` |
| `--ink-200` | `--outline-variant` |
| `--paper` | `--surface` |
| `--paper-raised` | `--surface-container-lowest` |
| `--rule` | `--outline-variant` |
| `--accent` | `--primary` |
| `--accent-soft` | `--surface-container-high` |
| `--accent-ink` | `--primary` |
| `--warm` | *remove usage; no current references in components* |

**Hardcoded rgba / hex values in component `<style>` blocks** must also be converted. Specific known case:
- `Nav.svelte`: `rgba(251, 251, 247, 0.72)` → `color-mix(in oklab, var(--surface) 72%, transparent)`
- `Nav.svelte`: `rgba(251, 251, 247, 0.88)` → `color-mix(in oklab, var(--surface) 88%, transparent)`

Implementation must grep each component for `rgb(`, `rgba(`, `#` hex literals inside `<style>` blocks and convert to token expressions. Any that can't be mapped cleanly to a token are flagged during implementation.

**Step E — integrate ThemeToggle:**
- Import `ThemeToggle` in `Nav.svelte`
- Place `<ThemeToggle />` between the `<nav aria-label="Primary">` element and the `.cta` anchor
- Add wrapper styles in Nav to align the toggle vertically with existing nav items

**Step F — verification:**
- Run `npm run dev`
- Manually verify: toggle between Light / System / Dark; observe the full page and every section renders correctly in each mode
- Flip OS appearance while preference is "System" — site should follow without reload
- Hard-reload in each mode — no FOUC
- Run `npm run lint`
- Run `npm run build` — confirm prerender still works with `adapter-static`

## Files

**New:**
- `src/lib/stores/theme.js`
- `src/lib/components/ThemeToggle.svelte`
- `docs/superpowers/specs/2026-04-19-theme-toggle-design.md` (this file)

**Modified:**
- `src/app.html` — font links + inline FOUC script
- `src/app.css` — full token layer rewrite
- `src/lib/components/Nav.svelte` — integrate ThemeToggle, migrate tokens, replace hardcoded rgbas
- `src/lib/components/Hero.svelte` — token migration only
- `src/lib/components/Projects.svelte` — token migration only
- `src/lib/components/Skills.svelte` — token migration only
- `src/lib/components/Experience.svelte` — token migration only
- `src/lib/components/Contact.svelte` — token migration only
- `src/lib/components/Footer.svelte` — token migration only
- `src/lib/components/SocialIcons.svelte` — token migration only

## Risks & open items

- **Shadow appearance in dark mode.** `--shadow-*` tokens stay untouched in Phase 1 and will render nearly invisible on the dark surface. Accepted; Phase 2 replaces with tinted ambient shadows.
- **`color-mix()` browser support.** Requires browsers released 2023 or later. Safari 16.4+, Firefox 113+, Chrome 111+. SvelteKit + Svelte 4 don't target older browsers; acceptable.
- **No visual regression tests.** Verification is manual across both themes + system mode.
- **Copy/content unchanged in Phase 1.** The current site's editorial copy ("Principal Software Engineer...") will coexist with Synthetix Engineering's colors and Space Grotesk heading font until Phase 2 rewrites to terminal aesthetic (`System_Architect`, `Initialize_Project`, etc.). Phase 1 intentionally ships this intermediate state.

## Handoff

After spec approval, invoke the `superpowers:writing-plans` skill to produce a step-by-step implementation plan.
