import { useStore } from "../../state/store";
import { PanelShell } from "./PanelShell";
import { PixelButton } from "../shared/PixelButton";
import { useT } from "../../i18n/useT";

export function AnimalsPanel() {
  const t = useT();
  const buildings = useStore((s) => s.buildings);
  const animals = useStore((s) => s.animals);
  const setLocation = useStore((s) => s.setLocation);

  const hasHenhouse = buildings.includes("henhouse");
  const hasBarn = buildings.includes("barn");
  const chickens = animals.filter((a) => a.kind === "chicken").length;
  const cows = animals.filter((a) => a.kind === "cow").length;

  return (
    <PanelShell title={t("animals.title")}>
      <div className="space-y-3">
        {hasHenhouse ? (
          <div className="bg-brown-600 p-2 border border-black/20">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg">🐔</span>
                <span className="font-game text-[8px] text-white ml-2">
                  {t("animals.henhouse")} ({chickens}/10)
                </span>
              </div>
              <PixelButton onClick={() => setLocation("henhouse")}>
                {t("animals.enter")}
              </PixelButton>
            </div>
          </div>
        ) : (
          <p className="font-game text-[7px] text-white/50">
            {t("animals.no_henhouse")}
          </p>
        )}

        {hasBarn ? (
          <div className="bg-brown-600 p-2 border border-black/20">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg">🐄</span>
                <span className="font-game text-[8px] text-white ml-2">
                  {t("animals.barn")} ({cows}/10)
                </span>
              </div>
              <PixelButton onClick={() => setLocation("barn")}>
                {t("animals.enter")}
              </PixelButton>
            </div>
          </div>
        ) : (
          <p className="font-game text-[7px] text-white/50">
            {t("animals.no_barn")}
          </p>
        )}
      </div>
    </PanelShell>
  );
}
