# Sunflower Land — Skills, Deliveries, Seasons, Chores, Factions

Research compiled for the Пчело-ферма clone project.
Date: 2026-04-11.
Primary source: https://github.com/sunflower-land/sunflower-land (main branch).

All numeric data below is taken from the live TypeScript source. Where the
source file stores only a translation key, the numeric value is resolved from
`src/lib/i18n/dictionaries/en.json`.

---

## 1. Bumpkin Skills Tree (revamped system)

The game uses `BUMPKIN_REVAMP_SKILL_TREE` (introduced with "Clash of Factions").
Each skill has: `tree`, `points`, `tier` (1/2/3), `island` (basic/spring/desert),
optional `cooldown` (ms) and a `power` flag for activated powers.

Source:
- `src/features/game/types/bumpkinSkills.ts`
- `src/features/game/events/landExpansion/choseSkill.ts`
- `src/lib/i18n/dictionaries/en.json`

### 1.1 Skill-point economy

- 1 skill point is granted at every Bumpkin level-up.
  `getAvailableBumpkinSkillPoints = bumpkinLevel - totalUsedSkillPoints`
  (choseSkill.ts L25–41).
- Max Bumpkin level = 200 (level.ts L406), so a player can earn up to 200
  skill points lifetime.
- Cost per skill slot inside a tree:
  - Tier 1 = 1 point
  - Tier 2 = 2 points
  - Tier 3 = 3 points

### 1.2 Tier unlock thresholds (points spent inside the tree)

From `SKILL_POINTS_PER_TIER` (choseSkill.ts L43–107).
Tier 1 is unlocked from the start; to unlock Tier 2/3 you must have spent the
following number of points **within the same tree** (tier 3 picks don't count).

| Tree            | Tier 2 at | Tier 3 at |
|-----------------|-----------|-----------|
| Crops           | 3 pts     | 7 pts     |
| Trees           | 2 pts     | 5 pts     |
| Fishing         | 2 pts     | 5 pts     |
| Mining          | 3 pts     | 7 pts     |
| Cooking         | 2 pts     | 5 pts     |
| Compost         | 3 pts     | 7 pts     |
| Fruit Patch     | 2 pts     | 5 pts     |
| Animals         | 4 pts     | 8 pts     |
| Bees & Flowers  | 2 pts     | 5 pts     |
| Greenhouse      | 2 pts     | 5 pts     |
| Machinery       | 2 pts     | 5 pts     |
| Aging           | 3 pts     | 7 pts     |

### 1.3 Island prerequisite per tree

- `basic` island: Crops, Trees, Mining, Cooking, Compost
- `spring` island: Fruit Patch, Animals, Fishing, Bees & Flowers
- `desert` island: Greenhouse, Machinery, Aging

The `island` requirement gates when the tree can first be touched.

### 1.4 Complete numeric skill list

All values come directly from `en.json` `skill.*` keys (bumpkinSkills.ts
references these via `translate("skill.…")`). Every skill costs `points`
equal to its tier (T1=1, T2=2, T3=3) unless noted.

Cooldowns: a value such as `72h` means the power can be re-used every 72h;
source uses `1000 * 60 * 60 * 72` literals.

#### CROPS (basic island)

| Tier | Skill              | Numeric effect |
|------|--------------------|----------------|
| 1 | Green Thumb          | -5% plot crop growth time |
| 1 | Young Farmer         | +0.1 Basic crop yield |
| 1 | Experienced Farmer   | +0.1 Medium crop yield |
| 1 | Old Farmer           | +0.1 Advanced crop yield |
| 1 | Betty's Friend       | +30% coins from Betty deliveries |
| 1 | Chonky Scarecrow     | Basic Scarecrow AOE 7x7; additional -10% basic crop growth time |
| 2 | Strong Roots         | -10% Advanced crop growth time |
| 2 | Coin Swindler        | +10% coins when selling crops at the Market |
| 2 | Golden Sunflower     | 1/700 chance to get 0.35 Gold on Sunflower harvest (excl. Crop Machine) |
| 2 | Horror Mike          | Scary Mike AOE 7x7; additional +0.1 medium crop yield |
| 2 | Laurie's Gains       | Laurie the Chuckle Crow AOE 7x7; additional +0.1 advanced crop yield |
| 3 | Instant Growth       | POWER: instantly harvest all growing crops. Cooldown 72h |
| 3 | Acre Farm            | +1 Advanced crop yield; -0.5 Basic and Medium crop yield |
| 3 | Hectare Farm         | +1 Basic and Medium crop yield; -0.5 Advanced crop yield |

#### FRUIT PATCH (spring island)

| Tier | Skill            | Numeric effect |
|------|------------------|----------------|
| 1 | Fruitful Fumble    | +0.1 Fruit Patch yield |
| 1 | Fruity Heaven      | -10% Fruit Patch seed cost |
| 1 | Fruity Profit      | +50% coins from Tango's deliveries (fruit orders) |
| 1 | Loyal Macaw        | Doubles Macaw's effect |
| 1 | No Axe No Worries  | Chop fruit branches/stems without axes; -1 wood per branch |
| 2 | Catchup            | -10% Fruit Patch growth time |
| 2 | Fruity Woody       | +1 wood from fruit branches/stems |
| 2 | Pear Turbocharge   | Doubles Immortal Pear's effect |
| 2 | Crime Fruit        | +10 Tomato and Lemon seed stock |
| 2 | Generous Orchard   | 20% chance of +1 Fruit Patch yield |
| 3 | Long Pickings      | -50% Apple & Banana growth time; +100% growth time for all other fruits |
| 3 | Short Pickings     | -50% Blueberry & Orange growth time; +100% growth time for all other fruits |
| 3 | Zesty Vibes        | +1 Tomato & Lemon yield; -0.25 yield for all other fruits |

#### TREES (basic island)

| Tier | Skill               | Numeric effect |
|------|---------------------|----------------|
| 1 | Lumberjack's Extra    | +0.1 wood yield |
| 1 | Tree Charge           | -10% tree growth time |
| 1 | More Axes             | +50 axe stock |
| 1 | Insta Chop            | 1 tap to fell trees |
| 2 | Tough Tree            | 1/10 chance of x3 wood yield |
| 2 | Feller's Discount     | -20% axe cost |
| 2 | Money Tree            | 1% chance of +200 coins when chopping |
| 2 | Tree Turnaround       | 15% chance for trees to grow instantly |
| 3 | Tree Blitz            | POWER: all trees instantly grow. (Cooldown in source) |

#### FISHING (spring island)

| Tier | Skill                | Numeric effect |
|------|----------------------|----------------|
| 1 | Fisherman's 5-Fold     | +5 daily fishing reels |
| 1 | Fishy Chance           | 10% chance of +1 basic fish |
| 1 | Fishy Roll             | 10% chance of +1 advanced fish |
| 1 | Reel Deal              | -50% rod coin cost |
| 2 | Fisherman's 10-Fold    | +10 daily fishing reels |
| 2 | Fishy Fortune          | +100% coins from Corale's deliveries |
| 2 | Big Catch              | Increase bar for catching minigame |
| 2 | Fishy Gamble           | 20% chance of +1 expert fish |
| 2 | Frenzied Fish          | During fish frenzy: +1 fish and 50% chance of +1 more |
| 3 | More With Less         | +15 daily fishing reels; -1 worm from all composters |
| 3 | Fishy Feast            | +20% Bumpkin XP from fish |

#### ANIMALS (spring island)

| Tier | Skill                 | Numeric effect |
|------|-----------------------|----------------|
| 1 | Abundant Harvest        | +0.2 Egg, Wool and Milk yield |
| 1 | Efficient Feeding       | -5% feed to feed all animals |
| 1 | Restless Animals        | -10% animal sleep time |
| 1 | Double Bale             | Doubles Bale's effect |
| 1 | Bale Economy            | Bale affects milk and wool production |
| 2 | Featherweight           | +0.25 Feather yield; -0.35 Leather & Merino Wool yield |
| 2 | Merino Whisperer        | +0.25 Merino Wool; -0.35 Leather & Feather |
| 2 | Leathercraft Mastery    | +0.25 Leather; -0.35 Feather & Merino Wool |
| 2 | Fine Fibers             | +0.1 Feather, Leather and Merino Wool yield |
| 2 | Bountiful Bounties      | +50% coins from Animal Bounties |
| 2 | Heartwarming Instruments| +50% animal XP from Animal Affection tools |
| 2 | Kale Mix                | Mixed Grain needs only 3 kale |
| 2 | Alternate Medicine      | Barn Delight needs 1 less Lemon and Honey |
| 2 | Healthy Livestock       | -50% chance of animal sickness |
| 3 | Clucky Grazing          | -25% chicken feed; +50% feed for other animals |
| 3 | Sheepwise Diet          | -25% sheep feed; +50% feed for other animals |
| 3 | Cow-Smart Nutrition     | -25% cow feed; +50% feed for other animals |
| 3 | Chonky Feed             | 2x animal XP from feed; +50% feed required |
| 3 | Barnyard Rouse          | POWER: instantly wakes all animals |

#### GREENHOUSE (desert island)

| Tier | Skill              | Numeric effect |
|------|--------------------|----------------|
| 1 | Victoria's Secretary | +50% coins from Victoria's deliveries |
| 1 | Glass Room           | +0.1 Greenhouse produce yield |
| 1 | Seedy Business       | -15% Greenhouse seed cost |
| 1 | Rice and Shine       | -5% growth time for all Greenhouse produce |
| 2 | Olive Express        | -10% Olive growth time |
| 2 | Rice Rocket          | -10% Rice growth time |
| 2 | Vine Velocity        | -10% Grape growth time |
| 2 | Seeded Bounty        | +0.5 Greenhouse produce yield; +1 Greenhouse seed to plant |
| 2 | Greasy Plants        | +1 Greenhouse produce yield; +100% oil consumption |
| 3 | Greenhouse Guru      | POWER: make all growing Greenhouse produce ready |
| 3 | Greenhouse Gamble    | 25% chance of +1 Greenhouse produce |
| 3 | Slick Saver          | -1 Oil per Greenhouse produce |

#### MINING (basic island)

| Tier | Skill               | Numeric effect |
|------|---------------------|----------------|
| 1 | Rock 'n' Roll         | +0.1 Stone yield |
| 1 | Iron Bumpkin          | +0.1 Iron yield |
| 1 | Speed Miner           | -20% Stone recovery time |
| 1 | Tap Prospector        | 1 tap for small mineral nodes |
| 1 | Forge-Ward Profits    | +20% Blacksmith delivery revenue |
| 2 | Iron Hustle           | -30% Iron recovery time |
| 2 | Frugal Miner          | -20% coin cost on pickaxes |
| 2 | Rocky Favor           | +1 Stone; -0.5 Iron |
| 2 | Ferrous Favor         | +1 Iron; -0.5 Stone |
| 2 | Midas Sprint          | -10% Gold recovery time |
| 3 | Midas Rush            | -20% Gold recovery time |
| 3 | Golden Touch          | +0.5 Gold yield |
| 3 | More Picks            | +70 Pickaxe, +20 Stone, +7 Iron, +2 Gold pickaxe stock |
| 3 | Fire Kissed           | +1 Crimstone yield on 5th consecutive mine |
| 3 | Fireside Alchemist    | -15% Crimstone recovery time |

#### COOKING (basic island)

| Tier | Skill                | Numeric effect |
|------|----------------------|----------------|
| 1 | Fast Feasts            | -10% Firepit & Kitchen cooking time |
| 1 | Nom Nom                | +10% food delivery revenue |
| 1 | Munching Mastery       | +5% Bumpkin XP |
| 1 | Swift Sizzle           | -40% Fire Pit cook time when using oil |
| 2 | Frosted Cakes          | -10% cakes cooking time |
| 2 | Juicy Boost            | +10% Bumpkin XP from drinks |
| 2 | Double Nom             | +1 food per cook; 2x ingredients required |
| 2 | Turbo Fry              | -50% Kitchen cook time with oil |
| 3 | Instant Gratification  | POWER: all cooking meals ready instantly |
| 3 | Drive Through Deli     | +15% Bumpkin XP from Deli |
| 3 | Fiery Jackpot          | +20% chance of +1 food from Firepit |
| 3 | Fry Frenzy             | -60% Deli cook time with oil |

#### BEES & FLOWERS (spring island)

| Tier | Skill              | Numeric effect |
|------|--------------------|----------------|
| 1 | Sweet Bonus          | +0.1 Honey per hive |
| 1 | Hyper Bees           | +0.1 Honey production speed |
| 1 | Blooming Boost       | -10% Flower growth time |
| 1 | Flower Sale          | -20% Flower seed cost |
| 2 | Buzzworthy Treats    | +10% Bumpkin XP from honey foods |
| 2 | Blossom Bonding      | +2 relationship points when gifting flowers |
| 2 | Pollen Power Up      | +0.1 crop yield after pollination (total +0.3) |
| 2 | Petalled Perk        | 10% chance of +1 Flower |
| 3 | Bee Collective       | +20% bee swarm chance |
| 3 | Flower Power         | -20% Flower growth time |
| 3 | Flowery Abode        | +0.5 Honey production speed; +50% Flower growth time |
| 3 | Petal Blessed        | POWER: all flowers ready instantly |

#### MACHINERY (desert island)

| Tier | Skill                  | Numeric effect |
|------|------------------------|----------------|
| 1 | Crop Processor Unit      | -5% Crop Machine growth time; +10% oil consumption |
| 1 | Oil Gadget               | -10% Crop Machine oil consumption |
| 1 | Oil Extraction           | +1 Oil when collecting from reserves |
| 1 | Leak Proof Tank          | Triples oil tank capacity in Crop Machine |
| 1 | Crop Extension Module I  | Enables Rhubarb & Zucchini seeds in Crop Machine |
| 2 | Crop Extension Module II | Enables Carrot & Cabbage seeds in Crop Machine |
| 2 | Crop Extension Module III| Enables Yam & Broccoli seeds in Crop Machine |
| 2 | Rapid Rig                | -20% Crop Machine growth; +40% oil consumption |
| 2 | Oil Be Back              | -20% Oil refill time |
| 2 | Oil Rig                  | Oil Drill craft needs 20 Wool (instead of Leather) |
| 3 | Field Expansion Module   | +5 packs in Crop Machine queue |
| 3 | Field Extension Module   | +5 plots in Crop Machine |
| 3 | Efficiency Ext. Module   | -30% Crop Machine oil consumption |
| 3 | Grease Lightning         | POWER: instantly refill empty oil wells |

#### COMPOST (basic island)

| Tier | Skill              | Numeric effect |
|------|--------------------|----------------|
| 1 | Efficient Bin        | +5 Sprout Mix |
| 1 | Turbo Charged        | +5 Fruitful Blend |
| 1 | Wormy Treat          | +1 Worm |
| 1 | Feathery Business    | Use feathers instead of eggs to boost composters; 2x feathers |
| 2 | Swift Decomposer     | -10% compost time |
| 2 | Composting Bonanza   | +1h speed-up when boosting; 2x resources to boost |
| 2 | Premium Worms        | +10 Rapid Root |
| 2 | Fruitful Bounty      | Doubles Fruitful Blend's effect |
| 3 | Composting Overhaul  | +2 Worms; -5 fertilisers |
| 3 | Composting Revamp    | +5 fertilisers; -3 Worms |

#### AGING (desert island — gated by `SALT_SKILLS` flag)

| Tier | Skill           | Numeric effect |
|------|-----------------|----------------|
| 1 | Cheap Rakes       | -15% Salt Rake coin cost |
| 1 | Speedy Aging      | -10% Aging Rack time |
| 1 | Salty Seas        | -10% salt charge replenishment time |
| 2 | Fish Smoking      | Doubled chance that Aged Fish becomes Prime Aged |
| 2 | Refiner           | 15% chance of +1 Refined Salt |
| 2 | Ager              | 2x Aging Shed output; 2x Aging Shed input |
| 3 | Wide Rakes        | +2 Salt per harvest |
| 3 | Sea Blessed       | 5% chance to recharge all salt nodes on harvest |
| 3 | Bacalhau          | +1 Bait yield from fermentation rack |
| 3 | Salt Surge        | POWER: recharge all salt nodes |

### 1.5 Power skill cooldown literal

Power skills set `cooldown: 1000 * 60 * 60 * X` in ms. Example from source
(bumpkinSkills.ts L603):
```
requirements: { points: 3, tier: 3, island: "basic",
                cooldown: 1000 * 60 * 60 * 72 }  // Instant Growth = 72h
```
In the current version Instant Growth = 72h; other power skills follow the
same pattern (24–96h range depending on skill, set next to each `power: true`
entry in the file).

### 1.6 Exclusivity

- A skill is exclusive to the player once claimed (`bumpkinHasSkill` check,
  choseSkill.ts L154, L179–180).
- Resetting skills is done via `resetSkills.ts` (a separate event).
- Skills inside the same tier/tree are **not** mutually exclusive — a player
  can hold every tier 1 pick simultaneously if they have the points.
- The legacy `BUMPKIN_SKILL_TREE` (21 skills) has explicit prerequisites
  (`requirements.skill`), e.g. Cultivator requires Green Thumb.

---

## 2. Deliveries and Bounty Board

Source: `src/features/game/events/landExpansion/deliver.ts`,
`sellBounty.ts`.

### 2.1 Delivery slot count (scales with land)

From `getDeliverySlots` (deliver.ts L132–146):

| Basic Land owned | Active delivery slots |
|------------------|-----------------------|
| < 5              | 3 |
| 5–7              | 4 |
| 8–11             | 5 |
| ≥ 12             | 6 |

Additional quest slots (deliver.ts L148–166):

| Basic Land owned | Quest slots |
|------------------|-------------|
| < 5              | 1 |
| 5–7              | 2 |
| 8–11             | 3 |
| 12–13            | 4 |
| ≥ 14             | 5 |

### 2.2 Delivery timing

Each new delivery spawns with `readyAt = maxExistingReadyAt + (24 / slotCount) h`
(deliver.ts L213–214).
So with 6 slots a new order arrives every 4h; at 3 slots every 8h. Typical
daily delivery volume: **6 slots × 6 per day = ~24 deliveries per day max**.

### 2.3 Ticket rewards per NPC (base, before boosts)

`TICKET_REWARDS` (deliver.ts L39–51):

| NPC             | Tickets |
|-----------------|---------|
| pumpkin' pete   | 1 |
| bert            | 2 |
| miranda         | 2 |
| finley          | 2 |
| raven           | 3 |
| finn            | 3 |
| timmy           | 4 |
| cornwell        | 4 |
| jester          | 4 |
| tywin           | 5 |
| pharaoh         | 5 |

Ticket bonuses stacked on top:
- `+2` if the player has VIP access (deliver.ts L69–71).
- `+1` per equipped chapter-boost item (deliver.ts L76–85). Each chapter
  defines a basic/rare/epic boost item (completeNPCChore.ts L39–115).
- `x2` multiplier when the "doubleDelivery" calendar event is active (once
  per day) — deliver.ts L102–107.

### 2.4 Delivery coin multipliers (per skill/wearable)

From `getOrderSellPrice` (deliver.ts L227–342):

| Condition                                     | Bonus |
|-----------------------------------------------|-------|
| Betty NPC + Betty's Friend skill              | +30% |
| Victoria NPC + Victoria's Secretary skill     | +50% |
| Blacksmith NPC + Forge-Ward Profits skill     | +20% |
| Tango NPC with fruit order + Fruity Profit    | +50% |
| Corale NPC + Fishy Fortune                    | +100% |
| Any food order + Nom Nom skill                | +10% |
| Any cake order + Chef Apron wearable          | +20% |
| Any order + active faction crown              | +25% |
| "doubleDelivery" calendar event (1x per day)  | x2 |

Friendship points per completed delivery = **3** (`DELIVERY_FRIENDSHIP_POINTS`,
deliver.ts L194).

Goblin NPCs (`grimtooth`, `grubnuk`, `gordo`, `guria`, `gambit`) require
Cropkeeper reputation (deliver.ts L344–391).

### 2.5 Bounty Board (Helios Bountiful)

`sellBounty.ts` defines the categories in `BOUNTY_CATEGORIES`:
- Flower Bounties (flowers)
- Fish Bounties (fish)
- Crustacean Bounties (crabs/lobsters)
- Exotic Bounties (exotic crops, sellable treasures, full-moon fruits,
  recipe craftables)
- Giant Fruit Bounties (Giant Apple/Banana/Orange)
- Doll Bounties
- Mark Bounties
- Obsidian Bounties

Rewards per bounty are stored on the `BountyRequest`:
- `coins`
- `items` (ChapterTicket counts, Mark, Obsidian, etc.)
- `sfl` (Obsidian bounties only — sellBounty.ts L198–200)

Ticket payout = `bounty.items[chapterTicket]`, with the same chapter-boost
"+1 per equipped item" bonus as deliveries (sellBounty.ts L83–114).

Animal bounty coin multiplier:
- Bountiful Bounties skill → **+50% coins** on animal bounties
  (sellBounty.ts L128–130).

---

## 3. Seasons (Chapters)

Source: `src/features/game/types/chapters.ts`.

### 3.1 Season length

The current cadence is **~3 months per chapter** (13 weeks), set by
`CHAPTERS` startDate/endDate pairs. Example (Crabs and Traps): 2026-02-02
→ 2026-05-04.

### 3.2 All chapters and their tickets

From `CHAPTER_ORDER` and `CHAPTER_TICKET_NAME`:

| # | Chapter             | Start        | End          | Ticket name |
|---|---------------------|--------------|--------------|-------------|
| 1 | Solar Flare         | 2023-01-01   | 2023-05-01   | Solar Flare Ticket |
| 2 | Dawn Breaker        | 2023-05-01   | 2023-08-01   | Dawn Breaker Ticket |
| 3 | Witches' Eve        | 2023-08-01   | 2023-11-01   | Crow Feather |
| 4 | Catch the Kraken    | 2023-11-01   | 2024-02-01   | Mermaid Scale |
| 5 | Spring Blossom      | 2024-02-01   | 2024-05-01   | Tulip Bulb |
| 6 | Clash of Factions   | 2024-05-01   | 2024-08-01   | Scroll |
| 7 | Pharaoh's Treasure  | 2024-08-01   | 2024-11-01   | Amber Fossil |
| 8 | Bull Run            | 2024-11-01   | 2025-02-03   | Horseshoe |
| 9 | Winds of Change     | 2025-02-03   | 2025-05-01   | Timeshard |
|10 | Great Bloom         | 2025-05-01   | 2025-08-04   | Geniseed |
|11 | Better Together     | 2025-08-04   | 2025-11-03   | Bracelet |
|12 | Paw Prints          | 2025-11-03   | 2026-02-02   | Pet Cookie |
|13 | Crabs and Traps     | 2026-02-02   | 2026-05-04   | Floater |

Paw Prints and Crabs and Traps also issue a per-chapter raffle ticket
("Paw Prints Raffle Ticket", "Crabs and Traps Raffle Ticket") —
`CHAPTER_RAFFLE_TICKET_NAME` (chapters.ts L162–179).

### 3.3 Other per-chapter rotations

`CHAPTER_ARTEFACT_NAME` (beach bounty artefact):
Scarab → Cow Skull → Ancient Clock → Broken Pillar → Coprolite →
Moon Crystal → Ammonite Shell.

`CHAPTER_MARVEL_FISH` (chapter-exclusive fish):
Crimson Carp → Battle Fish → Lemon Shark → Longhorn Cowfish →
Jellyfish → Pink Dolphin → Poseidon → Super Star → Giant Isopod.

Each chapter has a `CHAPTER_BANNERS` wearable entry for the banner
collectible.

### 3.4 How tickets are earned

Three tracked sources (all call `getChapterTaskPoints` and increment the
chapter ticket inventory):

1. **Deliveries** — `generateDeliveryTickets` (deliver.ts L55–110).
2. **NPC chores** — `generateChoreRewards` (completeNPCChore.ts L222–260).
3. **Bounties** — `generateBountyTicket` (sellBounty.ts L83–114).

VIP access adds +2 tickets per completed chore on ticket-rewarding chores
(completeNPCChore.ts L239–241).

### 3.5 Seasonal crops / rotation

Seasonal crop rotation is declared by the temperate season system in
`src/features/game/lib/temperateSeason.ts` and `crops.ts`. Crops are
tagged with their seasons in `CROPS` metadata; seeds only grow during
their declared seasons unless a skill/wearable overrides it. Full list
(at the time of writing — pull `crops.ts` for current seeds):

- Spring rotation: Sunflower, Carrot, Cabbage, Beetroot, Cauliflower
- Summer: Sunflower, Potato, Pumpkin, Zucchini, Rhubarb, Pepper
- Autumn: Sunflower, Wheat, Barley, Yam, Broccoli, Artichoke, Corn
- Winter: Sunflower, Potato, Turnip, Parsnip, Onion, Radish, Eggplant

(Seasons rotate temperate-season-based, not 1:1 with chapters. See
temperateSeason.ts for exact mapping.)

---

## 4. Chore Board / Daily Tasks

Source: `src/features/game/types/choreBoard.ts`,
`events/landExpansion/completeNPCChore.ts`.

### 4.1 Structure

- `ChoreBoard = { chores: Partial<Record<NPCName, NpcChore>> }` — one chore
  slot per NPC.
- New chores are generated and placed against NPCs whose `NPC_CHORE_UNLOCKS`
  level has been reached by the player (choreBoard.ts L3299–).

### 4.2 NPC chore unlock levels (`NPC_CHORE_UNLOCKS`)

From choreBoard.ts L3299–3333:

| NPC             | Unlock level |
|-----------------|--------------|
| pumpkin' pete   | 1 |
| betty           | 1 |
| blacksmith      | 1 |
| peggy           | 3 |
| corale          | 7 |
| tango           | 13 |
| old salty       | 15 |
| grimbly         | 10 |
| grimtooth       | 10 |
| gambit          | 10 |
| jester          | 10 |
| pharaoh         | 10 |
| timmy           | 10 |
| tywin           | 10 |
| cornwell        | 10 |
| finn            | 10 |
| finley          | 10 |
| miranda         | 10 |
| raven           | 10 |
| grubnuk         | 10 |
| bert            | 10 |
| victoria        | 30 |

### 4.3 Chores per day / reset

- There is one chore per unlocked NPC at any time; completing it triggers a
  new one (no hard "3 per day" — it's per-NPC).
- Chapter-ticket chores replenish daily. The codebase tracks completion
  by `completedAt` on each `NpcChore` and resets via server-side chore
  generation.
- Rewards: `chore.reward = { items: { [ItemName]: number }, coins?: number }`.
  Completing a chore awards `friendship.points += 1` to that NPC
  (completeNPCChore.ts L173).

### 4.4 Chore reward boosts

- VIP access: +2 tickets per chapter-ticket chore completion
  (completeNPCChore.ts L239–241).
- Each equipped chapter boost item (basic/rare/epic) adds +1 ticket to the
  chore reward (completeNPCChore.ts L245–255). The chapter boost items per
  chapter (completeNPCChore.ts L39–115):

| Chapter             | Basic            | Rare              | Epic |
|---------------------|------------------|-------------------|------|
| Solar Flare → Pharaoh's Treasure | Cow Scratcher | Cow Scratcher | Cow Scratcher |
| Bull Run            | Cowboy Hat       | Cowboy Shirt      | Cowboy Trouser |
| Winds of Change     | Acorn Hat        | Igloo             | Hammock |
| Great Bloom         | Flower Mask      | Love Charm Shirt  | Heart Air Balloon |
| Better Together     | Garbage Bin Hat  | Raccoon Onesie    | Recycle Shirt |
| Paw Prints          | Pet Specialist Hat | Pet Specialist Pants | Pet Specialist Shirt |
| Crabs and Traps     | Fish Hook Hat    | Fish Hook Vest    | Fish Hook Waders |

### 4.5 Chore task catalogue

`NPC_CHORES` in choreBoard.ts holds ~1,200 chore templates (lines 24–3268),
each pairing a farm-activity counter with a required count, e.g.:
- "Harvest Sunflowers 150 times" → Sunflower Harvested ≥ 150
- "Chop 80 Trees" → Tree Chopped ≥ 80
- "Mine 10 Crimstone" → Crimstone Mined ≥ 10
- "Spend 80,808 Coins" → Coins Spent ≥ 80,808

Counts scale upward in tiers to form rotating difficulty.

---

## 5. Factions

Source: `src/features/game/lib/factions.ts`, `types/factions.ts` (in-game
types), `events/landExpansion/feedFactionPet.ts`,
`events/landExpansion/deliverFactionKitchen.ts`.

### 5.1 Faction list

From `FACTION_OUTFITS` (lib/factions.ts L132–168):
- **bumpkins**
- **goblins**
- **sunflorians**
- **nightshades**

### 5.2 Faction outfit boosts

From `getFactionWearableBoostAmount` (lib/factions.ts L202–241), each
equipped faction wearable of your faction multiplies the base reward
(for faction-kitchen deliveries and pet feeding marks):

| Slot    | Boost |
|---------|-------|
| pants   | +5%  |
| shoes   | +5%  |
| hat     | +10% (ignored if crown equipped) |
| crown   | +10% |
| tool    | +10% |
| shirt   | +20% |

Maximum from full faction outfit = **5% + 5% + 10% + 10% + 20% = 50%**.

The crown also grants **+25%** coins on deliveries when active (deliver.ts
L304–313).

### 5.3 Faction weeks

- Faction week starts Monday at UTC 00:00 and runs 7 days
  (`getWeekKey`, `weekResetsAt` in lib/factions.ts L22–101).
- `START_DATE = 2024-06-24T00:00:00Z` (lib/factions.ts L15).
- `FACTION_BONUS_WEEKS` is a hard-coded list of weeks with bumped prize
  amounts (lib/factions.ts L270–299).

### 5.4 Weekly prize payouts

`FACTION_PRIZES` (lib/factions.ts L301–). For a regular week, top ranks are:

| Rank  | Coins  | SFL | Items |
|-------|--------|-----|-------|
| 1     | 64 000 | 200 | Mark: 10 000 |
| 2     | 50 000 | 175 | Mark: 8 000 |
| 3     | 44 000 | 150 | Mark: 7 000 |
| 4     | 36 000 | 150 | Mark: 6 000 |
| 5     | 32 000 | 125 | Mark: 5 000 |
| 6–10  | 25 000 | 100 | Mark: 5 000 |
| 11–25 | 15 000 |  50 | Mark: 2 500 |
| 26–50 | 10 000 |   0 | Mark: 1 500 |
| 51–100|  5 000 |   0 | Mark: 500 |

Bonus weeks add `Luxury Key`, `Rare Key`, `Treasure Key` rewards to the
tiers (see L307–437).

### 5.5 Faction pet feeding mechanic

From `feedFactionPet.ts`:

- Daily requests come with 4 difficulties:
  - `EASY = 4` marks base
  - `MEDIUM = 8` marks base
  - `HARD = 12` marks base
  - `DOLL = 20` marks base
  (`PET_FED_REWARDS_KEY`, L62–67)
- Mark reward decrements by 2 per prior daily fulfillment, min 1 per feed
  (`calculatePoints`, lib/factions.ts L250–262).
- Pet XP: food's `experience` from `CONSUMABLES`, or `DOLL_XP = 5000` for
  Doll requests.
- Paw Shield wearable: **+25%** to both marks and pet XP
  (feedFactionPet.ts L47–49, L89–91).
- Faction wearable outfit boosts (5/5/10/10/10/20%) stack on the Mark
  reward on each feed (lib/factions.ts L202–241).
- Request tracked per day via `request.dailyFulfilled[day]`
  (feedFactionPet.ts L152, L166).

### 5.6 Faction kitchen

`deliverFactionKitchen.ts` uses the same `calculatePoints` + wearable boost
system as the pet. Reward is in Marks; the kitchen has its own daily request
slots per faction.

### 5.7 Faction rank boost

The `getFactionRankBoostAmount` (in `lib/factionRanks.ts`) adds a % boost to
Marks based on the player's current faction rank inside the weekly leaderboard.
Ranks stack on top of the outfit boost and Paw Shield.

---

## 6. Key source files (for the clone implementation)

Absolute paths (on the sunflower-land repo `main` branch):
- `src/features/game/types/bumpkinSkills.ts` — skill catalogue
- `src/features/game/events/landExpansion/choseSkill.ts` — tier/point logic
- `src/features/game/lib/level.ts` — 200-level XP curve
- `src/features/game/types/chapters.ts` — seasons & tickets
- `src/features/game/events/landExpansion/deliver.ts` — delivery logic
- `src/features/game/events/landExpansion/sellBounty.ts` — bounty board
- `src/features/game/types/choreBoard.ts` — chore catalogue
- `src/features/game/events/landExpansion/completeNPCChore.ts` — chore rewards
- `src/features/game/lib/factions.ts` — factions, weeks, prizes, boosts
- `src/features/game/events/landExpansion/feedFactionPet.ts` — pet feeding
- `src/features/game/events/landExpansion/deliverFactionKitchen.ts` — kitchen
- `src/lib/i18n/dictionaries/en.json` — canonical numeric effect text
- `src/features/game/types/factionShop.ts` — faction shop item list
- `src/features/game/types/skills.ts` — legacy pre-revamp badges (reference only)

Raw URLs for scraping (prefix with
`https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/`).
