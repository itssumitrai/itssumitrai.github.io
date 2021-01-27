// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ":root{--primaryColor:#333;--secondaryColor:#3c3a3a;--tertiaryColor:#585858;--layoutBgColor:#f8f8f8;--linkColor:#2a45db;--bgColor1:#fff;--seperatorColor:#d3d3d3;--nav-gradient:linear-gradient(#9f9d9d, #d3d3d3);font-size:16px}body{margin:0;font-family:Helvetica, Arial, sans-serif;font-size:1rem;background-color:var(--layoutBgColor)}footer.svelte-1i8q6uy{display:flex;justify-content:flex-end;padding:1rem}.svelte-1i8q6uy{box-sizing:border-box}.app.svelte-1i8q6uy{display:grid;min-height:100vh;grid-template-columns:1fr;grid-template-rows:auto 1fr auto;grid-template-areas:'header'\n            'main'\n            'footer'}.app-header.svelte-1i8q6uy{grid-area:header}footer.svelte-1i8q6uy{grid-area:footer;color:var(--tertiaryColor)}.card-container.svelte-1i8q6uy{display:grid;grid-area:main;padding:1rem;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));grid-gap:1rem}@media(min-width: 900px){.card-container.svelte-1i8q6uy{grid-template-columns:repeat(auto-fit, minmax(400px, 1fr))}}";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}