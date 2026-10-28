// src/js/admin.js
/**
 * Simple admin panel that lists all RSVP entries.
 * Uses Supabase REST endpoint with the service role key (exposed via VITE_ADMIN_API_KEY).
 * This page is intended to be accessed only by trusted family members.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const adminKey = import.meta.env.VITE_ADMIN_API_KEY; // service role key

async function fetchRsvps() {
  const response = await fetch(`${supabaseUrl}/rest/v1/rsvps?order=created_at.desc`, {
    headers: {
      apikey: adminKey,
      Authorization: `Bearer ${adminKey}`,
      Accept: 'application/json',
    },
  });
  if (!response.ok) throw new Error('Error fetching RSVPs');
  return response.json();
}

function renderTable(rsvps) {
  const table = document.getElementById('rsvp-table');
  const tbody = table.querySelector('tbody');
  tbody.innerHTML = '';
  let total = 0, attending = 0, guests = 0;
  rsvps.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.name}</td>
      <td>${row.attending ? 'Sí' : 'No'}</td>
      <td>${row.guests}</td>
      <td>${row.comments || ''}</td>
      <td>${new Date(row.created_at).toLocaleString()}</td>
    `;
    tbody.appendChild(tr);
    total++;
    if (row.attending) {
      attending += 1 + (row.guests || 0);
    }
    guests += row.guests || 0;
  });
  // Show stats
  const statsDiv = document.getElementById('stats');
  statsDiv.innerHTML = `
    <p>Total respuestas: ${total}</p>
    <p>Confirmados (incl. acompañantes): ${attending}</p>
    <p>Acompañantes totales: ${guests}</p>
  `;
  table.classList.remove('hidden');
}

(async () => {
  try {
    const data = await fetchRsvps();
    renderTable(data);
  } catch (e) {
    console.error(e);
    document.getElementById('stats').textContent = 'Error al cargar los datos.';
  }
})();
