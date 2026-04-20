<script>
    import { skills } from '$lib/data/skills.js';
    import { reveal } from '$lib/actions/reveal.js';
</script>

<section class="skills reveal" id="skills" use:reveal>
    <div class="container">
        <header class="section-head">
            <span class="eyebrow">Craft</span>
            <h2>Things I reach for.</h2>
            <p>A working toolkit — opinionated, practical, and always shifting.</p>
        </header>

        <div class="groups">
            {#each skills as group (group.group)}
                <div class="group">
                    <h3>{group.group}</h3>
                    <ul class="pills">
                        {#each group.items as item (item)}
                            <li>{item}</li>
                        {/each}
                    </ul>
                </div>
            {/each}
        </div>
    </div>
</section>

<style>
    .skills {
        padding: 96px 0;
        border-top: 1px solid var(--outline-variant);
        background: linear-gradient(180deg, var(--surface), var(--surface-container-low) 100%);
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
    .groups {
        display: grid;
        grid-template-columns: 1fr;
        gap: 24px;
    }
    .group {
        background: var(--surface-container-lowest);
        border: 1px solid var(--outline-variant);
        border-radius: var(--radius-lg);
        padding: 24px;
        box-shadow: var(--shadow-sm);
    }
    .group h3 {
        font-family: var(--font-body);
        font-size: 0.78rem;
        font-weight: 600;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--outline);
        margin-bottom: 16px;
    }
    .pills {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .pills li {
        padding: 6px 12px;
        border-radius: 999px;
        background: var(--surface);
        border: 1px solid var(--outline-variant);
        font-size: 0.88rem;
        color: var(--on-surface);
    }
    @media (min-width: 820px) {
        .groups {
            grid-template-columns: repeat(3, 1fr);
        }
    }
</style>
