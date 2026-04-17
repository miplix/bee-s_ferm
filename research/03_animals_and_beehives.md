# Sunflower Land — Animals & Beehives Research

Numeric reference for a Sunflower Land clone. All values verified against the official game repo (https://github.com/sunflower-land/sunflower-land, branch `main`). Source links are included per fact.

Primary source files:
- `src/features/game/types/animals.ts` — https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/animals.ts
- `src/features/game/lib/animals.ts` — https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/lib/animals.ts
- `src/features/game/events/landExpansion/feedAnimal.ts` — https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/feedAnimal.ts
- `src/features/game/events/landExpansion/buyAnimal.ts` — https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/buyAnimal.ts
- `src/features/game/events/landExpansion/upgradeBuilding.ts` — https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/upgradeBuilding.ts
- `src/features/game/events/landExpansion/claimProduce.ts` — https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/claimProduce.ts
- `src/features/game/lib/updateBeehives.ts` — https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/lib/updateBeehives.ts
- `src/features/game/events/landExpansion/harvestBeehive.ts` — https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/harvestBeehive.ts
- `src/features/game/types/flowers.ts` — https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/flowers.ts
- `src/features/game/expansion/lib/expansionNodes.ts` — https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/expansion/lib/expansionNodes.ts

---

## 1. Buildings & Capacity

### 1.1 Buildings

| Animal | Building | Bumpkin level required | Purchase cost (coins) |
|---|---|---|---|
| Chicken | Hen House | 6 | 50 |
| Cow | Barn | 14 | 100 |
| Sheep | Barn | 18 | 120 |

Source: `types/animals.ts` — `ANIMALS` constant (lines 36–56).

### 1.2 Capacity formula

`baseCapacity = 10 + (buildingLevel - 1) * 5`

| Building Level | Animals allowed |
|---|---|
| 1 (default) | 10 |
| 2 | 15 |
| 3 (max) | 20 |

Building starts with 3 default animals (`DEFAULT_ANIMAL_COUNT = 3`) when built.
Default chicken starts with 40 XP; cows/sheep with 80 XP.

Capacity boosts (collectibles):
- **Chicken Coop** (Hen House only): +5 × building level extra chicken capacity
- **Barn Blueprint** (Barn only): +5 × building level extra cow/sheep capacity

Source: `buyAnimal.ts` `getBaseAnimalCapacity` / `getBoostedAnimalCapacity` (lines 28–81); `lib/animals.ts` `makeAnimalBuilding` (lines 42–82).

### 1.3 Building upgrade costs

Hen House:

| Level | Coins | Wood | Iron | Gold | Crimstone | Oil |
|---|---|---|---|---|---|---|
| 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2 | 7,500 | 500 | 50 | 40 | 10 | 0 |
| 3 | 50,000 | 2,500 | 150 | 100 | 50 | 100 |

Barn:

| Level | Coins | Wood | Iron | Gold | Crimstone | Oil |
|---|---|---|---|---|---|---|
| 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2 | 10,000 | 1,000 | 100 | 75 | 30 | 0 |
| 3 | 75,000 | 5,000 | 300 | 200 | 125 | 250 |

Source: `upgradeBuilding.ts` `BUILDING_UPGRADES` (lines 41–95).

---

## 2. Animal Levels (XP)

XP thresholds per level from `types/animals.ts` `ANIMAL_LEVELS` (lines 74–132). Max level = 15.

| Level | Chicken XP | Cow XP | Sheep XP |
|---|---|---|---|
| 0 | 0 | 0 | 0 |
| 1 | 60 | 180 | 120 |
| 2 | 120 | 360 | 240 |
| 3 | 240 | 720 | 480 |
| 4 | 360 | 1,080 | 720 |
| 5 | 480 | 1,440 | 960 |
| 6 | 660 | 1,980 | 1,320 |
| 7 | 840 | 2,520 | 1,680 |
| 8 | 1,020 | 3,060 | 2,040 |
| 9 | 1,200 | 3,600 | 2,400 |
| 10 | 1,440 | 4,320 | 2,880 |
| 11 | 1,680 | 5,040 | 3,360 |
| 12 | 1,920 | 5,760 | 3,840 |
| 13 | 2,160 | 6,480 | 4,320 |
| 14 | 2,400 | 7,200 | 4,800 |
| 15 | 2,720 | 8,160 | 5,440 |

Animals at level 0 produce nothing (drops begin at level 1).

---

## 3. Feed Types

From `types/animals.ts` `ANIMAL_FOODS` (lines 134–186). "Food" types feed the animal; "medicine" types cure sickness.

| Feed | Type | Ingredients |
|---|---|---|
| Hay | food | 1 Wheat |
| Kernel Blend | food | 1 Corn |
| NutriBarley | food | 1 Barley |
| Mixed Grain | food | 1 Wheat + 1 Corn + 1 Barley |
| Omnifeed | food | 1 Gem (premium currency) |
| Barn Delight | medicine | 5 Lemon + 3 Honey |

### 3.1 Food quantity required per feeding

From `feedAnimal.ts` `REQUIRED_FOOD_QTY` (lines 31–35):

| Animal | Units consumed per feed |
|---|---|
| Chicken | 1 |
| Sheep | 3 |
| Cow | 5 |

Feed cost can be modified by collectibles/skills (e.g. Fat Chicken x0.9, Cluckulator x0.75, Dr Cow x0.95, Mermaid Sheep x0.95, Efficient Feeding x0.95, Infernal Bullwhip x0.5 on Barn animals, Chonky Feed x1.5 cost but x2 XP, etc.). See `lib/animals.ts` `getBoostedFoodQuantity` (lines 491–606).

---

## 4. Food XP & Favorite Food

Each feed gives a specific XP amount depending on animal type and current level. From `ANIMAL_FOOD_EXPERIENCE` (lines 188–534). The animal's **favorite food** at a given level is the food giving max XP (excluding Omnifeed). Omnifeed always gives the max XP value, but is not classed as "favorite". The favorite food band changes as the animal levels up.

### 4.1 Chicken food XP

| Level range | Hay | Kernel Blend | NutriBarley | Mixed Grain | Omnifeed | Favorite |
|---|---|---|---|---|---|---|
| 0–2 | 10 | 60 | 20 | 30 | 60 | Kernel Blend |
| 3–5 | 60 | 10 | 20 | 30 | 60 | Hay |
| 6–9 | 20 | 10 | 60 | 30 | 60 | NutriBarley |
| 10–15 | 20 | 10 | 30 | 80 | 80 | Mixed Grain |

Note: Chicken's level 0–2 preference differs from Cow/Sheep (Hay vs Kernel Blend swapped) — Chickens start preferring **Kernel Blend**.

### 4.2 Cow food XP

| Level range | Kernel Blend | Hay | NutriBarley | Mixed Grain | Omnifeed | Favorite |
|---|---|---|---|---|---|---|
| 0–2 | 60 | 10 | 20 | 30 | 60 | Kernel Blend |
| 3–5 | 10 | 60 | 20 | 30 | 60 | Hay |
| 6–9 | 10 | 20 | 60 | 30 | 60 | NutriBarley |
| 10–15 | 10 | 20 | 30 | 80 | 80 | Mixed Grain |

### 4.3 Sheep food XP

Identical pattern to Cow (same numeric values).

| Level range | Kernel Blend | Hay | NutriBarley | Mixed Grain | Omnifeed | Favorite |
|---|---|---|---|---|---|---|
| 0–2 | 60 | 10 | 20 | 30 | 60 | Kernel Blend |
| 3–5 | 10 | 60 | 20 | 30 | 60 | Hay |
| 6–9 | 10 | 20 | 60 | 30 | 60 | NutriBarley |
| 10–15 | 10 | 20 | 30 | 80 | 80 | Mixed Grain |

### 4.4 Omnifeed

Omnifeed always matches the best food XP at any level (60 early game, 80 from level 10). It is the only "always-happy" food. Cost = 1 Gem per unit (regardless of animal).

### 4.5 Favorite food effect

Feeding the favorite food or Omnifeed sets animal state to `"happy"`; other foods → `"sad"`. Favorite food gives **no XP multiplier**, only state. `"Chonky Feed"` skill doubles food XP globally (`handleFoodXP`).

Source: `feedAnimal.ts` lines 141–159, 341–346; `lib/animals.ts` `getAnimalFavoriteFood` (lines 106–118).

---

## 5. Resource Drops Per Level

From `ANIMAL_RESOURCE_DROP` (lines 536–727). Animal must be at `"ready"` state (claimed via `claimProduce`). Base yield before boosts (multipliers from happiness, collectibles, skills, Buds, Salt Lick, etc. apply on top).

### 5.1 Chicken drops (Egg + Feather)

| Level | Egg | Feather |
|---|---|---|
| 0 | 0 | 0 |
| 1 | 1 | 0 |
| 2 | 1 | 0 |
| 3 | 1 | 1 |
| 4 | 2 | 1 |
| 5 | 2 | 1 |
| 6 | 2 | 1 |
| 7 | 2 | 1 |
| 8 | 3 | 1 |
| 9 | 3 | 2 |
| 10 | 3 | 2 |
| 11 | 3 | 2 |
| 12 | 3 | 2 |
| 13 | 4 | 2 |
| 14 | 4 | 2 |
| 15 | 5 | 3 |

### 5.2 Cow drops (Milk + Leather)

| Level | Milk | Leather |
|---|---|---|
| 0 | 0 | 0 |
| 1 | 1 | 1 |
| 2 | 1 | 1 |
| 3 | 1 | 1 |
| 4 | 2 | 1 |
| 5 | 2 | 1 |
| 6 | 2 | 2 |
| 7 | 2 | 2 |
| 8 | 3 | 2 |
| 9 | 3 | 2 |
| 10 | 3 | 3 |
| 11–14 | 3 | 3 |
| 15 | 4 | 4 |

### 5.3 Sheep drops (Wool + Merino Wool)

| Level | Wool | Merino Wool |
|---|---|---|
| 0 | 0 | 0 |
| 1 | 1 | 1 |
| 2 | 1 | 1 |
| 3 | 1 | 1 |
| 4 | 2 | 1 |
| 5 | 2 | 1 |
| 6 | 2 | 2 |
| 7 | 2 | 2 |
| 8 | 3 | 2 |
| 9 | 3 | 2 |
| 10 | 3 | 3 |
| 11–14 | 3 | 3 |
| 15 | 4 | 4 |

---

## 6. Production Cycle (Sleep / Egg time)

From `feedAnimal.ts` line 29:

```
ANIMAL_SLEEP_DURATION = 24 * 60 * 60 * 1000  // 24 hours
```

- All animals sleep 24h after producing before they can be fed again (`animal.awakeAt = createdAt + 24h`).
- An animal becomes `"ready"` (produces drops) when it accumulates enough XP via feeding to level up OR (at max level) completes a full cycle (`maxLevelXP − levelBeforeMaxXP` worth of XP).
- Feeding at lower levels produces faster because a level-up triggers "ready" immediately.

### 6.1 Feed cycles to produce

Because food XP scales and level thresholds grow, the number of feeds needed per cycle is approximately:

- **Chicken**: 1–2 feeds with Kernel Blend early, then roughly `(nextLevelXP − currentXP) / foodXp` rounded up — typically 1 feed for favorite early, up to 3–4 feeds per cycle at higher levels depending on food.
- **Cow** / **Sheep**: similarly, but with higher XP thresholds. Each "cycle" at max level is `(L15 − L14)` XP — Cow: 960 XP, Sheep: 640 XP, Chicken: 320 XP.

These must be satisfied before the animal produces again, then the 24h sleep timer starts.

### 6.2 Egg production time boosts (collectibles/skills)

From `lib/animals.ts` `getBoostedAwakeAt` (lines 608–697):

| Boost | Effect on sleep duration |
|---|---|
| El Pollo Veloz (collectible, Chicken) | −2 hours (fixed) |
| Speed Chicken (collectible, Chicken) | ×0.9 |
| Janitor Chicken (collectible, Chicken) | ×0.95 |
| Dream Scarf (wearable, Sheep) | ×0.8 |
| Farm Dog (collectible, Sheep) | ×0.75 |
| Mammoth (collectible, Cow) | ×0.75 |
| Wrangler (inventory, all) | ×0.9 |
| Restless Animals (skill, all) | ×0.9 |
| Collie Shrine (temp, Cow/Sheep) | ×0.75 |
| Bantam Shrine (temp, Chicken) | ×0.75 |

Multiplicative boosts stack.

### 6.3 Love Animal

Once per "sleep third" the player can "pet" / love an animal. `loveAnimalPeriod = (awakeAt − asleepAt) / 3`, and cannot be loved within 8h of previous love. See `loveAnimal.ts` lines 38–46.

---

## 7. Sickness / Disease

The sickness probability logic is evaluated **server-side** and is not in the open-source client. Client enforces:
- Sick animals cannot be fed (`feedAnimal.ts` lines 245–247) — `"Cannot feed a sick animal"`.
- Sick animals can be woken early (`animal.awakeAt` is bypassed if `state === "sick"`).
- Cure: feed **Barn Delight** (cost 1 unit; `getBarnDelightCost`, lines 161–181).
- Ingredients for 1 Barn Delight = 5 Lemon + 3 Honey.
- **Oracle Syringe** wearable: makes Barn Delight free (amount = 0).
- **Medic Apron** wearable: cuts Barn Delight cost by half (x0.5).

Proposal design (officially cited by devs — Issue/Discussion #4300):
- Every 24 hours a chance to become sick; chance grows with animal age (older = higher risk).
- Sick animals drop **half** the resources and **sell for 25% less**.
- **Spread**: each sick animal in the same building adds **+2.5%** sickness chance to the rest.

Source: `events/landExpansion/feedAnimal.ts`; Sunflower Land GitHub Discussion #4300 "Animals [PROPOSAL]" — https://github.com/sunflower-land/sunflower-land/discussions/4300

---

## 8. Beehives

### 8.1 Unlock & placement

- Beehives are **land resources** (not buildings or craftables). They are unlocked automatically via **Spring Island expansions**, starting at **Spring Island expansion 6**.
- The required spot is a **Flower Bed** — beehives attach to nearby flower beds to produce honey.
- Not available on Basic island. First appears on Spring Island expansion 6.

Expansion nodes for Spring Island (`expansionNodes.ts` lines 385–595):

| Spring expansion | Beehives available | Flower Beds available |
|---|---|---|
| 4 | 0 | 0 |
| 5 | 0 | 0 |
| 6 | 1 | 1 |
| 7 | 1 | 1 |
| 8 | 1 | 1 |
| 9 | 1 | 1 |
| 10 | 2 | 2 |
| 11 | 2 | 2 |
| 12 | 2 | 2 |
| 13 | 2 | 2 |
| 14 | 2 | 2 |
| 15 | 2 | 2 |
| 16+ | 3 | 3 |

**Max beehives: 3** (capped on all downstream island tiers — Desert, Volcano — all remain at 3).

Source: `expansion/lib/expansionNodes.ts` (TOTAL_EXPANSION_NODES).

### 8.2 Honey production formula

From `lib/updateBeehives.ts`:

```ts
DEFAULT_HONEY_PRODUCTION_TIME = 24 * 60 * 60 * 1000  // 24h in ms
```

Base production rate = **1** unit of honey per 24 hours (1 honey per beehive per day when a flower is actively attached).

Per-second honey generation (while a flower is attached):
`honey += elapsedMs * rate`
Once `honey.produced ≥ DEFAULT_HONEY_PRODUCTION_TIME` the hive is **full**.

### 8.3 Rate boosts (production speed)

From `updateBeehives.ts` `getHoneyProductionRate` (lines 29–62):

| Source | Effect |
|---|---|
| Base | rate = 1 |
| Queen Bee (collectible) | +1 |
| Beekeeper Hat (wearable) | +0.2 |
| Hyper Bees (skill) | +0.1 |
| Flowery Abode (skill) | +0.5 |
| Bear Shrine (temporary collectible) | +0.5 |

Maximum stacked rate ≈ **3.3** (i.e. ~3.3 honey per day per hive if always flower-fed).

### 8.4 Flower → beehive attachment

Beehives don't have a specific "powering" flower. Any grown flower from a nearby Flower Bed attaches to an active beehive through an allocation algorithm (`attachFlowers` in `updateBeehives.ts`, lines 318–403):

1. Flowers become "ready for attachment" when planted + growth duration elapses.
2. Free hives are matched to free flowers (earliest availability first).
3. `attachedUntil = attachedAt + min(hiveTimeRemaining, flowerTimeRemaining)`.
4. A flower that is still growing is "reserved" for a hive so that offline honey production is continuous.

Flower growth times (from `types/flowers.ts` `FLOWER_SEEDS`, lines 116–173):

| Seed | Price (coins) | Bumpkin level | Grow time |
|---|---|---|---|
| Sunpetal Seed | 16 | 13 | 1 day |
| Bloom Seed | 32 | 22 | 2 days |
| Lily Seed | 48 | 27 | 5 days |
| Edelweiss Seed | 96 | 35 | 3 days |
| Gladiolus Seed | 96 | 35 | 3 days |
| Lavender Seed | 96 | 35 | 3 days |
| Clover Seed | 96 | 35 | 3 days |

So a beehive fed by a 1-day Sunpetal flower roughly generates 1 honey per day (matched 1:1 to flower lifetime). Longer-lived flowers keep the hive attached across multiple days.

### 8.5 Harvest honey & multipliers

From `harvestBeehive.ts` lines 64–100:

```
totalHoneyProduced = (honey.produced / DEFAULT_HONEY_PRODUCTION_TIME) * multiplier
```

Harvest multiplier (`getHoneyMultiplier`):

| Source | Effect |
|---|---|
| Base | multiplier = 1 |
| Bee Suit (wearable) | +0.1 |
| Honeycomb Shield (wearable) | +1.0 |
| Sweet Bonus (skill) | +0.1 |
| King of Bears (collectible) | +0.25 |

Harvesting resets `honey.produced = 0` and `honey.updatedAt = now`.

### 8.6 Swarm mechanic

Swarm is checked only if the hive was **full** at harvest (`honeyProduced ≥ 1`). The `beehive.swarm` flag is set server-side (the client field exists on state but the probability rolls happen on the backend).

Effect (`harvestBeehive.ts` `calculateSwarmBoost`, `applySwarmBoostToCrops`, lines 30–62):

- When harvest is full AND `beehive.swarm === true`, every crop plot gets:
  - `beeSwarm.count += 1`
  - `beeSwarm.swarmActivatedAt = createdAt`
- Swarm boost to crop yield: **+0.2** base (`boost = amount + 0.2`).
  - `"Pollen Power Up"` skill adds another **+0.1** (making 0.3).

Community-sourced swarm chance: **~20% chance per full harvest** to trigger a swarm per hive (per W3Land guide / community wiki; the explicit number is not in the open-source client). **Hornet Mask** wearable doubles swarm chance (2x).

Source (swarm percentage): https://w3land.com/sunflower-land/get-bee-swarm-effect ; `docs.sunflower-land.com` auction table references "Hornet Mask — 2x Bee Swarm Chance".

### 8.7 Max beehives per player

**3 beehives maximum** (confirmed in `expansionNodes.ts` — Beehive count is capped at 3 across all expansion tiers after Spring Island 16).

### 8.8 Beehive level / bumpkin requirement

No direct bumpkin-level gate on beehives themselves — they unlock via Spring Island expansion 6. To reach Spring Island expansion 6 you need the Spring island unlocked (moved from Basic island at expansion 10) plus 5 further expansions. Effective minimum bumpkin level ≈ 13 (Sunpetal Seed gate — first flower seed needed to power a hive at bumpkin level 13).

---

## 9. Quick-reference summary for clone

### Animals
- Max level: 15
- Sleep/cooldown: 24h (can be reduced)
- Default animals in new building: 3
- Base capacity: 10 → 15 → 20 (per upgrade)
- Feed consumption: Chicken 1 / Sheep 3 / Cow 5 units per feeding
- Favorite food path (all animals, but Chicken starts with Kernel Blend, Cow/Sheep start with Kernel Blend too):
  - Lv 0–2: Kernel Blend (Chicken)/Kernel Blend (Cow+Sheep)
  - Lv 3–5: Hay
  - Lv 6–9: NutriBarley
  - Lv 10–15: Mixed Grain
- Omnifeed = always "happy" / always max XP, 1 Gem per use
- Cure sick: Barn Delight (5 Lemon + 3 Honey per unit; 1 unit per cure)

### Beehives
- Base rate: 1 honey / 24h / hive
- Max boosted rate: ≈3.3 honey / 24h
- Max hives: 3
- Unlocks: Spring Island expansion 6
- Swarm: ~20% chance per full harvest; grants +0.2 crop yield boost (+0.3 with Pollen Power Up); Hornet Mask 2x swarm chance
- Honey harvest: capped by elapsed time × rate × multiplier; multiplier max with Honeycomb Shield + Bee Suit + Sweet Bonus + King of Bears = 1 + 1 + 0.1 + 0.1 + 0.25 = **2.45x**

---

## Additional references
- GitHub repo root: https://github.com/sunflower-land/sunflower-land
- Sunflower Land docs: https://docs.sunflower-land.com
- Animals proposal/discussion: https://github.com/sunflower-land/sunflower-land/discussions/4300
- Bees & Honey proposal: https://github.com/sunflower-land/sunflower-land/issues/199
- Community wiki (flowers): https://wiki.sfl.world/en/mechanics/flowers
- W3Land bee swarm guide: https://w3land.com/sunflower-land/get-bee-swarm-effect
