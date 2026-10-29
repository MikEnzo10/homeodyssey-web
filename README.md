# homeodyssey.app

Web de HomeOdyssey: HTML y CSS estáticos, sin compilar nada.

| Página | Español | Inglés |
|---|---|---|
| Portada (cómo funciona, ejemplos por edad, precios, preguntas) | `index.html` | `en/index.html` |
| Ayuda (URL de soporte para Google Play y App Store) | `soporte.html` | `en/support.html` |
| Privacidad (6 idiomas) | `privacidad.html` | `privacidad-en.html` … |
| Borrar la cuenta (6 idiomas) | `borrar-cuenta.html` | `borrar-cuenta-en.html` … |

- Estilo común en `assets/estilo.css` (mismos colores y letra Nunito que la app).
- Las páginas legales son copia de `backend/src/main/resources/static/` del repositorio
  de la app, que siguen publicadas en Railway. Si cambia la política, cambiarla en los dos sitios.
- Las capturas (`assets/img/es`, `assets/img/en`) salen de la familia de ejemplo de las imágenes
  de tienda (`homeodyssey-marketing/aso/2026-10-29-imagenes-tienda`). Son WebP de 720 px de ancho.
- `assets/img/og-es.png` y `og-en.png`: la imagen que aparece al compartir el enlace.

## Verla en el ordenador

```
py -m http.server 8765
```

y abrir http://127.0.0.1:8765 (las rutas empiezan por `/`, así que no basta con abrir el fichero).

## Publicarla (GitHub Pages, gratis)

1. Crear en GitHub un repositorio **público** `homeodyssey-web` y subir esta carpeta.
2. En el repositorio: *Settings › Pages › Build and deployment*: *Deploy from a branch*, rama `main`, carpeta `/ (root)`.
   El fichero `CNAME` ya dice `homeodyssey.app`.
3. En IONOS, *Dominios › homeodyssey.app › DNS*:
   - Borrar los registros **A** y **AAAA** de `@` que pone IONOS por defecto (la página de aparcamiento).
   - Añadir cuatro registros **A** para `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
   - Añadir un **CNAME** `www` → `mikenzo10.github.io`.
   - **No tocar** los registros MX ni los TXT (SPF, DKIM, DMARC): son los del correo.
4. En GitHub, *Settings (de la cuenta) › Pages › Add a domain*: verificar `homeodyssey.app` con el registro TXT
   que te da (evita que otro use el dominio).
5. Cuando GitHub diga que el DNS está bien (de minutos a unas horas), marcar *Enforce HTTPS*.
   Los dominios `.app` solo funcionan con HTTPS, así que hasta ese momento no cargará.

Después: en Play Console, cambiar la política de privacidad a `https://homeodyssey.app/privacidad.html`
y poner `https://homeodyssey.app/soporte.html` como web de la app.
