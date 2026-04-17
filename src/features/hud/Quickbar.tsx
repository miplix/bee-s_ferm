import { useStore } from "../../state/store";
import { visibleQuickbar } from "../../domain/inventory/quickbar";

/** Emoji/icon for known item types */
function itemIcon(id: string): string {
  // Seeds
  if (id.endsWith("_seed")) {
    const crop = id.replace("_seed", "");
    const icons: Record<string, string> = {
      sunflower: "🌻", potato: "🥔", pumpkin: "🎃", carrot: "🥕",
      cabbage: "🥬", beetroot: "🫒", cauliflower: "🥦", parsnip: "🌰",
      radish: "🔴", wheat: "🌾", kale: "🥗", corn: "🌽",
    };
    return icons[crop] ?? "🌱";
  }
  // Tools
  const toolIcons: Record<string, string> = {
    axe: "🪓", stone_pickaxe: "⛏️", iron_pickaxe: "⛏️", gold_pickaxe: "⛏️",
  };
  if (toolIcons[id]) return toolIcons[id];
  // Resources
  const resIcons: Record<string, string> = {
    wood: "🪵", stone: "🪨", iron: "⛓️", gold: "✨",
    egg: "🥚", milk: "🥛", honey: "🍯",
    sunflower: "🌻", potato: "🥔", pumpkin: "🎃", carrot: "🥕",
    cabbage: "🥬", wheat: "🌾", kale: "🥗",
  };
  return resIcons[id] ?? "📦";
}

function shortName(id: string): string {
  return id
    .replace("_seed", "")
    .replace("_pickaxe", " pick")
    .slice(0, 6);
}

export function Quickbar() {
  const quickbar = useStore((s) => s.quickbar);
  const inventory = useStore((s) => s.inventory);
  const selectedTool = useStore((s) => s.selectedTool);
  const selectTool = useStore((s) => s.selectTool);

  const visible = visibleQuickbar(quickbar, inventory);

  if (visible.length === 0) return null;

  return (
    <div className="fixed right-2 top-[60px] z-40 flex flex-col gap-1">
      {visible.map((id) => {
        const qty = inventory[id] ?? 0;
        const isSelected = selectedTool === id;
        const isSeedOrTool = id.endsWith("_seed") || ["axe", "stone_pickaxe", "iron_pickaxe", "gold_pickaxe"].includes(id);

        return (
          <button
            key={id}
            onClick={() => isSeedOrTool ? selectTool(isSelected ? null : id) : undefined}
            className={`flex flex-col items-center justify-center w-[48px] h-[48px]
              border-2 border-black shadow-[2px_2px_0px_#000]
              ${isSelected
                ? "bg-yellow-600 border-yellow-400"
                : "bg-brown-600 hover:bg-brown-500"}
              ${isSeedOrTool ? "cursor-pointer" : "cursor-default"}`}
          >
            <span className="text-base leading-none">{itemIcon(id)}</span>
            <span className="font-game text-[6px] text-white/80 leading-none mt-0.5">
              {qty}
            </span>
          </button>
        );
      })}
    </div>
  );
}
