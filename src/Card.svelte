<script>
    export let title = 'Card';
    export let link = '';
    export let content = '';
    export let org = '';
    export let period = '';
    export let snippet = '';
    export let image = '';
    export let location = '';
    let expanded = false;

    function handleClick() {
        expanded = !expanded;
    }
</script>

<section class="card {expanded ? 'expanded' : ''}">
    {#if !expanded && image}
        <img src={image} alt={title} />
    {/if}
    <div>
        <h2>{title}</h2>
        <div class="header">
            <a href={link} class="card-link">{org}</a>
            <div>
                <span style="margin-right: 0.5rem;" class="location">{location}</span>
                <span class="period">{period}</span>
            </div>
        </div>
        {#if expanded}
            <p>{@html content}</p>
        {:else}
            <p>{snippet}</p>
        {/if}
        <button class="actionBtn" on:click={handleClick}
            >{expanded ? 'Back' : 'Read more'}</button
        >
    </div>
</section>

<style>
    .card {
        border-radius: 0.25rem;
        box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.15);
        background-color: var(--bgColor1);
        max-width: 320px;
        display: flex;
        box-sizing: border-box;
        flex-direction: column;
        max-height: 300px;
        height: fit-content;
    }
    .card.expanded {
        max-height: initial;
    }
    .card > div {
        padding: 1rem;
    }
    .card h2 {
        margin: 0;
        margin-bottom: 0.6rem;
        font-size: 1.2rem;
        font-weight: 400;
        color: var(--secondaryColor);
    }
    .card h3 {
        margin: 0;
        margin-bottom: 1rem;
        font-size: 1rem;
    }
    .card p {
        margin-top: 0.8rem;
    }
    .card-link {
        text-decoration: none;
        color: var(--linkColor);
        font-weight: 400;
        font-size: 1rem;
    }
    .card :global(ul) {
        margin: 0;
        padding: 0;
        padding-left: 1rem;
    }
    .card :global(ul) :global(li) {
        margin-bottom: 0.8rem;
    }
    .card-link:hover {
        text-decoration: underline;
    }
    .header {
        display: flex;
        justify-content: space-between;
    }
    .period,
    .location {
        color: var(--tertiaryColor);
        font-size: 0.8rem;
    }
    .actionBtn {
        border: 0;
        background-color: var(--linkColor);
        color: #fff;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 0.3rem;
        font-size: 0.9rem;
        font-weight: 500;
    }
    @media (min-width: 900px) {
        .card {
            max-width: 400px;
        }
    }
</style>
