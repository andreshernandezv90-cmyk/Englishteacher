# English Teacher — Landing page

Primer borrador de una landing page para un profesor de inglés en línea.
Hecha solo con HTML5, CSS3 y JavaScript vanilla. Para verla, abre `index.html` en el navegador.

```
index.html      → contenido de la página
css/style.css   → estilos (colores y medidas en las variables de :root)
js/script.js    → número de WhatsApp, menú móvil y detalles menores
img/            → coloca aquí la foto real como profesor.jpg
```

## Datos a reemplazar

| Dato | Dónde |
| --- | --- |
| Número de WhatsApp y mensaje predeterminado | `js/script.js` → `WHATSAPP_NUMBER`, `WHATSAPP_MESSAGE` |
| Fotografía del profesor | Guardar como `img/profesor.jpg` (formato vertical, aprox. 4:5) |
| Nombre del profesor | `index.html` → sección "Sobre mí" (`Teacher Name`) |
| Años de experiencia y estadísticas | `index.html` → bloque `stats` |
| Textos, clases y pasos | `index.html` (cada sección está comentada) |
| Colores | `css/style.css` → variables `--color-*` |
| Título y descripción para Google | `index.html` → `<title>` y `<meta name="description">` |

Mientras no exista `img/profesor.jpg`, se muestra automáticamente un icono como placeholder.
