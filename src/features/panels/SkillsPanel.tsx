import { useState } from "react";
import { useStore } from "../../state/store";
import { selectLevel } from "../../state/selectors";
import { PanelShell } from "./PanelShell";
import { PixelButton } from "../shared/PixelButton";
import {
  SKILL_TREES,
  getSkillsByTree,
  type SkillTree,
  type SkillDef,
} from "../../data/skills.data";
import {
  getAvailableSkillPoints,
  canLearnSkill,
  isTierUnlocked,
  pointsNeededForTier,
} from "../../domain/skills/skillEngine";
import { useT } from "../../i18n/useT";

export function SkillsPanel() {
  const t = useT();
  const [activeTree, setActiveTree] = useState<SkillTree>("crops");

  const level = useStore(selectLevel);
  const skills = useStore((s) => s.skills);
  const learnSkill = useStore((s) => s.learnSkill);

  const available = getAvailableSkillPoints(level, skills);
  const treeSkills = getSkillsByTree(activeTree);

  const tiers = [1, 2, 3] as const;

  return (
    <PanelShell title={t("skills.title")}>
      {/* Available points */}
      <div className="mb-3 text-center">
        <span className="font-game text-[9px] text-yellow-300">
          {t("skills.points", { n: available })}
        </span>
      </div>

      {/* Tree tabs */}
      <div className="flex gap-1 mb-3">
        {SKILL_TREES.map((tree) => (
          <button
            key={tree.id}
            onClick={() => setActiveTree(tree.id)}
            className={`flex-1 flex flex-col items-center py-1 border border-black/40 rounded
              ${activeTree === tree.id
                ? "bg-brown-400 border-yellow-400"
                : "bg-brown-600 hover:bg-brown-500"
              } transition-colors`}
          >
            <span className="text-sm leading-none">{tree.icon}</span>
            <span className="font-game text-[6px] text-white/70">{tree.label}</span>
          </button>
        ))}
      </div>

      {/* Tiers */}
      <div className="space-y-3">
        {tiers.map((tier) => {
          const tierSkills = treeSkills.filter((s) => s.tier === tier);
          if (tierSkills.length === 0) return null;

          const unlocked = isTierUnlocked(activeTree, tier, skills);
          const needed = pointsNeededForTier(activeTree, tier, skills);

          return (
            <div key={tier}>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-game text-[7px] text-yellow-300">
                  {t("skills.tier", { n: tier })}
                </h4>
                {!unlocked && (
                  <span className="font-game text-[6px] text-red-400">
                    {t("skills.tier_locked", { n: needed })}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                {tierSkills.map((skill) => (
                  <SkillRow
                    key={skill.id}
                    skill={skill}
                    learned={!!skills[skill.id]}
                    canLearn={canLearnSkill(skill.id, skills, level)}
                    tierLocked={!unlocked}
                    onLearn={() => learnSkill(skill.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </PanelShell>
  );
}

function SkillRow({
  skill,
  learned,
  canLearn,
  tierLocked,
  onLearn,
}: {
  skill: SkillDef;
  learned: boolean;
  canLearn: boolean;
  tierLocked: boolean;
  onLearn: () => void;
}) {
  const t = useT();
  return (
    <div
      className={`p-1.5 border border-black/20 rounded
        ${learned
          ? "bg-green-800/60 border-green-500/40"
          : tierLocked
            ? "bg-brown-700/50 opacity-50"
            : "bg-brown-600"
        }`}
    >
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-game text-[8px] text-white truncate">
              {skill.name}
            </span>
            <span className="font-game text-[6px] text-yellow-300/70 shrink-0">
              {t("skills.cost", { n: skill.pointCost })}
            </span>
          </div>
          <p className="font-game text-[6px] text-white/60 mt-0.5">
            {skill.description}
          </p>
        </div>

        {learned ? (
          <span className="font-game text-[7px] text-green-400 shrink-0 mt-0.5">
            {t("skills.learned")}
          </span>
        ) : (
          <PixelButton
            variant="primary"
            disabled={!canLearn}
            onClick={onLearn}
            className="shrink-0 !text-[7px] !px-2 !py-1"
          >
            {t("skills.learn")}
          </PixelButton>
        )}
      </div>
    </div>
  );
}
