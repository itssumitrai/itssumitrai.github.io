<script>
    import { site } from '$lib/data/site.js';
    import Nav from '$lib/components/Nav.svelte';
    import Hero from '$lib/components/Hero.svelte';
    import Experience from '$lib/components/Experience.svelte';
    import Skills from '$lib/components/Skills.svelte';
    import Projects from '$lib/components/Projects.svelte';
    import Contact from '$lib/components/Contact.svelte';
    import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
    <title>{site.name} — {site.role}</title>
    <meta name="description" content={site.tagline} />
</svelte:head>

<span id="top"></span>
<Nav />
<main>
    <Hero />
    <Experience />
    <Skills />
    <Projects />
    <Contact />
</main>
<Footer />
