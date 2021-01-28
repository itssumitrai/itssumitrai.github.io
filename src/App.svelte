<script>
    import Nav from './Nav.svelte';
    import Intro from './Intro.svelte';
    import Card from './Card.svelte';
    import cards from './cards';
</script>

<main class="app">
    <header class="app-header">
        <Nav />
        <Intro />
    </header>
    <article class="card-container">
        {#each cards as card}
            <Card
                title={card.title}
                link={card.link}
                org={card.organization}
                period={card.period}
                snippet={card.snippet}
                content={card.content}
                location={card.location}
            />
        {/each}
    </article>
    <footer>Sumit Rai 2021</footer>
</main>

<style>
    :global(:root) {
        --primaryColor: #333;
        --secondaryColor: #3c3a3a;
        --tertiaryColor: #585858;
        --layoutBgColor: #f8f8f8;
        --linkColor: #2a45db;
        --bgColor1: #fff;
        --seperatorColor: #d3d3d3;
        --nav-gradient: linear-gradient(var(--linkColor), #b09af1);
        font-size: 16px;
    }
    :global(body) {
        margin: 0;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 1rem;
        background-color: var(--layoutBgColor);
    }
    footer {
        display: flex;
        justify-content: flex-end;
        padding: 1rem;
    }
    * {
        box-sizing: border-box;
    }
    .app {
        display: grid;
        min-height: 100vh;
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr auto;
    }
    .app-header {
    }
    footer {
        color: var(--tertiaryColor);
    }
    .card-container {
        display: grid;
        padding: 1rem;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        grid-gap: 1rem;
    }
    @media (min-width: 900px) {
        .card-container {
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        }
    }
</style>
