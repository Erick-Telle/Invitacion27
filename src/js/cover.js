// src/js/cover.js
import { gsap } from "gsap";

/**
 * Mapeo de libros por número de personas y configuración de la invitación.
 */
const BOOK_MAP = {
  1: {
    img: "/imagenes/items/Libro 1 Persona.PNG",
    alt: "Invitación Libro - Válido para 1 Persona",
    validityText: "Válido para 1 Persona",
    rsvpValue: "0", // Solo yo (1 persona)
    maxGuests: 0,
  },
  2: {
    img: "/imagenes/items/Libro 2 Personas.PNG",
    alt: "Invitación Libro - Válido para 2 Personas",
    validityText: "Válido para 2 Personas",
    rsvpValue: "1", // +1 Acompañante (2 personas)
    maxGuests: 1,
  },
  3: {
    img: "/imagenes/items/Libro 3 Personas.PNG",
    alt: "Invitación Libro - Válido para 3 Personas",
    validityText: "Válido para 3 Personas",
    rsvpValue: "2", // +2 Acompañantes (3 personas)
    maxGuests: 2,
  },
  4: {
    img: "/imagenes/items/Libro 4 Personas.PNG",
    alt: "Invitación Libro - Válido para 4 Personas",
    validityText: "Válido para 4 Personas",
    rsvpValue: "3", // +3 Acompañantes (4 personas)
    maxGuests: 3,
  },
  6: {
    img: "/imagenes/items/Libro 6 Personas.PNG",
    alt: "Invitación Libro - Válido para 6 Personas",
    validityText: "Válido para 6 Personas",
    rsvpValue: "5", // +5 Acompañantes (6 personas)
    maxGuests: 5,
  },
};

/**
 * Obtiene el número de personas desde los parámetros de la URL.
 * Soporta: ?p=1, ?personas=2, ?invitacion=3, ?i=4, ?boletos=6, etc.
 * Por defecto devuelve 1 persona si no se especifica.
 */
export function getGuestCountFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const raw =
    params.get("p") ||
    params.get("personas") ||
    params.get("invitacion") ||
    params.get("i") ||
    params.get("boletos") ||
    params.get("pases");

  if (raw !== null && raw !== undefined) {
    const num = parseInt(raw, 10);
    if ([1, 2, 3, 4, 6].includes(num)) {
      return num;
    }
    // Si viene 5 u otro número no estándar
    if (num === 5) return 6;
    if (num > 6) return 6;
    if (num <= 1) return 1;
  }

  // Por defecto 1 persona
  return 1;
}

/**
 * Obtiene el nombre del invitado o familia desde la URL.
 * Soporta: ?n=Familia+Pérez, ?nombre=Familia+Gómez, ?familia=..., ?para=...
 */
export function getGuestNameFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const name =
    params.get("n") ||
    params.get("nombre") ||
    params.get("familia") ||
    params.get("para") ||
    params.get("f") ||
    "";

  return name.trim();
}

/**
 * Inicializa la portada del Libro Mágico y su transición hacia la invitación.
 */
export function initCover() {
  const coverScreen       = document.getElementById("cover-screen");
  const bookScene         = document.getElementById("book-scene");
  const bookFront         = document.getElementById("book-front");
  const bookCoverImg      = document.getElementById("book-cover-img");
  const bookLightBurst    = document.getElementById("book-light-burst");
  const coverHeader       = document.getElementById("cover-header");
  const coverFooter       = document.getElementById("cover-footer");
  const coverOpenBtn      = document.getElementById("cover-open-btn");
  const coverValidityTag  = document.getElementById("cover-validity-tag");
  const coverGuestBadge   = document.getElementById("cover-guest-badge");
  const guestBadgeText    = document.getElementById("guest-badge-text");
  const invitation        = document.getElementById("invitation");

  if (!coverScreen || !bookScene) return;

  // 1. Determinar datos del invitado desde la URL
  const guestCount = getGuestCountFromUrl();
  const guestName  = getGuestNameFromUrl();
  const config     = BOOK_MAP[guestCount] || BOOK_MAP[1];

  // 2. Asignar la imagen correspondiente del libro (1, 2, 3, 4 ó 6 personas)
  if (bookCoverImg) {
    bookCoverImg.src = config.img;
    bookCoverImg.alt = config.alt;
  }

  // 3. Asignar el texto de validez
  if (coverValidityTag) {
    coverValidityTag.textContent = `Invitación ${config.validityText}`;
  }

  // 4. Mostrar placa de dedicatoria personalizada si viene nombre en la URL
  if (coverGuestBadge && guestBadgeText && guestName) {
    guestBadgeText.textContent = `Invitación para: ${guestName}`;
    coverGuestBadge.style.display = "inline-flex";
  }

  // 5. Sincronizar el formulario RSVP de la invitación
  syncRsvpForm(guestCount, guestName, config);

  // 6. Evitar scroll mientras la portada esté activa
  document.body.style.overflow = "hidden";

  let isOpening = false;

  // ── Interacción al abrir el libro ──
  const triggerOpen = () => {
    if (isOpening) return;
    isOpening = true;

    coverScreen.classList.add("is-opening");

    // Detener la animación CSS de flotación para transición limpia
    bookScene.style.animation = "none";

    const tl = gsap.timeline({
      onComplete: () => {
        // Ocultar portada y restaurar scroll
        coverScreen.style.display = "none";
        document.body.style.overflow = "";

        // Notificar al sistema y al reproductor de audio
        document.dispatchEvent(new CustomEvent("invitationOpened"));
      },
    });

    // Paso 1: Anticipación — El libro se centra y se eleva levemente
    tl.to(bookScene, {
      rotateX: 0,
      rotateY: 0,
      y: -12,
      scale: 1.05,
      duration: 0.45,
      ease: "power2.out",
    })
    // Paso 2: Desvanecer header y footer
    .to(
      [coverHeader, coverFooter],
      {
        opacity: 0,
        y: -20,
        duration: 0.45,
        ease: "power2.in",
      },
      "-=0.25"
    )
    // Paso 3: La tapa frontal se abre en 3D como un libro real
    .to(
      bookFront,
      {
        rotateY: -155,
        duration: 1.3,
        ease: "power2.inOut",
        transformOrigin: "left center",
      },
      "-=0.1"
    )
    // Paso 4: Brote de luz mágica celestial desde el interior del libro
    .to(
      bookLightBurst,
      {
        scale: 4.8,
        opacity: 1,
        duration: 0.95,
        ease: "power3.in",
      },
      "-=0.8"
    )
    // Paso 5: Zoom cinematográfico entrando al libro
    .to(
      bookScene,
      {
        scale: 1.6,
        z: 220,
        opacity: 0.15,
        duration: 0.9,
        ease: "power2.in",
      },
      "-=0.7"
    )
    // Paso 6: Desvanecimiento final suave de toda la portada
    .to(
      coverScreen,
      {
        opacity: 0,
        duration: 0.85,
        ease: "power2.out",
      },
      "-=0.35"
    );

    // Revelar la invitación principal suavemente
    if (invitation) {
      invitation.classList.remove("hidden");
      gsap.fromTo(
        invitation,
        { opacity: 0.7, scale: 0.99 },
        { opacity: 1, scale: 1, duration: 1.1, ease: "power2.out", delay: 0.4 }
      );
    }
  };

  // Clic en el libro o en el botón de apertura
  bookScene.addEventListener("click", triggerOpen);
  coverOpenBtn?.addEventListener("click", triggerOpen);

  // Soporte táctil optimizado para teléfonos
  bookScene.addEventListener(
    "touchend",
    (e) => {
      e.preventDefault();
      triggerOpen();
    },
    { passive: false }
  );

  coverOpenBtn?.addEventListener(
    "touchend",
    (e) => {
      e.preventDefault();
      triggerOpen();
    },
    { passive: false }
  );
}

/**
 * Ajusta y precarga los campos del formulario RSVP según el número de personas permitido.
 */
function syncRsvpForm(guestCount, guestName, config) {
  const rsvpNameInput = document.getElementById("rsvp-name");
  const rsvpGuestsSelect = document.getElementById("rsvp-guests");

  // Pre-llenar el nombre si vino en la URL y el campo está vacío
  if (rsvpNameInput && guestName && !rsvpNameInput.value) {
    rsvpNameInput.value = guestName;
  }

  // Ajustar el select de acompañantes según la invitación
  if (rsvpGuestsSelect && config) {
    // Si la opción no existe aún, nos aseguramos de que pueda seleccionarse
    rsvpGuestsSelect.value = config.rsvpValue;

    // Limitar las opciones para que no puedan seleccionar más de lo asignado
    const options = rsvpGuestsSelect.querySelectorAll("option");
    options.forEach((opt) => {
      const val = parseInt(opt.value, 10);
      if (val > config.maxGuests) {
        opt.disabled = true;
        opt.style.display = "none";
      } else {
        opt.disabled = false;
        opt.style.display = "";
      }
    });
  }
}
