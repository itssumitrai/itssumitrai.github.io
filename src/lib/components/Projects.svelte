<script>
    import { projects } from '$lib/data/projects.js';
</script>

<section class="projects" id="work">
    <div class="container">
        <header class="section-head">
            <span class="eyebrow">Selected Work</span>
            <h2>Projects I'm proud of.</h2>
            <p>A small set of things I've designed, built, or led — placeholders for now.</p>
        </header>

        <div class="grid">
            {#each projects as project}
                <a class="card" href={project.href} aria-label={project.title}>
                    <div class="card-top">
                        <span class="kind">{project.kind}</span>
                        <span class="arrow" aria-hidden="true">
                            <svg width="16" height="16" viewBox="0 0 20 20"
                                ><path
                                    fill="currentColor"
                                    d="M7 5h8v8h-2V8.4l-8.3 8.3-1.4-1.4L11.6 7H7V5z"
                                /></svg
                            >
                        </span>
                    </div>
                    <h3>{project.title}</h3>
                    <p>{project.summary}</p>
                    <ul class="tags">
                        {#each project.tags as tag}
                            <li>{tag}</li>
                        {/each}
                    </ul>
                </a>
            {/each}
        </div>
    </div>
</section>

<style>
    .projects {
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
    .grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 20px;
    }
    .card {
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 24px;
        background: var(--surface-container-lowest);
        border: 1px solid var(--outline-variant);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
        transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
        color: var(--on-surface);
    }
    .card:hover {
        transform: translateY(-3px);
        box-shadow: var(--shadow-lg);
        border-color: var(--outline-variant);
    }
    .card-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .kind {
        font-size: 0.72rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--primary);
        font-weight: 600;
    }
    .arrow {
        color: var(--outline);
        transition: color 150ms ease, transform 150ms ease;
    }
    .card:hover .arrow {
        color: var(--primary);
        transform: translate(2px, -2px);
    }
    .card h3 {
        font-size: 1.25rem;
        font-weight: 500;
        font-family: var(--font-display);
    }
    .card p {
        color: var(--on-surface-variant);
        font-size: 0.96rem;
    }
    .tags {
        list-style: none;
        padding: 0;
        margin: auto 0 0 0;
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }
    .tags li {
        padding: 3px 9px;
        font-size: 0.76rem;
        border-radius: 999px;
        background: var(--surface);
        border: 1px solid var(--outline-variant);
        color: var(--on-surface-variant);
    }
    @media (min-width: 780px) {
        .grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }
</style>
