# Sunflower Land: Buildings and Land Expansions

Research compiled from the authoritative GitHub source code of the Sunflower Land game. All numeric data was extracted from the TypeScript definitions in the main branch (captured 2026-04-11).

**Primary sources (GitHub, authoritative):**
- Buildings: https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/buildings.ts
- Expansion requirements: https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/expansions.ts
- Expansion nodes: https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/expansion/lib/expansionNodes.ts

**Secondary sources (for functional descriptions):**
- Official docs: https://docs.sunflower-land.com/
- Wiki: https://sunflowerland.fandom.com/ (community wiki, treat as non-authoritative)

Where GitHub source and community docs conflict, GitHub is preferred.

---

## TOPIC 1: Craftable Buildings

All numeric values below are extracted directly from `BUILDINGS` and `BUILDINGS_DIMENSIONS` constants in `buildings.ts`. The `UPGRADABLES` record in the source is empty (`export const UPGRADABLES: Partial<Record<BuildingName, BuildingName>> = {};`) — there is no in-game building upgrade graph (the "upgrades" that exist are the Home sequence Tent → House → Manor → Mansion, granted by levelling, not crafted/upgraded from each other at a cost).

### Building cost, level, time and size table

| Building | Unlocks at Level | Coins | Wood | Stone | Iron | Gold | Crimstone | Oil | Other ingredients | Build time (sec) | Build time | Size (WxH) | Required island |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Town Center | ∞ (not craftable) | 0 | — | — | — | — | — | — | — | 30 | 30s | 4 x 3 | — |
| Mansion (Home) | ∞ (not craftable) | 0 | — | — | — | — | — | — | — | 30 | 30s | 6 x 5 | — |
| House (Home) | ∞ (not craftable) | 0 | — | — | — | — | — | — | — | 30 | 30s | 4 x 4 | — |
| Manor (Home) | ∞ (not craftable) | 0 | — | — | — | — | — | — | — | 30 | 30s | 5 x 4 | — |
| Market | ∞ (not craftable) | 0 | — | — | — | — | — | — | — | 30 | 30s | 3 x 2 | — |
| Fire Pit | ∞ (always available) | 0 | 3 | 2 | — | — | — | — | — | 0 | Instant | 3 x 2 | — |
| Workbench | ∞ (always available) | 5 | — | — | — | — | — | — | — | 60 | 1 min | 3 x 2 | — |
| Tent (Home) | ∞ (always available) | 20 | 50 | — | — | — | — | — | — | 3,600 | 1 h | 3 x 2 | — |
| Water Well | 2 | 100 | 5 | — | — | — | — | — | — | 300 | 5 min | 2 x 2 | — |
| Kitchen | 5 | 10 | 30 | 5 | — | — | — | — | — | 1,800 | 30 min | 4 x 3 | — |
| Hen House | 6 | 100 | 30 | — | 5 | 5 | — | — | — | 7,200 | 2 h | 4 x 3 | — |
| Crafting Box | 6 | 0 | 100 | 5 | — | — | — | — | — | 3,600 | 1 h | 3 x 2 | — |
| Compost Bin | 7 | 0 | 5 | 5 | — | — | — | — | — | 3,600 | 1 h | 2 x 2 | — |
| Bakery | 8 | 200 | 50 | 20 | — | 5 | — | — | — | 14,400 | 4 h | 4 x 3 | — |
| Fish Market | 10 | 0 | 50 | — | 10 | 5 | — | — | — | 3,600 | 1 h | 3 x 3 | — |
| Turbo Composter | 12 | 0 | 50 | 25 | — | — | — | — | — | 7,200 | 2 h | 2 x 2 | — |
| Deli | 16 | 300 | 50 | 50 | — | 10 | — | — | — | 43,200 | 12 h | 4 x 3 | — |
| Premium Composter | 18 | 0 | — | — | — | 50 | — | — | — | 14,400 | 4 h | 2 x 2 | — |
| Warehouse | 20 | 0 | 250 | 150 | — | — | — | — | Potato 5,000; Pumpkin 2,000; Wheat 500; Kale 100 | 7,200 | 2 h | 3 x 2 | — |
| Smoothie Shack | 23 | 0 | 25 | 25 | 10 | — | — | — | — | 43,200 | 12 h | 3 x 2 | — |
| Toolshed | 25 | 0 | 500 | — | — | 30 | — | — | Axe 100; Pickaxe 50; Gold 25 | 7,200 | 2 h | 2 x 2 | — |
| Barn | 30 | 200 | 150 | — | 10 | 10 | — | — | — | 7,200 | 2 h | 4 x 4 | — |
| Crop Machine | 35 | 8,000 | 1,250 | — | 125 | — | 50 | — | — | 7,200 | 2 h | 5 x 4 | desert |
| Greenhouse | 46 | 4,800 | 500 | 100 | — | — | 25 | 100 | — | 14,400 | 4 h | 4 x 4 | desert |
| Pet House | 0 (unlocksAtLevel: 0) | 5,000 | 200 | 100 | — | — | — | — | — | 7,200 | 2 h | 3 x 3 | — |
| Aging Shed | 0 (unlocksAtLevel: 0) | 200 | 30 | — | — | — | — | — | — | 0 | Instant | 3 x 2 | — |

Notes:
- `unlocksAtLevel: Infinity` in the source means the building is not placed via the normal crafting UI; it is either permanent scenery (Town Center, Market) or a Home variant granted automatically at fixed Bumpkin levels.
- The Toolshed recipe requires crafted tools (Axe, Pickaxe) in addition to raw resources.
- The Warehouse recipe requires large crop stockpiles (Potato, Pumpkin, Wheat, Kale).
- `requiredIsland` means the expansion land type must be reached first. Crop Machine and Greenhouse are Desert-island buildings.
- There is no "Manor" in the craftable list that is separate from the automatic Home progression. "Workbench" and "Manor" are listed separately in some player guides — in code, both exist but only Workbench is actively craftable; Manor is a Home tier placed automatically.
- The file does not define a "Premium Greenhouse" or similar further tier; Greenhouse is the highest-level cooking/farming building in the current source.
- There is no "Upgrade cost" graph — `UPGRADABLES` is an empty object. Upgrading a building by spending resources is not implemented in the current code. Any wiki claim of upgrade costs should be treated as unverified.

### Building function / in-game role

Functional descriptions are summarized from community docs and in-game use; only the numeric craft data above comes from source.

| Building | Function |
|---|---|
| Town Center | Central hub NPC, quest giver; always present. |
| Market | Shop for crop and fruit seeds, tree seeds, and some basic sells. |
| Fire Pit | Cooks the lowest-tier foods (Mashed Potato, Pumpkin Soup, Reindeer Carrot, etc.). |
| Workbench | Crafts tools (Axe, Pickaxe, Stone Pickaxe, Iron Pickaxe, Oil Drill, Gold Pickaxe, Rod). |
| Water Well | Expands the number of crop plots a Bumpkin can work on before needing a new Well — adds "crop capacity". |
| Kitchen | Cooks mid-tier meals (Boiled Eggs, Bumpkin Broth, Mushroom Soup, Roast Veggies, Bumpkin Salad, Goblin's Treat, Cauliflower Burger, Club Sandwich, Pancakes, Fruit Salad, Bumpkin ganoush, etc.). |
| Hen House | Places chickens; required to collect eggs. Upgrade-like capacity is governed by Barn, not a Hen House upgrade. |
| Crafting Box | Newer crafting station for new-system recipes (pet beds, etc.). |
| Compost Bin | Produces Sprout Mix (basic fertiliser) from crops. |
| Bakery | Bakes Apple Pie, Carrot Cake, Kale & Mushroom Pie, Sunflower Cake, Potato Cake, Pumpkin Cake, Cabbage Cake, Beetroot Cake, Cauliflower Cake, Parsnip Cake, Radish Cake, Wheat Cake, Honey Cake, etc. |
| Fish Market | Processes / sells fish; needed for some fish recipes and fisher progression. |
| Turbo Composter | Produces Fruitful Blend (fruit-boost fertiliser). |
| Deli | Cooks high-tier meals (Blueberry Jam, Fermented Carrots, Sauerkraut, Fancy Fries, Fermented Fish, etc.). |
| Premium Composter | Produces Rapid Root (crop-growth fertiliser). |
| Warehouse | Inventory expansion building (increases stack cap / seeds held on farm). |
| Smoothie Shack | Produces smoothies and juices (Apple Juice, Orange Juice, Purple Smoothie, Power Smoothie, Bumpkin Detox, Banana Blast, etc.). |
| Toolshed | Increases tool crafting efficiency / cap. |
| Barn | Places and increases animal capacity (Cows, Sheep, etc.). |
| Crop Machine | Automated crop harvesting machine — queues crops to plant and harvest automatically. Desert island only. |
| Greenhouse | Grows greenhouse-exclusive crops (Rice, Olive, Grapes, etc.) that need Oil as fuel. Desert island only. |
| Pet House | Shelters pets (new pet system). |
| Aging Shed | Ages / ferments items (new food-aging system). |
| Tent / House / Manor / Mansion | Bumpkin Home — visual progression that unlocks with level; house tier gates some systems. |

### Upgrades

From `buildings.ts` line 59:

```
export const UPGRADABLES: Partial<Record<BuildingName, BuildingName>> = {};
```

The `UPGRADABLES` record is empty. The game currently has no implemented "spend resources to upgrade building X to building Y" mechanic in source. The Home progression (Tent → House → Manor → Mansion) is level-gated and placed automatically; it is not a paid upgrade.

Source: https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/buildings.ts

---

## TOPIC 2: Land Expansions

All expansion requirement blocks were extracted verbatim from `expansions.ts`. Node counts (crop plots, trees, rocks, etc.) were extracted from `expansionNodes.ts` and show the *cumulative total on the map* after that expansion is complete (not the delta added by that expansion). The `LAND_GEM_RATIO` constant is `15`, so every line of the form `Gem: N * LAND_GEM_RATIO` becomes `N * 15` gems.

Notes on expansion indexing:
- Basic land starts with 3 expansions (the default starter farm). Expansion 4 is the first unlock.
- Spring land starts at expansion 5 (you arrive with 4 already unlocked on Spring after the transition from Basic).
- Desert land starts at expansion 5 likewise.
- Volcano land starts at expansion 6.
- Every island type keeps its own counter; the "expansion number" resets between islands.
- "Basic → Spring", "Spring → Desert", "Desert → Volcano" transitions are triggered by reaching a specific Bumpkin level and paying the transition NPC (see end of this section).

### 2.1 Basic Island

Source: `expansions.ts` lines 2545–2756 (EXPANSION_REQUIREMENTS.basic), nodes from `expansionNodes.ts` `TOTAL_EXPANSION_NODES.basic`.

| Exp # | Bumpkin Lvl | Coins | Wood | Stone | Iron | Gold | Gem | Seconds | Build time |
|---|---|---|---|---|---|---|---|---|---|
| 4 | 1 | — | 3 | — | — | — | — | 5 | 5s |
| 5 | 1 | 0.25 | 5 | — | — | — | — | 5 | 5s |
| 6 | 2 | 60 | — | 1 | — | — | — | 60 | 1 min |
| 7 | 5 | 100 | — | 5 | 1 | — | — | 1,800 | 30 min |
| 8 | 8 | 200 | — | — | 3 | 1 | — | 14,400 | 4 h |
| 9 | 11 | 300 | 100 | 40 | 5 | — | — | 43,200 | 12 h |
| 10 | 13 | — | 100 | 50 | 5 | 2 | 15 | 86,400 | 24 h |
| 11 | 15 | — | — | — | — | 10 | 15 | 86,400 | 24 h |
| 12 | 17 | — | 500 | 20 | — | 2 | 15 | 86,400 | 24 h |
| 13 | 20 | — | 100 | 150 | — | 5 | 15 | 86,400 | 24 h |
| 14 | 23 | — | 40 | 30 | 10 | 10 | 15 | 129,600 | 36 h |
| 15 | 26 | — | 200 | — | — | 15 | 15 | 129,600 | 36 h |
| 16 | 30 | — | — | 150 | 30 | 10 | 15 | 129,600 | 36 h |
| 17 | 34 | — | 200 | 50 | — | 25 | 15 | 129,600 | 36 h |
| 18 | 37 | — | 300 | 200 | 30 | 10 | 15 | 129,600 | 36 h |
| 19 | 40 | — | 100 | 250 | — | 30 | 15 | 172,800 | 48 h |
| 20 | 45 | — | 1,000 | 100 | 10 | 25 | 15 | 172,800 | 48 h |
| 21 | 50 | — | 1,500 | 100 | 20 | 25 | 30 | 172,800 | 48 h |
| 22 | 55 | — | 2,000 | 200 | 20 | 40 | 30 | 172,800 | 48 h |
| 23 | 60 | — | 2,000 | 250 | 50 | 60 | 30 | 172,800 | 48 h |

Note on `coins: 0.25` at expansion 5: this is the literal value in source. It is almost certainly a legacy/token sentinel (the base cost of coins is 1), treat this as effectively-free. No `sfl` is required on Basic land.

**Cumulative node counts on Basic Island after each expansion** (from `TOTAL_EXPANSION_NODES.basic`):

| Exp # | Crop Plot | Tree | Stone Rock | Iron Rock | Gold Rock | Crimstone | Sunstone | Fruit Patch | Flower Bed | Beehive | Oil | Lava Pit |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 3 (starter) | 0 | 3 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 4 | 9 | 5 | 3 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 5 | 17 | 6 | 4 | 2 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 6 | 25 | 7 | 5 | 2 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 7 | 27 | 8 | 6 | 3 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 8 | 29 | 9 | 7 | 3 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 9 | 31 | 9 | 7 | 4 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 10 | 31 | 9 | 7 | 4 | 2 | 0 | 0 | 2 | 0 | 0 | 0 | 0 |
| 11 | 33 | 11 | 9 | 5 | 3 | 0 | 0 | 3 | 0 | 0 | 0 | 0 |
| 12 | 33 | 12 | 10 | 5 | 3 | 0 | 0 | 4 | 0 | 0 | 0 | 0 |
| 13 | 35 | 13 | 11 | 5 | 3 | 0 | 0 | 4 | 0 | 0 | 0 | 0 |
| 14 | 37 | 13 | 12 | 6 | 4 | 0 | 0 | 5 | 0 | 0 | 0 | 0 |
| 15 | 37 | 14 | 12 | 6 | 4 | 0 | 0 | 6 | 0 | 0 | 0 | 0 |
| 16 | 37 | 14 | 12 | 7 | 5 | 0 | 0 | 7 | 0 | 0 | 0 | 0 |
| 17 | 39 | 15 | 13 | 7 | 5 | 0 | 0 | 8 | 0 | 0 | 0 | 0 |
| 18 | 41 | 15 | 13 | 7 | 5 | 0 | 0 | 8 | 0 | 0 | 0 | 0 |
| 19 | 41 | 16 | 14 | 8 | 5 | 0 | 0 | 9 | 0 | 0 | 0 | 0 |
| 20 | 43 | 16 | 14 | 8 | 5 | 0 | 0 | 10 | 0 | 0 | 0 | 0 |
| 21 | 44 | 17 | 15 | 9 | 5 | 0 | 0 | 11 | 0 | 0 | 0 | 0 |
| 22 | 45 | 18 | 15 | 9 | 6 | 0 | 0 | 11 | 0 | 0 | 0 | 0 |
| 23 | 46 | 18 | 16 | 10 | 6 | 0 | 0 | 12 | 0 | 0 | 0 | 0 |

Key observations on Basic Island:
- No Crimstone, Sunstone, Oil, Beehive, Flower Bed, Lava Pit or Obsidian on Basic Island.
- Fruit Patches first appear at expansion 10 (bumpkin level 13).
- Gold Rocks first appear at expansion 5.
- Iron Rocks first appear at expansion 4.

### 2.2 Spring Island

Source: `expansions.ts` lines 2758–2954 (EXPANSION_REQUIREMENTS.spring), nodes from `TOTAL_EXPANSION_NODES.spring`.

On Spring Island, when a player transitions from Basic, the starter layout already has the contents of Basic expansion 10 (spring exp 4, see comment `// Basic Expansion 10`). Paid expansions run 5 → 20. Every Spring expansion requires `coins`.

| Exp # | Bumpkin Lvl | Coins | Wood | Stone | Iron | Gold | Crimstone | Gem | Seconds | Build time |
|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 11 | 100 | 20 | — | — | — | — | — | 60 | 1 min |
| 6 | 13 | 200 | 10 | 5 | — | 2 | — | — | 300 | 5 min |
| 7 | 16 | 300 | 30 | 20 | 5 | — | — | 15 | 1,800 | 30 min |
| 8 | 20 | 400 | 20 | — | — | — | 1 | 15 | 7,200 | 2 h |
| 9 | 23 | 500 | 50 | — | — | 5 | — | 15 | 7,200 | 2 h |
| 10 | 25 | 500 | — | 10 | — | — | 3 | 15 | 14,400 | 4 h |
| 11 | 27 | 500 | 100 | 25 | — | 5 | 1 | 15 | 28,800 | 8 h |
| 12 | 29 | 500 | 50 | — | 5 | — | 3 | 30 | 43,200 | 12 h |
| 13 | 32 | 500 | 50 | 25 | 10 | 10 | — | 30 | 43,200 | 12 h |
| 14 | 36 | 500 | 100 | 10 | — | — | 5 | 30 | 86,400 | 24 h |
| 15 | 40 | 500 | 150 | 10 | 10 | 5 | 5 | 30 | 86,400 | 24 h |
| 16 | 43 | 500 | 100 | 10 | — | 5 | 8 | 30 | 86,400 | 24 h |
| 17 | 47 | 500 | 100 | 20 | 10 | 5 | 12 | 30 | 129,600 | 36 h |
| 18 | 51 | 500 | 150 | 20 | 10 | 5 | 16 | 30 | 129,600 | 36 h |
| 19 | 53 | 500 | 150 | 10 | 5 | 5 | 20 | 30 | 129,600 | 36 h |
| 20 | 55 | 500 | 50 | 5 | 5 | 5 | 24 | 30 | 172,800 | 48 h |

**Cumulative node counts on Spring Island** (from `TOTAL_EXPANSION_NODES.spring`):

| Exp # | Crop Plot | Tree | Stone | Iron | Gold | Crimstone | Sunstone | Fruit Patch | Flower Bed | Beehive | Oil | Lava |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 4 (arrive) | 31 | 9 | 7 | 4 | 2 | 0 | 0 | 2 | 0 | 0 | 0 | 0 |
| 5 | 33 | 11 | 9 | 5 | 3 | 0 | 0 | 3 | 0 | 0 | 0 | 0 |
| 6 | 33 | 12 | 10 | 5 | 3 | 0 | 0 | 4 | 1 | 1 | 0 | 0 |
| 7 | 35 | 13 | 11 | 5 | 3 | 1 | 0 | 4 | 1 | 1 | 0 | 0 |
| 8 | 37 | 13 | 12 | 6 | 4 | 1 | 0 | 5 | 1 | 1 | 0 | 0 |
| 9 | 37 | 14 | 12 | 6 | 4 | 1 | 1 | 6 | 1 | 1 | 0 | 0 |
| 10 | 37 | 14 | 12 | 7 | 5 | 1 | 1 | 7 | 2 | 2 | 0 | 0 |
| 11 | 39 | 15 | 13 | 7 | 5 | 1 | 1 | 8 | 2 | 2 | 0 | 0 |
| 12 | 41 | 15 | 13 | 7 | 5 | 1 | 1 | 8 | 2 | 2 | 0 | 0 |
| 13 | 41 | 16 | 14 | 8 | 5 | 1 | 2 | 9 | 2 | 2 | 0 | 0 |
| 14 | 43 | 16 | 14 | 8 | 5 | 1 | 2 | 10 | 2 | 2 | 0 | 0 |
| 15 | 44 | 17 | 15 | 9 | 5 | 2 | 2 | 11 | 2 | 2 | 0 | 0 |
| 16 | 45 | 18 | 15 | 9 | 6 | 2 | 2 | 11 | 3 | 3 | 0 | 0 |
| 17 | 46 | 18 | 16 | 10 | 6 | 2 | 2 | 12 | 3 | 3 | 0 | 0 |
| 18 | 46 | 18 | 16 | 10 | 6 | 2 | 3 | 12 | 3 | 3 | 0 | 0 |
| 19 | 48 | 18 | 16 | 10 | 6 | 3 | 3 | 12 | 3 | 3 | 0 | 0 |
| 20 | 50 | 18 | 16 | 10 | 6 | 3 | 4 | 12 | 3 | 3 | 0 | 0 |

Key observations on Spring Island:
- Introduces Crimstone Rocks (exp 7), Sunstone Rocks (exp 9), Flower Beds (exp 6), Beehives (exp 6).
- No Oil Reserves or Lava Pits on Spring.

### 2.3 Desert Island

Source: `expansions.ts` lines 2956–3282 (EXPANSION_REQUIREMENTS.desert), nodes from `TOTAL_EXPANSION_NODES.desert`. Desert starter (exp 4) = Spring island level 16 layout.

Desert expansions introduce `Oil` as a crafting ingredient.

| Exp # | Bumpkin Lvl | Coins | Wood | Stone | Iron | Gold | Crimstone | Oil | Gem | Seconds | Build time |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 40 | 500 | 50 | 10 | 5 | 5 | — | — | — | 60 | 1 min |
| 6 | 40 | 500 | 100 | 20 | 10 | 5 | — | — | — | 300 | 5 min |
| 7 | 41 | 500 | 150 | 20 | 10 | 5 | — | — | 15 | 1,800 | 30 min |
| 8 | 42 | 500 | 150 | 10 | 5 | 5 | 3 | 5 | 30 | 7,200 | 2 h |
| 9 | 43 | 500 | 50 | 5 | 5 | 5 | 6 | 5 | 30 | 7,200 | 2 h |
| 10 | 44 | 384 | 100 | 50 | 10 | 5 | 12 | 10 | 45 | 28,800 | 8 h |
| 11 | 45 | 768 | 150 | 75 | 10 | 5 | 15 | 30 | 45 | 43,200 | 12 h |
| 12 | 47 | 1,536 | 100 | 100 | 5 | 10 | 18 | 30 | 45 | 43,200 | 12 h |
| 13 | 50 | 3,072 | 200 | 50 | 15 | 10 | 21 | 40 | 45 | 86,400 | 24 h |
| 14 | 53 | 3,840 | 200 | 100 | 15 | 10 | 24 | 50 | 45 | 86,400 | 24 h |
| 15 | 56 | 3,840 | 300 | 50 | 20 | 10 | 27 | 75 | 45 | 86,400 | 24 h |
| 16 | 58 | 3,840 | 250 | 125 | 15 | 15 | 30 | 100 | 60 | 129,600 | 36 h |
| 17 | 60 | 5,760 | 350 | 75 | 20 | 10 | 33 | 125 | 60 | 129,600 | 36 h |
| 18 | 63 | 5,760 | 400 | 125 | 25 | 15 | 36 | 150 | 75 | 129,600 | 36 h |
| 19 | 65 | 7,680 | 450 | 150 | 30 | 20 | 39 | 200 | 60 | 129,600 | 36 h |
| 20 | 68 | 7,680 | 525 | 200 | 35 | 30 | 42 | 250 | 60 | 172,800 | 48 h |
| 21 | 70 | 9,600 | 550 | 150 | 30 | 25 | 45 | 350 | 60 | 172,800 | 48 h |
| 22 | 72 | 9,600 | 600 | 200 | 35 | 30 | 48 | 450 | 75 | 172,800 | 48 h |
| 23 | 73 | 9,600 | 650 | 250 | 40 | 35 | 51 | 500 | 75 | 216,000 | 60 h |
| 24 | 74 | 11,520 | 700 | 300 | 50 | 45 | 54 | 550 | 75 | 216,000 | 60 h |
| 25 | 75 | 13,440 | 750 | 350 | 50 | 50 | 60 | 650 | 75 | 216,000 | 60 h |

All Desert rows have `sfl: 0` in source. Note `seconds: 60 * 60 * 60 = 216,000` (= 60 hours) for expansions 23–25.

**Cumulative node counts on Desert Island** (selected, from `TOTAL_EXPANSION_NODES.desert`):

| Exp # | Crop Plot | Tree | Stone | Iron | Gold | Crimstone | Sunstone | Fruit Patch | Flower Bed | Beehive | Oil | Lava |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 4 (arrive) | 45 | 18 | 15 | 9 | 6 | 2 | 2 | 11 | 3 | 3 | 0 | 0 |
| 5 | 46 | 18 | 16 | 10 | 6 | 2 | 2 | 11 | 3 | 3 | 1 | 0 |
| 6 | 46 | 18 | 16 | 10 | 6 | 2 | 3 | 12 | 3 | 3 | 1 | 0 |
| 7 | 48 | 18 | 16 | 10 | 6 | 3 | 3 | 12 | 3 | 3 | 1 | 0 |
| 8 | 50 | 18 | 16 | 10 | 6 | 3 | 4 | 12 | 3 | 3 | 1 | 0 |
| 9 | 50 | 19 | 17 | 10 | 6 | 3 | 4 | 12 | 3 | 3 | 1 | 0 |
| 10 | 51 | 19 | 17 | 11 | 6 | 3 | 4 | 12 | 3 | 3 | 1 | 0 |
| 11 | 52 | 19 | 17 | 11 | 6 | 3 | 4 | 13 | 3 | 3 | 1 | 0 |
| 12 | 54 | 19 | 17 | 11 | 6 | 3 | 4 | 13 | 3 | 3 | 1 | 0 |
| 13 | 54 | 20 | 17 | 11 | 6 | 3 | 4 | 13 | 3 | 3 | 1 | 0 |
| 14 | 55 | 20 | 18 | 11 | 6 | 3 | 4 | 13 | 3 | 3 | 1 | 0 |
| 15 | 56 | 20 | 18 | 11 | 6 | 3 | 4 | 13 | 3 | 3 | 2 | 0 |
| 16 | 57 | 21 | 18 | 11 | 6 | 3 | 4 | 13 | 3 | 3 | 2 | 0 |
| 17 | 59 | 21 | 18 | 11 | 6 | 3 | 4 | 13 | 3 | 3 | 2 | 0 |
| 18 | 60 | 21 | 18 | 11 | 7 | 3 | 4 | 13 | 3 | 3 | 2 | 0 |
| 19 | 61 | 21 | 18 | 11 | 7 | 3 | 4 | 14 | 3 | 3 | 2 | 0 |
| 20 | 61 | 22 | 19 | 11 | 7 | 3 | 4 | 14 | 3 | 3 | 3 | 0 |
| 21 | 62 | 22 | 19 | 12 | 7 | 3 | 5 | 14 | 3 | 3 | 3 | 0 |
| 22 | 62 | 23 | 19 | 12 | 7 | 3 | 5 | 15 | 3 | 3 | 3 | 0 |
| 23 | 63 | 23 | 19 | 12 | 7 | 4 | 5 | 15 | 3 | 3 | 3 | 0 |
| 24 | 64 | 23 | 19 | 12 | 7 | 4 | 6 | 15 | 3 | 3 | 3 | 0 |
| 25 | 65 | 23 | 20 | 12 | 7 | 4 | 6 | 15 | 3 | 3 | 3 | 0 |

Key observations on Desert Island:
- Introduces Oil Reserves (exp 5).
- No Lava Pits on Desert.

### 2.4 Volcano Island

Source: `expansions.ts` lines 3284–3698 (EXPANSION_REQUIREMENTS.volcano), nodes from `TOTAL_EXPANSION_NODES.volcano`. Volcano starter (exp 5) is the Desert island end layout.

Volcano expansions introduce `Obsidian` as a crafting ingredient.

| Exp # | Bumpkin Lvl | Coins | Wood | Stone | Iron | Gold | Crimstone | Oil | Obsidian | Gem | Seconds | Build time |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 6 | 70 | 500 | 100 | 50 | 30 | 10 | — | — | — | — | 10 | 10s |
| 7 | 72 | 384 | 200 | 75 | 25 | 15 | 4 | 30 | — | 30 | 300 | 5 min |
| 8 | 74 | 768 | 300 | 100 | 40 | 20 | 8 | 60 | — | 30 | 1,800 | 30 min |
| 9 | 76 | 1,152 | 400 | 150 | 35 | 25 | 12 | 90 | — | 60 | 3,600 | 1 h |
| 10 | 78 | 1,920 | 450 | 200 | 30 | 20 | 16 | 120 | 1 | 60 | 7,200 | 2 h |
| 11 | 80 | 3,000 | 500 | 175 | 30 | 30 | 20 | 100 | — | 90 | 14,400 | 4 h |
| 12 | 82 | 3,840 | 650 | 225 | 25 | 25 | 24 | 100 | 2 | 150 | 28,800 | 8 h |
| 13 | 84 | 4,800 | 550 | 200 | 40 | 30 | 28 | 100 | — | 150 | 43,200 | 12 h |
| 14 | 86 | 5,760 | 700 | 250 | 35 | 35 | 32 | 100 | 1 | 150 | 43,200 | 12 h |
| 15 | 88 | 6,720 | 650 | 200 | 30 | 40 | 36 | 200 | 2 | 150 | 86,400 | 24 h |
| 16 | 90 | 7,680 | 750 | 250 | 40 | 30 | 40 | 200 | 4 | 150 | 86,400 | 24 h |
| 17 | 92 | 9,600 | 700 | 200 | 35 | 35 | 44 | 200 | 4 | 150 | 86,400 | 24 h |
| 18 | 94 | 12,000 | 800 | 300 | 45 | 45 | 48 | 200 | 6 | 180 | 129,600 | 36 h |
| 19 | 96 | 15,360 | 750 | 250 | 40 | 40 | 52 | 200 | 6 | 180 | 129,600 | 36 h |
| 20 | 98 | 18,000 | 850 | 300 | 45 | 30 | 56 | 200 | 8 | 180 | 172,800 | 48 h |
| 21 | 100 | 21,600 | 900 | 325 | 50 | 35 | 60 | 200 | 8 | 180 | 172,800 | 48 h |
| 22 | 102 | 25,200 | 800 | 300 | 45 | 30 | 64 | 200 | 10 | 180 | 172,800 | 48 h |
| 23 | 104 | 30,000 | 950 | 350 | 50 | 35 | 68 | 200 | 10 | 180 | 172,800 | 48 h |
| 24 | 106 | 33,600 | 1,000 | 400 | 55 | 40 | 72 | 300 | 12 | 180 | 172,800 | 48 h |
| 25 | 108 | 38,400 | 1,100 | 450 | 60 | 35 | 80 | 300 | 12 | 180 | 216,000 | 60 h |
| 26 | 110 | 42,000 | 1,200 | 350 | 65 | 30 | 85 | 300 | 18 | 180 | 216,000 | 60 h |
| 27 | 112 | 45,600 | 1,250 | 450 | 70 | 40 | 95 | 300 | 24 | 225 | 216,000 | 60 h |
| 28 | 114 | 50,400 | 1,150 | 500 | 60 | 45 | 100 | 300 | 30 | 225 | 216,000 | 60 h |
| 29 | 116 | 54,000 | 1,350 | 550 | 65 | 40 | 105 | 300 | 36 | 225 | 259,200 | 72 h |
| 30 | 120 | 60,000 | 1,500 | 600 | 70 | 50 | 125 | 300 | 42 | 225 | 259,200 | 72 h |

All Volcano rows have `sfl: 0`.

**Cumulative node counts on Volcano Island** (selected, from `TOTAL_EXPANSION_NODES.volcano`):

| Exp # | Crop Plot | Tree | Stone | Iron | Gold | Crimstone | Sunstone | Fruit Patch | Flower Bed | Beehive | Oil | Lava Pit |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 5 (arrive) | 65 | 23 | 20 | 12 | 7 | 4 | 6 | 15 | 3 | 3 | 3 | 0 |
| 6 | 65 | 23 | 20 | 12 | 7 | 4 | 6 | 15 | 3 | 3 | 3 | 0 |
| 7 | 65 | 23 | 20 | 12 | 7 | 4 | 6 | 15 | 3 | 3 | 3 | 1 |
| 8 | 65 | 23 | 20 | 12 | 7 | 4 | 7 | 15 | 3 | 3 | 3 | 1 |
| 9 | 65 | 23 | 20 | 12 | 7 | 4 | 7 | 15 | 3 | 3 | 3 | 1 |
| 10 | 65 | 23 | 20 | 12 | 8 | 4 | 7 | 15 | 3 | 3 | 3 | 1 |
| 11 | 65 | 23 | 20 | 12 | 8 | 4 | 7 | 15 | 3 | 3 | 3 | 1 |
| 12 | 65 | 23 | 20 | 12 | 8 | 4 | 8 | 15 | 3 | 3 | 3 | 1 |
| 13 | 65 | 23 | 20 | 12 | 8 | 4 | 8 | 15 | 3 | 3 | 3 | 1 |
| 14 | 65 | 23 | 20 | 12 | 8 | 4 | 8 | 15 | 3 | 3 | 3 | 1 |
| 15 | 65 | 23 | 20 | 12 | 8 | 4 | 8 | 15 | 3 | 3 | 3 | 2 |
| 16 | 65 | 23 | 20 | 12 | 8 | 4 | 8 | 15 | 3 | 3 | 4 | 2 |
| 17 | 65 | 23 | 20 | 12 | 8 | 4 | 9 | 15 | 3 | 3 | 4 | 2 |
| 18 | 65 | 23 | 20 | 12 | 8 | 4 | 9 | 15 | 3 | 3 | 4 | 2 |
| 19 | 65 | 23 | 20 | 12 | 8 | 4 | 10 | 15 | 3 | 3 | 4 | 2 |
| 20 | 65 | 23 | 20 | 12 | 8 | 4 | 10 | 15 | 3 | 3 | 4 | 2 |
| 21 | 65 | 23 | 20 | 12 | 8 | 4 | 11 | 15 | 3 | 3 | 4 | 2 |
| 22 | 65 | 23 | 20 | 12 | 8 | 4 | 11 | 15 | 3 | 3 | 4 | 2 |
| 23 | 65 | 23 | 20 | 13 | 8 | 4 | 11 | 15 | 3 | 3 | 4 | 2 |
| 24 | 65 | 23 | 20 | 13 | 8 | 4 | 11 | 15 | 3 | 3 | 4 | 3 |
| 25 | 65 | 23 | 20 | 13 | 8 | 5 | 11 | 15 | 3 | 3 | 4 | 3 |
| 26 | 65 | 23 | 20 | 13 | 8 | 5 | 11 | 15 | 3 | 3 | 4 | 3 |
| 27 | 65 | 23 | 20 | 13 | 8 | 5 | 11 | 15 | 3 | 3 | 4 | 3 |
| 28 | 65 | 23 | 20 | 13 | 8 | 5 | 12 | 15 | 3 | 3 | 4 | 3 |
| 29 | 65 | 23 | 20 | 13 | 8 | 5 | 12 | 15 | 3 | 3 | 4 | 3 |
| 30 | 65 | 23 | 20 | 13 | 8 | 5 | 13 | 15 | 3 | 3 | 4 | 3 |

Key observations on Volcano Island:
- Introduces Lava Pits (exp 7) — a Volcano-exclusive node.
- Crop Plots, Trees, Stone Rocks, Fruit Patches, Flower Beds and Beehives remain fixed at 65/23/20/15/3/3 for the entire Volcano run: late-Volcano expansions primarily add Sunstone, Gold, Iron, Crimstone, Oil and Lava Pit nodes.
- Introduces Obsidian as an ingredient (from exp 10 onward).

### 2.5 Island-to-island transitions

The Basic → Spring → Desert → Volcano transitions are implemented separately from the expansion requirements table above. The transition is gated by reaching the last expansion of the previous island and by Bumpkin level, but the code path uses island-travel NPCs / quest handlers rather than a single constant record. The "cost" to move between islands is the cost of reaching the last expansion of the previous island, plus any in-game travel quest. In the authoritative source file the `EXPANSION_REQUIREMENTS` record only covers the per-island expansion grids; there is no constant `BASIC_TO_SPRING_COST` etc.

Approximate gating (bumpkin level thresholds, from the expansion tables above):

| Transition | Required island state | Approx. Bumpkin level at transition |
|---|---|---|
| Basic → Spring | Basic expansion 9 completed (11 expansions, bumpkin 11) | 11 (SPRING_LAND_5 gate) |
| Spring → Desert | Spring expansion 16 completed (bumpkin 43) | 40 (DESERT_LAND_5 gate) |
| Desert → Volcano | Desert expansion 25 completed (bumpkin 75) | 70 (VOLCANO_LAND_6 gate) |

The Spring arrival layout = Basic expansion 10; Desert arrival = Spring expansion 16; Volcano arrival = Desert expansion 25 — you do not lose nodes, you bring them with you.

If the clone project wants a specific gem/coin/resource cost line item for "buying a boat ticket" between islands, that has to be read from the travel quest-handler sources (`src/features/game/events/landExpansion/beginExpedition.ts` / travel/boat quest files), not from `expansions.ts`. I did not capture those numbers here — flag this as a follow-up research item if needed.

---

## Conflicts and caveats

- Community wikis (fandom, medium posts) sometimes quote older numbers (pre-2024 rebalance). Where they differ from the GitHub file, GitHub wins.
- Legacy expansion 10+ on Basic used to be randomised by `LAND_PACK_THREE`/`_FOUR`/`_FIVE` groups based on `getPlayerGroup(id)`. Those legacy packs still exist in the file for refund/legacy-save handling (see the comment `LEGACY - used for refunding expansions - do not remove` at line 3711). The `EXPANSION_REQUIREMENTS` table is the single source of truth for newly-expanded land — clones should use it.
- `coins: 0.25` at Basic expansion 5 is in source and is unusual — probably a legacy artifact. Treat as zero.
- `LAND_GEM_RATIO = 15` — any line showing `1 * LAND_GEM_RATIO` means 15 gems, `2 * LAND_GEM_RATIO` = 30, etc. Fully expanded here.
- Building `unlocksAtLevel: 0` for Pet House and Aging Shed means they are always available when their required systems are active; they may be gated by other progression (quests, aging-shed unlock event) not captured in the single constant.
- The authoritative `UPGRADABLES` record is empty, so there are no building upgrade costs to extract. If a wiki lists "upgrade your Hen House for X wood", that is not in source code.
- `Obsidian` is a Volcano-only resource introduced as an expansion cost from Volcano expansion 10+. No Volcano expansion in the node-map table currently exposes an Obsidian *node* — it likely comes from Lava Pits or rare drops, handled in resource-collection code, not the expansion grid. Flag for follow-up.
- The `spring` island expansion grid starts at level 5 (not 4) because the Spring arrival layout is fixed at Spring exp 4. Similarly Desert starts at exp 5, Volcano at exp 6.
