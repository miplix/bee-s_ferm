import { useState } from "react";
import { sendNear, getAccount } from "../../lib/near/wallet";
import { useStore } from "../../state/store";
import { creditPollen } from "../../state/actions/nearPaymentActions";
import { toast } from "../../state/toastStore";

/** Modal for topping up pollen via NEAR transfer (1 NEAR = 1 pollen). */
export function PollenTopupModal({ onClose }: { onClose: () => void }) {
  const [amount, setAmount] = useState("1");
  const [busy, setBusy] = useState(false);
  const account = getAccount();

  const handleBuy = async () => {
    const n = parseFloat(amount);
    if (!isFinite(n) || n <= 0) { toast("Введи число > 0", "error"); return; }
    if (!account) { toast("Подключи кошелёк", "error"); return; }
    setBusy(true);
    try {
      const txHash = await sendNear(n, "pollen-topup");
      useStore.setState((s) => creditPollen(s as any, n, txHash) as any);
      toast(`+${n} пыльцы (tx ${txHash.slice(0, 8)}…)`, "success");
      onClose();
    } catch (e: any) {
      toast(`Ошибка: ${e.message ?? e}`, "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70" onClick={onClose}>
      <div className="bg-brown-800 border-2 border-yellow-600 p-4 w-[300px]" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-game text-[12px] text-yellow-300 mb-3 text-center">Пополнить пыльцу</h2>
        <div className="font-game text-[8px] text-white/60 mb-2 text-center">
          1 NEAR = 1 пыльца
        </div>
        <input
          type="number"
          min="0.1"
          step="0.1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="NEAR"
          className="w-full px-2 py-2 mb-3 font-game text-[10px] text-black border border-black"
        />
        <div className="flex gap-1 justify-center">
          <button
            onClick={handleBuy}
            disabled={busy}
            className="font-game text-[8px] px-3 py-2 border-2 border-black bg-purple-700 text-yellow-200 hover:bg-purple-600 disabled:opacity-50"
          >
            {busy ? "..." : `Отправить ${amount} NEAR`}
          </button>
          <button onClick={onClose} className="font-game text-[8px] px-2 py-2 border border-black bg-brown-600 text-white">отмена</button>
        </div>
        <div className="font-game text-[6px] text-white/30 text-center mt-3">
          Зачисление 1:1 после подписания. Tx-hash сохраняется (без replay).
        </div>
      </div>
    </div>
  );
}
