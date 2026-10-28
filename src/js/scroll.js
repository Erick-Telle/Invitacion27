// src/js/scroll.js
/**
 * Revelado elegante al scroll con IntersectionObserver.
 * Soporta: .reveal | .reveal-fade | .reveal-zoom | .reveal-left | .reveal-right | .reveal-rotate
 */
export function initScrollReveal() {
  const SELECTORS = ".reveal, .reveal-fade, .reveal-zoom, .reveal-left, .reveal-right, .reveal-rotate";
  const els = document.querySelectorAll(SELECTORS);

  // Activar inmediatamente los que ya están en el viewport
  els.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add("visible");
    }
  });

  if (!("IntersectionObserver" in window)) {
    els.forEach(el => el.classList.add("visible"));
    return;
  }

  const obs = new IntersectionObserver(
    (entries, o) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          o.unobserve(entry.target);
        }
      });
    },
    { root: null, threshold: 0.06, rootMargin: "0px 0px -30px 0px" }
  );

  els.forEach(el => {
    if (!el.classList.contains("visible")) {
      obs.observe(el);
    }
  });
}
