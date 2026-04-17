# Sunflower Land - Economy, Shop & Trading Research

Research compiled from the `sunflower-land/sunflower-land` GitHub repository (main branch).
All numbers reflect the source code constants at time of research (2026-04-11).

Primary source roots:
- https://github.com/sunflower-land/sunflower-land/tree/main/src/features/game/types
- https://github.com/sunflower-land/sunflower-land/tree/main/src/features/game/events/landExpansion
- https://github.com/sunflower-land/sunflower-land/tree/main/src/features/game/lib
- https://github.com/sunflower-land/sunflower-land/tree/main/src/features/marketplace

---

## TOPIC 1: Market / Shop Prices (Coins)

### 1.1 Crop Seeds - Buy price (coins) & Crop Sell price (coins)
Source: `src/features/game/types/crops.ts`

| Crop | Seed Buy (coins) | Crop Sell (coins) | Bumpkin Level | Grow time |
|---|---|---|---|---|
| Sunflower | 0.01 | 0.02 | 1 | 1 min |
| Potato | 0.1 | 0.14 | 1 | 5 min |
| Rhubarb | 0.15 | 0.24 | 1 | 10 min |
| Pumpkin | 0.2 | 0.4 | 2 | 30 min |
| Zucchini | 0.2 | 0.4 | 2 | 30 min |
| Carrot | 0.5 | 0.8 | 2 | 60 min |
| Yam | 0.5 | 0.8 | 2 | 60 min |
| Cabbage | 1 | 1.5 | 3 | 2 h |
| Broccoli | 1 | 1.5 | 3 | 2 h |
| Soybean | 1.5 | 2.3 | 3 | 3 h |
| Beetroot | 2 | 2.8 | 3 | 4 h |
| Pepper | 2 | 3 | 3 | 4 h |
| Cauliflower | 3 | 4.25 | 4 | 8 h |
| Parsnip | 5 | 6.5 | 4 | 12 h |
| Eggplant | 6 | 8 | 5 | 16 h |
| Corn | 7 | 9 | 5 | 20 h |
| Onion | 7 | 10 | 5 | 20 h |
| Radish | 7 | 9.5 | 5 | 24 h |
| Wheat | 5 | 7 | 5 | 24 h |
| Turnip | 5 | 8 | 6 | 24 h |
| Kale | 7 | 10 | 7 | 36 h |
| Artichoke | 7 | 12 | 8 | 36 h |
| Barley | 10 | 12 | 14 | 48 h |

### 1.2 Patch Fruit Seeds & Sell
Source: `src/features/game/types/fruits.ts`

| Fruit | Seed Buy (coins) | Sell (coins) | Level | Grow time |
|---|---|---|---|---|
| Tomato | 5 | 2 | 13 | 2 h |
| Lemon | 15 | 6 | 12 | 4 h |
| Blueberry | 30 | 12 | 13 | 6 h |
| Orange | 50 | 18 | 14 | 8 h |
| Apple | 70 | 25 | 15 | 12 h |
| Banana | 70 | 25 | 16 | 12 h |
| Celestine (Full Moon) | 300 | 200 | 12 | 6 h |
| Lunara (Full Moon) | 750 | 500 | 12 | 12 h |
| Duskberry (Full Moon) | 1250 | 1000 | 12 | 24 h |

### 1.3 Greenhouse
Source: `src/features/game/types/crops.ts`, `src/features/game/types/fruits.ts`

| Item | Seed Buy | Sell | Level | Grow time |
|---|---|---|---|---|
| Rice | 240 | 320 | 40 | 32 h |
| Olive | 320 | 400 | 40 | 44 h |
| Grape | 160 | 240 | 40 | 12 h |

### 1.4 Flower Seeds
Source: `src/features/game/types/flowers.ts`

| Flower Seed | Buy (coins) | Level | Grow time |
|---|---|---|---|
| Sunpetal Seed | 16 | 13 | 1 day |
| Bloom Seed | 32 | 22 | 2 days |
| Lily Seed | 48 | 27 | 5 days |
| Edelweiss Seed | 96 | 35 | 3 days |
| Gladiolus Seed | 96 | 35 | 3 days |
| Lavender Seed | 96 | 35 | 3 days |
| Clover Seed | 96 | 35 | 3 days |

Flowers themselves do not have a coin `sellPrice`; they are used for deliveries, crafting,
bouquets, and marketplace trades.

### 1.5 Exotic Crops (Magic Bean drops - not bought)
Source: `src/features/game/types/beans.ts`

| Exotic | Sell (coins) |
|---|---|
| Black Magic | 32000 |
| Golden Helios | 16000 |
| Chiogga | 8000 |
| Purple Cauliflower | 3200 |
| Adirondack Potato | 2400 |
| Warty Goblin Pumpkin | 1600 |
| White Carrot | 800 |
| Giant Orange | 800 |
| Giant Apple | 2000 |
| Giant Banana | 5000 |

### 1.6 Workbench Tools (Buy Prices)
Source: `src/features/game/types/tools.ts`

| Tool | Coin Price | Ingredients | Stock (weekly) | Type |
|---|---|---|---|---|
| Axe | 20 | - | 200 | land |
| Pickaxe | 20 | 3 Wood | 60 | land |
| Stone Pickaxe | 20 | 3 Wood, 5 Stone | 20 | land |
| Iron Pickaxe | 80 | 3 Wood, 5 Iron | 5 | land |
| Gold Pickaxe | 100 | 3 Wood, 3 Gold | 5 | land |
| Rod | 20 | 3 Wood, 1 Stone | 50 | water |
| Oil Drill | 100 | 20 Wood, 9 Iron, 10 Leather | 5 | land (desert) |
| Pest Net (disabled) | 50 | 2 Wool | 10 | land |
| Crab Pot | 250 | 5 Feather, 3 Wool | 15 | water |
| Mariner Pot | 500 | 10 Feather, 10 Merino Wool | 10 | water |
| Salt Rake | 20 | 3 Wood | 24 | water |

Treasure Tools (no stock cap, bought at Sand Shop):

| Tool | Coin Price | Ingredients |
|---|---|---|
| Sand Shovel | 20 | 2 Wood, 1 Stone |
| Sand Drill | 40 | 1 Oil, 1 Crimstone, 3 Wood, 1 Leather |

Love-animal Tools:

| Tool | Coin Price |
|---|---|
| Petting Hand | 0 |
| Brush | 2000 |
| Music Box | 50000 |

### 1.7 Animals (Buy Price, Coins)
Source: `src/features/game/types/animals.ts`

| Animal | Coin Buy | Level | Building |
|---|---|---|---|
| Chicken | 50 | 6 | Hen House |
| Cow | 100 | 14 | Barn |
| Sheep | 120 | 18 | Barn |

### 1.8 Animal Produce - Sell Prices
Source: `src/features/game/events/landExpansion/sellCrop.ts`, `src/features/game/events/landExpansion/sellAnimal.ts`, `src/features/game/types/consumables.ts`, `src/features/game/actions/sellMarketResource.ts`

**Important finding**: in the current Sunflower Land code there is **no fixed coin `sellPrice`**
for raw animal produce (Egg, Feather, Milk, Leather, Wool, Merino Wool, Honey) or for hard
resources (Wood, Stone, Iron, Gold, Crimstone, Sunstone, Oil). These items are **not sold at
the Market NPC**. They are monetized through two paths:

1. **Dynamic Goblin Market / Trade API** (`src/features/game/actions/sellMarketResource.ts`)
   - Resources are sold at server-determined prices via `POST /market/:farmId`.
   - Supported items: Sunflower, Potato, Pumpkin, Carrot, Cabbage, Soybean, Beetroot,
     Cauliflower, Parsnip, Eggplant, Corn, Radish, Wheat, Kale, Barley, Grape, Rice, Olive,
     Tomato, Lemon, Blueberry, Orange, Apple, Banana, **Wood, Stone, Iron, Gold, Crimstone,
     Honey, Egg, Feather, Leather, Milk, Wool, Merino Wool**.
   - Prices update dynamically on the server side and are fetched via `getMarketPrices.ts`.

2. **P2P Marketplace** (SFL/FLOWER listings & offers) - see Topic 4.

Sunstone and Oil are **not sold** via the market API and are not tradeable P2P - they are
consumed in-game (Sunstone buys new resource nodes, Oil fuels Oil Drill / Crop Machine).

### 1.9 Cooked Food (sellPrice in coins)
Source: `src/features/game/types/craftables.ts` (CAKES)

| Cake | Sell (coins) |
|---|---|
| Sunflower Cake | 320 |
| Potato Cake | 320 |
| Pumpkin Cake | 320 |
| Carrot Cake | 360 |
| Cabbage Cake | 360 |
| Beetroot Cake | 560 |
| Cauliflower Cake | 560 |
| Parsnip Cake | 560 |
| Radish Cake | 560 |
| Wheat Cake | 560 |

### 1.10 Resource Nodes bought with Sunstone (not coins)
Source: `src/features/game/events/landExpansion/buyResource.ts`

Sunstone is consumed (not earned) to unlock additional resource nodes. Price = base + (bought * increase).

| Node | Base Sunstone | Increase/node | Island |
|---|---|---|---|
| Crop Plot | 3 | 2 | basic |
| Tree | 4 | 3 | basic |
| Stone Rock | 4 | 3 | basic |
| Fruit Patch | 5 | 5 | spring |
| Iron Rock | 7 | 5 | basic |
| Gold Rock | 10 | 6 | basic |
| Crimstone Rock | 20 | 20 | spring |
| Flower Bed (+ Beehive) | 30 | 25 | spring |
| Oil Reserve | 40 | 20 | desert |
| Lava Pit | 40 | 40 | volcano |

---

## TOPIC 2: Weekly / Initial Shop Stock Limits

Source: `src/features/game/lib/constants.ts` (`INITIAL_STOCK`)
Source: `src/features/game/events/landExpansion/shipmentRestocked.ts` (`SHIPMENT_STOCK`)
Source: `src/features/game/events/landExpansion/restock.ts` (gem-based restock)

Sunflower Land uses **per-period stock** that depletes as players buy items. Stock is refreshed through three mechanisms:

1. **Daily shipment** (once per UTC day, free) - adds a partial amount per item (capped at initial).
2. **Gem restock** (spend gems, instant full restock) - 1 Block Buck = 20 Gems per restock.
3. **NPC restock** - limited NPC-driven partial restocks.

### 2.1 Seed Initial Stock (cap per cycle)

| Seed | Initial Stock | Daily Shipment |
|---|---|---|
| Sunflower Seed | 800 | 100 |
| Potato Seed | 400 | 50 |
| Rhubarb Seed | 400 | 50 |
| Zucchini Seed | 400 | 30 |
| Pumpkin Seed | 300 | 30 |
| Carrot Seed | 200 | 20 |
| Cabbage Seed | 180 | 20 |
| Yam Seed | 180 | 20 |
| Soybean Seed | 180 | 20 |
| Broccoli Seed | 180 | 20 |
| Beetroot Seed | 160 | 20 |
| Pepper Seed | 160 | 20 |
| Cauliflower Seed | 160 | 20 |
| Parsnip Seed | 120 | 10 |
| Eggplant Seed | 100 | - |
| Corn Seed | 100 | - |
| Onion Seed | 100 | - |
| Turnip Seed | 80 | - |
| Radish Seed | 80 | - |
| Wheat Seed | 80 | - |
| Kale Seed | 60 | - |
| Artichoke Seed | 60 | - |
| Barley Seed | 60 | - |
| Grape Seed | 10 | - |
| Olive Seed | 10 | - |
| Rice Seed | 10 | - |
| Tomato Seed | 20 | - |
| Lemon Seed | 20 | - |
| Blueberry Seed | 20 | - |
| Orange Seed | 20 | - |
| Apple Seed | 20 | - |
| Banana Plant | 20 | - |
| Sunpetal Seed | 16 | - |
| Bloom Seed | 8 | - |
| Lily Seed | 4 | - |
| Edelweiss Seed | 4 | - |
| Gladiolus Seed | 4 | - |
| Lavender Seed | 4 | - |
| Clover Seed | 4 | - |
| Duskberry / Lunara / Celestine Seed | 0 (not for sale; dropped) | - |

### 2.2 Tool Initial Stock

| Tool | Initial Stock | Daily Shipment |
|---|---|---|
| Axe | 200 | 50 |
| Pickaxe | 60 | 15 |
| Stone Pickaxe | 20 | 5 |
| Iron Pickaxe | 5 | 1 |
| Gold Pickaxe | 5 | - |
| Rod | 50 | 10 |
| Oil Drill | 5 | - |
| Pest Net | 10 (disabled) | - |
| Crab Pot | 15 | - |
| Mariner Pot | 10 | - |
| Salt Rake | 24 | - |
| Sand Shovel | 50 | 5 |
| Sand Drill | 10 | - |

### 2.3 Stock Modifiers (Buildings & Skills)

- **Toolshed** (building ready): +50% to all tool stock (ceil).
- **Warehouse** (building ready): +20% to all seed stock (ceil).
- **"More Axes"** skill: +50 Axe stock.
- **"More Picks"** skill: +70 Pickaxe / +20 Stone Pickaxe / +7 Iron Pickaxe / +2 Gold Pickaxe.
- **"Crime Fruit"** skill: +10 Tomato Seed / +10 Lemon Seed.

### 2.4 Seed Inventory Caps

Source: `INVENTORY_LIMIT` in `constants.ts`.

- Regular crop seeds: cap = `INITIAL_STOCK * 2.5` (ceil)
- Basic fruit seeds: cap = `INITIAL_STOCK * 2` (ceil)
- Advanced fruit seeds: cap = `INITIAL_STOCK * 1.5`
- Greenhouse seeds: cap = `INITIAL_STOCK * 5`
- Full Moon Fruits (Duskberry/Lunara/Celestine): cap = 10

---

## TOPIC 3: Gems / Block Bucks Economy

Source: `src/features/game/types/game.ts`, `src/features/game/lib/getInstantGems.ts`,
`src/features/game/components/modal/components/BuyGems.tsx`,
`src/features/game/events/landExpansion/restock.ts`,
`src/features/game/lib/vipAccess.ts`

### 3.1 Key constants

- **`BB_TO_GEM_RATIO = 20`** - 1 legacy Block Buck = 20 Gems.
- **Starter Pack price**: `US$0.49` (`STARTER_PACK_USD`).
- **VIP trial period**: 7 days (`VIP_TRIAL_PERIOD_MS = 7 * 24 * 3600 * 1000`).

### 3.2 Gem USD packs
Source: `BuyGems.tsx`

| Gems | USD |
|---|---|
| 100 | 1.29 |
| 650 | 6.49 |
| 1,350 | 12.99 |
| 2,800 | 25.99 |
| 7,400 | 64.99 |
| 15,500 | 129.99 |
| 200,000 | 1299.99 |

Payment via MATIC or Xsolla. FLOWER purchase option applies a 30% discount (`price.usd * 0.7`).

### 3.3 Gem Uses

| Use | Cost | Source file |
|---|---|---|
| Shop restock (seeds+tools) | 20 Gems (= 1 BB) | `restock.ts` |
| Omnifeed animal food | 1 Gem per feed | `animals.ts` (ANIMAL_FOODS) |
| Speed up buildings / crafting / recipes / expansions / collectibles | `getInstantGems()` by time left | `getInstantGems.ts` |
| Buy season items at Megastore | varies | `megastore.ts` |
| VIP bundles | see below | `vipAccess.ts` |

### 3.4 Instant Speed-up Cost Table
Source: `getInstantGems.ts` (`SECONDS_TO_GEMS`)

| Time remaining (<=) | Base Gems |
|---|---|
| 1 minute | 1 |
| 5 minutes | 2 |
| 10 minutes | 3 |
| 30 minutes | 4 |
| 1 hour | 5 |
| 2 hours | 8 |
| 4 hours | 14 |
| 6 hours | 20 |
| 8 hours | 22 |
| 12 hours | 25 |
| 24 hours | 40 |
| 36 hours | 60 |
| 48 hours | 80 |
| 72 hours | 110 |
| 96 hours | 140 |

Formula: `gems * 1.15^(gemsSpentToday / 100)` (compounding daily spend penalty, rounded half-up).

### 3.5 VIP Access (`VIP_PRICES`)
Source: `vipAccess.ts`

| Bundle | Gems | Duration |
|---|---|---|
| 1 Month | 1250 | 31 days |
| 3 Months | 1500 | 93 days |
| 2 Years | 11500 | 730 days |

Additional:
- **Lifetime Farmer Banner** (NFT) grants permanent VIP access.
- VIP gives 20% or fixed 500 coin discount (whichever is larger) on expansion coin cost.
- VIP halves the marketplace island tax (see 4.3).

### 3.6 Daily VIP bonus (from Daily Reward)

Level-based free food reward for VIPs:

| Level range | Bonus item |
|---|---|
| <3 | Mushroom Soup |
| 3-5 | Bumpkin Broth |
| 6-9 | Kale Stew |
| 10-14 | Sunflower Cake |
| 15-19 | Orange Cake |
| 20-29 | Parsnip Cake |
| 30-99 | Honey Cake |
| 100+ | Honey Cheddar |

### 3.7 Gem Acquisition

Gems are earned / obtained via:
- **Purchase** (USD via Xsolla or MATIC) - primary source.
- **FLOWER token** in-game swap (30% discount vs USD).
- **Daily Reward chest** (random amounts).
- **Deliveries / chores / bounties** (occasional gem rewards).
- **Season passes and Mega Store** (bundle rewards).

---

## TOPIC 4: Trading / P2P Marketplace

Source: `src/features/game/types/marketplace.ts`, `src/features/game/actions/tradeLimits.ts`,
`src/features/marketplace/lib/getTradeType.ts`, `src/features/marketplace/lib/listings.ts`

### 4.1 Trade Types

`ITEM_TRADE_TYPES` maps each item to:
- `"instant"` - offchain FLOWER (in-game balance) trade, settles immediately.
- `"onchain"` - on-chain SFL/FLOWER trade (supply-limited NFTs typically).

Comment from source: "Even though all trades are 'instant' now, please add supply limited
items as 'onchain'." In practice **almost all trades are instant FLOWER trades**.

### 4.2 Marketplace constants

- `MARKETPLACE_TAX = 0.10` (10% base tax on sales - source: `marketplace.ts`).
- `TRADE_INITIATION_MS = 15 * 60 * 1000` - a trade gets 15 min to resolve and cannot be
  cancelled while being purchased.

### 4.3 Island-based Resource Tax (ISLAND_RESOURCE_TAXES)

Applied to resource/commodity listings at time of sale. The value is a multiplier on
the base fee:

| Island | Multiplier |
|---|---|
| basic | 1.00 |
| spring | 0.50 |
| desert | 0.20 |
| volcano | 0.15 |

Modifiers:
- **VIP**: tax * 0.5 (halved).
- **Trading Shrine** (temporary collectible): -0.025 flat.

### 4.4 Trade Limits (Max quantity per single listing/offer)
Source: `tradeLimits.ts` (`TRADE_LIMITS`)

Crops:

| Item | Max per Trade | Min per Trade |
|---|---|---|
| Sunflower | 4000 | 200 |
| Potato | 3000 | 200 |
| Rhubarb | 2000 | 200 |
| Pumpkin | 2000 | 100 |
| Zucchini | 2000 | 100 |
| Carrot | 2000 | 100 |
| Yam | 2000 | 100 |
| Cabbage | 2000 | 100 |
| Broccoli | 2000 | 100 |
| Soybean | 2000 | 50 |
| Beetroot | 1000 | 50 |
| Pepper | 1000 | 50 |
| Cauliflower | 1000 | 50 |
| Parsnip | 1000 | 20 |
| Eggplant | 1000 | 20 |
| Corn | 1000 | 20 |
| Onion | 1000 | 20 |
| Radish | 500 | 10 |
| Wheat | 500 | 10 |
| Turnip | 500 | 10 |
| Kale | 500 | 10 |
| Artichoke | 500 | 10 |
| Barley | 500 | 10 |

Fruits:

| Item | Max | Min |
|---|---|---|
| Tomato | 400 | 20 |
| Lemon | 300 | 10 |
| Blueberry | 300 | 10 |
| Orange | 300 | 10 |
| Apple | 200 | 5 |
| Banana | 200 | 5 |
| Celestine | 20 | 3 |
| Lunara | 15 | 2 |
| Duskberry | 10 | 1 |

Greenhouse:

| Item | Max | Min |
|---|---|---|
| Grape | 100 | 5 |
| Rice | 100 | 5 |
| Olive | 100 | 5 |

Resources:

| Item | Max | Min |
|---|---|---|
| Wood | 500 | 50 |
| Stone | 200 | 10 |
| Iron | 200 | 5 |
| Gold | 100 | 3 |
| Crimstone | 20 | 1 |
| Salt | 100 | 10 |

Animal Produce:

| Item | Max | Min |
|---|---|---|
| Egg | 500 | 10 |
| Feather | 1000 | 20 |
| Honey | 100 | 5 |
| Milk | 100 | 5 |
| Leather | 100 | 5 |
| Wool | 1000 | 10 |
| Merino Wool | 400 | 5 |

Pet resources / bait / emblems:

| Item | Max | Min |
|---|---|---|
| Ruffroot | 100 | 1 |
| Chewed Bone | 100 | 1 |
| Heart leaf | 100 | 1 |
| Frost Pebble | 100 | 1 |
| Wild Grass | 100 | 1 |
| Ribbon | 100 | 1 |
| Dewberry | 100 | 1 |
| Moonfur | 100 | 1 |
| Capsule Bait | 10 | 1 |
| Umbrella Bait | 10 | 1 |
| Crimson Baitfish | 10 | 1 |
| Goblin/Sunflorian/Bumpkin/Nightshade Emblem | 200 | 1 |

**NOT tradeable resources** (explicitly excluded from `TradeResource`):
Diamond, Sunstone, Oil, Obsidian, Refined Salt, Wild Mushroom, Magic Mushroom, Chicken,
Acorn, Fossil Shell.

### 4.5 Bud & NFT trades

Buds and pet NFTs are traded as individual on-chain trades (separate path). VIP grants
a free Bud trade allowance; regular users pay listing fees in FLOWER/gems.

### 4.6 Listing fees & daily trade limits

The explicit per-day listing limit and exact listing fee constants are not in the
open-source frontend code - they are enforced server-side. The frontend shows a
tax/fee preview computed via `getResourceTax()` above. Trade volume is tracked in
`MarketplaceProfile.weeklyFlowerSpent` / `weeklyFlowerEarned` which suggests a weekly
throughput view.

Official UI copy: VIP players get free listings; non-VIP pay a small FLOWER (or gem)
listing fee per trade. Exact daily caps are configured server-side and not exposed as a
public constant in the client repo.

---

## TOPIC 5: Withdrawal / Minimum

Source: `src/features/game/components/bank/components/WithdrawFlower.tsx`,
`src/lib/utils/tax.ts`

### 5.1 Minimum withdrawal

- **`MIN_FLOWER_WITHDRAW_AMOUNT = 5`** (FLOWER) - hard-coded in `WithdrawFlower.tsx`.
- Any attempt to withdraw less than 5 FLOWER is rejected.

### 5.2 Withdrawal Tax (FLOWER/SFL)

Source: `src/lib/utils/tax.ts` - `getTaxPercentage(amount)`.

| Amount (FLOWER) | Base tax % |
|---|---|
| < 10 | 30% |
| < 100 | 25% |
| < 1,000 | 20% |
| < 5,000 | 15% |
| >= 5,000 | 10% |

Modifiers (applied in order):
1. `amount -= game.bank.taxFreeSFL` (tax-free bank SFL buffer deducted before tax).
2. If `island.type !== "basic"` (i.e., on spring/desert/volcano): `-2.5 percentage points`.
3. If the player holds a **Liquidity Provider** token: tax is halved (`percentage * 0.5`).

Smart contract internally uses a base rate of 1000 for decimal precision (10% = 100).

### 5.3 What can be withdrawn

Source: `withdrawables.ts` (defines `WEARABLE_RELEASES` and similar `CAN_WITHDRAW_AND_TRADE`
unlock dates per item).

- **FLOWER (SFL) token** - withdrawn via `WithdrawFlower` with taxes above (min 5).
- **Collectible NFTs** (decorations, banners, etc.) - only items flagged with
  `withdrawAt <= now` in `withdrawables.ts`.
- **Bumpkin Wearables** - same gating via `WEARABLE_RELEASES`.
- **Buds (NFTs)** - `WithdrawBuds.tsx` (on-chain transfer, no FLOWER tax).
- **Pet NFTs** - `WithdrawPets.tsx` (subject to `petRevealConfig`).
- **Inventory resources / crops / animal produce**: **cannot be withdrawn directly**.
  Players must sell them in the marketplace (earn FLOWER) and then withdraw FLOWER.

### 5.4 Boost-item cooldowns (not withdrawal-tax, but withdraw restrictions)

Source: `withdrawRestrictions.ts`. When a boost item (e.g. Scarecrow, Humming Bird,
Grinx's Hammer) has recently been used, it is withdraw-locked for:

- 1 day: default (any boost item not listed).
- 2 days: most crop boosts (Kuebiko, Scarecrow, Nancy, Lunar Calendar, Green Amulet,
  Blossom Ward, Knowledge Crab, Devil Wings, Gnome, Hoot, Foliant, Sickle, etc.),
  Buds also 2 days.
- 3 days: Obsidian items (Obsidian Necklace, Obsidian Turtle, Lava Swimwear).
- 5 days: Flower/pollination boosts (Flower Crown, Flower Fox, Butterfly, Humming Bird,
  Desert Rose, Chicory, Crimstone Hammer).
- 7 days: Grinx's Hammer.
- Christmas Tree / Festive Tree: restricted Dec 20 - Jan 1 every year.

---

## Source URLs (canonical references)

### Types & Data
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/crops.ts
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/fruits.ts
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/flowers.ts
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/beans.ts
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/tools.ts
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/animals.ts
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/buildings.ts
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/craftables.ts
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/seeds.ts
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/resources.ts
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/marketplace.ts
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/withdrawRestrictions.ts
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/withdrawables.ts

### Lib / constants
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/lib/constants.ts
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/lib/vipAccess.ts
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/lib/getInstantGems.ts
- https://github.com/sunflower-land/sunflower-land/blob/main/src/lib/utils/tax.ts

### Events / Actions
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/sellCrop.ts
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/buyResource.ts
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/restock.ts
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/shipmentRestocked.ts
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/buyAnimal.ts
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/feedAnimal.ts
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/actions/tradeLimits.ts
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/actions/sellMarketResource.ts
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/actions/buyGems.ts
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/components/bank/components/WithdrawFlower.tsx
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/components/modal/components/BuyGems.tsx

### Marketplace
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/marketplace/lib/listings.ts
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/marketplace/lib/getTradeType.ts

### Docs
- https://docs.sunflower-land.com/project/economy-tokenomics
