# Sunflower Land — Collectibles & Wearables Boost Research

Research compiled from the official sunflower-land GitHub repository (authoritative source for all numeric values). All values were extracted from game event handlers (`src/features/game/events/landExpansion/*.ts`), type definitions, and the in-game description dictionary (`src/lib/i18n/dictionaries/en.json`).

## Primary Sources
- Repository: https://github.com/sunflower-land/sunflower-land
- Boost description dictionary: https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/lib/i18n/dictionaries/en.json
- Crop harvest logic: https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/events/landExpansion/harvest.ts
- Wood chop logic: https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/events/landExpansion/chop.ts
- Stone mining logic: https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/events/landExpansion/stoneMine.ts
- Iron mining logic: https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/events/landExpansion/ironMine.ts
- Gold mining logic: https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/events/landExpansion/mineGold.ts
- Crimstone mining: https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/events/landExpansion/mineCrimstone.ts
- Fruit harvest logic: https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/events/landExpansion/fruitHarvested.ts
- Fruit planting logic: https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/events/landExpansion/fruitPlanted.ts
- Flower harvest logic: https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/events/landExpansion/harvestFlower.ts
- Cooking logic: https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/events/landExpansion/cook.ts
- Animal logic: https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/lib/animals.ts
- SFL/Food boost aggregator: https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/expansion/lib/boosts.ts

---

## TOPIC 1 — COLLECTIBLES (SFTs) BOOST EFFECTS

### 1.1 Crop Yield Boosters

| Collectible | Category | Effect (numeric) | AOE | Stacking notes |
|---|---|---|---|---|
| Basic Scarecrow | Crop growth time | -20% basic-crop growth time (-30% with Chonky Scarecrow skill) | 3x3 AOE below (7x7 with skill) | Applies only to "basic" crops (Sunflower, Potato, Pumpkin) |
| Scary Mike | Crop yield | +0.2 medium crops (+0.3 with skill) | 3x3 AOE (7x7 with skill) | Medium = Carrot, Cabbage, Soybean, Beetroot, Cauliflower, Parsnip |
| Laurie the Chuckle Crow | Crop yield | +0.2 advanced crops (+0.3 with skill) | 3x3 AOE (7x7 with skill) | Advanced = Eggplant, Corn, Radish, Wheat, Kale, Barley |
| Gnome | Crop yield | +10 to medium/advanced crops | AOE (requires placement on pedestal between Scary Mike & Laurie) | Additive with Scary Mike / Laurie |
| Sir Goldensnout | Crop yield | +0.5 to all plot crops | 4x4 AOE | Additive |
| Queen Cornelia | Crop yield | +1 Corn | AOE around it | Additive with Poppy |
| Kuebiko | Shop | Free seeds (all seeds free from shop) | Global | Still requires unlocking |
| Scarecrow (old) | Crop yield | +20% all crops | Global | Legacy item |
| Nancy | Crop growth time | -15% crop growth time | Global | Legacy/older item |
| Lunar Calendar | Crop growth time | -10% crop growth time | Global | Stacks multiplicatively with other time boosts |
| Peeled Potato | Potato | 20% chance for +1 Potato | Global | Additive with Potent Potato |
| Potent Potato | Potato | 3% chance of +10 Potato | Global | — |
| Stellar Sunflower | Sunflower | 3% chance of +10 Sunflower | Global | — |
| Radical Radish | Radish | 3% chance of +10 Radish | Global | — |
| Victoria Sisters | Pumpkin | +20% Pumpkin (x1.2) | Global | Stacks multiplicatively with Freya Fox/Lab Grown Pumpkin |
| Freya Fox | Pumpkin | +0.5 Pumpkin | Global | Additive |
| Lab Grown Pumpkin | Pumpkin | +0.3 Pumpkin | Global | Additive |
| Golden Cauliflower | Cauliflower | +100% Cauliflower (x2) | Global | — |
| Easter Bunny | Carrot | +20% Carrot (x1.2) | Global | — |
| Pablo The Bunny | Carrot | +0.1 Carrot | Global | Additive |
| Lab Grown Carrot | Carrot | +0.2 Carrot | Global | Additive |
| Cabbage Boy | Cabbage | +0.25 Cabbage (+0.5 if Cabbage Girl also placed) | Global | Disables Karkinos bonus |
| Cabbage Girl | Cabbage growth | -50% Cabbage plot growth time | Global | Also empowers Cabbage Boy |
| Karkinos | Cabbage | +0.1 Cabbage | Global | Disabled when Cabbage Boy is placed |
| Mysterious Parsnip | Parsnip growth | -50% Parsnip growth time | Global | — |
| Obie | Eggplant growth | -25% Eggplant growth time | Global | — |
| Purple Trail | Eggplant | +0.2 Eggplant | Global | Additive |
| Maximus | Eggplant | +1 Eggplant | Global | Additive |
| Poppy | Corn | +0.1 Corn | Global | Additive |
| Kernaldo | Corn growth | -25% Corn growth time | Global | — |
| Foliant | Kale | +0.2 Kale | Global | Additive |
| Hoot | Overnight crops | +0.5 Wheat, Radish, Kale, Rice, Barley | Global | Additive |
| Lab Grown Radish | Radish | +0.4 Radish | Global | Additive |
| Sheaf of Plenty | Barley | +2 Barley | Global | — |
| Giant Kale | Kale | +2 Kale | Global | — |
| Giant Yam | Yam | +0.5 Yam | Global | — |
| Giant Artichoke | Artichoke | +2 Artichoke | Global | — |
| Giant Onion | Onion | +3 Onion | Global | — |
| Giant Zucchini | Zucchini growth | -50% Zucchini growth time | Global | — |
| Giant Turnip | Turnip growth | -50% Turnip growth time | Global | — |
| Soybliss | Soybean | +1 Soybean | Global | — |
| Knowledge Crab | Fertilizer | Doubles Sprout Mix/Sproutroot Surprise effect (+0.2 → +0.4) | Global | Works only with sprout-mix fertilisers |
| Carrot Sword | Mutant crop | 4x chance of Mutant Crop | Global | — |
| Legendary Shrine | All resources | +1 crop/fruit/wood/stone/etc., -50% cooking time (temporary monument reward) | Global | Time-limited seasonal |

Sources: `en.json` boost strings and `src/features/game/events/landExpansion/harvest.ts`
https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/lib/i18n/dictionaries/en.json
https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/events/landExpansion/harvest.ts

### 1.2 Fruit Yield & Growth Boosters

| Collectible | Fruit | Effect | Notes |
|---|---|---|---|
| Immortal Pear | All fruit patches | +1 harvest per seed (+2 with "Pear Turbocharge" skill) | Works on every patch |
| Black Bearry | Blueberry | +1 Blueberry | Additive |
| Lady Bug | Apple | +0.25 Apple | Additive |
| Squirrel Monkey | Orange | -50% Orange growth time | Multiplier |
| Nana | Banana | -10% Banana growth time | Multiplier |
| Banana Chicken | Banana | +0.1 Banana | Additive |
| Tomato Bombard | Tomato | +1 Tomato | — |
| Tomato Clown | Tomato | -50% Tomato growth time | — |
| Cannonball | Tomato | -25% Tomato growth time | — |
| Lemon Shark | Lemon | +0.2 Lemon | — |
| Reveling Lemon | Lemon | +0.25 Lemon | — |
| Lemon Frog | Lemon | -25% Lemon growth time | — |
| Lemon Tea Bath | Lemon | -50% Lemon growth time | — |
| Vinny | Grape | +0.25 Grape | — |
| Grape Granny | Grape | +1 Grape | — |
| Macaw | All fruits | +0.1 yield (+0.2 with "Loyal Macaw" skill) | — |
| Fruit Tune Box | All fruits | -20% fruit patch growth time | — |
| Orchard Hourglass | All fruits | -25% fruit growth time | Temporary (timed) |
| Toucan Shrine | All fruits | -25% fruit growth time | Temporary event item |

Sources:
https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/events/landExpansion/fruitHarvested.ts
https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/events/landExpansion/fruitPlanted.ts

### 1.3 Wood Boosters

| Collectible | Effect | Notes |
|---|---|---|
| Woody the Beaver | +20% Wood | Disabled if Apprentice/Foreman Beaver placed |
| Apprentice Beaver | -50% Tree recovery time | Disabled if Foreman Beaver placed |
| Foreman Beaver | Chop trees without axes | Beavers do not stack; only the highest-tier applies |
| Wood Nymph Wendy | +0.2 Wood | Additive |
| Tiki Totem | +0.1 Wood | Additive (max 1 owned) |
| Squirrel | +0.1 Wood | Additive |
| Timber Hourglass | -25% tree recovery time (temporary, 4h buff) | Temporary |
| Super Totem / Time Warp Totem | -50% tree recovery time | Temporary 2h buff |

Sources:
https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/events/landExpansion/chop.ts

### 1.4 Stone Boosters

| Collectible | Effect | Notes |
|---|---|---|
| Tunnel Mole | +0.25 Stone | Additive |
| Stone Beetle | +0.1 Stone | Additive |
| Tin Turtle | +0.1 Stone | AOE 3x3 — only affects adjacent stones |
| Emerald Turtle | +0.5 Stone/Iron/Gold | AOE 3x3 |
| Rock Golem | 10% chance of +2 Stone | Additive |
| Ore Hourglass | -50% mineral recovery time | Temporary |
| Super Totem / Time Warp Totem | -50% recovery time | Temporary |
| Badger Shrine | -25% recovery time | Temporary |

### 1.5 Iron Boosters

| Collectible | Effect | Notes |
|---|---|---|
| Rocky the Mole | +0.25 Iron | Additive |
| Iron Idol | +1 Iron | Additive |
| Iron Beetle | +0.1 Iron | Additive |
| Radiant Ray | +0.1 Iron | Additive |
| Emerald Turtle | +0.5 (AOE 3x3) | Additive |
| Mole Shrine | -25% iron recovery time | Temporary |
| Ore Hourglass / Super Totem / Time Warp Totem | -50% recovery time | Temporary |

Source:
https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/events/landExpansion/ironMine.ts

### 1.6 Gold Boosters

| Collectible | Effect | Notes |
|---|---|---|
| Nugget | +0.25 Gold | Additive |
| Gold Beetle | +0.1 Gold | Additive |
| Gilded Swordfish | +0.1 Gold | Additive |
| Emerald Turtle | +0.5 (AOE 3x3) | — |
| Ore Hourglass / Super Totem / Time Warp Totem | -50% gold recovery time | Temporary |
| Mole Shrine | -25% gold recovery time | Temporary |

Source:
https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/events/landExpansion/mineGold.ts

### 1.7 Crimstone / Obsidian Boosters

| Collectible | Effect |
|---|---|
| Crimson Carp | +0.05 Crimstone |
| Crim Peckster | +0.1 Crimstone |
| Crimstone Clam | -10% Crimstone recovery time |
| Obsidian Turtle | +0.5 Obsidian |
| Volcano Gnome | +0.1 Minerals |

### 1.8 Animal / Egg / Milk / Wool / Leather Boosters

| Collectible | Effect |
|---|---|
| Chicken Coop | +1 Egg |
| Rich Chicken | +0.1 Egg |
| Fat Chicken | -10% chicken feed |
| Speed Chicken | -10% chicken sleep time (×0.9) |
| El Pollo Veloz | -2h chicken sleep time (fixed) |
| Ayam Cemani | +0.2 Egg |
| Squid Chicken | +0.1 Egg |
| Undead Rooster | +0.1 Egg |
| Rooster | 2x chance of Mutant Chicken |
| Janitor Chicken | -5% chicken sleep time (×0.95) |
| Gold Egg | Feed chickens for free |
| Bale | +0.1 Egg (+0.2 with "Double Bale" skill, AOE 3x3) |
| Alien Chicken | +0.1 Feather |
| Pharaoh Chicken | +1 daily Desert Dig attempt |
| Cluckulator | -25% chicken feed (×0.75) |
| Farm Dog | -25% Sheep sleep time (×0.75) |
| Mammoth | -25% Cow sleep time (×0.75) |
| Moo-ver | +0.25 Leather |
| Mootant | +0.1 Leather |
| Longhorn Cowfish | +0.2 Milk |
| Astronaut Sheep | +0.1 Wool |
| Toxic Tuft | +0.1 Merino Wool |
| Dr Cow | 5% less feeding cost for cows (×0.95) |
| Mermaid Sheep | -5% sheep feed (×0.95) |
| Golden Cow | Feed cows for free |
| Golden Sheep | Feed sheep for free |
| Barn Manager | +0.1 all animal produce |
| Bantam Shrine | Chickens ×0.75 sleep time (temporary) |
| Collie Shrine | Sheep/Cows ×0.75 sleep time (temporary) |
| Frozen Sheep / Frozen Cow | Cannot get sick in winter |
| Summer Chicken | Chickens cannot get sick in summer |
| Sleepy Chicken | Chickens cannot get sick in autumn |
| Nurse Sheep | Sheep cannot get sick in summer |

Source:
https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/lib/animals.ts

### 1.9 Honey / Beehive Boosters

| Collectible | Effect |
|---|---|
| Queen Bee | +1 Honey Production Speed |
| King of Bears | +0.25 Honey per full beehive |
| Beehive | 10% chance for +0.2 crop when beehive is full |
| Flower Fox | -10% Flower growth time |

### 1.10 Flower Boosters

| Collectible | Effect |
|---|---|
| Humming Bird | 20% chance for +1 Flower |
| Butterfly | 20% chance for +1 Flower |
| Desert Rose | 10% chance for +1 Flower |
| Chicory | 10% chance for +1 Flower |
| Hungry Caterpillar | Free Flower seeds |
| Moth Shrine | +1 Flower (critical hit; temporary) |

Source:
https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/events/landExpansion/harvestFlower.ts

### 1.11 Fishing Boosters

| Collectible | Effect |
|---|---|
| Reelmasters Chair | +5 daily fishing reels |
| Nautilus | +5 daily fishing reels |
| Anemone Flower | +1 Fishing minigame attempt |
| Heart of Davy Jones | +20 daily Desert Dig attempts (desert, not fishing) |
| Walrus | +1 Fish |
| Alba | 50% chance of +1 basic fish |
| Super Star | +1 Fish during Winter |
| Jellyfish | +1 Fish during Summer |
| Pink Dolphin | +1 Fish during Spring |
| Poseidon | +1 Fish during Autumn |
| Skill Shrimpy | +20% Bumpkin XP from Fish |
| Fishers Hourglass | 50% chance of +1 Fish (temporary) |

### 1.12 Cooking / Food XP Boosters (collectibles)

| Collectible | Effect |
|---|---|
| Observatory | +5% Bumpkin XP |
| Blossombeard | +10% Bumpkin XP |
| Grain Grinder | +20% Bumpkin XP from Cakes |
| Skill Shrimpy | +20% Bumpkin XP from Fish |
| Hungry Hare | Fermented Carrots 2x Bumpkin XP |
| Swiss Whiskers | +500 Bumpkin XP from Cheese recipes (flat) |
| Desert Gnome | -10% Cooking Time |
| Gourmet Hourglass | -50% Cooking Time (temporary) |
| Boar Shrine | -20% Cooking Time |
| Maneki Neko | 1 Free Food per Day |
| Genie Lamp | Grants 3 Wishes from the Wish list |

### 1.13 Greenhouse / Crop Machine / Compost

| Collectible | Effect |
|---|---|
| Turbo Sprout | -50% greenhouse growth time |
| Pharaoh Gnome | +2 Greenhouse produce |
| Groovy Gramophone | -50% Crop Machine growth time |
| Soil Krabby | -10% composter compost time |
| Turd Topper | +1 fertiliser from composters |
| Grinxs Hammer | Halves expansion costs |

### 1.14 Coins / Treasure / Delivery

| Collectible | Effect |
|---|---|
| Treasure Map | +20% coins treasure sale price |
| Warehouse | +20% market seed stock |
| Toolshed | +50% workbench tool stock |
| Meerkat | +5 daily Desert Digs |
| Heart of Davy Jones | +20 daily Desert Dig attempts |

### 1.15 Temporary "Totem" Items

| Collectible | Effect | Duration |
|---|---|---|
| Super Totem | -50% to crop/mineral/fruit/cooking/crafting/tree time | 2 hours (or longer with extended variants) |
| Time Warp Totem | -50% to crop/mineral/fruit/cooking/crafting/tree time | 2 hours |
| Harvest Hourglass | -25% crop growth time | Temporary |
| Timber Hourglass | -25% tree recovery time | 4 hours |
| Ore Hourglass | -50% mineral recovery time | Temporary |
| Orchard Hourglass | -25% fruit growth time | Temporary |
| Blossom Hourglass | -25% flower growth time | Temporary |
| Gourmet Hourglass | -50% cooking time | Temporary |
| Fishers Hourglass | 50% chance of +1 fish | Temporary |

---

## TOPIC 2 — WEARABLES (Bumpkin outfit) BOOST EFFECTS

All values sourced from:
https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/lib/i18n/dictionaries/en.json (`bumpkinItemBuff.*` keys)

### 2.1 Crop Wearables

| Wearable | Slot | Effect |
|---|---|---|
| Sunflower Amulet | Necklace | +10% Sunflower (x1.1) |
| Sunflower Shield | Secondary | Free Sunflower seeds |
| Parsnip (weapon) | Secondary | +20% Parsnip (x1.2) |
| Beetroot Amulet | Necklace | +20% Beetroot (x1.2) |
| Carrot Amulet | Necklace | -20% Carrot plot growth time |
| Green Amulet | Necklace | 10% chance of 10x crops |
| Eggplant Onesie | Body | +0.1 Eggplant |
| Corn Onesie | Body | +0.1 Corn |
| Corn Silk Hair | Hair | +2 Corn |
| Tofu Mask | Hat | +0.1 Soybean |
| Infernal Pitchfork | Secondary | +3 Crops |
| Mushroom Hat | Hat | +0.1 Wild Mushroom |
| Sickle | Secondary | +2 Wheat |
| Non La Hat | Hat | +1 Rice |
| Rice Panda (onesie) | Body | +0.25 Rice |
| Olive Shirt | Body | +0.25 Olive |
| Olive Shield | Secondary | +1 Olive |
| Oil Can | Secondary | +2 Oil |
| Broccoli Hat | Hat | -50% Broccoli plot growth time |
| Red Pepper Onesie | Body | -25% Red Pepper growth time |
| Blossom Ward | Secondary | +1 yield to spring plot crops in spring |
| Frozen Heart | Necklace | +1 yield to winter plot crops in winter |
| Solflare Aegis | Secondary | -50% plot crop time in summer |
| Autumn's Embrace | Necklace | -50% plot crop time in autumn |

### 2.2 Fruit Wearables

| Wearable | Effect |
|---|---|
| Fruit Picker Apron | +0.1 Apple, Blueberry, Orange, Banana |
| Camel Onesie | +0.1 Fruit Patch Yield (all fruits) |
| Banana Amulet | +0.5 Banana |
| Banana (onesie) | -20% Banana Growth Time |
| Lemon Shield | +1 Lemon |
| Grape Pants | +0.2 Grapes |

### 2.3 Wood Wearables

| Wearable | Effect |
|---|---|
| Lumberjack (shirt/outfit) | +10% wood drops (x1.1) |
| Discord Mod | x1.35 wood (note: source confirms coef in `chop.ts`) |

### 2.4 Mining Wearables (stone/iron/gold/crimstone)

| Wearable | Effect |
|---|---|
| Pickaxe Shark | -15% Gold recovery time; 10% chance gold recovers instantly |
| Crimstone Amulet | -20% Crimstone cooldown time |
| Crimstone Armor | +0.1 Crimstones |
| Crimstone Hammer | +2 Crimstones on 5th mine (final mine) |
| Crimstone Spikes Hair | Mine crimstone without Gold Pickaxes |
| Quarry | Mine stone without pickaxes |

### 2.5 Fishing Wearables

| Wearable | Effect |
|---|---|
| Angler Waders | +10 daily fishing reels |
| Saw Fish | +5 daily fishing reels; +1 Worm from Composting |
| Ancient Rod | Cast without consuming rod |
| Sunflower Rod | 10% chance of +1 Fish |
| Trident | 20% chance of +1 Fish |
| Bucket o' Worms | +1 Worm |
| Luminous Anglerfish Topper | +50% Bumpkin XP from Fish |
| Crab Hat | +1 treasure when fishing |

### 2.6 Animal / Bee Wearables

| Wearable | Effect |
|---|---|
| Cattlegrim | +0.25 Animal Produce (all produce types) |
| Milk Apron | +0.5 Milk |
| Cowbell Necklace | +2 Milk |
| Training Whistle | +1 Leather |
| Chicken Suit | +1 Feather |
| Black Sheep Onesie | +2 Wool |
| White Sheep Onesie | +0.25 Wool |
| Merino Jumper | +1 Merino Wool |
| Infernal Bullwhip | -50% feed to barn animals |
| Medic Apron | -50% medicine to heal animals |
| Oracle Syringe | Heal animals for free |
| Dream Scarf | -20% Sheep sleep time |
| Bee Suit | +0.1 Honey per full beehive |
| Honeycomb Shield | +1 Honey per full beehive |
| Beekeeper Hat | +0.2 Honey Production Speed |
| Hornet Mask | 2x base Bee Swarm chance |

### 2.7 Cooking Wearables

| Wearable | Effect |
|---|---|
| Chef Apron | +20% Cake Delivery Profit |
| Golden Spatula | +10% Bumpkin XP (food) |
| Pan | +25% Bumpkin XP |
| Luna's Hat | -50% Cooking Time |
| Master Chef's Cleaver (cleaverKnife) | -15% cooking time; 10% chance of +1 food from cooking |
| Luminous Anglerfish Topper | +50% Bumpkin XP from Fish |

### 2.8 Flower / Delivery / Faction Wearables

| Wearable | Effect |
|---|---|
| Flower Crown | -50% Flower growth time |
| Bumpkin Crown | +25% FLOWER & Coin deliveries; +10% Marks |
| Goblin Crown / Nightshade Crown / Sunflorian Crown | Same as Bumpkin Crown |
| Faction Armor (all 4) | +20% Marks |
| Faction Helmets | +10% Marks |
| Faction Swords/Axes | +10% Marks |
| Faction Pants / Sabatons | +5% Marks each |
| Faction Shield (e.g. Bumpkin Shield) | +0.25 Wood & Minerals |
| Faction Quiver | +0.25 Crops & Fruits |
| Faction Medallion | -25% Cooking time |

### 2.9 Oil / Desert / Misc

| Wearable | Effect |
|---|---|
| Oil Overalls | +10 Oil |
| Oil Gallon | +5 Oil |
| Infernal Drill | Drill oil without Oil Drill |
| Dev Wrench | -50% Oil regeneration time |
| Bionic Drill | +5 daily Desert Dig attempts |
| Ancient Shovel | Dig treasure without Sand Shovel |
| Deep Sea Helm | +100% chance to find Marvel Map pieces |
| Crab Trap | +1 Crab when digging or drilling |
| Ladybug Suit | -25% Onion seed coin cost |
| Cowboy Hat/Shirt/Trouser | +1 Horseshoes each |
| Angel Wings / Devil Wings | 30% chance of instant crops |
| Lava Swimwear | -50% lava pit resources |
| Obsidian Necklace | -50% lava pit time |

Wearable data sources:
https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/lib/i18n/dictionaries/en.json
https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/types/bumpkinItemBuffs.ts

---

## TOPIC 3 — BOOST STACKING RULES

Based on inspection of `harvest.ts`, `chop.ts`, mining event files, and the boost aggregator at `src/features/game/expansion/lib/boosts.ts`, Sunflower Land's boost stacking uses a consistent pattern:

### Core rule pattern (pseudocode for yield boosts)

```
amount = baseAmount;

// 1. ADDITIVE flat bonuses first
amount += 0.25;      // e.g., Nugget
amount += 0.1;       // e.g., Gold Beetle
amount += 1;         // e.g., Iron Idol
amount += aoeBonus;  // e.g., +0.5 from Emerald Turtle (only if within AOE)
amount += wearableFlatBonus;

// 2. MULTIPLICATIVE percentage boosts applied last
amount *= 1.2;       // Woody the Beaver (×1.2)
amount *= 1.1;       // Lumberjack (×1.1)
amount *= 1.35;      // Discord Mod (×1.35)
amount *= 1.1;       // Sunflower Amulet for sunflowers
amount *= 2;         // Golden Cauliflower etc.
```

### Growth / recovery time boosts
All time reductions are multiplicative with each other:
```
time = baseTime;
time *= 0.9;    // Lunar Calendar -10%
time *= 0.5;    // Time Warp Totem -50%
time *= 0.8;    // Turbofruit Mix -20%
```
Because each factor multiplies the remainder, stacking multiple -50% boosts does NOT drive time to zero (e.g., two -50% multipliers = final 25% of base, not 0%).

### Chance-based boosts (RNG)
- Each RNG boost rolls independently per harvest/mine event.
- Example: Peeled Potato (20% chance +1) + Potent Potato (3% chance +10) are two independent rolls and can both fire on the same harvest.
- Green Amulet (10% chance ×10) rolls independently.

### AOE (Area of Effect) rules
- Scarecrow AOE: 3x3 tiles below the scarecrow (7x7 with the "Chonky Scarecrow" skill). Confirmed in `en.json`: `description.basic.scarecrow.boost.aoe` vs `description.basic.scarecrow.boost.aoe.skill`.
- Scary Mike / Laurie the Chuckle Crow: 3x3 AOE below (7x7 with skill).
- Sir Goldensnout: 4x4 AOE around the collectible.
- Emerald Turtle / Tin Turtle: 3x3 AOE around the turtle, affects mineral nodes within.
- Queen Cornelia / Poppy / Bale: AOE around placed tile.
- Knight Chicken and similar "near an oil reserve" boosts only trigger within AOE.

### Mutually exclusive items
Several stacking exclusions are hard-coded:
- Beavers: `Woody the Beaver` is disabled if `Apprentice Beaver` or `Foreman Beaver` is placed. `Apprentice Beaver` is disabled if `Foreman Beaver` is placed (see en.json `description.woody.beaver.warning`, `description.apprentice.beaver.warning`).
- `Karkinos` is disabled when `Cabbage Boy` is placed (`description.Karkinos.warning`).
- Only one of each "core" scarecrow/chicken coop/etc. can be active at once.

### Per-resource caps
- Fishing reels: Daily cap is `baseLimit + Σ extraReels`. Each additive effect (Angler Waders +10, Reelmaster's Chair +5, Nautilus +5, Saw Fish +5, Fisherman skills +5/+10/+15, VIP +5) simply adds to the cap.
- Desert digs: similar additive rule (Pharaoh Chicken +1, Meerkat +5, Heart of Davy Jones +20, Bionic Drill +5).
- Time reductions are functionally capped by the multiplicative floor — they never go below a game-enforced minimum (instant growth only occurs through Angel/Devil Wings 30% chance).

### Order of operation summary
1. Base yield/time from recipe or resource node tier (Tier 2 = +0.5, Tier 3 = +2.5).
2. Flat additive bonuses from collectibles, wearables, skills, fertilisers, AOE items.
3. Critical-hit/RNG bonuses rolled independently.
4. Percentage multipliers applied last (each multiplier separately).
5. Temporary totem/hourglass time reductions applied via multiplier (×0.5, ×0.75, etc.).

Sources:
https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/events/landExpansion/harvest.ts
https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/events/landExpansion/chop.ts
https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/events/landExpansion/stoneMine.ts
https://raw.githubusercontent.com/sunflower-land/sunflower-land/main/src/features/game/expansion/lib/boosts.ts

---

## TOPIC 4 — BOOST ACQUISITION NOTES

Most collectibles and wearables in Sunflower Land come from:
- **Seasonal chapters**: Each season (Bull Run, Winds of Change, Pharaoh's Treasure, Clash of Factions, Dawn Breaker, Solar Flare, Witches' Eve, etc.) introduced a set of SFTs craftable at seasonal merchants.
- **Airdrops / Quests / Achievements**: One-time rewards (e.g. Potent Potato, Radical Radish, Stellar Sunflower were early airdrop rewards).
- **Mega Store**: Monthly shop rotating wearables and collectibles for SFL/coins.
- **Auctions**: Limited-supply high-boost SFTs (Kuebiko, Gold Egg, Immortal Pear historically).
- **Deliveries & Faction shops**: Wearables bought with Marks earned via faction pledges.
- **Crafting from ingredients**: Scarecrow family, beavers, basic collectibles crafted at Withered Warehouse / Crafting Box using crops+wood+stone.
- **Event drops**: Holiday-themed items (Christmas Festive Tree, Easter Bunny, Halloween decor).

Because seasonal merchants change, most higher-tier collectibles (Stellar Sunflower, Potent Potato, Radical Radish, Victoria Sisters, Immortal Pear, Gold Egg, El Pollo Veloz, etc.) are now only obtainable from secondary marketplaces (OpenSea etc.), not from crafting.

---

## APPENDIX — Quick Reference Boost List (from `en.json` direct strings)

The following is a direct machine-readable list of every `*.boost` entry found in the canonical English dictionary. These are the exact strings shown to players in-game:

| Key | Player-visible text |
|---|---|
| description.basic.scarecrow.boost | -20% Basic Crops Growth Time (Area of Effect 3x3 below) |
| description.basic.scarecrow.boost.skill | -30% Basic Crops Growth Time (Area of Effect 7x7 below) |
| description.scary.mike.boost | +0.2 Medium Crops (3x3 AOE) |
| description.scary.mike.boost.skill | +0.3 Medium Crops (7x7 AOE) |
| description.laurie.chuckle.crow.boost | +0.2 Advanced Crops (3x3 AOE) |
| description.laurie.chuckle.crow.boost.skill | +0.3 Advanced Crops (7x7 AOE) |
| description.gnome.boost | +10 yield to medium/advanced crops |
| description.sir.goldensnout.boost | +0.5 crop yield |
| description.queen.cornelia.boost | +1 Corn |
| description.scarecrow.boost | +20% Crop Yield |
| description.kuebiko.boost | Free Seeds |
| description.nancy.boost | -15% Crop Growth Time |
| description.lunar.calendar.boost | -10% Crop Growth Time |
| description.peeled.potato.boost | 20% Chance for +1 Potato |
| description.potent.potato.boost | 3% Chance of +10 Potato |
| description.stellar.sunflower.boost | 3% Chance of +10 Sunflower |
| description.radical.radish.boost | 3% Chance of +10 Radish |
| description.victoria.sisters.boost | +20% Pumpkin |
| description.freya.fox.boost | +0.5 Pumpkin |
| description.lg.pumpkin.boost | +0.3 Pumpkin |
| description.golden.cauliflower.boost | +100% Cauliflower |
| description.easter.bunny.boost | +20% Carrot |
| description.pablo.bunny.boost | +0.1 Carrot |
| description.lg.carrot.boost | +0.2 Carrot |
| description.mysterious.parsnip.boost | -50% Parsnip Growth Time |
| description.cabbage.boy.boost | +0.25 Cabbage |
| description.cabbage.boy.boost.boosted | +0.5 Cabbage (Cabbage Girl boost) |
| description.cabbage.girl.boost | -50% Cabbage Plot Growth Time |
| description.Karkinos.boost | +0.1 Cabbage |
| description.obie.boost | -25% Eggplant Growth Time |
| description.purple.trail.boost | +0.2 Eggplant |
| description.maximus.boost | +1 Eggplant |
| description.poppy.boost | +0.1 Corn |
| description.kernaldo.boost | -25% Corn Growth Time |
| description.foliant.boost | +0.2 Kale |
| description.hoot.boost | +0.5 Wheat, Radish, Kale, Rice, Barley |
| description.lg.radish.boost | +0.4 Radish |
| description.soybliss.boost | +1 Soybean |
| description.sheafOfPlenty.boost | +2 Barley |
| description.giantKale.boost | +2 Kale |
| description.giantYam.boost | +0.5 Yams |
| description.giantArtichoke.boost | +2 Artichokes |
| description.giantOnion.boost | +3 Onions |
| description.giantZucchini.boost | -50% Zucchini Plot Growth Time |
| description.giantTurnip.boost | -50% Turnip Growth Time |
| description.carrot.sword.boost | 4x Chance of Mutant Crop |
| description.immortal.pear.boost | +1 Fruit Patch Harvest per seed |
| description.immortal.pear.boosted.boost | +2 Fruit Patch Harvest per seed |
| description.black.bearry.boost | +1 Blueberry |
| description.lady.bug.boost | +0.25 Apple |
| description.squirrel.monkey.boost | -50% Orange Growth Time |
| description.nana.boost | -10% Banana Growth Time |
| description.banana.chicken.boost | +0.1 Banana |
| description.tomato.bombard.boost | +1 Tomato |
| description.tomato.clown.boost | -50% Tomato Growth Time |
| description.cannonball.boost | -25% Tomato Growth Time |
| description.lemon.shark.boost | +0.2 Lemons |
| description.lemon.tea.bath.boost | -50% Lemon Growth Time |
| description.lemon.frog.boost | -25% Lemon Growth Time |
| description.reveling.lemon.boost | +0.25 Lemon |
| description.vinny.boost | +0.25 Grape |
| description.grape.granny.boost | +1 Grape |
| description.macaw.boost | +0.1 Fruit Patch Yield |
| description.macaw.boosted.boost | +0.2 Fruit Patch Yield |
| description.fruitTuneBox.boost | -20% Fruit Patch Growth Time |
| description.woody.beaver.boost | +20% Wood |
| description.apprentice.beaver.boost | -50% Tree Recovery Time |
| description.foreman.beaver.boost | Chop Trees without Axes |
| description.wood.nymph.wendy.boost | +0.2 Wood |
| description.tiki.totem.boost | +0.1 Wood |
| description.squirrel.boost | +0.1 Wood |
| description.tunnel.mole.boost | +0.25 Stone |
| description.stone.beetle.boost | +0.1 Stone |
| description.tin.turtle.boost | +0.1 Stone |
| description.emerald.turtle.boost | +0.5 Stone, Iron, Gold (AOE 3x3) |
| description.rock.golem.boost | 10% Chance of +2 Stone |
| description.rocky.mole.boost | +0.25 Iron |
| description.iron.idol.boost | +1 Iron |
| description.iron.beetle.boost | +0.1 Iron |
| description.radiant.ray.boost | +0.1 Iron |
| description.nugget.boost | +0.25 Gold |
| description.gold.beetle.boost | +0.1 Gold |
| description.boost.gilded.swordfish | +0.1 Gold |
| description.volcanoGnome.boost | +0.1 Minerals |
| description.obsidianTurtle.boost | +0.5 Obsidian |
| description.crimson.carp.boost | +0.05 Crimstone |
| description.crim.peckster.boost | +0.1 Crimstone |
| description.crimstoneClam.boost | -10% Crimstone recovery time |
| description.battle.fish.boost | +0.05 Oil |
| description.knight.chicken.boost | +0.1 Oil |
| description.rich.chicken.boost | +0.1 Egg |
| description.fat.chicken.boost | -10% Feed to Chicken |
| description.speed.chicken.boost | -10% Chicken Sleep Time |
| description.el.pollo.veloz.boost | -2h Chicken Sleep Time |
| description.ayam.cemani.boost | +0.2 Egg |
| description.squidChicken.boost | +0.1 Egg |
| description.undead.rooster.boost | +0.1 Egg |
| description.rooster.boost | 2x Chance of Mutant Chicken |
| description.chicken.coop.boost | +1 Egg |
| description.gold.egg.boost | Feed Chickens for free |
| description.janitorChicken.boost | -5% chicken sleep time |
| description.alien.chicken.boost | +0.1 Feathers |
| description.pharaoh.chicken.boost | +1 daily Desert Dig attempt |
| description.farm.dog.boost | -25% Sheep Sleep Time |
| description.mammoth.boost | -25% Cow Sleep Time |
| description.dreamScarf.boost | -20% Sheep Sleep Time |
| description.cluckulator.boost | -25% Feed to Chicken |
| description.longhorn.cowfish.boost | +0.2 Milk |
| description.drCow.boost | 5% less feeding cost for cows |
| description.mermaidSheep.boost | -5% Sheep Feed |
| description.astronautSheep.boost | +0.1 Wool |
| description.toxic.tuft.boost | +0.1 Merino Wool |
| description.mootant.boost | +0.1 Leather |
| description.mooVer.boost | +0.25 Leather |
| description.babyCow.boost | +10 cow xp from animal affection tools |
| description.salt.lick.boost | +5% Animal Produce Yield |
| description.honey.treat.boost | -25% Animal Feed |
| description.golden.cow.boost | Feed cows for free |
| description.goldenSheep.boost | Feed Sheeps for free |
| description.sleepyChicken.boost | Chickens cannot get sick during autumn |
| description.summer.chicken.boost | Chickens cannot get sick during summer |
| description.frozen.sheep.boost | Sheep cannot get sick during winter |
| description.frozen.cow.boost | Cows cannot get sick during winter |
| description.nurseSheep.boost | Sheep cannot get sick during summer |
| description.queen.bee.boost | +1 Honey Production Speed |
| description.kingOfBears.boost | +0.25 Honey per Full Beehive |
| description.beehive.boost | 10% Chance for +0.2 Crop when Beehive is full |
| description.flower.fox.boost | -10% Flower Growth Time |
| description.humming.bird.boost | 20% Chance for +1 Flower |
| description.butterfly.boost | 20% chance of +1 flower |
| description.desert.rose.boost | 10% Chance for +1 Flower |
| description.chicory.boost | 10% Chance for +1 Flower |
| description.hungry.caterpillar.boost | Free Flower Seeds |
| description.reelmastersChair.boost | +5 daily fishing reels |
| description.nautilus.boost | +5 daily fishing reels |
| description.anemoneFlower.boost | +1 Fishing minigame attempt |
| description.walrus.boost | +1 Fish |
| description.super.star.boost | +1 Fish during Winter |
| description.jellyfish.boost | +1 Fish during Summer |
| description.pinkDolphin.boost | +1 Fish during Spring |
| description.poseidon.boost | +1 Fish during Autumn |
| description.alba.boost | 50% Chance of +1 Basic Fish |
| description.skill.shrimpy.boost | +20% Bumpkin XP from Fish |
| description.fishers.hourglass.boost | 50% Chance of +1 Fish |
| description.observatory.boost | +5% Bumpkin XP |
| description.blossombeard.boost | +10% Bumpkin XP |
| description.grain.grinder.boost | +20% Bumpkin XP from Cakes |
| description.hungryHare.boost | Fermented Carrots 2x Bumpkin XP |
| description.swissWhiskers.boost | +500 Bumpkin XP from Cheese Recipes |
| description.desertgnome.boost | -10% Cooking Time |
| description.gourmet.hourglass.boost | -50% Cooking Time |
| description.maneki.neko.boost | 1 Free Food per Day |
| description.genie.lamp.boost | Grants 3 Wishes from the Wish list |
| description.turbo.sprout.boost | -50% Growth Time in Greenhouse |
| description.pharaoh.gnome.boost | +2 Greenhouse Produce |
| description.groovy.gramophone.boost | -50% Growth Time in Crop Machine |
| description.soil.krabby.boost | -10% Composter Compost Time |
| description.turdTopper.boost | +1 Fertiliser from Composters |
| description.grinxs.hammer.boost | Halves expansion costs |
| description.heart.of.davy.jones.boost | +20 daily Desert Dig attempts |
| description.meerkat.boost | +5 daily Desert Digs attempts |
| description.treasure.map.boost | +20% Coins Treasure Sale Price |
| description.warehouse.boost | +20% market seed stock |
| description.toolshed.boost | +50% workbench tool stock |
| description.time.warp.totem.boost | 50% Reduction to Crop, Mineral, Fruit, Cooking, Crafting, Tree Time (2h) |
| description.superTotem.boost | 50% Reduction (same as Time Warp Totem) |
| description.harvest.hourglass.boost | -25% Crop Growth Time |
| description.timber.hourglass.boost | -25% Tree Recovery Time (4hrs) |
| description.ore.hourglass.boost | -50% Mineral Recovery Time |
| description.orchard.hourglass.boost | -25% Fruit Growth Time |
| description.blossom.hourglass.boost | -25% Flower Growth Time |
| description.oracleSyringe.boost | Heal animals for free |
| description.quarry.boost | Mine stone without pickaxes |
| description.sprout.mix.boost | +0.2 Crop Plot Yield |
| description.fruitful.blend.boost | +0.1 Fruit Patch Yield |
| description.rapid.root.boost | -50% Crop Plot Growth Time |
| description.sproutroot.surprise.boost | +0.2 Crop Plot Yield |
| description.turbofruit.mix.boost | -20% Fruit Patch Growth Time |
| description.greenhouse.glow.boost | -20% Greenhouse Pot Growth Time |
| description.greenhouse.goodie.boost | +0.2 Greenhouse Produce Yield |

---

## Wearable Reference (from `bumpkinItemBuff.*`)

| Key | Player-visible text |
|---|---|
| bumpkinItemBuff.sunflower.amulet.boost | +10% Sunflower |
| bumpkinItemBuff.sunflower.shield.boost | Free Sunflower Seeds |
| bumpkinItemBuff.parsnip.boost | +20% Parsnip |
| bumpkinItemBuff.carrot.amulet.boost | -20% Carrot Plot Growth time |
| bumpkinItemBuff.beetroot.amulet.boost | +20% Beetroot |
| bumpkinItemBuff.green.amulet.boost | 10% Chance 10x Crops |
| bumpkinItemBuff.Luna.s.hat.boost | -50% Cooking Time |
| bumpkinItemBuff.infernal.pitchfork.boost | +3 Crops |
| bumpkinItemBuff.cattlegrim.boost | +0.25 Animal Produce |
| bumpkinItemBuff.eggplant.onesie.boost | +0.1 Eggplant |
| bumpkinItemBuff.corn.onesie.boost | +0.1 Corn |
| bumpkinItemBuff.mushroom.hat.boost | +0.1 Wild Mushroom |
| bumpkinItemBuff.chef.apron.boost | +20% Cake Delivery Profit |
| bumpkinItemBuff.fruit.picker.apron.boost | +0.1 Apple, Blueberry, Orange, Banana |
| bumpkinItemBuff.angel.wings.boost | 30% Chance of Instant Crops |
| bumpkinItemBuff.devil.wings.boost | 30% Chance of Instant Crops |
| bumpkinItemBuff.golden.spatula.boost | +10% Bumpkin XP |
| bumpkinItemBuff.sunflower.rod.boost | 10% Chance +1 Fish |
| bumpkinItemBuff.trident.boost | 20% Chance +1 Fish |
| bumpkinItemBuff.bucket.o.worms.boost | +1 Worm |
| bumpkinItemBuff.luminous.anglerfish.topper.boost | +50% Bumpkin XP from Fish |
| bumpkinItemBuff.angler.waders.boost | +10 daily fishing reels |
| bumpkinItemBuff.ancient.rod.boost | Cast without rod |
| bumpkinItemBuff.banana.amulet.boost | +0.5 Bananas |
| bumpkinItemBuff.banana.boost | -20% Banana Growth Time |
| bumpkinItemBuff.bee.suit | +0.1 Honey per Full Beehive |
| bumpkinItemBuff.honeycomb.shield | +1 Honey per Full Beehive |
| bumpkinItemBuff.hornet.mask | 2x base Bee Swarm chance |
| bumpkinItemBuff.flower.crown | -50% Flower Growth Time |
| bumpkinItemBuff.crimstone.hammer | +2 Crimstones on 5th mine |
| bumpkinItemBuff.crimstone.amulet | -20% Crimstone Cooldown Time |
| bumpkinItemBuff.crimstone.armor | +0.1 Crimstones |
| bumpkinItemBuff.lemon.shield.boost | +1 Lemon |
| bumpkinItemBuff.grape.pants | +0.2 Grapes |
| bumpkinItemBuff.crab.trap | +1 Crab when digging or drilling |
| bumpkinItemBuff.bionic.drill | +5 daily Desert Dig attempts |
| bumpkinItemBuff.infernal.drill.boost | Drill Oil without Oil Drill |
| bumpkinItemBuff.ancient.shovel.boost | Dig treasure without Sand Shovel |
| bumpkinItemBuff.dev.wrench.boost | -50% Oil Regeneration Time |
| bumpkinItemBuff.oil.overalls.boost | +10 Oil |
| bumpkinItemBuff.oil.gallon.boost | +5 Oil |
| bumpkinItemBuff.deep.sea.helm | +100% chance to find Marvel Map Pieces |
| bumpkinItemBuff.lava.swimwear.boost | -50% Lava Pit resources |
| bumpkinItemBuff.pirate.potion | Unlock Pirate Chest |
| bumpkinItemBuff.bumpkin.crown.boost | +25% FLOWER & Coin Deliveries |
| bumpkinItemBuff.bumpkin.crown.boost.two | +10% Marks |
| bumpkinItemBuff.*.armor | +20% Marks |
| bumpkinItemBuff.*.helmet | +10% Marks |
| bumpkinItemBuff.*.sword/axe | +10% Marks |
| bumpkinItemBuff.*.pants / .sabatons | +5% Marks |
| bumpkinItemBuff.*.shield.boost | +0.25 Wood & Minerals |
| bumpkinItemBuff.*.quiver.boost | +0.25 Crops & Fruits |
| bumpkinItemBuff.*.medallion.boost | -25% Cooking Time |
| description.lumberjack | Trees drop 10% more (wearable) |
| description.pickaxeShark.boost.1 | -15% Gold Recovery Time |
| description.pickaxeShark.boost.2 | 10% chance for gold to recover instantly |
| description.sawFish.boost.one | +5 daily fishing reels |
| description.sawFish.boost.two | +1 Worm from Composting |
| description.cleaverKnife.boost.1 | -15% Cooking Time |
| description.cleaverKnife.boost.2 | 10% chance of +1 Food from cooking |
| description.crabHat.boost | +1 treasure when fishing |
| description.medicApron.boost | -50% Medicine to heal animals |
| description.infernalBullwhip.boost | -50% Feed to Barn Animal |
| description.milkApron.boost | +0.5 Milk |
| description.cowbellNecklace.boost | +2 Milk |
| description.chickenSuit.boost | +1 Feather |
| description.blackSheepOnesie.boost | +2 Wool |
| description.whiteSheepOnesie.boost | +0.25 Wool |
| description.merinoJumper.boost | +1 Merino Wool |
| description.trainingWhistle.boost | +1 Leather |
| description.dreamScarf.boost | -20% Sheep Sleep Time |
| description.beekeeper.hat.boost | +0.2 Honey Production Speed |
| description.pan.boost | +25% Bumpkin XP |
| description.ladybugSuit.boost | -25% Onion Seed Coin cost |
| description.cornSilkHair.boost | +2 Corn |
| description.non.la.hat.boost | +1 Rice |
| description.rice.panda.boost | +0.25 Rice |
| description.olive.shield.boost | +1 Olive |
| description.olive.shirt.boost | +0.25 Olive |
| description.tofu.mask.boost | +0.1 Soybean |
| description.oil.can.boost | +2 Oil |
| description.sickle.boost | +2 Wheat |
| description.broccoliHat.boost | -50% Broccoli Plot Growth Time |
| description.redPepperOnesie.boost | -25% Red Pepper Growth Time |
| description.blossomWard.boost | +1 Yield to Spring Plot Crop in Spring |
| description.frozenHeart.boost | +1 Yield to Winter Plot Crop in Winter |
| description.solflareAegis.boost | -50% Plot Crop Time in Summer |
| description.autumnsEmbrace.boost | -50% Plot Crop Time in Autumn |
| description.cowboyHat.boost | +1 Horseshoes |
| description.cowboyShirt.boost | +1 Horseshoes |
| description.cowboyTrouser.boost | +1 Horseshoes |
| description.obsidianNecklace.boost | -50% Lava Pit Time |

---

End of research document.
