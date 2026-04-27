import { useEffect } from "react";
import { Hud } from "../features/hud/Hud";
import { Quickbar } from "../features/hud/Quickbar";
import { FarmView } from "../features/farm/FarmView";
import { PanelHost } from "../features/panels/PanelHost";
import { ErrorBoundary } from "../features/shared/ErrorBoundary";
import { DailyChest } from "../features/farm/DailyChest";
import { WelcomeScreen } from "../features/panels/WelcomeScreen";
import { Toaster } from "../features/shared/Toaster";
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
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#1a1a2e]">
      <Hud />
      <FarmView />
      <Quickbar />
      <DailyChest />
      <PanelHost />
      <WelcomeScreen />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <GameRoot />
    </ErrorBoundary>
  );
}
