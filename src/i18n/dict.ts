/**
 * Словари локализации для всех видимых строк UI.
 *
 * Структура: ключи группируются по компоненту/панели через точку:
 *   "hud.move", "settings.language", "shop.buy" и т.д.
 *
 * Параметры в строках через {name}: t("foo.bar", { name: "value" }).
 *
 * Любая новая строка → добавить ключ В ОБА словаря (ru + en).
 */

import type { Language } from "./types";

export type Dict = Record<string, string>;

const ru: Dict = {
  // ── HUD ───────────────────────────────────────────────────────────────
  "hud.level":         "Ур.{n}",
  "hud.move":          "Передвинуть",
  "hud.skills":        "Навыки",
  "hud.inventory":     "Инв",
  "hud.settings":      "Меню",
  "hud.move_title":    "Перемещать объекты",
  "hud.skills_title":  "Навыки",
  "hud.inventory_title":"Инвентарь",
  "hud.settings_title":"Настройки",
  "hud.pollen_topup_title": "Пополнить пыльцу (NEP-141 pollen.tkn.near)",
  "hud.pollen_topup_aria":  "Пополнить пыльцу",

  // ── Welcome screen ────────────────────────────────────────────────────
  "welcome.title":     "🐝 Пчело-ферма",
  "welcome.subtitle":  "Ферма на блокчейне NEAR",
  "welcome.connect":   "Подключить кошелёк",
  "welcome.continue":  "Продолжить →",
  "welcome.skip":      "Пропустить →",
  "welcome.start":     "Начать игру!",
  "welcome.step1.title": "🌻 Сажай и собирай",
  "welcome.step1.desc":  "Выращивай подсолнух, картошку и другие культуры. Покупай семена в магазине.",
  "welcome.step2.title": "🪓 Добывай ресурсы",
  "welcome.step2.desc":  "Руби деревья, бей камни. Используй ресурсы для улучшений и зданий.",
  "welcome.step3.title": "🏠 Стройся и расширяйся",
  "welcome.step3.desc":  "Возводи здания, открывай новые блоки фермы и осваивай острова.",
  "welcome.step4.title": "🌼 Зарабатывай пыльцу",
  "welcome.step4.desc":  "Заведи пасеку и копи пыльцу. Меняй её на улучшения, выводи в кошелёк.",

  // ── LoginGate ─────────────────────────────────────────────────────────
  "login.title":         "Подключи кошелёк NEAR",
  "login.connect":       "Подключить",
  "login.connecting":    "Подключаю…",
  "login.error":         "Не удалось подключить кошелёк",

  // ── Settings panel ────────────────────────────────────────────────────
  "settings.title":      "Настройки",
  "settings.language":   "Язык / Language",
  "settings.account":    "Аккаунт",
  "settings.account_email": "Email",
  "settings.account_signin":"Войти",
  "settings.account_signout":"Выйти",
  "settings.vip":        "VIP",
  "settings.vip_active": "Активен до {date}",
  "settings.vip_inactive":"Не активен",
  "settings.vip_buy":    "Купить VIP",
  "settings.audio":      "Звук",
  "settings.audio_sfx":  "Эффекты",
  "settings.audio_music":"Фон. музыка",
  "settings.danger":     "Опасная зона",
  "settings.reset":      "Сбросить игру",
  "settings.reset_confirm": "Сбросить ВСЁ? Восстановить нельзя",
  "settings.dev_panel":  "Разработчик (D)",

  // ── Inventory panel ───────────────────────────────────────────────────
  "inv.title":           "Инвентарь",
  "inv.empty":           "Пусто",
  "inv.section.tools":   "Инструменты",
  "inv.section.seeds":   "Семена",
  "inv.section.fertilizers": "Удобрения",
  "inv.section.mutants": "Мутанты ✨",
  "inv.section.meals":   "Блюда",
  "inv.section.resources":"Ресурсы",
  "inv.btn.take":        "Взять",
  "inv.btn.unselect":    "Убрать",
  "inv.btn.place":       "Поставить",
  "inv.btn.unplace":     "Снять",
  "inv.fert.hint":       "Возьми удобрение и кликни по грядке/фрукт. кусту, чтобы применить",
  "inv.mutant.hint":     "Очень редкий дроп с урожая (1 на миллион) и животных (1 на 10к). Бонус +10 % к родительской культуре/животному действует ТОЛЬКО когда поставлен на ферму.",
  "inv.mutant.placed":   "На ферме (бонус активен):",
  "inv.seed_suffix":     "(семя)",
  "inv.meal_prefix":     "Блюдо: ",

  // ── Shop panel ────────────────────────────────────────────────────────
  "shop.title":          "Рынок",
  "shop.tab.seeds":      "Семена",
  "shop.tab.fruits":     "Фрукты",
  "shop.tab.flowers":    "Цветы",
  "shop.tab.greenhouse": "Теплица",
  "shop.tab.sell":       "Продать",
  "shop.buy":            "Купить",
  "shop.sell":           "Продать",
  "shop.sell_all":       "Продать всё",
  "shop.locked":         "Lv.{n}",
  "shop.qty":            "Кол-во",
  "shop.price":          "Цена",
  "shop.stock":          "В наличии: {n}",
  "shop.no_items":       "Нет предметов для продажи",

  // ── Build / Craft / Cook ──────────────────────────────────────────────
  "build.title":         "Стройка",
  "build.tab.tools":     "Инструменты",
  "build.tab.buildings": "Здания",
  "build.btn.build":     "Построить",
  "build.btn.upgrade":   "Улучшить",
  "build.cost":          "Стоимость",
  "build.requires_lv":   "Нужен Ур.{n}",
  "build.already_built": "Уже построено",

  "craft.title":         "Крафт",
  "craft.btn.craft":     "Создать",

  "cook.title":          "Кухня",
  "cook.btn.start":      "Готовить",
  "cook.btn.collect":    "Забрать",
  "cook.queue":          "В очереди:",
  "cook.empty_slot":     "Пустой слот",

  // ── Beehive / Animals / Fishing / Greenhouse ──────────────────────────
  "beehive.title":       "Пасека",
  "beehive.add":         "Поставить улей",
  "beehive.upgrade":     "Улучшить",
  "beehive.collect":     "Собрать пыльцу",
  "beehive.lv":          "Ур.{n}",
  "beehive.slots_full":  "Все слоты заняты",
  "beehive.vip_extra":   "+1 слот за VIP",
  "beehive.first_free_vip":"Первый улей бесплатно (VIP)",

  "animals.title":       "Животные",
  "animals.feed":        "Покормить",
  "animals.collect":     "Собрать",
  "animals.cure":        "Вылечить",
  "animals.sell":        "Продать",

  "fishing.title":       "Рыбалка",
  "fishing.cast":        "Закинуть",
  "fishing.casts_left":  "Осталось забросов: {n}",

  // ── Skills ────────────────────────────────────────────────────────────
  "skills.title":        "Навыки",
  "skills.tier":         "Тир {n}",
  "skills.points":       "Очки: {n}",
  "skills.learn":        "Изучить",

  // ── Daily / Chores / Deliveries / Faction ─────────────────────────────
  "daily.title":         "Ежедневная награда",
  "daily.streak":        "Серия: {n} дн.",
  "daily.claim":         "Забрать",
  "daily.claimed":       "Получено",

  "chore.title":         "Поручения",
  "chore.refresh":       "Обновить",
  "chore.claim":         "Забрать награду",

  "delivery.title":      "Доставки",
  "delivery.refresh":    "Обновить заявки",
  "delivery.complete":   "Сдать",

  "faction.title":       "Фракция",
  "faction.join":        "Присоединиться",

  // ── Exchange (биржа) ──────────────────────────────────────────────────
  "exchange.title":      "🏛 Биржа",
  "exchange.tab.buy":    "Купить",
  "exchange.tab.sell":   "Продать",
  "exchange.tab.own":    "Мои заявки",
  "exchange.subtitle":   "Торговля за пыльцу. Комиссия покупателя: {fee}. Min цена: 10 пыльцы за единицу. Max qty: 10 000.",
  "exchange.fee_vip":    "3% (VIP)",
  "exchange.fee_normal": "5%",
  "exchange.filter":     "Фильтр (item_id)",
  "exchange.loading":    "Загружаю…",
  "exchange.no_listings":"Заявок нет",
  "exchange.btn.buy":    "Купить",
  "exchange.btn.cancel": "Отменить",
  "exchange.confirm_buy":"Купить {qty}× {item} за {total} 🌼?",
  "exchange.bought":     "Куплено: {qty}× {item}, списано {total} 🌼",
  "exchange.cancel_confirm":"Отменить заявку? Предмет вернётся в инвентарь.",
  "exchange.cancelled":  "Заявка отменена",
  "exchange.created":    "Заявка создана: {qty}× {item} по {price} 🌼",
  "exchange.no_items":   "Нет предметов для продажи",
  "exchange.label.item": "Предмет:",
  "exchange.label.qty":  "Количество (макс {max}):",
  "exchange.label.price":"Цена за единицу (мин 10 🌼):",
  "exchange.label.total":"Итого:",
  "exchange.btn.list":   "Выставить заявку",
  "exchange.status.open":   "открыта",
  "exchange.status.sold":   "продана",
  "exchange.status.cancelled": "отменена",
  "exchange.cloud_disabled":"Облако не настроено",

  // ── FarmView (expansion + grid) ───────────────────────────────────────
  "farm.expansion.title": "Расширение {n}",
  "farm.expansion.cost":  "Стоимость:",
  "farm.expansion.adds":  "Добавляет:",
  "farm.expansion.have":  "(есть {have})",
  "farm.expansion.requires_lv": "Нужен Ур.{n} (у тебя: {cur})",
  "farm.expansion.build": "Построить",
  "farm.expansion.cancel":"Отмена",
  "farm.expansion.done":  "Готово!",
  "farm.empty":           "Пусто",
  "farm.move.hint":       "Перетащи объект на свободное место",

  // ── Common buttons / labels ───────────────────────────────────────────
  "btn.ok":              "OK",
  "btn.cancel":          "Отмена",
  "btn.close":           "Закрыть",
  "btn.confirm":         "Подтвердить",
  "btn.back":            "Назад",
  "btn.continue":        "Продолжить",

  // ── Toast messages (errors, info, success) ────────────────────────────
  "toast.no_seeds":       "Нет семян",
  "toast.not_enough_resources":"Недостаточно ресурсов",
  "toast.level_required": "Нужен уровень {n}",
  "toast.season_wrong":   "Не сезон для этой культуры",
  "toast.cooking_not_ready":"Ещё не готово",
  "toast.compost_not_ready":"Компост ещё не готов",
  "toast.fert.cant_apply":"Нельзя применить удобрение",
  "toast.mutant.placed":  "Мутант размещён на ферме (+10% урожая)",
  "toast.mutant.unplaced":"Мутант снят с фермы",
  "toast.mutant.fail":    "Не получилось поставить мутанта",
  "toast.cell_occupied":  "Клетка занята",
  "toast.no_axe":         "Нужен топор",
  "toast.tx_pending":     "Ожидаю подтверждение транзакции…",
  "toast.tx_ok":          "Транзакция подтверждена",
  "toast.tx_fail":        "Транзакция не прошла",
  "toast.wallet_required":"Подключи кошелёк",

  // ── PollenBoostButton ─────────────────────────────────────────────────
  "boost.label":          "🌼 Удобрить · {n}",
  "boost.title.on":       "Выключить режим удобрения",
  "boost.title.off":      "Удобрить пыльцой: грядка 1 / клумба 5 / фрукт. куст 10. ×2 урожай (одноразово)",

  // ── Pollen Topup Modal ────────────────────────────────────────────────
  "topup.title":          "🌼 Пополнить пыльцу",
  "topup.current":        "Сейчас в игре",
  "topup.token":          "Токен: {contract}",
  "topup.recipient":      "Получатель: {recipient}",
  "topup.rate":           "Курс 1:1 — сколько токенов отправишь, столько пыльцы зачислится.",
  "topup.amount_placeholder":"Кол-во пыльцы",
  "topup.btn.send":       "Отправить {n} 🌼",
  "topup.tx_label":       "Транзакция:",
  "topup.error.invalid":  "Введи целое число > 0",
  "topup.error.send":     "Ошибка: {msg}",
  "topup.success":        "+{n} 🌼 пыльцы зачислено",

  // ── Misc ──────────────────────────────────────────────────────────────
  "season.spring":        "Весна",
  "season.summer":        "Лето",
  "season.autumn":        "Осень",
  "season.winter":        "Зима",
  "days_left":            "{n}d",
};

const en: Dict = {
  // ── HUD ───────────────────────────────────────────────────────────────
  "hud.level":         "Lv.{n}",
  "hud.move":          "Move",
  "hud.skills":        "Skills",
  "hud.inventory":     "Inv",
  "hud.settings":      "Menu",
  "hud.move_title":    "Move objects",
  "hud.skills_title":  "Skills",
  "hud.inventory_title":"Inventory",
  "hud.settings_title":"Settings",
  "hud.pollen_topup_title": "Top up pollen (NEP-141 pollen.tkn.near)",
  "hud.pollen_topup_aria":  "Top up pollen",

  // ── Welcome screen ────────────────────────────────────────────────────
  "welcome.title":     "🐝 Bee Farm",
  "welcome.subtitle":  "A NEAR-blockchain farm",
  "welcome.connect":   "Connect wallet",
  "welcome.continue":  "Continue →",
  "welcome.skip":      "Skip →",
  "welcome.start":     "Start playing!",
  "welcome.step1.title": "🌻 Plant & harvest",
  "welcome.step1.desc":  "Grow sunflowers, potatoes and more crops. Buy seeds in the shop.",
  "welcome.step2.title": "🪓 Gather resources",
  "welcome.step2.desc":  "Chop trees, mine rocks. Use resources for upgrades and buildings.",
  "welcome.step3.title": "🏠 Build & expand",
  "welcome.step3.desc":  "Erect buildings, unlock new farm blocks and explore islands.",
  "welcome.step4.title": "🌼 Earn pollen",
  "welcome.step4.desc":  "Set up beehives and stack pollen. Spend it on boosts or cash out.",

  // ── LoginGate ─────────────────────────────────────────────────────────
  "login.title":         "Connect a NEAR wallet",
  "login.connect":       "Connect",
  "login.connecting":    "Connecting…",
  "login.error":         "Could not connect wallet",

  // ── Settings panel ────────────────────────────────────────────────────
  "settings.title":      "Settings",
  "settings.language":   "Language / Язык",
  "settings.account":    "Account",
  "settings.account_email": "Email",
  "settings.account_signin":"Sign in",
  "settings.account_signout":"Sign out",
  "settings.vip":        "VIP",
  "settings.vip_active": "Active until {date}",
  "settings.vip_inactive":"Inactive",
  "settings.vip_buy":    "Buy VIP",
  "settings.audio":      "Audio",
  "settings.audio_sfx":  "Sound FX",
  "settings.audio_music":"Background music",
  "settings.danger":     "Danger zone",
  "settings.reset":      "Reset game",
  "settings.reset_confirm": "Reset EVERYTHING? Cannot be undone",
  "settings.dev_panel":  "Developer (D)",

  // ── Inventory panel ───────────────────────────────────────────────────
  "inv.title":           "Inventory",
  "inv.empty":           "Empty",
  "inv.section.tools":   "Tools",
  "inv.section.seeds":   "Seeds",
  "inv.section.fertilizers": "Fertilizers",
  "inv.section.mutants": "Mutants ✨",
  "inv.section.meals":   "Meals",
  "inv.section.resources":"Resources",
  "inv.btn.take":        "Take",
  "inv.btn.unselect":    "Unselect",
  "inv.btn.place":       "Place",
  "inv.btn.unplace":     "Remove",
  "inv.fert.hint":       "Take fertilizer and click a plot/fruit-bush to apply.",
  "inv.mutant.hint":     "Very rare drop from harvests (1-in-1M) and animals (1-in-10k). +10 % bonus to parent crop/animal applies ONLY when placed on the farm.",
  "inv.mutant.placed":   "Placed on farm (bonus active):",
  "inv.seed_suffix":     "(seed)",
  "inv.meal_prefix":     "Meal: ",

  // ── Shop panel ────────────────────────────────────────────────────────
  "shop.title":          "Market",
  "shop.tab.seeds":      "Seeds",
  "shop.tab.fruits":     "Fruits",
  "shop.tab.flowers":    "Flowers",
  "shop.tab.greenhouse": "Greenhouse",
  "shop.tab.sell":       "Sell",
  "shop.buy":            "Buy",
  "shop.sell":           "Sell",
  "shop.sell_all":       "Sell all",
  "shop.locked":         "Lv.{n}",
  "shop.qty":            "Qty",
  "shop.price":          "Price",
  "shop.stock":          "In stock: {n}",
  "shop.no_items":       "Nothing to sell",

  // ── Build / Craft / Cook ──────────────────────────────────────────────
  "build.title":         "Build",
  "build.tab.tools":     "Tools",
  "build.tab.buildings": "Buildings",
  "build.btn.build":     "Build",
  "build.btn.upgrade":   "Upgrade",
  "build.cost":          "Cost",
  "build.requires_lv":   "Requires Lv.{n}",
  "build.already_built": "Already built",

  "craft.title":         "Craft",
  "craft.btn.craft":     "Craft",

  "cook.title":          "Kitchen",
  "cook.btn.start":      "Cook",
  "cook.btn.collect":    "Collect",
  "cook.queue":          "Queue:",
  "cook.empty_slot":     "Empty slot",

  // ── Beehive / Animals / Fishing / Greenhouse ──────────────────────────
  "beehive.title":       "Apiary",
  "beehive.add":         "Add hive",
  "beehive.upgrade":     "Upgrade",
  "beehive.collect":     "Collect pollen",
  "beehive.lv":          "Lv.{n}",
  "beehive.slots_full":  "All slots taken",
  "beehive.vip_extra":   "+1 slot from VIP",
  "beehive.first_free_vip":"First hive free (VIP)",

  "animals.title":       "Animals",
  "animals.feed":        "Feed",
  "animals.collect":     "Collect",
  "animals.cure":        "Cure",
  "animals.sell":        "Sell",

  "fishing.title":       "Fishing",
  "fishing.cast":        "Cast",
  "fishing.casts_left":  "Casts left: {n}",

  // ── Skills ────────────────────────────────────────────────────────────
  "skills.title":        "Skills",
  "skills.tier":         "Tier {n}",
  "skills.points":       "Points: {n}",
  "skills.learn":        "Learn",

  // ── Daily / Chores / Deliveries / Faction ─────────────────────────────
  "daily.title":         "Daily reward",
  "daily.streak":        "Streak: {n} days",
  "daily.claim":         "Claim",
  "daily.claimed":       "Claimed",

  "chore.title":         "Chores",
  "chore.refresh":       "Refresh",
  "chore.claim":         "Claim reward",

  "delivery.title":      "Deliveries",
  "delivery.refresh":    "Refresh",
  "delivery.complete":   "Deliver",

  "faction.title":       "Faction",
  "faction.join":        "Join",

  // ── Exchange ──────────────────────────────────────────────────────────
  "exchange.title":      "🏛 Marketplace",
  "exchange.tab.buy":    "Buy",
  "exchange.tab.sell":   "Sell",
  "exchange.tab.own":    "My listings",
  "exchange.subtitle":   "Trade for pollen. Buyer commission: {fee}. Min price: 10 pollen / unit. Max qty: 10,000.",
  "exchange.fee_vip":    "3% (VIP)",
  "exchange.fee_normal": "5%",
  "exchange.filter":     "Filter (item_id)",
  "exchange.loading":    "Loading…",
  "exchange.no_listings":"No listings",
  "exchange.btn.buy":    "Buy",
  "exchange.btn.cancel": "Cancel",
  "exchange.confirm_buy":"Buy {qty}× {item} for {total} 🌼?",
  "exchange.bought":     "Bought: {qty}× {item}, paid {total} 🌼",
  "exchange.cancel_confirm":"Cancel listing? Item returns to inventory.",
  "exchange.cancelled":  "Listing cancelled",
  "exchange.created":    "Listing created: {qty}× {item} at {price} 🌼",
  "exchange.no_items":   "Nothing to sell",
  "exchange.label.item": "Item:",
  "exchange.label.qty":  "Quantity (max {max}):",
  "exchange.label.price":"Price per unit (min 10 🌼):",
  "exchange.label.total":"Total:",
  "exchange.btn.list":   "Create listing",
  "exchange.status.open":   "open",
  "exchange.status.sold":   "sold",
  "exchange.status.cancelled": "cancelled",
  "exchange.cloud_disabled":"Cloud not configured",

  // ── FarmView ──────────────────────────────────────────────────────────
  "farm.expansion.title": "Expansion {n}",
  "farm.expansion.cost":  "Cost:",
  "farm.expansion.adds":  "Adds:",
  "farm.expansion.have":  "(have {have})",
  "farm.expansion.requires_lv": "Requires Lv.{n} (you: {cur})",
  "farm.expansion.build": "Build",
  "farm.expansion.cancel":"Cancel",
  "farm.expansion.done":  "Done!",
  "farm.empty":           "Empty",
  "farm.move.hint":       "Drag the object onto an empty cell",

  // ── Common buttons / labels ───────────────────────────────────────────
  "btn.ok":              "OK",
  "btn.cancel":          "Cancel",
  "btn.close":           "Close",
  "btn.confirm":         "Confirm",
  "btn.back":            "Back",
  "btn.continue":        "Continue",

  // ── Toast messages ────────────────────────────────────────────────────
  "toast.no_seeds":       "No seeds",
  "toast.not_enough_resources":"Not enough resources",
  "toast.level_required": "Requires Lv.{n}",
  "toast.season_wrong":   "Wrong season for this crop",
  "toast.cooking_not_ready":"Not ready yet",
  "toast.compost_not_ready":"Compost not ready yet",
  "toast.fert.cant_apply":"Can't apply fertilizer",
  "toast.mutant.placed":  "Mutant placed on farm (+10% yield)",
  "toast.mutant.unplaced":"Mutant removed from farm",
  "toast.mutant.fail":    "Couldn't place mutant",
  "toast.cell_occupied":  "Cell occupied",
  "toast.no_axe":         "Need an axe",
  "toast.tx_pending":     "Awaiting tx confirmation…",
  "toast.tx_ok":          "Transaction confirmed",
  "toast.tx_fail":        "Transaction failed",
  "toast.wallet_required":"Connect a wallet first",

  // ── PollenBoostButton ─────────────────────────────────────────────────
  "boost.label":          "🌼 Boost · {n}",
  "boost.title.on":       "Disable boost mode",
  "boost.title.off":      "Boost with pollen: plot 1 / flower 5 / fruit-bush 10. ×2 yield (single use)",

  // ── Pollen Topup Modal ────────────────────────────────────────────────
  "topup.title":          "🌼 Top up pollen",
  "topup.current":        "Current balance",
  "topup.token":          "Token: {contract}",
  "topup.recipient":      "Recipient: {recipient}",
  "topup.rate":           "Rate 1:1 — pollen credited equals tokens sent.",
  "topup.amount_placeholder":"Amount of pollen",
  "topup.btn.send":       "Send {n} 🌼",
  "topup.tx_label":       "Tx:",
  "topup.error.invalid":  "Enter a positive integer",
  "topup.error.send":     "Error: {msg}",
  "topup.success":        "+{n} 🌼 pollen credited",

  // ── Misc ──────────────────────────────────────────────────────────────
  "season.spring":        "Spring",
  "season.summer":        "Summer",
  "season.autumn":        "Autumn",
  "season.winter":        "Winter",
  "days_left":            "{n}d",
};

export const dict: Record<Language, Dict> = { ru, en };
