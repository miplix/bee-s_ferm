import { useStore } from "../../state/store";
import { selectLevel, selectXpProgress } from "../../state/selectors";
import { Progress } from "../shared/Progress";
import { getCurrentSeason, daysLeftInSeason, SEASON_INFO } from "../../domain/seasons/seasons";
import { useT } from "../../i18n/useT";

export function Hud() {
  const t = useT();
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
    // Mobile: 2 ряда (ресурсы сверху, кнопки снизу). sm+: 1 ряд как было.
    <div className="bg-brown-700 border-b-2 border-black select-none px-2 py-1
                    flex flex-col gap-1
                    sm:flex-row sm:items-center sm:gap-2 sm:h-[52px]">
      {/* Ряд 1 на мобиле / левый блок на десктопе: ресурсы */}
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap min-w-0 flex-1">
        {/* Level + XP */}
        <div className="flex flex-col gap-0.5 min-w-[64px] sm:min-w-[80px]">
          <span className="font-game text-[7px] sm:text-[8px] text-yellow-300">{t("hud.level", { n: level })}</span>
          <Progress value={xpProg} color="bg-yellow-400" />
        </div>

        {/* Coins */}
        <div className="flex items-center gap-1">
          <img src="/icons/coin.png" alt="" className="w-4 h-4" />
          <span className="font-game text-[7px] sm:text-[8px] text-white">{coins.toFixed(2)}</span>
        </div>

        {/* Pollen + кнопка пополнения */}
        <div className="flex items-center gap-1">
          <img src="/icons/pollen.png" alt="" className="w-4 h-4" />
          <span className="font-game text-[7px] sm:text-[8px] text-white">{pollen.toFixed(2)}</span>
          <button
            onClick={() => setPanel(activePanel === "pollen_topup" ? null : "pollen_topup" as any)}
            className="font-game text-[8px] leading-none px-1 py-0.5 bg-yellow-700 hover:bg-yellow-600 border border-black text-white"
            title={t("hud.pollen_topup_title")}
            aria-label={t("hud.pollen_topup_aria")}
          >+</button>
        </div>

        {/* Gems */}
        <div className="flex items-center gap-1">
          <span className="text-sm">💎</span>
          <span className="font-game text-[7px] sm:text-[8px] text-white">{gems.toFixed(2)}</span>
        </div>

        {/* Season */}
        <div className="flex items-center gap-1">
          <span className="text-sm">{seasonInfo.emoji}</span>
          <span className={`font-game text-[7px] ${seasonInfo.color}`}>{t(`season.${season}`)}</span>
          {daysLeft !== Infinity && (
            <span className="font-game text-[6px] text-white/40">{t("days_left", { n: daysLeft })}</span>
          )}
        </div>
      </div>

      {/* Ряд 2 на мобиле / правый блок на десктопе: кнопки */}
      <div className="flex items-center gap-1 sm:gap-2 justify-end">
        <button
          onClick={toggleMoveMode}
          className={`flex flex-col items-center px-2 py-0.5 border border-black/40 rounded
            ${moveMode ? "bg-orange-600 border-orange-400" : "bg-brown-600 hover:bg-brown-500"}`}
          title={t("hud.move_title")}
        >
          <span className="text-sm leading-none">✋</span>
          <span className="font-game text-[6px] text-white/70">{t("hud.move")}</span>
        </button>

        <button
          onClick={() => setPanel(activePanel === "skills" ? null : "skills")}
          className={`flex flex-col items-center px-2 py-0.5 border border-black/40 rounded
            ${activePanel === "skills" ? "bg-brown-400" : "bg-brown-600 hover:bg-brown-500"}`}
          title={t("hud.skills_title")}
        >
          <span className="text-sm leading-none">&#x2B50;</span>
          <span className="font-game text-[6px] text-white/70">{t("hud.skills")}</span>
        </button>

        <button
          onClick={() => setPanel(activePanel === "inventory" ? null : "inventory")}
          className={`flex flex-col items-center px-2 py-0.5 border border-black/40 rounded
            ${activePanel === "inventory" ? "bg-brown-400" : "bg-brown-600 hover:bg-brown-500"}`}
          title={t("hud.inventory_title")}
        >
          <span className="text-sm leading-none">🎒</span>
          <span className="font-game text-[6px] text-white/70">{t("hud.inventory")}</span>
        </button>

        <button
          onClick={() => setPanel(activePanel === "settings" ? null : "settings")}
          className={`flex flex-col items-center px-2 py-0.5 border border-black/40 rounded
            ${activePanel === "settings" ? "bg-brown-400" : "bg-brown-600 hover:bg-brown-500"}`}
          title={t("hud.settings_title")}
        >
          <span className="text-sm leading-none">⚙️</span>
          <span className="font-game text-[6px] text-white/70">{t("hud.settings")}</span>
        </button>
      </div>
    </div>
  );
}
