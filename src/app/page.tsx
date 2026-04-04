"use client";

import { useState, useCallback, useEffect } from "react";
import ConnectScreen from "@/components/ConnectScreen";
import WelcomeScreen from "@/components/WelcomeScreen";
import GameScreen from "@/components/GameScreen";
import { connectWallet, disconnectWallet, tryRestoreSession } from "@/lib/near";

type Screen = "connect" | "welcome" | "game";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("connect");
  const [accountId, setAccountId] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  // Try to restore session on mount
  useEffect(() => {
    tryRestoreSession().then((id) => {
      if (id) {
        setAccountId(id);
        setScreen("welcome");
      }
    });
  }, []);

  const handleConnect = useCallback(async () => {
    setConnecting(true);
    try {
      const id = await connectWallet();
      if (id) {
        setAccountId(id);
        setScreen("welcome");
      }
    } catch (err) {
      console.error("Connection failed:", err);
    } finally {
      setConnecting(false);
    }
  }, []);

  const handleDisconnect = useCallback(async () => {
    await disconnectWallet();
    setAccountId(null);
    setScreen("connect");
  }, []);

  const handlePlay = useCallback(() => {
    setScreen("game");
  }, []);

  const handleOpenMenu = useCallback(() => {
    setScreen("welcome");
  }, []);

  if (screen === "connect" || !accountId) {
    return <ConnectScreen onConnect={handleConnect} loading={connecting} />;
  }

  if (screen === "welcome") {
    return (
      <WelcomeScreen
        accountId={accountId}
        inventory={[
          { item_type: "fence", count: 5 },
          { item_type: "flower_bed", count: 3 },
          { item_type: "campfire", count: 1 },
          { item_type: "chest", count: 2 },
          { item_type: "scarecrow", count: 1 },
        ]}
        onPlay={handlePlay}
        onDisconnect={handleDisconnect}
      />
    );
  }

  return (
    <GameScreen
      accountId={accountId}
      onDisconnect={handleDisconnect}
      onOpenMenu={handleOpenMenu}
    />
  );
}
