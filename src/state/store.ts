import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GameState } from "../domain/types/game";
import { createInitialState } from "../domain/types/game";
import type { PanelId, LocationId, CropId, ToolId, FruitId, FlowerId, GreenhouseCropId } from "../domain/types/ids";
import { STORAGE_KEY, CURRENT_VERSION } from "../lib/storage/schemaVersion";
import { migrate } from "../lib/storage/migrations";
import * as cropAct from "./actions/cropActions";
import * as shopAct from "./actions/shopActions";
import * as resAct from "./actions/resourceActions";
import * as expAct from "./actions/expandActions";
import * as cookAct from "./actions/cookActions";
import * as animalAct from "./actions/animalActions";
import * as buildAct from "./actions/buildActions";
import * as hiveAct from "./actions/beehiveActions";
import { pushToQuickbar } from "../domain/inventory/quickbar";
import * as moveAct from "./actions/moveActions";
import * as fishAct from "./actions/fishingActions";
import * as skillAct from "./actions/skillActions";
import * as fruitAct from "./actions/fruitActions";
import * as flowerAct from "./actions/flowerActions";
import * as greenAct from "./actions/greenhouseActions";
import * as gemAct from "./actions/gemActions";
import * as collectAct from "./actions/collectibleActions";
import * as totemAct from "./actions/totemActions";
import * as deliveryAct from "./actions/deliveryActions";
import * as choreAct from "./actions/choreActions";
import * as dailyRewardAct from "./actions/dailyRewardActions";
import * as cropMachineAct from "./actions/cropMachineActions";
import * as tradingAct from "./actions/tradingActions";
import * as factionAct from "./actions/factionActions";
import * as compostAct from "./actions/compostActions";
import * as mutantAct from "./actions/mutantActions";
import { placePending } from "./actions/placementActions";
import { applyPollenBoost, POLLEN_COST } from "./actions/pollenBoostActions";
import { claimVipChest as _claimVipChest } from "./actions/vipChestActions";
import { sfx } from "../lib/sound";
import { toast } from "./toastStore";
import { getCropDef, ISLAND_ORDER } from "../data/crops.data";
import { getLevel } from "../domain/level/level";
import { getCurrentSeason, isCropInSeason, SEASON_INFO } from "../domain/seasons/seasons";
import { RESOURCE_NODES } from "../data/resourceNodes.data";
import { toolForNode, getToolDef } from "../data/tools.data";

export interface StoreActions {
  // UI
  setPanel(id: PanelId | null): void;
  setLocation(loc: LocationId): void;
  selectTool(id: string | null): void;

  // Crops
  plant(x: number, y: number, cropId: CropId): void;
  harvest(x: number, y: number): void;

  // Shop
  buySeed(cropId: CropId, qty: number): void;
  buyFruitSeed(fruitId: FruitId, qty: number): void;
  buyFlowerSeed(flowerId: FlowerId, qty: number): void;
  buyGreenhouseSeed(cropId: GreenhouseCropId, qty: number): void;
  sell(itemId: string, qty: number): void;
  sellAll(itemId: string): void;

  // Crafting
  craftTool(toolId: ToolId, qty: number): void;

  // Resources
  gatherNode(x: number, y: number): void;

  // Cooking
  startCooking(recipeId: string): void;
  collectMeal(slotIndex: number): void;
  feedBumpkin(recipeId: string): void;

  // Buildings
  build(buildingId: string): void;
  upgradeBuilding(buildingId: string): void;

  // Animals
  buyAnimal(kind: string): void;
  feedAnimal(animalId: string): void;
  collectAnimal(animalId: string): void;
  cureAnimal(animalId: string): void;
  sellAnimal(animalId: string): void;

  // Expansion
  startExpansion(): void;
  completeExpansion(): void;
  travelToSpring(): void;
  travelToDesert(): void;
  travelToVolcano(): void;

  // Beehives
  beehiveAction(hiveId: string): void;
  addDemoBeehive(): void;
  buyBeehive(): void;
  upgradeDemoHive(hiveId: string, useInstant: boolean): void;
  upgradeBeehive(hiveId: string): void;
  tickPassive(): void;

  // Fishing
  castLine(baitId: string): void;
  buyBait(baitId: string, qty: number): void;
  sellFish(fishId: string, qty: number): void;

  // Skills
  learnSkill(skillId: string): void;

  // Fruits
  plantFruit(x: number, y: number, fruitId: FruitId): void;
  harvestFruit(x: number, y: number): void;

  // Flowers
  plantFlower(x: number, y: number, flowerId: FlowerId): void;
  harvestFlower(x: number, y: number): void;

  // Greenhouse
  plantGreenhouse(x: number, y: number, cropId: GreenhouseCropId): void;
  harvestGreenhouse(x: number, y: number): void;

  // Gems
  speedUpCrop(x: number, y: number): void;
  speedUpCooking(slotIndex: number): void;
  speedUpExpansion(): void;
  buyOmnifeed(qty: number): void;
  restockShop(): void;

  // Collectibles
  placeCollectible(collectibleId: string): void;
  removeCollectible(collectibleId: string): void;

  // Totems
  activateTotem(totemId: string): void;
  expireTotem(): void;

  // Deliveries
  refreshDeliveries(): void;
  completeDelivery(deliveryId: string): void;

  // Chores
  refreshChores(): void;
  claimChore(choreId: string): void;

  // Daily Reward
  claimDailyReward(): void;

  // Crop Machine
  buildCropMachine(): void;
  addToQueue(cropId: string, qty: number): void;
  collectFromQueue(index: number): void;
  refillOil(qty: number): void;

  // Trading
  createListing(itemId: string, qty: number, pricePerUnit: number): void;
  cancelListing(listingId: string): void;
  buyListing(listingId: string): void;

  // Factions
  joinFaction(factionId: string): void;

  // Pets
  // pets removed (not in original SFL design)

  // Composting
  startCompost(composterId: string): void;
  collectCompost(slotIndex: number): void;
  applyFertilizer(x: number, y: number, fertilizerId: string): void;

  // Mutants
  placeMutant(mutantId: string): void;
  unplaceMutant(mutantId: string): void;

  // Move
  toggleMoveMode(): void;
  // Pending placements (overflow from expansion)
  placementType: string | null;
  startPlacement(type: string): void;
  cancelPlacement(): void;
  placePendingItem(cx: number, cy: number): void;
  // Pollen boost mode
  pollenBoostMode: boolean;
  togglePollenBoost(): void;
  applyPollenBoost(cx: number, cy: number): void;
  // VIP chest
  claimVipChest(): void;
  cancelMove(): void;

  // Grid click (dispatches correct action based on cell type + selected tool)
  clickCell(x: number, y: number): void;

  // Meta
  resetGame(): void;
  touchActivity(): void;
}

export type Store = GameState & StoreActions;

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      // --- UI actions ---
      setPanel: (id) => set({ activePanel: id }),
      setLocation: (loc) => set({ activeLocation: loc, activePanel: null }),
      selectTool: (id) =>
        set((s) => {
          if (id === s.selectedTool) return { selectedTool: null };
          return {
            selectedTool: id,
            quickbar: id ? pushToQuickbar(s.quickbar, id) : s.quickbar,
          };
        }),

      // --- Crops ---
      plant: (x, y, cropId) =>
        set((s) => {
          const next = cropAct.plant(s, x, y, cropId, Date.now());
          if (next === s) {
            // Diagnose why plant failed — give specific feedback
            const cell = s.cells[`${x},${y}`];
            if (!cell || cell.type !== "plot") { toast("Это не грядка", "error"); return s; }
            if (cell.cropId) { toast("Грядка уже занята", "error"); return s; }
            const seedId = `${cropId}_seed`;
            if ((s.inventory[seedId] ?? 0) < 1) { toast("Нет семян", "error"); return s; }
            const def = getCropDef(cropId);
            const lvl = getLevel(s.xp);
            if (lvl < def.level) { toast(`Нужен уровень ${def.level} (у тебя ${lvl})`, "error"); return s; }
            if (def.minIsland && ISLAND_ORDER[s.island] < ISLAND_ORDER[def.minIsland]) {
              toast(`Доступно только на острове ${def.minIsland}`, "error"); return s;
            }
            if (s.island !== "basic" && def.seasons !== "all") {
              const season = getCurrentSeason(Date.now(), s.seasonAnchor);
              if (!isCropInSeason(def.seasons, season)) {
                const names = (def.seasons as string[]).map((x) => SEASON_INFO[x as keyof typeof SEASON_INFO].name).join("/");
                toast(`Не сезон: нужен ${names}`, "error"); return s;
              }
            }
            toast("Нельзя посадить", "error");
            return s;
          }
          sfx.plant();
          return { ...next, quickbar: pushToQuickbar(next.quickbar, `${cropId}_seed`) };
        }),
      harvest: (x, y) =>
        set((s) => {
          const key = `${x},${y}`;
          const cropId = s.cells[key]?.cropId;
          const next = cropAct.harvest(s, x, y, Date.now());
          if (next === s) { toast("Урожай ещё не готов", "error"); return s; }
          sfx.harvest();
          return { ...next, quickbar: cropId ? pushToQuickbar(next.quickbar, cropId) : next.quickbar };
        }),

      // --- Shop ---
      buySeed: (cropId, qty) =>
        set((s) => {
          const next = shopAct.buySeed(s, cropId, qty, Date.now());
          return next === s ? s : { ...next, quickbar: pushToQuickbar(next.quickbar, `${cropId}_seed`) };
        }),
      buyFruitSeed: (fruitId, qty) =>
        set((s) => {
          const next = shopAct.buyFruitSeed(s, fruitId, qty, Date.now());
          return next === s ? s : { ...next, quickbar: pushToQuickbar(next.quickbar, `${fruitId}_seed`) };
        }),
      buyFlowerSeed: (flowerId, qty) =>
        set((s) => {
          const next = shopAct.buyFlowerSeed(s, flowerId, qty, Date.now());
          return next === s ? s : { ...next, quickbar: pushToQuickbar(next.quickbar, `${flowerId}_seed`) };
        }),
      buyGreenhouseSeed: (cropId, qty) =>
        set((s) => {
          const next = shopAct.buyGreenhouseSeed(s, cropId, qty, Date.now());
          return next === s ? s : { ...next, quickbar: pushToQuickbar(next.quickbar, `${cropId}_seed`) };
        }),
      sell: (itemId, qty) =>
        set((s) => shopAct.sell(s, itemId, qty)),
      sellAll: (itemId) =>
        set((s) => shopAct.sellAll(s, itemId)),

      // --- Crafting ---
      craftTool: (toolId, qty) =>
        set((s) => {
          const next = shopAct.craftTool(s, toolId, qty);
          return next === s ? s : { ...next, quickbar: pushToQuickbar(next.quickbar, toolId) };
        }),

      // --- Resources ---
      gatherNode: (x, y) =>
        set((s) => {
          const next = resAct.gatherNode(s, x, y, Date.now());
          if (next === s) {
            // Diagnose why the hit failed
            const key = `${x},${y}`;
            const cell = s.cells[key];
            const realKey = cell?.parentKey ?? key;
            const realCell = s.cells[realKey];
            if (!realCell) { toast("Здесь ничего нет", "error"); return s; }
            const nodeDef = RESOURCE_NODES[realCell.type];
            if (!nodeDef) { toast("Это не нода", "error"); return s; }
            // Cooldown check
            const cd = nodeDef.cooldownMs;
            const last = realCell.lastHarvest ?? 0;
            const remaining = (last + cd) - Date.now();
            if (remaining > 0) {
              const hours = Math.floor(remaining / 3600000);
              const mins = Math.floor((remaining % 3600000) / 60000);
              toast(`Восстанавливается ${hours > 0 ? hours + 'ч ' : ''}${mins}м`, "error"); return s;
            }
            // Exhausted check
            if (nodeDef.maxNodes >= 0 && (realCell.hitsLeft ?? 0) <= 0) {
              toast("Нода истощена — нужно расширить остров чтобы восстановить", "error"); return s;
            }
            // Tool check
            const toolId = toolForNode(realCell.type);
            if (toolId && (s.inventory[toolId] ?? 0) < 1) {
              const toolDef = getToolDef(toolId);
              toast(`Нет инструмента: нужен ${toolDef.name} ${toolDef.emoji}`, "error"); return s;
            }
            toast("Нельзя добыть", "error");
            return s;
          }
          // Tree → chop sound, ore → mine sound
          if (s.cells[`${x},${y}`]?.type === "tree" || s.cells[s.cells[`${x},${y}`]?.parentKey ?? ""]?.type === "tree") sfx.chop();
          else sfx.mine();
          return next;
        }),

      // --- Cooking ---
      startCooking: (recipeId) =>
        set((s) => cookAct.startCooking(s, recipeId as any, Date.now())),
      collectMeal: (slotIndex) =>
        set((s) => cookAct.collectMeal(s, slotIndex, Date.now())),
      feedBumpkin: (recipeId) =>
        set((s) => cookAct.feedBumpkin(s, recipeId as any, Date.now())),

      // --- Buildings ---
      build: (buildingId) =>
        set((s) => {
          const next = buildAct.build(s, buildingId as any, Date.now());
          if (next === s) {
            if (s.buildings.includes(buildingId as any)) toast("Уже построено (один экземпляр)", "error");
            else toast("Не хватает места, ресурсов или уровня", "error");
            return s;
          }
          sfx.build();
          return next;
        }),
      upgradeBuilding: (buildingId) =>
        set((s) => {
          const next = buildAct.upgradeBuilding(s, buildingId as any, Date.now());
          if (next === s) { toast("Не хватает ресурсов для апгрейда или максимум", "error"); return s; }
          return next;
        }),

      // --- Animals ---
      buyAnimal: (kind) =>
        set((s) => animalAct.buyAnimal(s, kind as any, Date.now())),
      feedAnimal: (animalId) =>
        set((s) => animalAct.feedAnimal(s, animalId, Date.now())),
      collectAnimal: (animalId) =>
        set((s) => animalAct.collectAnimal(s, animalId, Date.now())),
      cureAnimal: (animalId) =>
        set((s) => {
          const next = animalAct.cureAnimal(s, animalId);
          if (next === s) toast("Нужны лимон 🍋 и мёд 🍯 для лечения", "error");
          return next;
        }),
      sellAnimal: (animalId) =>
        set((s) => animalAct.sellAnimal(s, animalId)),

      // --- Expansion ---
      startExpansion: () =>
        set((s) => {
          const next = expAct.startExpansion(s, Date.now());
          if (next === s) toast("Недостаточно ресурсов или уровня для расширения", "error");
          return next;
        }),
      completeExpansion: () =>
        set((s) => {
          const next = expAct.completeExpansion(s, Date.now());
          if (next !== s) sfx.expand();
          return next;
        }),
      travelToSpring: () =>
        set((s) => expAct.travelToSpring(s, Date.now())),
      travelToDesert: () =>
        set((s) => expAct.travelToDesert(s, Date.now())),
      travelToVolcano: () =>
        set((s) => expAct.travelToVolcano(s, Date.now())),

      // --- Beehives ---
      beehiveAction: (hiveId) =>
        set((s) => hiveAct.beehiveAction(s, hiveId, Date.now())),
      addDemoBeehive: () =>
        set((s) => hiveAct.addDemoBeehive(s, Date.now())),
      buyBeehive: () =>
        set((s) => hiveAct.buyBeehive(s, Date.now())),
      upgradeDemoHive: (hiveId, useInstant) =>
        set((s) => hiveAct.upgradeDemoHive(s, hiveId, useInstant, Date.now())),
      upgradeBeehive: (hiveId) =>
        set((s) => hiveAct.upgradeBeehive(s, hiveId, Date.now())),
      tickPassive: () =>
        set((s) => hiveAct.accruePassivePollen(s, Date.now())),

      // --- Fishing ---
      castLine: (baitId) =>
        set((s) => fishAct.castLine(s, baitId, Date.now())),
      buyBait: (baitId, qty) =>
        set((s) => fishAct.buyBait(s, baitId, qty)),
      sellFish: (fishId, qty) =>
        set((s) => fishAct.sellFish(s, fishId, qty)),

      // --- Skills ---
      learnSkill: (skillId) =>
        set((s) => {
          const next = skillAct.learnSkill(s, skillId);
          if (next === s) toast("Нет очков навыков или требования не выполнены", "error");
          return next;
        }),

      // --- Fruits ---
      plantFruit: (x, y, fruitId) =>
        set((s) => {
          const next = fruitAct.plantFruit(s, x, y, fruitId, Date.now());
          return next === s ? s : { ...next, quickbar: pushToQuickbar(next.quickbar, `${fruitId}_seed`) };
        }),
      harvestFruit: (x, y) =>
        set((s) => fruitAct.harvestFruit(s, x, y, Date.now())),

      // --- Flowers ---
      plantFlower: (x, y, flowerId) =>
        set((s) => {
          const next = flowerAct.plantFlower(s, x, y, flowerId, Date.now());
          return next === s ? s : { ...next, quickbar: pushToQuickbar(next.quickbar, `${flowerId}_seed`) };
        }),
      harvestFlower: (x, y) =>
        set((s) => flowerAct.harvestFlower(s, x, y, Date.now())),

      // --- Greenhouse ---
      plantGreenhouse: (x, y, cropId) =>
        set((s) => {
          const next = greenAct.plantGreenhouse(s, x, y, cropId, Date.now());
          return next === s ? s : { ...next, quickbar: pushToQuickbar(next.quickbar, `${cropId}_seed`) };
        }),
      harvestGreenhouse: (x, y) =>
        set((s) => greenAct.harvestGreenhouse(s, x, y, Date.now())),

      // --- Gems ---
      speedUpCrop: (x, y) =>
        set((s) => gemAct.speedUpCrop(s, x, y, Date.now())),
      speedUpCooking: (slotIndex) =>
        set((s) => gemAct.speedUpCooking(s, slotIndex, Date.now())),
      speedUpExpansion: () =>
        set((s) => gemAct.speedUpExpansion(s, Date.now())),
      buyOmnifeed: (qty) =>
        set((s) => gemAct.buyOmnifeed(s, qty)),
      restockShop: () =>
        set((s) => gemAct.restockShop(s, Date.now())),

      // --- Collectibles ---
      placeCollectible: (collectibleId) =>
        set((s) => collectAct.placeCollectible(s, collectibleId)),
      removeCollectible: (collectibleId) =>
        set((s) => collectAct.removeCollectible(s, collectibleId)),

      // --- Totems ---
      activateTotem: (totemId) =>
        set((s) => totemAct.activateTotem(s, totemId, Date.now())),
      expireTotem: () =>
        set((s) => totemAct.expireTotem(s, Date.now())),

      // --- Deliveries ---
      refreshDeliveries: () =>
        set((s) => deliveryAct.refreshDeliveries(s, Date.now())),
      completeDelivery: (deliveryId) =>
        set((s) => deliveryAct.completeDelivery(s, deliveryId, Date.now())),

      // --- Chores ---
      refreshChores: () =>
        set((s) => choreAct.refreshChores(s, Date.now())),
      claimChore: (choreId) =>
        set((s) => choreAct.claimChore(s, choreId, Date.now())),

      // --- Daily Reward ---
      claimDailyReward: () =>
        set((s) => {
          const next = dailyRewardAct.claimDailyReward(s, Date.now());
          if (next !== s) sfx.reward();
          return next;
        }),

      // --- Crop Machine ---
      buildCropMachine: () =>
        set((s) => {
          const next = cropMachineAct.buildCropMachine(s, Date.now());
          if (next === s) {
            if (s.cropMachine) toast("Crop Machine уже построен", "error");
            else toast("Нужен Lv 35, остров Desert и ресурсы (8000c, 1250 wood, 125 iron, 50 crimstone)", "error");
            return s;
          }
          return next;
        }),
      addToQueue: (cropId, qty) =>
        set((s) => {
          const next = cropMachineAct.addToQueue(s, cropId, qty, Date.now());
          if (next === s) { toast("Не получилось добавить в очередь (нет машины/семян/масла или очередь полна)", "error"); return s; }
          return next;
        }),
      collectFromQueue: (index) =>
        set((s) => cropMachineAct.collectFromQueue(s, index, Date.now())),
      refillOil: (qty) =>
        set((s) => cropMachineAct.refillOil(s, qty)),

      // --- Trading ---
      createListing: (itemId, qty, pricePerUnit) =>
        set((s) => {
          const next = tradingAct.createListing(s, itemId, qty, pricePerUnit, Date.now());
          if (next === s) { toast("Нельзя выставить лот: нет товара или некорректные параметры", "error"); return s; }
          return next;
        }),
      cancelListing: (listingId) =>
        set((s) => tradingAct.cancelListing(s, listingId)),
      buyListing: (listingId) =>
        set((s) => {
          const lst = s.tradeListings.find((l) => l.id === listingId);
          if (lst && lst.sellerId === s.seed) { toast("Это твой собственный лот", "error"); return s; }
          const next = tradingAct.buyListing(s, listingId, Date.now());
          if (next === s) { toast("Не хватает монет или лот недоступен", "error"); return s; }
          return next;
        }),

      // --- Factions ---
      joinFaction: (factionId) =>
        set((s) => factionAct.joinFaction(s, factionId)),

      // --- Pets ---
      // --- Composting ---
      startCompost: (composterId) =>
        set((s) => {
          const next = compostAct.startCompost(s, composterId, Date.now());
          if (next === s) { toast("Не хватает ингредиентов или уровня для компостера", "error"); return s; }
          return next;
        }),
      collectCompost: (slotIndex) =>
        set((s) => {
          const next = compostAct.collectCompost(s, slotIndex, Date.now());
          if (next === s) { toast("Компост ещё не готов", "error"); return s; }
          return next;
        }),
      applyFertilizer: (x, y, fertilizerId) =>
        set((s) => {
          const next = compostAct.applyFertilizer(s, x, y, fertilizerId, Date.now());
          if (next === s) { toast("Нельзя применить удобрение", "error"); return s; }
          return next;
        }),

      // --- Mutants ---
      placeMutant: (mutantId) =>
        set((s) => {
          const next = mutantAct.placeMutant(s, mutantId);
          if (next === s) { toast("Не получилось поставить мутанта", "error"); return s; }
          toast("Мутант размещён на ферме (+10% урожая)", "success");
          return next;
        }),
      unplaceMutant: (mutantId) =>
        set((s) => {
          const next = mutantAct.unplaceMutant(s, mutantId);
          if (next === s) return s;
          toast("Мутант снят с фермы", "info");
          return next;
        }),

      // --- Pending placements (overflow inventory) ---
      placementType: null as string | null,
      startPlacement: (type) => set({ placementType: type, moveMode: false }),
      cancelPlacement: () => set({ placementType: null }),
      placePendingItem: (cx, cy) =>
        set((s) => {
          if (!s.placementType) return s;
          const next = placePending(s, s.placementType, cx, cy);
          if (next === s) { toast("Эта клетка занята или нужно 2x2 свободного места", "error"); return s; }
          // exit placement mode if no more of that type
          const remaining = next.pendingPlacements?.[s.placementType] ?? 0;
          return { ...next, placementType: remaining > 0 ? s.placementType : null };
        }),

      // --- Pollen boost ---
      pollenBoostMode: false as boolean,
      togglePollenBoost: () => set((s) => ({ pollenBoostMode: !s.pollenBoostMode, placementType: null, moveMode: false })),
      applyPollenBoost: (cx, cy) =>
        set((s) => {
          const next = applyPollenBoost(s, cx, cy, Date.now());
          if (next === s) {
            const cell = s.cells[`${cx},${cy}`];
            const realCell = cell?.parentKey ? s.cells[cell.parentKey] : cell;
            const cost = realCell ? POLLEN_COST[realCell.type] : null;
            if (!realCell) toast("Здесь нечего удобрять", "error");
            else if (cost == null) toast("Эту клетку нельзя удобрять пыльцой", "error");
            else if ((s.pollen ?? 0) < cost) toast(`Не хватает пыльцы (нужно ${cost})`, "error");
            else toast("Не получилось", "error");
            return s;
          }
          sfx.plant();
          return next;
        }),
      // --- VIP Chest ---
      claimVipChest: () =>
        set((s) => {
          const next = _claimVipChest(s, Date.now());
          if (next !== s) sfx.reward();
          return next;
        }),

      // --- Move ---
      toggleMoveMode: () =>
        set((s) => ({ moveMode: !s.moveMode, moveSource: null })),
      cancelMove: () =>
        set((s) => moveAct.cancelMove(s)),

      // --- Grid click dispatcher (uses sparse cells map) ---
      clickCell: (cx, cy) => {
        const s = get();
        let key = `${cx},${cy}`;
        const now = Date.now();

        // Resolve child cell to parent (for 2x2 objects)
        const rawCell = s.cells[key];
        if (rawCell?.parentKey) key = rawCell.parentKey;

        // Pollen boost mode — режим остаётся активен пока попадаем по
        // подходящей неудобренной клетке. Выход только при «промахе»:
        // клик мимо, по уже удобренной клетке, или нехватке пыльцы.
        if (s.pollenBoostMode) {
          const beforePollen = s.pollen ?? 0;
          get().applyPollenBoost(cx, cy);
          const afterPollen = get().pollen ?? 0;
          // Если пыльца не изменилась — никакой апплай не произошёл (промах)
          if (beforePollen === afterPollen) {
            set({ pollenBoostMode: false });
          }
          return;
        }

        // Placement mode handling (overflow inventory)
        if (s.placementType) {
          get().placePendingItem(cx, cy);
          return;
        }

        // Move mode handling
        if (s.moveMode) {
          if (!s.moveSource) {
            // Select source
            const cell = s.cells[key];
            if (cell) {
              set((prev) => moveAct.selectMoveSource(prev, cx, cy, now));
            }
            return;
          } else {
            // Place at target
            if (!s.cells[key]) {
              set((prev) => moveAct.completeMove(prev, cx, cy));
            } else if (key === s.moveSource) {
              // Clicked same cell — deselect
              set({ moveSource: null });
            }
            return;
          }
        }

        const cell = s.cells[key];
        if (!cell) return;

        if (cell.type === "daily_chest") {
          set({ activePanel: "daily_reward" as any });
          return;
        }

        if (cell.type === "plot") {
          // Fertilizer takes priority before harvest/plant if a fertilizer tool is selected
          if (s.selectedTool && (s.selectedTool === "sprout_mix" || s.selectedTool === "rapid_root")) {
            get().applyFertilizer(cx, cy, s.selectedTool);
            return;
          }
          if (cell.cropId && cell.plantedAt) {
            set((prev) => cropAct.harvest(prev, cx, cy, now));
            return;
          }
          if (!cell.cropId && s.selectedTool) {
            const seedMatch = s.selectedTool.match(/^(.+)_seed$/);
            if (seedMatch) {
              get().plant(cx, cy, seedMatch[1] as CropId);
              return;
            }
          }
          return;
        }

        if (cell.type === "fruit_patch") {
          // Fertilizer takes priority before harvest/plant
          if (s.selectedTool === "fruitful_blend") {
            get().applyFertilizer(cx, cy, s.selectedTool);
            return;
          }
          // Stump (harvestsLeft===0): require axe to clear
          if (cell.fruitHarvestsLeft === 0 && !cell.fruitId) {
            if (s.selectedTool === "axe") {
              const before = get().inventory.axe ?? 0;
              set((prev) => fruitAct.cutSapling(prev, cx, cy, now));
              const after = get().inventory.axe ?? 0;
              if (after === before) toast("Нет топора для срубки пенька", "error");
            } else {
              toast("Возьми топор чтобы срубить пенёк (древесину не даёт)", "error");
            }
            return;
          }
          if (cell.fruitId && cell.fruitPlantedAt) {
            set((prev) => fruitAct.harvestFruit(prev, cx, cy, now));
            return;
          }
          if (!cell.fruitId && s.selectedTool) {
            const seedMatch = s.selectedTool.match(/^(.+)_seed$/);
            if (seedMatch) {
              set((prev) => fruitAct.plantFruit(prev, cx, cy, seedMatch[1] as FruitId, now));
              return;
            }
          }
          return;
        }

        if (cell.type === "flower_bed") {
          if (cell.flowerId && cell.flowerPlantedAt) {
            set((prev) => flowerAct.harvestFlower(prev, cx, cy, now));
            return;
          }
          if (!cell.flowerId && s.selectedTool) {
            const seedMatch = s.selectedTool.match(/^(.+)_seed$/);
            if (seedMatch) {
              set((prev) => flowerAct.plantFlower(prev, cx, cy, seedMatch[1] as FlowerId, now));
              return;
            }
          }
          return;
        }

        if (cell.type === "greenhouse") {
          if (cell.greenhouseCropId && cell.greenhousePlantedAt) {
            set((prev) => greenAct.harvestGreenhouse(prev, cx, cy, now));
            return;
          }
          if (!cell.greenhouseCropId && s.selectedTool) {
            const seedMatch = s.selectedTool.match(/^(.+)_seed$/);
            if (seedMatch) {
              set((prev) => greenAct.plantGreenhouse(prev, cx, cy, seedMatch[1] as GreenhouseCropId, now));
              return;
            }
          }
          return;
        }

        if (["tree", "rock", "iron", "gold", "crimstone", "oil_reserve", "obsidian_rock", "sunstone_rock", "lava_pit"].includes(cell.type)) {
          // Use parent key coords (for 2x2 objects)
          const [pcx, pcy] = key.split(",").map(Number);
          set((prev) => resAct.gatherNode(prev, pcx, pcy, now));
          return;
        }

        if (cell.type === "building") {
          const panelMap: Record<string, string> = {
            market: "shop",
            workbench: "build",   // Tools + Buildings in one panel
            campfire: "cook",
            kitchen: "cook",
            bakery: "cook",
            feeder: "animals",
            toolshed: "craft",
            henhouse: "__henhouse",
            barn: "__barn",
            bulletin_board: "deliveries",
            trading_post: "trading",
            fishing_dock: "fishing",
            pet_house: "pets",
            town_hall: "faction",
          };
          const bid = cell.buildingId ?? "";
          const target = panelMap[bid];
          if (target === "__henhouse") {
            set({ activeLocation: "henhouse", activePanel: null });
          } else if (target === "__barn") {
            set({ activeLocation: "barn", activePanel: null });
          } else if (target) {
            set((prev) => ({
              activePanel: prev.activePanel === target ? null : target as any,
            }));
          }
          return;
        }
      },

      // --- Meta ---
      resetGame: () => set(createInitialState()),
      touchActivity: () => set({ lastMeaningfulActivity: Date.now() }),
    }),
    {
      name: STORAGE_KEY,
      version: CURRENT_VERSION,
      migrate: (persisted, version) => {
        if (version === CURRENT_VERSION) return persisted as Store;
        return migrate(persisted) as unknown as Store;
      },
      partialize: (state) => {
        // Exclude transient action functions from persistence
        const { setPanel, setLocation, selectTool, plant, harvest,
          buySeed, buyFruitSeed, buyFlowerSeed, buyGreenhouseSeed,
          sell, sellAll, craftTool, gatherNode, clickCell,
          startCooking, collectMeal, feedBumpkin,
          build: _build, upgradeBuilding: _upgradeBuilding,
          buyAnimal, feedAnimal, collectAnimal, cureAnimal, sellAnimal,
          beehiveAction, addDemoBeehive, buyBeehive, upgradeDemoHive, upgradeBeehive, tickPassive,
          castLine, buyBait, sellFish,
          learnSkill,
          plantFruit, harvestFruit,
          plantFlower, harvestFlower,
          plantGreenhouse, harvestGreenhouse,
          speedUpCrop, speedUpCooking, speedUpExpansion,
          buyOmnifeed, restockShop,
          placeCollectible, removeCollectible,
          activateTotem, expireTotem,
          refreshDeliveries, completeDelivery,
          refreshChores, claimChore,
          claimDailyReward,
          buildCropMachine, addToQueue, collectFromQueue, refillOil,
          createListing: _createListing, cancelListing: _cancelListing, buyListing: _buyListing,
          joinFaction,
          toggleMoveMode, cancelMove,
          startExpansion, completeExpansion, travelToSpring, travelToDesert, travelToVolcano,
          resetGame, touchActivity, ...data } = state;
        return data;
      },
    },
  ),
);

// Expose store for dev/testing access via console or e2e
if (typeof window !== "undefined") {
  (window as any).__store = useStore;
}

// Sync to Supabase (debounced) on every meaningful state change
import { schedulePush } from "../lib/supabase/sync";
useStore.subscribe((state) => {
  // Skip transient UI fields
  schedulePush(state as any);
});
