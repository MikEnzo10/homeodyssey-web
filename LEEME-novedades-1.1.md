# Web para el lanzamiento de la 1.1 (rama `web-lanzamiento-1.1`)

**No se publica hasta que la 1.1 esté aprobada en las dos tiendas.** Entonces: merge a `main` y push.
La fecha del lanzamiento gratis (7 de enero) sale de `AJUSTES.FIN_LANZAMIENTO` en `assets/web.js`.

## El día D (App Store)

En `assets/web.js`, `AJUSTES.APP_STORE_PUBLICADA: false` → `true`. Nada más: el ID (6828787492) ya está
puesto. Mientras sea `false`, los botones de App Store se ven apagados («Muy pronto · App Store», sin
enlace) y el botón «Descargar» de la cabecera, en un iPhone, baja al final de la página. Los textos de
la web no dicen «ya disponible en App Store» en ningún sitio: solo «en Android y iPhone».

## Qué hay en esta rama (ES y EN)

- **Hilo de la portada:** tareas de casa → estrellas → recompensa / hucha. «Cómo funciona» tiene 4 pasos
  (prepara, cumplen, confirmas y llegan las estrellas, las cambian por su recompensa) y una tarjeta de
  cierre con la ceremonia del domingo. La portada enseña el inicio del peque y su hucha.
- **«Pensada para que dure más de dos semanas»:** balanza, podio justo, niveles y rachas, propuestas de
  los peques (sustituye a «Lo que más les engancha», que ya está en el paso 4).
- **Desafíos de la semana** (`#desafios` / `#challenges`): enfocados como «estrellas extra si les sobra un
  rato», no como deberes. Captura real de «Mis desafíos», las tres materias, los puntos clave y el bloque
  de héroes con los 6 personajes y los 6 rangos. Lleva la nota de personajes ilustrados con IA.
- **Abuelos en la aventura** (`#abuelos` / `#grandparents`): captura real de la pantalla de la abuela.
  El texto cuenta cómo entran de verdad (instalan la app, «Cuido de los peques», código y nombre).
- **Precios y preguntas** al día con la 1.1; FAQ nueva sobre recompensas sin dinero (enlaza al
  imprimible en ES). Enlaces a los dos imprimibles desde Ejemplos, En papel y el pie (ES).
- **SEO:** descripciones con las funciones nuevas, OG sin «ya en App Store», datos estructurados
  `MobileApplication` + `FAQPage`, sitemap con hreflang completo.
- **Imágenes:** `assets/img/es|en/` con las capturas de la 1.1 (`p04-inicio`, `p03-misiones`,
  `a01-inicio`, `p06-recompensas`, `c02-ceremonia`, `d01-desafios`, `ab2-abuelos`) a 720×1600 WebP.

## Pendiente (opcional)

- Vídeo de presentación (`#video`): cuando esté el mp4, ruta en `data-video` y fotograma como póster.
- `assets/img/og-es.png` / `og-en.png` siguen siendo las del 29 oct (inicio del peque de la 1.0).
