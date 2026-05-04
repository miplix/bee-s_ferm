import { useEffect, useState } from "react";
import { getSupabase, isCloudEnabled } from "../../lib/supabase/client";
import { pullSave, schedulePush } from "../../lib/supabase/sync";
import { useStore } from "../../state/store";
import { PixelButton } from "../shared/PixelButton";

type Mode = "checking" | "guest" | "login" | "sent" | "logged_in";

export function AuthScreen() {
  const [mode, setMode] = useState<Mode>("checking");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!isCloudEnabled()) { setMode("guest"); return; }
    const sb = getSupabase()!;
    sb.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserEmail(data.user.email ?? null);
        setMode("logged_in");
      } else {
        setMode("guest");
      }
    });
    const { data: sub } = sb.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUserEmail(session.user.email ?? null);
        setMode("logged_in");
        // Try to pull cloud save into local state on login
        const cloud = await pullSave();
        if (cloud) {
          const localState = useStore.getState() as any;
          const localUpdated = localState.lastMeaningfulActivity ?? 0;
          const cloudUpdated = new Date(cloud.updatedAt).getTime();
          // If both local and cloud have meaningful state and they differ significantly,
          // ask user which one to keep
          const localHasProgress = (localState.xp ?? 0) > 0 || (localState.coins ?? 0) > 0;
          const driftMs = Math.abs(localUpdated - cloudUpdated);
          if (localHasProgress && driftMs > 60_000) {
            const useCloud = confirm(
              `Найдены два разных сейва.\n\n` +
              `Облако: ${new Date(cloud.updatedAt).toLocaleString()}\n` +
              `Локально: ${new Date(localUpdated).toLocaleString()}\n\n` +
              `OK — загрузить облачный (потеряешь локальные изменения)\n` +
              `Cancel — оставить локальный (запушится в облако)`
            );
            if (useCloud) {
              useStore.setState(cloud.state as any);
            } else {
              schedulePush(localState, 100); // push local immediately
            }
          } else {
            // No conflict — use cloud
            useStore.setState(cloud.state as any);
          }
        }
      } else {
        setMode("guest");
        setUserEmail(null);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const sendMagicLink = async () => {
    setError(null); setBusy(true);
    const sb = getSupabase();
    if (!sb) { setError("Cloud не настроен"); setBusy(false); return; }
    const { error } = await sb.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin },
    });
    setBusy(false);
    if (error) setError(error.message);
    else setMode("sent");
  };

  const logout = async () => {
    const sb = getSupabase();
    if (!sb) return;
    await sb.auth.signOut();
    setMode("guest");
  };

  if (mode === "checking" || mode === "guest" || !isCloudEnabled()) {
    return (
      <div className="absolute top-2 right-2 z-40">
        {!isCloudEnabled() ? (
          <span className="font-game text-[7px] text-white/40 px-2 py-1 bg-black/40 border border-white/10">offline</span>
        ) : (
          <button
            className="font-game text-[8px] px-2 py-1 border border-black bg-brown-700 text-yellow-200 hover:bg-brown-600"
            onClick={() => setMode("login")}
          >
            ☁ Войти
          </button>
        )}
      </div>
    );
  }

  if (mode === "logged_in") {
    return (
      <div className="absolute top-2 right-2 z-40 flex gap-1 items-center">
        <span className="font-game text-[7px] text-green-300 px-2 py-1 bg-black/40 border border-green-700/50">
          ☁ {userEmail}
        </span>
        <button
          className="font-game text-[7px] px-2 py-1 border border-black bg-red-900 text-red-200 hover:bg-red-800"
          onClick={logout}
        >
          выйти
        </button>
      </div>
    );
  }

  // login modal (mode === "login" or "sent")
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4" onClick={() => setMode("guest")}>
      <div className="bg-brown-800 border-2 border-yellow-600 p-4 w-[320px]" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-game text-[12px] text-yellow-300 mb-3 text-center">Войти</h2>
        {mode === "sent" ? (
          <div className="font-game text-[9px] text-green-300 text-center py-3">
            Ссылка отправлена на<br/>{email}<br/><br/>
            Открой почту и кликни — вернёшься залогинен.
          </div>
        ) : (
          <>
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-2 py-2 mb-2 font-game text-[10px] text-black border border-black"
            />
            {error && <div className="font-game text-[8px] text-red-300 mb-2">{error}</div>}
            <div className="text-center">
              <PixelButton onClick={sendMagicLink} disabled={busy || !email.includes("@")}>
                {busy ? "..." : "Прислать ссылку"}
              </PixelButton>
            </div>
            <div className="font-game text-[7px] text-white/40 text-center mt-3">
              Прогресс синхронизируется между устройствами.<br/>
              Один email = один сейв.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
