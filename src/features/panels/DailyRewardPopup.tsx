import { useState, useEffect } from "react";
import { useStore } from "../../state/store";
import { PixelButton } from "../shared/PixelButton";
import { DAILY_REWARDS, MAX_STREAK } from "../../data/dailyRewards.data";
import {
  canClaimDailyReward,
  getCurrentRewardDay,
} from "../../state/actions/dailyRewardActions";

export function DailyRewardPopup() {
  const [visible, setVisible] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const dailyReward = useStore((s) => s.dailyReward);
  const claimDailyReward = useStore((s) => s.claimDailyReward);

  const now = Date.now();
  const canClaim = canClaimDailyReward(
    { dailyReward } as any,
    now,
  );
  const rewardDay = getCurrentRewardDay(
    { dailyReward } as any,
    now,
  );

  // Show popup on mount if unclaimed
  useEffect(() => {
    if (canClaim && !claimed) {
      // Small delay so it feels like the game loaded first
      const t = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(t);
    }
  }, [canClaim, claimed]);

  if (!visible) return null;

  const rewardDef = DAILY_REWARDS.find((r) => r.day === rewardDay);
  if (!rewardDef) return null;

  const handleClaim = () => {
    claimDailyReward();
    setClaimed(true);
    setTimeout(() => setVisible(false), 1200);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60"
      onClick={() => setVisible(false)}
    >
      <div
        className="bg-brown-700 border-2 border-black p-4 w-[280px] shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <div className="text-center mb-3">
          <div className="font-game text-[12px] text-yellow-300 mb-1">
            Daily Reward!
          </div>
          <div className="font-game text-[8px] text-white/60">
            {rewardDef.label}
          </div>
        </div>

        {/* Streak display */}
        <div className="flex justify-center gap-1 mb-3">
          {DAILY_REWARDS.map((r) => {
            const isPast = dailyReward.streak >= r.day && !canClaim;
            const isCurrent = r.day === rewardDay;
            return (
              <div
                key={r.day}
                className={`w-7 h-7 flex items-center justify-center border text-[10px] font-game
                  ${isCurrent
                    ? "border-yellow-400 bg-yellow-600/40 text-yellow-300"
                    : isPast
                      ? "border-green-500/40 bg-green-900/30 text-green-400"
                      : "border-black/30 bg-brown-600/40 text-white/30"
                  }`}
              >
                {isPast ? "\u2713" : r.day}
              </div>
            );
          })}
        </div>

        {/* Reward preview */}
        <div className="p-2 bg-brown-800 border border-black/30 mb-3 text-center">
          {rewardDef.coins > 0 && (
            <div className="font-game text-[9px] text-yellow-300">
              +{rewardDef.coins} coins
            </div>
          )}
          {rewardDef.items.map((item, i) => (
            <div key={i} className="font-game text-[8px] text-white">
              +{item.qty} {item.itemId.replace(/_/g, " ")}
            </div>
          ))}
        </div>

        {/* Claim / Close */}
        {!claimed ? (
          <div className="text-center">
            <PixelButton onClick={handleClaim}>
              Claim!
            </PixelButton>
          </div>
        ) : (
          <div className="text-center">
            <span className="font-game text-[9px] text-green-400">
              Claimed! Enjoy your rewards.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
