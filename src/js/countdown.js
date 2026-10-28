// src/js/countdown.js
import { EVENT_CONFIG } from "./config.js";

/**
 * Temporizador dinámico para la cuenta regresiva hacia el evento.
 * Calcula días, horas, minutos y segundos restantes en tiempo real.
 */
export function initCountdown() {
  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minutesEl = document.getElementById("cd-minutes");
  const secondsEl = document.getElementById("cd-seconds");
  const timerContainer = document.getElementById("countdown-timer");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const targetDate = new Date(EVENT_CONFIG.date.isoTarget).getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      if (timerContainer) {
        timerContainer.innerHTML = `
          <div class="countdown-finished">
            <span class="countdown-celebrate-title">¡Hoy es el gran día!</span>
            <p class="countdown-celebrate-sub">Celebrando los XV Años de Alba Guissell</p>
          </div>
        `;
      }
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Formatear a dos dígitos
    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  // Ejecución inicial y recurrente cada 1 segundo
  updateCountdown();
  setInterval(updateCountdown, 1000);
}
