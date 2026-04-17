// Bumpkin Skill Tree data
// 4 MVP trees: crops, trees, mining, animals
// Each skill: id, name, description, tree, tier, pointCost, effects

export type SkillTree = "crops" | "trees" | "mining" | "animals";

export type BoostEffectType =
  | "cropGrowTime"       // multiplier on crop grow time (negative = faster)
  | "cropYield"          // flat bonus to crop harvest
  | "specificCropGrow"   // multiplier on specific crop grow time
  | "woodYield"          // flat bonus to wood
  | "woodPercent"        // % bonus to wood
  | "chopAnimation"      // seconds off chop animation
  | "treeCooldown"       // multiplier on tree respawn cooldown
  | "stoneYield"         // flat bonus to stone
  | "ironYield"          // flat bonus to iron
  | "goldYield"          // flat bonus to gold
  | "allOreYield"        // flat bonus to all ores
  | "miningCooldown"     // multiplier on mining cooldown
  | "eggProduction"      // % bonus to egg production
  | "milkProduction"     // % bonus to milk production
  | "feedCost"           // multiplier on feed cost (negative = cheaper)
  | "allAnimalProducts"  // % bonus to all animal products
  ;

export interface BoostEffect {
  type: BoostEffectType;
  /** Optional target (e.g. specific crop id). Null = applies globally. */
  target: string | null;
  /** Numeric value: flat bonus, % as decimal (0.1 = 10%), or multiplier. */
  value: number;
}

export interface SkillDef {
  id: string;
  name: string;
  description: string;
  tree: SkillTree;
  tier: 1 | 2 | 3;
  pointCost: number;
  effects: BoostEffect[];
}

/**
 * Tier unlock requirements: points already spent in this tree.
 * T1: 0 spent, T2: 2 spent, T3: 5 spent.
 */
export const TIER_PREREQS: Record<number, number> = {
  1: 0,
  2: 2,
  3: 5,
};

export const SKILL_TREES: { id: SkillTree; label: string; icon: string }[] = [
  { id: "crops", label: "Crops", icon: "🌾" },
  { id: "trees", label: "Trees", icon: "🌳" },
  { id: "mining", label: "Mining", icon: "⛏️" },
  { id: "animals", label: "Animals", icon: "🐔" },
];

export const SKILLS: SkillDef[] = [
  // ─── Crops T1 (1pt each) ───
  {
    id: "green_thumb",
    name: "Green Thumb",
    description: "-5% crop grow time",
    tree: "crops",
    tier: 1,
    pointCost: 1,
    effects: [{ type: "cropGrowTime", target: null, value: -0.05 }],
  },
  {
    id: "seed_specialist",
    name: "Seed Specialist",
    description: "-10% all crop grow time",
    tree: "crops",
    tier: 1,
    pointCost: 1,
    effects: [{ type: "cropGrowTime", target: null, value: -0.10 }],
  },
  {
    id: "harvest_master",
    name: "Harvest Master",
    description: "+0.1 crop yield",
    tree: "crops",
    tier: 1,
    pointCost: 1,
    effects: [{ type: "cropYield", target: null, value: 0.1 }],
  },

  // ─── Crops T2 (2pt each) ───
  {
    id: "rapid_growth",
    name: "Rapid Growth",
    description: "-15% crop grow time",
    tree: "crops",
    tier: 2,
    pointCost: 2,
    effects: [{ type: "cropGrowTime", target: null, value: -0.15 }],
  },
  {
    id: "abundant_harvest",
    name: "Abundant Harvest",
    description: "+0.2 crop yield",
    tree: "crops",
    tier: 2,
    pointCost: 2,
    effects: [{ type: "cropYield", target: null, value: 0.2 }],
  },
  {
    id: "crop_whisperer",
    name: "Crop Whisperer",
    description: "-20% specific crop grow time",
    tree: "crops",
    tier: 2,
    pointCost: 2,
    effects: [{ type: "specificCropGrow", target: null, value: -0.20 }],
  },

  // ─── Crops T3 (3pt) ───
  {
    id: "master_farmer",
    name: "Master Farmer",
    description: "-25% all crop grow + 0.3 yield",
    tree: "crops",
    tier: 3,
    pointCost: 3,
    effects: [
      { type: "cropGrowTime", target: null, value: -0.25 },
      { type: "cropYield", target: null, value: 0.3 },
    ],
  },

  // ─── Trees T1 (1pt each) ───
  {
    id: "lumberjack",
    name: "Lumberjack",
    description: "+0.1 wood per tree",
    tree: "trees",
    tier: 1,
    pointCost: 1,
    effects: [{ type: "woodYield", target: null, value: 0.1 }],
  },
  {
    id: "axe_master",
    name: "Axe Master",
    description: "-1s chop animation",
    tree: "trees",
    tier: 1,
    pointCost: 1,
    effects: [{ type: "chopAnimation", target: null, value: -1 }],
  },
  {
    id: "woodcutters_spirit",
    name: "Woodcutter's Spirit",
    description: "+5% wood yield",
    tree: "trees",
    tier: 1,
    pointCost: 1,
    effects: [{ type: "woodPercent", target: null, value: 0.05 }],
  },

  // ─── Trees T2 (2pt each) ───
  {
    id: "forest_bounty",
    name: "Forest Bounty",
    description: "+0.2 wood per tree",
    tree: "trees",
    tier: 2,
    pointCost: 2,
    effects: [{ type: "woodYield", target: null, value: 0.2 }],
  },
  {
    id: "efficient_chopping",
    name: "Efficient Chopping",
    description: "-10% tree cooldown",
    tree: "trees",
    tier: 2,
    pointCost: 2,
    effects: [{ type: "treeCooldown", target: null, value: -0.10 }],
  },

  // ─── Trees T3 (3pt) ───
  {
    id: "tree_whisperer",
    name: "Tree Whisperer",
    description: "+0.5 wood, -20% tree cooldown",
    tree: "trees",
    tier: 3,
    pointCost: 3,
    effects: [
      { type: "woodYield", target: null, value: 0.5 },
      { type: "treeCooldown", target: null, value: -0.20 },
    ],
  },

  // ─── Mining T1 (1pt each) ───
  {
    id: "prospector",
    name: "Prospector",
    description: "+0.1 stone per rock",
    tree: "mining",
    tier: 1,
    pointCost: 1,
    effects: [{ type: "stoneYield", target: null, value: 0.1 }],
  },
  {
    id: "iron_touch",
    name: "Iron Touch",
    description: "+0.1 iron per node",
    tree: "mining",
    tier: 1,
    pointCost: 1,
    effects: [{ type: "ironYield", target: null, value: 0.1 }],
  },
  {
    id: "gold_sense",
    name: "Gold Sense",
    description: "+0.1 gold per node",
    tree: "mining",
    tier: 1,
    pointCost: 1,
    effects: [{ type: "goldYield", target: null, value: 0.1 }],
  },

  // ─── Mining T2 (2pt each) ───
  {
    id: "deep_mining",
    name: "Deep Mining",
    description: "+0.2 to all ores",
    tree: "mining",
    tier: 2,
    pointCost: 2,
    effects: [{ type: "allOreYield", target: null, value: 0.2 }],
  },
  {
    id: "ore_specialist",
    name: "Ore Specialist",
    description: "-15% mining cooldown",
    tree: "mining",
    tier: 2,
    pointCost: 2,
    effects: [{ type: "miningCooldown", target: null, value: -0.15 }],
  },

  // ─── Mining T3 (3pt) ───
  {
    id: "master_miner",
    name: "Master Miner",
    description: "+0.5 all ores, -25% cooldown",
    tree: "mining",
    tier: 3,
    pointCost: 3,
    effects: [
      { type: "allOreYield", target: null, value: 0.5 },
      { type: "miningCooldown", target: null, value: -0.25 },
    ],
  },

  // ─── Animals T1 (1pt each) ───
  {
    id: "chicken_whisperer",
    name: "Chicken Whisperer",
    description: "+10% egg production",
    tree: "animals",
    tier: 1,
    pointCost: 1,
    effects: [{ type: "eggProduction", target: null, value: 0.10 }],
  },
  {
    id: "cow_handler",
    name: "Cow Handler",
    description: "+10% milk production",
    tree: "animals",
    tier: 1,
    pointCost: 1,
    effects: [{ type: "milkProduction", target: null, value: 0.10 }],
  },
  {
    id: "animal_friend",
    name: "Animal Friend",
    description: "-5% feed cost",
    tree: "animals",
    tier: 1,
    pointCost: 1,
    effects: [{ type: "feedCost", target: null, value: -0.05 }],
  },

  // ─── Animals T2 (2pt each) ───
  {
    id: "barn_manager",
    name: "Barn Manager",
    description: "+20% all animal products",
    tree: "animals",
    tier: 2,
    pointCost: 2,
    effects: [{ type: "allAnimalProducts", target: null, value: 0.20 }],
  },
  {
    id: "efficient_feeding",
    name: "Efficient Feeding",
    description: "-15% feed cost",
    tree: "animals",
    tier: 2,
    pointCost: 2,
    effects: [{ type: "feedCost", target: null, value: -0.15 }],
  },

  // ─── Animals T3 (3pt) ───
  {
    id: "animal_master",
    name: "Animal Master",
    description: "+30% all products, -25% feed",
    tree: "animals",
    tier: 3,
    pointCost: 3,
    effects: [
      { type: "allAnimalProducts", target: null, value: 0.30 },
      { type: "feedCost", target: null, value: -0.25 },
    ],
  },
];

/** Lookup a skill by id. */
export function getSkillDef(id: string): SkillDef | undefined {
  return SKILLS.find((s) => s.id === id);
}

/** Get all skills for a given tree. */
export function getSkillsByTree(tree: SkillTree): SkillDef[] {
  return SKILLS.filter((s) => s.tree === tree);
}
