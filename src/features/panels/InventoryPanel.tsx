import { useStore } from "../../state/store";
import { PanelShell } from "./PanelShell";
import { PixelButton } from "../shared/PixelButton";
import { getFertilizerDef } from "../../data/composters.data";
import { useT } from "../../i18n/useT";
import { getItemName } from "../../i18n/itemNames";
import type { Language } from "../../i18n/types";

const FERTILIZER_IDS = new Set(["sprout_mix", "fruitful_blend", "rapid_root"]);

export function InventoryPanel() {
  const t = useT();
  const lang = useStore((s) => (s as any).language as Language) ?? "ru";
  const inventory = useStore((s) => s.inventory);
  const selectTool = useStore((s) => s.selectTool);
  const selectedTool = useStore((s) => s.selectedTool);
  const placedMutants = useStore((s) => s.placedMutants ?? []);
  const placeMutant = useStore((s) => s.placeMutant);
  const unplaceMutant = useStore((s) => s.unplaceMutant);

  const placedCounts: Record<string, number> = {};
  for (const id of placedMutants) {
    placedCounts[id] = (placedCounts[id] ?? 0) + 1;
  }
  const placedEntries = Object.entries(placedCounts);

  const entries = Object.entries(inventory)
    .filter(([, qty]) => qty > 0)
    .sort(([a], [b]) => a.localeCompare(b));

  if (entries.length === 0) {
    return (
      <PanelShell title={t("inv.title")}>
        <p className="font-game text-[8px] text-white/50">{t("inv.empty")}</p>
      </PanelShell>
    );
  }

  const seeds = entries.filter(([id]) => id.endsWith("_seed"));
  const tools = entries.filter(([id]) => ["axe", "stone_pickaxe", "iron_pickaxe", "gold_pickaxe", "fishing_rod"].includes(id));
  const fertilizers = entries.filter(([id]) => FERTILIZER_IDS.has(id));
  const mutants = entries.filter(([id]) => id.startsWith("mutant_"));
  const meals = entries.filter(([id]) => id.startsWith("meal_"));
  const resources = entries.filter(([id]) =>
    !id.endsWith("_seed") &&
    !["axe", "stone_pickaxe", "iron_pickaxe", "gold_pickaxe", "fishing_rod"].includes(id) &&
    !FERTILIZER_IDS.has(id) &&
    !id.startsWith("mutant_") &&
    !id.startsWith("meal_")
  );

  return (
    <PanelShell title={t("inv.title")}>
      <div className="space-y-3">
        {tools.length > 0 && (
          <Section title={t("inv.section.tools")}>
            {tools.map(([id, qty]) => (
              <ItemRow key={id} id={id} qty={qty} lang={lang}
                action={
                  <PixelButton
                    variant={selectedTool === id ? "danger" : "secondary"}
                    onClick={() => selectTool(selectedTool === id ? null : id)}
                  >
                    {selectedTool === id ? t("inv.btn.unselect") : t("inv.btn.take")}
                  </PixelButton>
                }
              />
            ))}
          </Section>
        )}

        {seeds.length > 0 && (
          <Section title={t("inv.section.seeds")}>
            {seeds.map(([id, qty]) => (
              <ItemRow key={id} id={id} qty={qty} lang={lang}
                action={
                  <PixelButton
                    variant={selectedTool === id ? "danger" : "secondary"}
                    onClick={() => selectTool(selectedTool === id ? null : id)}
                  >
                    {selectedTool === id ? t("inv.btn.unselect") : t("inv.btn.take")}
                  </PixelButton>
                }
              />
            ))}
          </Section>
        )}

        {fertilizers.length > 0 && (
          <Section title={t("inv.section.fertilizers")}>
            {fertilizers.map(([id, qty]) => {
              const def = getFertilizerDef(id);
              return (
                <div key={id}>
                  <ItemRow id={id} qty={qty} lang={lang}
                    action={
                      <PixelButton
                        variant={selectedTool === id ? "danger" : "secondary"}
                        onClick={() => selectTool(selectedTool === id ? null : id)}
                      >
                        {selectedTool === id ? t("inv.btn.unselect") : t("inv.btn.take")}
                      </PixelButton>
                    }
                  />
                  {def && (
                    <p className="font-game text-[6px] text-white/50 px-1 leading-relaxed mt-0.5">
                      {def.description}
                    </p>
                  )}
                </div>
              );
            })}
            <p className="font-game text-[6px] text-white/40 mt-1">
              {t("inv.fert.hint")}
            </p>
          </Section>
        )}

        {(mutants.length > 0 || placedEntries.length > 0) && (
          <Section title={t("inv.section.mutants")}>
            <p className="font-game text-[6px] text-white/50 mb-1 leading-relaxed">
              {t("inv.mutant.hint")}
            </p>
            {mutants.map(([id, qty]) => (
              <ItemRow key={id} id={id} qty={qty} lang={lang}
                action={
                  <PixelButton variant="secondary" onClick={() => placeMutant(id)}>
                    {t("inv.btn.place")}
                  </PixelButton>
                }
              />
            ))}
            {placedEntries.length > 0 && (
              <div className="mt-2">
                <h5 className="font-game text-[7px] text-green-300 mb-1">{t("inv.mutant.placed")}</h5>
                {placedEntries.map(([id, count]) => (
                  <div key={id} className="flex items-center gap-2 bg-brown-700 p-1 border border-green-700/40">
                    <span className="text-sm">✨</span>
                    <span className="font-game text-[7px] text-white flex-1 truncate">
                      {getItemName(id, lang)} <span className="text-green-300">+{(count * 10).toFixed(0)}%</span>
                    </span>
                    <span className="font-game text-[8px] text-yellow-300 w-12 text-right">{count.toFixed(2)}</span>
                    <PixelButton variant="danger" onClick={() => unplaceMutant(id)}>
                      {t("inv.btn.unplace")}
                    </PixelButton>
                  </div>
                ))}
              </div>
            )}
          </Section>
        )}

        {resources.length > 0 && (
          <Section title={t("inv.section.resources")}>
            {resources.map(([id, qty]) => (
              <ItemRow key={id} id={id} qty={qty} lang={lang} />
            ))}
          </Section>
        )}

        {meals.length > 0 && (
          <Section title={t("inv.section.meals")}>
            {meals.map(([id, qty]) => (
              <ItemRow key={id} id={id} qty={qty} lang={lang} />
            ))}
          </Section>
        )}
      </div>
    </PanelShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-game text-[7px] text-yellow-300 mb-1">{title}</h4>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function ItemRow({ id, qty, action, lang }: { id: string; qty: number; lang: Language; action?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 bg-brown-600 p-1 border border-black/20">
      <span className="text-sm">{itemIcon(id)}</span>
      <span className="font-game text-[7px] text-white flex-1 truncate">
        {getItemName(id, lang)}
      </span>
      <span className="font-game text-[8px] text-yellow-300 w-12 text-right">
        {qty.toFixed(2)}
      </span>
      {action}
    </div>
  );
}

function itemIcon(id: string): string {
  const icons: Record<string, string> = {
    axe: "🪓", stone_pickaxe: "⛏️", iron_pickaxe: "⛏️", gold_pickaxe: "⛏️", fishing_rod: "🎣",
    wood: "🪵", stone: "🪨", iron: "⛓️", gold: "✨", crimstone: "🔴",
    oil: "🛢️", obsidian: "⬛", sunstone: "🟡",
    egg: "🥚", milk: "🥛", honey: "🍯", wool: "🧶",
    sunflower: "🌻", potato: "🥔", pumpkin: "🎃", carrot: "🥕",
    cabbage: "🥬", beetroot: "🫒", cauliflower: "🥦", parsnip: "🌰",
    radish: "🔴", wheat: "🌾", kale: "🥗", corn: "🌽",
    tomato: "🍅", lemon: "🍋", blueberry: "🫐", orange: "🍊", apple: "🍎", banana: "🍌",
    sunpetal: "🌻", bloom: "🌸", lily: "🌺",
    sprout_mix: "🌱", fruitful_blend: "🍇", rapid_root: "⚡",
    earthworm: "🪱", grub: "🐛", red_wiggler: "🪱",
  };
  if (id.endsWith("_seed")) {
    const crop = id.replace("_seed", "");
    return icons[crop] ?? "🌱";
  }
  if (id.startsWith("meal_")) return "🍽️";
  if (id.startsWith("mutant_")) return "✨";
  return icons[id] ?? "📦";
}
