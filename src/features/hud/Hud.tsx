import { useStore } from "../../state/store";
import { selectLevel, selectXpProgress } from "../../state/selectors";
import { Progress } from "../shared/Progress";
import { getCurrentSeason, daysLeftInSeason, SEASON_INFO } from "../../domain/seasons/seasons";

export function Hud() {
  const level = useStore(selectLevel);
  const xpProg = useStore(selectXpProgress);
  const coins = useStore((s) => s.coins);
  const pollen = useStore((s) => s.pollen);
  const gems = useStore((s) => s.gems);
  const activePanel = useStore((s) => s.activePanel);
  const setPanel = useStore((s) => s.setPanel);
  const moveMode = useStore((s) => s.moveMode);
  const toggleMoveMode = useStore((s) => s.toggleMoveMode);
  const island = useStore((s) => s.island);
  const seasonAnchor = useStore((s) => s.seasonAnchor);

  const now = Date.now();
  // Basic island is always Spring (per TZ 3.4 / SFL)
  const season = island === "basic" ? "spring" as const : getCurrentSeason(now, seasonAnchor);
  const seasonInfo = SEASON_INFO[season];
  const daysLeft = island === "basic" ? Infinity : daysLeftInSeason(now, seasonAnchor);

  return (
    <div className="flex items-center gap-2 px-2 py-1 bg-brown-700 border-b-2 border-black h-[52px] select-none">
      {/* Level + XP */}
      <div className="flex flex-col gap-0.5 min-w-[80px]">
        <span className="font-game text-[8px] text-yellow-300">
          Lv.{level}
        </span>
        <Progress value={xpProg} color="bg-yellow-400" />
      </div>

      {/* Coins */}
      <div className="flex items-center gap-1">
        <img src="/icons/coin.png" alt="" className="w-4 h-4" />
        <span className="font-game text-[8px] text-white">
          {coins.toFixed(2)}
        </span>
      </div>

      {/* Pollen */}
      <div className="flex items-center gap-1">
        <span className="text-sm">🌼</span>
        <span className="font-game text-[8px] text-white">
          {pollen.toFixed(1)}
        </span>
      </div>

      {/* Gems */}
      <div className="flex items-center gap-1">
        <span className="text-sm">💎</span>
        <span className="font-game text-[8px] text-white">
          {gems}
        </span>
      </div>

      {/* Season (only shown on non-basic islands, but always track) */}
      <div className="flex items-center gap-1">
        <span className="text-sm">{seasonInfo.emoji}</span>
        <span className={`font-game text-[7px] ${seasonInfo.color}`}>
          {seasonInfo.name}
        </span>
        {daysLeft !== Infinity && (
          <span className="font-game text-[6px] text-white/40">
            {daysLeft}d
          </span>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Move mode toggle */}
      <button
        onClick={toggleMoveMode}
        className={`flex flex-col items-center px-2 py-0.5 border border-black/40 rounded
          ${moveMode ? "bg-orange-600 border-orange-400" : "bg-brown-600 hover:bg-brown-500"}
          transition-colors`}
        title="Move objects"
      >
        <span className="text-sm leading-none">✋</span>
        <span className="font-game text-[6px] text-white/70">Move</span>
      </button>

      {/* FIXED_VARIABLES: HUD only Move, Skills, Inv — Faction/Pets via map buildings */}

      {/* Skills button */}
      <button
        onClick={() => setPanel(activePanel === "skills" ? null : "skills")}
        className={`flex flex-col items-center px-2 py-0.5 border border-black/40 rounded
          ${activePanel === "skills" ? "bg-brown-400" : "bg-brown-600 hover:bg-brown-500"}
          transition-colors`}
        title="Skills"
      >
        <span className="text-sm leading-none">&#x2B50;</span>
        <span className="font-game text-[6px] text-white/70">Skills</span>
      </button>

      {/* Inventory button */}
      <button
        onClick={() => setPanel(activePanel === "inventory" ? null : "inventory")}
        className={`flex flex-col items-center px-2 py-0.5 border border-black/40 rounded
          ${activePanel === "inventory" ? "bg-brown-400" : "bg-brown-600 hover:bg-brown-500"}
          transition-colors`}
        title="Inventory"
      >
        <span className="text-sm leading-none">🎒</span>
        <span className="font-game text-[6px] text-white/70">Inv</span>
      </button>
    </div>
  );
}
