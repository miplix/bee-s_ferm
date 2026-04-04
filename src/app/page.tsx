"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import ConnectScreen from "@/components/ConnectScreen";
import HUD from "@/components/HUD";
import VisitModal from "@/components/VisitModal";
import { connectWallet, disconnectWallet } from "@/lib/near";
import { getOrCreatePlayer, updatePlayerResources } from "@/lib/db";
import { CRAFT_RECIPES } from "@/game/config";
import type { Player, InventoryItem, PlacedObject } from "@/types";

// Phaser must be loaded client-side only
const GameCanvas = dynamic(() => import("@/components/GameCanvas"), { ssr: false });

export default function Home() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [resources, setResources] = useState<Record<string, number>>({});
  const [inventory] = useState<InventoryItem[]>([]); // TODO: fetch from NEAR NFT contract
  const [connecting, setConnecting] = useState(false);
  const [showVisit, setShowVisit] = useState(false);

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

  const handlePlaceItem = useCallback((item: InventoryItem) => {
    // TODO: place NFT object on the grid via game scene
    console.log("Place item:", item);
  }, []);

  const handleCraft = useCallback(
    async (recipeId: string) => {
      if (!player) return;
      const recipe = CRAFT_RECIPES[recipeId];
      if (!recipe) return;

      // Check if player has enough resources
      for (const [res, amount] of Object.entries(recipe.inputs)) {
        if ((resources[res] || 0) < amount) {
          alert(`Недостаточно ${res}: нужно ${amount}, есть ${resources[res] || 0}`);
          return;
        }
      }

      // Deduct inputs, add output
      const updated = { ...resources };
      for (const [res, amount] of Object.entries(recipe.inputs)) {
        updated[res] = (updated[res] || 0) - amount;
      }
      updated[recipe.output.resource] = (updated[recipe.output.resource] || 0) + recipe.output.amount;

      setResources(updated);
      await updatePlayerResources(player.account_id, updated);
    },
    [player, resources]
  );

  const handleVisit = useCallback((_visitPlayer: Player, _objects: PlacedObject[]) => {
    // TODO: switch scene to view another player's farm (read-only)
    setShowVisit(false);
    console.log("Visiting farm:", _visitPlayer.account_id);
  }, []);

  // Not connected — show connect screen
  if (!player) {
    return <ConnectScreen onConnect={handleConnect} loading={connecting} />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <GameCanvas player={player} onResourcesChange={handleResourcesChange} />
      <HUD
        accountId={player.account_id}
        resources={resources}
        inventory={inventory}
        onPlaceItem={handlePlaceItem}
        onCraft={handleCraft}
        onVisit={() => setShowVisit(true)}
        onDisconnect={handleDisconnect}
      />
      {showVisit && <VisitModal onClose={() => setShowVisit(false)} onVisit={handleVisit} />}
    </div>
  );
}
