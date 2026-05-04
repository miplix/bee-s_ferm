-- Add processed_tx_hashes table for replay-protection of NEAR payments
create table if not exists public.processed_near_tx (
  tx_hash text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  purpose text not null,           -- 'pollen' | 'vip'
  amount_near numeric not null,
  created_at timestamptz default now()
);
create index if not exists processed_near_tx_user_idx on public.processed_near_tx(user_id, created_at desc);

alter table public.processed_near_tx enable row level security;
drop policy if exists "tx own select" on public.processed_near_tx;
create policy "tx own select" on public.processed_near_tx
  for select using (auth.uid() = user_id);
drop policy if exists "tx own insert" on public.processed_near_tx;
create policy "tx own insert" on public.processed_near_tx
  for insert with check (auth.uid() = user_id);
