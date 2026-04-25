import { useStore } from "../../state/store";
import { selectLevel, selectMaxHiveSlots } from "../../state/selectors";
import { PanelShell } from "./PanelShell";
import { PixelButton } from "../shared/PixelButton";
import { Progress } from "../shared/Progress";
import { useTick } from "../../hooks/useTick";
import { isReady, remaining, fmtDuration } from "../../domain/time/time";
import {
  DEMO_ACTION_INTERVAL_MS,
  DEMO_UPGRADE_ACTIONS,
  BEEHIVE_LV1_COST,
  BEEHIVE_LEVELS,
  BEEHIVE_MAX_LEVEL,
} from "../../data/beehives.data";

export function BeehivePanel() {
  useTick(1000);
  const island = useStore((s) => s.island);
  const level = useStore(selectLevel);
  const maxSlots = useStore(selectMaxHiveSlots);
  const beehives = useStore((s) => s.beehives);
  const pollen = useStore((s) => s.pollen);
  const beehiveAction = useStore((s) => s.beehiveAction);
  const addDemoBeehive = useStore((s) => s.addDemoBeehive);
  const buyBeehive = useStore((s) => s.buyBeehive);
  const upgradeDemoHive = useStore((s) => s.upgradeDemoHive);
  const upgradeBeehive = useStore((s) => s.upgradeBeehive);

  const now = Date.now();

  if (island === "basic") {
    return (
      <PanelShell title="Ульи">
        <p className="font-game text-[8px] text-white/60">
          Сначала переберитесь на Весенний остров чтобы открыть ульи.
          Завершите все 9 расширений и откройте панель Земля.
        </p>
      </PanelShell>
    );
  }

  return (
    <PanelShell title="Ульи">
      <div className="space-y-3">
        {/* Header info */}
        <div className="bg-brown-600 p-2 border border-black/20">
          <div className="font-game text-[8px] text-yellow-300">
            Слоты: {beehives.length}/{maxSlots} | Пыльца: {pollen.toFixed(1)}
          </div>
          <div className="font-game text-[6px] text-white/50">
            Остров: {island} | Уровень: {level}
          </div>
        </div>

        {/* Add demo beehive */}
        {beehives.length < maxSlots && beehives.filter((h) => h.level === 0).length === 0 && (
          <PixelButton onClick={addDemoBeehive}>
            Демо-улей (бесплатно)
          </PixelButton>
        )}

        {/* Buy Lv1 beehive */}
        {beehives.length < maxSlots && (
          <PixelButton
            disabled={pollen < BEEHIVE_LV1_COST}
            onClick={buyBeehive}
            variant="secondary"
          >
            Купить Ур.1 улей ({BEEHIVE_LV1_COST} пыльцы)
          </PixelButton>
        )}

        {/* Beehive list */}
        {beehives.map((hive) => {
          const isDemo = hive.level === 0;
          const actionReady = isReady(hive.lastAction, DEMO_ACTION_INTERVAL_MS, now);
          const actionRem = remaining(hive.lastAction, DEMO_ACTION_INTERVAL_MS, now);
          const upgradeProg = hive.actions / DEMO_UPGRADE_ACTIONS;
          const canUpgradeNatural = hive.actions >= DEMO_UPGRADE_ACTIONS;
          const instantCost = Math.max(0, DEMO_UPGRADE_ACTIONS - hive.actions);
          const canInstant = pollen >= instantCost;

          return (
            <div key={hive.id} className="bg-brown-600 p-2 border border-black/20 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">{isDemo ? "🐝" : "🍯"}</span>
                <div className="flex-1">
                  <div className="font-game text-[8px] text-white">
                    {isDemo ? "Демо-улей" : `Ур.${hive.level} Улей`}
                  </div>
                  <div className="font-game text-[6px] text-white/50">
                    {isDemo
                      ? `Действия: ${hive.actions}/${DEMO_UPGRADE_ACTIONS}`
                      : `Пыльца: ${hive.accruedPollen.toFixed(2)} накоплено`}
                  </div>
                </div>

                {/* Demo action button */}
                {isDemo && (
                  <PixelButton
                    disabled={!actionReady}
                    onClick={() => beehiveAction(hive.id)}
                  >
                    {actionReady ? "Действие" : fmtDuration(actionRem)}
                  </PixelButton>
                )}
              </div>

              {/* Demo upgrade progress */}
              {isDemo && (
                <div>
                  <Progress value={upgradeProg} color="bg-yellow-400" />
                  <div className="font-game text-[6px] text-white/50 mt-0.5">
                    {(upgradeProg * 100).toFixed(1)}% до Ур.1
                  </div>
                  <div className="flex gap-1 mt-1">
                    {canUpgradeNatural && (
                      <PixelButton onClick={() => upgradeDemoHive(hive.id, false)}>
                        Улучшить до Ур.1
                      </PixelButton>
                    )}
                    {!canUpgradeNatural && (
                      <PixelButton
                        disabled={!canInstant}
                        variant="secondary"
                        onClick={() => upgradeDemoHive(hive.id, true)}
                      >
                        Мгновенно ({instantCost} пыльцы)
                      </PixelButton>
                    )}
                  </div>
                </div>
              )}

              {/* Lv1/Lv2 upgrade button */}
              {!isDemo && hive.level < BEEHIVE_MAX_LEVEL && (() => {
                const nextLvl = hive.level + 1;
                const cost = BEEHIVE_LEVELS[nextLvl]?.upgradeCost ?? 0;
                const nextRate = BEEHIVE_LEVELS[nextLvl]?.pollenPerDay ?? 0;
                const canUpgrade = pollen >= cost;
                return (
                  <div className="flex items-center gap-2 mt-1">
                    <PixelButton
                      disabled={!canUpgrade}
                      variant="secondary"
                      onClick={() => upgradeBeehive(hive.id)}
                    >
                      → Lv{nextLvl} ({cost} pollen)
                    </PixelButton>
                    <span className="font-game text-[6px] text-white/40">
                      {nextRate}/день
                    </span>
                  </div>
                );
              })()}
            </div>
          );
        })}

        {beehives.length === 0 && (
          <p className="font-game text-[8px] text-white/50">
            Ульев нет. Добавьте демо-улей чтобы начать!
          </p>
        )}
      </div>
    </PanelShell>
  );
}
