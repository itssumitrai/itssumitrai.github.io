<script>
    import { site } from '$lib/data/site.js';
    import SocialIcons from './SocialIcons.svelte';
    const year = new Date().getFullYear();
</script>

<footer class="footer">
    <div class="container row">
        <div class="brand">
            <span class="mark" aria-hidden="true">✦</span>
            <span>{site.name}</span>
            <span class="muted">© {year}</span>
        </div>
        <SocialIcons links={site.social} variant="ghost" size={18} />
    </div>
</footer>

<style>
    .footer {
        padding: 32px 0 56px;
        border-top: 1px solid var(--outline-variant);
    }
    .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        flex-wrap: wrap;
    }
    .brand {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        font-family: var(--font-display);
        font-size: 1rem;
        color: var(--on-surface);
    }
    .mark {
        color: var(--primary);
    }
    .muted {
        color: var(--outline);
        font-family: var(--font-body);
        font-size: 0.88rem;
    }
</style>
