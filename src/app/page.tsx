"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import ConnectScreen from "@/components/ConnectScreen";
import HUD from "@/components/HUD";
import VisitModal from "@/components/VisitModal";
import { connectWallet, disconnectWallet, tryRestoreSession } from "@/lib/near";
import { getOrCreatePlayer, updatePlayerResources, placeObject } from "@/lib/db";
import { CRAFT_RECIPES } from "@/game/config";
import type { Player, InventoryItem, PlacedObject } from "@/types";

const GameCanvas = dynamic(() => import("@/components/GameCanvas"), { ssr: false });

export default function Home() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [resources, setResources] = useState<Record<string, number>>({});
  const [inventory] = useState<InventoryItem[]>([]); // TODO: fetch NFTs from NEAR contract
  const [connecting, setConnecting] = useState(false);
  const [showVisit, setShowVisit] = useState(false);
  const [placingItem, setPlacingItem] = useState<InventoryItem | null>(null);
  const phaserGameRef = useRef<any>(null);

  // Try to restore wallet session on mount
  useEffect(() => {
    tryRestoreSession().then(async (accountId) => {
      if (accountId) {
        try {
          const p = await getOrCreatePlayer(accountId);
          setPlayer(p);
          setResources(p.resources);
        } catch (err) {
          console.error("Failed to restore session:", err);
        }
      }
    });
  }, []);

  const handleConnect = useCallback(async () => {
    setConnecting(true);
    try {
      const accountId = await connectWallet();
      if (accountId) {
        const p = await getOrCreatePlayer(accountId);
        setPlayer(p);
        setResources(p.resources);
      }
    } catch (err) {
      console.error("Connection failed:", err);
    } finally {
      setConnecting(false);
    }
  }, []);

  const handleDisconnect = useCallback(async () => {
    await disconnectWallet();
    setPlayer(null);
    setResources({});
  }, []);

  const handleResourcesChange = useCallback((r: Record<string, number>) => {
    setResources(r);
  }, []);

  // Place NFT object on the grid
  const handlePlaceItem = useCallback((item: InventoryItem) => {
    setPlacingItem(item);
    const game = phaserGameRef.current;
    if (!game) return;
    const scene = game.scene.getScene("FarmScene") as any;
    if (!scene) return;

    scene.enterPlacementMode(item.object_type, async (gridX: number, gridY: number) => {
      if (!player) return;
      try {
        const obj = await placeObject({
          owner_id: player.account_id,
          nft_token_id: item.token_id,
          object_type: item.object_type,
          grid_x: gridX,
          grid_y: gridY,
          state: {},
        });
        scene.addPlacedSprite(obj);
      } catch (err) {
        console.error("Failed to place object:", err);
      }
      setPlacingItem(null);
    });
  }, [player]);

  const handleCraft = useCallback(
    async (recipeId: string) => {
      if (!player) return;
      const recipe = CRAFT_RECIPES[recipeId];
      if (!recipe) return;

      for (const [res, amount] of Object.entries(recipe.inputs)) {
        if ((resources[res] || 0) < amount) {
          alert(`Недостаточно ${res}: нужно ${amount}, есть ${resources[res] || 0}`);
          return;
        }
      }

      const updated = { ...resources };
      for (const [res, amount] of Object.entries(recipe.inputs)) {
        updated[res] = (updated[res] || 0) - amount;
      }
      updated[recipe.output.resource] =
        (updated[recipe.output.resource] || 0) + recipe.output.amount;

      setResources(updated);
      await updatePlayerResources(player.account_id, updated);
    },
    [player, resources]
  );

  const handleVisit = useCallback(
    async (visitPlayer: Player, objects: PlacedObject[]) => {
      setShowVisit(false);
      const game = phaserGameRef.current;
      if (!game) return;
      const scene = game.scene.getScene("FarmScene");
      if (scene) {
        scene.scene.restart({
          accountId: visitPlayer.account_id,
          playerX: visitPlayer.x,
          playerY: visitPlayer.y,
          placedObjects: objects,
          resources: visitPlayer.resources,
          onResourceChange: () => {},
          onPositionChange: () => {},
        });
      }
    },
    []
  );

  if (!player) {
    return <ConnectScreen onConnect={handleConnect} loading={connecting} />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <GameCanvas player={player} onResourcesChange={handleResourcesChange} gameRef={phaserGameRef} />
      <HUD
        accountId={player.account_id}
        resources={resources}
        inventory={inventory}
        onPlaceItem={handlePlaceItem}
        onCraft={handleCraft}
        onVisit={() => setShowVisit(true)}
        onDisconnect={handleDisconnect}
      />
      {placingItem && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 bg-yellow-900/90 text-yellow-200 px-4 py-2 rounded-lg text-sm">
          Кликните на карту, чтобы разместить «{placingItem.name}»
          <button
            onClick={() => setPlacingItem(null)}
            className="ml-3 text-yellow-400 underline"
          >
            Отмена
          </button>
        </div>
      )}
      {showVisit && (
        <VisitModal onClose={() => setShowVisit(false)} onVisit={handleVisit} />
      )}
    </div>
  );
}
