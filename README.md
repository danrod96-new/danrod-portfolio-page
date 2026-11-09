# danrod — portfolio

Personal portfolio for Daniel Rodriguez (Full Stack Drupal / Web Developer), built with React + Vite.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
```

## Editing content

All content lives in [`src/data.js`](src/data.js): profile, stats, experience, projects
(`contrib` = Drupal.org, `client` = client sites, `oss` = open source) and skills.
A project's `tags` drive the skill → project cross-filter, so reuse the skill names.
Give every project with a `shot` or `cover` image an `alt: { en, es }` that describes what the image shows.

### Languages

Every page exists in English at the root and in Spanish under `/es/` (`/es/`, `/es/blog/<slug>/`, `/es/privacy/`),
so search engines index both; each page links to the other language with `hreflang` tags.
An `/es/` address is always Spanish. Elsewhere the site uses the visitor's saved choice, then their browser language,
and moves Spanish readers to `/es/`. The EN/ES switch swaps the address without reloading the page.
Interface text is in [`src/strings.js`](src/strings.js), and [`src/paths.js`](src/paths.js) builds the addresses:
in components, link to other pages with `path('/privacy/')` from `useLang()` rather than a fixed `/privacy/`.

### Blog posts

Each post is a JSON file in [`src/content/blog/`](src/content/blog/); add a file and push to publish it.
Posts are listed newest first and open at `https://danrod.ca/blog/<slug>/` (Spanish: `/es/blog/<slug>/`).
`npm run build` runs [`scripts/prerender.js`](scripts/prerender.js) after Vite, which writes an HTML file for every page
in both languages with its own title, description, link preview and `hreflang` links, and for posts and the privacy
policy the text already in the page so search engines can index it. Each post also gets a link-preview image in each
language (`/blog/<slug>/og.png`, `/es/blog/<slug>/og.png`) with its title, tags, date and reading time, drawn by
[`scripts/og-image.js`](scripts/og-image.js). It also writes `dist/sitemap.xml` (both languages) and the RSS feed
`dist/feed.xml` (full English text, linked from the Blog section) with every published post; nothing to edit by hand.

```json
{
  "slug": "my-post",
  "date": "2026-11-05",
  "tags": ["Drupal"],
  "title": { "en": "…", "es": "…" },
  "summary": { "en": "…", "es": "…" },
  "body": { "en": ["Markdown, one line per array item", "", "## A heading"], "es": ["…"] }
}
```

- `title`, `summary` and `body` take `{ "en", "es" }`; a post with only `en` shows the English text in both languages.
- `body` is Markdown, either one string or an array of lines.
- Code blocks are highlighted when you name the language, e.g. ` ```bash `, ` ```php ` or ` ```scilab ` (any language
  [highlight.js](https://highlightjs.org/) supports). This happens while building ([`scripts/markdown.js`](scripts/markdown.js)),
  so no highlighter is sent to visitors; the colours are the `--code-*` tokens in `src/index.css`.
- Images go in `public/blog/` and use `![What the image shows](/blog/picture.webp)`; the text in brackets is the alt text, so always fill it in.
- `"draft": true` shows the post in `npm run dev` only, not on the live site.
- Optional `"updated": "2026-12-01"` marks a later edit for search engines.
- Links to home-page sections need a leading slash, e.g. `[contact form](/#contact)`. Write links to the English
  addresses: on Spanish pages they point to `/es/` automatically.

## Sections

- **Hero** — interactive node network (follows the cursor) and a typed role line
- **About** — summary, education, events, animated stat counters
- **Work** — filter, search, 3D-tilt cards and a detail modal
- **Skills** — click a skill to filter the work grid
- **Blog** — post cards; each post opens on its own page (`/blog/<slug>/`)
- **Terminal** — a small shell (`help`, `whoami`, `modules`, `blog`, `contact`…)
- **Contact** — form sent through [Web3Forms](https://web3forms.com) (access key in `src/data.js`), so no email address is published
- **Privacy** — policy page at `/privacy/`, linked from the footer and the contact form; edit [`src/content/privacy.js`](src/content/privacy.js) whenever the site adds or drops a service
- **Resume** — menu link to `public/Daniel-Rodriguez-Resume.pdf`, a copy of the CV without the address, phone numbers and email

Link previews on social sites and chat apps use `public/og-image.jpg` (1200×630), set in `index.html`; blog posts use
their own generated image instead.
`public/robots.txt` points search engines to the sitemap the build generates (home page, resume, privacy policy and posts).
`index.html` also has Person structured data (name, job title and profiles in `sameAs`); keep it in step with `profile.links` in `src/data.js`.
Fonts (Inter and JetBrains Mono) are served from `public/fonts/` rather than Google Fonts; `fonts.css` there is shared with `404.html`.
`public/favicon.svg` is the browser-tab icon. `apple-touch-icon.png` (180×180, iOS home screen) and `icon-192.png` / `icon-512.png`
(Android, listed in `site.webmanifest`) are PNG copies of it with a square background; regenerate them if the favicon changes.
`public/404.html` is the page GitHub Pages shows for addresses that don't exist; it is plain HTML (no React), in the visitor's theme and language
(always Spanish under `/es/`).

The site opens in dark mode; visitors can switch to light and their choice is remembered. Motion respects `prefers-reduced-motion`.
