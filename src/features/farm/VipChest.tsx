import { useState } from "react";
import { useStore } from "../../state/store";
import { canClaimVipChest, isVipActiveNow, previewVipChest } from "../../state/actions/vipChestActions";
import { useT } from "../../i18n/useT";

/** VIP chest — visible only while VIP active. Daily claim with 2-3x rewards + rare pollen. */
export function VipChest() {
  const t = useT();
  const seed = useStore((s) => s.seed);
  const dailyReward = useStore((s) => s.dailyReward);
  const vipExpiresAt = useStore((s) => s.vipExpiresAt);
  const vipChest = useStore((s) => s.vipChest);
  const claim = useStore((s) => s.claimVipChest);
  const [open, setOpen] = useState(false);

  const now = Date.now();
  const fakeState = { vipExpiresAt, vipChest, dailyReward, seed } as any;
  if (!isVipActiveNow(fakeState, now)) return null;
  const canClaim = canClaimVipChest(fakeState, now);
  const today = previewVipChest(fakeState, now);

  return (
    <>
      <div
        className="absolute pointer-events-auto"
        style={{ bottom: 16, right: 92, zIndex: 30 }}
      >
        <button
          onClick={() => setOpen(true)}
          className={`relative ${canClaim ? "cursor-pointer hover:scale-110 active:scale-95 animate-pulse" : "cursor-default opacity-70"} transition-transform`}
          style={{ width: 64, height: 64 }}
          title={canClaim ? t("vip.chest.btn_title_claim") : t("vip.chest.btn_title_done")}
        >
          <img
            src={canClaim ? "/chest/chest_closed.png" : "/chest/chest_open.png"}
            alt="VIP chest"
            className="w-full h-full object-contain pointer-events-none"
            style={{ filter: "hue-rotate(280deg) saturate(1.4) brightness(1.1)" }}
          />
          <span className="absolute -bottom-1 left-0 right-0 text-center font-game text-[6px] text-purple-200 bg-black/60 border border-purple-500">
            VIP
          </span>
          {canClaim && <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[8px] font-game px-1 py-0.5 border border-black rounded-full">!</span>}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60" onClick={() => setOpen(false)}>
          <div className="bg-purple-900 border-2 border-yellow-400 p-4 w-[300px]" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-game text-[12px] text-yellow-300 mb-1 text-center">{t("vip.chest.title")}</h2>
            <div className="font-game text-[7px] text-purple-200 text-center mb-3">
              {t("vip.chest.subtitle")}
            </div>
            {canClaim ? (
              <>
                <div className="bg-purple-950 border border-yellow-500/30 p-3 mb-3 text-center">
                  <div className="font-game text-[7px] text-purple-300 mb-1">{t("vip.chest.today")}</div>
                  <div className="font-game text-[11px] text-yellow-300">+{today.option.label(today.qty)}</div>
                </div>
                <div className="text-center">
                  <button
                    onClick={() => { claim(); setTimeout(() => setOpen(false), 1000); }}
                    className="font-game text-[10px] px-4 py-2 border-2 border-black bg-yellow-600 text-purple-900 hover:bg-yellow-500"
                  >
                    {t("vip.chest.claim")}
                  </button>
                </div>
              </>
            ) : (
              <div className="font-game text-[9px] text-purple-200 text-center py-3 whitespace-pre-line">
                {t("vip.chest.empty")}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
