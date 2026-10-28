-- ══════════════════════════════════════════════════════════
--  FIX: Permisos RLS para tabla rsvps
--  Error: 42501 — new row violates row-level security policy
--
--  El problema: RLS activo pero sin GRANT de INSERT al rol anon.
--  Solución: otorgar privilegios + asegurar política correcta.
-- ══════════════════════════════════════════════════════════

-- 1. Otorgar privilegios explícitos al rol anon
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON public.rsvps TO anon;

-- 2. Otorgar privilegios al rol authenticated (por si acaso)
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT INSERT ON public.rsvps TO authenticated;

-- 3. Eliminar la política anterior por si quedó mal definida
DROP POLICY IF EXISTS "anon_insert_rsvp" ON public.rsvps;

-- 4. Recrear la política de INSERT correctamente
CREATE POLICY "anon_insert_rsvp"
  ON public.rsvps
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 5. Verificar que la política de SELECT para service_role exista
DROP POLICY IF EXISTS "service_select_rsvp" ON public.rsvps;
CREATE POLICY "service_select_rsvp"
  ON public.rsvps
  FOR SELECT
  TO service_role
  USING (true);

-- 6. Verificar que RLS siga activa
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- Confirmar permisos aplicados
SELECT grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'rsvps';
