import { useStore } from "../../state/store";
import { canClaimDailyReward } from "../../state/actions/dailyRewardActions";

/** Floating daily chest on the farm. Click opens the daily reward popup. */
export function DailyChest() {
  const dailyReward = useStore((s) => s.dailyReward);
  const setPanel = useStore((s) => s.setPanel);

  const now = Date.now();
  const canClaim = canClaimDailyReward({ dailyReward } as any, now);

  const src = canClaim ? "/chest/chest_closed.png" : "/chest/chest_open.png";

  return (
    <div
      className="absolute pointer-events-auto"
      style={{
        bottom: "16px",
        right: "12px",
        zIndex: 30,
      }}
    >
      <button
        onClick={() => canClaim && setPanel("daily_reward" as any)}
        className={`relative ${canClaim ? "cursor-pointer hover:scale-110 active:scale-95 animate-pulse" : "cursor-default opacity-70"} transition-transform`}
        style={{ width: 64, height: 64 }}
        title={canClaim ? "Ежедневный бонус" : "Уже забрано — приходи завтра"}
      >
        <img
          src={src}
          alt={canClaim ? "Сундук закрытый" : "Сундук открытый"}
          className="w-full h-full object-contain pointer-events-none"
        />
        {canClaim && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] font-game px-1 py-0.5 border border-black rounded-full">
            !
          </span>
        )}
      </button>
    </div>
  );
}
