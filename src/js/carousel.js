// src/js/carousel.js
/**
 * Carrusel automático para las fotos de la quinceañera (Foto 2, 3 y 4).
 * - Mismas dimensiones garantizadas.
 * - Deslizamiento suave automático cada 5 segundos.
 * - Animación fluida de izquierda a derecha.
 * - Soporte para swipe táctil en celulares y puntos indicadores dorados.
 */
export function initPhotoCarousel() {
  const carousel = document.querySelector(".carousel-container");
  if (!carousel) return;

  const slides = carousel.querySelectorAll(".carousel-slide");
  const dotsContainer = carousel.querySelector(".carousel-dots");
  if (!slides.length) return;

  let currentIndex = 0;
  let timer = null;

  // Renderizar los puntos indicadores
  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    slides.forEach((_, idx) => {
      const dot = document.createElement("button");
      dot.className = `carousel-dot ${idx === 0 ? "active" : ""}`;
      dot.setAttribute("type", "button");
      dot.setAttribute("aria-label", `Foto ${idx + 2}`);
      dot.addEventListener("click", () => {
        const direction = idx > currentIndex ? "forward" : "backward";
        goToSlide(idx, direction);
        restartTimer();
      });
      dotsContainer.appendChild(dot);
    });
  }

  const updateDots = (index) => {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll(".carousel-dot");
    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === index);
    });
  };

  /**
   * Cambia la diapositiva con animación fluida invertida (flujo de izquierda a derecha)
   */
  const goToSlide = (newIndex, direction = "forward") => {
    if (newIndex === currentIndex && slides[currentIndex].classList.contains("active")) return;

    const oldSlide = slides[currentIndex];
    const newSlide = slides[newIndex];

    // Limpiar clases transitorias
    slides.forEach(s => {
      s.classList.remove("slide-out-left", "slide-in-right", "slide-out-right", "slide-in-left");
    });

    if (direction === "forward") {
      // El viejo sale hacia la izquierda
      oldSlide.classList.remove("active");
      oldSlide.classList.add("slide-out-left");

      // El nuevo entra desde la derecha hacia el centro
      newSlide.style.transition = "none";
      newSlide.classList.add("slide-in-right");
      newSlide.offsetHeight; // Forzar reflow

      newSlide.style.transition = "";
      newSlide.classList.remove("slide-in-right");
      newSlide.classList.add("active");
    } else {
      // Dirección contraria
      oldSlide.classList.remove("active");
      oldSlide.classList.add("slide-out-right");

      newSlide.style.transition = "none";
      newSlide.classList.add("slide-in-left");
      newSlide.offsetHeight;

      newSlide.style.transition = "";
      newSlide.classList.remove("slide-in-left");
      newSlide.classList.add("active");
    }

    currentIndex = newIndex;
    updateDots(currentIndex);
  };

  const nextSlide = () => {
    const nextIdx = (currentIndex + 1) % slides.length;
    goToSlide(nextIdx, "forward");
  };

  const prevSlide = () => {
    const prevIdx = (currentIndex - 1 + slides.length) % slides.length;
    goToSlide(prevIdx, "backward");
  };

  // Cambio automático cada 5 segundos
  const startTimer = () => {
    timer = setInterval(nextSlide, 5000);
  };

  const restartTimer = () => {
    if (timer) clearInterval(timer);
    startTimer();
  };

  // Inicializar primer slide
  slides.forEach((s, idx) => {
    if (idx === 0) {
      s.classList.add("active");
    } else {
      s.classList.remove("active", "slide-out-left", "slide-in-right", "slide-out-right", "slide-in-left");
    }
  });
  updateDots(0);
  startTimer();

  // Gestos táctiles para deslizar con el dedo en teléfonos
  let touchStartX = 0;
  carousel.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
    if (timer) clearInterval(timer);
  }, { passive: true });

  carousel.addEventListener("touchend", (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 35) {
      if (diff > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
    startTimer();
  }, { passive: true });
}
