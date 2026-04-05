"use client";

import { useState, useCallback, useEffect } from "react";
import ConnectScreen from "@/components/ConnectScreen";
import GameScreen from "@/components/GameScreen";
import { connectWallet, disconnectWallet, tryRestoreSession } from "@/lib/near";

export default function Home() {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    tryRestoreSession().then((id) => {
      if (id) setAccountId(id);
      setLoaded(true);
    });
  }, []);

  const handleConnect = useCallback(async () => {
    setConnecting(true);
    try {
      const id = await connectWallet();
      if (id) setAccountId(id);
    } catch (err) {
      console.error("Connection failed:", err);
    } finally {
      setConnecting(false);
    }
  }, []);

  const handleDisconnect = useCallback(async () => {
    await disconnectWallet();
    setAccountId(null);
  }, []);

  // Don't flash connect screen while checking localStorage
  if (!loaded) return null;

  if (!accountId) {
    return <ConnectScreen onConnect={handleConnect} loading={connecting} />;
  }

  return <GameScreen accountId={accountId} onDisconnect={handleDisconnect} />;
}
