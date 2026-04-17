import { Hud } from "../features/hud/Hud";
import { Quickbar } from "../features/hud/Quickbar";
import { FarmView } from "../features/farm/FarmView";
import { PanelHost } from "../features/panels/PanelHost";
import { ErrorBoundary } from "../features/shared/ErrorBoundary";
import { DailyRewardPopup } from "../features/panels/DailyRewardPopup";
import { usePassiveTick } from "../hooks/usePassiveTick";

function GameRoot() {
  usePassiveTick();

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#1a1a2e]">
      <Hud />
      <FarmView />
      <Quickbar />
      <PanelHost />
      <DailyRewardPopup />
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
