import { useStore } from "../../state/store";
import { selectLevel } from "../../state/selectors";
import { getExpansionList, ISLAND_TRANSITIONS } from "../../data/expansions.data";
import { PanelShell } from "./PanelShell";
import { PixelButton } from "../shared/PixelButton";
import { Progress } from "../shared/Progress";
import { useTick } from "../../hooks/useTick";
import { progress as calcProgress, fmtDuration, remaining, isReady } from "../../domain/time/time";
import { useT } from "../../i18n/useT";

export function ExpandPanel() {
  const t = useT();
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
  const travelToDesert = useStore((s) => s.travelToDesert);
  const travelToVolcano = useStore((s) => s.travelToVolcano);

  const now = Date.now();
  const expansions = getExpansionList(island);
  const allExpanded = expansion >= expansions.length;

  if (pendingExpansion) {
    const ready = isReady(pendingExpansion.startedAt, pendingExpansion.durationMs, now);
    const prog = calcProgress(pendingExpansion.startedAt, pendingExpansion.durationMs, now);
    const rem = remaining(pendingExpansion.startedAt, pendingExpansion.durationMs, now);
    return (
      <PanelShell title={t("expand.title")}>
        <div className="space-y-3">
          <div className="bg-brown-600 p-2 border border-black/20 text-center">
            <span className="text-2xl">🏗️</span>
            <p className="font-game text-[8px] text-white mt-1">{t("expand.in_progress", { n: pendingExpansion.expansionIndex + 1 })}</p>
            <Progress value={prog} color="bg-yellow-400" className="mt-2" />
            <p className="font-game text-[7px] text-yellow-300 mt-1">
              {ready ? t("farm.expansion.done") : fmtDuration(rem)}
            </p>
          </div>
          {ready && <PixelButton onClick={completeExpansion}>{t("expand.complete")}</PixelButton>}
        </div>
      </PanelShell>
    );
  }

  if (allExpanded && island === "basic") {
    const req = ISLAND_TRANSITIONS.spring;
    const goldHave = inventory.gold ?? 0;
    const levelOk = level >= req.minLevel;
    return (
      <PanelShell title={t("expand.title_spring")}>
        <div className="space-y-3">
          <p className="font-game text-[8px] text-white">{t("expand.travel_spring")}</p>
          <div className="bg-brown-600 p-2 border border-black/20 space-y-1">
            <p className="font-game text-[7px] text-yellow-300">{t("expand.cost_label", { value: `${req.gold} 💰` })}</p>
            <p className="font-game text-[6px] text-white/50">{t("expand.you_have", { n: goldHave })}</p>
            {!levelOk && <p className="font-game text-[7px] text-red-400">{t("expand.req_level", { n: req.minLevel })}</p>}
          </div>
          <PixelButton disabled={goldHave < req.gold || !levelOk} onClick={travelToSpring}>
            {t("expand.travel_btn", { dest: t("expand.title_spring") })}
          </PixelButton>
        </div>
      </PanelShell>
    );
  }

  if (allExpanded && island === "spring") {
    const req = ISLAND_TRANSITIONS.desert;
    const csHave = inventory.crimstone ?? 0;
    const levelOk = level >= req.minLevel;
    return (
      <PanelShell title={t("expand.title_desert")}>
        <div className="space-y-3">
          <p className="font-game text-[8px] text-white">{t("expand.travel_desert")}</p>
          <div className="bg-brown-600 p-2 border border-black/20 space-y-1">
            <p className="font-game text-[7px] text-yellow-300">{t("expand.cost_label", { value: `${req.crimstone} 🔴` })}</p>
            <p className="font-game text-[6px] text-white/50">{t("expand.you_have", { n: csHave })}</p>
            {!levelOk && <p className="font-game text-[7px] text-red-400">{t("expand.req_level", { n: req.minLevel })}</p>}
          </div>
          <PixelButton disabled={csHave < req.crimstone || !levelOk} onClick={travelToDesert}>
            {t("expand.travel_btn", { dest: t("expand.title_desert") })}
          </PixelButton>
        </div>
      </PanelShell>
    );
  }

  if (allExpanded && island === "desert") {
    const req = ISLAND_TRANSITIONS.volcano;
    const oilHave = inventory.oil ?? 0;
    const levelOk = level >= req.minLevel;
    return (
      <PanelShell title={t("expand.title_volcano")}>
        <div className="space-y-3">
          <p className="font-game text-[8px] text-white">{t("expand.travel_volcano")}</p>
          <div className="bg-brown-600 p-2 border border-black/20 space-y-1">
            <p className="font-game text-[7px] text-yellow-300">{t("expand.cost_label", { value: `${req.oil} 🛢️` })}</p>
            <p className="font-game text-[6px] text-white/50">{t("expand.you_have", { n: oilHave })}</p>
            {!levelOk && <p className="font-game text-[7px] text-red-400">{t("expand.req_level", { n: req.minLevel })}</p>}
          </div>
          <PixelButton disabled={oilHave < req.oil || !levelOk} onClick={travelToVolcano}>
            {t("expand.travel_btn", { dest: t("expand.title_volcano") })}
          </PixelButton>
        </div>
      </PanelShell>
    );
  }

  if (allExpanded) {
    return (
      <PanelShell title={t("expand.land_done")}>
        <p className="font-game text-[8px] text-white/60">
          {t("expand.all_done", { island })}
        </p>
      </PanelShell>
    );
  }

  const exp = expansions[expansion];
  const levelOk = level >= exp.minLevel;

  return (
    <PanelShell title={t("expand.title_n", { n: exp.id, max: expansions.length })}>
      <div className="space-y-3">
        <div className="bg-brown-600 p-2 border border-black/20 space-y-1">
          <p className="font-game text-[8px] text-yellow-300">{t("farm.expansion.cost")}</p>
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
          <p className="font-game text-[8px] text-yellow-300">{t("farm.expansion.adds")}</p>
          <p className="font-game text-[7px] text-white/80">
            +{exp.adds.plots} 🟫, +{exp.adds.trees} 🌳
            {(exp.adds.rocks ?? 0) > 0 && `, +${exp.adds.rocks} 🪨`}
            {(exp.adds.iron ?? 0) > 0 && `, +${exp.adds.iron} ⛓️`}
            {(exp.adds.gold ?? 0) > 0 && `, +${exp.adds.gold} 💰`}
            {(exp.adds.crimstone ?? 0) > 0 && `, +${exp.adds.crimstone} 🔴`}
            {(exp.adds.flower_beds ?? 0) > 0 && `, +${exp.adds.flower_beds} 🌸`}
            {(exp.adds.oil_reserve ?? 0) > 0 && `, +${exp.adds.oil_reserve} 🛢️`}
            {(exp.adds.greenhouse ?? 0) > 0 && `, +${exp.adds.greenhouse} 🌿`}
            {(exp.adds.obsidian_rock ?? 0) > 0 && `, +${exp.adds.obsidian_rock} ⬛`}
            {(exp.adds.sunstone_rock ?? 0) > 0 && `, +${exp.adds.sunstone_rock} 🟡`}
            {(exp.adds.lava_pit ?? 0) > 0 && `, +${exp.adds.lava_pit} 🌋`}
          </p>
        </div>
        {!levelOk && (
          <p className="font-game text-[7px] text-red-400">{t("expand.requires_lv", { n: exp.minLevel })}</p>
        )}
        <PixelButton disabled={!levelOk} onClick={startExpansion}>
          {t("expand.start")}
        </PixelButton>
      </div>
    </PanelShell>
  );
}
