-- ===== Exchange / биржа =====
-- P2P торговля предметами (мутанты, ресурсы, урожай) за пыльцу.
-- Все мутации идут через SECURITY DEFINER функции (атомарность),
-- RLS жёсткая: клиент пишет только через эти функции, читает только публичный листинг.

-- ── Listings ──────────────────────────────────────────────────────────────
create table if not exists public.exchange_listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references auth.users(id) on delete cascade,
  item_id text not null,
  qty integer not null check (qty > 0 and qty <= 10000),
  price_pollen numeric(20, 2) not null check (price_pollen >= 10),
  status text not null default 'open' check (status in ('open','sold','cancelled')),
  buyer_id uuid references auth.users(id),
  created_at timestamptz not null default now(),
  fulfilled_at timestamptz
);
create index if not exists idx_exchange_listings_open
  on public.exchange_listings(item_id, price_pollen)
  where status = 'open';
create index if not exists idx_exchange_listings_seller
  on public.exchange_listings(seller_id, status);

-- ── Escrow: предмет «заморожен» с момента создания заявки до отмены/покупки ──
create table if not exists public.exchange_escrow (
  listing_id uuid primary key references public.exchange_listings(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id text not null,
  qty integer not null
);

-- ── Trade log: журнал всех сделок (audit + анти-fraud) ──
create table if not exists public.exchange_trades_log (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.exchange_listings(id),
  seller_id uuid not null,
  buyer_id uuid not null,
  item_id text not null,
  qty integer not null,
  total_pollen numeric(20, 2) not null,
  commission_pollen numeric(20, 2) not null,
  buyer_vip boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_trades_log_buyer on public.exchange_trades_log(buyer_id, created_at desc);
create index if not exists idx_trades_log_seller on public.exchange_trades_log(seller_id, created_at desc);

-- ── RLS ────────────────────────────────────────────────────────────────────
alter table public.exchange_listings enable row level security;
alter table public.exchange_escrow enable row level security;
alter table public.exchange_trades_log enable row level security;

-- Все могут читать открытые листинги (для каталога биржи)
drop policy if exists "exchange_listings public read" on public.exchange_listings;
create policy "exchange_listings public read" on public.exchange_listings
  for select using (true);

-- Журнал сделок — только свои
drop policy if exists "exchange_trades_log read own" on public.exchange_trades_log;
create policy "exchange_trades_log read own" on public.exchange_trades_log
  for select using (auth.uid() = seller_id or auth.uid() = buyer_id);

-- Escrow — никому не показываем (внутренняя таблица)
-- INSERT/UPDATE/DELETE на любую из таблиц только через SECURITY DEFINER функции

-- ──────────────────────────────────────────────────────────────────────────
-- ATOMIC FUNCTIONS
-- ──────────────────────────────────────────────────────────────────────────

-- ── exchange_create_listing ──
-- Создать заявку: списать qty со save продавца → escrow → листинг.
-- Возвращает id созданной заявки.
create or replace function public.exchange_create_listing(
  p_item_id text,
  p_qty integer,
  p_price_pollen numeric
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_save jsonb;
  v_have integer;
  v_listing_id uuid;
begin
  if v_user_id is null then raise exception 'auth required'; end if;
  if p_qty <= 0 or p_qty > 10000 then raise exception 'qty must be 1..10000'; end if;
  if p_price_pollen < 10 then raise exception 'min price = 10 pollen'; end if;

  -- Lock save row до конца транзакции
  select state into v_save from public.saves where user_id = v_user_id for update;
  if v_save is null then raise exception 'no save found'; end if;

  v_have := coalesce((v_save -> 'inventory' ->> p_item_id)::integer, 0);
  if v_have < p_qty then raise exception 'not enough qty in inventory'; end if;

  -- Списываем из save inventory[item_id]
  if v_have - p_qty <= 0 then
    v_save := jsonb_set(v_save, array['inventory'], (v_save -> 'inventory') - p_item_id);
  else
    v_save := jsonb_set(v_save, array['inventory', p_item_id], to_jsonb(v_have - p_qty));
  end if;
  update public.saves set state = v_save where user_id = v_user_id;

  -- Создаём листинг + escrow
  insert into public.exchange_listings(seller_id, item_id, qty, price_pollen)
  values (v_user_id, p_item_id, p_qty, p_price_pollen)
  returning id into v_listing_id;

  insert into public.exchange_escrow(listing_id, user_id, item_id, qty)
  values (v_listing_id, v_user_id, p_item_id, p_qty);

  return v_listing_id;
end $$;

revoke all on function public.exchange_create_listing from public;
grant execute on function public.exchange_create_listing to authenticated;

-- ── exchange_cancel_listing ──
-- Отменить заявку: вернуть из escrow в save продавца + status='cancelled'.
create or replace function public.exchange_cancel_listing(
  p_listing_id uuid
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_listing record;
  v_save jsonb;
  v_have integer;
begin
  if v_user_id is null then raise exception 'auth required'; end if;

  select * into v_listing from public.exchange_listings
    where id = p_listing_id for update;
  if v_listing is null then raise exception 'listing not found'; end if;
  if v_listing.seller_id <> v_user_id then raise exception 'not your listing'; end if;
  if v_listing.status <> 'open' then raise exception 'listing not open'; end if;

  -- Возврат предмета продавцу
  select state into v_save from public.saves where user_id = v_user_id for update;
  v_have := coalesce((v_save -> 'inventory' ->> v_listing.item_id)::integer, 0);
  v_save := jsonb_set(v_save, array['inventory', v_listing.item_id], to_jsonb(v_have + v_listing.qty));
  update public.saves set state = v_save where user_id = v_user_id;

  update public.exchange_listings set status = 'cancelled' where id = p_listing_id;
  delete from public.exchange_escrow where listing_id = p_listing_id;
end $$;

revoke all on function public.exchange_cancel_listing from public;
grant execute on function public.exchange_cancel_listing to authenticated;

-- ── exchange_buy ──
-- Атомарная покупка: списываем pollen у buyer, добавляем item; платим seller (минус комиссия).
-- Комиссия: VIP=3%, не-VIP=5%. VIP определяется по vipExpiresAt > now() в save buyer.
create or replace function public.exchange_buy(
  p_listing_id uuid
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_buyer_id uuid := auth.uid();
  v_listing record;
  v_buyer_save jsonb;
  v_seller_save jsonb;
  v_buyer_pollen numeric;
  v_seller_pollen numeric;
  v_buyer_have integer;
  v_total numeric;
  v_fee_pct numeric;
  v_commission numeric;
  v_seller_payout numeric;
  v_is_vip boolean;
  v_vip_expires bigint;
  v_now_ms bigint := (extract(epoch from now()) * 1000)::bigint;
begin
  if v_buyer_id is null then raise exception 'auth required'; end if;

  -- Lock listing
  select * into v_listing from public.exchange_listings
    where id = p_listing_id for update;
  if v_listing is null then raise exception 'listing not found'; end if;
  if v_listing.status <> 'open' then raise exception 'listing not open'; end if;
  if v_listing.seller_id = v_buyer_id then raise exception 'cannot buy from yourself'; end if;

  -- Lock обоих saves в детерминированном порядке (по uuid) — избегаем deadlock
  if v_listing.seller_id < v_buyer_id then
    select state into v_seller_save from public.saves where user_id = v_listing.seller_id for update;
    select state into v_buyer_save  from public.saves where user_id = v_buyer_id for update;
  else
    select state into v_buyer_save  from public.saves where user_id = v_buyer_id for update;
    select state into v_seller_save from public.saves where user_id = v_listing.seller_id for update;
  end if;
  if v_buyer_save is null or v_seller_save is null then raise exception 'save missing'; end if;

  -- Считаем
  v_total := v_listing.qty * v_listing.price_pollen;
  v_buyer_pollen := coalesce((v_buyer_save ->> 'pollen')::numeric, 0);
  if v_buyer_pollen < v_total then raise exception 'not enough pollen'; end if;

  v_vip_expires := coalesce((v_buyer_save ->> 'vipExpiresAt')::bigint, 0);
  v_is_vip := v_vip_expires > v_now_ms;
  v_fee_pct := case when v_is_vip then 0.03 else 0.05 end;
  v_commission := round(v_total * v_fee_pct, 2);
  v_seller_payout := v_total - v_commission;

  -- Buyer: -pollen, +item
  v_buyer_save := jsonb_set(v_buyer_save, array['pollen'], to_jsonb(v_buyer_pollen - v_total));
  v_buyer_have := coalesce((v_buyer_save -> 'inventory' ->> v_listing.item_id)::integer, 0);
  v_buyer_save := jsonb_set(v_buyer_save, array['inventory', v_listing.item_id], to_jsonb(v_buyer_have + v_listing.qty));
  update public.saves set state = v_buyer_save where user_id = v_buyer_id;

  -- Seller: +payout
  v_seller_pollen := coalesce((v_seller_save ->> 'pollen')::numeric, 0);
  v_seller_save := jsonb_set(v_seller_save, array['pollen'], to_jsonb(v_seller_pollen + v_seller_payout));
  update public.saves set state = v_seller_save where user_id = v_listing.seller_id;

  -- Update listing + log
  update public.exchange_listings
    set status = 'sold', buyer_id = v_buyer_id, fulfilled_at = now()
    where id = p_listing_id;

  insert into public.exchange_trades_log(
    listing_id, seller_id, buyer_id, item_id, qty,
    total_pollen, commission_pollen, buyer_vip
  ) values (
    p_listing_id, v_listing.seller_id, v_buyer_id, v_listing.item_id, v_listing.qty,
    v_total, v_commission, v_is_vip
  );

  delete from public.exchange_escrow where listing_id = p_listing_id;

  return jsonb_build_object(
    'ok', true,
    'item_id', v_listing.item_id,
    'qty', v_listing.qty,
    'paid', v_total,
    'seller_received', v_seller_payout,
    'commission', v_commission,
    'vip', v_is_vip
  );
end $$;

revoke all on function public.exchange_buy from public;
grant execute on function public.exchange_buy to authenticated;
