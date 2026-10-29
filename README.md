# YES! — La dulzura de aprender inglés desde casa

Landing page para clases de inglés conversacional en línea.
HTML, CSS y JavaScript vanilla, sin dependencias. Para verla, abre `index.html`
o levanta un servidor local: `python3 -m http.server`.

```
index.html          → contenido y estructura (cada sección está comentada)
css/style.css       → sistema visual: tokens de marca en :root
js/script.js        → WhatsApp, menú, globo del hero, situaciones, niveles
img/favicon.svg     → icono (globo azul con el "!" de YES!)
img/og-image.png    → imagen para compartir en redes (1200×630)
```

## Identidad

| Token | Valor | Uso |
| --- | --- | --- |
| `--blue` | `#2340D9` | Color principal de marca, botones, bloques |
| `--ink` | `#0D1633` | Texto y contraste |
| `--white` / `--mist` | `#FFFFFF` / `#F2F5FF` | Fondos |
| `--red` | `#E0313A` | Solo acentos: el punto del "!", indicadores |

Tipografía: **Fraunces** (títulos, con el eje SOFT al máximo para formas suaves) y **Onest** (texto).
El símbolo de la marca es el "!" de YES!: una barra azul y un punto rojo.

## Datos a reemplazar

| Dato | Dónde |
| --- | --- |
| Número de WhatsApp | `js/script.js` → `WHATSAPP_NUMBER` (vacío por ahora) |
| Mensajes de WhatsApp | `js/script.js` → `WHATSAPP_MESSAGES` |
| Nombres de certificaciones | `index.html` → sección "Formación" (quitar `data-pending` al editar) |
| URL del sitio | `index.html` → `<link rel="canonical">` y `og:image` (usar URL absoluta) |
| Frases del hero y conversaciones | `js/script.js` → `WORD_PAIRS` y `SCENES` |
