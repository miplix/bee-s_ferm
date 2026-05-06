/**
 * Биржа (exchange) — клиентские обёртки над RPC-функциями Postgres.
 * Все мутации (create/cancel/buy) идут через SECURITY DEFINER функции на сервере,
 * что гарантирует атомарность списания и зачисления (см. supabase/migrations/0003_exchange.sql).
 *
 * Чтение открытых заявок — обычный SELECT с RLS-политикой "public read".
 */

import { getSupabase } from "./client";

export interface ExchangeListing {
  id: string;
  seller_id: string;
  item_id: string;
  qty: number;
  price_pollen: number;
  status: "open" | "sold" | "cancelled";
  buyer_id: string | null;
  created_at: string;
  fulfilled_at: string | null;
}

export interface BuyResult {
  ok: true;
  item_id: string;
  qty: number;
  paid: number;
  seller_received: number;
  commission: number;
  vip: boolean;
}

/** Создать заявку. Возвращает id листинга. Throws если не хватает qty в инвентаре. */
export async function createListing(
  itemId: string,
  qty: number,
  pricePollen: number,
): Promise<string> {
  const sb = getSupabase();
  if (!sb) throw new Error("Облако не настроено");
  const { data, error } = await sb.rpc("exchange_create_listing", {
    p_item_id: itemId,
    p_qty: qty,
    p_price_pollen: pricePollen,
  });
  if (error) throw new Error(error.message);
  return data as string;
}

/** Отменить свою заявку (предмет вернётся в инвентарь). */
export async function cancelListing(listingId: string): Promise<void> {
  const sb = getSupabase();
  if (!sb) throw new Error("Облако не настроено");
  const { error } = await sb.rpc("exchange_cancel_listing", {
    p_listing_id: listingId,
  });
  if (error) throw new Error(error.message);
}

/** Купить чужую заявку (атомарно: -pollen, +item; продавцу +pollen − комиссия). */
export async function buyListing(listingId: string): Promise<BuyResult> {
  const sb = getSupabase();
  if (!sb) throw new Error("Облако не настроено");
  const { data, error } = await sb.rpc("exchange_buy", {
    p_listing_id: listingId,
  });
  if (error) throw new Error(error.message);
  return data as BuyResult;
}

/** Список открытых заявок. Опциональный фильтр по item_id. */
export async function listOpenListings(
  itemIdFilter?: string,
  limit = 100,
): Promise<ExchangeListing[]> {
  const sb = getSupabase();
  if (!sb) throw new Error("Облако не настроено");
  let q = sb
    .from("exchange_listings")
    .select("*")
    .eq("status", "open")
    .order("price_pollen", { ascending: true })
    .limit(limit);
  if (itemIdFilter) q = q.eq("item_id", itemIdFilter);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []) as ExchangeListing[];
}

/** Свои заявки (открытые + закрытые). */
export async function listOwnListings(userId: string): Promise<ExchangeListing[]> {
  const sb = getSupabase();
  if (!sb) throw new Error("Облако не настроено");
  const { data, error } = await sb
    .from("exchange_listings")
    .select("*")
    .eq("seller_id", userId)
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);
  return (data ?? []) as ExchangeListing[];
}
