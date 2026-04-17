// String union types — no enums per project rules R12.5

export type CropId =
  | "sunflower" | "potato" | "rhubarb" | "pumpkin" | "zucchini"
  | "carrot" | "yam" | "cabbage" | "broccoli" | "soybean"
  | "beetroot" | "pepper" | "cauliflower" | "parsnip" | "eggplant"
  | "corn" | "onion" | "radish" | "wheat" | "turnip"
  | "kale" | "artichoke" | "barley";

export type SeedId = `${CropId}_seed`;

export type ResourceId = "wood" | "stone" | "iron" | "gold";

export type ToolId = "axe" | "stone_pickaxe" | "iron_pickaxe" | "gold_pickaxe" | "fishing_rod";

export type BuildingId =
  | "workbench" | "market" | "campfire" | "well"
  | "henhouse" | "kitchen" | "feeder" | "barn"
  | "bakery" | "toolshed"
  | "bulletin_board" | "trading_post" | "fishing_dock" | "pet_house" | "town_hall";

export type AnimalKind = "chicken" | "cow" | "sheep";

export type ProductId = "egg" | "milk" | "leather" | "honey" | "wool";

export type RecipeId =
  | "pumpkin_soup" | "mashed_potato" | "sunflower_cracker"
  | "farmer_salad" | "fried_cabbage" | "milk_porridge"
  | "beet_cake" | "honey_pie";

export type IslandId = "basic" | "spring" | "desert" | "volcano";

export type Season = "spring" | "summer" | "autumn" | "winter";

export type PanelId =
  | "shop" | "inventory" | "cook" | "craft"
  | "build" | "expand" | "beehive" | "animals"
  | "fishing" | "skills" | "deliveries" | "chores"
  | "trading" | "faction" | "pets" | "crop_machine";

export type LocationId = "farm" | "henhouse" | "barn";

export type FruitId =
  | "tomato" | "lemon" | "blueberry" | "orange" | "apple" | "banana";

export type FlowerId = "sunpetal" | "bloom" | "lily";

export type GreenhouseCropId = "grape" | "rice" | "olive";

export type CellType =
  | "empty" | "plot" | "tree" | "rock" | "iron" | "gold"
  | "building" | "beehive" | "fruit_patch" | "flower_bed" | "greenhouse";
