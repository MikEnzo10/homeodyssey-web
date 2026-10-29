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
