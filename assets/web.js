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

// Medición (homeodyssey-marketing/metricas.md).
// 1) Si se llega con ?utm_..., se recuerda durante la visita.
// 2) Los botones de Google Play llevan esos UTM en "referrer" (Play Console › Adquisición).
// 3) Los botones de App Store llevan "ct" (App Store Connect › Analíticas › Campañas).
//    PT_APPLE: el "provider token" del generador de enlaces de campaña de App Store Connect.
// 4) Cada clic en un botón de tienda se cuenta en la analítica (Umami), si está cargada.
(() => {
  const PT_APPLE = ''; // [PENDIENTE] p. ej. '123456789'
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
  const referrer = encodeURIComponent(CLAVES.filter((k) => utm[k]).map((k) => `${k}=${utm[k]}`).join('&'));
  // ct de Apple: máximo 40 caracteres.
  const ct = [utm.utm_source, utm.utm_campaign, utm.utm_content].filter(Boolean).join('-').slice(0, 40);

  document.querySelectorAll('a[href*="play.google.com/store/apps"], a[href*="apps.apple.com"]').forEach((a) => {
    const url = new URL(a.href);
    const play = url.hostname === 'play.google.com';
    if (play) url.searchParams.set('referrer', decodeURIComponent(referrer));
    else {
      if (PT_APPLE) url.searchParams.set('pt', PT_APPLE);
      url.searchParams.set('ct', ct);
      url.searchParams.set('mt', '8');
    }
    a.href = url.toString();
    a.addEventListener('click', () => {
      if (window.umami) window.umami.track('descarga', { tienda: play ? 'play' : 'appstore', origen: utm.utm_source, pieza: utm.utm_content || '' });
    });
  });
})();
