// Link-preview image for a blog post (1200×630 PNG), in the style of public/og-image.jpg: the post's title, tags,
// date and reading time on the site's dark background. Called by scripts/prerender.js for each post and language.
// Satori lays the card out as SVG and resvg turns it into a PNG; both only run at build time.
import { Buffer } from 'node:buffer'
import { readFileSync } from 'node:fs'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'

const width = 1200
const height = 630

// Satori reads .woff, not .woff2, so these come from the static Fontsource packages (dev dependencies).
const font = (pkg, file) => readFileSync(new URL(`../node_modules/@fontsource/${pkg}/files/${file}`, import.meta.url))
const fonts = [
  ...[400, 600, 800].flatMap((weight) =>
    ['latin', 'latin-ext'].map((set) => ({ name: 'Inter', weight, data: font('inter', `inter-${set}-${weight}-normal.woff`) })),
  ),
  ...[400, 600].map((weight) => ({ name: 'Mono', weight, data: font('jetbrains-mono', `jetbrains-mono-latin-${weight}-normal.woff`) })),
]

const portrait = `data:image/jpeg;base64,${readFileSync(new URL('../src/assets/daniel.jpg', import.meta.url)).toString('base64')}`

const colors = { bg: '#0a0e1a', text: '#e6e9f2', muted: '#8b95ad', accent: '#38bdf8', accent2: '#818cf8', border: 'rgba(148, 163, 184, 0.3)' }

// Faint node network like the hero's, placed from the slug so each post's card is a little different but every
// build gives the same image.
function network(seed) {
  let n = [...seed].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)
  const random = () => ((n = (n * 1664525 + 1013904223) >>> 0) / 2 ** 32)
  const nodes = Array.from({ length: 34 }, () => [Math.round(random() * width), Math.round(random() * height)])
  const lines = nodes.flatMap(([x1, y1], i) =>
    nodes.slice(i + 1).filter(([x2, y2]) => Math.hypot(x2 - x1, y2 - y1) < 190).map(([x2, y2]) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`),
  )
  const dots = nodes.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.5"/>`)
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
    `<g stroke="#38bdf8" stroke-opacity="0.13" stroke-width="1.2">${lines.join('')}</g>` +
    `<g fill="#818cf8" fill-opacity="0.45">${dots.join('')}</g></svg>`
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

// Plain objects in the shape Satori expects (what JSX would produce).
const el = (type, style, children, props = {}) => ({ type, props: { style: { display: 'flex', ...style }, children, ...props } })

export function postImage({ slug, title, tags, meta, label }) {
  const size = title.length <= 40 ? 72 : title.length <= 70 ? 62 : title.length <= 100 ? 52 : 44
  const card = el(
    'div',
    {
      width,
      height,
      position: 'relative',
      backgroundColor: colors.bg,
      backgroundImage:
        'radial-gradient(circle at 92% 8%, rgba(129, 140, 248, 0.22), transparent 45%), radial-gradient(circle at 0% 100%, rgba(56, 189, 248, 0.14), transparent 45%)',
      fontFamily: 'Inter',
      color: colors.text,
    },
    [
      el('img', { position: 'absolute', top: 0, left: 0, width, height }, undefined, { src: network(slug), width, height }),
      // Padding goes on this inner layer: Satori adds it to the size of the box it's set on.
      el('div', { flexGrow: 1, flexDirection: 'column', justifyContent: 'space-between', padding: '64px 80px 56px' }, [
        el('div', { alignItems: 'center', gap: 18, fontFamily: 'Mono', fontSize: 28, fontWeight: 600, color: colors.muted }, [
          el('span', {}, '~/danrod'),
          el('span', { width: 46, height: 4, borderRadius: 2, backgroundImage: `linear-gradient(90deg, ${colors.accent}, ${colors.accent2})` }),
          el('span', { color: colors.accent, fontWeight: 400 }, label),
        ]),
        el('div', { flexDirection: 'column', gap: 30 }, [
          el('div', { fontSize: size, fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.02em', maxWidth: 1040 }, title),
          el(
            'div',
            { gap: 14 },
            tags.map((tag) =>
              el('span', { fontFamily: 'Mono', fontSize: 22, color: colors.text, padding: '9px 18px', borderRadius: 12, border: `1.5px solid ${colors.border}`, backgroundColor: 'rgba(255, 255, 255, 0.04)' }, tag),
            ),
          ),
        ]),
        el('div', { alignItems: 'center', justifyContent: 'space-between' }, [
          el('div', { alignItems: 'center', gap: 20 }, [
            el('div', { padding: 4, borderRadius: 999, backgroundImage: `linear-gradient(135deg, ${colors.accent}, ${colors.accent2})` }, [
              el('img', { width: 68, height: 68, borderRadius: 999, objectFit: 'cover', border: `3px solid ${colors.bg}` }, undefined, { src: portrait, width: 68, height: 68 }),
            ]),
            el('div', { flexDirection: 'column', gap: 4 }, [
              el('span', { fontSize: 28, fontWeight: 600 }, 'Daniel Rodriguez'),
              el('span', { fontFamily: 'Mono', fontSize: 21, color: colors.muted }, meta),
            ]),
          ]),
          el('span', { fontFamily: 'Mono', fontSize: 26, color: colors.muted }, 'danrod.ca'),
        ]),
      ]),
    ],
  )
  return satori(card, { width, height, fonts }).then((svg) => new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng())
}
