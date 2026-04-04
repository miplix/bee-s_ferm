"use client";

import { useEffect, useRef, useCallback } from "react";
import type { Player, PlayerPresence } from "@/types";
import {
  getPlacedObjects,
  updatePlayerPosition,
  updatePlayerResources,
  broadcastPosition,
  subscribeToPresence,
} from "@/lib/db";
import { supabase } from "@/lib/supabase";

interface Props {
  player: Player;
  onResourcesChange: (r: Record<string, number>) => void;
  onMapClick?: (gridX: number, gridY: number) => void;
  gameRef?: React.MutableRefObject<any>;
}

export default function GameCanvas({ player, onResourcesChange, gameRef: externalGameRef }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

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
    let presenceChannel: ReturnType<typeof supabase.channel> | null = null;

    async function init() {
      const Phaser = (await import("phaser")).default;
      const { BootScene } = await import("@/game/scenes/BootScene");
      const { FarmScene } = await import("@/game/scenes/FarmScene");

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

      // Pass data via registry so BootScene can forward it to FarmScene
      game.registry.set("farmSceneData", {
        accountId: player.account_id,
        playerX: player.x,
        playerY: player.y,
        placedObjects,
        resources: player.resources,
        onResourceChange: handleResourceChange,
        onPositionChange: handlePositionChange,
      });

      gameRef.current = game;
      if (externalGameRef) externalGameRef.current = game;

      // Set up multiplayer presence
      presenceChannel = supabase.channel("game:presence");

      subscribeToPresence(
        (p: PlayerPresence) => {
          if (p.account_id === player.account_id) return;
          const scene = game.scene.getScene("FarmScene") as any;
          scene?.updateOtherPlayer(p);
        },
        (accountId: string) => {
          const scene = game.scene.getScene("FarmScene") as any;
          scene?.removeOtherPlayer(accountId);
        },
        (p: PlayerPresence) => {
          if (p.account_id === player.account_id) return;
          const scene = game.scene.getScene("FarmScene") as any;
          scene?.updateOtherPlayer(p);
        }
      );

      broadcastPosition(presenceChannel, {
        account_id: player.account_id,
        x: player.x,
        y: player.y,
        display_name: player.display_name,
      });
    }

    init();

    return () => {
      destroyed = true;
      if (presenceChannel) {
        supabase.removeChannel(presenceChannel);
      }
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [player, handleResourceChange, handlePositionChange]);

  // Handle window resize
  useEffect(() => {
    const onResize = () => {
      gameRef.current?.scale.resize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return <div ref={containerRef} className="w-full h-full absolute inset-0" />;
}
