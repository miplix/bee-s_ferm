"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import type { Player, PlacedObject, PlayerPresence } from "@/types";
import { getPlacedObjects, updatePlayerPosition, updatePlayerResources, broadcastPosition, subscribeToPresence } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { FarmScene } from "@/game/scenes/FarmScene";

interface Props {
  player: Player;
  onResourcesChange: (r: Record<string, number>) => void;
}

export default function GameCanvas({ player, onResourcesChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const [ready, setReady] = useState(false);

  const handleResourceChange = useCallback(
    (resources: Record<string, number>) => {
      onResourcesChange(resources);
      updatePlayerResources(player.account_id, resources);
    },
    [player.account_id, onResourcesChange]
  );

  const handlePositionChange = useCallback(
    (x: number, y: number) => {
      updatePlayerPosition(player.account_id, x, y);
    },
    [player.account_id]
  );

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    let destroyed = false;

    async function init() {
      const Phaser = (await import("phaser")).default;
      const { BootScene } = await import("@/game/scenes/BootScene");

      if (destroyed) return;

      const placedObjects = await getPlacedObjects(player.account_id);

      const game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: containerRef.current!,
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: "#1a1a2e",
        scene: [BootScene, FarmScene],
        physics: { default: "arcade" },
      });

      gameRef.current = game;

      // Pass data to FarmScene once BootScene transitions
      game.events.on("ready", () => {
        const farmScene = game.scene.getScene("FarmScene") as FarmScene;
        if (farmScene) {
          farmScene.scene.restart({
            accountId: player.account_id,
            playerX: player.x,
            playerY: player.y,
            placedObjects,
            resources: player.resources,
            onResourceChange: handleResourceChange,
            onPositionChange: handlePositionChange,
          });
        }
      });

      // Wait for FarmScene to be active, then set up presence
      game.events.once("step", () => {
        setupPresence(game);
      });

      setReady(true);
    }

    function setupPresence(game: Phaser.Game) {
      const channel = supabase.channel("game:presence");

      subscribeToPresence(
        (p: PlayerPresence) => {
          if (p.account_id === player.account_id) return;
          const scene = game.scene.getScene("FarmScene") as FarmScene;
          scene?.updateOtherPlayer(p);
        },
        (accountId: string) => {
          const scene = game.scene.getScene("FarmScene") as FarmScene;
          scene?.removeOtherPlayer(accountId);
        },
        (p: PlayerPresence) => {
          if (p.account_id === player.account_id) return;
          const scene = game.scene.getScene("FarmScene") as FarmScene;
          scene?.updateOtherPlayer(p);
        }
      );

      // Track own presence
      broadcastPosition(channel, {
        account_id: player.account_id,
        x: player.x,
        y: player.y,
        display_name: player.display_name,
      });
    }

    init();

    return () => {
      destroyed = true;
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [player, handleResourceChange, handlePositionChange]);

  // Handle resize
  useEffect(() => {
    const onResize = () => {
      gameRef.current?.scale.resize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return <div ref={containerRef} className="w-full h-full absolute inset-0" />;
}
