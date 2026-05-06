/**
 * Локализованные имена игровых предметов (ресурсы, культуры, фрукты, инструменты, мутанты).
 *
 * Использовать через хук `useItemName()` или функцию `getItemName(id, lang)`.
 * Если перевода нет — fallback на капитализацию из id.
 */

import type { Language } from "./types";
import { CROP_MUTANTS, ANIMAL_MUTANTS } from "../domain/mutants/mutants";

const RU: Record<string, string> = {
  // Resources
  wood: "Дерево", stone: "Камень", iron: "Железо", gold: "Золото",
  crimstone: "Кримстоун", oil: "Нефть", obsidian: "Обсидиан", sunstone: "Сансто́ун",
  // Animal products
  egg: "Яйцо", milk: "Молоко", honey: "Мёд", wool: "Шерсть",
  // Tools
  axe: "Топор", stone_pickaxe: "Деревянная кирка", iron_pickaxe: "Каменная кирка",
  gold_pickaxe: "Железная кирка", fishing_rod: "Удочка",
  // Crops
  sunflower: "Подсолнух", potato: "Картофель", pumpkin: "Тыква", carrot: "Морковь",
  cabbage: "Капуста", beetroot: "Свёкла", cauliflower: "Цветная капуста",
  parsnip: "Пастернак", radish: "Редиска", wheat: "Пшеница", kale: "Кейл", corn: "Кукуруза",
  // Fruits
  tomato: "Томат", lemon: "Лимон", blueberry: "Черника", orange: "Апельсин",
  apple: "Яблоко", banana: "Банан",
  // Flowers
  sunpetal: "Солнечный лепесток", bloom: "Цветение", lily: "Лилия",
  // Greenhouse
  grape: "Виноград", rice: "Рис", olive: "Олива",
  // Fertilizers
  sprout_mix: "Удобрение «Росток»",
  fruitful_blend: "Удобрение «Изобилие»",
  rapid_root: "Удобрение «Корнерост»",
  // Worms (compost byproducts)
  earthworm: "Дождевой червь", grub: "Личинка", red_wiggler: "Красный червь",
  // Animals (kind names)
  chicken: "Курица", cow: "Корова", sheep: "Овца",
};

const EN: Record<string, string> = {
  wood: "Wood", stone: "Stone", iron: "Iron", gold: "Gold",
  crimstone: "Crimstone", oil: "Oil", obsidian: "Obsidian", sunstone: "Sunstone",
  egg: "Egg", milk: "Milk", honey: "Honey", wool: "Wool",
  axe: "Axe", stone_pickaxe: "Wooden Pickaxe", iron_pickaxe: "Stone Pickaxe",
  gold_pickaxe: "Iron Pickaxe", fishing_rod: "Fishing Rod",
  sunflower: "Sunflower", potato: "Potato", pumpkin: "Pumpkin", carrot: "Carrot",
  cabbage: "Cabbage", beetroot: "Beetroot", cauliflower: "Cauliflower",
  parsnip: "Parsnip", radish: "Radish", wheat: "Wheat", kale: "Kale", corn: "Corn",
  tomato: "Tomato", lemon: "Lemon", blueberry: "Blueberry", orange: "Orange",
  apple: "Apple", banana: "Banana",
  sunpetal: "Sunpetal", bloom: "Bloom", lily: "Lily",
  grape: "Grape", rice: "Rice", olive: "Olive",
  sprout_mix: "Sprout Mix",
  fruitful_blend: "Fruitful Blend",
  rapid_root: "Rapid Root",
  earthworm: "Earthworm", grub: "Grub", red_wiggler: "Red Wiggler",
  chicken: "Chicken", cow: "Cow", sheep: "Sheep",
};

const MUTANT_EN: Record<string, string> = {
  mutant_sunflower: "Stellar Sunflower",
  mutant_potato:    "Potent Potato",
  mutant_pumpkin:   "Radical Pumpkin",
  mutant_carrot:    "Cosmic Carrot",
  mutant_cabbage:   "Colossal Cabbage",
  mutant_beetroot:  "Bountiful Beetroot",
  mutant_corn:      "Celestial Corn",
  mutant_wheat:     "Wonder Wheat",
  mutant_chicken:   "Mutant Chicken",
  mutant_cow:       "Mutant Cow",
  mutant_sheep:     "Mutant Sheep",
};

function getMutantNameLang(mutantId: string, lang: Language): string {
  if (lang === "en") return MUTANT_EN[mutantId] ?? mutantId;
  // Russian: use names baked into mutants module
  const baseId = mutantId.replace("mutant_", "");
  return CROP_MUTANTS[baseId]?.name ?? ANIMAL_MUTANTS[baseId]?.name ?? mutantId;
}

/** Главная функция — возвращает локализованное имя предмета. */
export function getItemName(id: string, lang: Language = "ru"): string {
  const seedSuffix = lang === "ru" ? "(семя)" : "(seed)";
  const mealPrefix = lang === "ru" ? "Блюдо: "  : "Meal: ";
  const dict = lang === "ru" ? RU : EN;

  if (id.endsWith("_seed")) {
    const crop = id.replace("_seed", "");
    return `${dict[crop] ?? capitalize(crop)} ${seedSuffix}`;
  }
  if (id.startsWith("meal_")) {
    const mealId = id.replace("meal_", "").replace(/_/g, " ");
    return mealPrefix + mealId;
  }
  if (id.startsWith("mutant_")) return getMutantNameLang(id, lang);
  return dict[id] ?? capitalize(id.replace(/_/g, " "));
}

function capitalize(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}
