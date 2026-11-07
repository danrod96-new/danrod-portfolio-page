// Keeps <meta name="description"> (in index.html) in step with the language and the page shown.
export function setDescription(text) {
  document.querySelector('meta[name="description"]')?.setAttribute('content', text)
}
