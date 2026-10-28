// Script para crear la tabla rsvps en Supabase usando service_role key
// Ejecutar con: node create-table.mjs
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL      = "https://ukxwqhnhdjyjhxxwkjha.supabase.co";
const SERVICE_ROLE_KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVreHdxaG5oZGp5amh4eHdramhhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjcxODIyOSwiZXhwIjoyMTA4Mjk0MjI5fQ.mVBZ5qNFhg3XOtXMOPRo5IgTqB7CiwA3JwDVrmzsDeg";

// Usamos la REST API de Supabase directamente para ejecutar SQL
const PROJECT_REF = "ukxwqhnhdjyjhxxwkjha";

const SQL_CREATE = `
-- Tabla para confirmaciones de asistencia (RSVP)
CREATE TABLE IF NOT EXISTS public.rsvps (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT        NOT NULL,
  attending   BOOLEAN     NOT NULL DEFAULT true,
  guests      INTEGER     NOT NULL DEFAULT 0,
  comments    TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- Política: cualquiera puede insertar (usuarios de la invitación)
CREATE POLICY IF NOT EXISTS "allow_public_insert"
  ON public.rsvps
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Política: solo el service_role puede leer (panel admin)
CREATE POLICY IF NOT EXISTS "allow_service_select"
  ON public.rsvps
  FOR SELECT
  TO service_role
  USING (true);

-- Política: solo el service_role puede eliminar
CREATE POLICY IF NOT EXISTS "allow_service_delete"
  ON public.rsvps
  FOR DELETE
  TO service_role
  USING (true);
`;

async function runSQL(sql) {
  const response = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ query: sql }),
    }
  );

  const text = await response.text();
  return { status: response.status, body: text };
}

async function main() {
  console.log("🏗️  Creando tabla 'rsvps' en Supabase...\n");

  // Intentar vía Management API
  const result = await runSQL(SQL_CREATE);
  console.log("HTTP Status:", result.status);
  console.log("Respuesta:", result.body);

  if (result.status === 200 || result.status === 201) {
    console.log("\n✅ Tabla creada exitosamente.");
    console.log("   Ahora corre: node test-supabase.mjs para verificar.");
  } else {
    console.log("\n⚠️  La Management API retornó un error.");
    console.log("   Puedes crear la tabla manualmente en Supabase:");
    console.log("   https://supabase.com/dashboard/project/ukxwqhnhdjyjhxxwkjha/editor");
    console.log("\n   Copia y pega el siguiente SQL:\n");
    console.log(SQL_CREATE);
  }
}

main().catch(console.error);
