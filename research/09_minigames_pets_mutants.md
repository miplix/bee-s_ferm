# Sunflower Land — Minigames, Pets, Mutants, Auctions (Research)

Research compiled 2026-04-11 from the official Sunflower Land GitHub source
(`github.com/sunflower-land/sunflower-land`), `docs.sunflower-land.com`,
`sfl.world`, `wiki.sfl.world`, and community proposals/guides.

Only numeric/factual data is included. Where a field is omitted, the source
did not provide a public number (the devs intentionally keep some drop rates
secret — see Treasure Island discussion).

---

## 1. Mini-games (offchain portals)

### 1.1 Supported minigames (from `src/features/game/types/minigames.ts`)

The `SUPPORTED_MINIGAMES` array currently exposes 22 portal IDs:

```
crop-boom, bumpkin-fight-club, bumpkin-board-game, sfl-world, maze-run,
board-game, chicken-rescue, chicken-rescue-v2, festival-of-colors,
crops-and-chickens, farmer-football, fruit-dash, halloween,
christmas-delivery, easter-eggstravaganza, mine-whack,
festival-of-colors-2025, holiday-puzzle-2025, nightshade-arcade,
april-fools, memory, chaacs-temple
```

Source: https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/types/minigames.ts

All portal minigames follow the same basic economy:

| Field | Value |
|---|---|
| Reward type | Chapter Tickets (seasonal) or SFL / Love Charms |
| Daily attempts | Unlimited (free plays possible), but **daily ticket cap** is enforced per-portal |
| Entry cost (after free plays) | 1 Crown / Block Buck / SFL (varies) |
| Unlock | Must own the relevant portal NPC and/or Bumpkin ≥ required level |
| Leaderboard | Weekly/monthly score tracked on server |

Each portal returns a score to the game server; the server converts score to
tickets via a portal-specific formula and enforces a daily ticket cap.

### 1.2 Per-minigame details

| Minigame | Type | Daily cap | Reward | Notes |
|---|---|---|---|---|
| **Chicken Rescue / v2** | Avoid-and-catch | Capped tickets/day | Chapter tickets | Rescue falling eggs |
| **Festival of Colors (2024)** | Paintball | Capped tickets/day | Love/Chapter tickets | |
| **Festival of Colors 2025** | Balloon shooter | Capped tickets/day | Love Charms | Pop balloons with pixel cannon, dodge projectiles |
| **Easter Eggstravaganza** | Egg hunt | Capped tickets/day | Easter tokens / tickets | |
| **Maze Run / Corn Maze** | Timed maze | Weekly cap **100 Crow Feathers** | Crow Feather | **3 min** per run; **−5 s** penalty per enemy hit (Witches' Eve chapter) |
| **Christmas Delivery** | Delivery platformer | Capped tickets/day | Christmas tokens | |
| **Crop Boom** | Minesweeper variant | Capped tickets/day | Chapter tickets | |
| **Crops and Chickens** | Arcade | Capped tickets/day | Chapter tickets | (a.k.a. "Crop'dss Ups") |
| **Fruit Dash** | Runner | Capped tickets/day | Chapter tickets | |
| **Bumpkin Fight Club / Board Game** | PvP / strategy | — | Chapter tickets | |
| **Farmer Football** | Sports | Capped tickets/day | Chapter tickets | |
| **Mine Whack** | Whack-a-mole | Capped tickets/day | Chapter tickets | |
| **Halloween** | Event | Capped tickets/day | Halloween tokens | |
| **Holiday Puzzle 2025** | Puzzle | Capped tickets/day | Event tokens | |
| **Memory** | Card match | Capped tickets/day | Chapter tickets | |
| **Chaacs Temple** | Dungeon-style | Capped tickets/day | Chapter tickets | |
| **Nightshade Arcade** | Faction-exclusive | Capped tickets/day | Mark faction tokens | |
| **April Fools** | Event | Capped tickets/day | Event tokens | |

Sources:
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/minigames.ts
- https://github.com/sunflower-land/chicken-rescue
- https://docs.sunflower-land.com/llms-full.txt (Corn Maze numbers)

### 1.3 Potion House (Gnome's Potion)

Mastermind-style puzzle run by NPC **Eins** in the Plaza (bottom-right, next to
the Goblins). Gives **Potion Tickets** that feed into Bumpkin crafting recipes.

| Rule | Value |
|---|---|
| Attempts per game | **3** (rows of guesses) |
| Slots per row | **4** |
| Total potions available | **7** colors |
| Points per "correct" slot (right potion, right slot) | **25** |
| Points per "almost" slot (right potion, wrong slot) | **15** |
| Points per "incorrect" / "pending" | **0** |
| Bomb/Chaos potion in final row | **Score = 0** (instant zero, regardless of other slots) |
| Max raw score per row | **100** (4 × 25) |
| Multiplier | Paid multiplier setting — higher cost, higher ticket reward |
| Reward | **Potion Tickets** (seasonal crafting currency) |

Feedback states: `pending`, `correct`, `almost`, `incorrect`, `bomb`.

Sources:
- `src/features/game/events/landExpansion/mixPotion.ts`
- https://wiki.sfl.world/en/mechanics/minigames/Potion-House

### 1.4 Beach / Treasure Digging

| Field | Value |
|---|---|
| Location | Treasure Island (Beach) |
| Daily holes | **7 per day** (tide refreshes every 24 h) |
| Tool | **Sand Shovel** (consumed 1 per hole) |
| Sand Shovel recipe | 2 Wood + 1 Stone + 20 Coins |
| Average craftable/day | 3–4 shovels |
| Metal Detector | Advanced tool, biases toward rare treasure |
| Reward types | Resources, food, rare decorations, pirate bounty, exotic fruit seeds (magic beans), quest items |

Sources:
- https://github.com/sunflower-land/sunflower-land/discussions/1956
- https://github.com/sunflower-land/sunflower-land/pull/1718

### 1.5 Desert Digging (Archaeology)

From `src/features/game/types/desert.ts` (plus Discussion #4007 design doc).

| Field | Value |
|---|---|
| Grid size | **10 × 10** (`DESERT_GRID_WIDTH=10`, `DESERT_GRID_HEIGHT=10`) |
| Items per grid | **8 unique discoverables** |
| Daily reset | Every **24 h** |
| Base digs/day | ~**25** (before boosts) |
| Extra digs | **5 extra digs = 1 Block Buck** |
| Sand Drill | Covers **2×2** area per use; recipe = 1 Oil + 1 Iron + 5 Wood + 40 Coins |
| Treasure Map | 5 Gold + 2 Wooden Compass |
| Artefact unlock 1 | **5 Artefacts collected** |
| Artefact unlock 2 | **35 Artefacts** |
| Artefact unlock 3 | **85 Artefacts** (utility item) |

Dig-boost wearables / collectibles:

| Item | Effect |
|---|---|
| Heart of Davy Jones | **+20 Digs** |
| Bionic Drill (wearable) | **+5 Digs/day** — auction supply, 500 Sand + 10 Gold |
| Pharaoh Chicken (mutant) | **+2 Digs** |
| Ancient Shovel | Dig **without shovel** — auction supply 25 |

Artefact per chapter: Bull Run = **Cow Skull**; default chapters = **Scarab**;
Pharaoh's Treasure = **Scarab**, etc.

Sources:
- https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/types/desert.ts
- https://github.com/sunflower-land/sunflower-land/discussions/4007
- https://github.com/sunflower-land/sunflower-land/discussions/3659 (V2 proposal)

### 1.6 Mushroom Forest

Passive minigame: mushrooms spawn on the farm over time. Not a portal game —
see `types/mushrooms.ts`. Numeric data (spawn interval, max mushrooms) not
publicly documented in the repo; community reports indicate mushrooms refresh
every few hours and cap at a small number per expansion.

---

## 2. Pirate's Chest / Daily Reward / Treasure

### 2.1 Daily Chest

| Field | Value |
|---|---|
| Location | Home Farm, on the roof of the house |
| Unlock | Bumpkin **Level 3** |
| Claim rule | Automatic on first login after daily reset |
| Streak | +1 per consecutive claim; **resets** after missed day (>24 h) |
| Streak protection | New accounts with ≤ **6** streak are protected from reset |
| Every **7 days** | **Mega Reward** chest (bigger reward) |
| Base contents | 3 × Cheers + 1 × current Chapter Ticket + 1 rotating item |
| VIP bonus | 1 extra daily consumable, scales with Bumpkin level |
| Preview | Next 7 days' rewards visible via Mailbox → "Daily Gift" tab |

Rewards dispatched via `applyReward()`: inventory items + coins + SFL +
Bumpkin XP + buffs.

Sources:
- `src/features/game/events/landExpansion/claimDailyReward.ts`
- https://wiki.sfl.world/en/mechanics/chests
- https://sfl.world/info/chests
- https://w3land.com/sunflower-land/claim-daily-reward

### 2.2 Pirate's Chest

| Field | Value |
|---|---|
| Location | Beach, left of the dig site near Old Salty |
| Unlock | Must have **Pirate Potion** applied to Bumpkin (wearable) |
| Frequency | **Once per day** |
| Contents | Rotating — SFL, Block Bucks, tickets, bait, pirate treasure |

### 2.3 Treasure Island digging drops

| Tier | Example items |
|---|---|
| Common | Sand (10 c), Camel Bone (10 c), Seaweed (75 c), Vase (50 c) |
| Uncommon | Starfish (112.5 c), Wooden Compass (131–187.5 c) |
| Rare | Clam Shell (375 c), Sea Cucumber, Cockle Shell |
| Ultra Rare | **Coral (1,500 c)**, **Pearl (3,750 c)**, **Pirate Bounty (7,500 c)** |
| Chapter artefacts | 200 c each (limited-time) |
| Exotic fruit seeds | Via Magic Beans only (not direct digs) |

Every dig in the V2 design is **guaranteed** to return a prize (no empty digs).
Exact drop probabilities are deliberately kept private by the devs.

Source: https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/types/treasure.ts

---

## 3. Pets (Pet House system)

Introduced in Chapter 11 ("Paw Prints"). Source file:
`src/features/game/types/pets.ts`.

### 3.1 Pet types

**Common pets (7):** Dog, Cat, Owl, Horse, Bull, Hamster, Penguin
**NFT pets (7):** Ram, Dragon, Phoenix, Griffin, Warthog, Wolf, Bear

### 3.2 Pet categories → resource fetched

| Category | Resource |
|---|---|
| Guardian | Chewed Bone |
| Hunter | Ribbon |
| Voyager | Ruffroot |
| Beast | Wild Grass |
| Moonkin | Heart Leaf |
| Snowkin | Frost Pebble |
| Forager | Dewberry |

### 3.3 Pet House capacity

```ts
PET_HOUSE_CAPACITY = {
  1: { commonPets: 3, nftPets: 1 },
  2: { commonPets: 5, nftPets: 4 },
  3: { commonPets: 7, nftPets: 7 },
};
```

| Pet House Level | Common pets | NFT pets |
|---|---|---|
| 1 | 3 | 1 |
| 2 | 5 | 4 |
| 3 | 7 | 7 |

### 3.4 Pet XP and levels

Formula: `XP to reach level n = 100 * (n - 1) * n / 2`

| Level | Cumulative XP |
|---|---|
| 1 | 0 |
| 2 | 100 |
| 3 | 300 |
| 4 | 600 |
| 5 | 1,000 |
| 6 | 1,500 |
| 7 | 2,100 |
| 8 | 2,800 |
| 9 | 3,600 |
| 10 | 4,500 |

### 3.5 Pet feeding (requests)

Pet requests (the food a pet asks for) have three difficulty tiers:

```ts
PET_REQUEST_XP = { easy: 20, medium: 100, hard: 300 };
```

| Difficulty | # of foods in pool | XP per fed request |
|---|---|---|
| Easy | 14 | **20** |
| Medium | 26 | **100** |
| Hard | 24 | **300** |

Examples:
- Easy: Mashed Potato, Cheese, Quick Juice
- Medium: Boiled Eggs, Pancakes, Power Smoothie
- Hard: Kale Omelette, Pizza Margherita, The Lot, Honey Cake

### 3.6 Pet care / social mechanics

| Mechanic | Value |
|---|---|
| Daily petting social XP cap | **50 XP/day** (5 XP per interaction) |
| Neglect threshold (common) | **3 days** without feed → pet becomes neglected |
| Neglect threshold (NFT) | **7 days** |
| Nap duration after petting | **2 hours** |

### 3.7 Pet resources (energy values)

`PET_RESOURCES` assigns an `energy` cost to each fetched resource:

| Resource | Energy |
|---|---|
| Acorn | 100 |
| Ruffroot | 200 |
| Chewed Bone, Ribbon, Wild Grass, Heart Leaf, Frost Pebble, Dewberry | 200–1,000 (varies) |

Sources:
- https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/types/pets.ts
- `src/features/game/events/landExpansion/feedFactionPet.ts`, `renewPetShrine.ts`

---

## 4. Seasonal Mutants

### 4.1 Mutant Crops

Spawn on harvest via `prngChance()` RNG call in `harvest.ts`. Precise base
chance isn't exported as a constant in the public repo, but community
reverse-engineering consistently reports **~3%** for the rare trio
(Stellar / Potent / Radical).

| Mutant crop | Parent crop | Trigger chance | Effect on parent | Type |
|---|---|---|---|---|
| **Stellar Sunflower** | Sunflower | ~3% per harvest | **+10** Sunflowers on drop (also +3% listed boost) | rare |
| **Potent Potato** | Potato | ~3% (~10/3%) per harvest | **+10** Potatoes | rare |
| **Radical Radish** | Radish | ~3% per harvest | **+10** Radishes | rare |
| **Peaceful Potato** | Potato | seasonal | decorative boost | legacy |
| **Perky Pumpkin** | Pumpkin | seasonal | decorative boost | legacy |
| **Colossal Crop** | — | seasonal | decorative | legacy |
| **Peeled Potato** | Potato | 20% | **+1** Potato on drop | passive (collectible) |
| **Lab Grown Carrot** | Carrot | craftable (not RNG) | **+0.2** Carrot per harvest | passive collectible |
| **Lab Grown Radish** | Radish | craftable | **+0.4** Radish | passive collectible |
| **Lab Grown Pumpkin** | Pumpkin | craftable | **+0.3** Pumpkin | passive collectible |

Carrot Sword decoration reportedly **×4** the mutant crop find chance
(community source).

Sources:
- `src/features/game/events/landExpansion/harvest.ts`
- https://github.com/sunflower-land/sunflower-land/discussions/2299 (yield data)
- https://github.com/sunflower-land/sunflower-land/issues/417 (proposal)
- https://github.com/sunflower-land/sunflower-land/discussions/1719

### 4.2 Mutant Chickens

From proposal Issue #935 and yield data discussion:

| Chicken | Drop chance (when collecting eggs) | Effect | Notes |
|---|---|---|---|
| **Speed Chicken** | 1/1,000 base (2/1,000 with Barn Manager) | **−10%** egg production time | original trio |
| **Rich Chicken** | 1/1,000 base | **+10%** egg yield (code shows +0.1 flat) | original trio |
| **Fat Chicken** | 1/1,000 base | **−10%** wheat needed to feed chickens | original trio |
| **Ayam Cemani** | very rare | **+0.2** Eggs (flat) | Collecting all mutant chickens boosts its find chance by **+30%** |
| **Banana Chicken** | rare | **+0.1** Bananas | size 1×2 |
| **Alien Chicken** | Bull Run mutant | Chapter-specific boost | size 1×1 |
| **El Pollo Veloz** | rare wearable-linked | reduces egg production time | |
| **Undead Rooster** | rare | **+0.1** Eggs | |
| **Chicken Coop** (not mutant) | craftable | **+1** Egg | baseline reference |

Rule: **mutant chicken boosts do not stack** — owning multiple of the same
type gives only one effect.

Sources:
- https://github.com/sunflower-land/sunflower-land/issues/935
- https://github.com/sunflower-land/sunflower-land/discussions/2299

### 4.3 Mutant Cows / Sheep / Flowers / Fish (by chapter)

From `src/features/game/types/chapterMutants.ts`:

| Chapter | Mutant Chicken | Cow | Sheep | Flower | Fish |
|---|---|---|---|---|---|
| Pharaoh's Treasure | Pharaoh Chicken | — | — | Desert Rose | Lemon Shark |
| Bull Run | Alien Chicken | Mootant | Toxic Tuft | Chicory | Longhorn Cowfish |
| Winds of Change | Summer Chicken | Frozen Cow | Frozen Sheep | Chamomile | Jellyfish |
| Better Together | Janitor Chicken | Baby Cow | Baby Sheep | Venus Bumpkin Trap | Poseidon |
| Paw Prints | Sleepy Chicken | Astronaut Cow | Astronaut Sheep | Black Hole Flower | Super Star |
| Crabs and Traps | Squid Chicken | Mermaid Cow | Mermaid Sheep | Anemone Flower | Giant Isopod, Nautilus, Dollocaris |
| Great Bloom | Love Chicken | Dr Cow | Nurse Sheep | Lunalist | Pink Dolphin |

Drop chance per chapter: not published per-mutant — rolls are chapter-scoped
via the same `prngChance()` logic used by mutant crops/chickens. `animals.ts`
notes: "Mutants for all animals started in Bull Run; Pharaoh's Treasure has
Pharaoh Chicken."

Sources:
- https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/types/chapterMutants.ts
- https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/types/animals.ts

---

## 5. Auction House / Goblin Market

### 5.1 Mechanics

| Rule | Value |
|---|---|
| Auction style | **Blind bid** (no visibility on other bids) |
| Bid currency | SFL, Seasonal Tickets, or Block Bucks + crafting resources |
| Bid locking | Once placed, **irreversible** until auction ends |
| Tie-breaker | Highest Bumpkin XP wins |
| Mint window | **24 hours** after auction ends (on-chain TX required) |
| Refund | Losing bidders receive **full refund** of resources + SFL |
| Unlock | Access via Auctioneer NPC in Plaza |

### 5.2 Supply examples (from `llms-full.txt`)

| Chapter | Item | Community supply | Team supply | Total |
|---|---|---|---|---|
| Chapter 5: Spring Blossom | Crimstone Hammer | 100 | 5 | **105** |
| Chapter 5: Spring Blossom | Queen Bee | 200 | 15 | **215** |
| Chapter 5: Spring Blossom | Hungry Caterpillar | 325 | 30 | **355** |
| Chapter 3: Witches' Eve | Queen Cornelia | 200–300 per date | — | 200–300 |
| Chapter 3: Witches' Eve | Infected Potion | 300 per date | — | 300 |
| Chapter 3: Witches' Eve | Crumple Crown | 60–100 per date | — | 60–100 |

Sources:
- https://docs.sunflower-land.com/llms-full.txt
- https://wiki.sfl.world/en/mechanics/marketplace
- https://sfl.world/info/auctions
- `src/features/game/events/landExpansion/cancelBid.ts`, `refundBid.ts`

---

## 6. Referenced source files (for implementation)

Repository: https://github.com/sunflower-land/sunflower-land

| Feature | File path |
|---|---|
| Minigame registry | `src/features/game/types/minigames.ts` |
| Potion House logic | `src/features/game/events/landExpansion/mixPotion.ts`, `startPotion.ts` |
| Desert digging | `src/features/game/types/desert.ts`, `buyMoreDigs.ts` |
| Beach treasure | `src/features/game/types/treasure.ts`, `treasureSold.ts` |
| Pets | `src/features/game/types/pets.ts`, `feedFactionPet.ts`, `renewPetShrine.ts` |
| Mutant chapter map | `src/features/game/types/chapterMutants.ts` |
| Animals / mutants | `src/features/game/types/animals.ts` |
| Harvest / mutant crops | `src/features/game/events/landExpansion/harvest.ts` |
| Daily reward | `src/features/game/events/landExpansion/claimDailyReward.ts` |
| Auction bids | `src/features/game/events/landExpansion/cancelBid.ts`, `refundBid.ts` |
| Collectible buffs | `src/features/game/types/collectibleItemBuffs.ts`, `buffs.ts` |

---

## 7. Known gaps / intentionally secret numbers

1. Exact mutant crop chance constant is **not** exposed as a named const in
   `harvest.ts`; rolls go through `prngChance()` with an internal value. The
   "~3%" figure is community-observed from large harvest datasets.
2. Treasure Island drop probabilities are deliberately kept private:
   > "The developers were still undecided about publicising the drop numbers.
   > The core design principle of this feature is surprise & mystery."
3. Per-portal daily ticket caps are server-side and vary per chapter.
4. Mushroom Forest cadence/spawn count isn't documented in public repo files.
5. Exact per-chapter mutant animal drop chance uses the same
   `prngChance()` mechanic but values aren't published.

---

## Primary sources

- https://github.com/sunflower-land/sunflower-land
- https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/types/minigames.ts
- https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/types/pets.ts
- https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/types/desert.ts
- https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/types/treasure.ts
- https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/types/chapterMutants.ts
- https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/types/animals.ts
- https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/events/landExpansion/mixPotion.ts
- https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/events/landExpansion/harvest.ts
- https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/events/landExpansion/claimDailyReward.ts
- https://github.com/sunflower-land/sunflower-land/issues/935 (Chickens proposal)
- https://github.com/sunflower-land/sunflower-land/issues/417 (Mutant Crops proposal)
- https://github.com/sunflower-land/sunflower-land/discussions/1719 (Mutant Crops art)
- https://github.com/sunflower-land/sunflower-land/discussions/1956 (Treasure Island)
- https://github.com/sunflower-land/sunflower-land/discussions/3659 (Treasure Island V2)
- https://github.com/sunflower-land/sunflower-land/discussions/4007 (Archaeological Digging)
- https://github.com/sunflower-land/sunflower-land/discussions/2299 (Yield calculations)
- https://github.com/sunflower-land/sunflower-land/discussions/5660 (Potion House updates)
- https://docs.sunflower-land.com/llms-full.txt
- https://wiki.sfl.world/en/mechanics/minigames/Potion-House
- https://wiki.sfl.world/en/mechanics/chests
- https://wiki.sfl.world/en/mechanics/digging
- https://wiki.sfl.world/en/mechanics/marketplace
- https://sfl.world/info/chests
- https://sfl.world/info/auctions
- https://w3land.com/sunflower-land/claim-daily-reward
- https://playtoearn.com/news/earn-exclusive-rewards-in-sunflower-lands-annual-easter-community-event-until-april-28th
