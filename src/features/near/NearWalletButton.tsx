import { useEffect, useState } from "react";
import { connectNear, disconnectNear, getAccount, onAccount } from "../../lib/near/wallet";
import { useStore } from "../../state/store";

/** NEAR wallet button. Положение совмещено с другими top-right кнопками. */
export function NearWalletButton() {
  const [account, setAccount] = useState(getAccount());
  const setNearAccount = (id: string | null) => useStore.setState({ nearAccount: id } as any);

  useEffect(() => {
    const off = onAccount((a) => {
      setAccount(a);
      setNearAccount(a?.id ?? null);
    });
    return off;
  }, []);

  return account ? (
    <button
      onClick={() => disconnectNear()}
      className="font-game text-[7px] px-2 py-1 border border-purple-700 bg-purple-900/90 text-purple-200 hover:bg-purple-800 whitespace-nowrap"
      title="Отключить NEAR"
    >
      🟢 {account.id.length > 16 ? account.id.slice(0, 14) + "…" : account.id}
    </button>
  ) : (
    <button
      onClick={() => connectNear()}
      className="font-game text-[8px] px-2 py-1 border border-black bg-purple-700 text-yellow-200 hover:bg-purple-600 whitespace-nowrap"
    >
      🦊 NEAR
    </button>
  );
}
