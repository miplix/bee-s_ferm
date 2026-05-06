import { useState } from "react";
import { sendNear, getAccount } from "../../lib/near/wallet";
import { useStore } from "../../state/store";
import { activateVip, VIP_PRICE_NEAR_PER_MONTH } from "../../state/actions/nearPaymentActions";
import { toast } from "../../state/toastStore";
import { useT } from "../../i18n/useT";

const TIERS = [
  { months: 1,  key: "vip.tier.1",  discount: 1 },
  { months: 3,  key: "vip.tier.3",  discount: 0.9 },
  { months: 12, key: "vip.tier.12", discount: 0.8 },
];

export function VipPurchaseModal({ onClose }: { onClose: () => void }) {
  const t = useT();
  const [busy, setBusy] = useState(false);
  const vipExpiresAt = useStore((s) => s.vipExpiresAt);
  const now = Date.now();
  const isActive = !!vipExpiresAt && vipExpiresAt > now;

  const handleBuy = async (months: number, discount = 1) => {
    const acc = getAccount();
    if (!acc) { toast(t("toast.wallet_required"), "error"); return; }
    const price = VIP_PRICE_NEAR_PER_MONTH * months * discount;
    setBusy(true);
    try {
      const txHash = await sendNear(price, `vip-${months}m`);
      useStore.setState((s) => activateVip(s as any, months, txHash, Date.now()) as any);
      toast(t("vip.tier.activated", { n: months }), "success");
      onClose();
    } catch (e: any) {
      toast(t("topup.error.send", { msg: e.message ?? String(e) }), "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70" onClick={onClose}>
      <div className="bg-brown-800 border-2 border-yellow-600 p-4 w-[340px]" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-game text-[12px] text-yellow-300 mb-1 text-center">{t("vip.modal.title")}</h2>
        <div className="font-game text-[7px] text-white/60 mb-3 text-center whitespace-pre-line">
          {t("vip.modal.descr")}
        </div>

        {isActive && (
          <div className="bg-green-900/40 border border-green-700/50 p-2 mb-3 font-game text-[8px] text-green-300 text-center">
            {t("vip.modal.active", { date: new Date(vipExpiresAt!).toLocaleString() })}
          </div>
        )}

        <div className="space-y-1 mb-3">
          {TIERS.map(({ months, key, discount }) => {
            const price = (VIP_PRICE_NEAR_PER_MONTH * months * discount).toFixed(2);
            return (
              <button
                key={months}
                onClick={() => handleBuy(months, discount)}
                disabled={busy}
                className="w-full flex justify-between items-center font-game text-[8px] px-3 py-2 border border-black bg-purple-700 text-yellow-200 hover:bg-purple-600 disabled:opacity-50"
              >
                <span>{t(key)}</span>
                <span className="text-white">{price} NEAR</span>
              </button>
            );
          })}
        </div>

        <button onClick={onClose} className="w-full font-game text-[7px] px-2 py-1 border border-black bg-brown-600 text-white">
          {t("vip.modal.close")}
        </button>
      </div>
    </div>
  );
}
