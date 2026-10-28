// src/js/audio.js
import { EVENT_CONFIG } from "./config.js";

/**
 * Controlador de audio ambiental y panel de música para la invitación.
 * Controla:
 * 1. Panel interactivo de música de gala (reproductor con vinilo, barra de progreso, ecualizador).
 * 2. Botón flotante inferior (sincronizado con el panel).
 * 3. Fallback sintetizado con Web Audio API si no hay archivo de audio.
 */
export function initAudio() {
  const audioWidget = document.getElementById("audio-widget");
  const audioToggleBtn = document.getElementById("audio-toggle-btn");
  const audioStatusTooltip = document.getElementById("audio-tooltip");
  const eqBars = document.querySelectorAll(".eq-bar");

  // Elementos del panel interactivo
  const panelPlayBtn = document.getElementById("panel-play-btn");
  const panelVolBtn = document.getElementById("panel-vol-btn");
  const musicProgressBar = document.getElementById("music-progress-bar");
  const musicProgressFill = document.getElementById("music-progress-fill");
  const musicCurrentTime = document.getElementById("music-current-time");
  const musicTotalTime = document.getElementById("music-total-time");
  const musicVinyl = document.getElementById("music-vinyl");
  const musicPanelEq = document.getElementById("music-panel-eq");

  const panelIconPlay = panelPlayBtn?.querySelector(".icon-play");
  const panelIconPause = panelPlayBtn?.querySelector(".icon-pause");
  const panelIconVolOn = panelVolBtn?.querySelector(".icon-vol-on");
  const panelIconVolOff = panelVolBtn?.querySelector(".icon-vol-off");

  let isPlaying = false;
  let isMuted = false;
  let audioElem = null;
  let synthAudioNode = null;
  let audioCtx = null;
  let useFallbackSynth = false;

  // Crear elemento de audio HTML5 con carga ligera asíncrona
  audioElem = new Audio();
  audioElem.src = EVENT_CONFIG.audio.src;
  audioElem.loop = true;
  audioElem.preload = "metadata"; // Solo carga metadatos al inicio (duración), no descarga el archivo completo hasta que se reproduce
  audioElem.volume = EVENT_CONFIG.audio.initialVolume || 0.75;

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Cargar duración
  audioElem.addEventListener("loadedmetadata", () => {
    if (musicTotalTime && audioElem.duration) {
      musicTotalTime.textContent = formatTime(audioElem.duration);
    }
  });

  // Actualizar progreso
  audioElem.addEventListener("timeupdate", () => {
    if (!audioElem.duration) return;
    const pct = (audioElem.currentTime / audioElem.duration) * 100;
    if (musicProgressFill) {
      musicProgressFill.style.width = `${pct}%`;
    }
    if (musicCurrentTime) {
      musicCurrentTime.textContent = formatTime(audioElem.currentTime);
    }
  });

  audioElem.addEventListener("error", () => {
    console.info("Pista de audio no cargada. Activando armonizador musical de respaldo.");
    useFallbackSynth = true;
  });

  // ═══ Sintetizador ambiental de respaldo (melodía de jardín encantado) ═══
  function startFallbackSynth() {
    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!audioCtx) audioCtx = new AudioCtxClass();
      if (audioCtx.state === "suspended") audioCtx.resume();

      const masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.18, audioCtx.currentTime + 2.5);
      masterGain.connect(audioCtx.destination);

      const delay = audioCtx.createDelay();
      delay.delayTime.value = 0.28;
      const feedback = audioCtx.createGain();
      feedback.gain.value = 0.32;
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(masterGain);

      // Notas mágicas inspiradas en Canon in D (D, F#, A, B, C#)
      const notes = [293.66, 369.99, 440.00, 493.88, 554.37, 587.33, 739.99];
      let step = 0;

      const interval = setInterval(() => {
        if (!isPlaying || !synthAudioNode) {
          clearInterval(interval);
          return;
        }

        const osc = audioCtx.createOscillator();
        const noteGain = audioCtx.createGain();
        osc.type = step % 4 === 0 ? "triangle" : "sine";
        osc.frequency.value = notes[step % notes.length];

        noteGain.gain.setValueAtTime(0.16, audioCtx.currentTime);
        noteGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.4);

        osc.connect(noteGain);
        noteGain.connect(masterGain);
        noteGain.connect(delay);

        osc.start();
        osc.stop(audioCtx.currentTime + 2.5);

        step++;
      }, 700);

      synthAudioNode = { masterGain, interval };
    } catch (err) {
      console.warn("Web Audio API no disponible:", err);
    }
  }

  function stopFallbackSynth() {
    if (synthAudioNode) {
      try {
        synthAudioNode.masterGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        setTimeout(() => {
          clearInterval(synthAudioNode?.interval);
          synthAudioNode = null;
        }, 600);
      } catch (e) {
        clearInterval(synthAudioNode?.interval);
        synthAudioNode = null;
      }
    }
  }

  // ═══ Actualizar estado de interfaces ═══
  function updatePlayerUI(playing) {
    // 1. Widget flotante
    if (audioWidget) {
      audioWidget.classList.toggle("is-playing", playing);
      audioToggleBtn?.setAttribute("aria-label", playing ? "Pausar música" : "Reproducir música");
      eqBars.forEach(bar => bar.classList.toggle("animating", playing));
    }

    // 2. Panel de música integrado
    if (panelPlayBtn) {
      panelPlayBtn.setAttribute("aria-label", playing ? "Pausar música" : "Reproducir música");
      if (panelIconPlay) panelIconPlay.style.display = playing ? "none" : "block";
      if (panelIconPause) panelIconPause.style.display = playing ? "block" : "none";
    }

    if (musicVinyl) {
      musicVinyl.classList.toggle("spinning", playing);
    }

    if (musicPanelEq) {
      musicPanelEq.classList.toggle("active", playing);
    }
  }

  // ═══ Reproducir ═══
  function startPlayback() {
    isPlaying = true;
    updatePlayerUI(true);

    if (useFallbackSynth) {
      startFallbackSynth();
    } else {
      const playPromise = audioElem.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Reproducción exitosa
          })
          .catch(error => {
            console.warn("Autoplay bloqueado por navegador, esperando interacción:", error);
            // Intentar fallback si el archivo no responde
            if (!audioElem.currentTime) {
              useFallbackSynth = true;
              startFallbackSynth();
            }
          });
      }
    }

    // Tooltip en widget si existe
    if (audioStatusTooltip) {
      audioStatusTooltip.classList.add("visible");
      setTimeout(() => {
        audioStatusTooltip.classList.remove("visible");
      }, 3000);
    }
  }

  // ═══ Pausar ═══
  function pausePlayback() {
    isPlaying = false;
    updatePlayerUI(false);

    if (useFallbackSynth) {
      stopFallbackSynth();
    } else {
      audioElem.pause();
    }
  }

  // Toggle general
  function togglePlayback() {
    if (isPlaying) {
      pausePlayback();
    } else {
      startPlayback();
    }
  }

  // Eventos de botones
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePlayback();
    });
  }

  if (panelPlayBtn) {
    panelPlayBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePlayback();
    });
  }

  // Barra de progreso interactiva (Seek)
  if (musicProgressBar) {
    musicProgressBar.addEventListener("click", (e) => {
      if (!audioElem || !audioElem.duration) return;
      const rect = musicProgressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const fraction = Math.max(0, Math.min(1, clickX / rect.width));
      audioElem.currentTime = fraction * audioElem.duration;
      if (!isPlaying) {
        startPlayback();
      }
    });
  }

  // Botón de volumen / silenciar
  if (panelVolBtn) {
    panelVolBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      isMuted = !isMuted;
      audioElem.muted = isMuted;
      if (panelIconVolOn) panelIconVolOn.style.display = isMuted ? "none" : "block";
      if (panelIconVolOff) panelIconVolOff.style.display = isMuted ? "block" : "none";
    });
  }

  // Reproducción automática al abrir la portada (libro)
  document.addEventListener("invitationOpened", () => {
    if (!isPlaying) {
      startPlayback();
    }
  });
}
