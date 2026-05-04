/**
 * VIP-сундук — ×2-×3 ценность относительно обычного, плюс редкая пыльца (0.1-5).
 * Раз в день, со streak-механикой как у обычного сундука.
 */

export interface VipRewardOption {
  itemId: string;        // "coins" | "pollen" | "<seed_id>" | "axe"...
  qtyMin: number;
  qtyMax: number;
  weight: number;        // probability weight (relative)
  label: (q: number) => string;
}

/** Pool VIP-сундука (всегда доступен пока VIP активен). */
export const VIP_REWARD_POOL: VipRewardOption[] = [
  // Common — coins/wheat (x2-x3 от обычного 10 → 20-30)
  { itemId: "coins",          qtyMin: 20,  qtyMax: 30,  weight: 30, label: (q) => `${q} монет` },
  { itemId: "wheat",          qtyMin: 20,  qtyMax: 30,  weight: 25, label: (q) => `${q} пшеницы` },
  { itemId: "sunflower_seed", qtyMin: 100, qtyMax: 200, weight: 25, label: (q) => `${q} семян подсолнуха` },
  { itemId: "potato_seed",    qtyMin: 60,  qtyMax: 120, weight: 20, label: (q) => `${q} семян картофеля` },
  // Mid (x2-x3 от advanced 10 → 20-30)
  { itemId: "carrot_seed",    qtyMin: 40,  qtyMax: 80,  weight: 15, label: (q) => `${q} семян моркови` },
  { itemId: "zucchini_seed",  qtyMin: 20,  qtyMax: 40,  weight: 12, label: (q) => `${q} семян цукини` },
  { itemId: "cabbage_seed",   qtyMin: 20,  qtyMax: 40,  weight: 10, label: (q) => `${q} семян капусты` },
  { itemId: "wheat_seed",     qtyMin: 20,  qtyMax: 40,  weight: 8,  label: (q) => `${q} семян пшеницы` },
  // Tools (x2-x3 от обычного 2 → 4-6)
  { itemId: "axe",            qtyMin: 4,   qtyMax: 6,   weight: 5,  label: (q) => `${q} топор` },
  { itemId: "stone_pickaxe",  qtyMin: 4,   qtyMax: 6,   weight: 5,  label: (q) => `${q} деревянная кирка` },
  // Rare — pollen 0.1 to 5 (редкий шанс)
  { itemId: "pollen",         qtyMin: 0.1, qtyMax: 5,   weight: 3,  label: (q) => `${q.toFixed(1)} пыльцы 🌼` },
];

/** Pick random reward weighted by `weight` field. Deterministic via seed. */
export function pickVipReward(seed: number): { option: VipRewardOption; qty: number } {
  let s = seed >>> 0;
  s = Math.imul(s ^ (s >>> 15), 0x85ebca6b);
  s = Math.imul(s ^ (s >>> 13), 0xc2b2ae35);
  const rand1 = ((s ^ (s >>> 16)) >>> 0) / 0xffffffff;

  // pick option by weight
  const totalW = VIP_REWARD_POOL.reduce((a, o) => a + o.weight, 0);
  let acc = 0;
  let opt = VIP_REWARD_POOL[0];
  const target = rand1 * totalW;
  for (const o of VIP_REWARD_POOL) {
    acc += o.weight;
    if (acc >= target) { opt = o; break; }
  }

  // pick qty in range
  s = Math.imul(s ^ (s >>> 15), 0x85ebca6b);
  s = Math.imul(s ^ (s >>> 13), 0xc2b2ae35);
  const rand2 = ((s ^ (s >>> 16)) >>> 0) / 0xffffffff;
  const range = opt.qtyMax - opt.qtyMin;
  const qty = opt.itemId === "pollen"
    ? parseFloat((opt.qtyMin + rand2 * range).toFixed(1))
    : Math.floor(opt.qtyMin + rand2 * (range + 1));
  return { option: opt, qty };
}
