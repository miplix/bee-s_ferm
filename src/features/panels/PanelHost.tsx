import { useStore } from "../../state/store";
import { ShopPanel } from "./ShopPanel";
import { InventoryPanel } from "./InventoryPanel";
import { CraftPanel } from "./CraftPanel";
import { CookPanel } from "./CookPanel";
import { BuildPanel } from "./BuildPanel";
import { ExpandPanel } from "./ExpandPanel";
import { AnimalsPanel } from "./AnimalsPanel";
import { BeehivePanel } from "./BeehivePanel";
import { FishingPanel } from "./FishingPanel";
import { SkillsPanel } from "./SkillsPanel";
import { DeliveryPanel } from "./DeliveryPanel";
import { ChorePanel } from "./ChorePanel";
import { TradingPanel } from "./TradingPanel";
import { FactionPanel } from "./FactionPanel";
import { PetPanel } from "./PetPanel";
import { CropMachinePanel } from "./CropMachinePanel";

export function PanelHost() {
  const activePanel = useStore((s) => s.activePanel);

  if (!activePanel) return null;

  switch (activePanel) {
    case "shop":         return <ShopPanel />;         // via Market building
    case "inventory":    return <InventoryPanel />;    // via HUD button
    case "craft":        return <CraftPanel />;        // via Toolshed building
    case "cook":         return <CookPanel />;         // via Campfire/Kitchen/Bakery
    case "build":        return <BuildPanel />;        // via Workbench building
    case "expand":       return <ExpandPanel />;       // via map expand button
    case "animals":      return <AnimalsPanel />;      // via Feeder building
    case "beehive":      return <BeehivePanel />;      // via beehive on map
    case "fishing":      return <FishingPanel />;      // via Fishing Dock building
    case "skills":       return <SkillsPanel />;       // via HUD button
    case "deliveries":   return <DeliveryPanel />;     // via Bulletin Board building
    case "chores":       return <ChorePanel />;        // via Bulletin Board building
    case "trading":      return <TradingPanel />;      // via Trading Post building
    case "faction":      return <FactionPanel />;      // via Town Hall building
    case "pets":         return <PetPanel />;          // via Pet House building
    case "crop_machine": return <CropMachinePanel />;  // via Crop Machine building
    default:             return null;
  }
}
