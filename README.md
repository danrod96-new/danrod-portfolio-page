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

## Sections

- **Hero** — interactive node network (follows the cursor) and a typed role line
- **About** — summary, education, events, animated stat counters
- **Experience** — expandable timeline filterable by Drupal/web vs Linux/ops
- **Work** — filter, search, 3D-tilt cards and a detail modal
- **Skills** — click a skill to filter the work grid
- **Terminal** — a small shell (`help`, `whoami`, `modules`, `contact`…)
- **Contact** — mailto and copy-to-clipboard

Light/dark theme follows the OS and can be toggled; motion respects `prefers-reduced-motion`.

## Deploy

Pushing to `main` builds and publishes the site to GitHub Pages via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):
https://danrod96-new.github.io/danrod-portfolio-page/

One-time setup: in the repo, **Settings → Pages → Source: GitHub Actions**.
If the repo is renamed or a custom domain is used, update `base` in `vite.config.js`.
