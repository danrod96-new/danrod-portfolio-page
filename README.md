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

### Blog posts

Each post is a JSON file in [`src/content/blog/`](src/content/blog/); add a file and push to publish it.
Posts are listed newest first and open at `https://danrod.ca/#/blog/<slug>`.

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
- Images go in `public/blog/` and use `![What the image shows](/blog/picture.webp)`; the text in brackets is the alt text, so always fill it in.
- `"draft": true` shows the post in `npm run dev` only, not on the live site.

## Sections

- **Hero** — interactive node network (follows the cursor) and a typed role line
- **About** — summary, education, events, animated stat counters
- **Work** — filter, search, 3D-tilt cards and a detail modal
- **Skills** — click a skill to filter the work grid
- **Blog** — post cards; each post opens on its own page (`#/blog/<slug>`)
- **Terminal** — a small shell (`help`, `whoami`, `modules`, `blog`, `contact`…)
- **Contact** — form sent through [Web3Forms](https://web3forms.com) (access key in `src/data.js`), so no email address is published
- **Resume** — menu link to `public/Daniel-Rodriguez-Resume.pdf`, a copy of the CV without the address, phone numbers and email

Link previews on social sites and chat apps use `public/og-image.jpg` (1200×630), set in `index.html`.
`public/robots.txt` points search engines to `public/sitemap.xml`, which lists the home page and the resume.

The site opens in dark mode; visitors can switch to light and their choice is remembered. Motion respects `prefers-reduced-motion`.
