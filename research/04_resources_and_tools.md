# Sunflower Land — Resources and Tools Research

Research date: 2026-04-11
Authoritative source: Sunflower Land GitHub (`sunflower-land/sunflower-land`, branch `main`)
Secondary: `docs.sunflower-land.com`

All numeric values below are taken from the TypeScript source code. Where a value was not present in a fetched file, this is explicitly noted.

---

## TOPIC 1 — Basic Resources and Cooldowns

### 1.1 Recovery Time Constants (authoritative)

Source: `src/features/game/lib/constants.ts`
URL: https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/lib/constants.ts

| Constant                   | Value (seconds) | In hours |
|----------------------------|-----------------|----------|
| `TREE_RECOVERY_TIME`       | 2 * 60 * 60 = 7,200        | 2 h  |
| `STONE_RECOVERY_TIME`      | 4 * 60 * 60 = 14,400       | 4 h  |
| `IRON_RECOVERY_TIME`       | 8 * 60 * 60 = 28,800       | 8 h  |
| `GOLD_RECOVERY_TIME`       | 24 * 60 * 60 = 86,400      | 24 h |
| `CRIMSTONE_RECOVERY_TIME`  | 24 * 60 * 60 = 86,400      | 24 h (per mine within a 5-mine cycle) |
| `SUNSTONE_RECOVERY_TIME`   | 3 * 24 * 60 * 60 = 259,200 | 72 h |
| `OIL_RESERVE_RECOVERY_TIME`| 20 * 60 * 60 = 72,000      | 20 h |

### 1.2 Gatherable / Mineable Resource Table

| Resource   | Tool Required   | Base Amount per Node | Cooldown (real time) | Primary Island      | Source File |
|------------|-----------------|----------------------|----------------------|---------------------|-------------|
| Wood       | Axe (1 per chop) | 1 wood              | 2 h                  | Basic Island + others | `src/features/game/events/landExpansion/chop.ts` |
| Stone      | Pickaxe (1 per mine) | 1 stone         | 4 h                  | Basic Island + others | `src/features/game/events/landExpansion/stoneMine.ts` |
| Iron       | Stone Pickaxe (1 per mine) | 1 iron    | 8 h                  | Basic Island + others | `src/features/game/events/landExpansion/ironMine.ts` |
| Gold       | Iron Pickaxe (1 per mine) | 1 gold    | 24 h                 | Basic Island + others | `src/features/game/events/landExpansion/mineGold.ts` |
| Crimstone  | Gold Pickaxe (1 per mine) | 1 crimstone (5 mines per cycle; +2 on 5th mine) | 24 h between mines; rock resets to `minesLeft = 5` after `CRIMSTONE_RECOVERY_TIME + 24 h` of inactivity | Spring/Petal Island (desert area) | `src/features/game/events/landExpansion/mineCrimstone.ts` |
| Sunstone   | Gold Pickaxe (1 per mine) | 1 sunstone | 72 h                 | Desert Island       | `src/features/game/events/landExpansion/mineSunstone.ts` |
| Oil        | Oil Drill (1 per drill) | 10 oil per drill; **+20 bonus oil every 3rd drill** | 20 h        | Desert Island       | `src/features/game/events/landExpansion/drillOilReserve.ts` |
| Fruit (patch) | None (hand-harvest) | 1 fruit per harvest; multiple harvests per planting (tracked by `harvestsLeft`) | Depends on seed `plantSeconds` (see Fruit Seeds table below) | Spring / Desert Islands | `src/features/game/events/landExpansion/fruitHarvested.ts` |
| Flower     | None (hand-harvest) | 1 flower            | Depends on seed `plantSeconds` (see Flower Seeds table) | Spring Island (Flower Beds) | `src/features/game/events/landExpansion/harvestFlower.ts` |

Notes on exact drop mechanics (from source):
- Tree, Stone, Iron, Gold, Crimstone, Sunstone base drop is `1` at Tier 1, modified by multipliers, skills, collectibles, wearables.
- Tier 2 rocks/trees add **+0.5** to base drop; Tier 3 adds **+2.5** (per handler files).
- Oil Reserve: `BASE_OIL_DROP_AMOUNT = 10`, `OIL_BONUS_DROP_AMOUNT = 20` (bonus every 3rd drill).
- Crimstone streak: `+2` added when `rock.minesLeft === 1` (5th mine of the cycle).

Sources:
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/chop.ts
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/stoneMine.ts
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/ironMine.ts
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/mineGold.ts
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/mineCrimstone.ts
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/mineSunstone.ts
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/drillOilReserve.ts

### 1.3 Fruit Seeds (growing times)

Source: `src/features/game/types/fruits.ts`
URL: https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/fruits.ts

| Fruit      | plantSeconds | Hours | Island  |
|------------|--------------|-------|---------|
| Tomato     | 7,200        | 2 h   | Spring  |
| Lemon      | 14,400       | 4 h   | Spring  |
| Blueberry  | 21,600       | 6 h   | Spring  |
| Orange     | 28,800       | 8 h   | Spring  |
| Apple      | 43,200       | 12 h  | Spring  |
| Banana     | 43,200       | 12 h  | Spring  |
| Celestine  | 21,600       | 6 h   | Desert  |
| Lunara     | 43,200       | 12 h  | Desert  |
| Duskberry  | 86,400       | 24 h  | Desert  |

Each patch has a `harvestsLeft` counter (multiple harvests per planting) but the specific per-fruit `bushHarvests` values are defined in a constant not extracted in this pass. For a clone, a safe default is 3 harvests per planting (this matches the common community-guide value and the `isBush` pattern for Tomato/Blueberry/Banana).

### 1.4 Flower Seeds (growing times)

Source: `src/features/game/types/flowers.ts`
URL: https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/flowers.ts

| Seed            | plantSeconds | Days  | Flowers produced                          |
|-----------------|--------------|-------|-------------------------------------------|
| Sunpetal Seed   | 86,400       | 1 day | Pansies, Cosmos, Prism Petal              |
| Bloom Seed      | 172,800      | 2 d   | Balloon Flowers, Daffodils, Celestial Frostbloom |
| Lily Seed       | 432,000      | 5 d   | Carnations, Lotus, Primula Enigma         |
| Edelweiss Seed  | 259,200      | 3 d   | Edelweiss colors                          |
| Gladiolus Seed  | 259,200      | 3 d   | Gladiolus colors                          |
| Lavender Seed   | 259,200      | 3 d   | Lavender colors                           |
| Clover Seed     | 259,200      | 3 d   | Clover colors                             |

Flowers are harvested by hand (no tool required).

### 1.5 Node counts per land expansion (Basic Island only)

Source: `src/features/game/types/expansions.ts`
URL: https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/expansions.ts

| Expansion | Trees | Stones | Iron | Gold | Fruit Patches | Crop Plots |
|-----------|-------|--------|------|------|---------------|------------|
| 4         | 2     | 1      | 1    | 0    | 0             | 9          |
| 5         | 1     | 1      | 1    | 1    | 0             | 8          |
| 6         | 1     | 1      | 0    | 0    | 0             | 8          |
| 7         | 1     | 1      | 1    | 0    | 0             | 2          |
| 8         | 1     | 1      | 0    | 1    | 0             | 2          |
| 9         | 0     | 0      | 1    | 0    | 0             | 2          |
| 10        | 2     | 1      | 0    | 0    | 1             | 2          |
| 11        | 1     | 1      | 1    | 1    | 0             | 2          |
| 12        | 0     | 1      | 0    | 0    | 2             | 0          |
| 13        | 1     | 1      | 0    | 0    | 0             | 2          |
| 14        | 0     | 1      | 1    | 1    | 1             | 2          |
| 15        | 1     | 0      | 0    | 0    | 1             | 0          |
| 16        | 0     | 0      | 1    | 1    | 1             | 0          |
| 17        | 1     | 1      | 0    | 0    | 1             | 2          |
| 18        | 0     | 0      | 0    | 0    | 0             | 2          |
| 19        | 1     | 1      | 1    | 0    | 1             | 0          |
| 20        | 0     | 0      | 0    | 0    | 1             | 2          |
| 21        | 1     | 1      | 1    | 0    | 1             | 1          |
| 22        | 0     | 0      | 0    | 1    | 0             | 1          |
| 23        | 0     | 1      | 1    | 0    | 1             | 1          |

Crimstone rocks, sunstone rocks, beehives, flower beds, oil reserves, and lava pits are **not** on basic island expansions — they appear on the Spring (Petal), Desert, and Volcano islands respectively.

Bumpkin level requirements for expansions (partial):

| Expansion | Bumpkin Level |
|-----------|---------------|
| 3         | 1             |
| 4         | 1             |
| 5         | 3             |
| 6         | 4             |
| 7         | 6             |
| 8         | 8             |
| 9         | 11            |

Source: `src/features/game/expansion/lib/expansionRequirements.ts`

---

## TOPIC 2 — Tools and Crafting Costs

### 2.1 Workbench Tools

Source: `src/features/game/types/tools.ts`
URL: https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/tools.ts

| Tool           | Coin Price | Wood | Stone | Iron | Gold | Other             | Charges     | Harvests                 |
|----------------|------------|------|-------|------|------|-------------------|-------------|--------------------------|
| Axe            | 20         | 0    | 0     | 0    | 0    | —                 | 1 use       | Trees (Wood)             |
| Pickaxe        | 20         | 3    | 0     | 0    | 0    | —                 | 1 use       | Stone                    |
| Stone Pickaxe  | 20         | 3    | 5     | 0    | 0    | —                 | 1 use       | Iron                     |
| Iron Pickaxe   | 80         | 3    | 0     | 5    | 0    | —                 | 1 use       | Gold                     |
| Gold Pickaxe   | 100        | 3    | 0     | 0    | 3    | —                 | 1 use       | Crimstone, Sunstone      |
| Rod            | 20         | 3    | 1     | 0    | 0    | —                 | 1 use       | Fishing                  |
| Oil Drill      | 100        | 20   | 0     | 9    | 0    | Wool 20 / Leather 10 (skill-dependent) | 1 use | Oil Reserves |
| Pest Net       | 50         | 0    | 0     | 0    | 0    | Wool 2            | 1 use       | Pest defense / Pest mechanics |
| Crab Pot       | 250        | 0    | 0     | 0    | 0    | Feather 5, Wool 3 | (fishing)   | Fishing (special)        |
| Mariner Pot    | 500        | 0    | 0     | 0    | 0    | Feather 10, Merino Wool 10 | (fishing) | Fishing (special)    |
| Salt Rake      | 20         | 3    | 0     | 0    | 0    | —                 | 1 use       | Salt (saltwater areas)   |
| Hammer         | 1600       | 5    | 5     | 0    | 0    | —                 | `disabled: true` in source (marked `"coming.soon"`) | — |

### 2.2 Treasure / Beach Tools

Source: `src/features/game/types/tools.ts` (TREASURE_TOOLS record)

| Tool        | Coin Price | Wood | Stone | Other                                  | Charges | Harvests               |
|-------------|------------|------|-------|----------------------------------------|---------|------------------------|
| Sand Shovel | 20         | 2    | 1     | —                                      | 1 use   | Treasure holes (beach) |
| Sand Drill  | 40         | 3    | 0     | Oil 1, Crimstone 1, Leather 1          | 1 use   | Drill sites (beach)    |

### 2.3 Love / Animal Tools (reference, not gathering)

Source: `src/features/game/types/tools.ts` (LOVE_ANIMAL_TOOLS record)

| Tool          | Coin Price |
|---------------|------------|
| Petting Hand  | 0          |
| Brush         | 2,000      |
| Music Box     | 50,000     |

### 2.4 Tool consumption rules

All resource-gathering tools are **single-use consumables** — 1 tool charge per action. Reductions exist via:
- Logger wearable → Axe cost 0.5
- Foreman Beaver collectible → Axe cost 0
- Quarry collectible → Pickaxe cost 0 for Stone
- Infernal Drill wearable → Oil Drill cost 0
- Crimstone Spikes Hair wearable → Gold Pickaxe cost 0 for Crimstone

(Source: handler files in `src/features/game/events/landExpansion/`.)

---

## TOPIC 3 — Crimstone, Sunstone, and Oil specifics

### 3.1 Crimstone

- **What it is:** A mid/late-game crystalline resource used to craft high-tier items, buildings, and wearables. Appears on the Spring (Petal) Island.
- **Tool:** Gold Pickaxe (1 per mine).
- **Base yield:** 1 per mine, +2 bonus on the 5th mine of the cycle (streak bonus). Additional +1 from "Fire Kissed" skill and +2 from "Crimstone Hammer" wearable on the final mine.
- **Cycle mechanic:** Each rock has `minesLeft` initialized to **5**. Each mine decrements it by 1. After the 5th mine, the rock sits idle until `CRIMSTONE_RECOVERY_TIME + 24 h = 48 h` elapses, at which point `minesLeft` resets to 5.
- **Cooldown between mines (within a cycle):** 24 h (`CRIMSTONE_RECOVERY_TIME = 86,400 s`).
- **Uses:** Crafting recipes for wearables/collectibles (e.g., Crimstone Hammer, Crimstone Armor, Sand Drill ingredient), upgrades, and late-game structures.
- **Source:** https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/mineCrimstone.ts

### 3.2 Sunstone

- **What it is:** A rare premium resource used at the Solar Forge (Infernos/Desert Island area) to upgrade resource nodes to Tier 2/3.
- **Tool:** Gold Pickaxe (1 per mine).
- **Base yield:** 1 sunstone per mine.
- **Mines per rock:** Each sunstone rock has a `minesLeft` counter. When `minesLeft` reaches zero the rock is removed from the game state (not auto-respawned) — rocks are one-time consumable and must be re-acquired / replaced.
- **Cooldown between mines:** 72 h (`SUNSTONE_RECOVERY_TIME = 259,200 s`).
- **Uses:** Primary fuel for the **Solar Forge** — trade sunstones to forge node upgrades (stone → fused stone → reinforced stone; tree → ancient tree → sacred tree; etc.). `REQUIRED_NODES_TO_FORGE = 4` (four tier-N nodes combine into one tier-(N+1) node).
- **Source:** https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/mineSunstone.ts

### 3.3 Oil (Oil Reserve)

- **What it is:** Late-game fuel resource extracted on Desert Island.
- **Tool:** Oil Drill (1 per drill).
- **Drop amounts (from constants in `drillOilReserve.ts`):**
  - `BASE_OIL_DROP_AMOUNT = 10` oil per drill.
  - `OIL_BONUS_DROP_AMOUNT = 20` extra oil on **every 3rd drill** (i.e., drills 3, 6, 9, …).
- **Cooldown:** `OIL_RESERVE_RECOVERY_TIME = 20 * 60 * 60 = 72,000 s = 20 h`.
- **Recovery boosts (from source):**
  - `Dev Wrench` wearable: ×0.5 recovery
  - `Oil Be Back` skill: ×0.8 recovery
  - `Stag Shrine` collectible: ×0.75 recovery
- **Uses:**
  - **Crop Machine** — main fuel; burns oil to auto-plant/harvest crops over long time windows.
  - **Greenhouse** — required to grow greenhouse crops/fruits (Rice, Olives, Soybeans, Grapes).
  - **Cooking speed-ups** — oil can be consumed to accelerate cooking in kitchen/firepit buildings.
  - **Tool crafting** — Sand Drill recipe requires 1 oil.
- **Source:** https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/drillOilReserve.ts
- Secondary confirmation of Oil's uses: https://docs.sunflower-land.com/llms-full.txt

---

## Primary Sources Referenced

- GitHub repo root: https://github.com/sunflower-land/sunflower-land
- Constants: https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/lib/constants.ts
- Resources types: https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/resources.ts
- Tools types: https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/tools.ts
- Fruits types: https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/fruits.ts
- Flowers types: https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/flowers.ts
- Expansions: https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/expansions.ts
- Chop handler: https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/chop.ts
- Stone handler: https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/stoneMine.ts
- Iron handler: https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/ironMine.ts
- Gold handler: https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/mineGold.ts
- Crimstone handler: https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/mineCrimstone.ts
- Sunstone handler: https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/mineSunstone.ts
- Oil handler: https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/drillOilReserve.ts
- Flower harvest handler: https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/harvestFlower.ts
- Docs LLM export: https://docs.sunflower-land.com/llms-full.txt

---

## Gaps and Caveats

1. **Fruit harvests-per-planting (`bushHarvests`)** — the `harvestsLeft` counter exists per patch but the specific per-fruit default (typical community value is 3) was not confirmed in the fetched file. The exact value lives in `PATCH_FRUIT` entries in `fruits.ts`; a clone should reference that file directly before finalizing.
2. **Node counts for Spring Island / Desert Island / Volcano Island** — only the Basic Island expansion layout was extracted. Crimstone, Sunstone, Flower Beds, Oil Reserves, Beehives, Lava Pits live on those other islands and are defined in separate layout files not fetched here.
3. **Oil Drill ingredients** — the source conditionally uses Wool or Leather depending on whether the player has the "Oil Rig" skill; both variants were recorded.
4. **Hammer** is currently `disabled: true` in the source with description `"coming.soon"` — included for completeness but not obtainable in the current game.
5. **All base recovery times are subject to in-game multipliers** (skills, collectibles, wearables, totems). The numbers above are the raw constants before any boosts.
