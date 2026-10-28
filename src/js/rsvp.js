// src/js/rsvp.js
import { createClient } from "@supabase/supabase-js";

// ── Supabase client ──────────────────────────────────────────
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://ukxwqhnhdjyjhxxwkjha.supabase.co";

const supabaseAnon =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVreHdxaG5oZGp5amh4eHdramhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3MTgyMjksImV4cCI6MjEwODI5NDIyOX0.kowgpaIGSKe1ezadLtVMmSLOpIiEpl9Owbc1S6bHD4k";

let supabase = null;

try {
  supabase = createClient(supabaseUrl, supabaseAnon);
  console.log("✅ Supabase inicializado correctamente.");
} catch (e) {
  console.warn("⚠️ Supabase init error:", e);
}

// ── Envío a Supabase ──────────────────────────────────────────
async function saveToSupabase(payload) {
  if (!supabase) return { ok: false, reason: "no-client" };

  const { error } = await supabase
    .from("rsvps")
    .insert([payload]);

  if (error) {
    console.warn("⚠️ Error Supabase al guardar RSVP:", error.message, `(${error.code})`);
    return { ok: false, reason: error.code, message: error.message };
  }

  console.log("✅ RSVP guardado exitosamente en Supabase.");
  return { ok: true };
}

// ── Guardado local (respaldo silencioso) ──────────────────────
function saveLocally(payload) {
  try {
    const existing = JSON.parse(localStorage.getItem("local_rsvps") || "[]");
    existing.push({ ...payload, saved_at: new Date().toISOString() });
    localStorage.setItem("local_rsvps", JSON.stringify(existing));
    return true;
  } catch (err) {
    console.warn("⚠️ Error en almacenamiento local:", err);
    return false;
  }
}

// ── Spinner de carga en el botón ─────────────────────────────
function setButtonLoading(btn, loading) {
  if (!btn) return;
  if (loading) {
    btn.disabled = true;
    btn._originalHTML = btn.innerHTML;
    btn.innerHTML = `
      <svg class="rsvp-spinner" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
      <span>Enviando...</span>
    `;
  } else {
    btn.disabled = false;
    if (btn._originalHTML) btn.innerHTML = btn._originalHTML;
  }
}

// ── Mostrar mensaje de resultado ─────────────────────────────
function showMessage(box, type, name) {
  if (!box) return;

  if (type === "success") {
    box.className = "rsvp-status-message success";
    box.innerHTML = `
      <div class="rsvp-success-badge">✦ ¡Respuesta Registrada! ✦</div>
      <p>Muchas gracias <strong>${name}</strong> por confirmar.<br>Tu respuesta ha sido guardada exitosamente. ¡Te esperamos con mucha alegría!</p>
    `;
  } else {
    box.className = "rsvp-status-message error";
    box.innerHTML = `
      <div class="rsvp-success-badge">⚠️ Error al enviar</div>
      <p>No pudimos registrar tu confirmación en este momento. Por favor intenta de nuevo.</p>
    `;
  }
  box.style.display = "block";
  // Scroll suave al mensaje
  setTimeout(() => box.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);
}

// ── Inicialización principal ──────────────────────────────────
export function initRsvp() {
  const form           = document.getElementById("rsvp-form");
  const messageBox     = document.getElementById("rsvp-message");
  const attendingRadios = form?.querySelectorAll('input[name="attending"]');
  const guestsGroup    = document.getElementById("guests-group");
  const submitBtn      = form?.querySelector("button[type='submit']");
  let isSubmitted      = false;

  if (!form) return;

  // Toggle de visibilidad de acompañantes según asistencia
  attendingRadios?.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      if (guestsGroup && !isSubmitted) {
        guestsGroup.style.display = e.target.value === "false" ? "none" : "flex";
      }
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Evitar envíos duplicados si ya se envió
    if (isSubmitted) return;

    const isAttending = form.attending.value === "true";
    const nameVal     = form.name.value.trim();
    const guestsVal   = isAttending ? parseInt(form.guests?.value || "0", 10) : 0;
    const commentsVal = form.comments?.value.trim() || null;

    if (!nameVal) return; // Validación mínima

    const payload = {
      name:      nameVal,
      attending: isAttending,
      guests:    guestsVal,
      comments:  commentsVal,
    };

    // Mostrar estado de carga
    setButtonLoading(submitBtn, true);
    if (messageBox) messageBox.style.display = "none";

    // 1. Guardar de forma local como respaldo silencioso
    saveLocally({ ...payload, created_at: new Date().toISOString() });

    // 2. Guardar en Supabase
    await saveToSupabase(payload);

    // 3. Bloquear el formulario completamente hasta que recargue la página
    isSubmitted = true;
    form.classList.add("is-locked");

    const allInputs = form.querySelectorAll("input, select, textarea, button");
    allInputs.forEach((el) => {
      el.disabled = true;
    });

    if (submitBtn) {
      submitBtn.classList.add("submitted");
      submitBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span>Confirmación Enviada</span>
      `;
    }

    // 4. Mostrar mensaje de éxito
    showMessage(messageBox, "success", nameVal);
  });
}
