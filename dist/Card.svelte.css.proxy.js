// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".card.svelte-13b4bbp.svelte-13b4bbp{border-radius:0.25rem;box-shadow:0 1px 6px 0 rgba(0, 0, 0, 0.15);background-color:var(--bgColor1);max-width:320px;display:flex;box-sizing:border-box;flex-direction:column;max-height:300px;height:fit-content}.card.expanded.svelte-13b4bbp.svelte-13b4bbp{max-height:initial}.card.svelte-13b4bbp>div.svelte-13b4bbp{padding:1rem}.card.svelte-13b4bbp h2.svelte-13b4bbp{margin:0;margin-bottom:0.6rem;font-size:1.2rem;font-weight:400;color:var(--secondaryColor)}.card.svelte-13b4bbp p.svelte-13b4bbp{margin-top:0.8rem}.card-link.svelte-13b4bbp.svelte-13b4bbp{text-decoration:none;color:var(--linkColor);font-weight:400;font-size:1rem}.card.svelte-13b4bbp ul{margin:0;padding:0;padding-left:1rem}.card.svelte-13b4bbp ul li{margin-bottom:0.8rem}.card-link.svelte-13b4bbp.svelte-13b4bbp:hover{text-decoration:underline}.header.svelte-13b4bbp.svelte-13b4bbp{display:flex;justify-content:space-between}.period.svelte-13b4bbp.svelte-13b4bbp,.location.svelte-13b4bbp.svelte-13b4bbp{color:var(--tertiaryColor);font-size:0.8rem}.actionBtn.svelte-13b4bbp.svelte-13b4bbp{border:0;background-color:var(--linkColor);color:#fff;cursor:pointer;padding:4px 8px;border-radius:0.3rem;font-size:0.9rem;font-weight:500}@media(min-width: 900px){.card.svelte-13b4bbp.svelte-13b4bbp{max-width:400px}}";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}