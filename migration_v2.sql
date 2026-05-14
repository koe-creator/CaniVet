-- ============================================================
--  CaniVet — Migración v2: Reservas Online (RF8)
--  Ejecutar en: Supabase > SQL Editor > New query
-- ============================================================


create table if not exists reservas_online (
  id               uuid primary key default gen_random_uuid(),
  nombre           text not null,
  email            text,
  telefono         text,
  mascota_nombre   text,
  servicio_id      uuid,
  servicio_nombre  text,
  fecha            date,
  hora             time,
  notas            text,
  estado           text default 'pendiente',  -- pendiente | confirmada | rechazada
  cita_id          uuid,                       -- se llena al confirmar
  created_at       timestamptz default now()
);


alter table reservas_online disable row level security;
create index if not exists reservas_estado_idx on reservas_online(estado);
create index if not exists reservas_fecha_idx  on reservas_online(fecha);

