// src/js/particles.js
import { EVENT_CONFIG } from "./config.js";

/**
 * Sistema de partículas cinematográficas para el Jardín Encantado Nocturno.
 * Renderiza luciérnagas con resplandor, pétalos flotantes y estrellas titilantes
 * usando Canvas 2D de alta performance.
 */
export function initParticles() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const config = EVENT_CONFIG.theme.particles;
  let width, height;
  let animationId;
  let particles = [];

  // ═══ Resize handler ═══
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  // ═══ Luciérnaga ═══
  class Firefly {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = 1.5 + Math.random() * 2.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = 0;
      this.targetOpacity = 0.3 + Math.random() * 0.7;
      this.fadeSpeed = 0.003 + Math.random() * 0.008;
      this.phase = Math.random() * Math.PI * 2;
      this.phaseSpeed = 0.01 + Math.random() * 0.02;
      this.wobbleAmplitude = 0.3 + Math.random() * 0.8;
      this.glowSize = 8 + Math.random() * 15;
      this.fadingIn = true;
      this.lifespan = 300 + Math.random() * 500;
      this.life = 0;
    }

    update() {
      this.phase += this.phaseSpeed;
      this.life++;

      // Fade in/out cycle
      if (this.fadingIn) {
        this.opacity += this.fadeSpeed;
        if (this.opacity >= this.targetOpacity) {
          this.fadingIn = false;
        }
      } else if (this.life > this.lifespan * 0.7) {
        this.opacity -= this.fadeSpeed;
      }

      // Movimiento orgánico con wobble
      this.x += this.speedX + Math.sin(this.phase) * this.wobbleAmplitude;
      this.y += this.speedY + Math.cos(this.phase * 0.7) * this.wobbleAmplitude * 0.5;

      // Reset si sale de pantalla o se desvanece
      if (this.opacity <= 0 || this.x < -20 || this.x > width + 20 ||
          this.y < -20 || this.y > height + 20) {
        this.reset();
      }
    }

    draw() {
      if (this.opacity <= 0) return;

      // Resplandor exterior suave
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.glowSize
      );
      gradient.addColorStop(0, `rgba(255, 230, 140, ${this.opacity * 0.95})`);
      gradient.addColorStop(0.3, `rgba(212, 175, 55, ${this.opacity * 0.45})`);
      gradient.addColorStop(0.65, `rgba(40, 95, 200, ${this.opacity * 0.15})`);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.glowSize, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Núcleo brillante
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 245, 200, ${this.opacity})`;
      ctx.fill();
    }
  }

  // ═══ Pétalo flotante ═══
  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = 4 + Math.random() * 8;
      this.speedY = 0.3 + Math.random() * 0.8;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 2;
      this.opacity = 0;
      this.maxOpacity = 0.25 + Math.random() * 0.35;
      this.fadeInSpeed = 0.005 + Math.random() * 0.01;
      this.wobblePhase = Math.random() * Math.PI * 2;
      this.wobbleSpeed = 0.02 + Math.random() * 0.03;
      this.wobbleAmplitude = 0.5 + Math.random() * 1;
      // Color fucsia/magenta con variación
      const hue = 320 + Math.random() * 30;
      const sat = 60 + Math.random() * 30;
      const light = 55 + Math.random() * 20;
      this.color = `hsla(${hue}, ${sat}%, ${light}%, `;
    }

    update() {
      this.wobblePhase += this.wobbleSpeed;
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.wobblePhase) * this.wobbleAmplitude;
      this.rotation += this.rotationSpeed;

      // Fade in
      if (this.opacity < this.maxOpacity) {
        this.opacity += this.fadeInSpeed;
      }

      // Fade out near bottom
      if (this.y > height * 0.85) {
        this.opacity -= 0.008;
      }

      if (this.y > height + 20 || this.opacity <= 0) {
        this.reset();
      }
    }

    draw() {
      if (this.opacity <= 0.01) return;

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;

      // Forma de pétalo
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.bezierCurveTo(
        this.size * 0.6, -this.size * 0.6,
        this.size * 0.6, this.size * 0.6,
        0, this.size
      );
      ctx.bezierCurveTo(
        -this.size * 0.6, this.size * 0.6,
        -this.size * 0.6, -this.size * 0.6,
        0, -this.size
      );
      ctx.fillStyle = this.color + this.opacity + ")";
      ctx.fill();

      // Vena central sutil
      ctx.beginPath();
      ctx.moveTo(0, -this.size * 0.8);
      ctx.lineTo(0, this.size * 0.8);
      ctx.strokeStyle = `rgba(255, 200, 230, ${this.opacity * 0.3})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      ctx.globalAlpha = 1;
      ctx.restore();
    }
  }

  // ═══ Estrella titilante ═══
  class Star {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height * 0.7; // Más concentradas arriba
      this.size = 0.5 + Math.random() * 1.5;
      this.opacity = 0.1 + Math.random() * 0.5;
      this.twinkleSpeed = 0.005 + Math.random() * 0.02;
      this.twinklePhase = Math.random() * Math.PI * 2;
      this.maxOpacity = this.opacity;
    }

    update() {
      this.twinklePhase += this.twinkleSpeed;
      this.opacity = this.maxOpacity * (0.3 + 0.7 * Math.abs(Math.sin(this.twinklePhase)));
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 230, 255, ${this.opacity})`;
      ctx.fill();

      // Brillo sutil para las estrellas más grandes
      if (this.size > 1) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 210, 255, ${this.opacity * 0.1})`;
        ctx.fill();
      }
    }
  }

  // ═══ Inicializar partículas ═══
  for (let i = 0; i < config.stars; i++) {
    particles.push(new Star());
  }
  for (let i = 0; i < config.fireflies; i++) {
    particles.push(new Firefly());
  }
  for (let i = 0; i < config.petals; i++) {
    particles.push(new Petal());
  }

  // ═══ Loop de animación ═══
  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.update();
      p.draw();
    }

    animationId = requestAnimationFrame(animate);
  }

  animate();

  // Cleanup
  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener("resize", resize);
  };
}

/**
 * Genera estrellas CSS estáticas en el fondo como respaldo decorativo.
 */
export function initStarsLayer() {
  const layer = document.getElementById("stars-layer");
  if (!layer) return;

  const count = 60;
  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 70}%`;
    star.style.width = `${1 + Math.random() * 2}px`;
    star.style.height = star.style.width;
    star.style.animationDuration = `${2 + Math.random() * 4}s`;
    star.style.animationDelay = `${Math.random() * 3}s`;
    layer.appendChild(star);
  }
}
