# Sunflower Land — Levels, Crops & Fruits Reference

All numeric data below is pulled from the authoritative GitHub source
`github.com/sunflower-land/sunflower-land` (branch `main`, fetched 2026-04-11).
Where multiple sources disagreed, GitHub is treated as canonical.

Primary source files:

- `src/features/game/lib/level.ts` — XP table
- `src/features/game/types/crops.ts` — Crops, crop seeds, greenhouse crop seeds
- `src/features/game/types/fruits.ts` — Patch fruits, fruit seeds, greenhouse fruit seeds
- `src/features/game/types/seeds.ts` — Seasonal seed availability
- `src/features/game/types/buildings.ts` — Building unlock levels
- `src/features/game/types/expansions.ts` — Expansion level requirements
- `src/features/game/events/landExpansion/plantFruit.ts` — `getDefaultHarvestsLeft()`

Notes on units:
- `plantSeconds` / `harvestSeconds` in source are in seconds. Tables below also show hours.
- `price` (seeds) and `sellPrice` (crops) are in Coins (SFL/coin). Values <1 are fractional
  (e.g. Sunflower sells for 0.02 coins per unit).
- All yields = 1 unit per plot (multiplied by bonuses from wearables/collectibles not listed here).

---

## TOPIC 1 — BUMPKIN EXPERIENCE LEVELS

Source (authoritative): <https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/lib/level.ts>

- **Max Level: 200**
- `BumpkinLevel` type: `1 | 2 | 3 | ... | 200`
- Level is computed by iterating `LEVEL_EXPERIENCE` and finding the highest threshold
  whose XP value is `<=` current XP.

### 1.1 Full XP Table (Level → Cumulative XP required)

| Lvl | XP | Lvl | XP | Lvl | XP | Lvl | XP |
|---|---|---|---|---|---|---|---|
| 1 | 0 | 51 | 1,053,905 | 101 | 24,893,905 | 151 | 95,662,605 |
| 2 | 2 | 52 | 1,127,405 | 102 | 25,723,905 | 152 | 97,031,166 |
| 3 | 22 | 53 | 1,205,905 | 103 | 26,573,905 | 153 | 98,440,783 |
| 4 | 205 | 54 | 1,289,405 | 104 | 27,443,905 | 154 | 99,892,688 |
| 5 | 555 | 55 | 1,377,905 | 105 | 28,333,905 | 155 | 101,388,150 |
| 6 | 1,155 | 56 | 1,476,405 | 106 | 29,243,905 | 156 | 102,928,475 |
| 7 | 2,155 | 57 | 1,584,905 | 107 | 30,173,905 | 157 | 104,515,009 |
| 8 | 3,405 | 58 | 1,703,405 | 108 | 31,123,905 | 158 | 106,149,139 |
| 9 | 5,405 | 59 | 1,831,905 | 109 | 32,093,905 | 159 | 107,832,292 |
| 10 | 7,905 | 60 | 1,970,405 | 110 | 33,083,905 | 160 | 109,565,939 |
| 11 | 10,905 | 61 | 2,128,905 | 111 | 34,093,905 | 161 | 111,351,595 |
| 12 | 14,405 | 62 | 2,287,405 | 112 | 35,123,905 | 162 | 113,190,820 |
| 13 | 18,405 | 63 | 2,485,905 | 113 | 36,173,905 | 163 | 115,085,221 |
| 14 | 22,905 | 64 | 2,704,405 | 114 | 37,243,905 | 164 | 117,036,454 |
| 15 | 27,905 | 65 | 2,942,905 | 115 | 38,333,905 | 165 | 119,046,223 |
| 16 | 33,655 | 66 | 3,221,405 | 116 | 39,443,905 | 166 | 121,116,285 |
| 17 | 40,155 | 67 | 3,539,905 | 117 | 40,573,905 | 167 | 123,248,448 |
| 18 | 47,405 | 68 | 3,898,405 | 118 | 41,723,905 | 168 | 125,444,575 |
| 19 | 55,405 | 69 | 4,296,905 | 119 | 42,893,905 | 169 | 127,706,585 |
| 20 | 64,155 | 70 | 4,735,405 | 120 | 44,083,905 | 170 | 130,036,455 |
| 21 | 73,905 | 71 | 5,233,905 | 121 | 45,293,905 | 171 | 132,436,221 |
| 22 | 84,655 | 72 | 5,743,905 | 122 | 46,523,905 | 172 | 134,907,979 |
| 23 | 96,405 | 73 | 6,263,905 | 123 | 47,773,905 | 173 | 137,453,889 |
| 24 | 109,155 | 74 | 6,793,905 | 124 | 49,043,905 | 174 | 140,076,176 |
| 25 | 122,905 | 75 | 7,333,905 | 125 | 50,333,905 | 175 | 142,777,131 |
| 26 | 137,405 | 76 | 7,883,905 | 126 | 51,653,905 | 176 | 145,559,114 |
| 27 | 152,905 | 77 | 8,443,905 | 127 | 53,003,905 | 177 | 148,424,556 |
| 28 | 169,405 | 78 | 9,013,905 | 128 | 54,383,905 | 178 | 151,375,961 |
| 29 | 186,905 | 79 | 9,593,905 | 129 | 55,793,905 | 179 | 154,415,908 |
| 30 | 205,405 | 80 | 10,183,905 | 130 | 57,233,905 | 180 | 157,547,053 |
| 31 | 225,405 | 81 | 10,783,905 | 131 | 58,708,905 | 181 | 160,772,132 |
| 32 | 246,905 | 82 | 11,393,905 | 132 | 60,218,905 | 182 | 164,093,963 |
| 33 | 269,905 | 83 | 12,013,905 | 133 | 61,763,905 | 183 | 167,515,448 |
| 34 | 294,405 | 84 | 12,643,905 | 134 | 63,343,905 | 184 | 171,039,577 |
| 35 | 320,405 | 85 | 13,283,905 | 135 | 64,958,905 | 185 | 174,669,429 |
| 36 | 348,405 | 86 | 13,933,905 | 136 | 66,613,905 | 186 | 178,408,176 |
| 37 | 378,405 | 87 | 14,593,905 | 137 | 68,308,905 | 187 | 182,259,085 |
| 38 | 410,405 | 88 | 15,263,905 | 138 | 70,043,905 | 188 | 186,225,521 |
| 39 | 444,405 | 89 | 15,943,905 | 139 | 71,818,905 | 189 | 190,310,950 |
| 40 | 480,405 | 90 | 16,633,905 | 140 | 73,633,905 | 190 | 194,518,941 |
| 41 | 518,905 | 91 | 17,333,905 | 141 | 75,493,905 | 191 | 198,853,171 |
| 42 | 559,905 | 92 | 18,043,905 | 142 | 77,398,905 | 192 | 203,317,427 |
| 43 | 603,405 | 93 | 18,763,905 | 143 | 79,348,905 | 193 | 207,915,610 |
| 44 | 649,405 | 94 | 19,493,905 | 144 | 81,343,905 | 194 | 212,651,738 |
| 45 | 697,905 | 95 | 20,233,905 | 145 | 83,383,905 | 195 | 217,529,949 |
| 46 | 749,405 | 96 | 20,983,905 | 146 | 85,473,905 | 196 | 222,554,506 |
| 47 | 803,905 | 97 | 21,743,905 | 147 | 87,613,905 | 197 | 227,729,799 |
| 48 | 861,405 | 98 | 22,513,905 | 148 | 89,803,905 | 198 | 233,060,350 |
| 49 | 921,905 | 99 | 23,293,905 | 149 | 92,043,905 | 199 | 238,550,817 |
| 50 | 985,405 | 100 | 24,083,905 | 150 | 94,333,905 | 200 | 244,206,000 |

### 1.2 Crop / Seed Unlocks By Level

Source: `src/features/game/types/crops.ts` (`CROP_SEEDS`), `src/features/game/types/fruits.ts` (`PATCH_FRUIT_SEEDS`, `GREENHOUSE_FRUIT_SEEDS`).

| Lvl | Unlocks |
|---|---|
| 1 | Sunflower Seed, Potato Seed, Rhubarb Seed |
| 2 | Pumpkin Seed, Zucchini Seed, Carrot Seed, Yam Seed |
| 3 | Cabbage Seed, Broccoli Seed, Soybean Seed, Beetroot Seed, Pepper Seed |
| 4 | Cauliflower Seed, Parsnip Seed |
| 5 | Eggplant Seed, Corn Seed, Onion Seed, Radish Seed, Wheat Seed |
| 6 | Turnip Seed |
| 7 | Kale Seed |
| 8 | Artichoke Seed |
| 12 | Lemon Seed, Celestine Seed, Lunara Seed, Duskberry Seed |
| 13 | Tomato Seed, Blueberry Seed |
| 14 | Orange Seed, Barley Seed |
| 15 | Apple Seed |
| 16 | Banana Plant |
| 40 | Rice Seed, Olive Seed, Grape Seed (Greenhouse) |

### 1.3 Building Unlocks By Level

Source: `src/features/game/types/buildings.ts`. `Infinity` = unlocked from start.

| Building | Unlock Lvl | Coin Cost |
|---|---|---|
| Fire Pit | start | 0 |
| Workbench | start | 5 |
| Tent | start | 20 |
| Water Well | 2 | 100 |
| Kitchen | 5 | 10 |
| Hen House | 6 | 100 |
| Compost Bin | 7 | 0 |
| Bakery | 8 | 200 |
| Fish Market | 10 | 0 |
| Turbo Composter | 12 | 0 |
| Deli | 16 | 300 |
| Premium Composter | 18 | 0 |
| Warehouse | 20 | 0 |
| Smoothie Shack | 23 | 0 |
| Toolshed | 25 | 0 |
| Barn | 30 | 200 |
| Crop Machine | 35 | 8000 |
| Greenhouse | 46 | 4800 |

### 1.4 Land Expansion Level Requirements

Source: `src/features/game/types/expansions.ts` — constants `LAND_n_REQUIREMENTS`,
`SPRING_LAND_n_REQUIREMENTS`, `DESERT_LAND_n_REQUIREMENTS`, `VOLCANO_LAND_n_REQUIREMENTS`.
The game starts each island at a base expansion count; only the following entries
are explicitly unlockable via level gating.

#### Basic Island

| Expansion | Bumpkin Lvl | Build Time |
|---|---|---|
| 4 | 1 | 5 s |
| 5 | 1 | 5 s |
| 6 | 2 | 60 s |
| 7 | 5 | 30 min |
| 8 | 8 | 4 h |
| 9 | 11 | 12 h |
| 10 | 13 | 24 h |
| 11 | 15 | 24 h |
| 12 | 17 | 24 h |
| 13 | 20 | 24 h |
| 14 | 23 | 36 h |
| 15 | 26 | 36 h |
| 16 | 30 | 36 h |
| 17 | 34 | 36 h |
| 18 | 37 | 36 h |
| 19 | 40 | 48 h |
| 20 | 45 | 48 h |
| 21 | 50 | 48 h |
| 22 | 55 | 48 h |
| 23 | 60 | 48 h |

#### Spring Island (Petal Paradise)

| Expansion | Bumpkin Lvl | Build Time |
|---|---|---|
| 5 | 11 | 60 s |
| 6 | 13 | 5 min |
| 7 | 16 | 30 min |
| 8 | 20 | 2 h |
| 9 | 23 | 2 h |
| 10 | 25 | 4 h |
| 11 | 27 | 8 h |
| 12 | 29 | 12 h |
| 13 | 32 | 12 h |
| 14 | 36 | 24 h |
| 15 | 40 | 24 h |
| 16 | 43 | 24 h |
| 17 | 47 | 36 h |
| 18 | 51 | 36 h |
| 19 | 53 | 36 h |
| 20 | 55 | 48 h |

#### Desert Island

| Expansion | Bumpkin Lvl | Build Time |
|---|---|---|
| 5 | 40 | 60 s |
| 6 | 40 | 5 min |
| 7 | 41 | 30 min |
| 8 | 42 | 2 h |
| 9 | 43 | 2 h |
| 10 | 44 | 8 h |
| 11 | 45 | 12 h |
| 12 | 47 | 12 h |
| 13 | 50 | 24 h |
| 14 | 53 | 24 h |
| 15 | 56 | 24 h |
| 16 | 58 | 36 h |
| 17 | 60 | 36 h |
| 18 | 63 | 36 h |
| 19 | 65 | 36 h |
| 20 | 68 | 48 h |
| 21 | 70 | 48 h |
| 22 | 72 | 48 h |
| 23 | 73 | 60 h |
| 24 | 74 | 60 h |
| 25 | 75 | 60 h |

#### Volcano Island

| Expansion | Bumpkin Lvl | Build Time |
|---|---|---|
| 6 | 70 | 10 s |
| 7 | 72 | 5 min |
| 8 | 74 | 30 min |
| 9 | 76 | 1 h |
| 10 | 78 | 2 h |
| 11 | 80 | 4 h |
| 12 | 82 | 8 h |
| 13 | 84 | 12 h |
| 14 | 86 | 12 h |
| 15 | 88 | 24 h |
| 16 | 90 | 24 h |
| 17 | 92 | 24 h |
| 18 | 94 | 36 h |
| 19 | 96 | 36 h |
| 20 | 98 | 48 h |
| 21 | 100 | 48 h |
| 22 | 102 | 48 h |
| 23 | 104 | 48 h |
| 24 | 106 | 48 h |
| 25 | 108 | 60 h |
| 26 | 110 | 60 h |
| 27 | 112 | 60 h |
| 28 | 114 | 60 h |
| 29 | 116 | 72 h |
| 30 | 120 | 72 h |

(Resource costs — wood, stone, iron, gold, crimstone, oil, obsidian, gems — are
also defined in the same file but are omitted here; fetch directly if needed.)

---

## TOPIC 2 — CROPS & SEEDS

Source: <https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/types/crops.ts>

Yield per plot is always **1 unit** (before wearable/collectible bonuses).

### 2.1 Basic Crops (Crop Plot)

| Crop | Seed Price (coins) | Grow Time | Sell Price (coins) | Unlock Lvl | Yield |
|---|---|---|---|---|---|
| Sunflower | 0.01 | 1 min (60 s) | 0.02 | 1 | 1 |
| Potato | 0.10 | 5 min (300 s) | 0.14 | 1 | 1 |
| Rhubarb | 0.15 | 10 min (600 s) | 0.24 | 1 | 1 |
| Pumpkin | 0.20 | 30 min (1,800 s) | 0.40 | 2 | 1 |
| Zucchini | 0.20 | 30 min (1,800 s) | 0.40 | 2 | 1 |
| Carrot | 0.50 | 1 h (3,600 s) | 0.80 | 2 | 1 |
| Yam | 0.50 | 1 h (3,600 s) | 0.80 | 2 | 1 |
| Cabbage | 1 | 2 h (7,200 s) | 1.50 | 3 | 1 |
| Broccoli | 1 | 2 h (7,200 s) | 1.50 | 3 | 1 |
| Soybean | 1.5 | 3 h (10,800 s) | 2.30 | 3 | 1 |
| Beetroot | 2 | 4 h (14,400 s) | 2.80 | 3 | 1 |
| Pepper | 2 | 4 h (14,400 s) | 3.00 | 3 | 1 |
| Cauliflower | 3 | 8 h (28,800 s) | 4.25 | 4 | 1 |
| Parsnip | 5 | 12 h (43,200 s) | 6.50 | 4 | 1 |
| Eggplant | 6 | 16 h (57,600 s) | 8.00 | 5 | 1 |
| Corn | 7 | 20 h (72,000 s) | 9.00 | 5 | 1 |
| Onion | 7 | 20 h (72,000 s) | 10.00 | 5 | 1 |
| Radish | 7 | 24 h (86,400 s) | 9.50 | 5 | 1 |
| Wheat | 5 | 24 h (86,400 s) | 7.00 | 5 | 1 |
| Turnip | 5 | 24 h (86,400 s) | 8.00 | 6 | 1 |
| Kale | 7 | 36 h (129,600 s) | 10.00 | 7 | 1 |
| Artichoke | 7 | 36 h (129,600 s) | 12.00 | 8 | 1 |
| Barley | 10 | 48 h (172,800 s) | 12.00 | 14 | 1 |

### 2.2 Greenhouse Crops

Source: same file, `GREENHOUSE_CROPS` / `GREENHOUSE_SEEDS`.
Require the Greenhouse building (unlocks at level 46) and use Oil as fuel per plant.

| Crop | Seed Price | Grow Time | Sell Price | Unlock Lvl | Planting Spot |
|---|---|---|---|---|---|
| Rice | 240 | 32 h (115,200 s) | 320 | 40 | Greenhouse |
| Olive | 320 | 44 h (158,400 s) | 400 | 40 | Greenhouse |

### 2.3 Seasonal Availability

Source: `src/features/game/types/seeds.ts` → `SEASONAL_SEEDS`.
A seed can only be planted while its listed season is active.
Greenhouse seeds (Rice, Olive, Grape) are available every season.

**Spring**: Sunflower, Rhubarb, Carrot, Cabbage, Soybean, Corn, Wheat, Kale, Barley, Tomato, Blueberry, Orange, Sunpetal (flower), Bloom (flower), Lily (flower), Lavender (flower), Rice, Olive, Grape.

**Summer**: Sunflower, Potato, Zucchini, Pepper, Beetroot, Cauliflower, Eggplant, Radish, Wheat, Lemon, Orange, Banana, Sunpetal, Bloom, Lily, Gladiolus, Rice, Olive, Grape.

**Autumn**: Potato, Pumpkin, Carrot, Yam, Broccoli, Soybean, Wheat, Barley, Artichoke, Tomato, Apple, Banana, Sunpetal, Bloom, Lily, Clover, Rice, Olive, Grape.

**Winter**: Potato, Cabbage, Beetroot, Cauliflower, Parsnip, Onion, Turnip, Wheat, Kale, Lemon, Blueberry, Apple, Sunpetal, Bloom, Lily, Edelweiss, Rice, Olive, Grape.

---

## TOPIC 3 — FRUITS

Source: <https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/types/fruits.ts>

### 3.1 Patch Fruit Seeds

Fruit planted in a Fruit Patch can be harvested multiple times from the same plant
before replanting is required. The default harvest count is set by
`getDefaultHarvestsLeft()` in `src/features/game/events/landExpansion/plantFruit.ts`:

```
function getDefaultHarvestsLeft() {
  return randomInt(3, 6);
}
```

So every new fruit plant has **3–6 harvests** rolled at plant time. The Immortal Pear
collectible adds +1 harvest (or +2 with the Pear Turbocharge skill), but that bonus is
not part of the base number.

| Fruit | Seed Price | Grow Time (per harvest) | Sell Price | Unlock Lvl | Type | Harvests per plant |
|---|---|---|---|---|---|---|
| Tomato | 5 | 2 h (7,200 s) | 2 | 13 | Bush | 3–6 |
| Lemon | 15 | 4 h (14,400 s) | 6 | 12 | Tree | 3–6 |
| Blueberry | 30 | 6 h (21,600 s) | 12 | 13 | Bush | 3–6 |
| Orange | 50 | 8 h (28,800 s) | 18 | 14 | Tree | 3–6 |
| Apple | 70 | 12 h (43,200 s) | 25 | 15 | Tree | 3–6 |
| Banana | 70 | 12 h (43,200 s) | 25 | 16 | Bush | 3–6 |
| Celestine (Full Moon) | 300 | 6 h (21,600 s) | 200 | 12 | Tree | 3–6 |
| Lunara (Full Moon) | 750 | 12 h (43,200 s) | 500 | 12 | Tree | 3–6 |
| Duskberry (Full Moon) | 1,250 | 24 h (86,400 s) | 1,000 | 12 | Tree | 3–6 |

Full-Moon fruits (Celestine, Lunara, Duskberry) require a Lunar Calendar / Full Moon
event to plant. Their level gate (12) alone does NOT unlock planting.

Banana's seed is named "Banana Plant" in source (not "Banana Seed"). Source lines 105–112.

### 3.2 Greenhouse Fruit

| Fruit | Seed Price | Grow Time | Sell Price | Unlock Lvl | Planting Spot |
|---|---|---|---|---|---|
| Grape | 160 | 12 h (43,200 s) | 240 | 40 | Greenhouse |

Greenhouse fruit is single-harvest (not multi-harvest like patch fruits); each plant
consumes Oil per plant like greenhouse crops.

---

## Conflicting / Notable Findings

- **"Harvests per bush/tree" is randomized** in Sunflower Land's codebase (3–6, uniform).
  Many community wikis state a flat number (often 3). The randomized range is the
  authoritative behavior, per `getDefaultHarvestsLeft()`.
- **"Banana Seed"** does not exist in the codebase; the item is called **Banana Plant**.
- **Radish sells for 9.5** and Corn for 9, but Onion (same 20 h grow) sells for 10 — the
  highest price-per-hour in the basic tier is Onion, not Radish.
- **Wheat costs 5 coins** (not 7 like Kale/Artichoke) despite being unlocked at the same
  level-5 tier; it is the cheapest 24-hour crop.
- **Level 200** is the hard max (`isMaxLevel()` compares XP to `LEVEL_EXPERIENCE[200]`).
  `LEVEL_EXPERIENCE[200] = 244,206,000`. All community wikis should match this.
- **No crops between levels 9–13** (Barley at 14 is the first new unlock after Artichoke
  at 8). Level-9 through level-11 players gain expansions and buildings but no new seeds.
- **Season file confirms** Rhubarb = Spring-only, Pumpkin = Autumn-only, Parsnip/Turnip/
  Onion = Winter-only, Artichoke = Autumn-only, Eggplant/Pepper/Zucchini/Cauliflower =
  Summer-or-Winter depending on crop.

---

## Source URLs

Authoritative (GitHub, branch `main`):

- XP table — <https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/lib/level.ts>
- Crops & crop seeds — <https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/types/crops.ts>
- Fruits & fruit seeds — <https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/types/fruits.ts>
- Seasonal mapping — <https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/types/seeds.ts>
- Buildings — <https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/types/buildings.ts>
- Expansions — <https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/types/expansions.ts>
- Fruit planting / harvest count — <https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/events/landExpansion/plantFruit.ts>

Secondary / context:

- Sunflower Land play portal — <https://sunflower-land.com>
- Sunflower Land docs — <https://docs.sunflower-land.com>
- Sunflower Land docs full dump — <https://docs.sunflower-land.com/llms-full.txt>
