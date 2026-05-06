import { useState } from "react";
import { useStore } from "../../state/store";
import { PixelButton } from "../shared/PixelButton";
import {
  canClaimDailyReward,
  getCurrentStreakDay,
  previewTodayReward,
} from "../../state/actions/dailyRewardActions";
import { useT } from "../../i18n/useT";

export function DailyRewardPopup() {
  const t = useT();
  const [claimed, setClaimed] = useState(false);

  const dailyReward = useStore((s) => s.dailyReward);
  const seed = useStore((s) => s.seed);
  const claimDailyReward = useStore((s) => s.claimDailyReward);
  const setPanel = useStore((s) => s.setPanel);

  const now = Date.now();
  const fakeState = { dailyReward, seed } as any;
  const canClaim = canClaimDailyReward(fakeState, now);
  const streakDay = getCurrentStreakDay(fakeState, now);
  const today = previewTodayReward(fakeState, now);

  const handleClaim = () => {
    claimDailyReward();
    setClaimed(true);
    setTimeout(() => setPanel(null), 1200);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60"
      onClick={() => setPanel(null)}
    >
      <div
        className="bg-brown-700 border-2 border-black p-4 w-[280px] shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-3">
          <div className="font-game text-[12px] text-yellow-300 mb-1">
            {t("daily.title")}
          </div>
          <div className="font-game text-[8px] text-white/60">
            {t("daily.day_in_row", { n: streakDay })}
          </div>
        </div>

        {canClaim ? (
          <>
            <div className="p-3 bg-brown-800 border border-black/30 mb-3 text-center">
              <div className="font-game text-[7px] text-white/40 mb-1">{t("daily.today")}</div>
              <div className="font-game text-[11px] text-yellow-300">
                +{today.option.label}
              </div>
            </div>
            {!claimed ? (
              <div className="text-center">
                <PixelButton onClick={handleClaim}>{t("daily.claim")}</PixelButton>
              </div>
            ) : (
              <div className="text-center">
                <span className="font-game text-[9px] text-green-400">
                  {t("daily.claimed")}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="text-center font-game text-[9px] text-white/60 py-2 whitespace-pre-line">
            {t("daily.come_back")}
          </div>
        )}
      </div>
    </div>
  );
}
