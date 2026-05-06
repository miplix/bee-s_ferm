import { useEffect } from "react";
import { Hud } from "../features/hud/Hud";
import { Quickbar } from "../features/hud/Quickbar";
import { FarmView } from "../features/farm/FarmView";
import { PanelHost } from "../features/panels/PanelHost";
import { ErrorBoundary } from "../features/shared/ErrorBoundary";
// DailyChest moved to be a cell on the island (see daily_chest CellType)
import { WelcomeScreen } from "../features/panels/WelcomeScreen";
import { Toaster } from "../features/shared/Toaster";
import { LoginGate } from "../features/auth/LoginGate";
import { PendingPlacementsBar } from "../features/farm/PendingPlacementsBar";
import { PollenBoostButton } from "../features/farm/PollenBoostButton";
import { VipChest } from "../features/farm/VipChest";
import { usePassiveTick } from "../hooks/usePassiveTick";
import { useStore } from "../state/store";
import { startMusic, setMusicEnabled } from "../lib/music";

function GameRoot() {
  usePassiveTick();
  const setPanel = useStore((s) => s.setPanel);
  const musicEnabled = useStore((s) => (s as any).musicEnabled as boolean) ?? true;

  // Hotkey D → dev panel
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key.toLowerCase() === "d" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setPanel("dev");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setPanel]);

  // Background music: запуск ПОСЛЕ первого пользовательского клика (autoplay-policy)
  useEffect(() => {
    let triggered = false;
    const onFirstInteract = () => {
      if (triggered) return;
      triggered = true;
      startMusic(musicEnabled);
      window.removeEventListener("pointerdown", onFirstInteract);
      window.removeEventListener("keydown", onFirstInteract);
    };
    window.addEventListener("pointerdown", onFirstInteract, { once: false });
    window.addEventListener("keydown", onFirstInteract, { once: false });
    return () => {
      window.removeEventListener("pointerdown", onFirstInteract);
      window.removeEventListener("keydown", onFirstInteract);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Реакция на тоггл музыки в Settings
  useEffect(() => {
    setMusicEnabled(musicEnabled);
  }, [musicEnabled]);

  return (
    <LoginGate>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#1a1a2e]">
        <Hud />
        <FarmView />
        <Quickbar />
        <PanelHost />
        <PendingPlacementsBar />
        <PollenBoostButton />
        <VipChest />
        <WelcomeScreen />
        <Toaster />
      </div>
    </LoginGate>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <GameRoot />
    </ErrorBoundary>
  );
}
