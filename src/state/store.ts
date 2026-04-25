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
import * as petAct from "./actions/petActions";
import { toast } from "./toastStore";

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
  adoptPet(petId: string): void;
  napPet(petId: string): void;
  feedPet(petId: string): void;

  // Move
  toggleMoveMode(): void;
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
          if (next === s) { toast("Нельзя посадить: нет семян или требования не выполнены", "error"); return s; }
          return { ...next, quickbar: pushToQuickbar(next.quickbar, `${cropId}_seed`) };
        }),
      harvest: (x, y) =>
        set((s) => {
          const key = `${x},${y}`;
          const cropId = s.cells[key]?.cropId;
          const next = cropAct.harvest(s, x, y, Date.now());
          if (next === s) { toast("Урожай ещё не готов", "error"); return s; }
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
          if (next === s) toast("Нет инструмента или узел на кулдауне", "error");
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
        set((s) => buildAct.build(s, buildingId as any, Date.now())),
      upgradeBuilding: (buildingId) =>
        set((s) => buildAct.upgradeBuilding(s, buildingId as any, Date.now())),

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
        set((s) => expAct.completeExpansion(s, Date.now())),
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
        set((s) => dailyRewardAct.claimDailyReward(s, Date.now())),

      // --- Crop Machine ---
      buildCropMachine: () =>
        set((s) => cropMachineAct.buildCropMachine(s, Date.now())),
      addToQueue: (cropId, qty) =>
        set((s) => cropMachineAct.addToQueue(s, cropId, qty, Date.now())),
      collectFromQueue: (index) =>
        set((s) => cropMachineAct.collectFromQueue(s, index, Date.now())),
      refillOil: (qty) =>
        set((s) => cropMachineAct.refillOil(s, qty)),

      // --- Trading ---
      createListing: (itemId, qty, pricePerUnit) =>
        set((s) => tradingAct.createListing(s, itemId, qty, pricePerUnit, Date.now())),
      cancelListing: (listingId) =>
        set((s) => tradingAct.cancelListing(s, listingId)),
      buyListing: (listingId) =>
        set((s) => tradingAct.buyListing(s, listingId, Date.now())),

      // --- Factions ---
      joinFaction: (factionId) =>
        set((s) => factionAct.joinFaction(s, factionId)),

      // --- Pets ---
      adoptPet: (petId) =>
        set((s) => petAct.adoptPet(s, petId, Date.now())),
      napPet: (petId) =>
        set((s) => petAct.napPet(s, petId, Date.now())),
      feedPet: (petId) =>
        set((s) => {
          const next = petAct.feedPet(s, petId, Date.now());
          if (next === s) toast("Нужна пшеница 🌾 для кормления питомца", "error");
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

        if (cell.type === "plot") {
          if (cell.cropId && cell.plantedAt) {
            set((prev) => cropAct.harvest(prev, cx, cy, now));
            return;
          }
          if (!cell.cropId && s.selectedTool) {
            const seedMatch = s.selectedTool.match(/^(.+)_seed$/);
            if (seedMatch) {
              set((prev) => cropAct.plant(prev, cx, cy, seedMatch[1] as CropId, now));
              return;
            }
          }
          return;
        }

        if (cell.type === "fruit_patch") {
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
          joinFaction, adoptPet, napPet, feedPet,
          toggleMoveMode, cancelMove,
          startExpansion, completeExpansion, travelToSpring, travelToDesert, travelToVolcano,
          resetGame, touchActivity, ...data } = state;
        return data;
      },
    },
  ),
);
