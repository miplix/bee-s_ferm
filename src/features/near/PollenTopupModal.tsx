import { useState } from "react";
import { sendPollenToken, getAccount, POLLEN_TOKEN_CONTRACT, POLLEN_RECIPIENT } from "../../lib/near/wallet";
import { useStore } from "../../state/store";
import { creditPollen } from "../../state/actions/nearPaymentActions";
import { toast } from "../../state/toastStore";

/** Modal: send pollen.tkn.near FT to recipient → credit pollen 1:1 in game. */
export function PollenTopupModal({ onClose }: { onClose: () => void }) {
  const [amount, setAmount] = useState("100");
  // Token has decimals=0 → only whole numbers
  const [busy, setBusy] = useState(false);
  const [lastTx, setLastTx] = useState<string | null>(null);
  const account = getAccount();
  const currentPollen = useStore((s) => s.pollen ?? 0);

  const handleSend = async () => {
    const n = parseInt(amount, 10);
    if (!isFinite(n) || n <= 0) { toast("Введи целое число > 0", "error"); return; }
    if (!account) { toast("Подключи кошелёк", "error"); return; }
    setBusy(true);
    try {
      const txHash = await sendPollenToken(n);
      useStore.setState((s) => creditPollen(s as any, n, txHash) as any);
      setLastTx(txHash);
      toast(`+${n} 🌼 пыльцы зачислено`, "success");
    } catch (e: any) {
      toast(`Ошибка: ${e.message ?? e}`, "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70" onClick={onClose}>
      <div className="bg-brown-800 border-2 border-yellow-600 p-4 w-[320px]" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-game text-[12px] text-yellow-300 mb-3 text-center">🌼 Пополнить пыльцу</h2>

        <div className="bg-brown-900/60 border border-black/30 p-2 mb-3 text-center">
          <div className="font-game text-[8px] text-white/80">Сейчас в игре</div>
          <div className="font-game text-[14px] text-yellow-300">🌼 {currentPollen.toFixed(1)}</div>
        </div>

        <div className="font-game text-[7px] text-white/60 mb-2 leading-relaxed">
          Токен: <span className="text-yellow-200">{POLLEN_TOKEN_CONTRACT}</span><br/>
          Получатель: <span className="text-yellow-200">{POLLEN_RECIPIENT}</span><br/>
          Курс 1:1 — сколько токенов отправишь, столько пыльцы зачислится.
        </div>

        <input
          type="number"
          min="1"
          step="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Кол-во пыльцы"
          className="w-full px-2 py-2 mb-3 font-game text-[10px] text-black border border-black"
        />

        <div className="flex gap-1 justify-center mb-2">
          <button
            onClick={handleSend}
            disabled={busy}
            className="font-game text-[8px] px-3 py-2 border-2 border-black bg-purple-700 text-yellow-200 hover:bg-purple-600 disabled:opacity-50"
          >
            {busy ? "..." : `Отправить ${amount} 🌼`}
          </button>
          <button onClick={onClose} className="font-game text-[8px] px-2 py-2 border border-black bg-brown-600 text-white">отмена</button>
        </div>

        {lastTx && (
          <div className="font-game text-[6px] text-green-300 text-center mt-2">
            ✓ Tx: <a
              href={`https://nearblocks.io/txns/${lastTx}`}
              target="_blank" rel="noopener noreferrer"
              className="underline"
            >{lastTx.slice(0, 10)}…{lastTx.slice(-6)}</a>
          </div>
        )}
      </div>
    </div>
  );
}
