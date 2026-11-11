// HomeOdyssey · web. Todo lo que hay que rellenar está en este bloque, en un solo sitio.
// Las páginas no llevan ningún otro ID ni enlace de tienda que haya que tocar.
const AJUSTES = {
  // ID numérico de la app en App Store Connect › Información de la app › «ID de Apple».
  // Mientras esté vacío, los botones de App Store llevan a una búsqueda (nunca a un enlace roto).
  APP_STORE_ID: '', // [PENDIENTE: ID de App Store] p. ej. '6741234567'
  // Umami Cloud › Ajustes del sitio › «Website ID». Mientras esté vacío no se carga nada.
  UMAMI_ID: 'd0e0dde4-d112-436a-a368-f8a92d120c18',
  // «Provider token» del generador de enlaces de campaña de App Store Connect (Analíticas › Adquisición).
  PT_APPLE: '', // [PENDIENTE: pt de Apple] p. ej. '123456789'
  PLAY_ID: 'com.niddum.app',
  // Primer día de pago: el mismo valor que PLUS_FIN_LANZAMIENTO en Railway (AAAA-MM-DD).
  // Las fechas de la página salen de aquí; ese día desaparecen solos los avisos de «gratis hasta…».
  FIN_LANZAMIENTO: '2027-01-07',
};

const idioma = (document.documentElement.lang || 'es').slice(0, 2);

// Enlaces a las tiendas. Play lleva el idioma; App Store, la tienda española en la web en
// español y la del visitante (sin país) en inglés.
const enlacePlay = () => `https://play.google.com/store/apps/details?id=${AJUSTES.PLAY_ID}&hl=${idioma}`;
const enlaceAppStore = () => {
  if (AJUSTES.APP_STORE_ID) {
    const pais = idioma === 'es' ? 'es/' : '';
    return `https://apps.apple.com/${pais}app/homeodyssey/id${AJUSTES.APP_STORE_ID}`;
  }
  // Sin ID todavía: una búsqueda que siempre funciona y que enseñará la ficha en cuanto exista.
  return 'https://www.google.com/search?q=HomeOdyssey+App+Store';
};
// Fechas del lanzamiento. El HTML lleva la fecha escrita (para buscadores y vistas previas sin JS);
// aquí se reescribe con la de AJUSTES. «fin+14» = los 14 días extra de quien ya la usaba.
(() => {
  const [a, m, d] = AJUSTES.FIN_LANZAMIENTO.split('-').map(Number);
  const fin = new Date(a, m - 1, d);
  const formato = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long' });
  const enIngles = (f) => f.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  document.querySelectorAll('[data-fecha]').forEach((el) => {
    const extra = Number((el.dataset.fecha.match(/\+(\d+)/) || [0, 0])[1]);
    const f = new Date(fin); f.setDate(f.getDate() + extra);
    el.textContent = idioma === 'es' ? formato.format(f) : enIngles(f);
  });
  if (new Date() >= fin) document.querySelectorAll('[data-lanzamiento]').forEach((el) => { el.style.display = 'none'; });
})();

const esIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

// Analítica (Umami Cloud, sin cookies). Solo se carga si hay ID.
if (AJUSTES.UMAMI_ID) {
  const s = document.createElement('script');
  s.defer = true;
  s.src = 'https://cloud.umami.is/script.js';
  s.dataset.websiteId = AJUSTES.UMAMI_ID;
  document.head.appendChild(s);
}

// Pestañas de edades en "Ejemplos".
document.querySelectorAll('.edades').forEach((lista) => {
  const pestanas = [...lista.querySelectorAll('[role="tab"]')];
  const elegir = (p) => {
    pestanas.forEach((otra) => {
      const activa = otra === p;
      otra.setAttribute('aria-selected', activa);
      otra.tabIndex = activa ? 0 : -1;
      document.getElementById(otra.getAttribute('aria-controls')).hidden = !activa;
    });
  };
  pestanas.forEach((p, i) => {
    p.tabIndex = i === 0 ? 0 : -1;
    p.addEventListener('click', () => elegir(p));
    p.addEventListener('keydown', (e) => {
      const paso = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!paso) return;
      const siguiente = pestanas[(i + paso + pestanas.length) % pestanas.length];
      siguiente.focus();
      elegir(siguiente);
    });
  });
});

// Vídeo de presentación: solo aparece si la sección tiene data-video, y el vídeo se carga al pulsar.
document.querySelectorAll('[data-video]').forEach((sec) => {
  const src = sec.dataset.video;
  if (!src) return;
  sec.hidden = false;
  const boton = sec.querySelector('.video-poster');
  boton.addEventListener('click', () => {
    const v = document.createElement('video');
    v.src = src;
    v.controls = true;
    v.autoplay = true;
    v.playsInline = true;
    v.setAttribute('aria-label', boton.getAttribute('aria-label') || '');
    boton.replaceWith(v);
    if (window.umami) window.umami.track('video');
  });
});

// Medición (homeodyssey-marketing/metricas.md).
// 1) Si se llega con ?utm_..., se recuerda durante la visita.
// 2) Los botones de Google Play llevan esos UTM en "referrer" (Play Console › Adquisición).
// 3) Los botones de App Store llevan "ct" (App Store Connect › Analíticas › Campañas) y "pt".
// 4) Cada clic en un botón de tienda se cuenta en la analítica (Umami), si está cargada.
(() => {
  const CLAVES = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
  const leer = () => {
    const q = new URLSearchParams(location.search);
    const utm = {};
    CLAVES.forEach((k) => { if (q.get(k)) utm[k] = q.get(k).slice(0, 60); });
    try {
      if (Object.keys(utm).length) sessionStorage.setItem('utm', JSON.stringify(utm));
      else return JSON.parse(sessionStorage.getItem('utm') || '{}');
    } catch (e) { /* sin almacenamiento: vale con la URL */ }
    return utm;
  };
  const utm = leer();
  if (!utm.utm_source) {
    utm.utm_source = 'web';
    utm.utm_medium = document.referrer ? 'referral' : 'directo';
  }
  const referrer = CLAVES.filter((k) => utm[k]).map((k) => `${k}=${utm[k]}`).join('&');
  // ct de Apple: máximo 40 caracteres.
  const ct = [utm.utm_source, utm.utm_campaign, utm.utm_content].filter(Boolean).join('-').slice(0, 40);

  // data-tienda="play" | "appstore" | "auto" (la del móvil del visitante; Play si no es iOS).
  document.querySelectorAll('a[data-tienda]').forEach((a) => {
    let tienda = a.dataset.tienda;
    if (tienda === 'auto') tienda = esIOS ? 'appstore' : 'play';
    const play = tienda === 'play';
    const url = new URL(play ? enlacePlay() : enlaceAppStore());
    if (play) url.searchParams.set('referrer', referrer);
    else if (url.hostname === 'apps.apple.com') {
      if (AJUSTES.PT_APPLE) url.searchParams.set('pt', AJUSTES.PT_APPLE);
      url.searchParams.set('ct', ct);
      url.searchParams.set('mt', '8');
    }
    a.href = url.toString();
    a.addEventListener('click', () => {
      if (window.umami) window.umami.track('descarga', { tienda: play ? 'play' : 'appstore', origen: utm.utm_source, pieza: utm.utm_content || '' });
    });
  });

  // 5) Descargas de los imprimibles (PDF): evento «imprimible» con la hoja y el origen (/imprimibles/…).
  document.querySelectorAll('a[data-descarga]').forEach((a) => {
    a.addEventListener('click', () => {
      if (window.umami) window.umami.track('imprimible', { hoja: a.dataset.descarga, origen: utm.utm_source, pieza: utm.utm_content || '' });
    });
  });
})();
