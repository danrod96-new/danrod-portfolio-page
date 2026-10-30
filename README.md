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
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), served at
**https://danrod.ca** (`public/CNAME`).

One-time setup:

1. Repo **Settings → Pages**: Source **GitHub Actions**, Custom domain `danrod.ca`, then **Enforce HTTPS**.
2. DNS (Route 53):
   - `danrod.ca` A → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `danrod.ca` AAAA → `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - `www.danrod.ca` CNAME → `danrod96-new.github.io`
3. Optional: verify the domain under your account's **Settings → Pages** (TXT record).

If the site ever moves back under a sub-path, update `base` in `vite.config.js`.
