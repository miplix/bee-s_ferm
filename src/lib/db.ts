import { supabase } from "./supabase";
import type { Player, PlacedObject } from "@/types";

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
    inventory: [],
    placed_objects: [],
  };

  const { data: created, error } = await supabase
    .from("players")
    .insert(newPlayer)
    .select()
    .single();

  if (error) throw error;
  return created as Player;
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

export async function placeObject(obj: Omit<PlacedObject, "id">): Promise<PlacedObject> {
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
