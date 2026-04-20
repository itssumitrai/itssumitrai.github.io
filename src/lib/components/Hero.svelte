<script>
    import { site } from '$lib/data/site.js';
    import SocialIcons from './SocialIcons.svelte';
</script>

<section class="hero" id="about">
    <div class="container grid">
        <div class="copy">
            <span class="eyebrow">Portfolio · {new Date().getFullYear()}</span>
            <h1>
                <span class="line">Hi, I'm {site.name}.</span>
                <span class="line accent">{site.role}</span>
                <span class="line muted">{site.tagline}</span>
            </h1>
            <p class="bio">{site.bio}</p>
            <div class="actions">
                <a class="btn primary" href="#experience">
                    View Experience
                    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"
                        ><path
                            fill="currentColor"
                            d="M4 10h10.2l-3.6-3.6L12 5l6 6-6 6-1.4-1.4 3.6-3.6H4v-2z"
                        /></svg
                    >
                </a>
                <a class="btn ghost" href={site.social.email}>Get in Touch</a>
            </div>
            <div class="meta">
                <SocialIcons links={site.social} />
                <span class="location">
                    <span class="dot" aria-hidden="true"></span>
                    Based in {site.location}
                </span>
            </div>
        </div>
        <aside class="portrait">
            <div class="photo" role="img" aria-label="Profile portrait placeholder">
                <span class="initials">SR</span>
            </div>
        </aside>
    </div>
    <div class="beam" aria-hidden="true"></div>
</section>

<style>
    .hero {
        position: relative;
        padding: 80px 0 96px;
        overflow: hidden;
    }
    .beam {
        position: absolute;
        inset: -10% -20% auto -20%;
        height: 520px;
        background:
            radial-gradient(600px 300px at 20% 20%, color-mix(in oklab, var(--primary) 14%, transparent), transparent 60%),
            radial-gradient(500px 260px at 80% 10%, color-mix(in oklab, var(--secondary) 12%, transparent), transparent 60%);
        pointer-events: none;
        z-index: 0;
    }
    .grid {
        position: relative;
        display: grid;
        grid-template-columns: 1fr;
        gap: 48px;
        align-items: center;
        z-index: 1;
    }
    .copy {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }
    h1 {
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: clamp(2.2rem, 5vw, 3.6rem);
        font-weight: 500;
        margin: 4px 0 0;
    }
    .line.accent {
        color: var(--on-surface-variant);
        font-style: italic;
        font-weight: 500;
        font-size: 0.6em;
        margin-top: 4px;
    }
    .line.muted {
        color: var(--on-surface-variant);
        font-family: var(--font-body);
        font-size: 0.5em;
        font-weight: 400;
        letter-spacing: 0;
        line-height: 1.4;
        margin-top: 10px;
        max-width: 32ch;
    }
    .bio {
        color: var(--on-surface-variant);
        max-width: 52ch;
        font-size: 1.02rem;
    }
    .actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
    }
    .btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 12px 18px;
        border-radius: 999px;
        font-size: 0.95rem;
        font-weight: 500;
        border: 1px solid transparent;
        transition:
            transform 150ms ease,
            background 150ms ease,
            color 150ms ease,
            border-color 150ms ease;
    }
    .btn.primary {
        background: var(--on-surface);
        color: var(--surface);
    }
    .btn.primary:hover {
        background: var(--primary);
        color: var(--on-primary);
        transform: translateY(-1px);
    }
    .btn.ghost {
        background: transparent;
        color: var(--on-surface);
        border-color: var(--outline-variant);
    }
    .btn.ghost:hover {
        color: var(--primary);
        border-color: var(--primary);
        background: var(--surface-container-lowest);
    }
    .meta {
        display: flex;
        align-items: center;
        gap: 18px;
        flex-wrap: wrap;
        margin-top: 4px;
    }
    .location {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: var(--on-surface-variant);
        font-size: 0.88rem;
    }
    .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #22c55e;
        box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.15);
    }

    .portrait {
        position: relative;
        justify-self: center;
        width: min(380px, 90%);
        aspect-ratio: 1 / 1;
    }
    .photo {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background:
            radial-gradient(
                120% 120% at 30% 20%,
                color-mix(in oklab, var(--primary) 8%, var(--surface)) 0%,
                color-mix(in oklab, var(--primary) 18%, var(--surface)) 50%,
                color-mix(in oklab, var(--primary) 30%, var(--surface)) 100%
            );
        border: 1px solid var(--outline-variant);
        box-shadow: var(--shadow-lg);
        display: grid;
        place-items: center;
        overflow: hidden;
    }
    .initials {
        font-family: var(--font-display);
        font-size: 5.2rem;
        font-weight: 500;
        color: var(--primary);
        letter-spacing: -0.02em;
    }
    @media (min-width: 900px) {
        .grid {
            grid-template-columns: 1.15fr 1fr;
            gap: 72px;
        }
    }
</style>
