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
      <PanelShell title="Inventory">
        <p className="font-game text-[8px] text-white/50">Empty</p>
      </PanelShell>
    );
  }

  // Group items
  const seeds = entries.filter(([id]) => id.endsWith("_seed"));
  const tools = entries.filter(([id]) => ["axe", "stone_pickaxe", "iron_pickaxe", "gold_pickaxe"].includes(id));
  const meals = entries.filter(([id]) => id.startsWith("meal_"));
  const resources = entries.filter(([id]) =>
    !id.endsWith("_seed") &&
    !["axe", "stone_pickaxe", "iron_pickaxe", "gold_pickaxe"].includes(id) &&
    !id.startsWith("meal_")
  );

  return (
    <PanelShell title="Inventory">
      <div className="space-y-3">
        {tools.length > 0 && (
          <Section title="Tools">
            {tools.map(([id, qty]) => (
              <ItemRow key={id} id={id} qty={qty}
                action={
                  <PixelButton
                    variant={selectedTool === id ? "danger" : "secondary"}
                    onClick={() => selectTool(selectedTool === id ? null : id)}
                  >
                    {selectedTool === id ? "Drop" : "Use"}
                  </PixelButton>
                }
              />
            ))}
          </Section>
        )}

        {seeds.length > 0 && (
          <Section title="Seeds">
            {seeds.map(([id, qty]) => (
              <ItemRow key={id} id={id} qty={qty}
                action={
                  <PixelButton
                    variant={selectedTool === id ? "danger" : "secondary"}
                    onClick={() => selectTool(selectedTool === id ? null : id)}
                  >
                    {selectedTool === id ? "Drop" : "Use"}
                  </PixelButton>
                }
              />
            ))}
          </Section>
        )}

        {resources.length > 0 && (
          <Section title="Resources">
            {resources.map(([id, qty]) => (
              <ItemRow key={id} id={id} qty={qty} />
            ))}
          </Section>
        )}

        {meals.length > 0 && (
          <Section title="Meals">
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
    axe: "🪓", stone_pickaxe: "⛏️", iron_pickaxe: "⛏️", gold_pickaxe: "⛏️",
    wood: "🪵", stone: "🪨", iron: "⛓️", gold: "✨",
    egg: "🥚", milk: "🥛", honey: "🍯",
    sunflower: "🌻", potato: "🥔", pumpkin: "🎃", carrot: "🥕",
    cabbage: "🥬", beetroot: "🫒", cauliflower: "🥦", parsnip: "🌰",
    radish: "🔴", wheat: "🌾", kale: "🥗", corn: "🌽",
  };
  if (id.endsWith("_seed")) {
    const crop = id.replace("_seed", "");
    return icons[crop] ?? "🌱";
  }
  if (id.startsWith("meal_")) return "🍽️";
  return icons[id] ?? "📦";
}

function formatItemName(id: string): string {
  return id
    .replace("meal_", "")
    .replace(/_seed$/, " Seed")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
