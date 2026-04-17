import { useStore } from "../../state/store";
import { selectLevel } from "../../state/selectors";
import { PanelShell } from "./PanelShell";
import { PixelButton } from "../shared/PixelButton";
import { Progress } from "../shared/Progress";
import { useTick } from "../../hooks/useTick";
import { progress as calcProgress, fmtDuration, remaining, isReady } from "../../domain/time/time";
import { CROP_MACHINE, MACHINE_CROPS } from "../../data/cropMachine.data";
import { getCropDef } from "../../data/crops.data";
import type { CropId } from "../../domain/types/ids";

export function CropMachinePanel() {
  useTick(1000);
  const level = useStore(selectLevel);
  const island = useStore((s) => s.island);
  const cropMachine = useStore((s) => s.cropMachine);
  const inventory = useStore((s) => s.inventory);
  const coins = useStore((s) => s.coins);
  const buildCropMachine = useStore((s) => s.buildCropMachine);
  const addToQueue = useStore((s) => s.addToQueue);
  const collectFromQueue = useStore((s) => s.collectFromQueue);
  const refillOil = useStore((s) => s.refillOil);

  const now = Date.now();

  // Not built yet
  if (!cropMachine || !cropMachine.built) {
    const canBuild = level >= CROP_MACHINE.level && island === "desert";
    return (
      <PanelShell title="Crop Machine">
        <div className="space-y-3">
          <p className="font-game text-[8px] text-white/60">
            Automated crop growing using oil. Requires Level {CROP_MACHINE.level} and Desert Island.
          </p>
          {level < CROP_MACHINE.level && (
            <p className="font-game text-[7px] text-red-400">🔒 Requires Level {CROP_MACHINE.level}</p>
          )}
          {island !== "desert" && (
            <p className="font-game text-[7px] text-red-400">🔒 Requires Desert Island</p>
          )}
          <div className="bg-brown-600 p-2 border border-black/20">
            <p className="font-game text-[7px] text-yellow-300">Build cost:</p>
            {Object.entries(CROP_MACHINE.buildCost).map(([res, needed]) => (
              <div key={res} className="font-game text-[6px] text-white/70">{needed} {res}</div>
            ))}
          </div>
          <PixelButton disabled={!canBuild} onClick={() => buildCropMachine()}>
            Build Crop Machine
          </PixelButton>
        </div>
      </PanelShell>
    );
  }

  // Built — show queue
  return (
    <PanelShell title="Crop Machine">
      <div className="space-y-3">
        {/* Oil tank */}
        <div className="bg-brown-600 p-2 border border-black/20">
          <div className="font-game text-[8px] text-yellow-300">
            Oil: {cropMachine.oilTank.toFixed(1)}h / {cropMachine.maxOilTank}h
          </div>
          <Progress value={cropMachine.oilTank / cropMachine.maxOilTank} color="bg-amber-500" className="mt-1" />
          <div className="mt-1">
            <PixelButton
              variant="secondary"
              disabled={(inventory.oil ?? 0) < 1}
              onClick={() => refillOil(Math.min(10, inventory.oil ?? 0))}
            >
              Refill (+{Math.min(10, inventory.oil ?? 0)} oil)
            </PixelButton>
          </div>
        </div>

        {/* Queue */}
        <div>
          <h3 className="font-game text-[8px] text-yellow-300 mb-1">
            Queue ({cropMachine.queue.length}/{CROP_MACHINE.baseQueueSlots})
          </h3>
          {cropMachine.queue.map((item, i) => {
            const ready = isReady(item.startedAt, item.durationMs, now);
            const prog = calcProgress(item.startedAt, item.durationMs, now);
            const rem = remaining(item.startedAt, item.durationMs, now);
            return (
              <div key={i} className="bg-brown-600 p-1.5 border border-black/20 mb-1 flex items-center gap-2">
                <div className="flex-1">
                  <div className="font-game text-[7px] text-white">{item.cropId} x{item.qty}</div>
                  {!ready && <Progress value={prog} className="mt-0.5" />}
                  {!ready && <span className="font-game text-[6px] text-yellow-300">{fmtDuration(rem)}</span>}
                </div>
                {ready && (
                  <PixelButton onClick={() => collectFromQueue(i)}>Collect</PixelButton>
                )}
              </div>
            );
          })}
        </div>

        {/* Add to queue */}
        {cropMachine.queue.length < CROP_MACHINE.baseQueueSlots && (
          <div>
            <h3 className="font-game text-[8px] text-yellow-300 mb-1">Add crops</h3>
            {MACHINE_CROPS.map((cropId) => {
              let crop;
              try { crop = getCropDef(cropId as CropId); } catch { return null; }
              const seedId = `${cropId}_seed`;
              const seedCount = inventory[seedId] ?? 0;
              return (
                <div key={cropId} className="flex items-center gap-2 bg-brown-600 p-1 border border-black/20 mb-0.5">
                  <span className="text-sm">{crop.emoji}</span>
                  <span className="font-game text-[7px] text-white flex-1">{crop.name}</span>
                  <span className="font-game text-[6px] text-white/50">{seedCount} seeds</span>
                  <PixelButton disabled={seedCount < 1} onClick={() => addToQueue(cropId, 1)} variant="secondary">
                    +1
                  </PixelButton>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PanelShell>
  );
}
