// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".intro.svelte-65k171.svelte-65k171{display:flex;align-content:center;flex-direction:column;padding:1rem;background-color:var(--bgColor1);box-shadow:0 1px 6px 0 rgba(0, 0, 0, 0.15)}.intro.svelte-65k171 .left.svelte-65k171{margin-right:1rem;text-align:center}.intro.svelte-65k171 .left img.svelte-65k171{height:100px;width:100px;border-radius:50%}.intro.svelte-65k171 .right.svelte-65k171{display:flex;justify-content:center;flex-direction:column;box-sizing:border-box}h1.svelte-65k171.svelte-65k171{margin:0;margin-bottom:0.5rem}.intro.svelte-65k171 p.svelte-65k171{margin:0;padding:0;margin-bottom:0.5rem;color:var(--secondaryColor)}.company-link.svelte-65k171.svelte-65k171{color:var(--linkColor);font-size:1rem;font-weight:400;text-decoration:none}.company-link.svelte-65k171.svelte-65k171:hover{text-decoration:underline}footer.svelte-65k171.svelte-65k171{display:flex;justify-content:flex-start;padding:0}footer.svelte-65k171 a.svelte-65k171{margin-right:1rem;text-decoration:none}footer.svelte-65k171 a.svelte-65k171:hover{text-decoration:underline}footer.svelte-65k171 svg.svelte-65k171{width:24px;height:24px;stroke-width:0}.github.svelte-65k171.svelte-65k171{fill:#181717;stroke:#181717}.linkedin.svelte-65k171.svelte-65k171{fill:#0077b5;stroke:#0077b5}.email.svelte-65k171.svelte-65k171{fill:#181717;stroke:#181717}@media(min-width: 400px){.intro.svelte-65k171.svelte-65k171{flex-direction:row}}";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}