import { useStore } from "../../state/store";
import { selectLevel } from "../../state/selectors";
import { getExpansionList, ISLAND_TRANSITIONS } from "../../data/expansions.data";
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
      <PanelShell title="Расширение...">
        <div className="space-y-3">
          <div className="bg-brown-600 p-2 border border-black/20 text-center">
            <span className="text-2xl">🏗️</span>
            <p className="font-game text-[8px] text-white mt-1">Расширение {pendingExpansion.expansionIndex + 1}</p>
            <Progress value={prog} color="bg-yellow-400" className="mt-2" />
            <p className="font-game text-[7px] text-yellow-300 mt-1">
              {ready ? "Готово!" : fmtDuration(rem)}
            </p>
          </div>
          {ready && <PixelButton onClick={completeExpansion}>Завершить</PixelButton>}
        </div>
      </PanelShell>
    );
  }

  // Travel: Basic → Spring
  if (allExpanded && island === "basic") {
    const req = ISLAND_TRANSITIONS.spring;
    const goldHave = inventory.gold ?? 0;
    const levelOk = level >= req.minLevel;
    return (
      <PanelShell title="Весенний остров">
        <div className="space-y-3">
          <p className="font-game text-[8px] text-white">
            Базовый остров полностью освоен! Отправляйтесь на Весенний остров.
          </p>
          <div className="bg-brown-600 p-2 border border-black/20 space-y-1">
            <p className="font-game text-[7px] text-yellow-300">Стоимость: {req.gold} золота</p>
            <p className="font-game text-[6px] text-white/50">У вас: {goldHave}</p>
            {!levelOk && <p className="font-game text-[7px] text-red-400">Требуется уровень {req.minLevel}</p>}
          </div>
          <PixelButton disabled={goldHave < req.gold || !levelOk} onClick={travelToSpring}>
            Отплыть на Spring Island
          </PixelButton>
        </div>
      </PanelShell>
    );
  }

  // Travel: Spring → Desert
  if (allExpanded && island === "spring") {
    const req = ISLAND_TRANSITIONS.desert;
    const csHave = inventory.crimstone ?? 0;
    const levelOk = level >= req.minLevel;
    return (
      <PanelShell title="Пустынный остров">
        <div className="space-y-3">
          <p className="font-game text-[8px] text-white">
            Весенний остров полностью освоен! Откройте Пустынный остров.
          </p>
          <div className="bg-brown-600 p-2 border border-black/20 space-y-1">
            <p className="font-game text-[7px] text-yellow-300">Стоимость: {req.crimstone} 🔴 Crimstone</p>
            <p className="font-game text-[6px] text-white/50">У вас: {csHave}</p>
            {!levelOk && <p className="font-game text-[7px] text-red-400">Требуется уровень {req.minLevel}</p>}
          </div>
          <PixelButton disabled={csHave < req.crimstone || !levelOk} onClick={travelToDesert}>
            Отплыть на Desert Island
          </PixelButton>
        </div>
      </PanelShell>
    );
  }

  // Travel: Desert → Volcano
  if (allExpanded && island === "desert") {
    const req = ISLAND_TRANSITIONS.volcano;
    const oilHave = inventory.oil ?? 0;
    const levelOk = level >= req.minLevel;
    return (
      <PanelShell title="Вулканический остров">
        <div className="space-y-3">
          <p className="font-game text-[8px] text-white">
            Пустынный остров полностью освоен! Откройте Вулканический остров.
          </p>
          <div className="bg-brown-600 p-2 border border-black/20 space-y-1">
            <p className="font-game text-[7px] text-yellow-300">Стоимость: {req.oil} 🛢️ Нефти</p>
            <p className="font-game text-[6px] text-white/50">У вас: {oilHave}</p>
            {!levelOk && <p className="font-game text-[7px] text-red-400">Требуется уровень {req.minLevel}</p>}
          </div>
          <PixelButton disabled={oilHave < req.oil || !levelOk} onClick={travelToVolcano}>
            Отплыть на Volcano Island
          </PixelButton>
        </div>
      </PanelShell>
    );
  }

  if (allExpanded) {
    return (
      <PanelShell title="Земля">
        <p className="font-game text-[8px] text-white/60">
          Все расширения на {island} завершены.
        </p>
      </PanelShell>
    );
  }

  const exp = expansions[expansion];
  const levelOk = level >= exp.minLevel;

  return (
    <PanelShell title={`Расширение ${exp.id}/${expansions.length}`}>
      <div className="space-y-3">
        <div className="bg-brown-600 p-2 border border-black/20 space-y-1">
          <p className="font-game text-[8px] text-yellow-300">Стоимость:</p>
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
          <p className="font-game text-[8px] text-yellow-300">Добавляет:</p>
          <p className="font-game text-[7px] text-white/80">
            +{exp.adds.plots} грядок, +{exp.adds.trees} деревьев
            {(exp.adds.rocks ?? 0) > 0 && `, +${exp.adds.rocks} камень`}
            {(exp.adds.iron ?? 0) > 0 && `, +${exp.adds.iron} железо`}
            {(exp.adds.gold ?? 0) > 0 && `, +${exp.adds.gold} золото`}
            {(exp.adds.crimstone ?? 0) > 0 && `, +${exp.adds.crimstone} 🔴 crimstone`}
            {(exp.adds.flower_beds ?? 0) > 0 && `, +${exp.adds.flower_beds} 🌸 цветники`}
            {(exp.adds.oil_reserve ?? 0) > 0 && `, +${exp.adds.oil_reserve} 🛢️ нефть`}
            {(exp.adds.greenhouse ?? 0) > 0 && `, +${exp.adds.greenhouse} 🌿 теплица`}
            {(exp.adds.obsidian_rock ?? 0) > 0 && `, +${exp.adds.obsidian_rock} ⬛ обсидиан`}
            {(exp.adds.sunstone_rock ?? 0) > 0 && `, +${exp.adds.sunstone_rock} 🟡 sunstone`}
            {(exp.adds.lava_pit ?? 0) > 0 && `, +${exp.adds.lava_pit} 🌋 лавовая яма`}
          </p>
        </div>
        {!levelOk && (
          <p className="font-game text-[7px] text-red-400">Требуется уровень {exp.minLevel}</p>
        )}
        <PixelButton disabled={!levelOk} onClick={startExpansion}>
          Начать строительство
        </PixelButton>
      </div>
    </PanelShell>
  );
}
