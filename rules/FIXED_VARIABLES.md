# Fixed Variables — НЕ МЕНЯТЬ без согласования

> Все значения ниже зафиксированы и являются обязательными для реализации.
> Любое изменение требует предварительного обращения к этому файлу.

## Уровни
- MAX_BUMPKIN_LEVEL = 200
- XP curve = SFL `LEVEL_EXPERIENCE` (файл `src/domain/level/xpTable.ts`)
- XP начисляется ТОЛЬКО через Feed Bumpkin (поедание блюд)

## Культуры
- 23 культуры с ценами и временем роста из SFL
- Источник: `src/data/crops.data.ts`

## Ресурсы (кулдауны ТЗ, НЕ SFL)
- Wood: 4 часа
- Stone: 24 часа
- Iron: 48 часов
- Gold: 72 часа
- Drop per gather: Wood=1, Stone=2, Iron=1, Gold=1
- Hits to gather: 3 для всех

## Инструменты
- Axe: 20 coins
- Wooden Pickaxe (stone): 3 wood + 10 coins
- Stone Pickaxe (iron): 3 stone + 3 wood + 20 coins
- Iron Pickaxe (gold): 3 iron + 3 stone + 3 wood
- Fishing Rod: 3 wood + 10 coins
- Tool consumed ONLY on final (3rd) hit
- 5 second idle resets hit progress

## Стартовый инвентарь
- 5 Axe
- 10 Sunflower Seed
- 5 Potato Seed
- 0 coins, 0 pollen

## Дефляционные цены продажи ресурсов
- Wood: 0.02c
- Stone: 0.05c
- Iron: 0.20c
- Gold: 1.00c
- Egg: 0.30c
- Milk: 0.80c
- Honey: 5.00c

## Здания
- Все здания 2x2 на карте
- Деревья 2x2 на карте
- Стартовые: Workbench, Market, Campfire (на карте с начала)
- Апгрейды:
  - Henhouse Lv2: 7500c + 50w + 25s
  - Henhouse Lv3: 50000c + 200w + 100s + 20i
  - Barn Lv2: 10000c + 100w + 50s + 10i
  - Barn Lv3: 75000c + 300w + 150s + 50i + 5g
- Capacity formula: 10 + (level - 1) * 5

## Расширение
- Блоки 3x3 клеток
- 4 стартовых блока (2x2 arrangement)
- Спираль по часовой стрелке
- Кнопка Expand на карте (не в HUD)
- Таймер строительства: 30s + 30s * expansionIndex
- 9 расширений на Basic Island
- Basic → Spring: 10 Gold

## Ульи (кастомная механика)
- Max 15 слотов (НЕ 3 как в SFL)
- Доступны только после Spring Island
- Демо-улей входит в 15 слотов
- Слоты по уровню: 10→1, 15→2, 25→3, 30→4, 35→5, 40→6, 45→7, 50→8, 75→9, 100→10, 120→11, 140→12, 160→13, 180→14, 200→15
- Демо→Lv1: 1000 действий ИЛИ 1000 пыльцы
- Lv1 покупка: 1000 пыльцы
- Pollen rate: Demo=0.4/day, Lv1=5/day

## Животные
- Куры: 6 уровней (ТЗ), Henhouse, 50c
- Коровы: 6 уровней (ТЗ), Barn, 200c
- Овцы: 6 уровней, Barn, 120c (shared capacity with cows)
- Feed cost: Chicken=1, Cow=5, Sheep=3

## Сезоны
- Basic Island = ВСЕГДА Spring (ТЗ 3.4)
- Полные 4 сезона: Spring→Summer→Autumn→Winter (7 дней каждый)
- Сезоны активны начиная с Spring Island (level 11+)

## UI
- HUD: только Lv/XP + Coins + Pollen + Season + Move + Skills + Inv
- Все панели доступны через здания на карте (Shop→Market, Tools→Workbench, Cook→Campfire/Kitchen/Bakery)
- Кнопка Land УБРАНА из HUD (расширение через карту)
- Click outside panel = close panel
- Боковой Quickbar: помнит 6, показывает 3
- Move mode: cooldown блокирует перемещение

## Вывод средств
- Minimum: 500 pollen
- Tax: 0% (начальная)
- Anti-bot: активность в последние 7 дней
- Токен: ДаРаи (NEAR)

## Навыки
- 4 дерева: Crops, Trees, Mining, Animals
- 3 тира в каждом
- 1 skill point per level
- Cost: T1=1pt, T2=2pt, T3=3pt

## Рыбалка
- Daily limit: 20 casts
- 6 видов рыб (3 tiers rarity)
- Rod: 3 wood + 10 coins

## Фрукты
- 6 видов: Tomato, Lemon, Blueberry, Orange, Apple, Banana
- Bush с 3-6 урожаями (seeded PRNG при посадке)
- Растут на fruit_patch ячейках

## Цветы
- 3 вида: Sunpetal (Lv13), Bloom (Lv22), Lily (Lv27)
- Растут на flower_bed ячейках
- Используются для ульев и доставок

## Теплица
- 3 культуры: Grape, Rice, Olive (все Lv40)
- Требует oil для посадки
- Требует здание Greenhouse

## Gems (премиум валюта)
- Начальное количество: 0
- Omnifeed: 1 gem
- Shop restock: 20 gems
- Speed-up по таблице (1min=1gem ... 48h=100gem)

## Коллекционки
- 10 MVP предметов с бустами
- Размещаются на ферме
- Бусты суммируются с навыками

## Time Warp Totems
- Time Warp Totem: x0.5 all cooldowns, 2 часа
- Super Totem: x0.5 all cooldowns, 7 дней
- Взаимоисключающие

## Доставки
- 3-6 слотов (масштаб с прогрессией)
- Регенерация слотов: 4-8 часов
- ~20 шаблонов доставок

## Daily Rewards
- 7-дневный streak
- Day 1: 10c, Day 2: 20c, ... Day 7: Mega (200c + seeds)
- Streak сбрасывается при пропуске

## Компостеры
- Compost Bin (Lv7): 6h, sprout_mix (+0.2 yield)
- Turbo Composter (Lv12): 8h, fruitful_blend (+0.2 fruit)
- Premium Composter (Lv18): 12h, rapid_root (-50% grow time)

## Water Well
- Без колодца: max 5 активных грядок
- Каждый колодец: +8 грядок

## Marketplace Tax
- 10% базовый

## HUD кнопки (ФИКСИРОВАНО)
- Только: Move, Skills, Inv
- Все остальные панели через здания на карте
- Del/Chores — НЕ в HUD (через NPC/здание)

---
*Версия: 3.0 | 2026-04-13*
