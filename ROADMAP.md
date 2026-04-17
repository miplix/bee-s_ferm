# Roadmap: Пчело-ферма (near-farm)

> Дорожная карта проекта. Что реализовано и что запланировано.
> Версия документа: 1.0 | 2026-04-13

---

## Текущее состояние (v2.0)

**106 файлов, ~10 000 строк, 0 TS ошибок, 283 КБ bundle (80 КБ gzip)**

### Полностью реализовано (38+ механик)

| Блок | Что работает |
|------|-------------|
| **Культуры** | 23 SFL-культуры (Sunflower → Barley), plant/harvest, sprite animation (11 кадров), grow timer с обратным отсчётом |
| **Ресурсы** | Wood/Stone/Iron/Gold, multi-hit рубка (3 удара), 5-секундный idle reset прогресса, ТЗ cooldowns (4h/24h/48h/72h) |
| **Инструменты** | Axe (20c), Wooden Pickaxe (3w+10c), Stone Pickaxe (3s+3w+20c), Iron Pickaxe (3i+3s+3w), Fishing Rod (3w+10c) |
| **Расширение** | 3x3 блоки, спираль по часовой стрелке, таймер строительства, Expand popup с ценами на карте |
| **Здания** | 15 зданий с level-lock + 🔒, апгрейды Henhouse/Barn Lv1→3, все здания 2x2 на карте |
| **Кулинария** | 8 рецептов с SFL cookingSeconds, Feed Bumpkin → XP (единственный источник) |
| **Уровни** | 1-200, полная SFL XP-таблица (LEVEL_EXPERIENCE) |
| **Животные** | Куры (6 ур.) + Коровы (6 ур.) + Овцы (6 ур.), кормление пшеницей, болезни кур, лечение |
| **Ульи** | 15 слотов max, Spring Island gate, демо-улей (3 действия/день), Lv1 покупка 1000 pollen |
| **Рыбалка** | 6 видов рыб (3 tiers rarity), Earthworm/Lure bait, daily limit 20 бросков |
| **Навыки** | 4 дерева (Crops/Trees/Mining/Animals), 22+ скиллов, 3 тира в каждом |
| **Бусты** | Engine: навыки + коллекционки + тотемы → crop grow, yield, resources, animal products |
| **Компостеры** | 3 вида, удобрения (sprout_mix, fruitful_blend, rapid_root) |
| **Сезоны** | 4 сезона × 7 дней, Basic Island = always Spring, сезонные ограничения посадки |
| **Фрукты** | 6 видов, bush с 3-6 урожаями (seeded PRNG), fruit_patch cells |
| **Цветы** | 3 вида (Sunpetal/Bloom/Lily), flower_bed cells |
| **Теплица** | Grape/Rice/Olive (все Lv40), требует oil |
| **Доставки** | 20 NPC-шаблонов, daily refresh, coin/XP/ticket rewards |
| **Задания** | 15 chore templates, 3/день, daily reset |
| **Daily Rewards** | 7-day streak, popup при входе, seeds/coins/tools |
| **Gems** | Премиум валюта, speed-ups для культур/готовки/расширений, Omnifeed, shop restock |
| **Коллекционки** | 12 предметов с бустами (Scarecrow, Woody, Lunar Calendar etc.) |
| **Time Warp Totems** | 2 вида (2ч и 7д), x0.5 cooldowns, взаимоисключающие |
| **Фракции** | 4 фракции (Bumpkin/Goblin/Sunflorian/Nightshade) с бустами |
| **Питомцы** | 5 типов с passive бустами |
| **Мутанты** | Rare crop drops (~3%), animal mutants (~0.1%), seeded PRNG |
| **Crop Machine** | Автоматизация с oil (Lv35, Desert Island required) |
| **Трейдинг** | P2P marketplace stubs, 10% tax, TRADEABLE_ITEMS |
| **Экономика** | Дефляционные цены ресурсов (wood 0.02c, gold 1.00c), shop stock limits |
| **UI** | Move/drag objects (cooldown block), Quickbar (6/3), click outside panel = close |
| **Карта** | Zoom in/out (wheel), free pan (drag), облачный фон вокруг острова |
| **Wallet** | NEAR stub + withdrawal logic (500 pollen min, 0% tax, 7d anti-bot) |

### Архитектура
- React 18 + Vite 5 + TypeScript 5 strict + Tailwind 3
- Zustand с persist middleware + миграциями
- Seeded PRNG (mulberry32 + FNV hash)
- Чистые domain функции (тестируемые без React)
- 12 модулей действий в `state/actions/`
- 20 UI панелей в `features/panels/`

---

## Что осталось реализовать

### 🔥 Приоритет: Высокий

#### 1. Full visual overhaul (графика и стиль)
- Кастомные спрайты для всех культур (а не только 12 существующих)
- Спрайты для всех зданий 2x2 (сейчас эмодзи)
- Анимации:
  - Анимация рубки дерева (падение, тряска)
  - Анимация роста культуры (плавные переходы между кадрами)
  - Анимация кормления животных
  - Анимация сбора урожая
- Пиксель-арт облака анимированные
- Рамки/borders для объектов в стиле SFL
- UI иконки в ретро-стиле (заменить эмодзи в HUD)

#### 2. Spring Island content
- Полноценный контент Spring Island (помимо флага):
  - Flower beds 2x2 на расширениях Spring
  - Beehives на расширениях Spring
  - Crimstone ноды (новый ресурс)
  - Уникальные экспансии для Spring (20 штук по research)
- Переход Basic → Spring с анимацией путешествия

#### 3. Desert Island
- 25 расширений Desert
- Новые ресурсы: Oil (Oil Reserve), Crimstone
- Теплица доступна только на Desert
- Crop Machine доступен только на Desert
- Уникальные культуры Desert (кактусы, пустынные растения)
- Переход Spring → Desert (20 Crimstone)

#### 4. Volcano Island
- 30 расширений Volcano
- Новые ресурсы: Obsidian, Sunstone
- Lava Pits — уникальный тип node
- Уникальные культуры и животные
- Переход Desert → Volcano

#### 5. NEAR Integration (Etap 8)
- Замена `wallet.stub.ts` на реальный `wallet.near.ts` с `near-api-js`
- Подключение кошелька через Wallet Selector
- Смарт-контракт для ДаРаи:
  - Депозит (покупка пыльцы за NEAR)
  - Вывод (вывод пыльцы → ДаРаи)
  - Баланс на чейне
- UI для connect/disconnect wallet в HUD
- Транзакции через wallet signer
- Тесты на NEAR testnet

---

### 📊 Приоритет: Средний

#### 6. Боевой server-side
- Backend для анти-чита:
  - Валидация действий игрока
  - Server-generated delivery requests (не client-side PRNG)
  - Disease rolls на сервере
  - Mutant chance rolls на сервере
- Leaderboard (топ игроков по уровню, coins, pollen)
- Real P2P marketplace (замена trading stubs)

#### 7. Мини-игры (22 игры по SFL research)
- Corn Maze (100 Crow Feathers/week)
- Chicken Rescue
- Festival of Colors
- Pumpkin Patch
- Potion House (Mastermind-clone, 3 попытки, 7 зелий)
- Beach Digging (7 holes/day, Sand Shovel)
- Desert Digging (10x10 grid, Sand Drill)
- Easter Eggstravaganza (сезонная)
- Mushroom Forest

#### 8. Pet System (расширенный)
- Pet House здание с capacity by level (L1={3,1}, L2={5,4}, L3={7,7})
- Pet XP formula: `100 * (n-1) * n / 2`
- Request XP: Easy 20 / Medium 100 / Hard 300
- Social pet cap: 50 XP/day (5 per interaction)
- Napping mechanic (2h после petting)
- Neglect timer (3 дня common / 7 дней NFT)

#### 9. Faction Week
- Weekly Marks competition
- Pet feeding mechanics с Faction Pet
- Faction wearable boosts (5%-20%)
- Weekly leaderboard с prize payouts
- Paw Shield wearable (+25% Marks + XP)

#### 10. Advanced skills & wearables
- Полное дерево навыков (130 скиллов по SFL, у нас 22)
- Bumpkin wearables slots (head, body, pants, shoes, tool, secondary)
- Wearable effects integration (Green Amulet +10% crops, Cattlegrim +25% animal products, etc)
- Wearable inventory management

#### 11. Treasure & Daily Chest
- Pirate's Chest с ежедневными наградами
- Treasure Island digging (exotic fruit drops)
- Weekly Mega Reward
- Streak protection (первые 6 клеймов)

#### 12. Auction House
- Blind bid mechanic (irreversible)
- 24h mint window
- Seasonal auction drops (Queen Bee, Hungry Caterpillar etc)
- Refund для loser'ов
- Tie-breaker by highest Bumpkin XP

---

### 🎨 Приоритет: Низкий

#### 13. Boost stacking detailed
- 242 буста из research/08 полная интеграция
- AOE collectibles (Basic Scarecrow 3x3, Sir Goldensnout 4x4)
- Mutual exclusions (Beavers, Cabbage Boy ↔ Karkinos)

#### 14. Сезонный контент (Chapters)
- 13 chapters из SFL research
- Chapter tickets (Scroll, Horseshoe, Geniseed и т.д.)
- Chapter-specific wearables и collectibles
- Seasonal deliveries с уникальными наградами

#### 15. Greenhouse расширение
- Max pots: 4 (сейчас basic)
- Skill-based pot expansion (up to 10)
- Oil consumption per plant
- Speedups через Gems

#### 16. Fishing расширение
- Полный bestiary (30+ рыб) вместо MVP 6
- Chum system (49 recipes from research)
- Weather/moon condition bonuses
- Marine Marvels (5 permanent + chapter-specific)
- Fishing boost wearables (Angler Waders +10 casts, etc)

#### 17. Advanced beehive system
- Flower attachment system (цветы → ульи)
- Swarm mechanic (~20% chance при полном harvest)
- Bee Suit +0.1 harvest
- Honeycomb Shield +1.0
- Queen Bee +1 production rate
- Bear Shrine +0.5
- Beehive merge (2x Lv-N → 1x Lv-(N+1), -10%)

#### 18. Accessibility & QoL
- Touch-friendly mobile UI (сейчас только desktop)
- Keyboard shortcuts (WASD pan, +/- zoom, цифры для quickbar)
- Colorblind mode
- Sound effects (рубка, сбор, уведомления)
- Background music (с возможностью выключить)
- Tutorial/onboarding для новых игроков

#### 19. Social features
- Friend list
- Visit other farms (read-only)
- Gifting system
- Chat/messaging

#### 20. Localization
- Русский (currently mixed RU/EN)
- English полностью
- Другие языки (по желанию)

---

## Ключевые файлы (для navigation)

### Data (константы)
- `src/data/crops.data.ts` — 23 культуры
- `src/data/buildings.data.ts` — 15 зданий + апгрейды
- `src/data/animals.data.ts` — куры/коровы/овцы
- `src/data/beehives.data.ts` — ульи
- `src/data/skills.data.ts` — дерево навыков
- `src/data/recipes.data.ts` — 8 рецептов
- `src/data/expansions.data.ts` — 9 расширений Basic
- `src/data/fishing.data.ts` — рыбалка
- `src/data/fruits.data.ts` / `flowers.data.ts` / `greenhouse.data.ts`
- `src/data/collectibles.data.ts` — 12 boost предметов
- `src/data/factions.data.ts` / `pets.data.ts`
- `src/data/composters.data.ts` — 3 компостера
- `src/data/cropMachine.data.ts`
- `src/data/deliveries.data.ts` / `chores.data.ts` / `dailyRewards.data.ts`
- `src/data/gems.data.ts` / `shopLimits.data.ts` / `trading.data.ts` / `tools.data.ts` / `resourceNodes.data.ts`

### Domain (чистая логика)
- `src/domain/types/game.ts` — GameState interface
- `src/domain/types/ids.ts` — string union types
- `src/domain/rng/prng.ts` + `seed.ts` — seeded PRNG
- `src/domain/boosts/engine.ts` — boost aggregation
- `src/domain/level/xpTable.ts` — XP 1-200
- `src/domain/expansion/blocks.ts` — spiral expansion
- `src/domain/seasons/seasons.ts` — 4-season cycle
- `src/domain/skills/skillEngine.ts`
- `src/domain/mutants/mutants.ts` — mutant rolls
- `src/domain/beehives/slots.ts` — 15-slot table
- `src/domain/time/time.ts` — time utils

### State (Zustand)
- `src/state/store.ts` — главный store с 60+ actions
- `src/state/actions/*.ts` — 18 модулей действий

### UI
- `src/app/App.tsx` — корень
- `src/features/hud/Hud.tsx` — HUD (только Move, Skills, Inv)
- `src/features/farm/FarmView.tsx` — карта с zoom/pan
- `src/features/panels/*.tsx` — 20 панелей
- `src/features/locations/*.tsx` — HenhouseScreen, BarnScreen
- `src/features/shared/*.tsx` — общие компоненты (PixelButton, Progress, etc)

### Правила
- `rules/PROJECT_RULES.md` — 15 секций правил
- `rules/FIXED_VARIABLES.md` — все зафиксированные константы v3.0
- `research/00_INDEX_MASTER_DB.md` — master индекс базы знаний SFL
- `research/01_*.md` .. `12_*.md` — 12 файлов research (~295 КБ)

---

## Запуск

```bash
cd near-farm
npm install
npm run dev      # http://localhost:5173
npm run build    # production
```

---

## История версий

- **v0.4** — full TZ implementation (178a792)
- **v0.5** — grid-based territory (f2dc5e5)
- **v0.6** — NO TEXT on map, quickbar, auto-select (9af7b7a)
- **v0.7** — shop limits, sell x1/x10/x100/all (e6e0b90)
- **v0.7.1** — shop crash fix (4c69c16)
- **v2.0** — полный rewrite: все SFL механики, 106 файлов, zoom/pan, 2x2 objects, boost engine (текущая)

---

*Документ обновляется по мере развития проекта. Следующее обновление — после интеграции Spring Island контента или NEAR wallet.*
