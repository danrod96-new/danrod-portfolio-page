// Small flags for the language switch: Canada for English, Colombia for Spanish (the site's locales are en-CA and
// es-CO). Drawn as SVG because Windows shows flag emoji as plain letters. Decorative: the button text says the language.
const leaf =
  'm-90 2030 45-863a95 95 0 0 0-111-98l-859 151 116-320a65 65 0 0 0-20-73l-941-762 212-99a65 65 0 0 0 34-79l-186-572 542 115a65 65 0 0 0 73-38l105-247 423 454a65 65 0 0 0 111-57l-204-1052 327 189a65 65 0 0 0 91-27l332-652 332 652a65 65 0 0 0 91 27l327-189-204 1052a65 65 0 0 0 111 57l423-454 105 247a65 65 0 0 0 73 38l542-115-186 572a65 65 0 0 0 34 79l212 99-941 762a65 65 0 0 0-20 73l116 320-859-151a95 95 0 0 0-111 98l45 863z'

const flags = {
  en: (
    <svg className="flag" viewBox="-4800 -2400 9600 4800" width="22" height="11" aria-hidden="true" focusable="false">
      <rect x="-4800" y="-2400" width="9600" height="4800" fill="#d52b1e" />
      <rect x="-2400" y="-2400" width="4800" height="4800" fill="#fff" />
      <path fill="#d52b1e" d={leaf} />
    </svg>
  ),
  es: (
    <svg className="flag" viewBox="0 0 3 2" width="16.5" height="11" aria-hidden="true" focusable="false">
      <rect width="3" height="1" fill="#fcd116" />
      <rect y="1" width="3" height=".5" fill="#003893" />
      <rect y="1.5" width="3" height=".5" fill="#ce1126" />
    </svg>
  ),
}

export default function Flag({ lang }) {
  return flags[lang] ?? null
}
