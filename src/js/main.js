// src/js/main.js
import { initCover }         from "./cover.js";
import { initCountdown }     from "./countdown.js";
import { initScrollReveal }  from "./scroll.js";
import { initAudio }         from "./audio.js";
import { initGallery }       from "./gallery.js";
import { initParticles }     from "./particles.js";
import { initPhotoCarousel } from "./carousel.js";
import { initRsvp }          from "./rsvp.js";

document.addEventListener("DOMContentLoaded", () => {
  // 0. Fijar dimensiones estáticas del fondo para que no haga zoom en móviles
  const fixedBg = document.querySelector(".fixed-bg");

  const lockViewport = () => {
    if (fixedBg) {
      const sh = Math.max(window.screen.height, window.innerHeight, 900);
      const sw = Math.max(window.screen.width, window.innerWidth, 380);
      fixedBg.style.height = `${sh + 120}px`;
      fixedBg.style.width = `${sw}px`;
    }
  };
  lockViewport();
  window.addEventListener("orientationchange", () => setTimeout(lockViewport, 150));

  // 1. Partículas (luciérnagas, pétalos, estrellas animadas en canvas)
  initParticles();

  // 2. Portada — sobre con broche floral (si está activa)
  initCover();

  // 3. Countdown dinámico (temporizador de días restantes)
  initCountdown();

  // 4. Scroll reveal
  initScrollReveal();

  // 5. Carrusel automático de fotos (Foto 2, 3 y 4 cada 3 segundos hacia la derecha)
  initPhotoCarousel();

  // 6. Galería lightbox
  initGallery();

  // 7. Audio ambiental
  initAudio();

  // 8. Confirmación de Asistencia (RSVP)
  initRsvp();
});
