# Sunflower Land — Fishing, Composting, Crop Machine

Research compiled from the authoritative GitHub source
(`github.com/sunflower-land/sunflower-land`), official docs
(`docs.sunflower-land.com`) and community wikis. GitHub source is treated as
the authoritative reference whenever it conflicts with wikis.

Primary source files referenced:
- `src/features/game/types/fishing.ts`
- `src/features/game/types/composters.ts`
- `src/features/game/events/landExpansion/startComposter.ts`
- `src/features/game/events/landExpansion/supplyCropMachine.ts`
- `src/features/game/events/landExpansion/harvestCropMachine.ts`
- `src/features/game/types/consumables.ts` (fish XP)
- `src/features/game/types/buildings.ts` (build costs / unlock levels)

---

## TOPIC 1 — FISHING MECHANICS

### 1.1 Daily Rod Limit

Source: `getDailyFishingLimit()` in `fishing.ts`.

| Component                          | Value     |
|-----------------------------------|-----------|
| Base daily limit                  | 20 casts  |
| Angler Waders (wearable)          | +10       |
| Reelmaster's Chair (collectible)  | +5        |
| Nautilus (Marine Marvel placed)   | +5        |
| Saw Fish wearable                 | +5        |
| Fisherman's 5 Fold skill          | +5        |
| Fisherman's 10 Fold skill         | +10       |
| More With Less skill              | +15       |
| VIP Access (Crabs & Traps chapter)| +5        |

Maximum observed in code: 80/day when all bonuses stack. Extra casts beyond
the daily limit can be purchased as "extra reels" packs (5 reels per pack, gem
cost escalates). Counter stored as `dailyAttempts[date]`.

### 1.2 Location / Unlock

Fishing takes place at the **Beach**, reached via the Beach Portal on the
main island. The Beach itself has no Bumpkin-level gate in modern code;
access is gated by progression through the intro quests with NPC "Reelin
Roy" on the wharf. Fishing as an activity was introduced in Chapter 4
"Catch the Kraken". The Beach scene is always reachable once the player
has completed the starter flow.

### 1.3 Bait Types

Worm baits are produced by composters (see Topic 2). Purchaseable bait is
defined in `PURCHASEABLE_BAIT`:

```ts
"Fishing Lure": {
  purchaseOptions: {
    Gem:     { ingredients: { Gem: 10 } },
    Feather: { ingredients: { Feather: 100 } },
  }
}
```

| Bait          | Origin                                | Cost/Craft                 |
|---------------|---------------------------------------|----------------------------|
| Earthworm     | Compost Bin output                    | 1 per Compost Bin cycle    |
| Grub          | Turbo Composter output                | 1 per Turbo cycle          |
| Red Wiggler   | Premium Composter output              | 1 per Premium cycle        |
| Fishing Lure  | Purchase                              | 10 Gems OR 100 Feathers    |

Guaranteed bait variants (later additions): Fish Flake, Fish Stick, Fish Oil,
Crab Stick, Capsule Bait (Earthworm class), Umbrella Bait (Grub class),
Crimson Baitfish (Red Wiggler class). Guaranteed baits cannot be combined
with chum.

### 1.4 Chum Mechanics

Chum is an optional ingredient consumed alongside bait to influence what the
rod catches. Each item has an "attraction value" — the number of units that
must be consumed to count as one chum action.

From `CHUM_AMOUNTS` in `fishing.ts` (exhaustive list):

| Item          | Units | Item            | Units | Item           | Units |
|---------------|-------|-----------------|-------|----------------|-------|
| Gold          | 1     | Stone           | 5     | Apple          | 3     |
| Wild Mushroom | 1     | Egg             | 5     | Banana         | 3     |
| Honey         | 1     | Iron            | 5     | Crab           | 2     |
| Seaweed       | 1     | Wood            | 5     | Barley         | 3     |
| Red Pansy     | 1     | Onion           | 5     | Artichoke      | 3     |
| Anchovy       | 1     | Cauliflower     | 5     | Blueberry      | 3     |
| Red Snapper   | 1     | Parsnip         | 5     | Orange         | 3     |
| Tuna          | 1     | Eggplant        | 5     | Weed           | 3     |
| Squid         | 1     | Corn            | 5     | Acorn          | 3     |
| Horse Mackerel| 1     | Radish          | 5     | Fat Chicken    | 3     |
| Sunfish       | 1     | Turnip          | 5     | Rich Chicken   | 3     |
| Zebra Turkeyfish | 1  | Wheat           | 5     | Speed Chicken  | 3     |
| Carrot        | 10    | Kale            | 5     |                |       |
| Cabbage       | 10    | Potato          | 20    |                |       |
| Broccoli      | 10    | Yam             | 20    |                |       |
| Pepper        | 10    | Rhubarb         | 20    |                |       |
| Beetroot      | 10    | Pumpkin         | 20    |                |       |
|               |       | Zucchini        | 20    |                |       |
|               |       | Sunflower       | 50    |                |       |

Chum behaviour:
- Chum is optional; rod still works with bait only.
- Fish have a `likes` array. Chumming something in that array boosts the
  spawn weight of that fish (fish that "like" that ingredient).
- Guaranteed bait cannot be paired with chum (the event handler throws
  `Chum cannot be used with guaranteed bait`).

### 1.5 Fish Species by Tier

From `FISH` constant. Tier field in code: `basic | advanced | expert | marine marvel | chapter`.

**Tier 1 — Basic (Earthworm bait)**
Anchovy, Butterflyfish, Blowfish, Clownfish, Sea Bass, Sea Horse,
Horse Mackerel, Halibut, Squid, Porgy, Muskellunge.

**Tier 2 — Advanced (Grub / Red Wiggler / Fishing Lure)**
Red Snapper, Moray Eel, Olive Flounder, Napoleanfish, Surgeonfish,
Angelfish, Zebra Turkeyfish, Ray, Hammerhead Shark, Barred Knifejaw,
Walleye, Rock Blackfish, Tilapia.

**Tier 3 — Expert (Red Wiggler / Grub / Fishing Lure)**
Tuna, Mahi Mahi, Blue Marlin, Oarfish, Football Fish, Sunfish,
Coelacanth, Parrotfish, Whale Shark, Saw Shark, White Shark, Cobia,
Trout, Weakfish.

**Marine Marvels (permanent, extreme rarity)**
Twilight Anglerfish, Starlight Tuna, Radiant Ray, Phantom Barracuda,
Gilded Swordfish. (5 permanent.)

**Chapter Fish (time-limited Marvels)**
Crimson Carp, Battle Fish, Lemon Shark, Longhorn Cowfish, Jellyfish,
Pink Dolphin, Poseidon, Super Star, Giant Isopod, Nautilus, Dollocaris.

### 1.6 Fish XP (raw, consumed via Kitchen)

From `consumables.ts` (`experience` field on each raw fish). XP scales
linearly with tier:

| Fish              | XP   | Fish              | XP   |
|-------------------|------|-------------------|------|
| Anchovy           | 60   | Ray               | 200  |
| Butterflyfish     | 70   | Hammerhead Shark  | 210  |
| Blowfish          | 80   | Barred Knifejaw   | 220  |
| Clownfish         | 90   | Tuna              | 230  |
| Sea Bass          | 100  | Mahi Mahi         | 240  |
| Sea Horse         | 110  | Blue Marlin       | 250  |
| Horse Mackerel    | 120  | Oarfish           | 300  |
| Squid             | 130  | Football Fish     | 350  |
| Red Snapper       | 140  | Sunfish           | 400  |
| Moray Eel         | 150  | Coelacanth        | 700  |
| Olive Flounder    | 160  | Whale Shark       | 750  |
| Napoleanfish      | 170  | Saw Shark         | 800  |
| Surgeonfish       | 180  | White Shark       | 1000 |
| Zebra Turkeyfish  | 190  |                   |      |

Flat-100 XP set (species that were added later or repriced): Angelfish,
Halibut, Parrotfish, Porgy, Muskellunge, Trout, Walleye, Weakfish,
Rock Blackfish, Cobia, Tilapia = 100 XP each (raw).

Aged fish variants: `getAgingMaxXP(baseXP)`; Prime Aged:
`floor(getAgingMaxXP(baseXP) * PRIME_AGED_XP_MULTIPLIER)`.

Marine Marvel and Chapter fish XP constants are not exposed in the
public `consumables.ts` snippet; in the live game Marvels are intended
to be placed as decoration (tank) rather than consumed.

### 1.7 Sell Price

Direct sell prices for raw fish are not exposed as a flat `FISH_SELL_PRICE`
constant in `fishing.ts`. The documented/community intent is that raw fish
are consumed via cooking or stored as placeable Marvels; most fish are not
sold for coins directly. Fish-derived cookables (Kitchen/Deli) are the
economic output:

| Recipe       | XP    |
|--------------|-------|
| Gumbo        | 600   |
| Chowder      | 1000  |
| Fish Burger  | 1300  |
| Sushi Roll   | 2000  |

(Fish Flakes / Fish Sticks / Fish Oil are produced at the Fishing Building
later in progression as "extra XP" outputs.)

### 1.8 Spawn Conditions (weather / moon / season)

Each fish in `FISH` carries a `seasons` array. Basic fish typically list
all four seasons; advanced/expert fish are restricted. Weather / moon
conditions are evaluated at catch time via a private roll table in
`catchFish`-related code (not exposed as a simple constant). High-level
behaviour documented in code + wiki:

- Fish have `seasons: Array<"spring"|"summer"|"autumn"|"winter">`.
- Spawn weight is modulated by: current season, time-of-day (day / night),
  moon phase (Full Moon increases Marvel chances), weather events.
- Chum adds a pull on fish whose `likes` match.
- `guaranteedCatch` mode bypasses randomness when using guaranteed bait.

---

## TOPIC 2 — COMPOSTING / FERTILIZERS

### 2.1 Composter Buildings

From `buildings.ts` (unlock level, coin cost, resource cost) and
`composters.ts` (`composterDetails`).

| Composter         | Unlock Lv | Coins  | Resources             | Cycle Time | Produce (base)       | Worm Output   |
|-------------------|-----------|--------|-----------------------|------------|----------------------|---------------|
| Compost Bin       | 7         | 0      | Wood 5, Stone 5       | 6 h        | Sprout Mix x10       | Earthworm x1  |
| Turbo Composter   | 12        | 0      | Wood 50, Stone 25     | 8 h        | Fruitful Blend x3    | Grub x1       |
| Premium Composter | 18        | 0      | Gold 50               | 12 h       | Rapid Root x10       | Red Wiggler x1|

Cycle times in ms (raw):
- Compost Bin: 21,600,000
- Turbo Composter: 28,800,000
- Premium Composter: 43,200,000

### 2.2 Resource Boost (speedup ingredients)

Feeding additional ingredients shortens the cycle (speedup):

| Composter         | Boost ingredient count | Time saved |
|-------------------|------------------------|------------|
| Compost Bin       | 10 units               | 2 h        |
| Turbo Composter   | 20 units               | 3 h        |
| Premium Composter | 30 units               | 4 h        |

### 2.3 Seasonal Recipe Ingredients (`SEASON_COMPOST_REQUIREMENTS`)

Base (non-speedup) ingredient cost per cycle, varies by season:

**Compost Bin**
| Season | Ingredients          |
|--------|----------------------|
| Spring | Rhubarb 10, Carrot 5 |
| Summer | Zucchini 10, Pepper 2|
| Autumn | Yam 15               |
| Winter | Potato 10, Cabbage 3 |

**Turbo Composter**
| Season | Ingredients                |
|--------|----------------------------|
| Spring | Soybean 5, Corn 3          |
| Summer | Cauliflower 4, Eggplant 3  |
| Autumn | Broccoli 10, Artichoke 2   |
| Winter | Onion 5, Turnip 2          |

**Premium Composter**
| Season | Ingredients             |
|--------|-------------------------|
| Spring | Blueberry 8, Egg 5      |
| Summer | Banana 3, Egg 5         |
| Autumn | Apple 4, Tomato 5       |
| Winter | Lemon 3, Apple 3        |

### 2.4 Skill Modifiers to Produce Amount

From `startComposter.ts`:

| Skill / Item                        | Modifier to produce amount |
|-------------------------------------|----------------------------|
| Efficient Bin (Compost Bin)         | +5                         |
| Turbo Charged (Turbo Composter)     | +5                         |
| Premium Worms (Premium Composter)   | +10                        |
| Composting Overhaul                 | -5                         |
| Composting Revamp                   | +5                         |
| Turd Topper wearable                | +1                         |
| Soil Krabby collectible             | ×0.9 time                  |
| Swift Decomposer skill              | ×0.9 time                  |

Minimum produce amount clamps at 0.

### 2.5 Fertilizer Numeric Effects

Only three compost-derived fertilizers exist in code (Sprout Mix /
Fruitful Blend / Rapid Root). "Magic Worm" is a separate legacy/special
item not produced by composters.

| Fertilizer    | Target  | Effect                                  | Notes                          |
|---------------|---------|-----------------------------------------|--------------------------------|
| Sprout Mix    | Crops   | +0.2 flat yield per harvest             | Knowledge Crab boost exists    |
| Fruitful Blend| Fruit   | +0.2 flat yield per fruit harvest; persists until the tree/bush dies | Fruitful Bounty skill doubles to +0.4; Blend-Tastic allows one-click apply to all patches |
| Rapid Root    | Crops   | -50% remaining grow time                | One-shot when applied          |
| Magic Worm    | Crops   | Rare legacy worm collectible; acts as instant-use fertiliser buff (+yield) on crops | Not composter-produced |

Application rules: one fertiliser per plot per harvest; cannot stack
Sprout Mix + Rapid Root on the same plot.

### 2.6 Worms — Dual Use

Each composter's worm output is a single "worm" inventory item that
serves two roles:

1. **Fishing bait** — Earthworm (basic tier), Grub (advanced), Red
   Wiggler (advanced/expert). Consumed 1 per cast.
2. **Ingredient in higher-tier bait** — fermented baits (Capsule Bait,
   Umbrella Bait, Crimson Baitfish) are upgraded forms that match the
   same fish table as their base worm, and require the base worm as an
   input along with other fermentables.

Worms are not themselves fertilisers — applying worms to a plot is
unrelated to the compost output (Sprout Mix etc.). The worm drops
alongside fertiliser: e.g., one completed Compost Bin run outputs
1 Earthworm + 10 Sprout Mix (base, pre-skills).

---

## TOPIC 3 — CROP MACHINE

### 3.1 Build & Unlock

From `buildings.ts`:

| Field         | Value                                      |
|---------------|--------------------------------------------|
| Unlock level  | 35                                         |
| Coin cost     | 8,000                                      |
| Resources     | Wood 1,250, Iron 125, Crimstone 50         |
| Prerequisite  | Desert Island expansion (for Oil access)   |

### 3.2 Slots / Queue

From `supplyCropMachine.ts`:

| Field                  | Base | With skill                     |
|------------------------|------|--------------------------------|
| Queue size (packs)     | 5    | 10 (Field Expansion Module)    |
| Processing plots       | 10   | 15 (Field Extension Module)    |

`CROP_MACHINE_PLOTS(state) = state.bumpkin.skills["Field Extension Module"] ? 15 : 10;`

Each queue slot is a "pack" of seeds that the machine grows in parallel
on the processing plots; growth time for a pack equals
`seedGrowTime * packSeedCount / CROP_MACHINE_PLOTS(state)`, then modified
by machine skills/boosts.

### 3.3 Oil Consumption

| Field                       | Value                                    |
|-----------------------------|------------------------------------------|
| Base rate                   | 1 oil per hour                           |
| Max tank capacity           | 48 hours (2 days)                        |
| Max tank w/ Leak-Proof Tank | 144 hours (6 days)                       |

Skill modifiers (applied additively to the per-hour rate):

| Modifier                       | Change    |
|--------------------------------|-----------|
| Crop Processor Unit            | +0.1/h    |
| Rapid Rig                      | +0.4/h    |
| Oil Gadget                     | -0.1/h    |
| Efficiency Extension Module    | -0.3/h    |

Effective range observed in code: 0.6 to 1.5 oil per hour.

### 3.4 Growth Time Modifiers (multiplicative)

Applied to base crop grow time inside the machine:

| Source                         | Multiplier |
|--------------------------------|-----------|
| Crop Processor Unit (skill)    | ×0.95     |
| Rapid Rig (skill)              | ×0.80     |
| Groovy Gramophone (collectible)| ×0.50     |
| Tortoise Shrine (temp)         | ×0.90     |

These stack multiplicatively.

### 3.5 Allowed Crops

Seeds accepted by the Crop Machine unlock progressively through the
"Machinery" skill branch:

| Stage                   | Unlocks                                 |
|-------------------------|-----------------------------------------|
| Base                    | Sunflower, Potato, Pumpkin              |
| Extension Module I      | + Rhubarb, Zucchini                     |
| Extension Module II     | + Carrot, Cabbage                       |
| Extension Module III    | + Yam, Broccoli                         |

High-tier crops (Wheat, Kale, Radish, Beetroot, Parsnip, Corn, Cauliflower,
Eggplant, Barley, Artichoke) are **not** supported by the Crop Machine.

### 3.6 Rules

From `supplyCropMachine.ts` / `harvestCropMachine.ts`:

- Minimum 1 seed per pack supplied.
- Seeds are deducted from inventory on supply.
- Packs queue sequentially; oil is consumed across the queue head-first.
- If oil runs out mid-pack, that pack pauses; remaining packs wait.
- Queue resume occurs when oil is refilled.
- Harvest is resolved pack-by-pack at `harvestCropMachine`; yield uses
  the normal `getCropYieldAmount()` pipeline and farm-activity counters
  increment as if hand-harvested.
- Only one "active" pack at a time from a UX perspective, though the
  queue holds up to 5 (or 10 with skill).
- Growth continues in real time while the player is offline, capped only
  by the oil in the tank.

---

## Sources

- GitHub authoritative:
  - `github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/fishing.ts`
  - `github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/composters.ts`
  - `github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/buildings.ts`
  - `github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/consumables.ts`
  - `github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/startComposter.ts`
  - `github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/supplyCropMachine.ts`
  - `github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/harvestCropMachine.ts`
- Official docs: `docs.sunflower-land.com` (Farming Guide, Chapter 4 Catch the Kraken)
- Community wiki: `wiki.sfl.world/en/mechanics/fishing`, `wiki.sfl.world/en/mechanics/harvesting`
- Community tools: `sfl.world/info/fishing/`, `sfl.world/info/fish-xp`
- Guides: `w3land.com/sunflower-land/fishing-guide`,
  `w3land.com/sunflower-land/best-compost-skills`,
  `w3land.com/sunflower-land/reduce-crop-grow-time`
- Discussion: `github.com/sunflower-land/sunflower-land/discussions/5661` (Fishing Updates proposal)
