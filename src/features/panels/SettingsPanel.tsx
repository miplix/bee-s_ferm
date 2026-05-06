import { useEffect, useState } from "react";
import { useStore } from "../../state/store";
import { PanelShell } from "./PanelShell";
import { PixelButton } from "../shared/PixelButton";
import { disconnectNear, getAccount, onAccount } from "../../lib/near/wallet";
import { getSupabase, isCloudEnabled } from "../../lib/supabase/client";
import { VipPurchaseModal } from "../near/VipPurchaseModal";
import { useT } from "../../i18n/useT";
import { LANGUAGES, type Language } from "../../i18n/types";

export function SettingsPanel() {
  const t = useT();
  const [confirmReset, setConfirmReset] = useState(false);
  const resetGame = useStore((s) => s.resetGame);
  const setPanel = useStore((s) => s.setPanel);
  const island = useStore((s) => s.island);
  const expansion = useStore((s) => s.expansion);
  const xp = useStore((s) => s.xp);
  const coins = useStore((s) => s.coins);
  const language = useStore((s) => (s as any).language as Language) ?? "ru";
  const setLanguage = useStore((s) => (s as any).setLanguage as (l: Language) => void);
  const musicEnabled = useStore((s) => (s as any).musicEnabled as boolean) ?? true;
  const setMusicEnabled = useStore((s) => (s as any).setMusicEnabled as (v: boolean) => void);
  const sfxEnabled = useStore((s) => (s as any).sfxEnabled as boolean) ?? true;
  const setSfxEnabled = useStore((s) => (s as any).setSfxEnabled as (v: boolean) => void);
  const [nearAcc, setNearAcc] = useState(getAccount());
  const [emailUser, setEmailUser] = useState<string | null>(null);
  const [showVip, setShowVip] = useState(false);
  const vipExpiresAt = useStore((s) => s.vipExpiresAt);
  const now = Date.now();
  const vipActive = !!vipExpiresAt && vipExpiresAt > now;

  useEffect(() => {
    const off = onAccount(setNearAcc);
    if (isCloudEnabled()) {
      getSupabase()!.auth.getUser().then(({ data }) => setEmailUser(data.user?.email ?? null));
    }
    return off;
  }, []);

  const handleEmailLogout = async () => {
    const sb = getSupabase(); if (!sb) return;
    await sb.auth.signOut(); setEmailUser(null);
  };

  const islandLabels: Record<string, string> = language === "ru"
    ? { basic: "Основной", spring: "Весенний", desert: "Пустынный", volcano: "Вулканический" }
    : { basic: "Basic",    spring: "Spring",    desert: "Desert",    volcano: "Volcano" };

  function handleReset() {
    resetGame();
    setPanel(null);
    setConfirmReset(false);
  }

  return (
    <PanelShell title={t("settings.title")}>
      <div className="space-y-3">

        {/* Language */}
        <div className="bg-brown-600 p-2 border border-black/20 space-y-1">
          <p className="font-game text-[8px] text-yellow-300">{t("settings.language")}</p>
          <div className="flex gap-1 mt-1">
            {LANGUAGES.map((l) => (
              <button key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`font-game text-[7px] px-2 py-1 border border-black flex items-center gap-1 ${
                  language === l.code ? "bg-yellow-700 text-white" : "bg-brown-700 text-white/70 hover:bg-brown-500"
                }`}
              >
                <span>{l.emoji}</span> {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Audio */}
        <div className="bg-brown-600 p-2 border border-black/20 space-y-1">
          <p className="font-game text-[8px] text-yellow-300">🔊 {t("settings.audio")}</p>
          <div className="flex flex-col gap-1 mt-1">
            <label className="font-game text-[7px] text-white/80 flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={sfxEnabled} onChange={(e) => setSfxEnabled(e.target.checked)} />
              {t("settings.audio_sfx")}
            </label>
            <label className="font-game text-[7px] text-white/80 flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={musicEnabled} onChange={(e) => setMusicEnabled(e.target.checked)} />
              {t("settings.audio_music")}
            </label>
          </div>
        </div>

        {/* Account */}
        <div className="bg-brown-600 p-2 border border-black/20 space-y-1">
          <p className="font-game text-[8px] text-yellow-300">{t("settings.account")}</p>
          <div className="font-game text-[7px] text-white/80 space-y-1">
            {nearAcc ? (
              <div className="flex items-center justify-between gap-2">
                <span>🟢 NEAR: {nearAcc.id}</span>
                <button onClick={() => disconnectNear()} className="px-1 py-0.5 bg-red-900 text-red-200 border border-black text-[6px]">
                  {language === "ru" ? "отключить" : "disconnect"}
                </button>
              </div>
            ) : (
              <p className="text-white/40">{language === "ru" ? "NEAR не подключён" : "NEAR not connected"}</p>
            )}
            {isCloudEnabled() && (
              emailUser ? (
                <div className="flex items-center justify-between gap-2">
                  <span>✉️ {emailUser}</span>
                  <button onClick={handleEmailLogout} className="px-1 py-0.5 bg-red-900 text-red-200 border border-black text-[6px]">
                    {language === "ru" ? "выйти" : "sign out"}
                  </button>
                </div>
              ) : (
                <p className="text-white/40">{language === "ru" ? "Email-sync не подключён" : "Email sync off"}</p>
              )
            )}
          </div>
        </div>

        {/* VIP */}
        <div className="bg-brown-600 p-2 border border-black/20 space-y-1">
          <p className="font-game text-[8px] text-yellow-300">💎 {t("settings.vip")}</p>
          <div className="font-game text-[7px] text-white/80">
            {vipActive ? (
              <p className="text-green-300">{t("settings.vip_active", { date: new Date(vipExpiresAt!).toLocaleString() })}</p>
            ) : (
              <p className="text-white/50">{t("settings.vip_inactive")}</p>
            )}
          </div>
          <button
            onClick={() => setShowVip(true)}
            className="font-game text-[7px] px-2 py-1 mt-1 border border-black bg-purple-700 text-yellow-200 hover:bg-purple-600"
          >
            {vipActive ? (language === "ru" ? "Продлить" : "Renew") : t("settings.vip_buy")}
          </button>
        </div>

        {/* Game info */}
        <div className="bg-brown-600 p-2 border border-black/20 space-y-1">
          <p className="font-game text-[8px] text-yellow-300">{language === "ru" ? "Состояние" : "Status"}</p>
          <div className="font-game text-[7px] text-white/80 space-y-0.5">
            <p>{language === "ru" ? "Остров" : "Island"}: {islandLabels[island] ?? island}</p>
            <p>{language === "ru" ? "Расширений" : "Expansions"}: {expansion}</p>
            <p>XP: {Math.floor(xp)}</p>
            <p>{language === "ru" ? "Монет" : "Coins"}: {coins.toFixed(2)}</p>
          </div>
        </div>

        {/* About */}
        <div className="bg-brown-600 p-2 border border-black/20">
          <p className="font-game text-[8px] text-yellow-300">{language === "ru" ? "О игре" : "About"}</p>
          <p className="font-game text-[7px] text-white/60 mt-0.5">
            {language === "ru" ? "Пчело-ферма v0.1 — NEAR Blockchain Farm" : "Bee Farm v0.1 — NEAR Blockchain Farm"}
          </p>
        </div>

        {/* Reset */}
        <div className="bg-brown-600 p-2 border border-black/20">
          <p className="font-game text-[8px] text-yellow-300 mb-2">{t("settings.danger")}</p>
          {!confirmReset ? (
            <PixelButton variant="secondary" onClick={() => setConfirmReset(true)}>
              {t("settings.reset")}
            </PixelButton>
          ) : (
            <div className="space-y-2">
              <p className="font-game text-[7px] text-red-400">
                {t("settings.reset_confirm")}
              </p>
              <div className="flex gap-2">
                <PixelButton onClick={handleReset}>
                  {language === "ru" ? "Да, сброс" : "Yes, reset"}
                </PixelButton>
                <PixelButton variant="secondary" onClick={() => setConfirmReset(false)}>
                  {t("btn.cancel")}
                </PixelButton>
              </div>
            </div>
          )}
        </div>
      </div>
      {showVip && <VipPurchaseModal onClose={() => setShowVip(false)} />}
    </PanelShell>
  );
}
