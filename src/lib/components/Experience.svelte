<script>
    import { experience } from '$lib/data/experience.js';
    import { reveal } from '$lib/actions/reveal.js';
</script>

<section class="experience reveal" id="experience" use:reveal>
    <div class="container">
        <header class="section-head">
            <span class="eyebrow">Experience</span>
            <h2>A decade of shipping at scale.</h2>
            <p>Roles, teams, and the problems I've been working on.</p>
        </header>

        <ol class="timeline">
            {#each experience as role (role.company + role.period)}
                <li class="item" style="--accent: {role.accent}">
                    <span class="marker" aria-hidden="true"></span>
                    <article class="card">
                        <div class="row">
                            <h3>{role.title}</h3>
                            <span class="period">{role.period}</span>
                        </div>
                        <div class="row meta">
                            <span class="company">{role.company}</span>
                            <span class="dot" aria-hidden="true">·</span>
                            <span class="location">{role.location}</span>
                        </div>
                        <p>{role.summary}</p>
                    </article>
                </li>
            {/each}
        </ol>
    </div>
</section>

<style>
    .experience {
        padding: 96px 0;
        border-top: 1px solid var(--outline-variant);
    }
    .section-head {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 48px;
        max-width: 640px;
    }
    .section-head h2 {
        font-size: clamp(1.7rem, 3.2vw, 2.4rem);
    }
    .timeline {
        list-style: none;
        padding: 0;
        margin: 0;
        position: relative;
    }
    .timeline::before {
        content: '';
        position: absolute;
        left: 11px;
        top: 8px;
        bottom: 8px;
        width: 1px;
        background: linear-gradient(var(--outline-variant), transparent 95%);
    }
    .item {
        position: relative;
        padding-left: 44px;
        padding-bottom: 28px;
    }
    .item:last-child {
        padding-bottom: 0;
    }
    .marker {
        position: absolute;
        left: 4px;
        top: 16px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--surface);
        border: 2px solid var(--accent, var(--primary));
        box-shadow: 0 0 0 4px color-mix(in oklab, var(--primary) 8%, transparent);
    }
    .card {
        background: var(--surface-container-lowest);
        border: 1px solid var(--outline-variant);
        border-radius: var(--radius-lg);
        padding: 20px 22px;
        box-shadow: var(--shadow-sm);
        transition: transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease;
    }
    .card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
        border-color: var(--outline-variant);
    }
    .row {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
    }
    .row h3 {
        font-size: 1.15rem;
        font-weight: 500;
        color: var(--on-surface);
        font-family: var(--font-display);
    }
    .period {
        font-size: 0.82rem;
        color: var(--outline);
        letter-spacing: 0.04em;
        font-variant-numeric: tabular-nums;
    }
    .meta {
        margin-top: 4px;
        color: var(--on-surface-variant);
        font-size: 0.92rem;
    }
    .company {
        color: var(--on-surface);
        font-weight: 500;
    }
    .dot {
        color: var(--outline);
    }
    p {
        margin-top: 10px;
        font-size: 0.96rem;
        color: var(--on-surface-variant);
        max-width: 60ch;
    }
</style>
