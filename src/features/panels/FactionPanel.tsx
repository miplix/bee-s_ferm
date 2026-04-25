import { useStore } from "../../state/store";
import { PanelShell } from "./PanelShell";
import { PixelButton } from "../shared/PixelButton";
import { FACTIONS } from "../../data/factions.data";

export function FactionPanel() {
  const faction = useStore((s) => s.faction);
  const joinFaction = useStore((s) => s.joinFaction);

  return (
    <PanelShell title="Фракции">
      {faction ? (
        <ActiveFaction factionId={faction} />
      ) : (
        <FactionPicker onJoin={joinFaction} />
      )}
    </PanelShell>
  );
}

function ActiveFaction({ factionId }: { factionId: string }) {
  const def = FACTIONS.find((f) => f.id === factionId);
  if (!def) return null;

  return (
    <div className="text-center space-y-3">
      <div className="text-4xl">{def.emoji}</div>
      <h3 className="font-game text-[10px] text-yellow-300">{def.name}</h3>
      <p className="font-game text-[7px] text-green-400">{def.description}</p>
      <p className="font-game text-[6px] text-white/50">
        Вы — гордый член фракции {def.name}!
      </p>
    </div>
  );
}

function FactionPicker({ onJoin }: { onJoin: (id: string) => void }) {
  return (
    <div className="space-y-3">
      <p className="font-game text-[7px] text-white/70 text-center mb-2">
        Выберите фракцию. Выбор необратим!
      </p>
      {FACTIONS.map((f) => (
        <div
          key={f.id}
          className="p-2 border border-black/20 rounded bg-brown-600"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{f.emoji}</span>
            <span className="font-game text-[8px] text-white">{f.name}</span>
          </div>
          <p className="font-game text-[6px] text-white/60 mb-2">
            {f.description}
          </p>
          <PixelButton
            variant="primary"
            onClick={() => onJoin(f.id)}
            className="w-full !text-[7px]"
          >
            Вступить в {f.name}
          </PixelButton>
        </div>
      ))}
    </div>
  );
}
