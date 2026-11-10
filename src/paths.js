// Spanish pages live under /es/ (/es/, /es/blog/, /es/blog/<slug>/, /es/privacy/) and English ones at the root, so each language
// has its own address for search engines. Used by the app and by scripts/prerender.js.

export const langFromPath = (pathname) => (/^\/es(\/|$)/.test(pathname) ? 'es' : 'en')

// The page's address without the language: /es/blog/x/ → /blog/x/, /es → /
export const stripLang = (pathname) => pathname.replace(/^\/es(?=\/|$)/, '') || '/'

// The address of a page in a language: pathFor('es', '/#contact') → /es/#contact
export const pathFor = (lang, path) => (lang === 'es' ? `/es${path}` : path)

// Links to other pages in rendered Markdown (posts, privacy policy) point to the same language's version.
// Only page links change: the home page and its sections, the blog and its posts and the privacy policy, not files
// or images.
export const localizeLinks = (html, lang) =>
  lang === 'es' ? html.replace(/(\shref=")\/(?=["#]|blog\/(?:[^"/]+\/)?(?=["#])|privacy\/)/g, '$1/es/') : html
