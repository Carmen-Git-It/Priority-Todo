-- Priority Todo - Supabase schema
-- Idempotent: safe to run against a fresh project OR an existing one. Re-running
-- will create the table if missing, migrate old columns, add new columns, and
-- refresh RLS policies. Open the Supabase SQL editor and run the whole file.

-- ---------------------------------------------------------------------------
-- 1. Table (created only if it doesn't already exist)
-- ---------------------------------------------------------------------------
create table if not exists public.items (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references auth.users(id) on delete cascade,
  name                 text not null,
  "due"                date not null,
  urgency              smallint not null default 1,
  impact               smallint not null default 1,
  complete             boolean not null default false,
  recurrence_interval  smallint,        -- null  => not recurring
  recurrence_unit      text,            -- null  => not recurring; else 'day'|'week'|'month'
  created_at           timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2. Column migrations (only run if the table predates a schema change)
-- ---------------------------------------------------------------------------
do $$
begin
  -- Migrate legacy `severity` column into `impact`, then drop it.
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'items' and column_name = 'severity'
  ) then
    if not exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'items' and column_name = 'impact'
    ) then
      alter table public.items add column impact smallint not null default 1;
    end if;

    update public.items set impact = severity where impact = 1 and severity <> 1;

    alter table public.items drop column severity;
  end if;

  -- Defensively ensure `urgency` / `impact` exist for any older table.
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'items' and column_name = 'urgency'
  ) then
    alter table public.items add column urgency smallint not null default 1;
  end if;
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'items' and column_name = 'impact'
  ) then
    alter table public.items add column impact smallint not null default 1;
  end if;

  -- Recurrence columns (added in the recurrence feature release).
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'items' and column_name = 'recurrence_interval'
  ) then
    alter table public.items add column recurrence_interval smallint;
  end if;
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'items' and column_name = 'recurrence_unit'
  ) then
    alter table public.items add column recurrence_unit text;
  end if;

  -- Constrain recurrence unit to the supported set.
  if not exists (
    select 1 from pg_constraint
    where conname = 'items_recurrence_unit_check'
  ) then
    alter table public.items
      add constraint items_recurrence_unit_check
      check (recurrence_unit is null or recurrence_unit in ('day','week','month'));
  end if;

  -- Either both recurrence columns set, or neither (a row is either recurring
  -- or not). interval must be positive when set.
  if not exists (
    select 1 from pg_constraint
    where conname = 'items_recurrence_pair_check'
  ) then
    alter table public.items
      add constraint items_recurrence_pair_check
      check (
        (recurrence_interval is null and recurrence_unit is null)
        or
        (recurrence_interval is not null and recurrence_interval > 0 and recurrence_unit is not null)
      );
  end if;
end$$;

-- ---------------------------------------------------------------------------
-- 3. Indexes for per-user lookups / ordering.
-- ---------------------------------------------------------------------------
create index if not exists items_user_id_idx        on public.items (user_id);
create index if not exists items_user_created_at_idx on public.items (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- 4. Row Level Security: each authenticated user only sees their own rows.
-- ---------------------------------------------------------------------------
alter table public.items enable row level security;

drop policy if exists "items_select_own" on public.items;
drop policy if exists "items_insert_own" on public.items;
drop policy if exists "items_update_own" on public.items;
drop policy if exists "items_delete_own" on public.items;

create policy "items_select_own"
  on public.items for select
  to authenticated
  using (auth.uid() = user_id);

create policy "items_insert_own"
  on public.items for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "items_update_own"
  on public.items for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "items_delete_own"
  on public.items for delete
  to authenticated
  using (auth.uid() = user_id);