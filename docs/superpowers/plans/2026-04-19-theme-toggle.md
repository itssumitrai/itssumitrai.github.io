# Theme Toggle + Design Token Foundation (Phase 1) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the site's CSS to the Synthetix Engineering design token system (dark + derived light), introduce a visible light/dark/system theme toggle with localStorage persistence and no-FOUC rendering, and migrate all 8 existing components to the new token names — without changing any layout.

**Architecture:** Define two overlapping layers of CSS custom properties (light defaults in `:root`, dark overrides via `@media (prefers-color-scheme: dark)` and via explicit `[data-theme='dark']` user override). A Svelte store resolves user preference → DOM attribute. An inline `<head>` script prevents FOUC by setting the attribute before first paint. Components read tokens through `var(--…)` so the whole site re-themes via CSS.

**Tech Stack:** SvelteKit 2 (adapter-static), Svelte 4, Vite, plain CSS custom properties (no Tailwind/PostCSS preprocessing), Google Fonts for Space Grotesk + JetBrains Mono + Inter.

**Spec:** See `docs/superpowers/specs/2026-04-19-theme-toggle-design.md`.

**Migration strategy:** To keep the site rendering through the migration, Task 2 introduces the new token names AND keeps the old token names as aliases (e.g., `--ink-900: var(--on-surface)`). Tasks 5–10 migrate each component group to the new names. Task 11 removes the aliases and runs the final verification.

**Verification approach:** The project has no test infrastructure (`npm test` is `echo testing disabled`). All verification in this plan is manual: run `npm run dev`, observe the browser in each theme state. Adding a test framework is out of scope for Phase 1.

**File structure:**

- **New files:**
  - `src/lib/stores/theme.js` — single source of truth for theme preference + resolved theme (Svelte stores)
  - `src/lib/components/ThemeToggle.svelte` — 3-option segmented control with inline SVG icons
- **Modified files:**
  - `src/app.html` — font links + inline FOUC script
  - `src/app.css` — full token rewrite, then alias cleanup in final task
  - `src/lib/components/Nav.svelte` — integrates ThemeToggle + token migration + `rgba` → `color-mix` conversions
  - `src/lib/components/Hero.svelte` — token migration + hardcoded color conversions
  - `src/lib/components/Projects.svelte` — token migration only
  - `src/lib/components/Skills.svelte` — token migration + hardcoded color conversion
  - `src/lib/components/Experience.svelte` — token migration + `rgba` conversion
  - `src/lib/components/Contact.svelte` — token migration + `rgba` conversions
  - `src/lib/components/Footer.svelte` — token migration only
  - `src/lib/components/SocialIcons.svelte` — token migration only

---

## Task 1: Update `app.html` — fonts + FOUC script

**Files:**
- Modify: `src/app.html`

- [ ] **Step 1: Replace the Fraunces font link with Space Grotesk + JetBrains Mono + Inter**

Find this block in `src/app.html`:
```html
<link
    href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@300;400;500;600;700&display=swap"
    rel="stylesheet"
/>
```
Replace with:
```html
<link
    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Inter:wght@300;400;500;600;700&display=swap"
    rel="stylesheet"
/>
```

- [ ] **Step 2: Add the inline FOUC-prevention script**

Immediately before `%sveltekit.head%` in `src/app.html`, add:
```html
<script>
    (function () {
        try {
            var p = localStorage.getItem('theme-preference') || 'system';
            var sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            var resolved = p === 'system' ? (sysDark ? 'dark' : 'light') : p;
            document.documentElement.setAttribute('data-theme', resolved);
        } catch (e) {}
    })();
</script>
```

- [ ] **Step 3: Verify locally**

Run: `npm run dev`
Open the site in a browser. Open DevTools → Elements tab.
Expected: `<html>` now has `data-theme="light"` (or `dark` if your OS is in dark mode). Network tab shows `fonts.googleapis.com` request for `Space+Grotesk`, `JetBrains+Mono`, `Inter`. No console errors.

- [ ] **Step 4: Commit**

```bash
git add src/app.html
git commit -m "feat(theme): load new display fonts and set data-theme before paint"
```

---

## Task 2: Rewrite `app.css` with new token layer + legacy aliases

**Files:**
- Modify: `src/app.css`

- [ ] **Step 1: Replace `src/app.css` with the new token layer**

Overwrite the entire contents of `src/app.css` with:

```css
/* -------- Base tokens: light defaults (applied when no preference or data-theme="light") -------- */
:root {
    /* Surfaces */
    --surface: #f9f9fd;
    --surface-container-lowest: #ffffff;
    --surface-container-low: #f3f4f5;
    --surface-container: #edeeef;
    --surface-container-high: #e7e8e9;
    --surface-container-highest: #e1e3e4;
    --surface-bright: #ffffff;

    /* Text on surfaces */
    --on-surface: #0c0e11;
    --on-surface-variant: #46484b;
    --outline: #747579;
    --outline-variant: #c7c4d8;

    /* Brand */
    --primary: #0891b2;
    --primary-container: #06b6d4;
    --on-primary: #ffffff;
    --secondary: #a21caf;
    --secondary-container: #c026d3;
    --tertiary: #2563eb;
    --error: #ba1a1a;

    /* Legacy aliases (removed in Task 11 after component migration) */
    --ink-900: var(--on-surface);
    --ink-700: var(--on-surface);
    --ink-500: var(--on-surface-variant);
    --ink-300: var(--outline);
    --ink-200: var(--outline-variant);
    --paper: var(--surface);
    --paper-raised: var(--surface-container-lowest);
    --rule: var(--outline-variant);
    --accent: var(--primary);
    --accent-soft: var(--surface-container-high);
    --accent-ink: var(--primary);

    /* Radii */
    --radius-xs: 2px;
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --radius-full: 9999px;
    /* Legacy alias (removed in Task 11) */
    --radius: var(--radius-lg);

    /* Shadows — preserved from previous design; Phase 2 replaces these */
    --shadow-sm: 0 1px 2px rgba(15, 17, 21, 0.04), 0 1px 3px rgba(15, 17, 21, 0.04);
    --shadow-md: 0 4px 12px rgba(15, 17, 21, 0.06), 0 2px 4px rgba(15, 17, 21, 0.04);
    --shadow-lg: 0 20px 40px -12px rgba(15, 17, 21, 0.14);

    /* Typography */
    --font-display: 'Space Grotesk', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
        sans-serif;
    --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial,
        sans-serif;
    --font-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Consolas, 'Liberation Mono', monospace;
    /* Legacy aliases (removed in Task 11) */
    --font-serif: var(--font-display);
    --font-sans: var(--font-body);

    /* Layout */
    --container: 1120px;
}

/* -------- Dark tokens via OS preference (when no explicit data-theme set) -------- */
@media (prefers-color-scheme: dark) {
    :root {
        --surface: #0c0e11;
        --surface-container-lowest: #000000;
        --surface-container-low: #111417;
        --surface-container: #171a1d;
        --surface-container-high: #1d2024;
        --surface-container-highest: #23262a;
        --surface-bright: #292c31;

        --on-surface: #f9f9fd;
        --on-surface-variant: #aaabaf;
        --outline: #747579;
        --outline-variant: #46484b;

        --primary: #8ff5ff;
        --primary-container: #00eefc;
        --on-primary: #005d63;
        --secondary: #d575ff;
        --secondary-container: #9800d0;
        --tertiary: #65afff;
        --error: #ff716c;
    }
}

/* -------- Explicit user override: light -------- */
:root[data-theme='light'] {
    --surface: #f9f9fd;
    --surface-container-lowest: #ffffff;
    --surface-container-low: #f3f4f5;
    --surface-container: #edeeef;
    --surface-container-high: #e7e8e9;
    --surface-container-highest: #e1e3e4;
    --surface-bright: #ffffff;

    --on-surface: #0c0e11;
    --on-surface-variant: #46484b;
    --outline: #747579;
    --outline-variant: #c7c4d8;

    --primary: #0891b2;
    --primary-container: #06b6d4;
    --on-primary: #ffffff;
    --secondary: #a21caf;
    --secondary-container: #c026d3;
    --tertiary: #2563eb;
    --error: #ba1a1a;
}

/* -------- Explicit user override: dark -------- */
:root[data-theme='dark'] {
    --surface: #0c0e11;
    --surface-container-lowest: #000000;
    --surface-container-low: #111417;
    --surface-container: #171a1d;
    --surface-container-high: #1d2024;
    --surface-container-highest: #23262a;
    --surface-bright: #292c31;

    --on-surface: #f9f9fd;
    --on-surface-variant: #aaabaf;
    --outline: #747579;
    --outline-variant: #46484b;

    --primary: #8ff5ff;
    --primary-container: #00eefc;
    --on-primary: #005d63;
    --secondary: #d575ff;
    --secondary-container: #9800d0;
    --tertiary: #65afff;
    --error: #ff716c;
}

*,
*::before,
*::after {
    box-sizing: border-box;
}

html,
body {
    margin: 0;
    padding: 0;
}

body {
    background-color: var(--surface);
    color: var(--on-surface);
    font-family: var(--font-body);
    font-size: 16px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    transition:
        background-color 200ms ease,
        color 200ms ease;
}

h1,
h2,
h3,
h4 {
    font-family: var(--font-display);
    font-weight: 500;
    color: var(--on-surface);
    letter-spacing: -0.01em;
    line-height: 1.15;
    margin: 0;
}

p {
    margin: 0;
    color: var(--on-surface-variant);
}

a {
    color: inherit;
    text-decoration: none;
}

button {
    font-family: inherit;
    cursor: pointer;
}

::selection {
    background: var(--primary);
    color: var(--on-primary);
}

.container {
    max-width: var(--container);
    margin: 0 auto;
    padding: 0 24px;
}

.eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-body);
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--primary);
}

.eyebrow::before {
    content: '';
    display: inline-block;
    width: 24px;
    height: 1px;
    background: var(--primary);
}
```

- [ ] **Step 2: Verify site still renders**

Run: `npm run dev`
Open the site.
Expected: Site renders nearly identically to before; old token names still resolve via the legacy aliases. Body uses Inter (unchanged). Headings now use Space Grotesk (different from Fraunces — this is expected and correct). Toggle OS theme preference → site color scheme flips.
Open DevTools Elements → click `<html>` → Computed tab → filter for `--surface`. Expected: value resolves (e.g., `#f9f9fd` on light, `#0c0e11` on dark).

- [ ] **Step 3: Commit**

```bash
git add src/app.css
git commit -m "feat(theme): introduce Synthetix Engineering design tokens with legacy aliases"
```

---

## Task 3: Create theme store

**Files:**
- Create: `src/lib/stores/theme.js`

- [ ] **Step 1: Create the stores directory and write `theme.js`**

Create `src/lib/stores/theme.js` with contents:

```js
import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'theme-preference';
const VALID = ['light', 'dark', 'system'];

function readInitial() {
    if (!browser) return 'system';
    try {
        const v = localStorage.getItem(STORAGE_KEY);
        return VALID.includes(v) ? v : 'system';
    } catch {
        return 'system';
    }
}

export const preference = writable(readInitial());

export const resolved = derived(preference, ($p, set) => {
    if (!browser) {
        set('light');
        return;
    }
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const compute = () => ($p === 'system' ? (mq.matches ? 'dark' : 'light') : $p);
    set(compute());
    const onChange = () => {
        if ($p === 'system') set(compute());
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
});

if (browser) {
    preference.subscribe((p) => {
        try {
            localStorage.setItem(STORAGE_KEY, p);
        } catch {}
    });
    resolved.subscribe((r) => {
        document.documentElement.setAttribute('data-theme', r);
    });
}
```

- [ ] **Step 2: Verify the store imports without errors**

Run: `npm run dev`
Expected: Dev server starts without errors. Visit the site, open DevTools → Console. No errors about `stores/theme.js`. (The store isn't imported by any component yet, so nothing visible changes; this step just confirms the file is valid.)

To quickly verify the file parses, run:
```bash
node --input-type=module -e "console.log('ok')" < src/lib/stores/theme.js 2>&1 | head -5
```
This will error (because `svelte/store` and `$app/environment` aren't resolvable outside SvelteKit), but if you see a module-resolution error rather than a syntax error, the file is valid JS. Primary verification is `npm run dev` producing no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/stores/theme.js
git commit -m "feat(theme): add theme preference + resolved stores"
```

---

## Task 4: Create `ThemeToggle` component

**Files:**
- Create: `src/lib/components/ThemeToggle.svelte`

- [ ] **Step 1: Write the component**

Create `src/lib/components/ThemeToggle.svelte`:

```svelte
<script>
    import { preference } from '$lib/stores/theme.js';

    const options = [
        { value: 'light', label: 'Light theme' },
        { value: 'system', label: 'System theme' },
        { value: 'dark', label: 'Dark theme' }
    ];

    function handleKeydown(e) {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        e.preventDefault();
        const currentIndex = options.findIndex((o) => o.value === $preference);
        const delta = e.key === 'ArrowRight' ? 1 : -1;
        const next = (currentIndex + delta + options.length) % options.length;
        preference.set(options[next].value);
    }
</script>

<div
    class="theme-toggle"
    role="radiogroup"
    aria-label="Color theme"
    on:keydown={handleKeydown}
>
    {#each options as opt}
        <button
            type="button"
            role="radio"
            aria-checked={$preference === opt.value}
            aria-label={opt.label}
            class:active={$preference === opt.value}
            tabindex={$preference === opt.value ? 0 : -1}
            on:click={() => preference.set(opt.value)}
        >
            {#if opt.value === 'light'}
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                    <circle cx="12" cy="12" r="4" fill="currentColor" />
                    <g stroke="currentColor" stroke-width="2" stroke-linecap="round">
                        <line x1="12" y1="2" x2="12" y2="5" />
                        <line x1="12" y1="19" x2="12" y2="22" />
                        <line x1="2" y1="12" x2="5" y2="12" />
                        <line x1="19" y1="12" x2="22" y2="12" />
                        <line x1="4.9" y1="4.9" x2="7" y2="7" />
                        <line x1="17" y1="17" x2="19.1" y2="19.1" />
                        <line x1="4.9" y1="19.1" x2="7" y2="17" />
                        <line x1="17" y1="7" x2="19.1" y2="4.9" />
                    </g>
                </svg>
            {:else if opt.value === 'system'}
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                    <rect
                        x="3"
                        y="4"
                        width="18"
                        height="13"
                        rx="2"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    />
                    <line
                        x1="8"
                        y1="21"
                        x2="16"
                        y2="21"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                    />
                    <line
                        x1="12"
                        y1="17"
                        x2="12"
                        y2="21"
                        stroke="currentColor"
                        stroke-width="2"
                    />
                </svg>
            {:else}
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                    <path
                        d="M21 12.8A9 9 0 0 1 11.2 3a7 7 0 1 0 9.8 9.8z"
                        fill="currentColor"
                    />
                </svg>
            {/if}
        </button>
    {/each}
</div>

<style>
    .theme-toggle {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        padding: 4px;
        background: var(--surface-container-high);
        border-radius: var(--radius-full);
    }
    button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        padding: 0;
        background: transparent;
        border: none;
        border-radius: var(--radius-full);
        color: var(--on-surface-variant);
        transition:
            background 150ms ease,
            color 150ms ease;
    }
    button:hover {
        background: var(--surface-container-highest);
        color: var(--on-surface);
    }
    button.active {
        background: var(--surface-container-lowest);
        color: var(--primary);
    }
    button:focus-visible {
        outline: 2px solid var(--primary);
        outline-offset: 2px;
    }
</style>
```

- [ ] **Step 2: Verify the component compiles**

Run: `npm run dev`
Expected: No compile errors about `ThemeToggle.svelte`. (Not yet placed on the page — verified in Task 5.)

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/ThemeToggle.svelte
git commit -m "feat(theme): add ThemeToggle segmented control component"
```

---

## Task 5: Migrate `Nav.svelte` — integrate `ThemeToggle`, swap tokens, convert hardcoded rgba

**Files:**
- Modify: `src/lib/components/Nav.svelte`

- [ ] **Step 1: Import ThemeToggle and place it in the nav**

In `src/lib/components/Nav.svelte`, update the `<script>` block:

Find:
```svelte
<script>
    import { site } from '$lib/data/site.js';
    import { onMount } from 'svelte';
```
Replace with:
```svelte
<script>
    import { site } from '$lib/data/site.js';
    import { onMount } from 'svelte';
    import ThemeToggle from './ThemeToggle.svelte';
```

Then in the template, find:
```svelte
        <nav aria-label="Primary">
            <ul>
                {#each site.nav as item}
                    <li><a href={item.href}>{item.label}</a></li>
                {/each}
            </ul>
        </nav>
        <a class="cta" href={site.social.email}>Let's talk</a>
```
Replace with:
```svelte
        <nav aria-label="Primary">
            <ul>
                {#each site.nav as item}
                    <li><a href={item.href}>{item.label}</a></li>
                {/each}
            </ul>
        </nav>
        <div class="nav-right">
            <ThemeToggle />
            <a class="cta" href={site.social.email}>Let's talk</a>
        </div>
```

- [ ] **Step 2: Migrate tokens and replace hardcoded rgba in the `<style>` block**

In the same file, replace the contents of the `<style>` block with:

```css
    .nav {
        position: sticky;
        top: 0;
        z-index: 40;
        background: color-mix(in oklab, var(--surface) 72%, transparent);
        backdrop-filter: saturate(180%) blur(14px);
        -webkit-backdrop-filter: saturate(180%) blur(14px);
        border-bottom: 1px solid transparent;
        transition:
            border-color 200ms ease,
            background 200ms ease;
    }
    .nav.scrolled {
        border-color: var(--outline-variant);
        background: color-mix(in oklab, var(--surface) 88%, transparent);
    }
    .nav-inner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 68px;
        gap: 24px;
    }
    .brand {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        font-family: var(--font-display);
        font-size: 1.15rem;
        font-weight: 600;
        color: var(--on-surface);
    }
    .mark {
        color: var(--primary);
        font-size: 1.1rem;
        line-height: 1;
    }
    nav ul {
        display: none;
        gap: 28px;
        list-style: none;
        padding: 0;
        margin: 0;
    }
    nav a {
        color: var(--on-surface-variant);
        font-size: 0.92rem;
        font-weight: 500;
        transition: color 150ms ease;
    }
    nav a:hover {
        color: var(--on-surface);
    }
    .nav-right {
        display: inline-flex;
        align-items: center;
        gap: 14px;
    }
    .cta {
        display: inline-flex;
        align-items: center;
        padding: 8px 14px;
        border-radius: var(--radius-full);
        background: var(--on-surface);
        color: var(--surface);
        font-size: 0.88rem;
        font-weight: 500;
        border: 1px solid var(--on-surface);
        transition:
            transform 150ms ease,
            background 150ms ease;
    }
    .cta:hover {
        background: var(--primary);
        border-color: var(--primary);
        color: var(--on-primary);
        transform: translateY(-1px);
    }
    @media (min-width: 760px) {
        nav ul {
            display: flex;
        }
    }
```

- [ ] **Step 3: Verify in the browser**

Run: `npm run dev`
Open the site. Expected:
- Theme toggle appears to the right of the nav links, left of the "Let's talk" button.
- Clicking each of the three toggle icons changes the site theme immediately.
- Reloading the page preserves the last-selected theme.
- With toggle set to "System", changing macOS appearance (System Settings → Appearance → Light/Dark) flips the site without reload.
- Hard-refreshing in each mode → no flash of the wrong theme.
- Nav background stays translucent over the hero (glassy).

- [ ] **Step 4: Commit**

```bash
git add src/lib/components/Nav.svelte
git commit -m "feat(theme): integrate ThemeToggle in Nav and migrate Nav to new tokens"
```

---

## Task 6: Migrate `Hero.svelte`

**Files:**
- Modify: `src/lib/components/Hero.svelte`

- [ ] **Step 1: Swap tokens and hardcoded colors in the `<style>` block**

In `src/lib/components/Hero.svelte`, find the `<style>` block and apply these replacements in place:

| Find | Replace with |
|---|---|
| `rgba(79, 70, 229, 0.14)` | `color-mix(in oklab, var(--primary) 14%, transparent)` |
| `rgba(194, 134, 74, 0.12)` | `color-mix(in oklab, var(--secondary) 12%, transparent)` |
| `var(--ink-900)` | `var(--on-surface)` |
| `var(--ink-500)` | `var(--on-surface-variant)` |
| `var(--font-sans)` | `var(--font-body)` |
| `var(--paper)` | `var(--surface)` |
| `var(--accent)` | `var(--primary)` |
| `var(--ink-200)` | `var(--outline-variant)` |
| `var(--paper-raised)` | `var(--surface-container-lowest)` |
| `var(--rule)` | `var(--outline-variant)` |
| `var(--font-serif)` | `var(--font-display)` |
| `var(--accent-ink)` | `var(--primary)` |
| `var(--ink-300)` | `var(--outline)` |

Also replace the photo gradient so it adapts to theme. Find:
```css
        background:
            radial-gradient(120% 120% at 30% 20%, #eef2ff 0%, #dbe1f9 50%, #c6cff1 100%);
```
Replace with:
```css
        background:
            radial-gradient(
                120% 120% at 30% 20%,
                color-mix(in oklab, var(--primary) 8%, var(--surface)) 0%,
                color-mix(in oklab, var(--primary) 18%, var(--surface)) 50%,
                color-mix(in oklab, var(--primary) 30%, var(--surface)) 100%
            );
```

The green status dot (`#22c55e` and `rgba(34, 197, 94, 0.15)`) stays as-is — it represents an online/available status and should read the same in both themes.

- [ ] **Step 2: Verify in the browser**

Run: `npm run dev`
Visit `/`. Expected:
- Hero copy + portrait render identically to before in light mode; colors look balanced.
- Flip to dark mode via the toggle → hero beam glow now uses cyan + magenta tints instead of indigo + warm. Portrait circle gradient shifts to cyan-tinted on the dark surface.
- Chips ("Currently", "Since") legible in both modes.
- "View Work" button hover turns cyan in dark, teal in light.

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/Hero.svelte
git commit -m "feat(theme): migrate Hero tokens and convert hardcoded glow colors"
```

---

## Task 7: Migrate `Projects.svelte`, `Footer.svelte`, `SocialIcons.svelte` (pure token swap, no hardcoded colors)

**Files:**
- Modify: `src/lib/components/Projects.svelte`
- Modify: `src/lib/components/Footer.svelte`
- Modify: `src/lib/components/SocialIcons.svelte`

- [ ] **Step 1: Apply token find/replace in all three files**

Apply this substitution table to the `<style>` block of each of the three files:

| Find | Replace with |
|---|---|
| `var(--rule)` | `var(--outline-variant)` |
| `var(--paper-raised)` | `var(--surface-container-lowest)` |
| `var(--paper)` | `var(--surface)` |
| `var(--ink-900)` | `var(--on-surface)` |
| `var(--ink-700)` | `var(--on-surface)` |
| `var(--ink-500)` | `var(--on-surface-variant)` |
| `var(--ink-300)` | `var(--outline)` |
| `var(--ink-200)` | `var(--outline-variant)` |
| `var(--accent)` | `var(--primary)` |
| `var(--accent-ink)` | `var(--primary)` |
| `var(--accent-soft)` | `var(--surface-container-high)` |
| `var(--radius)` | `var(--radius-lg)` |
| `var(--font-serif)` | `var(--font-display)` |
| `var(--font-sans)` | `var(--font-body)` |

This is a mechanical replacement — every token reference in every `<style>` block of these three files should match one of these row mappings.

- [ ] **Step 2: Verify no stale tokens remain in the three files**

```bash
grep -E "var\(--ink-|var\(--paper|var\(--rule|var\(--accent|var\(--warm|var\(--radius\)|var\(--font-serif|var\(--font-sans" src/lib/components/Projects.svelte src/lib/components/Footer.svelte src/lib/components/SocialIcons.svelte
```
Expected: No output (all old tokens swapped). Note: `var(--radius\)` matches only the bare `--radius` alias, not `--radius-lg`/`--radius-sm` which are valid new tokens.

- [ ] **Step 3: Verify in the browser**

Run: `npm run dev`
Visit `/`. Expected:
- Projects section: cards readable in both modes; hover raises card and arrow turns cyan/teal.
- Footer: legible in both modes; brand mark picks up primary color.
- Social icons: icon buttons render in both modes; hover state uses the primary color.

- [ ] **Step 4: Commit**

```bash
git add src/lib/components/Projects.svelte src/lib/components/Footer.svelte src/lib/components/SocialIcons.svelte
git commit -m "feat(theme): migrate Projects, Footer, SocialIcons to new tokens"
```

---

## Task 8: Migrate `Skills.svelte`

**Files:**
- Modify: `src/lib/components/Skills.svelte`

- [ ] **Step 1: Swap tokens and the hardcoded gradient color**

Apply the same substitution table as Task 7 to the `<style>` block of `src/lib/components/Skills.svelte`.

Additionally, find this line:
```css
        background: linear-gradient(180deg, var(--paper), #f5f3ec 100%);
```
Replace with:
```css
        background: linear-gradient(180deg, var(--surface), var(--surface-container-low) 100%);
```

- [ ] **Step 2: Verify in the browser**

Run: `npm run dev`
Visit `/`. Expected:
- Skills section background is a subtle vertical gradient in both modes (not a warm-beige in dark).
- Group cards readable with no border issues.
- Pill hover states use primary/teal color.

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/Skills.svelte
git commit -m "feat(theme): migrate Skills tokens and adapt gradient to theme"
```

---

## Task 9: Migrate `Experience.svelte`

**Files:**
- Modify: `src/lib/components/Experience.svelte`

- [ ] **Step 1: Swap tokens and convert hardcoded rgba**

Apply the Task 7 substitution table to the `<style>` block of `src/lib/components/Experience.svelte`.

Additionally, find:
```css
        box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.08);
```
Replace with:
```css
        box-shadow: 0 0 0 4px color-mix(in oklab, var(--primary) 8%, transparent);
```

And find:
```css
        border: 2px solid var(--accent, var(--accent));
```
Replace with:
```css
        border: 2px solid var(--accent, var(--primary));
```

This keeps `--accent` as the per-role component-local variable set by inline `style="--accent: {role.accent}"`, but falls back to the new global `--primary` token if a role's accent is missing.

**Note:** The inline `style="--accent: {role.accent}"` on `<li class="item">` is intentional — a component-local CSS custom property scoped to each timeline item, unrelated to the old global `--accent` token. Leave this inline style alone.

- [ ] **Step 2: Verify in the browser**

Run: `npm run dev`
Visit `/`. Expected:
- Experience timeline: role markers show the per-role accent color (coming from `role.accent` data, not the global token).
- Cards hover with a subtle lift; border color changes to the outline-variant.
- Experience section renders correctly in both light and dark modes.

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/Experience.svelte
git commit -m "feat(theme): migrate Experience tokens and convert marker shadow to primary tint"
```

---

## Task 10: Migrate `Contact.svelte`

**Files:**
- Modify: `src/lib/components/Contact.svelte`

- [ ] **Step 1: Swap tokens and convert hardcoded rgba**

Apply the Task 7 substitution table to the `<style>` block of `src/lib/components/Contact.svelte`.

Additionally, find:
```css
        background:
            radial-gradient(600px 240px at 10% 0%, rgba(79, 70, 229, 0.12), transparent 60%),
            radial-gradient(600px 240px at 100% 100%, rgba(194, 134, 74, 0.1), transparent 60%),
            var(--paper-raised);
```
Replace with:
```css
        background:
            radial-gradient(
                600px 240px at 10% 0%,
                color-mix(in oklab, var(--primary) 12%, transparent),
                transparent 60%
            ),
            radial-gradient(
                600px 240px at 100% 100%,
                color-mix(in oklab, var(--secondary) 10%, transparent),
                transparent 60%
            ),
            var(--surface-container-lowest);
```

- [ ] **Step 2: Verify in the browser**

Run: `npm run dev`
Visit `/`. Expected:
- Contact card shows a dual radial glow (primary + secondary tint) in both modes.
- "Say hello" button readable; hover turns primary in both modes.
- Social icons in the card legible.

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/Contact.svelte
git commit -m "feat(theme): migrate Contact tokens and adapt radial glows to theme"
```

---

## Task 11: Remove legacy aliases, final verification

**Files:**
- Modify: `src/app.css`

- [ ] **Step 1: Verify no legacy tokens remain anywhere in `src/`**

```bash
grep -rE "var\(--ink-|var\(--paper|var\(--rule|var\(--accent[^,]|var\(--warm|var\(--radius\)|var\(--font-serif|var\(--font-sans" src/lib src/routes
```
Expected: No output. Notes:
- `var\(--radius\)` matches only the bare `--radius` alias, not `--radius-lg`/`--radius-sm` which are valid new tokens.
- `var\(--accent[^,]` matches `var(--accent)`, `var(--accent-soft)`, `var(--accent-ink)` but deliberately skips `var(--accent, var(--primary))` — the intentional per-role fallback inside `Experience.svelte`.

If any lines appear, migrate them following the same substitution table from Task 7 before proceeding.

Additionally confirm `rgba(79, 70, 229` and `rgba(194, 134, 74` (the old hardcoded indigo/warm) do not appear:
```bash
grep -rE "rgba\(79, 70, 229|rgba\(194, 134, 74" src/lib src/routes
```
Expected: No output.

- [ ] **Step 2: Remove the legacy alias block from `app.css`**

In `src/app.css`, inside the `:root { … }` block, find and delete these lines:

```css
    /* Legacy aliases (removed in Task 11 after component migration) */
    --ink-900: var(--on-surface);
    --ink-700: var(--on-surface);
    --ink-500: var(--on-surface-variant);
    --ink-300: var(--outline);
    --ink-200: var(--outline-variant);
    --paper: var(--surface);
    --paper-raised: var(--surface-container-lowest);
    --rule: var(--outline-variant);
    --accent: var(--primary);
    --accent-soft: var(--surface-container-high);
    --accent-ink: var(--primary);
```

And:
```css
    /* Legacy alias (removed in Task 11) */
    --radius: var(--radius-lg);
```

And:
```css
    /* Legacy aliases (removed in Task 11) */
    --font-serif: var(--font-display);
    --font-sans: var(--font-body);
```

- [ ] **Step 3: Lint**

```bash
npm run lint
```
Expected: exits 0 (no lint errors).

- [ ] **Step 4: Build**

```bash
npm run build
```
Expected: exits 0. Build output written to `build/`. No warnings about missing CSS variables.

- [ ] **Step 5: Full manual verification pass in the browser**

Run: `npm run dev`

For **each** of light, system, dark toggle states:
- Scroll the entire homepage top to bottom.
- Confirm every section (Nav, Hero, Projects, Skills, Experience, Contact, Footer) renders cleanly with no broken colors.
- Check text contrast is legible (no near-invisible text).
- Click nav links; confirm smooth-scroll still works.
- Hover over project cards, skill pills, experience cards, social icons. Hover states should use the primary color of the current theme.
- Keyboard-tab through the theme toggle (Tab focuses the toggle group; Left/Right arrows switch; Space/Enter also selects the focused option). Focus outline visible.

Then:
- Hard-refresh the page in each mode. Confirm no flash of the wrong theme.
- With preference = System: flip OS appearance (macOS: System Settings → Appearance). Confirm site flips immediately without reload.

- [ ] **Step 6: Commit**

```bash
git add src/app.css
git commit -m "chore(theme): remove legacy token aliases after component migration"
```

---

## Self-review

**Spec coverage:**
- Token system (dark + derived light): Task 2 ✓
- `:root` light + `@media (prefers-color-scheme: dark)` + `[data-theme='light'|'dark']` overrides: Task 2 ✓
- FOUC prevention inline script: Task 1 ✓
- Font swap Fraunces → Space Grotesk + add JetBrains Mono: Task 1 (load) + Task 2 (apply in `h1`-`h4`) ✓
- Svelte theme store with preference + resolved stores, browser-guarded: Task 3 ✓
- ThemeToggle segmented control with ARIA radiogroup + keyboard nav + inline SVG: Task 4 ✓
- ThemeToggle placement in Nav between links and CTA: Task 5 ✓
- `rgba` → `color-mix` conversions in Nav, Hero, Experience, Contact: Tasks 5, 6, 9, 10 ✓
- Hardcoded hex conversions in Hero (portrait gradient) and Skills (warm gradient): Tasks 6, 8 ✓
- Component token migration for all 8 components: Tasks 5–10 ✓
- Remove `--warm` (only reference was in app.css, dropped in Task 2 rewrite) ✓
- Preserve `--shadow-*` as-is (Phase 2 will replace): Task 2 keeps them ✓
- Remove legacy aliases + final `npm run lint` / `npm run build` / manual verification: Task 11 ✓

**Placeholder scan:** No "TBD" / "TODO" / "add appropriate X" / "similar to Task N" placeholders. Every CSS/code block is complete.

**Type / name consistency:** Store exports `preference` and `resolved`; `ThemeToggle` imports `preference`; stores write `data-theme` attribute which Task 2's CSS reads as `:root[data-theme='…']`. Storage key `'theme-preference'` matches between `app.html` inline script and `stores/theme.js`. Option values `'light' | 'dark' | 'system'` consistent across store, component, inline script. ✓

---

## Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-19-theme-toggle.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
