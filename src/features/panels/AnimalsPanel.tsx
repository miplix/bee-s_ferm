import { useStore } from "../../state/store";
import { PanelShell } from "./PanelShell";
import { PixelButton } from "../shared/PixelButton";

export function AnimalsPanel() {
  const buildings = useStore((s) => s.buildings);
  const animals = useStore((s) => s.animals);
  const setLocation = useStore((s) => s.setLocation);

  const hasHenhouse = buildings.includes("henhouse");
  const hasBarn = buildings.includes("barn");
  const chickens = animals.filter((a) => a.kind === "chicken").length;
  const cows = animals.filter((a) => a.kind === "cow").length;

  return (
    <PanelShell title="Animals">
      <div className="space-y-3">
        {hasHenhouse ? (
          <div className="bg-brown-600 p-2 border border-black/20">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg">🐔</span>
                <span className="font-game text-[8px] text-white ml-2">
                  Henhouse ({chickens}/10)
                </span>
              </div>
              <PixelButton onClick={() => setLocation("henhouse")}>
                Enter
              </PixelButton>
            </div>
          </div>
        ) : (
          <p className="font-game text-[7px] text-white/50">
            Build a Henhouse (Lv.6) to raise chickens.
          </p>
        )}

        {hasBarn ? (
          <div className="bg-brown-600 p-2 border border-black/20">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg">🐄</span>
                <span className="font-game text-[8px] text-white ml-2">
                  Barn ({cows}/10)
                </span>
              </div>
              <PixelButton onClick={() => setLocation("barn")}>
                Enter
              </PixelButton>
            </div>
          </div>
        ) : (
          <p className="font-game text-[7px] text-white/50">
            Build a Barn (Lv.12) to raise cows.
          </p>
        )}
      </div>
    </PanelShell>
  );
}
