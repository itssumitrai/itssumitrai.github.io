<script>
    import { site } from '$lib/data/site.js';
    import SocialIcons from './SocialIcons.svelte';
    import { reveal } from '$lib/actions/reveal.js';
</script>

<section class="contact reveal" id="contact" use:reveal>
    <div class="container">
        <div class="card">
            <span class="eyebrow">Contact</span>
            <h2>Have an idea worth making?</h2>
            <p>
                I'm always happy to chat about engineering leadership, platform work, or a web
                product you're trying to ship well.
            </p>
            <div class="actions">
                {#if site.social.email}
                    <a class="btn primary" href={site.social.email}>Say hello</a>
                {/if}
                <SocialIcons links={site.social} variant="ghost" />
            </div>
        </div>
    </div>
</section>

<style>
    .contact {
        padding: 96px 0;
        border-top: 1px solid var(--outline-variant);
    }
    .card {
        position: relative;
        padding: 56px 40px;
        border-radius: var(--radius-lg);
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
        border: 1px solid var(--outline-variant);
        box-shadow: var(--shadow-md);
        display: flex;
        flex-direction: column;
        gap: 16px;
        overflow: hidden;
        text-align: left;
    }
    h2 {
        font-size: clamp(1.8rem, 3.6vw, 2.6rem);
        max-width: 20ch;
    }
    p {
        max-width: 54ch;
        color: var(--on-surface-variant);
    }
    .actions {
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
        margin-top: 12px;
    }
    .btn.primary {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 12px 20px;
        border-radius: 999px;
        background: var(--on-surface);
        color: var(--surface);
        font-weight: 500;
        font-size: 0.95rem;
        transition: transform 150ms ease, background 150ms ease;
    }
    .btn.primary:hover {
        background: var(--primary);
        color: var(--on-primary);
        transform: translateY(-1px);
    }
</style>
