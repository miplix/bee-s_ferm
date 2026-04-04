import { supabase } from "./supabase";
import type { Player, PlacedObject, PlayerPresence } from "@/types";

// === Player CRUD ===

export async function getOrCreatePlayer(accountId: string): Promise<Player> {
  const { data } = await supabase
    .from("players")
    .select("*")
    .eq("account_id", accountId)
    .single();

  if (data) return data as Player;

  const newPlayer: Omit<Player, "last_seen"> = {
    account_id: accountId,
    display_name: accountId.split(".")[0],
    x: 400,
    y: 300,
    resources: { wood: 0, stone: 0, gold: 0, wheat: 0, iron: 0 },
  };

  const { data: created, error } = await supabase
    .from("players")
    .insert(newPlayer)
    .select()
    .single();

  if (error) throw error;
  return created as Player;
}

export async function updatePlayerPosition(accountId: string, x: number, y: number) {
  await supabase
    .from("players")
    .update({ x, y, last_seen: new Date().toISOString() })
    .eq("account_id", accountId);
}

export async function updatePlayerResources(accountId: string, resources: Record<string, number>) {
  await supabase
    .from("players")
    .update({ resources })
    .eq("account_id", accountId);
}

// === Placed Objects ===

export async function getPlacedObjects(ownerId: string): Promise<PlacedObject[]> {
  const { data } = await supabase
    .from("placed_objects")
    .select("*")
    .eq("owner_id", ownerId);
  return (data ?? []) as PlacedObject[];
}

export async function placeObject(obj: Omit<PlacedObject, "id" | "placed_at">): Promise<PlacedObject> {
  const { data, error } = await supabase
    .from("placed_objects")
    .insert(obj)
    .select()
    .single();
  if (error) throw error;
  return data as PlacedObject;
}

export async function removeObject(id: string) {
  await supabase.from("placed_objects").delete().eq("id", id);
}

// === Realtime: online players ===

export function subscribeToPresence(
  onJoin: (p: PlayerPresence) => void,
  onLeave: (accountId: string) => void,
  onMove: (p: PlayerPresence) => void
) {
  const channel = supabase.channel("game:presence");

  channel
    .on("presence", { event: "join" }, ({ newPresences }) => {
      newPresences.forEach((p: any) => onJoin(p as PlayerPresence));
    })
    .on("presence", { event: "leave" }, ({ leftPresences }) => {
      leftPresences.forEach((p: any) => onLeave(p.account_id));
    })
    .subscribe();

  return channel;
}

export function broadcastPosition(
  channel: ReturnType<typeof supabase.channel>,
  presence: PlayerPresence
) {
  channel.track(presence);
}

// === Visit other player's farm ===

export async function getPlayerFarm(accountId: string) {
  const [playerRes, objectsRes] = await Promise.all([
    supabase.from("players").select("*").eq("account_id", accountId).single(),
    supabase.from("placed_objects").select("*").eq("owner_id", accountId),
  ]);
  return {
    player: playerRes.data as Player | null,
    objects: (objectsRes.data ?? []) as PlacedObject[],
  };
}
