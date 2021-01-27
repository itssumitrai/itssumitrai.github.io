// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".nav.svelte-188s35v.svelte-188s35v{background-image:var(--nav-gradient);color:var(--primaryColor)}.nav.svelte-188s35v ul.svelte-188s35v{display:flex;justify-content:space-evenly;list-style:none;margin:0;padding:0.5rem 1rem}.nav.svelte-188s35v li.svelte-188s35v{padding:0 20px}.nav.svelte-188s35v li a.svelte-188s35v{text-decoration:none;color:var(--linkColor);font-weight:400}.nav.svelte-188s35v li a.svelte-188s35v:hover{text-decoration:underline}";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}