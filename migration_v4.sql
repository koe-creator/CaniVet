-- ============================================================
--  CaniVet — Migración v4: Usuarios y Roles en Supabase
--  Ejecutar en: Supabase > SQL Editor > New query
-- ============================================================

create table if not exists usuarios_sistema (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  nombre        text,
  rol           text default 'user',      -- 'admin' | 'user'
  estado        text default 'activo',    -- 'activo' | 'inactivo'
  sucursal_ids  jsonb default '[]',       -- array de IDs de sucursales permitidas
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table usuarios_sistema disable row level security;
create index if not exists usuarios_email_idx on usuarios_sistema(email);

-- ============================================================
