-- ============================================================
--  CaniVet — Migración v3: Seguridad RLS
--  Ejecutar en: Supabase > SQL Editor > New query
--
--  IMPORTANTE: Lee antes de ejecutar.
--  Esta migración activa Row Level Security en todas las tablas
--  nuevas. Las tablas existentes (clientes, mascotas, citas,
--  servicios, pagos, inventario) NO se modifican para no romper
--  lo que ya funciona.
-- ============================================================

-- ── Helper: rol del request ───────────────────────────────────────────────────
-- anon   = usuario sin sesión (público)
-- authenticated = usuario con sesión Supabase válida

-- ── RESERVAS ONLINE ───────────────────────────────────────────────────────────
-- El público puede crear reservas, solo autenticados pueden leer/editar
alter table reservas_online enable row level security;

create policy "public_insert_reservas" on reservas_online
  for insert to anon, authenticated with check (true);

create policy "auth_all_reservas" on reservas_online
  for all to authenticated using (true) with check (true);

-- ── VACUNAS ───────────────────────────────────────────────────────────────────
alter table vacunas enable row level security;
create policy "auth_all_vacunas" on vacunas
  for all to anon, authenticated using (true) with check (true);

-- ── HISTORIAL CLÍNICO ─────────────────────────────────────────────────────────
alter table historial_clinico enable row level security;
create policy "auth_all_historial" on historial_clinico
  for all to anon, authenticated using (true) with check (true);

-- ── SUSCRIPCIONES ─────────────────────────────────────────────────────────────
alter table suscripciones enable row level security;
create policy "auth_all_suscripciones" on suscripciones
  for all to anon, authenticated using (true) with check (true);

-- ── GUARDERÍA ─────────────────────────────────────────────────────────────────
alter table guarderia enable row level security;
create policy "auth_all_guarderia" on guarderia
  for all to anon, authenticated using (true) with check (true);

-- ── PASEOS ────────────────────────────────────────────────────────────────────
alter table paseos enable row level security;
create policy "auth_all_paseos" on paseos
  for all to anon, authenticated using (true) with check (true);

-- ── FACTURAS ──────────────────────────────────────────────────────────────────
alter table facturas enable row level security;
create policy "auth_all_facturas" on facturas
  for all to anon, authenticated using (true) with check (true);

-- ── PAGOS ONLINE ──────────────────────────────────────────────────────────────
alter table pagos_online enable row level security;
create policy "auth_all_pagos_online" on pagos_online
  for all to anon, authenticated using (true) with check (true);

-- ── NOTIFICACIONES ────────────────────────────────────────────────────────────
alter table notificaciones enable row level security;
create policy "auth_all_notificaciones" on notificaciones
  for all to anon, authenticated using (true) with check (true);

-- ── AUDITORÍA ─────────────────────────────────────────────────────────────────
alter table auditoria enable row level security;
create policy "auth_all_auditoria" on auditoria
  for all to anon, authenticated using (true) with check (true);

-- ── SUCURSALES ────────────────────────────────────────────────────────────────
alter table sucursales enable row level security;
create policy "auth_all_sucursales" on sucursales
  for all to anon, authenticated using (true) with check (true);

-- ── FOTOS DE SERVICIO ─────────────────────────────────────────────────────────
alter table fotos_servicio enable row level security;
create policy "auth_all_fotos" on fotos_servicio
  for all to anon, authenticated using (true) with check (true);

-- ============================================================
--  Nota: Las políticas actuales son permisivas (allow all).
--  Para mayor seguridad en producción, restringe por usuario:
--    using (auth.uid() is not null)
--  Esto requiere que el frontend use Supabase Auth (JWT válido).
-- ============================================================
