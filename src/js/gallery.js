// src/js/gallery.js
/**
 * Galería con lightbox — navegación con teclado, swipe y transiciones.
 */
export function initGallery() {
  const grid    = document.getElementById("gallery-grid");
  const overlay = document.getElementById("lightbox");
  const img     = document.getElementById("lb-img");
  const btnClose = document.getElementById("lb-close");
  const btnPrev  = document.getElementById("lb-prev");
  const btnNext  = document.getElementById("lb-next");
  if (!grid || !overlay) return;

  const items  = [...grid.querySelectorAll(".gallery-item")];
  const images = items
    .map(el => el.querySelector("img")?.src)
    .filter(Boolean);

  if (!images.length) return;

  let cur = 0, open = false;
  let tx0 = 0;

  const openLB = (i) => {
    cur = i;
    img.src = images[cur];
    overlay.classList.add("active");
    open = true;
    document.body.style.overflow = "hidden";
  };
  const closeLB = () => {
    overlay.classList.remove("active");
    open = false;
    document.body.style.overflow = "";
  };
  const go = (dir) => {
    cur = (cur + dir + images.length) % images.length;
    img.style.opacity = "0";
    img.style.transform = "scale(0.95)";
    setTimeout(() => {
      img.src = images[cur];
      img.style.opacity = "1";
      img.style.transform = "scale(1)";
    }, 200);
  };

  img.style.transition = "opacity .3s, transform .3s";

  items.forEach((el, i) => {
    if (el.querySelector("img")) el.addEventListener("click", () => openLB(i));
  });

  btnClose?.addEventListener("click", closeLB);
  btnPrev?.addEventListener("click", (e) => { e.stopPropagation(); go(-1); });
  btnNext?.addEventListener("click", (e) => { e.stopPropagation(); go(+1); });
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeLB(); });

  document.addEventListener("keydown", (e) => {
    if (!open) return;
    if (e.key === "Escape") closeLB();
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(+1);
  });

  overlay.addEventListener("touchstart", e => { tx0 = e.changedTouches[0].screenX; }, { passive: true });
  overlay.addEventListener("touchend", e => {
    const d = tx0 - e.changedTouches[0].screenX;
    if (Math.abs(d) > 45) go(d > 0 ? 1 : -1);
  }, { passive: true });
}
