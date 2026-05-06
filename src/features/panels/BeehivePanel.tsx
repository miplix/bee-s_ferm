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
import { useT } from "../../i18n/useT";

export function BeehivePanel() {
  const t = useT();
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
      <PanelShell title={t("beehive.title")}>
        <p className="font-game text-[8px] text-white/60">
          {t("beehive.basic_locked")}
        </p>
      </PanelShell>
    );
  }

  return (
    <PanelShell title={t("beehive.title")}>
      <div className="space-y-3">
        {/* Header info */}
        <div className="bg-brown-600 p-2 border border-black/20">
          <div className="font-game text-[8px] text-yellow-300">
            {t("beehive.slots_label", { n: beehives.length, max: maxSlots, pollen: pollen.toFixed(2) })}
          </div>
          <div className="font-game text-[6px] text-white/50">
            {t("beehive.island_lvl", { island, n: level })}
          </div>
        </div>

        {beehives.length < maxSlots && beehives.filter((h) => h.level === 0).length === 0 && (
          <PixelButton onClick={addDemoBeehive}>
            {t("beehive.demo_btn")}
          </PixelButton>
        )}

        {beehives.length < maxSlots && (
          <PixelButton
            disabled={pollen < BEEHIVE_LV1_COST}
            onClick={buyBeehive}
            variant="secondary"
          >
            {t("beehive.lv1_btn", { n: BEEHIVE_LV1_COST })}
          </PixelButton>
        )}

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
                    {isDemo ? t("beehive.demo") : `${t("beehive.lv", { n: hive.level })} ${t("beehive.title").slice(0, -1)}`}
                  </div>
                  <div className="font-game text-[6px] text-white/50">
                    {isDemo
                      ? t("beehive.actions", { n: hive.actions, max: DEMO_UPGRADE_ACTIONS })
                      : t("beehive.pollen_acc", { n: hive.accruedPollen.toFixed(2) })}
                  </div>
                </div>

                {isDemo && (
                  <PixelButton
                    disabled={!actionReady}
                    onClick={() => beehiveAction(hive.id)}
                  >
                    {actionReady ? t("beehive.action") : fmtDuration(actionRem)}
                  </PixelButton>
                )}
              </div>

              {isDemo && (
                <div>
                  <Progress value={upgradeProg} color="bg-yellow-400" />
                  <div className="font-game text-[6px] text-white/50 mt-0.5">
                    {t("beehive.upgrade_pct", { pct: (upgradeProg * 100).toFixed(1) })}
                  </div>
                  <div className="flex gap-1 mt-1">
                    {canUpgradeNatural && (
                      <PixelButton onClick={() => upgradeDemoHive(hive.id, false)}>
                        {t("beehive.upgrade_to")}
                      </PixelButton>
                    )}
                    {!canUpgradeNatural && (
                      <PixelButton
                        disabled={!canInstant}
                        variant="secondary"
                        onClick={() => upgradeDemoHive(hive.id, true)}
                      >
                        {t("beehive.instant", { n: instantCost })}
                      </PixelButton>
                    )}
                  </div>
                </div>
              )}

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
                      {t("beehive.next_lv", { n: nextLvl, cost })}
                    </PixelButton>
                    <span className="font-game text-[6px] text-white/40">
                      {t("beehive.per_day", { n: nextRate })}
                    </span>
                  </div>
                );
              })()}
            </div>
          );
        })}

        {beehives.length === 0 && (
          <p className="font-game text-[8px] text-white/50">
            {t("beehive.empty")}
          </p>
        )}
      </div>
    </PanelShell>
  );
}
