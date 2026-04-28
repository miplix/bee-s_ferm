export function cropStageSrc(cropId: string, prog: number, ready: boolean): string {
  if (ready) return `/crops/${cropId}/s3.png`;
  if (prog < 0.25) return `/crops/_shared/s0.png`;
  if (prog < 0.5) return `/crops/_shared/s1.png`;
  if (prog < 0.85) return `/crops/${cropId}/s2.png`;
  return `/crops/${cropId}/s3.png`;
}

export function nodeSrc(nodeType: string, exhausted: boolean): string {
  if (nodeType === "lava_pit") return "/resources/ai_lava_pit.png";
  const suffix = exhausted ? "empty" : "full";
  const map: Record<string, string> = {
    tree: `/resources/ai_tree_${suffix}.png`,
    rock: `/resources/ai_rock_${suffix}.png`,
    iron: `/resources/ai_iron_${suffix}.png`,
    gold: `/resources/ai_gold_${suffix}.png`,
    crimstone: `/resources/ai_crimstone_${suffix}.png`,
    oil_reserve: `/resources/ai_oil_reserve_${suffix}.png`,
    obsidian_rock: `/resources/ai_obsidian_${suffix}.png`,
    sunstone_rock: `/resources/ai_sunstone_${suffix}.png`,
  };
  return map[nodeType] ?? "";
}

export function buildingSrc(buildingId: string, level = 1): string {
  // Prefer AI v2 (bg removed, clean style)
  if (buildingId === "campfire") return "/buildings/ai_v3/campfire.png";
  if (buildingId === "feeder") return "/buildings/ai_v3/feeder.png";
  if (buildingId === "town_hall") return "/buildings/ai_v3/town_hall.png";
  if (buildingId === "fishing_dock") return "/buildings/ai_v3/fishing_dock.png";
  if (buildingId === "toolshed") return "/buildings/ai_v3/toolshed.png";
  if (buildingId === "bulletin_board") return "/buildings/ai_v3/bulletin_board.png";

  if (buildingId === "henhouse") {
    if (level >= 3) return "/buildings/ai_v3/henhouse_lv3.png";
    if (level >= 2) return "/buildings/ai_v3/henhouse_lv2.png";
    return "/buildings/ai_v3/henhouse_lv1.png";
  }
  if (buildingId === "barn") {
    if (level >= 3) return "/buildings/ai_v3/barn_lv3.png";
    if (level >= 2) return "/buildings/ai_v3/barn_lv2.png";
    return "/buildings/ai_v3/barn_lv1.png";
  }

  const map: Record<string, string> = {
    workbench: "/buildings/ai_v3/workbench.png",
    market: "/buildings/ai_v2/market.png",
    well: "/buildings/ai_v3/water_well.png",
    kitchen: "/buildings/ai_v3/kitchen.png",
    bakery: "/buildings/ai_v3/bakery.png",
    crop_machine: "/buildings/ai_v3/crop_machine.png",
    greenhouse: "/buildings/ai_v3/greenhouse.png",
    pet_house: "/buildings/ai_v3/pet_house.png",
    trading_post: "/buildings/ai_v3/trading_post.png",
  };
  return map[buildingId] ?? "";
}

/** Fruit growth stage sprite by progress + harvests-left.
 * Stages: empty patch / sapling / growing / fruiting / stump (no harvests left, awaiting cut). */
export function fruitStageSrc(fruitId: string, growing: boolean, prog: number, ready: boolean, harvestsLeft: number): string {
  if (!growing) {
    if (harvestsLeft === 0) return `/stages/fruit_stump.png`; // tree spent → needs cut
    return `/plot/fruit_patch_empty.png`;
  }
  if (ready) {
    // Use existing SFL "ready" sprites where available, else generated fruiting
    const sflReady: Record<string, string> = {
      tomato: "/fruits/tomato/ready.webp",
      lemon: "/fruits/lemon/ready.webp",
      banana: "/fruits/banana/ready.png",
    };
    return sflReady[fruitId] ?? `/stages/${fruitId}_fruiting.png`;
  }
  if (prog < 0.5) return `/stages/${fruitId}_sapling.png`;
  return `/stages/${fruitId}_growing.png`;
}

/** Flower growth stage by progress. Stages: sprout / budding / bloomed. */
export function flowerStageSrc(flowerId: string, growing: boolean, prog: number, ready: boolean): string {
  if (!growing) return `/plot/flower_bed_empty.png`;
  if (ready) return `/stages/${flowerId}_bloomed.png`;
  if (prog < 0.5) return `/stages/${flowerId}_sprout.png`;
  return `/stages/${flowerId}_budding.png`;
}

export function beehiveSrc(level: number): string {
  if (level >= 3) return "/beehives/ai_beehive_lv3.png";
  if (level >= 2) return "/beehives/ai_beehive_lv2.png";
  if (level >= 1) return "/beehives/beehive_lv1.webp";
  return "/beehives/ai_beehive_demo.png";
}
