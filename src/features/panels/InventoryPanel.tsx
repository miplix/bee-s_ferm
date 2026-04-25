import { useStore } from "../../state/store";
import { PanelShell } from "./PanelShell";
import { PixelButton } from "../shared/PixelButton";

export function InventoryPanel() {
  const inventory = useStore((s) => s.inventory);
  const selectTool = useStore((s) => s.selectTool);
  const selectedTool = useStore((s) => s.selectedTool);

  const entries = Object.entries(inventory)
    .filter(([, qty]) => qty > 0)
    .sort(([a], [b]) => a.localeCompare(b));

  if (entries.length === 0) {
    return (
      <PanelShell title="Инвентарь">
        <p className="font-game text-[8px] text-white/50">Пусто</p>
      </PanelShell>
    );
  }

  const seeds = entries.filter(([id]) => id.endsWith("_seed"));
  const tools = entries.filter(([id]) => ["axe", "stone_pickaxe", "iron_pickaxe", "gold_pickaxe", "fishing_rod"].includes(id));
  const meals = entries.filter(([id]) => id.startsWith("meal_"));
  const resources = entries.filter(([id]) =>
    !id.endsWith("_seed") &&
    !["axe", "stone_pickaxe", "iron_pickaxe", "gold_pickaxe", "fishing_rod"].includes(id) &&
    !id.startsWith("meal_")
  );

  return (
    <PanelShell title="Инвентарь">
      <div className="space-y-3">
        {tools.length > 0 && (
          <Section title="Инструменты">
            {tools.map(([id, qty]) => (
              <ItemRow key={id} id={id} qty={qty}
                action={
                  <PixelButton
                    variant={selectedTool === id ? "danger" : "secondary"}
                    onClick={() => selectTool(selectedTool === id ? null : id)}
                  >
                    {selectedTool === id ? "Убрать" : "Взять"}
                  </PixelButton>
                }
              />
            ))}
          </Section>
        )}

        {seeds.length > 0 && (
          <Section title="Семена">
            {seeds.map(([id, qty]) => (
              <ItemRow key={id} id={id} qty={qty}
                action={
                  <PixelButton
                    variant={selectedTool === id ? "danger" : "secondary"}
                    onClick={() => selectTool(selectedTool === id ? null : id)}
                  >
                    {selectedTool === id ? "Убрать" : "Взять"}
                  </PixelButton>
                }
              />
            ))}
          </Section>
        )}

        {resources.length > 0 && (
          <Section title="Ресурсы">
            {resources.map(([id, qty]) => (
              <ItemRow key={id} id={id} qty={qty} />
            ))}
          </Section>
        )}

        {meals.length > 0 && (
          <Section title="Блюда">
            {meals.map(([id, qty]) => (
              <ItemRow key={id} id={id} qty={qty} />
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

function ItemRow({ id, qty, action }: { id: string; qty: number; action?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 bg-brown-600 p-1 border border-black/20">
      <span className="text-sm">{itemIcon(id)}</span>
      <span className="font-game text-[7px] text-white flex-1 truncate">
        {formatItemName(id)}
      </span>
      <span className="font-game text-[8px] text-yellow-300 w-8 text-right">{qty}</span>
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
  };
  if (id.endsWith("_seed")) {
    const crop = id.replace("_seed", "");
    return icons[crop] ?? "🌱";
  }
  if (id.startsWith("meal_")) return "🍽️";
  if (id.startsWith("mutant_")) return "✨";
  return icons[id] ?? "📦";
}

const RU_NAMES: Record<string, string> = {
  wood: "Дерево", stone: "Камень", iron: "Железо", gold: "Золото",
  crimstone: "Кримстоун", oil: "Нефть", obsidian: "Обсидиан", sunstone: "Сансто́ун",
  egg: "Яйцо", milk: "Молоко", honey: "Мёд", wool: "Шерсть",
  axe: "Топор", stone_pickaxe: "Деревянная кирка", iron_pickaxe: "Каменная кирка",
  gold_pickaxe: "Железная кирка", fishing_rod: "Удочка",
  sunflower: "Подсолнух", potato: "Картофель", pumpkin: "Тыква", carrot: "Морковь",
  cabbage: "Капуста", beetroot: "Свёкла", cauliflower: "Цветная капуста",
  parsnip: "Пастернак", radish: "Редиска", wheat: "Пшеница", kale: "Кейл", corn: "Кукуруза",
  tomato: "Томат", lemon: "Лимон", blueberry: "Черника", orange: "Апельсин",
  apple: "Яблоко", banana: "Банан",
  sunpetal: "Солнечный лепесток", bloom: "Цветение", lily: "Лилия",
};

function formatItemName(id: string): string {
  if (id.endsWith("_seed")) {
    const crop = id.replace("_seed", "");
    return (RU_NAMES[crop] ?? crop) + " (семя)";
  }
  if (id.startsWith("meal_")) return "Блюдо: " + id.replace("meal_", "").replace(/_/g, " ");
  if (id.startsWith("mutant_")) return "Мутант: " + id.replace("mutant_", "");
  return RU_NAMES[id] ?? id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
