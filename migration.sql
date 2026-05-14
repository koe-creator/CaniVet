-- ============================================================
--  CaniVet — Migración completa a Supabase
--  Ejecutar en: Supabase > SQL Editor > New query
-- ============================================================

-- ── Vacunas ──────────────────────────────────────────────────
create table if not exists vacunas (
  id            uuid primary key default gen_random_uuid(),
  mascota_id    uuid,
  nombre        text not null,
  aplicada_el   date,
  proxima_dosis date,
  veterinario   text,
  notas         text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
alter table vacunas disable row level security;
create index if not exists vacunas_mascota_idx on vacunas(mascota_id);

-- ── Historial Clínico ────────────────────────────────────────
create table if not exists historial_clinico (
  id              uuid primary key default gen_random_uuid(),
  mascota_id      uuid,
  fecha_consulta  date not null,
  motivo          text not null,
  sintomas        text,
  diagnostico     text,
  tratamiento     text,
  observaciones   text,
  peso            numeric,
  veterinario     text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
alter table historial_clinico disable row level security;
create index if not exists historial_mascota_idx on historial_clinico(mascota_id);

-- ── Suscripciones ────────────────────────────────────────────
create table if not exists suscripciones (
  id               uuid primary key default gen_random_uuid(),
  cliente_id       uuid,
  cliente_nombre   text,
  mascota_id       uuid,
  mascota_nombre   text,
  servicio_nombre  text,
  plan             text default 'mensual',
  monto            numeric default 0,
  fecha_inicio     date,
  proximo_cobro    date,
  estado           text default 'activa',
  notas            text,
  sucursal_id      text,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);
alter table suscripciones disable row level security;

-- ── Guardería ─────────────────────────────────────────────────
create table if not exists guarderia (
  id              uuid primary key default gen_random_uuid(),
  mascota_id      uuid,
  mascota_nombre  text,
  cliente_id      uuid,
  cliente_nombre  text,
  fecha           date not null,
  check_in        time,
  check_out       time,
  notas           text,
  sucursal_id     text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
alter table guarderia disable row level security;
create index if not exists guarderia_fecha_idx on guarderia(fecha);

-- ── Paseos ────────────────────────────────────────────────────
create table if not exists paseos (
  id              uuid primary key default gen_random_uuid(),
  mascota_id      uuid,
  mascota_nombre  text,
  cliente_id      uuid,
  cliente_nombre  text,
  fecha           date,
  hora_inicio     time,
  hora_fin        time,
  duracion        text,
  distancia       numeric,
  paseador        text,
  ruta            text,
  estado          text default 'programado',
  notas           text,
  sucursal_id     text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
alter table paseos disable row level security;
create index if not exists paseos_fecha_idx on paseos(fecha);

-- ── Facturas ──────────────────────────────────────────────────
create table if not exists facturas (
  id                uuid primary key default gen_random_uuid(),
  numero            text unique,
  estado            text default 'pagado',
  emitida_el        timestamptz,
  pago_id           text,
  cliente_id        uuid,
  cliente_nombre    text,
  cliente_contacto  text,
  sucursal_id       text,
  sucursal_nombre   text,
  fecha             date,
  metodo            text,
  subtotal          numeric default 0,
  impuesto          numeric default 0,
  total             numeric default 0,
  notas             text,
  concepto          text,
  items_json        jsonb,
  created_at        timestamptz default now()
);
alter table facturas disable row level security;
create index if not exists facturas_pago_idx on facturas(pago_id);

-- ── Pagos Online ──────────────────────────────────────────────
create table if not exists pagos_online (
  id                  uuid primary key default gen_random_uuid(),
  stripe_session_id   text,
  referencia          text,
  url_pago            text,
  cita_id             text,
  cliente_id          uuid,
  cliente_nombre      text,
  cliente_contacto    text,
  mascota_nombre      text,
  servicio_nombre     text,
  monto               numeric default 0,
  moneda              text default 'DOP',
  estado              text default 'enviado',
  sucursal_id         text,
  sucursal_nombre     text,
  origen              text default 'manual',
  notas               text,
  pago_id             text,
  expira_el           timestamptz,
  pagado_el           timestamptz,
  ultimo_evento       text,
  created_at          timestamptz default now()
);
alter table pagos_online disable row level security;

-- ── Notificaciones ────────────────────────────────────────────
create table if not exists notificaciones (
  id              uuid primary key default gen_random_uuid(),
  tipo            text,
  titulo          text,
  mensaje         text,
  canal           text default 'interna',
  estado          text default 'enviada',
  destinatario    text,
  cliente_id      uuid,
  cliente_nombre  text,
  sucursal_id     text,
  created_at      timestamptz default now()
);
alter table notificaciones disable row level security;
create index if not exists notificaciones_estado_idx on notificaciones(estado);

-- ── Auditoría ─────────────────────────────────────────────────
create table if not exists auditoria (
  id            uuid primary key default gen_random_uuid(),
  accion        text,
  entidad       text,
  entidad_id    text,
  descripcion   text,
  usuario_email text,
  sucursal_id   text,
  created_at    timestamptz default now()
);
alter table auditoria disable row level security;

-- ── Sucursales ────────────────────────────────────────────────
create table if not exists sucursales (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  ciudad      text,
  estado      text default 'Activa',
  es_default  boolean default false,
  created_at  timestamptz default now()
);
alter table sucursales disable row level security;

-- ── Fotos de Servicio (antes/después) ─────────────────────────
create table if not exists fotos_servicio (
  id        uuid primary key default gen_random_uuid(),
  cita_id   text not null,
  tipo      text not null,   -- 'antes' | 'despues'
  data_url  text not null,
  descripcion text,
  created_at timestamptz default now()
);
alter table fotos_servicio disable row level security;
create index if not exists fotos_cita_idx on fotos_servicio(cita_id);

-- ============================================================
--  Listo. Todas las tablas creadas con RLS desactivado.
-- ============================================================
