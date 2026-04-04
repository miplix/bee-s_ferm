"use client";

import { useState, useCallback } from "react";
import type { PlacedObject, DroppedResource, InventoryStack } from "@/types";
import { GRID_COLS, GRID_ROWS, ITEM_DEFS, CROP_DEFS, RESOURCE_DEFS, generateInitialScenery, STARTING_COINS } from "./config";

let nextId = 1;
function uid() { return `obj_${nextId++}_${Date.now()}`; }

export interface FarmState {
  objects: PlacedObject[];
  drops: DroppedResource[];
  inventory: InventoryStack[];
  coins: number;
  xp: number;
  mode: "idle" | "placing" | "moving" | "destroying" | "planting";
  selectedItem: string | null;
  selectedObject: PlacedObject | null;
  destroyTimer: number | null;
  menuOpen: boolean;
  shopOpen: boolean;
  plantingCrop: string | null; // crop type being planted
}

function initState(): FarmState {
  const sceneryDefs = generateInitialScenery();
  const objects: PlacedObject[] = sceneryDefs.map((s) => ({
    id: uid(), object_type: s.type, grid_x: s.x, grid_y: s.y,
    is_scenery: s.type !== "field",
  }));

  return {
    objects, drops: [],
    inventory: [
      { item_type: "fence", count: 5 },
      { item_type: "field", count: 3 },
      { item_type: "scarecrow", count: 1 },
    ],
    coins: STARTING_COINS,
    xp: 0,
    mode: "idle", selectedItem: null, selectedObject: null,
    destroyTimer: null, menuOpen: false, shopOpen: false, plantingCrop: null,
  };
}

export function useGameState() {
  const [state, setState] = useState<FarmState>(initState);

  // === INVENTORY ===
  const startPlacing = useCallback((itemType: string) => {
    setState((s) => ({ ...s, mode: "placing", selectedItem: itemType, selectedObject: null, menuOpen: false }));
  }, []);

  const confirmPlacement = useCallback((x: number, y: number) => {
    setState((s) => {
      if (s.mode !== "placing" || !s.selectedItem) return s;
      if (x < 0 || x >= GRID_COLS || y < 0 || y >= GRID_ROWS) return s;
      if (s.objects.some((o) => o.grid_x === x && o.grid_y === y)) return s;
      const inv = s.inventory.map((i) => i.item_type === s.selectedItem ? { ...i, count: i.count - 1 } : i).filter((i) => i.count > 0);
      const newObj: PlacedObject = { id: uid(), object_type: s.selectedItem, grid_x: x, grid_y: y, is_scenery: false };
      return { ...s, objects: [...s.objects, newObj], inventory: inv, mode: "idle", selectedItem: null };
    });
  }, []);

  const cancelAction = useCallback(() => {
    setState((s) => ({ ...s, mode: "idle", selectedItem: null, selectedObject: null, destroyTimer: null, menuOpen: false, plantingCrop: null }));
  }, []);

  const selectObject = useCallback((obj: PlacedObject) => {
    setState((s) => ({ ...s, selectedObject: obj, menuOpen: true }));
  }, []);

  const closeMenu = useCallback(() => {
    setState((s) => ({ ...s, selectedObject: null, menuOpen: false }));
  }, []);

  const pickupObject = useCallback((objId: string) => {
    setState((s) => {
      const obj = s.objects.find((o) => o.id === objId);
      if (!obj || obj.is_scenery) return s;
      if (obj.crop) return s; // can't pickup field with crop
      const inv = [...s.inventory];
      const ex = inv.find((i) => i.item_type === obj.object_type);
      if (ex) ex.count += 1; else inv.push({ item_type: obj.object_type, count: 1 });
      return { ...s, objects: s.objects.filter((o) => o.id !== objId), inventory: inv, selectedObject: null, menuOpen: false };
    });
  }, []);

  // === DESTROY SCENERY ===
  const startDestroy = useCallback((objId: string) => {
    setState((s) => {
      const obj = s.objects.find((o) => o.id === objId);
      if (!obj || !obj.is_scenery) return s;
      return { ...s, mode: "destroying", selectedObject: obj, destroyTimer: ITEM_DEFS[obj.object_type]?.destroyTime || 3000, menuOpen: false };
    });
  }, []);

  const completeDestroy = useCallback((objId: string) => {
    setState((s) => {
      const obj = s.objects.find((o) => o.id === objId);
      if (!obj) return s;
      const def = ITEM_DEFS[obj.object_type];
      const newDrops = [...s.drops];
      if (def?.dropType && def.dropAmount) {
        newDrops.push({ id: uid(), resource_type: def.dropType, amount: def.dropAmount, grid_x: obj.grid_x, grid_y: obj.grid_y });
      }
      return { ...s, objects: s.objects.filter((o) => o.id !== objId), drops: newDrops, mode: "idle", selectedObject: null, destroyTimer: null };
    });
  }, []);

  const collectDrop = useCallback((dropId: string) => {
    setState((s) => {
      const drop = s.drops.find((d) => d.id === dropId);
      if (!drop) return s;
      const inv = [...s.inventory];
      const ex = inv.find((i) => i.item_type === drop.resource_type);
      if (ex) ex.count += drop.amount; else inv.push({ item_type: drop.resource_type, count: drop.amount });
      return { ...s, drops: s.drops.filter((d) => d.id !== dropId), inventory: inv, selectedObject: null, menuOpen: false };
    });
  }, []);

  // === MOVE ===
  const startMoving = useCallback((objId: string) => {
    setState((s) => {
      const obj = s.objects.find((o) => o.id === objId);
      if (!obj || obj.is_scenery) return s;
      return { ...s, mode: "moving", selectedObject: obj, menuOpen: false };
    });
  }, []);

  const confirmMove = useCallback((x: number, y: number) => {
    setState((s) => {
      if (s.mode !== "moving" || !s.selectedObject) return s;
      if (x < 0 || x >= GRID_COLS || y < 0 || y >= GRID_ROWS) return s;
      if (s.objects.some((o) => o.grid_x === x && o.grid_y === y && o.id !== s.selectedObject!.id)) return s;
      return { ...s, objects: s.objects.map((o) => o.id === s.selectedObject!.id ? { ...o, grid_x: x, grid_y: y } : o), mode: "idle", selectedObject: null };
    });
  }, []);

  // === CROPS ===
  const plantCrop = useCallback((fieldId: string, cropType: string) => {
    setState((s) => {
      const field = s.objects.find((o) => o.id === fieldId);
      if (!field || field.crop) return s;
      const def = ITEM_DEFS[field.object_type];
      if (!def?.isField) return s;
      const cropDef = CROP_DEFS[cropType];
      if (!cropDef) return s;
      // Check if player has seeds
      const seedKey = `${cropType}_seed`;
      const seedStack = s.inventory.find((i) => i.item_type === seedKey);
      if (!seedStack || seedStack.count < 1) return s;
      const inv = s.inventory.map((i) => i.item_type === seedKey ? { ...i, count: i.count - 1 } : i).filter((i) => i.count > 0);
      return {
        ...s,
        objects: s.objects.map((o) => o.id === fieldId ? { ...o, crop: cropType, plantedAt: Date.now(), growthDuration: cropDef.growthTime } : o),
        inventory: inv, selectedObject: null, menuOpen: false, plantingCrop: null,
      };
    });
  }, []);

  const harvestCrop = useCallback((fieldId: string) => {
    setState((s) => {
      const field = s.objects.find((o) => o.id === fieldId);
      if (!field?.crop || !field.plantedAt || !field.growthDuration) return s;
      const elapsed = Date.now() - field.plantedAt;
      if (elapsed < field.growthDuration) return s; // not ready
      const cropDef = CROP_DEFS[field.crop];
      if (!cropDef) return s;
      const harvestKey = `${field.crop}_harvest`;
      const inv = [...s.inventory];
      const ex = inv.find((i) => i.item_type === harvestKey);
      if (ex) ex.count += cropDef.harvestAmount; else inv.push({ item_type: harvestKey, count: cropDef.harvestAmount });
      return {
        ...s,
        objects: s.objects.map((o) => o.id === fieldId ? { ...o, crop: undefined, plantedAt: undefined, growthDuration: undefined } : o),
        inventory: inv, xp: s.xp + cropDef.xp, selectedObject: null, menuOpen: false,
      };
    });
  }, []);

  // === SHOP ===
  const toggleShop = useCallback(() => {
    setState((s) => ({ ...s, shopOpen: !s.shopOpen, menuOpen: false, selectedObject: null }));
  }, []);

  const buySeed = useCallback((cropType: string, qty: number) => {
    setState((s) => {
      const cropDef = CROP_DEFS[cropType];
      if (!cropDef) return s;
      const cost = cropDef.seedPrice * qty;
      if (s.coins < cost) return s;
      const seedKey = `${cropType}_seed`;
      const inv = [...s.inventory];
      const ex = inv.find((i) => i.item_type === seedKey);
      if (ex) ex.count += qty; else inv.push({ item_type: seedKey, count: qty });
      return { ...s, coins: s.coins - cost, inventory: inv };
    });
  }, []);

  const buyItem = useCallback((itemType: string, price: number, qty: number) => {
    setState((s) => {
      const cost = price * qty;
      if (s.coins < cost) return s;
      const inv = [...s.inventory];
      const ex = inv.find((i) => i.item_type === itemType);
      if (ex) ex.count += qty; else inv.push({ item_type: itemType, count: qty });
      return { ...s, coins: s.coins - cost, inventory: inv };
    });
  }, []);

  const sellItem = useCallback((itemType: string, qty: number) => {
    setState((s) => {
      const stack = s.inventory.find((i) => i.item_type === itemType);
      if (!stack || stack.count < qty) return s;
      const resDef = RESOURCE_DEFS[itemType];
      const price = resDef?.sellPrice || 1;
      const inv = s.inventory.map((i) => i.item_type === itemType ? { ...i, count: i.count - qty } : i).filter((i) => i.count > 0);
      return { ...s, coins: s.coins + price * qty, inventory: inv };
    });
  }, []);

  return {
    state, startPlacing, confirmPlacement, cancelAction,
    selectObject, closeMenu, pickupObject,
    startDestroy, completeDestroy, collectDrop,
    startMoving, confirmMove,
    plantCrop, harvestCrop,
    toggleShop, buySeed, buyItem, sellItem,
  };
}
