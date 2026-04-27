import { useState, useEffect } from "react";
import { useStore } from "../../state/store";
import {
  canClaimDailyReward,
  getCurrentStreakDay,
  getDailyMenu,
} from "../../state/actions/dailyRewardActions";

export function DailyRewardPopup() {
  const [visible, setVisible] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const dailyReward = useStore((s) => s.dailyReward);
  const claimDailyReward = useStore((s) => s.claimDailyReward);

  const now = Date.now();
  const fakeState = { dailyReward } as any;
  const canClaim = canClaimDailyReward(fakeState, now);
  const streakDay = getCurrentStreakDay(fakeState, now);
  const opts = getDailyMenu(fakeState, now);

  useEffect(() => {
    if (canClaim && !claimed) {
      const t = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(t);
    }
  }, [canClaim, claimed]);

  if (!visible) return null;

  const handleClaim = (idx: number) => {
    claimDailyReward(idx);
    setClaimed(true);
    setTimeout(() => setVisible(false), 1500);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60"
      onClick={() => setVisible(false)}
    >
      <div
        className="bg-brown-700 border-2 border-black p-4 w-[320px] max-h-[88vh] overflow-y-auto shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-3">
          <div className="font-game text-[12px] text-yellow-300 mb-1">
            Ежедневный бонус!
          </div>
          <div className="font-game text-[8px] text-white/60">
            День {streakDay} подряд · выбери один
          </div>
          {streakDay < 7 && (
            <div className="font-game text-[7px] text-white/40 mt-1">
              Инструменты откроются с 7-го дня
            </div>
          )}
        </div>

        {!claimed ? (
          <div className="grid gap-1">
            {opts.map((o, i) => (
              <button
                key={i}
                onClick={() => handleClaim(i)}
                className="font-game text-[8px] px-3 py-2 border-2 border-black bg-brown-600 text-yellow-200 hover:bg-brown-500 active:bg-brown-700 text-left"
              >
                +{o.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <span className="font-game text-[9px] text-green-400">
              Получено! Возвращайся завтра.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
