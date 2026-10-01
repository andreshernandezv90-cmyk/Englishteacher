/* ==================================================================
   ENGLISH TEACHER — JavaScript
   ------------------------------------------------------------------
   Código sencillo para:
   1. Configurar el número de WhatsApp en un solo lugar.
   2. Abrir y cerrar el menú en móvil.
   3. Añadir sombra al encabezado al hacer scroll.
   4. Actualizar el año del footer.
   ================================================================== */


/* ==================================================================
   CONFIGURACIÓN (EDITAR con los datos reales del profesor)
   ================================================================== */

// Número de WhatsApp con código de país, sin "+", espacios ni guiones.
// Ejemplo México: 52 + 1 + 10 dígitos → "5215512345678"
const WHATSAPP_NUMBER = "5210000000000";

// Mensaje que aparecerá escrito al abrir WhatsApp (puede dejarse vacío: "").
const WHATSAPP_MESSAGE = "¡Hola! Me interesa tomar clases de inglés en línea.";


/* ==================================================================
   1. ENLACES DE WHATSAPP
   Todos los elementos con el atributo "data-whatsapp" usan el
   número y mensaje configurados arriba.
   ================================================================== */
function setupWhatsAppLinks() {
  let url = `https://wa.me/${WHATSAPP_NUMBER}`;

  if (WHATSAPP_MESSAGE) {
    url += `?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  }

  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    link.href = url;
  });
}


/* ==================================================================
   2. MENÚ MÓVIL
   ================================================================== */
function setupMobileMenu() {
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-menu");

  if (!toggle || !menu) return;

  const openMenu = () => {
    menu.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Cerrar menú");
  };

  const closeMenu = () => {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú");
  };

  // Abrir / cerrar con el botón
  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.contains("is-open");
    isOpen ? closeMenu() : openMenu();
  });

  // Cerrar al elegir una opción del menú
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Cerrar al hacer clic fuera del menú
  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target) && !toggle.contains(event.target)) {
      closeMenu();
    }
  });

  // Cerrar con la tecla Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}


/* ==================================================================
   3. SOMBRA DEL ENCABEZADO AL HACER SCROLL
   ================================================================== */
function setupHeaderShadow() {
  const header = document.getElementById("header");

  if (!header) return;

  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}


/* ==================================================================
   4. AÑO ACTUAL EN EL FOOTER
   ================================================================== */
function setupFooterYear() {
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }
}


/* ==================================================================
   INICIO
   ================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  setupWhatsAppLinks();
  setupMobileMenu();
  setupHeaderShadow();
  setupFooterYear();
});
