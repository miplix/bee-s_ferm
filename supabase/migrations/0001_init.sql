-- ===== profiles =====
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ===== saves =====
create table if not exists public.saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null,
  schema_version integer not null,
  device_id text,
  updated_at timestamptz default now()
);
create index if not exists saves_updated_at_idx on public.saves(updated_at desc);

-- ===== save_history (last 10 backups per user) =====
create table if not exists public.save_history (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  state jsonb not null,
  schema_version integer not null,
  created_at timestamptz default now()
);
create index if not exists save_history_user_created_idx on public.save_history(user_id, created_at desc);

-- ===== auto-snapshot trigger: each upsert on saves → row in save_history =====
create or replace function public.snapshot_save() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.save_history(user_id, state, schema_version)
  values (new.user_id, new.state, new.schema_version);
  -- prune to last 10 per user
  delete from public.save_history
  where user_id = new.user_id
    and id not in (
      select id from public.save_history
      where user_id = new.user_id
      order by created_at desc
      limit 10
    );
  return new;
end $$;

drop trigger if exists trg_snapshot_save on public.saves;
create trigger trg_snapshot_save
after insert or update on public.saves
for each row execute function public.snapshot_save();

-- ===== auto-update updated_at =====
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists trg_touch_saves on public.saves;
create trigger trg_touch_saves before update on public.saves
for each row execute function public.touch_updated_at();

drop trigger if exists trg_touch_profiles on public.profiles;
create trigger trg_touch_profiles before update on public.profiles
for each row execute function public.touch_updated_at();

-- ===== auto-create profile on auth.users insert =====
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists trg_on_auth_user_created on auth.users;
create trigger trg_on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ===== Row Level Security =====
alter table public.profiles enable row level security;
alter table public.saves enable row level security;
alter table public.save_history enable row level security;

drop policy if exists "profiles select own" on public.profiles;
create policy "profiles select own" on public.profiles
  for select using (auth.uid() = id);
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles
  for update using (auth.uid() = id);
drop policy if exists "profiles insert self" on public.profiles;
create policy "profiles insert self" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "saves select own" on public.saves;
create policy "saves select own" on public.saves
  for select using (auth.uid() = user_id);
drop policy if exists "saves upsert own" on public.saves;
create policy "saves upsert own" on public.saves
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "save_history select own" on public.save_history;
create policy "save_history select own" on public.save_history
  for select using (auth.uid() = user_id);
