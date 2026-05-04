import { useEffect, useState } from "react";
import { connectNear, disconnectNear, getAccount, onAccount } from "../../lib/near/wallet";
import { useStore } from "../../state/store";

/** Floating NEAR wallet button. Shows account ID when connected. */
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

  return (
    <div className="absolute z-40" style={{ top: 8, right: 130 }}>
      {account ? (
        <button
          onClick={() => disconnectNear()}
          className="font-game text-[7px] px-2 py-1 border border-purple-700 bg-purple-900 text-purple-200 hover:bg-purple-800"
          title="Отключить NEAR"
        >
          🟢 {account.id.length > 18 ? account.id.slice(0, 16) + "…" : account.id}
        </button>
      ) : (
        <button
          onClick={() => connectNear()}
          className="font-game text-[8px] px-2 py-1 border border-black bg-purple-700 text-yellow-200 hover:bg-purple-600"
        >
          🦊 NEAR
        </button>
      )}
    </div>
  );
}
