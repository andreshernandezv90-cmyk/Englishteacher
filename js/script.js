/* ==================================================================
   YES! — JavaScript
   ------------------------------------------------------------------
   1. Enlaces de WhatsApp (número y mensajes en un solo lugar)
   2. Menú móvil
   3. Encabezado al hacer scroll + enlace activo
   4. Globo del hero: palabras del español al inglés
   5. Situaciones reales (pestañas)
   6. Niveles: línea de progreso con el scroll
   7. Revelado del "15" y botón flotante
   8. Año del footer
   ================================================================== */


/* ==================================================================
   CONFIGURACIÓN (EDITAR con los datos reales)
   ================================================================== */

// Número de WhatsApp con código de país, sin "+", espacios ni guiones.
// Ejemplo México: "5215512345678". Mientras esté vacío, WhatsApp
// abrirá el mensaje para que la persona elija el contacto.
const WHATSAPP_NUMBER = "";

// Mensajes predeterminados. Cada botón elige uno con data-whatsapp="info" | "horarios" | "precios".
const WHATSAPP_MESSAGES = {
  info: "Hola, vi la página de YES! y me gustaría recibir información sobre las clases de inglés.",
  horarios: "Hola, me gustaría consultar precios y horarios disponibles.",
  precios: "Hola, me gustaría consultar el precio de las clases de inglés.",
};

// Pares de palabras del globo del hero.
const WORD_PAIRS = [
  ["Hola", "Hello"],
  ["Gracias", "Thank you"],
  ["Viaje", "Travel"],
  ["Trabajo", "Work"],
  ["Amigos", "Friends"],
];

// Conversaciones de la sección "Inglés para la vida real".
const SCENES = {
  viajes: [
    ["Hi! Is this the gate for the flight to Madrid?", "¿Esta es la puerta del vuelo a Madrid?"],
    ["Yes, boarding starts in twenty minutes.", "Sí, el embarque empieza en veinte minutos."],
    ["Perfect, thank you so much!", "¡Perfecto, muchas gracias!"],
  ],
  restaurante: [
    ["Hi, could we get a table for two?", "Hola, ¿nos da una mesa para dos?"],
    ["Of course. Right this way, please.", "Claro. Por aquí, por favor."],
    ["Thanks! Could we see the menu?", "¡Gracias! ¿Podemos ver el menú?"],
  ],
  trabajo: [
    ["Do you have a minute to talk about the project?", "¿Tienes un minuto para hablar del proyecto?"],
    ["Sure, what’s on your mind?", "Claro, ¿qué tienes en mente?"],
    ["I’d like to share a few ideas.", "Me gustaría compartir algunas ideas."],
  ],
  universidad: [
    ["Could you explain that last point again?", "¿Podría explicar otra vez el último punto?"],
    ["Of course. Let me give you an example.", "Claro. Te doy un ejemplo."],
    ["That makes sense now, thanks.", "Ahora tiene sentido, gracias."],
  ],
  personas: [
    ["Hi, I’m Laura. Where are you from?", "Hola, soy Laura. ¿De dónde eres?"],
    ["I’m from Chile. Nice to meet you!", "Soy de Chile. ¡Mucho gusto!"],
    ["Nice to meet you too!", "¡Igualmente!"],
  ],
  presentaciones: [
    ["Good morning, everyone. Let’s get started.", "Buenos días a todos. Empecemos."],
    ["Today I’ll walk you through three ideas.", "Hoy les presento tres ideas."],
    ["Feel free to ask questions at the end.", "Pueden hacer preguntas al final."],
  ],
};


const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");


/* ==================================================================
   1. ENLACES DE WHATSAPP
   ================================================================== */
function setupWhatsAppLinks() {
  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    const message = WHATSAPP_MESSAGES[link.dataset.whatsapp] || WHATSAPP_MESSAGES.info;
    link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  });
}


/* ==================================================================
   2. MENÚ MÓVIL
   ================================================================== */
function setupMobileMenu() {
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-menu");

  if (!toggle || !menu) return;

  const isOpen = () => menu.classList.contains("is-open");

  const setMenu = (open) => {
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  };

  toggle.addEventListener("click", () => setMenu(!isOpen()));

  // Cerrar al elegir una opción
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  // Cerrar al hacer clic fuera
  document.addEventListener("click", (event) => {
    if (isOpen() && !menu.contains(event.target) && !toggle.contains(event.target)) {
      setMenu(false);
    }
  });

  // Cerrar con Escape y devolver el foco al botón
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      setMenu(false);
      toggle.focus();
    }
  });

  // Al pasar a escritorio, el menú deja de ser un panel
  window.matchMedia("(min-width: 960px)").addEventListener("change", () => setMenu(false));
}


/* ==================================================================
   3. ENCABEZADO AL HACER SCROLL + ENLACE ACTIVO
   ================================================================== */
function setupHeader() {
  const header = document.getElementById("header");

  if (header) {
    const update = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  const links = [...document.querySelectorAll(".nav__link")];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!("IntersectionObserver" in window) || !sections.length) return;

  const setActive = (id) => {
    links.forEach((link) => {
      const active = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  };

  // Una sección es "activa" cuando cruza una franja cerca del centro de la pantalla
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}


/* ==================================================================
   4. GLOBO DEL HERO: ESPAÑOL → INGLÉS
   Se pausa al pasar el cursor, al enfocar o si el globo no es visible.
   ================================================================== */
function setupWordSwap() {
  const bubble = document.getElementById("word-swap");
  if (!bubble) return;

  const word = bubble.querySelector("[data-swap-word]");
  const lang = bubble.querySelector("[data-swap-lang]");

  // Con movimiento reducido se queda fijo en la primera traducción
  if (reduceMotion.matches) {
    word.textContent = WORD_PAIRS[0][1];
    word.lang = "en";
    lang.textContent = "in English";
    bubble.classList.add("is-en");
    return;
  }

  // Empieza en español ("Hola") y el primer paso lo pasa a inglés
  let pair = 0;
  let english = false;
  let timer = null;
  let paused = false;
  let inView = true;

  const render = () => {
    const text = WORD_PAIRS[pair][english ? 1 : 0];

    word.classList.add("is-leaving");

    setTimeout(() => {
      word.textContent = text;
      word.lang = english ? "en" : "es";
      lang.textContent = english ? "in English" : "en español";
      bubble.classList.toggle("is-en", english);

      word.classList.remove("is-leaving");
      word.classList.add("is-entering");
      // Forzar reflow para que la entrada se anime
      void word.offsetWidth;
      word.classList.remove("is-entering");
    }, 300);
  };

  const step = () => {
    if (english) pair = (pair + 1) % WORD_PAIRS.length;
    english = !english;
    render();
    // El inglés se queda más tiempo en pantalla que el español
    schedule(english ? 2600 : 1400);
  };

  const schedule = (delay) => {
    clearTimeout(timer);
    if (!paused && inView && !document.hidden) timer = setTimeout(step, delay);
  };

  const pause = () => { paused = true; clearTimeout(timer); };
  const resume = () => { paused = false; schedule(1600); };

  bubble.addEventListener("mouseenter", pause);
  bubble.addEventListener("mouseleave", resume);
  document.addEventListener("visibilitychange", () => schedule(1600));

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      inView ? schedule(1600) : clearTimeout(timer);
    }).observe(bubble);
  }

  schedule(1600);
}


/* ==================================================================
   5. SITUACIONES REALES (pestañas accesibles)
   ================================================================== */
function setupScenes() {
  const tabs = [...document.querySelectorAll(".tab")];
  const panel = document.getElementById("dialog");
  if (!tabs.length || !panel) return;

  const renderScene = (key) => {
    panel.replaceChildren(
      ...SCENES[key].map(([en, es], i) => {
        const msg = document.createElement("div");
        msg.className = `msg ${i % 2 ? "msg--you" : "msg--them"}`;

        const p = document.createElement("p");
        p.lang = "en";
        p.textContent = en;

        const span = document.createElement("span");
        span.textContent = es;

        msg.append(p, span);
        return msg;
      })
    );

    // Reinicia la animación de entrada de los mensajes
    panel.classList.remove("is-changing");
    void panel.offsetWidth;
    panel.classList.add("is-changing");
  };

  const select = (tab, focus = false) => {
    tabs.forEach((t) => {
      const selected = t === tab;
      t.setAttribute("aria-selected", String(selected));
      t.tabIndex = selected ? 0 : -1;
    });
    panel.setAttribute("aria-labelledby", tab.id);
    renderScene(tab.dataset.scene);
    if (focus) tab.focus();
    tab.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduceMotion.matches ? "auto" : "smooth" });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => select(tab));

    // Flechas, Inicio y Fin para moverse entre pestañas
    tab.addEventListener("keydown", (event) => {
      const keys = {
        ArrowRight: (index + 1) % tabs.length,
        ArrowLeft: (index - 1 + tabs.length) % tabs.length,
        Home: 0,
        End: tabs.length - 1,
      };
      if (event.key in keys) {
        event.preventDefault();
        select(tabs[keys[event.key]], true);
      }
    });
  });
}


/* ==================================================================
   6. NIVELES: LÍNEA DE PROGRESO CON EL SCROLL
   ================================================================== */
function setupTrack() {
  const track = document.getElementById("track");
  if (!track) return;

  const steps = [...track.querySelectorAll(".track__step")];
  let ticking = false;

  const update = () => {
    ticking = false;
    const rect = track.getBoundingClientRect();
    const vh = window.innerHeight;
    // 0 cuando el recorrido entra por abajo, 1 cuando llega a la mitad superior
    const start = vh * 0.85;
    const end = vh * 0.35;
    const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end + rect.height * 0.4)));

    track.style.setProperty("--progress", progress.toFixed(3));
    steps.forEach((step, i) => {
      step.classList.toggle("is-reached", progress >= i / steps.length + 0.02);
    });
  };

  if (reduceMotion.matches) {
    track.style.setProperty("--progress", 1);
    steps.forEach((step) => step.classList.add("is-reached"));
    return;
  }

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
}


/* ==================================================================
   7. REVELADO DEL "15" Y BOTÓN FLOTANTE
   ================================================================== */
function setupObservers() {
  const number = document.querySelector(".experience__num");
  const float = document.querySelector(".wa-float");
  const hero = document.getElementById("inicio");
  const contact = document.getElementById("contacto");

  if (!("IntersectionObserver" in window)) {
    number?.classList.add("is-visible");
    float?.classList.add("is-visible");
    return;
  }

  // Se observa el contenedor: el número empieza recortado y no "intersecta"
  if (number) {
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        number.classList.add("is-visible");
        io.disconnect();
      }
    }, { threshold: 0.3 });
    io.observe(number.parentElement);
  }

  // El botón flotante aparece fuera del hero y se oculta en el contacto
  if (float && hero && contact) {
    let heroVisible = true;
    let contactVisible = false;
    const sync = () => float.classList.toggle("is-visible", !heroVisible && !contactVisible);

    new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; sync(); }).observe(hero);
    new IntersectionObserver(([entry]) => { contactVisible = entry.isIntersecting; sync(); }).observe(contact);
  }
}


/* ==================================================================
   8. AÑO DEL FOOTER
   ================================================================== */
function setupFooterYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
}


/* ==================================================================
   INICIO
   ================================================================== */
setupWhatsAppLinks();
setupMobileMenu();
setupHeader();
setupWordSwap();
setupScenes();
setupTrack();
setupObservers();
setupFooterYear();
