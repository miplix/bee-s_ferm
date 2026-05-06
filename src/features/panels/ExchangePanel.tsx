import { useState, useEffect, useCallback } from "react";
import { useStore } from "../../state/store";
import { PanelShell } from "./PanelShell";
import { PixelButton } from "../shared/PixelButton";
import {
  createListing as rpcCreate,
  cancelListing as rpcCancel,
  buyListing as rpcBuy,
  listOpenListings,
  listOwnListings,
  type ExchangeListing,
} from "../../lib/supabase/exchange";
import { getSupabase } from "../../lib/supabase/client";
import { pullSave } from "../../lib/supabase/sync";
import { toast } from "../../state/toastStore";
import { isMutantId, getMutantName } from "../../domain/mutants/mutants";

type Tab = "buy" | "sell" | "own";

/**
 * Биржа — P2P-торговля за пыльцу.
 * Тарифы: VIP 3% / без VIP 5%.
 * Min price: 10 пыльцы за единицу. Max qty: 10000.
 * Атомарность гарантируется RPC-функциями exchange_create_listing/cancel/buy.
 */
export function ExchangePanel() {
  const [tab, setTab] = useState<Tab>("buy");
  const inventory = useStore((s) => s.inventory);
  const vipExpiresAt = useStore((s) => s.vipExpiresAt);
  const isVip = !!(vipExpiresAt && vipExpiresAt > Date.now());

  return (
    <PanelShell title="🏛 Биржа">
      <p className="font-game text-[6px] text-white/50 mb-2 leading-relaxed">
        Торговля за пыльцу. Комиссия покупателя: {isVip ? <span className="text-yellow-300">3% (VIP)</span> : "5%"}.
        Min цена: 10 пыльцы за единицу. Max qty: 10 000.
      </p>

      {/* Tabs */}
      <div className="flex gap-1 mb-3 border-b border-black/40 pb-2">
        {(["buy", "sell", "own"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`font-game text-[7px] px-2 py-1 border border-black/40
              ${tab === t ? "bg-brown-400 text-white" : "bg-brown-600 text-white/60"}`}>
            {t === "buy" ? "Купить" : t === "sell" ? "Продать" : "Мои заявки"}
          </button>
        ))}
      </div>

      {tab === "buy"  && <BuyTab />}
      {tab === "sell" && <SellTab inventory={inventory} />}
      {tab === "own"  && <OwnTab />}
    </PanelShell>
  );
}

// ─── Купить ───────────────────────────────────────────────────────────────

function BuyTab() {
  const [listings, setListings] = useState<ExchangeListing[] | null>(null);
  const [filter, setFilter] = useState<string>("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setListings(null);
    try {
      const data = await listOpenListings(filter || undefined);
      setListings(data);
    } catch (e: any) {
      toast(`Ошибка загрузки: ${e.message}`, "error");
      setListings([]);
    }
  }, [filter]);

  useEffect(() => { refresh(); }, [refresh]);

  // Группируем по item_id (всё разделено по точному ресурсу — дрова к дровам и т.д.)
  const grouped: Record<string, ExchangeListing[]> = {};
  for (const l of listings ?? []) {
    (grouped[l.item_id] ??= []).push(l);
  }

  const handleBuy = async (l: ExchangeListing) => {
    if (!confirm(`Купить ${l.qty}× ${formatItem(l.item_id)} за ${(l.qty * l.price_pollen).toFixed(2)} 🌼?`)) return;
    setBusyId(l.id);
    try {
      const r = await rpcBuy(l.id);
      toast(`Куплено: ${r.qty}× ${formatItem(r.item_id)}, списано ${r.paid.toFixed(2)} 🌼`, "success");
      // Pull обновлённый save из облака → локальный state
      await syncFromCloud();
      await refresh();
    } catch (e: any) {
      toast(`Ошибка: ${e.message}`, "error");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-1 items-center">
        <input
          type="text" placeholder="Фильтр (item_id)" value={filter}
          onChange={(e) => setFilter(e.target.value.trim())}
          className="flex-1 font-game text-[8px] text-black px-2 py-1 border border-black"
        />
        <PixelButton variant="secondary" onClick={refresh}>↻</PixelButton>
      </div>

      {listings === null && <p className="font-game text-[7px] text-white/50">Загружаю…</p>}
      {listings && listings.length === 0 && (
        <p className="font-game text-[7px] text-white/50">Заявок нет</p>
      )}

      {Object.entries(grouped).map(([itemId, group]) => (
        <div key={itemId}>
          <h4 className="font-game text-[7px] text-yellow-300 mb-1">
            {formatItem(itemId)} ({group.length})
          </h4>
          <div className="space-y-0.5">
            {group.map((l) => (
              <div key={l.id} className="flex items-center gap-2 bg-brown-600 p-1 border border-black/20">
                <span className="font-game text-[7px] text-white flex-1">
                  {l.qty.toFixed(2)} шт. × {l.price_pollen.toFixed(2)} 🌼
                </span>
                <span className="font-game text-[7px] text-yellow-300 w-16 text-right">
                  = {(l.qty * l.price_pollen).toFixed(2)}
                </span>
                <PixelButton variant="primary"
                             onClick={() => handleBuy(l)}>
                  {busyId === l.id ? "..." : "Купить"}
                </PixelButton>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Продать ──────────────────────────────────────────────────────────────

function SellTab({ inventory }: { inventory: Record<string, number> }) {
  // Только предметы из инвентаря с qty>0; исключаем семена/инструменты/удобрения/блюда
  const tradeableEntries = Object.entries(inventory)
    .filter(([id, qty]) => qty > 0 && isTradeableForExchange(id))
    .sort(([a], [b]) => a.localeCompare(b));

  const [itemId, setItemId] = useState(tradeableEntries[0]?.[0] ?? "");
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(10);
  const [busy, setBusy] = useState(false);

  const owned = inventory[itemId] ?? 0;
  const canList = owned >= qty && qty >= 1 && qty <= 10000 && price >= 10;

  const handleSubmit = async () => {
    if (!canList) return;
    setBusy(true);
    try {
      await rpcCreate(itemId, qty, price);
      toast(`Заявка создана: ${qty}× ${formatItem(itemId)} по ${price.toFixed(2)} 🌼`, "success");
      // Sync inventory локально (item списан со save в облаке)
      await syncFromCloud();
      setQty(1);
      setPrice(10);
    } catch (e: any) {
      toast(`Ошибка: ${e.message}`, "error");
    } finally {
      setBusy(false);
    }
  };

  if (tradeableEntries.length === 0) {
    return <p className="font-game text-[7px] text-white/50">Нет предметов для продажи</p>;
  }

  return (
    <div className="space-y-2">
      <label className="font-game text-[7px] text-white/70 block">Предмет:</label>
      <select value={itemId} onChange={(e) => setItemId(e.target.value)}
        className="w-full font-game text-[8px] text-black px-2 py-1 border border-black">
        {tradeableEntries.map(([id, q]) => (
          <option key={id} value={id}>
            {formatItem(id)} (есть {q.toFixed(2)})
          </option>
        ))}
      </select>

      <label className="font-game text-[7px] text-white/70 block">
        Количество (макс {Math.min(owned, 10000)}):
      </label>
      <input type="number" min={1} max={Math.min(owned, 10000)} value={qty}
        onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
        className="w-full font-game text-[8px] text-black px-2 py-1 border border-black" />

      <label className="font-game text-[7px] text-white/70 block">Цена за единицу (мин 10 🌼):</label>
      <input type="number" min={10} step={1} value={price}
        onChange={(e) => setPrice(Math.max(10, parseFloat(e.target.value) || 10))}
        className="w-full font-game text-[8px] text-black px-2 py-1 border border-black" />

      <div className="font-game text-[7px] text-white/70">
        Итого: <span className="text-yellow-300">{(qty * price).toFixed(2)} 🌼</span>
      </div>

      <PixelButton variant="primary" onClick={handleSubmit} disabled={!canList || busy}>
        {busy ? "..." : "Выставить заявку"}
      </PixelButton>
    </div>
  );
}

// ─── Мои заявки ───────────────────────────────────────────────────────────

function OwnTab() {
  const [listings, setListings] = useState<ExchangeListing[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setListings(null);
    try {
      const sb = getSupabase();
      if (!sb) { setListings([]); return; }
      const { data: { user } } = await sb.auth.getUser();
      if (!user) { setListings([]); return; }
      const data = await listOwnListings(user.id);
      setListings(data);
    } catch (e: any) {
      toast(`Ошибка: ${e.message}`, "error");
      setListings([]);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const handleCancel = async (id: string) => {
    if (!confirm("Отменить заявку? Предмет вернётся в инвентарь.")) return;
    setBusyId(id);
    try {
      await rpcCancel(id);
      toast("Заявка отменена", "success");
      await syncFromCloud();
      await refresh();
    } catch (e: any) {
      toast(`Ошибка: ${e.message}`, "error");
    } finally {
      setBusyId(null);
    }
  };

  if (listings === null) return <p className="font-game text-[7px] text-white/50">Загружаю…</p>;
  if (listings.length === 0) return <p className="font-game text-[7px] text-white/50">Заявок нет</p>;

  return (
    <div className="space-y-1">
      {listings.map((l) => (
        <div key={l.id} className="flex items-center gap-2 bg-brown-600 p-1 border border-black/20">
          <span className="font-game text-[7px] flex-1 truncate">
            {formatItem(l.item_id)}: {l.qty.toFixed(2)} × {l.price_pollen.toFixed(2)} 🌼
          </span>
          <span className={`font-game text-[6px] ${l.status === "open" ? "text-green-300" : l.status === "sold" ? "text-yellow-300" : "text-white/40"}`}>
            {l.status === "open" ? "открыта" : l.status === "sold" ? "продана" : "отменена"}
          </span>
          {l.status === "open" && (
            <PixelButton variant="danger" onClick={() => handleCancel(l.id)}>
              {busyId === l.id ? "..." : "✕"}
            </PixelButton>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── helpers ──────────────────────────────────────────────────────────────

/** Допустимые на бирже предметы — крафт/инструменты/семена/удобрения исключены. */
function isTradeableForExchange(id: string): boolean {
  if (id.endsWith("_seed")) return false;
  if (id.startsWith("meal_")) return false;
  if (["axe", "stone_pickaxe", "iron_pickaxe", "gold_pickaxe", "fishing_rod"].includes(id)) return false;
  if (["sprout_mix", "fruitful_blend", "rapid_root"].includes(id)) return false;
  return true; // ресурсы, урожай, фрукты, мутанты — можно
}

function formatItem(id: string): string {
  if (isMutantId(id)) return getMutantName(id);
  return id;
}

/** После успешной операции на бирже подтянуть свежий save из облака в локальный store. */
async function syncFromCloud() {
  try {
    const cloud = await pullSave();
    if (!cloud) return;
    useStore.setState(cloud.state as any);
  } catch {
    // молча — пользователь увидит обновление при следующем pull
  }
}
