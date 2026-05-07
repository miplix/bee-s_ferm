-- ===== NEAR-keyed saves =====
-- Облачный sync без отдельного email-логина: ключ — NEAR account_id.
-- Игрок подключает кошелёк → анонимная сессия Supabase → push/pull через RPC.
-- На разных устройствах с тем же кошельком — один и тот же сейв.

create table if not exists public.near_saves (
  near_account_id text primary key,
  state jsonb not null,
  schema_version integer not null,
  device_id text,
  updated_at timestamptz not null default now()
);
create index if not exists near_saves_updated_at_idx on public.near_saves(updated_at desc);

-- Журнал последних 10 версий (для отката)
create table if not exists public.near_save_history (
  id bigserial primary key,
  near_account_id text not null,
  state jsonb not null,
  schema_version integer not null,
  created_at timestamptz not null default now()
);
create index if not exists near_save_history_acc_idx on public.near_save_history(near_account_id, created_at desc);

-- Auto-snapshot trigger: каждый upsert на near_saves → запись в near_save_history (max 10)
create or replace function public.near_snapshot_save() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.near_save_history(near_account_id, state, schema_version)
  values (new.near_account_id, new.state, new.schema_version);
  delete from public.near_save_history
  where near_account_id = new.near_account_id
    and id not in (
      select id from public.near_save_history
      where near_account_id = new.near_account_id
      order by created_at desc
      limit 10
    );
  return new;
end $$;

drop trigger if exists trg_near_snapshot_save on public.near_saves;
create trigger trg_near_snapshot_save
after insert or update on public.near_saves
for each row execute function public.near_snapshot_save();

-- Auto-update updated_at
drop trigger if exists trg_near_touch_saves on public.near_saves;
create trigger trg_near_touch_saves before update on public.near_saves
for each row execute function public.touch_updated_at();

-- ===== RLS =====
alter table public.near_saves enable row level security;
alter table public.near_save_history enable row level security;

-- Любой аутентифицированный может читать (включая anon-сессии — нужно
-- знать near_account_id чтобы прочитать).
drop policy if exists "near_saves read auth" on public.near_saves;
create policy "near_saves read auth" on public.near_saves
  for select to authenticated using (true);

drop policy if exists "near_save_history read auth" on public.near_save_history;
create policy "near_save_history read auth" on public.near_save_history
  for select to authenticated using (true);

-- INSERT/UPDATE — только через SECURITY DEFINER функцию ниже.

-- ===== RPC: upsert save by NEAR account_id =====
create or replace function public.upsert_near_save(
  p_near_account_id text,
  p_state jsonb,
  p_schema_version integer,
  p_device_id text default null
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'auth required'; end if;
  if p_near_account_id is null or length(p_near_account_id) < 2 then
    raise exception 'invalid near_account_id';
  end if;
  insert into public.near_saves(near_account_id, state, schema_version, device_id, updated_at)
  values (p_near_account_id, p_state, p_schema_version, p_device_id, now())
  on conflict (near_account_id) do update set
    state = excluded.state,
    schema_version = excluded.schema_version,
    device_id = excluded.device_id,
    updated_at = now();
end $$;
revoke all on function public.upsert_near_save from public;
grant execute on function public.upsert_near_save to authenticated;

-- ===== RPC: get save by NEAR account_id =====
create or replace function public.get_near_save(
  p_near_account_id text
) returns table(state jsonb, schema_version integer, updated_at timestamptz, device_id text)
language sql
security definer
set search_path = public
as $$
  select state, schema_version, updated_at, device_id
  from public.near_saves
  where near_account_id = p_near_account_id;
$$;
revoke all on function public.get_near_save(text) from public;
grant execute on function public.get_near_save(text) to authenticated;
