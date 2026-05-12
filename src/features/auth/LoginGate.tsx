import { useEffect, useState } from "react";
import { connectNear, getAccount, initNear, onAccount } from "../../lib/near/wallet";
import { useT } from "../../i18n/useT";
import { pullSave, schedulePush } from "../../lib/supabase/sync";
import { useStore } from "../../state/store";

/**
 * Dev-bypass: `?dev=1` в URL → пропускает gate без кошелька.
 * Полезно для тестирования механик локально. Облачный sync не запускается
 * (pushSave проверяет getAccount() — он null), всё в localStorage.
 * После закрытия dev-режима добавляешь `?dev=0` или чистишь URL-param.
 */
function isDevBypass(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const p = new URLSearchParams(window.location.search);
    if (p.get("dev") === "1") {
      sessionStorage.setItem("dev_bypass", "1");
      return true;
    }
    if (p.get("dev") === "0") {
      sessionStorage.removeItem("dev_bypass");
      return false;
    }
    return sessionStorage.getItem("dev_bypass") === "1";
  } catch { return false; }
}

/**
 * Полноэкранный gate — пока NEAR-кошелёк не подключён, игра скрыта.
 * После подключения кошелька: pull облачного сейва (cross-device) → showChildren.
 * Если облачный сейв новее локального, перетираем state.
 */
export function LoginGate({ children }: { children: React.ReactNode }) {
  const t = useT();
  const [account, setAccount] = useState(getAccount());
  const [busy, setBusy] = useState(false);
  const [restoring, setRestoring] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const devBypass = isDevBypass();

  useEffect(() => {
    initNear();
    const off = onAccount(setAccount);
    const tm = setTimeout(() => setRestoring(false), 1500);
    return () => { off(); clearTimeout(tm); };
  }, []);

  // Cross-device pull: при подключении кошелька подтягиваем cloud-сейв.
  // Если облачный новее локального — заменяем локальный.
  // Иначе пушим локальный в облако (первая инициализация).
  useEffect(() => {
    if (!account) return;
    let cancelled = false;
    (async () => {
      setSyncing(true);
      try {
        const cloud = await pullSave();
        if (cancelled) return;
        const localState = useStore.getState();
        if (cloud) {
          const cloudTs = cloud.state.lastSavedAt ?? 0;
          const localTs = localState.lastSavedAt ?? 0;
          if (cloudTs > localTs) {
            // облако новее → заменяем локаль
            useStore.setState(cloud.state as any);
          } else if (localTs > cloudTs) {
            // локаль новее → push в облако
            schedulePush(localState, 100);
          }
        } else {
          // в облаке нет сейва — пушим текущий локальный (первый sync)
          schedulePush(localState, 100);
        }
      } catch (e) {
        console.warn("[LoginGate] cloud sync error:", e);
      } finally {
        if (!cancelled) setSyncing(false);
      }
    })();
    return () => { cancelled = true; };
  }, [account]);

  // DEV BYPASS — играем без кошелька (только localStorage)
  if (devBypass) {
    return (
      <>
        <div style={{ position: "fixed", top: 0, left: 0, zIndex: 9999, background: "rgba(255,80,80,0.8)", color: "white", fontFamily: "monospace", fontSize: 10, padding: "2px 6px" }}>
          DEV BYPASS — без кошелька, без cloud sync. Сними <code>?dev=0</code> чтобы выключить.
        </div>
        {children}
      </>
    );
  }

  if (account && !syncing) return <>{children}</>;
  if (account && syncing) {
    return (
      <div
        className="fixed inset-0 z-[80] flex flex-col items-center justify-center"
        style={{ background: "linear-gradient(180deg, #6dc3e0 0%, #4ea7d4 60%, #3a8bbf 100%)" }}
      >
        <div className="text-5xl mb-2">🐝</div>
        <div className="font-game text-[10px] text-yellow-200">Синхронизация…</div>
      </div>
    );
  }
  if (restoring) {
    return (
      <div
        className="fixed inset-0 z-[80] flex flex-col items-center justify-center"
        style={{ background: "linear-gradient(180deg, #6dc3e0 0%, #4ea7d4 60%, #3a8bbf 100%)" }}
      >
        <div className="text-5xl mb-2">🐝</div>
        <div className="font-game text-[10px] text-yellow-200">{t("welcome.title")}…</div>
      </div>
    );
  }

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
      <div className="bg-brown-800 border-4 border-yellow-600 p-6 max-w-[360px] w-[90%] shadow-2xl">
        <div className="text-center mb-5">
          <div className="text-5xl mb-2">🐝</div>
          <h1 className="font-game text-[14px] text-yellow-300">
            {t("welcome.title")}
          </h1>
        </div>

        <button
          onClick={handleConnect}
          disabled={busy}
          className="w-full font-game text-[10px] px-4 py-3 border-2 border-black bg-purple-700 text-yellow-200 hover:bg-purple-600 active:bg-purple-800 disabled:opacity-60"
        >
          {busy ? "..." : `🦊 ${t("welcome.connect")}`}
        </button>
      </div>
    </div>
  );
}
