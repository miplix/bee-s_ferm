import { useStore } from "../../state/store";
import { selectLevel } from "../../state/selectors";
import { EXPANSIONS, ISLAND_TRANSITIONS } from "../../data/expansions.data";
import { PanelShell } from "./PanelShell";
import { PixelButton } from "../shared/PixelButton";
import { Progress } from "../shared/Progress";
import { useTick } from "../../hooks/useTick";
import { progress as calcProgress, fmtDuration, remaining, isReady } from "../../domain/time/time";

export function ExpandPanel() {
  useTick(1000);
  const level = useStore(selectLevel);
  const expansion = useStore((s) => s.expansion);
  const island = useStore((s) => s.island);
  const inventory = useStore((s) => s.inventory);
  const coins = useStore((s) => s.coins);
  const pendingExpansion = useStore((s) => s.pendingExpansion);
  const startExpansion = useStore((s) => s.startExpansion);
  const completeExpansion = useStore((s) => s.completeExpansion);
  const travelToSpring = useStore((s) => s.travelToSpring);

  const now = Date.now();
  const allExpanded = expansion >= EXPANSIONS.length;

  // Pending expansion
  if (pendingExpansion) {
    const ready = isReady(pendingExpansion.startedAt, pendingExpansion.durationMs, now);
    const prog = calcProgress(pendingExpansion.startedAt, pendingExpansion.durationMs, now);
    const rem = remaining(pendingExpansion.startedAt, pendingExpansion.durationMs, now);

    return (
      <PanelShell title="Expanding...">
        <div className="space-y-3">
          <div className="bg-brown-600 p-2 border border-black/20 text-center">
            <span className="text-2xl">🏗️</span>
            <p className="font-game text-[8px] text-white mt-1">Building expansion {pendingExpansion.expansionIndex + 1}</p>
            <Progress value={prog} color="bg-yellow-400" className="mt-2" />
            <p className="font-game text-[7px] text-yellow-300 mt-1">
              {ready ? "Ready!" : fmtDuration(rem)}
            </p>
          </div>
          {ready && (
            <PixelButton onClick={completeExpansion}>
              Complete Expansion
            </PixelButton>
          )}
        </div>
      </PanelShell>
    );
  }

  // Travel to Spring after all Basic expansions
  if (allExpanded && island === "basic") {
    const goldNeeded = ISLAND_TRANSITIONS.spring.gold;
    const goldHave = inventory.gold ?? 0;

    return (
      <PanelShell title="Spring Island">
        <div className="space-y-3">
          <p className="font-game text-[8px] text-white">
            Basic Island fully expanded! Travel to Spring Island to unlock beehives.
          </p>
          <div className="bg-brown-600 p-2 border border-black/20">
            <p className="font-game text-[7px] text-yellow-300">Cost: {goldNeeded} Gold</p>
            <p className="font-game text-[6px] text-white/50">You have: {goldHave} Gold</p>
          </div>
          <PixelButton disabled={goldHave < goldNeeded} onClick={travelToSpring}>
            Travel to Spring Island
          </PixelButton>
        </div>
      </PanelShell>
    );
  }

  if (allExpanded) {
    return (
      <PanelShell title="Land">
        <p className="font-game text-[8px] text-white/60">
          All expansions complete for {island} island.
        </p>
      </PanelShell>
    );
  }

  // Show next expansion info
  const exp = EXPANSIONS[expansion];
  const levelOk = level >= exp.minLevel;

  return (
    <PanelShell title={`Expansion ${exp.id}`}>
      <div className="space-y-3">
        <p className="font-game text-[7px] text-white/60">
          Use the ➕ Expand button on the map, or click below.
        </p>
        <div className="bg-brown-600 p-2 border border-black/20 space-y-1">
          <p className="font-game text-[8px] text-yellow-300">Cost:</p>
          {Object.entries(exp.cost).map(([res, needed]) => {
            const have = res === "coins" ? coins : (inventory[res] ?? 0);
            const ok = res === "coins" ? have >= needed - 0.001 : have >= needed;
            return (
              <div key={res} className="flex justify-between font-game text-[7px]">
                <span className="text-white">{res}: {needed}</span>
                <span className={ok ? "text-green-400" : "text-red-400"}>({Math.floor(have)})</span>
              </div>
            );
          })}
        </div>
        <div className="bg-brown-600 p-2 border border-black/20">
          <p className="font-game text-[8px] text-yellow-300">Adds:</p>
          <p className="font-game text-[7px] text-white/80">
            +{exp.adds.plots} plots, +{exp.adds.trees} trees
            {exp.adds.rocks > 0 && `, +${exp.adds.rocks} stone`}
            {exp.adds.iron > 0 && `, +${exp.adds.iron} iron`}
            {exp.adds.gold > 0 && `, +${exp.adds.gold} gold`}
          </p>
        </div>
        {!levelOk && (
          <p className="font-game text-[7px] text-red-400">Requires level {exp.minLevel}</p>
        )}
        <PixelButton disabled={!levelOk} onClick={startExpansion}>
          Start Expansion
        </PixelButton>
      </div>
    </PanelShell>
  );
}
