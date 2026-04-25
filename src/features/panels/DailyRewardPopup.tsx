import { useState, useEffect } from "react";
import { useStore } from "../../state/store";
import { PixelButton } from "../shared/PixelButton";
import {
  canClaimDailyReward,
  previewWeeklyBonus,
} from "../../state/actions/dailyRewardActions";

export function DailyRewardPopup() {
  const [visible, setVisible] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const dailyReward = useStore((s) => s.dailyReward);
  const xp = useStore((s) => s.xp);
  const claimDailyReward = useStore((s) => s.claimDailyReward);

  const now = Date.now();
  const fakeState = { dailyReward, xp } as any;
  const canClaim = canClaimDailyReward(fakeState, now);
  const bonus = previewWeeklyBonus(fakeState, now);

  useEffect(() => {
    if (canClaim && !claimed) {
      const t = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(t);
    }
  }, [canClaim, claimed]);

  if (!visible) return null;

  const handleClaim = () => {
    claimDailyReward();
    setClaimed(true);
    setTimeout(() => setVisible(false), 1500);
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
        <div className="text-center mb-3">
          <div className="font-game text-[12px] text-yellow-300 mb-1">
            Еженедельный бонус!
          </div>
          <div className="font-game text-[8px] text-white/60">
            Заходи раз в неделю — получай награду
          </div>
        </div>

        <div className="p-3 bg-brown-800 border border-black/30 mb-3 text-center">
          <div className="font-game text-[11px] text-yellow-300 mb-1">
            +{bonus.coins} монет
          </div>
          {bonus.itemId && (
            <div className="font-game text-[9px] text-white">
              +{bonus.itemQty} {bonus.itemId.replace(/_/g, " ")}
            </div>
          )}
        </div>

        {!claimed ? (
          <div className="text-center">
            <PixelButton onClick={handleClaim}>Забрать!</PixelButton>
          </div>
        ) : (
          <div className="text-center">
            <span className="font-game text-[9px] text-green-400">
              Получено! Возвращайся через неделю.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
