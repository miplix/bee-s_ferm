import { useStore } from "../../state/store";
import { PanelShell } from "./PanelShell";
import { PixelButton } from "../shared/PixelButton";
import { CooldownTimer } from "../shared/CooldownTimer";
import { DELIVERY_REFRESH_MS } from "../../data/deliveries.data";

export function DeliveryPanel() {
  const inventory = useStore((s) => s.inventory);
  const deliveries = useStore((s) => s.deliveries);
  const completeDelivery = useStore((s) => s.completeDelivery);
  const refreshDeliveries = useStore((s) => s.refreshDeliveries);

  const now = Date.now();

  // Auto-refresh on panel open
  const needsRefresh =
    deliveries.active.length === 0 ||
    deliveries.active.some((d) => d.expiresAt <= now);

  if (needsRefresh) {
    // Trigger refresh via store action (will be called in next render)
    setTimeout(() => refreshDeliveries(), 0);
  }

  return (
    <PanelShell title="Deliveries">
      {/* Stats */}
      <div className="flex items-center justify-between mb-2 p-2 bg-brown-800 border border-black/30">
        <span className="font-game text-[8px] text-white">
          Completed: {deliveries.completed}
        </span>
        <span className="font-game text-[7px] text-white/50">
          {deliveries.active.length} active
        </span>
      </div>

      {/* Active deliveries */}
      <div className="space-y-2">
        {deliveries.active.length === 0 && (
          <div className="p-3 text-center">
            <span className="font-game text-[8px] text-white/50">
              No deliveries available. Check back later!
            </span>
          </div>
        )}

        {deliveries.active.map((delivery) => {
          // Check if player has all required items
          const canComplete = delivery.request.every(
            (req) => (inventory[req.itemId] ?? 0) >= req.qty,
          );
          const isExpired = delivery.expiresAt <= now;

          return (
            <div
              key={delivery.id}
              className={`p-2 border border-black/20 ${
                isExpired ? "bg-brown-600/40 opacity-60" : "bg-brown-600"
              }`}
            >
              {/* NPC header */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg">{delivery.npcEmoji}</span>
                <div className="flex-1">
                  <div className="font-game text-[8px] text-yellow-300">
                    {delivery.npcName}
                  </div>
                  {!isExpired && (
                    <div className="font-game text-[6px] text-white/40">
                      <CooldownTimer
                        lastAt={delivery.expiresAt - DELIVERY_REFRESH_MS}
                        cooldownMs={DELIVERY_REFRESH_MS}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Requested items */}
              <div className="space-y-0.5 mb-1.5">
                <span className="font-game text-[7px] text-white/60">Needs:</span>
                {delivery.request.map((req, i) => {
                  const have = inventory[req.itemId] ?? 0;
                  const enough = have >= req.qty;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-1 pl-2"
                    >
                      <span
                        className={`font-game text-[7px] ${
                          enough ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {req.itemId} ({have}/{req.qty})
                      </span>
                      {enough && <span className="text-[8px]">&#x2705;</span>}
                    </div>
                  );
                })}
              </div>

              {/* Rewards */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-game text-[6px] text-white/60">Reward:</span>
                {delivery.reward.coins > 0 && (
                  <span className="font-game text-[7px] text-yellow-300">
                    {delivery.reward.coins}c
                  </span>
                )}
                {delivery.reward.xp > 0 && (
                  <span className="font-game text-[7px] text-blue-300">
                    +{delivery.reward.xp} XP
                  </span>
                )}
                {delivery.reward.tickets > 0 && (
                  <span className="font-game text-[7px] text-purple-300">
                    +{delivery.reward.tickets} tix
                  </span>
                )}
              </div>

              {/* Complete button */}
              <PixelButton
                disabled={!canComplete || isExpired}
                onClick={() => completeDelivery(delivery.id)}
              >
                {isExpired ? "Expired" : canComplete ? "Deliver!" : "Need items"}
              </PixelButton>
            </div>
          );
        })}
      </div>
    </PanelShell>
  );
}
