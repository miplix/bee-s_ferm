import { useStore } from "../../state/store";
import { PanelShell } from "./PanelShell";
import { PixelButton } from "../shared/PixelButton";

export function ChorePanel() {
  const chores = useStore((s) => s.chores);
  const claimChore = useStore((s) => s.claimChore);
  const refreshChores = useStore((s) => s.refreshChores);

  const now = Date.now();
  const today = new Date(now).toISOString().slice(0, 10);

  // Auto-refresh if needed
  if (chores.lastResetDay !== today || chores.active.length === 0) {
    setTimeout(() => refreshChores(), 0);
  }

  const allClaimed = chores.active.every((c) => c.claimed);
  const claimedCount = chores.active.filter((c) => c.claimed).length;

  return (
    <PanelShell title="Задания">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 p-2 bg-brown-800 border border-black/30">
        <span className="font-game text-[8px] text-white">
          Ежедневные задания
        </span>
        <span className="font-game text-[7px] text-white/50">
          {claimedCount}/{chores.active.length} выполнено
        </span>
      </div>

      {allClaimed && (
        <div className="p-3 mb-2 bg-green-900/40 border border-green-500/30 text-center">
          <span className="font-game text-[8px] text-green-300">
            Все задания выполнены! Возвращайтесь завтра.
          </span>
        </div>
      )}

      {/* Chore list */}
      <div className="space-y-2">
        {chores.active.map((chore) => {
          const isComplete = chore.progress >= chore.requirement.qty;
          const progressPct = Math.min(
            (chore.progress / chore.requirement.qty) * 100,
            100,
          );

          return (
            <div
              key={chore.choreId}
              className={`p-2 border border-black/20 ${
                chore.claimed
                  ? "bg-brown-600/40 opacity-60"
                  : "bg-brown-600"
              }`}
            >
              {/* Description */}
              <div className="font-game text-[8px] text-white mb-1">
                {chore.description}
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-black/30 border border-black/20 mb-1">
                <div
                  className={`h-full transition-all ${
                    isComplete ? "bg-green-500" : "bg-yellow-500"
                  }`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              {/* Progress text + reward */}
              <div className="flex items-center justify-between mb-1">
                <span className="font-game text-[7px] text-white/60">
                  {chore.progress}/{chore.requirement.qty}
                </span>
                <div className="flex items-center gap-1">
                  {chore.reward.coins > 0 && (
                    <span className="font-game text-[7px] text-yellow-300">
                      {chore.reward.coins}c
                    </span>
                  )}
                  {chore.reward.xp > 0 && (
                    <span className="font-game text-[7px] text-blue-300">
                      +{chore.reward.xp} XP
                    </span>
                  )}
                </div>
              </div>

              {/* Claim button */}
              {!chore.claimed && (
                <PixelButton
                  disabled={!isComplete}
                  onClick={() => claimChore(chore.choreId)}
                >
                  {isComplete ? "Забрать!" : "В процессе..."}
                </PixelButton>
              )}
              {chore.claimed && (
                <span className="font-game text-[7px] text-green-400">
                  Получено!
                </span>
              )}
            </div>
          );
        })}
      </div>
    </PanelShell>
  );
}
