/**
 * Resource node definitions — using TZ cooldowns (slower than SFL).
 * Source: TZ 5.1, PROJECT_RULES R3.1
 */
export interface ResourceNodeDef {
  type: string;
  resource: string;
  dropAmount: number;       // how much resource you get when fully gathered
  hitsToGather: number;     // clicks needed to gather (tool consumed only on last hit)
  cooldownMs: number;
  maxNodes: number;         // -1 = infinite respawn (trees), N = finite until expansion
  emoji: string;
}

export const RESOURCE_NODES: Record<string, ResourceNodeDef> = Object.freeze({
  tree: { type: "tree", resource: "wood",  dropAmount: 1, hitsToGather: 3, cooldownMs: 4 * 3600_000,  maxNodes: -1, emoji: "🌳" },
  rock: { type: "rock", resource: "stone", dropAmount: 2, hitsToGather: 3, cooldownMs: 24 * 3600_000, maxNodes: 20, emoji: "🪨" },
  iron: { type: "iron", resource: "iron",  dropAmount: 1, hitsToGather: 3, cooldownMs: 48 * 3600_000, maxNodes: 10, emoji: "⛏️" },
  gold: { type: "gold", resource: "gold",  dropAmount: 1, hitsToGather: 3, cooldownMs: 72 * 3600_000, maxNodes: 5,  emoji: "✨" },
});
