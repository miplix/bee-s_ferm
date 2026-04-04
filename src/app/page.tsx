"use client";

import { useState, useCallback, useEffect } from "react";
import ConnectScreen from "@/components/ConnectScreen";
import WelcomeScreen from "@/components/WelcomeScreen";
import GameScreen from "@/components/GameScreen";
import { connectWallet, disconnectWallet, tryRestoreSession } from "@/lib/near";

type Screen = "connect" | "welcome" | "game";

const SCREEN_KEY = "farm_last_screen";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("connect");
  const [accountId, setAccountId] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  // Restore session + last screen on mount
  useEffect(() => {
    tryRestoreSession().then((id) => {
      if (id) {
        setAccountId(id);
        const lastScreen = localStorage.getItem(SCREEN_KEY) as Screen | null;
        setScreen(lastScreen === "game" ? "game" : "welcome");
      }
    });
  }, []);

  // Persist screen changes
  const changeScreen = useCallback((s: Screen) => {
    setScreen(s);
    if (s !== "connect") {
      localStorage.setItem(SCREEN_KEY, s);
    } else {
      localStorage.removeItem(SCREEN_KEY);
    }
  }, []);

  const handleConnect = useCallback(async () => {
    setConnecting(true);
    try {
      const id = await connectWallet();
      if (id) {
        setAccountId(id);
        changeScreen("welcome");
      }
    } catch (err) {
      console.error("Connection failed:", err);
    } finally {
      setConnecting(false);
    }
  }, [changeScreen]);

  const handleDisconnect = useCallback(async () => {
    await disconnectWallet();
    setAccountId(null);
    changeScreen("connect");
  }, [changeScreen]);

  const handlePlay = useCallback(() => {
    changeScreen("game");
  }, [changeScreen]);

  const handleOpenMenu = useCallback(() => {
    changeScreen("welcome");
  }, [changeScreen]);

  if (screen === "connect" || !accountId) {
    return <ConnectScreen onConnect={handleConnect} loading={connecting} />;
  }

  if (screen === "welcome") {
    return (
      <WelcomeScreen
        accountId={accountId}
        inventory={[]}
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
