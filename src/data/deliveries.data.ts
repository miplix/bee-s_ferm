// Delivery / bounty definitions — NPCs request items for rewards.
// ~20 templates; 3-6 active at a time, rotated daily via seeded PRNG.

export interface DeliveryDef {
  id: string;
  npcName: string;
  npcEmoji: string;
  request: { itemId: string; qty: number }[];
  reward: { coins: number; xp: number; tickets: number };
  minLevel: number;
}

/** Pool of all delivery templates. */
export const DELIVERIES: readonly DeliveryDef[] = Object.freeze([
  // --- Level 1 ---
  { id: "del_sunflower_basket",  npcName: "Granny May",    npcEmoji: "\uD83D\uDC75", request: [{ itemId: "sunflower", qty: 10 }],                            reward: { coins: 1, xp: 50, tickets: 1 },    minLevel: 1 },
  { id: "del_potato_sack",      npcName: "Farmer Joe",    npcEmoji: "\uD83E\uDDD4", request: [{ itemId: "potato", qty: 5 }],                                 reward: { coins: 2, xp: 80, tickets: 1 },    minLevel: 1 },
  { id: "del_wood_bundle",      npcName: "Carpenter Cal", npcEmoji: "\uD83E\uDDD1\u200D\uD83D\uDD27", request: [{ itemId: "wood", qty: 10 }],                reward: { coins: 3, xp: 60, tickets: 1 },    minLevel: 1 },

  // --- Level 2 ---
  { id: "del_carrot_crate",     npcName: "Bunny Belle",   npcEmoji: "\uD83D\uDC30", request: [{ itemId: "carrot", qty: 5 }],                                 reward: { coins: 5, xp: 120, tickets: 2 },   minLevel: 2 },
  { id: "del_pumpkin_pie_prep", npcName: "Baker Bob",     npcEmoji: "\uD83D\uDC68\u200D\uD83C\uDF73", request: [{ itemId: "pumpkin", qty: 3 }],               reward: { coins: 4, xp: 100, tickets: 1 },   minLevel: 2 },
  { id: "del_stone_order",      npcName: "Miner Mike",    npcEmoji: "\u26CF\uFE0F",  request: [{ itemId: "stone", qty: 8 }],                                  reward: { coins: 5, xp: 100, tickets: 2 },   minLevel: 2 },

  // --- Level 3 ---
  { id: "del_cabbage_salad",    npcName: "Chef Clara",    npcEmoji: "\uD83D\uDC69\u200D\uD83C\uDF73", request: [{ itemId: "cabbage", qty: 3 }, { itemId: "carrot", qty: 2 }], reward: { coins: 8, xp: 200, tickets: 2 }, minLevel: 3 },
  { id: "del_soybean_harvest",  npcName: "Tofu Tim",      npcEmoji: "\uD83E\uDDD1", request: [{ itemId: "soybean", qty: 5 }],                                 reward: { coins: 10, xp: 180, tickets: 2 },  minLevel: 3 },
  { id: "del_egg_delivery",     npcName: "Mrs. Hen",      npcEmoji: "\uD83D\uDC14", request: [{ itemId: "egg", qty: 3 }],                                     reward: { coins: 8, xp: 150, tickets: 2 },   minLevel: 3 },
  { id: "del_iron_shipment",    npcName: "Blacksmith Bea",npcEmoji: "\uD83D\uDD28", request: [{ itemId: "iron", qty: 5 }],                                    reward: { coins: 12, xp: 200, tickets: 3 },  minLevel: 3 },

  // --- Level 4 ---
  { id: "del_cauliflower_feast",npcName: "Royal Chef",    npcEmoji: "\uD83D\uDC51", request: [{ itemId: "cauliflower", qty: 3 }],                              reward: { coins: 15, xp: 300, tickets: 3 },  minLevel: 4 },
  { id: "del_soup_pot",         npcName: "Granny May",    npcEmoji: "\uD83D\uDC75", request: [{ itemId: "pumpkin_soup", qty: 2 }],                              reward: { coins: 18, xp: 350, tickets: 3 },  minLevel: 4 },
  { id: "del_pepper_spice",     npcName: "Spice Trader",  npcEmoji: "\uD83C\uDF36\uFE0F", request: [{ itemId: "pepper", qty: 4 }],                             reward: { coins: 15, xp: 280, tickets: 3 },  minLevel: 4 },

  // --- Level 5 ---
  { id: "del_corn_harvest",     npcName: "Popcorn Pete",  npcEmoji: "\uD83C\uDF7F", request: [{ itemId: "corn", qty: 5 }],                                    reward: { coins: 20, xp: 400, tickets: 4 },  minLevel: 5 },
  { id: "del_milk_run",         npcName: "Dairy Dan",     npcEmoji: "\uD83E\uDD5B", request: [{ itemId: "milk", qty: 3 }],                                    reward: { coins: 18, xp: 350, tickets: 3 },  minLevel: 5 },
  { id: "del_eggplant_feast",   npcName: "Chef Clara",    npcEmoji: "\uD83D\uDC69\u200D\uD83C\uDF73", request: [{ itemId: "eggplant", qty: 3 }],              reward: { coins: 25, xp: 450, tickets: 4 },  minLevel: 5 },

  // --- Level 7+ ---
  { id: "del_gold_rush",        npcName: "Jeweler Jade",  npcEmoji: "\uD83D\uDC8E", request: [{ itemId: "gold", qty: 3 }],                                    reward: { coins: 40, xp: 600, tickets: 5 },  minLevel: 7 },
  { id: "del_wheat_flour",      npcName: "Baker Bob",     npcEmoji: "\uD83D\uDC68\u200D\uD83C\uDF73", request: [{ itemId: "wheat", qty: 8 }],                 reward: { coins: 30, xp: 500, tickets: 4 },  minLevel: 7 },
  { id: "del_honey_pot",        npcName: "Bear Barry",    npcEmoji: "\uD83D\uDC3B", request: [{ itemId: "honey", qty: 2 }],                                   reward: { coins: 35, xp: 550, tickets: 5 },  minLevel: 7 },

  // --- Level 9+ ---
  { id: "del_kale_smoothie",    npcName: "Fitness Fran",  npcEmoji: "\uD83C\uDFCB\uFE0F", request: [{ itemId: "kale", qty: 3 }, { itemId: "soybean", qty: 2 }], reward: { coins: 50, xp: 800, tickets: 6 }, minLevel: 9 },
]);

/** Base delivery slot count by player level bracket. */
export function deliverySlotCount(level: number): number {
  if (level >= 9) return 6;
  if (level >= 7) return 5;
  if (level >= 4) return 4;
  return 3;
}

/** Refresh cooldown per slot in ms (4-8 hours, scales with level). */
export const DELIVERY_REFRESH_MS = 4 * 60 * 60 * 1000; // 4 hours base
