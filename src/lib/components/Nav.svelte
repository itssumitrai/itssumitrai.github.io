<script>
    import { site } from '$lib/data/site.js';
    import { onMount } from 'svelte';
    import ThemeToggle from './ThemeToggle.svelte';

    let scrolled = false;
    onMount(() => {
        const onScroll = () => {
            scrolled = window.scrollY > 8;
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    });
</script>

<header class="nav" class:scrolled>
    <div class="container nav-inner">
        <a href="#top" class="brand">
            <span class="mark" aria-hidden="true">✦</span>
            <span class="name">{site.name}</span>
        </a>
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
    </div>
</header>

<style>
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
</style>
