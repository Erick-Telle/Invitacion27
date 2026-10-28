// Script de diagnóstico Supabase — ejecutar con: node test-supabase.mjs
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL  = "https://ukxwqhnhdjyjhxxwkjha.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVreHdxaG5oZGp5amh4eHdramhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3MTgyMjksImV4cCI6MjEwODI5NDIyOX0.kowgpaIGSKe1ezadLtVMmSLOpIiEpl9Owbc1S6bHD4k";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

async function main() {
  console.log("🔗 Conectando a Supabase:", SUPABASE_URL);

  // 1. Probar SELECT en la tabla rsvps
  console.log("\n📋 Probando tabla 'rsvps'...");
  const { data: rows, error: selectErr } = await supabase
    .from("rsvps")
    .select("*")
    .limit(5);

  if (selectErr) {
    console.error("❌ Error al leer tabla 'rsvps':", selectErr.message);
    console.log("   Código:", selectErr.code);
    console.log("   Hint:", selectErr.hint || "—");
    console.log("\n⚠️  La tabla posiblemente no existe. Debes crearla en Supabase.");
  } else {
    console.log("✅ Tabla 'rsvps' encontrada. Registros actuales:", rows.length);
    if (rows.length > 0) {
      console.log("   Último registro:", JSON.stringify(rows[rows.length - 1], null, 2));
    }
  }

  // 2. Probar INSERT de prueba
  console.log("\n📝 Probando INSERT de prueba...");
  const testRecord = {
    name: "Invitado de Prueba",
    attending: true,
    guests: 1,
    comments: "Registro de prueba — diagnóstico",
  };

  const { data: inserted, error: insertErr } = await supabase
    .from("rsvps")
    .insert([testRecord]);

  if (insertErr) {
    console.error("❌ Error al insertar:", insertErr.message);
    console.log("   Código:", insertErr.code);
    console.log("   Hint:", insertErr.hint || "—");
  } else {
    console.log("✅ INSERT exitoso.");

    // 3. Limpiar registros de prueba si se tiene permiso
    try {
      await supabase
        .from("rsvps")
        .delete()
        .eq("name", "Invitado de Prueba");
      console.log("🧹 Limpieza completada.");
    } catch {
      // Ignorar si anon no tiene delete
    }
  }

  console.log("\n✔️  Diagnóstico completado.");
}

main().catch(console.error);
