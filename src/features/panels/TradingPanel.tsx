import { useState } from "react";
import { useStore } from "../../state/store";
import { PanelShell } from "./PanelShell";
import { PixelButton } from "../shared/PixelButton";
import { TRADEABLE_ITEMS, MARKETPLACE_TAX } from "../../data/trading.data";

type Tab = "create" | "listings" | "marketplace";

export function TradingPanel() {
  const [tab, setTab] = useState<Tab>("create");
  const [selectedItem, setSelectedItem] = useState(TRADEABLE_ITEMS[0]);
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(1);

  const inventory = useStore((s) => s.inventory);
  const tradeListings = useStore((s) => s.tradeListings);
  const createListing = useStore((s) => s.createListing);
  const cancelListing = useStore((s) => s.cancelListing);

  const handleCreate = () => {
    createListing(selectedItem, qty, price);
    setQty(1);
    setPrice(1);
  };

  const ownedQty = inventory[selectedItem] ?? 0;
  const canCreate = ownedQty >= qty && qty >= 1 && price > 0;

  return (
    <PanelShell title="Trading">
      {/* Tabs */}
      <div className="flex gap-1 mb-3">
        {(["create", "listings", "marketplace"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`font-game text-[8px] px-3 py-1 border border-black/30
              ${tab === t ? "bg-brown-400 text-white" : "bg-brown-600 text-white/60"}`}>
            {t === "create" ? "Create Listing" : t === "listings" ? "My Listings" : "Marketplace"}
          </button>
        ))}
      </div>

      {tab === "create" && (
        <div className="space-y-2">
          {/* Item select */}
          <div>
            <label className="font-game text-[7px] text-yellow-300 block mb-1">Item</label>
            <select value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              className="w-full bg-brown-700 text-white font-game text-[8px] p-1 border border-black/30">
              {TRADEABLE_ITEMS.map((item) => (
                <option key={item} value={item}>
                  {item} (owned: {inventory[item] ?? 0})
                </option>
              ))}
            </select>
          </div>

          {/* Qty input */}
          <div>
            <label className="font-game text-[7px] text-yellow-300 block mb-1">
              Quantity (owned: {ownedQty})
            </label>
            <input type="number" min={1} max={ownedQty} value={qty}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-brown-700 text-white font-game text-[8px] p-1 border border-black/30" />
          </div>

          {/* Price input */}
          <div>
            <label className="font-game text-[7px] text-yellow-300 block mb-1">
              Price per unit (coins)
            </label>
            <input type="number" min={0.01} step={0.01} value={price}
              onChange={(e) => setPrice(Math.max(0.01, parseFloat(e.target.value) || 0.01))}
              className="w-full bg-brown-700 text-white font-game text-[8px] p-1 border border-black/30" />
          </div>

          {/* Summary */}
          <div className="p-2 bg-brown-800 border border-black/30">
            <div className="font-game text-[7px] text-white/70">
              Total: {(qty * price).toFixed(2)} coins
            </div>
            <div className="font-game text-[6px] text-white/50">
              Tax ({(MARKETPLACE_TAX * 100).toFixed(0)}%): -{(qty * price * MARKETPLACE_TAX).toFixed(2)} coins
            </div>
          </div>

          <PixelButton disabled={!canCreate} onClick={handleCreate}>
            List for Sale
          </PixelButton>
        </div>
      )}

      {tab === "listings" && (
        <div className="space-y-1">
          {tradeListings.length === 0 && (
            <div className="p-3 text-center">
              <span className="font-game text-[8px] text-white/50">No active listings</span>
            </div>
          )}
          {tradeListings.map((listing) => (
            <div key={listing.id}
              className="flex items-center gap-2 p-1.5 border border-black/20 bg-brown-600">
              <div className="flex-1 min-w-0">
                <div className="font-game text-[7px] text-white truncate">
                  {listing.itemId} x{listing.qty}
                </div>
                <div className="font-game text-[6px] text-yellow-300">
                  {listing.pricePerUnit.toFixed(2)}c each | Total: {(listing.qty * listing.pricePerUnit).toFixed(2)}c
                </div>
              </div>
              <PixelButton variant="danger"
                onClick={() => cancelListing(listing.id)}>
                Cancel
              </PixelButton>
            </div>
          ))}
        </div>
      )}

      {tab === "marketplace" && (
        <div className="p-4 text-center">
          <div className="font-game text-[9px] text-white/60 mb-2">
            Coming soon
          </div>
          <div className="font-game text-[7px] text-white/40">
            Buying from other players requires a multiplayer backend.
            For now, you can create listings and manage them locally.
          </div>
        </div>
      )}
    </PanelShell>
  );
}
