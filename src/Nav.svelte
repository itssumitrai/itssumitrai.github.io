<nav class="nav">
    <ul>
        <li>
            <a href="/">Home</a>
        </li>
    </ul>
</nav>

<style>
    .nav {
        background-image: var(--nav-gradient);
        color: var(--primaryColor);
    }
    .nav ul {
        display: flex;
        justify-content: space-evenly;
        list-style: none;
        margin: 0;
        padding: 0.5rem 1rem;
    }
    .nav li {
        padding: 0 20px;
    }
    .nav li a {
        text-decoration: none;
        color: var(--linkColor);
        font-weight: 400;
    }
    .nav li a:hover {
        text-decoration: underline;
    }
</style>
