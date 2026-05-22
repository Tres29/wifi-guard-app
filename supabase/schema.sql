create extension if not exists "pgcrypto";

create table if not exists devices (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner text,
  mac_address text,
  ip_address text,
  is_blocked boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists block_rules (
  id uuid primary key default gen_random_uuid(),
  domain text not null unique,
  reason text,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists schedules (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null references devices(id) on delete cascade,
  start_time time not null,
  end_time time not null,
  days text[] not null default '{}',
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

alter table devices enable row level security;
alter table block_rules enable row level security;
alter table schedules enable row level security;

-- API routes use SUPABASE_SERVICE_ROLE_KEY, so RLS is bypassed on the server.
-- Do not expose SUPABASE_SERVICE_ROLE_KEY in the browser.
