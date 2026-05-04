import { useEffect, useState } from "react";
import { connectNear, getAccount, onAccount } from "../../lib/near/wallet";

/**
 * Полноэкранный gate — пока NEAR-кошелёк не подключён, игра скрыта.
 * Показывает приветствие + единственную кнопку «Подключить кошелёк».
 */
export function LoginGate({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState(getAccount());
  const [busy, setBusy] = useState(false);

  useEffect(() => onAccount(setAccount), []);

  if (account) return <>{children}</>;

  const handleConnect = async () => {
    setBusy(true);
    try { await connectNear(); }
    finally { setBusy(false); }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(180deg, #6dc3e0 0%, #4ea7d4 60%, #3a8bbf 100%)",
      }}
    >
      <div className="bg-brown-800 border-4 border-yellow-600 p-6 max-w-[420px] w-[90%] shadow-2xl">
        <div className="text-center mb-4">
          <div className="text-5xl mb-2">🐝</div>
          <h1 className="font-game text-[14px] text-yellow-300 mb-2">
            Пчело-ферма
          </h1>
          <div className="font-game text-[8px] text-white/70">
            Чтобы играть — подключи NEAR-кошелёк
          </div>
        </div>

        <div className="bg-brown-900/60 border border-black/50 p-3 mb-4 font-game text-[7px] text-white/60 leading-relaxed">
          • Прогресс сохраняется в облаке<br />
          • Один кошелёк = один сейв на всех устройствах<br />
          • Поддержка HOT Wallet, MyNearWallet, Sender и др.<br />
          • Mainnet, без комиссий за подключение
        </div>

        <button
          onClick={handleConnect}
          disabled={busy}
          className="w-full font-game text-[10px] px-4 py-3 border-2 border-black bg-purple-700 text-yellow-200 hover:bg-purple-600 active:bg-purple-800 disabled:opacity-60"
        >
          {busy ? "..." : "🦊 Подключить NEAR"}
        </button>

        <div className="font-game text-[6px] text-white/30 text-center mt-3">
          Нет кошелька? Скачай <span className="underline">HOT Wallet</span> в App Store / Google Play
        </div>
      </div>
    </div>
  );
}
