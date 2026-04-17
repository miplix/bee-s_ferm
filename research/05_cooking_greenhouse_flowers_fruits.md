# Sunflower Land Research: Cooking, Greenhouse, Flowers, Fruits

**Research date:** 2026-04-11
**Primary source:** Sunflower Land GitHub repository (main branch)
**Repository:** https://github.com/sunflower-land/sunflower-land

All values below are extracted from the authoritative TypeScript source files. Where a field is not present in the game code (e.g. cooked food has no direct sell price — it is consumed or delivered), it is marked `N/A`.

---

## Table of Contents

1. [Cooking Buildings & Recipes](#1-cooking-buildings--recipes)
2. [Greenhouse](#2-greenhouse)
3. [Flowers & Flower Beds](#3-flowers--flower-beds)
4. [Fruits (Fruit Patches)](#4-fruits-fruit-patches)
5. [Sources](#sources)

---

## 1. Cooking Buildings & Recipes

### 1.1 Building unlock levels and construction costs

Source: `src/features/game/types/buildings.ts`

| Building | Bumpkin Level | Construction Cost | Coins |
|---|---|---|---|
| Fire Pit | Default (always available) | 3 Wood, 2 Stone | 0 |
| Kitchen | 5 | 30 Wood, 5 Stone | 10 |
| Bakery | 8 | 50 Wood, 20 Stone, 5 Gold | 200 |
| Deli | 16 | 50 Wood, 50 Stone, 10 Gold | 300 |
| Smoothie Shack | 23 | 25 Wood, 25 Stone, 10 Iron | 0 |
| Greenhouse | 46 | 500 Wood, 100 Stone, 25 Crimstone, 100 Oil | 4,800 |

> **Note on "Bumpkin level required to unlock" per recipe:** In Sunflower Land the recipe is gated by the building, not by an individual recipe-level lock. A recipe is unlocked as soon as the player has the corresponding building. In consumables.ts, individual recipes have **no per-recipe bumpkinLevel field**. The "Bumpkin Level" column in recipe tables below is the level at which the building unlocks (i.e. the minimum level to ever cook that recipe).

### 1.2 Recipe data general notes

Source: `src/features/game/types/consumables.ts`

- Each recipe has: `name`, `description`, `ingredients` (item → quantity), `cookingSeconds`, `building`, `experience`.
- **No `sellPrice`/`marketRate` field exists on cookables** in the source. Cooked dishes are consumed by the Bumpkin for XP or turned in for deliveries/quests. They are not sold for coins on the market like raw crops are. This is flagged `N/A` in the tables below.
- `cookingSeconds: 0` recipes are instant cooks.

### 1.3 Fire Pit recipes (18)

Unlock: Default (level requirement applies from building availability). Source: consumables.ts (Fire Pit section).

| Dish | Ingredients | Cook Time (sec) | Cook Time (real) | XP | Sell |
|---|---|---|---|---|---|
| Mashed Potato | Potato x8 | 30 | 30s | 3 | N/A |
| Rhubarb Tart | Rhubarb x3 | 60 | 1m | 5 | N/A |
| Pumpkin Soup | Pumpkin x10 | 180 | 3m | 24 | N/A |
| Reindeer Carrot | Carrot x5 | 300 | 5m | 36 | N/A |
| Mushroom Soup | Wild Mushroom x5 | 600 | 10m | 56 | N/A |
| Popcorn | Sunflower x100, Corn x5 | 720 | 12m | 200 | N/A |
| Bumpkin Broth | Carrot x10, Cabbage x5 | 1,200 | 20m | 96 | N/A |
| Cabbers n Mash | Mashed Potato x10, Cabbage x20 | 2,400 | 40m | 250 | N/A |
| Boiled Eggs | Egg x10 | 3,600 | 1h | 90 | N/A |
| Kale Stew | Kale x10 | 7,200 | 2h | 400 | N/A |
| Fried Tofu | Soybean x15, Sunflower x200 | 5,400 | 1h 30m | 400 | N/A |
| Antipasto | Olive x2, Grape x2 | 10,800 | 3h | 3,000 | N/A |
| Kale Omelette | Egg x40, Kale x5 | 12,600 | 3h 30m | 1,250 | N/A |
| Gumbo | Potato x50, Pumpkin x30, Carrot x20, Red Snapper x3 | 14,400 | 4h | 600 | N/A |
| Rice Bun | Rice x2, Wheat x50 | 18,000 | 5h | 2,600 | N/A |
| Pizza Margherita | Tomato x30, Cheese x5, Wheat x20 | 72,000 | 20h | 25,000 | N/A |
| Rapid Roast (instant) | Magic Mushroom x1, Pumpkin x40 | 10 | 10s | 300 | N/A |
| Furikake Sprinkle (instant) | Fish Flake x1, Seaweed x1 | 0 | instant | 1,000 | N/A |

### 1.4 Kitchen recipes (28)

Unlock: Level 5. Source: consumables.ts (Kitchen section).

| Dish | Ingredients | Cook Time (sec) | Real Time | XP | Sell |
|---|---|---|---|---|---|
| Sunflower Crunch | Sunflower x300 | 600 | 10m | 50 | N/A |
| Mushroom Jacket Potatoes | Wild Mushroom x10, Potato x5 | 600 | 10m | 240 | N/A |
| Fruit Salad | Apple x1, Orange x1, Blueberry x1 | 1,800 | 30m | 225 | N/A |
| Pancakes | Wheat x10, Egg x10, Honey x6 | 3,600 | 1h | 1,000 | N/A |
| Sushi Roll | Angelfish x1, Seaweed x1, Rice x2 | 3,600 | 1h | 2,000 | N/A |
| Roast Veggies | Cauliflower x15, Carrot x10 | 7,200 | 2h | 170 | N/A |
| Fish Burger | Beetroot x10, Wheat x10, Horse Mackerel x1 | 7,200 | 2h | 1,300 | N/A |
| Ocean's Olive | Olive Flounder x1, Olive x2 | 7,200 | 2h | 2,000 | N/A |
| Cauliflower Burger | Cauliflower x15, Wheat x5 | 10,800 | 3h | 255 | N/A |
| Club Sandwich | Sunflower x100, Carrot x25, Wheat x5 | 10,800 | 3h | 170 | N/A |
| Tofu Scramble | Soybean x20, Egg x20, Cauliflower x10 | 10,800 | 3h | 1,000 | N/A |
| Caprese Salad | Cheese x1, Tomato x25, Kale x20 | 10,800 | 3h | 6,000 | N/A |
| Bumpkin Salad | Beetroot x20, Parsnip x10 | 12,600 | 3h 30m | 290 | N/A |
| Steamed Red Rice | Rice x3, Beetroot x50 | 14,400 | 4h | 3,000 | N/A |
| Fish n Chips | Fancy Fries x1, Halibut x1 | 14,400 | 4h | 2,000 | N/A |
| Bumpkin ganoush | Eggplant x30, Potato x50, Parsnip x10 | 18,000 | 5h | 1,000 | N/A |
| Fried Calamari | Sunflower x200, Wheat x15, Squid x1 | 18,000 | 5h | 1,500 | N/A |
| Fish Omelette | Egg x40, Surgeonfish x1, Butterflyfish x2 | 18,000 | 5h | 1,500 | N/A |
| Seafood Basket | Blowfish x2, Napoleanfish x2, Sunfish x2 | 18,000 | 5h | 2,200 | N/A |
| Goblin's Treat | Pumpkin x10, Radish x20, Cabbage x10 | 21,600 | 6h | 500 | N/A |
| Chowder | Beetroot x10, Wheat x10, Parsnip x5, Anchovy x3 | 28,800 | 8h | 1,000 | N/A |
| Bumpkin Roast | Mashed Potato x20, Roast Veggies x5 | 43,200 | 12h | 2,500 | N/A |
| Goblin Brunch | Boiled Eggs x5, Goblin's Treat x1 | 43,200 | 12h | 2,500 | N/A |
| Spaghetti al Limone | Wheat x10, Lemon x15, Cheese x3 | 54,000 | 15h | 15,000 | N/A |
| Beetroot Blaze (instant) | Magic Mushroom x2, Beetroot x50 | 30 | 30s | 2,000 | N/A |
| Surimi Rice Bowl (instant) | Fish Stick x1, Rice x1, Onion x1 | 0 | instant | 3,000 | N/A |
| Creamy Crab Bite (instant) | Crab Stick x1, Cheese x3 | 0 | instant | 10,000 | N/A |
| Crimstone Infused Fish Oil (instant) | Fish Oil x1, Crimstone x1 | 0 | instant | 18,000 | N/A |

### 1.5 Bakery recipes (17)

Unlock: Level 8. Source: consumables.ts (Bakery section).

| Dish | Ingredients | Cook Time (sec) | Real Time | XP | Sell |
|---|---|---|---|---|---|
| Apple Pie | Apple x5, Wheat x10, Egg x20 | 14,400 | 4h | 720 | N/A |
| Kale & Mushroom Pie | Wild Mushroom x10, Kale x5, Wheat x5 | 14,400 | 4h | 720 | N/A |
| Orange Cake | Orange x5, Egg x30, Wheat x10 | 14,400 | 4h | 730 | N/A |
| Sunflower Cake | Sunflower x1,000, Wheat x10, Egg x30 | 23,400 | 6h 30m | 525 | N/A |
| Honey Cake | Honey x10, Wheat x10, Egg x20 | 28,800 | 8h | 4,000 | N/A |
| Potato Cake | Potato x500, Wheat x10, Egg x30 | 37,800 | 10h 30m | 650 | N/A |
| Pumpkin Cake | Pumpkin x130, Wheat x10, Egg x30 | 37,800 | 10h 30m | 625 | N/A |
| Cornbread | Corn x15, Wheat x5, Egg x10 | 43,200 | 12h | 600 | N/A |
| Carrot Cake | Carrot x120, Wheat x10, Egg x30 | 46,800 | 13h | 750 | N/A |
| Cabbage Cake | Cabbage x90, Wheat x10, Egg x30 | 54,000 | 15h | 860 | N/A |
| Beetroot Cake | Beetroot x100, Wheat x10, Egg x30 | 79,200 | 22h | 1,250 | N/A |
| Cauliflower Cake | Cauliflower x60, Wheat x10, Egg x30 | 79,200 | 22h | 1,190 | N/A |
| Parsnip Cake | Parsnip x45, Wheat x10, Egg x30 | 86,400 | 24h | 1,300 | N/A |
| Eggplant Cake | Eggplant x30, Wheat x10, Egg x30 | 86,400 | 24h | 1,400 | N/A |
| Radish Cake | Radish x25, Wheat x10, Egg x30 | 86,400 | 24h | 1,200 | N/A |
| Wheat Cake | Wheat x35, Egg x30 | 86,400 | 24h | 1,100 | N/A |
| Lemon Cheesecake | Lemon x20, Cheese x5, Egg x40 | 108,000 | 30h | 30,000 | N/A |

### 1.6 Deli recipes (9)

Unlock: Level 16. Source: consumables.ts (Deli section).

| Dish | Ingredients | Cook Time (sec) | Real Time | XP | Sell |
|---|---|---|---|---|---|
| Cheese | Milk x3 | 1,200 | 20m | 1 | N/A |
| Blue Cheese | Cheese x2, Blueberry x10 | 10,800 | 3h | 6,000 | N/A |
| Blueberry Jam | Blueberry x5 | 43,200 | 12h | 500 | N/A |
| Honey Cheddar | Cheese x3, Honey x5 | 43,200 | 12h | 15,000 | N/A |
| Fermented Carrots | Carrot x20 | 86,400 | 24h | 250 | N/A |
| Sauerkraut | Cabbage x20 | 86,400 | 24h | 500 | N/A |
| Fancy Fries | Sunflower x500, Potato x500 | 86,400 | 24h | 1,000 | N/A |
| Fermented Fish | Tuna x6 | 86,400 | 24h | 3,000 | N/A |
| Shroom Syrup (instant) | Magic Mushroom x3, Honey x20 | 10 | 10s | 10,000 | N/A |

### 1.7 Smoothie Shack recipes (12)

Unlock: Level 23. Source: consumables.ts (Smoothie Shack section).

| Dish | Ingredients | Cook Time (sec) | Real Time | XP | Sell |
|---|---|---|---|---|---|
| Quick Juice | Sunflower x50, Pumpkin x40 | 1,800 | 30m | 100 | N/A |
| Purple Smoothie | Blueberry x5, Cabbage x10 | 1,800 | 30m | 310 | N/A |
| Orange Juice | Orange x5 | 2,700 | 45m | 375 | N/A |
| Apple Juice | Apple x5 | 3,600 | 1h | 500 | N/A |
| Carrot Juice | Carrot x30 | 3,600 | 1h | 200 | N/A |
| Sour Shake | Lemon x20 | 3,600 | 1h | 1,000 | N/A |
| Power Smoothie | Blueberry x10, Kale x5 | 5,400 | 1h 30m | 775 | N/A |
| Bumpkin Detox | Apple x5, Orange x5, Carrot x10 | 7,200 | 2h | 975 | N/A |
| Banana Blast | Banana x10, Egg x10 | 10,800 | 3h | 1,200 | N/A |
| Grape Juice | Grape x5, Radish x20 | 10,800 | 3h | 3,300 | N/A |
| The Lot | Blueberry x1, Orange x1, Grape x1, Apple x1, Banana x1 | 12,600 | 3h 30m | 1,500 | N/A |
| Slow Juice | Grape x10, Kale x100 | 86,400 | 24h | 7,500 | N/A |

**Total recipes:** 18 Fire Pit + 28 Kitchen + 17 Bakery + 9 Deli + 12 Smoothie Shack = **84 recipes**.

---

## 2. Greenhouse

Source files:
- `src/features/game/types/crops.ts` — greenhouse crops (Rice, Olive)
- `src/features/game/types/fruits.ts` — greenhouse fruit (Grape)
- `src/features/game/events/landExpansion/plantGreenhouse.ts` — oil costs, MAX_POTS
- `src/features/game/events/landExpansion/harvestGreenHouse.ts` — crop time constants
- `src/features/game/types/buildings.ts` — Greenhouse unlock

### 2.1 Greenhouse unlock and construction

| Property | Value |
|---|---|
| Bumpkin level required | 46 |
| Construction materials | 500 Wood, 100 Stone, 25 Crimstone, 100 Oil |
| Construction coins | 4,800 |
| Prerequisite | Desert island access |
| Maximum simultaneous plants | **MAX_POTS = 4** |

### 2.2 Greenhouse crops/fruits — full table

| Plant | Seed | Seed Price (coins) | Grow Time | Base Yield | Sell Price | Bumpkin Level | Oil Cost per plant |
|---|---|---|---|---|---|---|---|
| Rice | Rice Seed | 240 | 115,200 s (32 h) | 1 | 320 | 40 | 4 |
| Olive | Olive Seed | 320 | 158,400 s (44 h) | 1 | 400 | 40 | 6 |
| Grape | Grape Seed | 160 | 43,200 s (12 h) | 1 | 240 | 40 | 3 |

> Note: In the source, `getGreenhouseSeedUsage()` returns **1 seed per plant by default** (can become 2 with the "Seeded Bounty" skill, increasing output but also cost).

### 2.3 Yield boosts (for implementation reference)

Base yield is `1`. Source: `harvestGreenHouse.ts` → `getGreenhouseCropYieldAmount()`.

- Olive Royalty Shirt: +0.25 Olive
- Olive Shield: +1 Olive
- Non La Hat: +1 Rice
- Rice Panda: +0.25 Rice
- Pharaoh Gnome: +2 (all greenhouse crops)
- Glass Room: +0.1
- Seeded Bounty skill: +0.5
- Greasy Plants skill: +1
- Greenhouse Goodie: +0.2

### 2.4 Grow-time boosts (for implementation reference)

- Turbo Sprout: ×0.5 (50% faster)
- Tortoise Shrine: ×0.67
- Rice Rocket: ×0.9 (Rice only)
- Greenhouse Glow fertiliser: ×0.8

---

## 3. Flowers & Flower Beds

Source: `src/features/game/types/flowers.ts`, `src/features/game/lib/updateBeehives.ts`.

### 3.1 Flower seeds

All flower seeds plant in **Flower Bed** plots.

| Seed | Price (coins) | Bumpkin Level | Grow Time | Plants On |
|---|---|---|---|---|
| Sunpetal Seed | 16 | 13 | 1 day (86,400 s) | Flower Bed |
| Bloom Seed | 32 | 22 | 2 days (172,800 s) | Flower Bed |
| Lily Seed | 48 | 27 | 5 days (432,000 s) | Flower Bed |
| Edelweiss Seed | 96 | 35 | 3 days (259,200 s) | Flower Bed |
| Gladiolus Seed | 96 | 35 | 3 days (259,200 s) | Flower Bed |
| Lavender Seed | 96 | 35 | 3 days (259,200 s) | Flower Bed |
| Clover Seed | 96 | 35 | 3 days (259,200 s) | Flower Bed |

### 3.2 Flower varieties

Each base seed can produce one of several flowers depending on the cross-breed offering you attach when planting. Colors: Red / Yellow / Purple / White / Blue.

**Sunpetal Seed (11 variants):**
- Red / Yellow / Purple / White / Blue Pansy
- Red / Yellow / Purple / White / Blue Cosmos
- Prism Petal (epic)

**Bloom Seed (11 variants):**
- Red / Yellow / Purple / White / Blue Balloon Flower
- Red / Yellow / Purple / White / Blue Daffodil
- Celestial Frostbloom (epic)

**Lily Seed (11 variants):**
- Red / Yellow / Purple / White / Blue Carnation
- Red / Yellow / Purple / White / Blue Lotus
- Primula Enigma (epic)

**Edelweiss / Gladiolus / Lavender / Clover Seeds** — 5 color variants each (same color palette).

> The `FLOWERS` record in source holds `{ seed, description }` per variant. **No per-flower `sellPrice` is defined**. Flowers are not sold as commodity goods — they are used to attach to beehives and as cross-breed inputs.

### 3.3 Cross-breed (mutation) mechanics

When planting a flower seed, the player selects a cross-breed offering (a crop/fruit/flower) that biases which variant the seed grows into. Source constants:

**Set 1 (Sunpetal / Bloom / Lily) — `SET_1_FLOWER_CROSS_BREED_AMOUNTS`:**

| Material | Amount |
|---|---|
| Sunflower | 50 |
| Beetroot | 10 |
| Cauliflower | 5 |
| Parsnip | 5 |
| Eggplant | 5 |
| Radish | 5 |
| Kale | 5 |
| Blueberry | 3 |
| Apple | 3 |
| Banana | 3 |
| (every Set 1 flower variant — Pansies, Cosmos, Balloon Flowers, Daffodils, Carnations, Lotus, Prism Petal, Celestial Frostbloom) | 1 |

**Set 2 (Edelweiss / Gladiolus / Lavender / Clover) — `SET_2_FLOWER_CROSS_BREED_AMOUNTS`:**

| Material | Amount |
|---|---|
| Rhubarb | 25 |
| Pepper | 15 |
| Onion | 10 |
| Artichoke | 8 |
| Barley | 5 |
| (every Set 2 flower variant — Edelweiss, Gladiolus, Lavender, Clover colors) | 1 |

### 3.4 Mutant flowers

Source declares 7 mutant flower names as `MutantFlowerName`:

- Desert Rose
- Chicory
- Chamomile
- Lunalist
- Venus Bumpkin Trap
- Black Hole Flower
- Anemone Flower

> Mutant flower spawn chances are not defined in `flowers.ts` itself — they are rolled by the beehive swarm/mutation logic. The source code snippet inspected did not expose explicit numeric probabilities.

### 3.5 Flowers and beehives

Source: `src/features/game/lib/updateBeehives.ts`.

- A Beehive produces **1 unit of Honey per `DEFAULT_HONEY_PRODUCTION_TIME` = 24 hours (86,400,000 ms)**, scaled by the honey production rate.
- A flower planted in a Flower Bed **attaches to a nearby beehive** for the duration of its grow period, contributing to that hive's honey production window.
- Honey production rate is multiplicative and starts at `1`. Known boosts:

| Boost | Type | Effect |
|---|---|---|
| Queen Bee | Collectible | +1 |
| Beekeeper Hat | Wearable | +0.2 |
| Hyper Bees | Skill | +0.1 |
| Flowery Abode | Skill | +0.5 |
| Bear Shrine | Temporary collectible | +0.5 |

- Attachment algorithm: identifies available flowers and hives with remaining production time, sorts by availability, attaches flowers to hives for overlapping time periods, iteratively until no more matches are possible. (See `updateBeehives.ts` for exact logic.)

---

## 4. Fruits (Fruit Patches)

Source: `src/features/game/types/fruits.ts`, `src/features/game/events/landExpansion/fruitPlanted.ts`.

### 4.1 Patch fruit seeds — full table

| Fruit | Seed | Seed Price (coins) | Grow Time | Sell Price | Bumpkin Level | isBush |
|---|---|---|---|---|---|---|
| Tomato | Tomato Seed | 5 | 7,200 s (2 h) | 2 | 13 | true |
| Lemon | Lemon Seed | 15 | 14,400 s (4 h) | 6 | 12 | false |
| Blueberry | Blueberry Seed | 30 | 21,600 s (6 h) | 12 | 13 | true |
| Orange | Orange Seed | 50 | 28,800 s (8 h) | 18 | 14 | false |
| Apple | Apple Seed | 70 | 43,200 s (12 h) | 25 | 15 | false |
| Banana | Banana Plant | 70 | 43,200 s (12 h) | 25 | 16 | true |
| Celestine | Celestine Seed | 300 | 21,600 s (6 h) | 200 | 12 | false |
| Lunara | Lunara Seed | 750 | 43,200 s (12 h) | 500 | 12 | false |
| Duskberry | Duskberry Seed | 1,250 | 86,400 s (24 h) | 1,000 | 12 | false |

> **Celestine / Lunara / Duskberry** are the "Lantern" / seasonal exotic fruits. They share the same level-12 gate in the source.

### 4.2 Harvests per plant

Source: `src/features/game/events/landExpansion/fruitPlanted.ts`.

- When a fruit seed is planted, the game rolls a random harvest count: **`randomInt(3, 6)`** — i.e. 3 to 6 total harvests before the plant expires and must be replanted. This applies to **all** standard patch fruits (Tomato, Lemon, Blueberry, Orange, Apple, Banana).
- **Full Moon Berry** is fixed at 4 harvests (special event fruit).
- **Immortal Pear** collectible adds +1 (or +2 with skill) to the harvest count.
- `harvestsLeft` is stored on each fruit plant and decremented per harvest.
- Yield per harvest is read from `PATCH_FRUIT_SEEDS[seed].yield`; base yield is 1 unit per harvest for standard fruits (modified by boosts / wearables / skills).

---

## Sources

All numeric data in this document was extracted from the Sunflower Land GitHub main branch, primarily:

**Recipes (cooking):**
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/consumables.ts

**Buildings (cooking building unlocks & costs):**
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/buildings.ts

**Greenhouse:**
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/plantGreenhouse.ts
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/harvestGreenHouse.ts
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/crops.ts (GREENHOUSE_CROPS: Rice, Olive)
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/fruits.ts (GREENHOUSE_FRUIT: Grape)

**Flowers:**
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/flowers.ts
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/lib/updateBeehives.ts (beehive / flower attachment)

**Patch Fruits:**
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/fruits.ts (PATCH_FRUIT, PATCH_FRUIT_SEEDS)
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/fruitPlanted.ts (harvest count)

**Supplementary / official docs:**
- https://docs.sunflower-land.com/ (cross-reference for gameplay mechanics descriptions)

---

## Key Findings Summary (for clone implementation)

1. **Cooked food is not sold** — it gives XP when eaten by the Bumpkin and is used for deliveries. There is no `sellPrice` field in `consumables.ts`.
2. **Recipe unlock is building-gated**, not per-recipe — once you have the building, you can cook any of its recipes. Fire Pit is available from start; Kitchen/Bakery/Deli/Smoothie Shack unlock at levels 5/8/16/23.
3. **Greenhouse** requires level 46, needs oil per planting (Grape 3, Rice 4, Olive 6), and has exactly 4 pots.
4. **Greenhouse crop grow times:** Grape 12 h, Rice 32 h, Olive 44 h. Sell prices: Grape 240, Rice 320, Olive 400.
5. **Patch fruit trees yield 3–6 harvests** (random) before needing replant. Bushes (Tomato, Blueberry, Banana) use the same mechanic.
6. **Flowers have no market sell price** — they exist to boost beehives and as cross-breed offerings. Honey production is 1 unit per 24 hours per hive, boostable via Queen Bee (+1), Beekeeper Hat (+0.2), skills, etc.
7. **Exotic fruits (Celestine, Lunara, Duskberry)** are significantly more expensive (seed 300/750/1,250 coins) but sell for 200/500/1,000 coins each — very high profit per plant.
8. **Flower cross-breeding** uses two sets of materials: Set 1 (Sunpetal/Bloom/Lily) uses common crops + basic fruits; Set 2 (Edelweiss/Gladiolus/Lavender/Clover) uses Rhubarb/Pepper/Onion/Artichoke/Barley.
