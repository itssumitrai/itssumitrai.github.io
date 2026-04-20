<script>
    import { site } from '$lib/data/site.js';
    import { onMount } from 'svelte';
    import ThemeToggle from './ThemeToggle.svelte';

    let scrolled = false;
    let active = '';
    onMount(() => {
        const onScroll = () => {
            scrolled = window.scrollY > 8;
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        const ids = site.nav.map((n) => n.href.slice(1));
        const targets = ids.map((id) => document.getElementById(id)).filter(Boolean);
        const visible = Object.create(null);
        const observer = new IntersectionObserver(
            (entries) => {
                for (const e of entries) visible[e.target.id] = e.isIntersecting;
                const next = ids.find((id) => visible[id]);
                if (next) active = next;
            },
            { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
        );
        targets.forEach((t) => observer.observe(t));

        return () => {
            window.removeEventListener('scroll', onScroll);
            observer.disconnect();
        };
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
                {#each site.nav as item (item.href)}
                    <li>
                        <a
                            href={item.href}
                            class:active={active === item.href.slice(1)}
                            aria-current={active === item.href.slice(1) ? 'page' : undefined}
                        >
                            {item.label}
                        </a>
                    </li>
                {/each}
            </ul>
        </nav>
        <div class="nav-right">
            <ThemeToggle />
            {#if site.resume}
                <a class="resume" href={site.resume} download aria-label="Download resume">
                    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                        <path
                            fill="currentColor"
                            d="M8 1a.75.75 0 0 1 .75.75v7.69l2.22-2.22a.75.75 0 1 1 1.06 1.06l-3.5 3.5a.75.75 0 0 1-1.06 0l-3.5-3.5a.75.75 0 1 1 1.06-1.06l2.22 2.22V1.75A.75.75 0 0 1 8 1Zm-5.25 11.5a.75.75 0 0 1 .75.75V14a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-.75a.75.75 0 0 1 1.5 0V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-.75a.75.75 0 0 1 .75-.75Z"
                        />
                    </svg>
                    <span>Resume</span>
                </a>
            {/if}
            {#if site.social.email}
                <a class="cta" href={site.social.email}>Let's talk</a>
            {/if}
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
        position: relative;
        color: var(--on-surface-variant);
        font-size: 0.92rem;
        font-weight: 500;
        padding-bottom: 6px;
        transition: color 150ms ease;
    }
    nav a:hover {
        color: var(--on-surface);
    }
    nav a::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 2px;
        background: var(--primary);
        border-radius: 999px;
        transform: scaleX(0);
        transform-origin: left center;
        transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
    }
    nav a.active {
        color: var(--on-surface);
    }
    nav a.active::after {
        transform: scaleX(1);
    }
    .nav-right {
        display: inline-flex;
        align-items: center;
        gap: 10px;
    }
    .resume {
        display: none;
        align-items: center;
        gap: 6px;
        padding: 7px 12px;
        border-radius: var(--radius-full);
        background: transparent;
        color: var(--on-surface);
        font-size: 0.85rem;
        font-weight: 500;
        border: 1px solid var(--outline-variant);
        transition:
            border-color 150ms ease,
            color 150ms ease,
            background 150ms ease;
    }
    .resume:hover {
        border-color: var(--on-surface);
        background: var(--surface-container-lowest);
    }
    .resume svg {
        color: var(--outline);
        transition: color 150ms ease;
    }
    .resume:hover svg {
        color: var(--primary);
    }
    @media (min-width: 560px) {
        .resume {
            display: inline-flex;
        }
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
