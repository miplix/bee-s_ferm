import { useStore } from "../../state/store";
import { selectLevel } from "../../state/selectors";
import { RECIPES } from "../../data/recipes.data";
import { PanelShell } from "./PanelShell";
import { PixelButton } from "../shared/PixelButton";
import { Progress } from "../shared/Progress";
import { useTick } from "../../hooks/useTick";
import { progress as calcProgress, fmtDuration, remaining } from "../../domain/time/time";

export function CookPanel() {
  useTick(1000);
  const inventory = useStore((s) => s.inventory);
  const buildings = useStore((s) => s.buildings);
  const cookingSlots = useStore((s) => s.cookingSlots);
  const startCooking = useStore((s) => s.startCooking);
  const collectMeal = useStore((s) => s.collectMeal);
  const feedBumpkin = useStore((s) => s.feedBumpkin);
  const level = useStore(selectLevel);

  const now = Date.now();

  // Available recipes (building must be built)
  const available = RECIPES.filter((r) => buildings.includes(r.building));

  // Meals in inventory
  const meals = Object.entries(inventory)
    .filter(([k]) => k.startsWith("meal_"))
    .map(([k, qty]) => ({ recipeId: k.replace("meal_", ""), qty }));

  return (
    <PanelShell title="Cooking">
      <div className="space-y-3">
        {/* Active cooking slots */}
        {cookingSlots.length > 0 && (
          <div className="space-y-1">
            <h3 className="font-game text-[8px] text-yellow-300">Cooking...</h3>
            {cookingSlots.map((slot, i) => {
              const prog = calcProgress(slot.startedAt, slot.durationMs, now);
              const ready = prog >= 1;
              const rem = remaining(slot.startedAt, slot.durationMs, now);
              const recipe = RECIPES.find((r) => r.id === slot.recipeId);

              return (
                <div key={i} className="bg-brown-600 p-1.5 border border-black/20 flex items-center gap-2">
                  <span className="text-sm">{recipe?.emoji ?? "🍽️"}</span>
                  <div className="flex-1">
                    <div className="font-game text-[7px] text-white">{recipe?.name}</div>
                    {!ready && <Progress value={prog} className="mt-0.5" />}
                    {!ready && (
                      <div className="font-game text-[6px] text-yellow-300 mt-0.5">
                        {fmtDuration(rem)}
                      </div>
                    )}
                  </div>
                  {ready && (
                    <PixelButton onClick={() => collectMeal(i)}>
                      Collect
                    </PixelButton>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Meals ready to feed */}
        {meals.length > 0 && (
          <div className="space-y-1">
            <h3 className="font-game text-[8px] text-green-300">Feed Bumpkin (XP)</h3>
            {meals.map(({ recipeId, qty }) => {
              const recipe = RECIPES.find((r) => r.id === recipeId);
              return (
                <div key={recipeId} className="bg-brown-600 p-1.5 border border-black/20 flex items-center gap-2">
                  <span className="text-sm">{recipe?.emoji ?? "🍽️"}</span>
                  <div className="flex-1">
                    <div className="font-game text-[7px] text-white">{recipe?.name} x{qty}</div>
                    <div className="font-game text-[6px] text-yellow-300">+{recipe?.xp} XP</div>
                  </div>
                  <PixelButton onClick={() => feedBumpkin(recipeId)}>
                    Eat
                  </PixelButton>
                </div>
              );
            })}
          </div>
        )}

        {/* Recipe list */}
        <h3 className="font-game text-[8px] text-yellow-300">Recipes</h3>
        <div className="space-y-1">
          {available.map((recipe) => {
            const canCook = recipe.ingredients.every(
              ({ id, qty }) => (inventory[id] ?? 0) >= qty,
            );

            return (
              <div key={recipe.id} className="bg-brown-600 p-1.5 border border-black/20 flex items-center gap-2">
                <span className="text-sm">{recipe.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-game text-[7px] text-white truncate">{recipe.name}</div>
                  <div className="font-game text-[6px] text-white/50">
                    {recipe.ingredients.map((i) => `${i.qty} ${i.id}`).join(", ")}
                  </div>
                  <div className="font-game text-[6px] text-yellow-300">
                    +{recipe.xp} XP | {fmtDuration(recipe.cookingMs)}
                  </div>
                </div>
                <PixelButton disabled={!canCook} onClick={() => startCooking(recipe.id)}>
                  Cook
                </PixelButton>
              </div>
            );
          })}
        </div>

        {available.length === 0 && (
          <p className="font-game text-[7px] text-white/50">
            Build a Campfire, Kitchen, or Bakery first.
          </p>
        )}
      </div>
    </PanelShell>
  );
}
