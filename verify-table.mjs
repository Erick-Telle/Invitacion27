// verify-table.mjs — Verifica si la tabla rsvps existe
const url = "https://ukxwqhnhdjyjhxxwkjha.supabase.co/rest/v1/rsvps?select=id&limit=1";
const key  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVreHdxaG5oZGp5amh4eHdramhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3MTgyMjksImV4cCI6MjEwODI5NDIyOX0.kowgpaIGSKe1ezadLtVMmSLOpIiEpl9Owbc1S6bHD4k";

const res  = await fetch(url, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
const body = await res.json();

console.log("HTTP:", res.status);
console.log("Body:", JSON.stringify(body, null, 2));

if (res.status === 200) {
  console.log("\n✅ La tabla 'rsvps' EXISTE y es accesible.");
} else if (body?.code === "PGRST205" || res.status === 404) {
  console.log("\n❌ La tabla 'rsvps' NO EXISTE todavía.");
  console.log("   Sigue las instrucciones en setup-supabase.md para crearla.");
} else {
  console.log("\n⚠️  Estado inesperado — revisa la respuesta arriba.");
}
