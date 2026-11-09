// Privacy policy shown at /privacy/ (src/components/Privacy.jsx). The body is Markdown, one line per item.
// Update `updated` and both languages whenever the site starts or stops using a service. The statistics parts only
// appear while GoatCounter is turned on in src/analytics.js.
import { goatcounter } from '../analytics.js'

const intro = {
  en: goatcounter
    ? 'This is the personal website of Daniel Rodriguez, who is responsible for the information described here. The short version: the site has no ads and no cookies, it counts visits anonymously to see which pages get read, and the only personal information I receive is what you choose to send me through the contact form.'
    : 'This is the personal website of Daniel Rodriguez, who is responsible for the information described here. The short version: the site has no analytics, no ads and no tracking cookies, and the only personal information I receive is what you choose to send me through the contact form.',
  es: goatcounter
    ? 'Este es el sitio web personal de Daniel Rodriguez, responsable de la información que se describe aquí. En resumen: el sitio no tiene publicidad ni cookies, cuenta las visitas de forma anónima para saber qué páginas se leen, y la única información personal que recibo es la que decidas enviarme por el formulario de contacto.'
    : 'Este es el sitio web personal de Daniel Rodriguez, responsable de la información que se describe aquí. En resumen: el sitio no usa analítica, publicidad ni cookies de seguimiento, y la única información personal que recibo es la que decidas enviarme por el formulario de contacto.',
}

const stats = goatcounter
  ? {
      en: [
        '## Visitor statistics',
        '',
        'To know which pages and posts get read, the site counts visits with [GoatCounter](https://www.goatcounter.com/help/privacy), an open-source statistics service that doesn’t use cookies or track you across sites. For each page view it receives the **page address**, the **referring site**, your **browser and operating system**, your **screen size** and your **country**, which it works out from your IP address. It doesn’t store your IP address, and it can’t tell me who you are. I only see totals, such as how many people read a post.',
        '',
        'If you block the GoatCounter script, your visit isn’t counted and the site works the same.',
        '',
      ],
      es: [
        '## Estadísticas de visitas',
        '',
        'Para saber qué páginas y artículos se leen, el sitio cuenta las visitas con [GoatCounter](https://www.goatcounter.com/help/privacy), un servicio de estadísticas de código abierto que no usa cookies ni te sigue entre sitios. Por cada página vista recibe la **dirección de la página**, el **sitio de procedencia**, tu **navegador y sistema operativo**, el **tamaño de tu pantalla** y tu **país**, que deduce de tu dirección IP. No guarda tu dirección IP y no me permite saber quién eres. Yo solo veo totales, como cuántas personas leyeron un artículo.',
        '',
        'Si bloqueas el script de GoatCounter, tu visita no se cuenta y el sitio funciona igual.',
        '',
      ],
    }
  : { en: [], es: [] }

export const privacy = {
  updated: '2026-11-09',
  title: { en: 'Privacy policy', es: 'Política de privacidad' },
  description: {
    en: 'What danrod.ca collects, why, who else receives it and how to ask for a copy or deletion.',
    es: 'Qué recopila danrod.ca, para qué, quién más lo recibe y cómo pedir una copia o su eliminación.',
  },
  body: {
    en: [
      intro.en,
      '',
      '## The contact form',
      '',
      'When you send a message, the form collects your **name**, your **email address** and your **message**. I use them only to read and answer your message. I don’t add you to a mailing list, and I don’t sell or share your details with anyone.',
      '',
      'The form is delivered by [Web3Forms](https://web3forms.com/privacy), which receives what you type (and, like any web service, your IP address) and forwards it to my inbox. Your message stays in my email for as long as it’s useful for our conversation; ask me and I’ll delete it.',
      '',
      ...stats.en,
      '## Information other services receive',
      '',
      '- **Hosting:** the site is hosted on [GitHub Pages](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement). GitHub may log your IP address when you visit, for security and to keep the service running. I don’t have access to those logs.',
      '- **Links:** links to GitHub, Drupal.org, LinkedIn and client websites take you to sites with their own privacy policies.',
      '',
      '## Saved in your browser',
      '',
      'The site remembers two preferences in your browser’s local storage: **light or dark theme** and **language**. They never leave your device, they aren’t cookies, and you can remove them at any time by clearing this site’s data in your browser.',
      '',
      '## Your rights',
      '',
      'You can ask me what information I have about you, ask me to correct it, or ask me to delete it. Depending on where you live, privacy laws such as Canada’s PIPEDA or Colombia’s Law 1581 of 2012 also protect these rights. To make a request, use the [contact form](/#contact) and I’ll reply as soon as I can.',
      '',
      'This site isn’t directed at children, and I don’t knowingly collect information from them.',
      '',
      '## Changes',
      '',
      'If the site starts using a new service that receives personal information, I’ll update this page and the date at the top.',
    ],
    es: [
      intro.es,
      '',
      '## El formulario de contacto',
      '',
      'Cuando envías un mensaje, el formulario recoge tu **nombre**, tu **correo electrónico** y tu **mensaje**. Los uso solo para leer y responder tu mensaje. No te agrego a ninguna lista de correo y no vendo ni comparto tus datos con nadie.',
      '',
      'El formulario se entrega a través de [Web3Forms](https://web3forms.com/privacy), que recibe lo que escribes (y, como cualquier servicio web, tu dirección IP) y lo reenvía a mi correo. Tu mensaje se queda en mi correo mientras sea útil para nuestra conversación; si me lo pides, lo borro.',
      '',
      ...stats.es,
      '## Información que reciben otros servicios',
      '',
      '- **Alojamiento:** el sitio está alojado en [GitHub Pages](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement). GitHub puede registrar tu dirección IP cuando lo visitas, por seguridad y para mantener el servicio. Yo no tengo acceso a esos registros.',
      '- **Enlaces:** los enlaces a GitHub, Drupal.org, LinkedIn y los sitios de clientes te llevan a sitios con sus propias políticas de privacidad.',
      '',
      '## Guardado en tu navegador',
      '',
      'El sitio recuerda dos preferencias en el almacenamiento local de tu navegador: el **tema claro u oscuro** y el **idioma**. Nunca salen de tu dispositivo, no son cookies y puedes eliminarlas cuando quieras borrando los datos de este sitio en tu navegador.',
      '',
      '## Tus derechos',
      '',
      'Puedes pedirme qué información tengo sobre ti, pedirme que la corrija o que la elimine. Según dónde vivas, leyes de privacidad como la PIPEDA de Canadá o la Ley 1581 de 2012 de Colombia también protegen estos derechos. Para hacer una solicitud, usa el [formulario de contacto](/#contact) y te responderé lo antes posible.',
      '',
      'Este sitio no está dirigido a menores de edad y no recopilo a sabiendas información de ellos.',
      '',
      '## Cambios',
      '',
      'Si el sitio empieza a usar un nuevo servicio que reciba información personal, actualizaré esta página y la fecha que aparece arriba.',
    ],
  },
}
