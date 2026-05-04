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

function GameRoot() {
  usePassiveTick();
  const setPanel = useStore((s) => s.setPanel);
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
