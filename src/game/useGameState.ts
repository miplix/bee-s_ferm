"use client";

import { useState, useCallback } from "react";
import type { PlacedObject, DroppedResource, InventoryStack } from "@/types";
import { GRID_COLS, GRID_ROWS, ITEM_DEFS, generateInitialScenery } from "./config";

let nextId = 1;
function uid() { return `obj_${nextId++}_${Date.now()}`; }

export interface FarmState {
  objects: PlacedObject[];
  drops: DroppedResource[];
  inventory: InventoryStack[];
  mode: "idle" | "placing" | "moving" | "destroying";
  selectedItem: string | null;       // item_type being placed
  selectedObject: PlacedObject | null; // object being interacted with
  destroyTimer: number | null;        // ms remaining
  menuOpen: boolean;
}

function initState(): FarmState {
  const scenery = generateInitialScenery();
  const objects: PlacedObject[] = scenery.map((s) => ({
    id: uid(),
    object_type: s.type,
    grid_x: s.x,
    grid_y: s.y,
    is_scenery: true,
  }));

  // Give player some starting items
  const inventory: InventoryStack[] = [
    { item_type: "fence", count: 5 },
    { item_type: "flower_bed", count: 3 },
    { item_type: "campfire", count: 1 },
    { item_type: "chest", count: 2 },
    { item_type: "scarecrow", count: 1 },
  ];

  return {
    objects,
    drops: [],
    inventory,
    mode: "idle",
    selectedItem: null,
    selectedObject: null,
    destroyTimer: null,
    menuOpen: false,
  };
}

export function useGameState() {
  const [state, setState] = useState<FarmState>(initState);

  const isOccupied = useCallback((x: number, y: number, excludeId?: string) => {
    return state.objects.some(
      (o) => o.grid_x === x && o.grid_y === y && o.id !== excludeId
    );
  }, [state.objects]);

  const addToInventory = useCallback((itemType: string, count: number) => {
    setState((s) => {
      const inv = [...s.inventory];
      const existing = inv.find((i) => i.item_type === itemType);
      if (existing) {
        existing.count += count;
      } else {
        inv.push({ item_type: itemType, count });
      }
      return { ...s, inventory: inv };
    });
  }, []);

  const removeFromInventory = useCallback((itemType: string, count: number) => {
    setState((s) => {
      const inv = s.inventory
        .map((i) => i.item_type === itemType ? { ...i, count: i.count - count } : i)
        .filter((i) => i.count > 0);
      return { ...s, inventory: inv };
    });
  }, []);

  // Start placing an item from inventory
  const startPlacing = useCallback((itemType: string) => {
    setState((s) => ({
      ...s,
      mode: "placing",
      selectedItem: itemType,
      selectedObject: null,
    }));
  }, []);

  // Confirm placement at grid position
  const confirmPlacement = useCallback((x: number, y: number) => {
    setState((s) => {
      if (s.mode !== "placing" || !s.selectedItem) return s;
      if (x < 0 || x >= GRID_COLS || y < 0 || y >= GRID_ROWS) return s;
      if (s.objects.some((o) => o.grid_x === x && o.grid_y === y)) return s;

      const inv = s.inventory
        .map((i) => i.item_type === s.selectedItem ? { ...i, count: i.count - 1 } : i)
        .filter((i) => i.count > 0);

      const newObj: PlacedObject = {
        id: uid(),
        object_type: s.selectedItem,
        grid_x: x,
        grid_y: y,
        is_scenery: false,
      };

      return {
        ...s,
        objects: [...s.objects, newObj],
        inventory: inv,
        mode: "idle",
        selectedItem: null,
      };
    });
  }, []);

  // Cancel current action
  const cancelAction = useCallback(() => {
    setState((s) => ({
      ...s,
      mode: "idle",
      selectedItem: null,
      selectedObject: null,
      destroyTimer: null,
    }));
  }, []);

  // Select an object on the grid (tap on it)
  const selectObject = useCallback((obj: PlacedObject) => {
    setState((s) => ({ ...s, selectedObject: obj, menuOpen: true }));
  }, []);

  // Close object menu
  const closeMenu = useCallback(() => {
    setState((s) => ({ ...s, selectedObject: null, menuOpen: false }));
  }, []);

  // Pick up a placed object (non-scenery) back to inventory
  const pickupObject = useCallback((objId: string) => {
    setState((s) => {
      const obj = s.objects.find((o) => o.id === objId);
      if (!obj || obj.is_scenery) return s;

      const inv = [...s.inventory];
      const existing = inv.find((i) => i.item_type === obj.object_type);
      if (existing) {
        existing.count += 1;
      } else {
        inv.push({ item_type: obj.object_type, count: 1 });
      }

      return {
        ...s,
        objects: s.objects.filter((o) => o.id !== objId),
        inventory: inv,
        selectedObject: null,
        menuOpen: false,
      };
    });
  }, []);

  // Start destroying a scenery object
  const startDestroy = useCallback((objId: string) => {
    const obj = state.objects.find((o) => o.id === objId);
    if (!obj || !obj.is_scenery) return;
    const def = ITEM_DEFS[obj.object_type];
    if (!def) return;

    setState((s) => ({
      ...s,
      mode: "destroying",
      selectedObject: obj,
      destroyTimer: def.destroyTime,
      menuOpen: false,
    }));
  }, [state.objects]);

  // Complete destruction — remove object, create drop
  const completeDestroy = useCallback((objId: string) => {
    setState((s) => {
      const obj = s.objects.find((o) => o.id === objId);
      if (!obj) return s;
      const def = ITEM_DEFS[obj.object_type];

      const newDrops = [...s.drops];
      if (def?.dropType && def.dropAmount) {
        newDrops.push({
          id: uid(),
          resource_type: def.dropType,
          amount: def.dropAmount,
          grid_x: obj.grid_x,
          grid_y: obj.grid_y,
        });
      }

      return {
        ...s,
        objects: s.objects.filter((o) => o.id !== objId),
        drops: newDrops,
        mode: "idle",
        selectedObject: null,
        destroyTimer: null,
      };
    });
  }, []);

  // Collect a dropped resource
  const collectDrop = useCallback((dropId: string) => {
    setState((s) => {
      const drop = s.drops.find((d) => d.id === dropId);
      if (!drop) return s;

      const inv = [...s.inventory];
      const existing = inv.find((i) => i.item_type === drop.resource_type);
      if (existing) {
        existing.count += drop.amount;
      } else {
        inv.push({ item_type: drop.resource_type, count: drop.amount });
      }

      return {
        ...s,
        drops: s.drops.filter((d) => d.id !== dropId),
        inventory: inv,
        selectedObject: null,
        menuOpen: false,
      };
    });
  }, []);

  // Start moving a non-scenery object
  const startMoving = useCallback((objId: string) => {
    const obj = state.objects.find((o) => o.id === objId);
    if (!obj || obj.is_scenery) return;
    setState((s) => ({
      ...s,
      mode: "moving",
      selectedObject: obj,
      menuOpen: false,
    }));
  }, [state.objects]);

  // Confirm move to new position
  const confirmMove = useCallback((x: number, y: number) => {
    setState((s) => {
      if (s.mode !== "moving" || !s.selectedObject) return s;
      if (x < 0 || x >= GRID_COLS || y < 0 || y >= GRID_ROWS) return s;
      if (s.objects.some((o) => o.grid_x === x && o.grid_y === y && o.id !== s.selectedObject!.id)) return s;

      return {
        ...s,
        objects: s.objects.map((o) =>
          o.id === s.selectedObject!.id ? { ...o, grid_x: x, grid_y: y } : o
        ),
        mode: "idle",
        selectedObject: null,
      };
    });
  }, []);

  return {
    state,
    isOccupied,
    startPlacing,
    confirmPlacement,
    cancelAction,
    selectObject,
    closeMenu,
    pickupObject,
    startDestroy,
    completeDestroy,
    collectDrop,
    startMoving,
    confirmMove,
    addToInventory,
    removeFromInventory,
  };
}
