// Visitor statistics with GoatCounter (https://www.goatcounter.com): cookieless page view counts, so we can see which
// posts get read. Set this to the code of the GoatCounter site (the "danrod" in danrod.goatcounter.com) to turn it on;
// while it's empty nothing is loaded and the privacy policy (src/content/privacy.js) leaves out its statistics section.
export const goatcounter = 'danrodca'

// Every page is its own HTML file (scripts/prerender.js), so one count per load is one count per page view. Only in
// the production build, so local development and previews never send counts.
export function loadStats() {
  if (!goatcounter || !import.meta.env.PROD) return
  const script = document.createElement('script')
  script.async = true
  script.src = 'https://gc.zgo.at/count.js'
  script.dataset.goatcounter = `https://${goatcounter}.goatcounter.com/count`
  document.head.append(script)
}
