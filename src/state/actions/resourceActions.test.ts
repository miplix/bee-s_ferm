import { describe, it, expect } from "vitest";
import { gatherNode } from "./resourceActions";
import { createInitialState } from "../../domain/types/game";
import { cellKey } from "../../domain/types/game";

const NOW = 1_700_000_000_000;

function base() {
  return createInitialState();
}

/** Find first cell of given type */
function firstCell(s: ReturnType<typeof createInitialState>, type: string) {
  for (const [key, cell] of Object.entries(s.cells)) {
    if (cell.type === type && !cell.parentKey) {
      const [cx, cy] = key.split(",").map(Number);
      return { cx, cy, cell };
    }
  }
  return null;
}

describe("gatherNode — дерево", () => {
  it("промежуточный удар не даёт ресурсы, не тратит инструмент", () => {
    const s = base();
    s.inventory["axe"] = 3;
    const tree = firstCell(s, "tree");
    if (!tree) throw new Error("no tree");

    const after1 = gatherNode(s, tree.cx, tree.cy, NOW);
    expect(after1.inventory["wood"]).toBeUndefined();   // нет дерева ещё
    expect(after1.inventory["axe"]).toBe(3);            // топор не потрачен
    const cell = after1.cells[cellKey(tree.cx, tree.cy)];
    expect(cell.currentHits).toBe(1);
  });

  it("финальный удар даёт дерево и тратит топор", () => {
    const s = base();
    s.inventory["axe"] = 3;
    const tree = firstCell(s, "tree");
    if (!tree) throw new Error("no tree");

    // tree hitsToGather = 3
    let state = gatherNode(s, tree.cx, tree.cy, NOW);
    state = gatherNode(state, tree.cx, tree.cy, NOW + 100);
    state = gatherNode(state, tree.cx, tree.cy, NOW + 200);

    expect((state.inventory["wood"] ?? 0)).toBeGreaterThanOrEqual(1);
    expect(state.inventory["axe"]).toBe(2); // один потрачен
  });

  it("no-op без топора", () => {
    const s = base();
    delete s.inventory["axe"]; // убираем стартовый топор
    const tree = firstCell(s, "tree");
    if (!tree) throw new Error("no tree");

    const after = gatherNode(s, tree.cx, tree.cy, NOW);
    expect(after).toBe(s);
  });

  it("no-op на кулдауне", () => {
    const s = base();
    s.inventory["axe"] = 5;
    const tree = firstCell(s, "tree");
    if (!tree) throw new Error("no tree");

    // Собираем полностью
    let state = gatherNode(s, tree.cx, tree.cy, NOW);
    state = gatherNode(state, tree.cx, tree.cy, NOW + 100);
    state = gatherNode(state, tree.cx, tree.cy, NOW + 200); // финальный

    // Сразу пытаемся снова — должен быть no-op
    const again = gatherNode(state, tree.cx, tree.cy, NOW + 300);
    expect(again).toBe(state);
  });

  it("сброс прогресса после 5с простоя", () => {
    const s = base();
    s.inventory["axe"] = 3;
    const tree = firstCell(s, "tree");
    if (!tree) throw new Error("no tree");

    const after1 = gatherNode(s, tree.cx, tree.cy, NOW);
    expect(after1.cells[cellKey(tree.cx, tree.cy)].currentHits).toBe(1);

    // Удар через 6 секунд — прогресс сбрасывается
    const after2 = gatherNode(after1, tree.cx, tree.cy, NOW + 6000);
    expect(after2.cells[cellKey(tree.cx, tree.cy)].currentHits).toBe(1); // снова с 1
  });
});

describe("gatherNode — камень (конечный)", () => {
  it("уменьшает hitsLeft после финального удара", () => {
    const s = base();
    s.inventory["stone_pickaxe"] = 5;
    const rock = firstCell(s, "rock");
    if (!rock) return; // нет камня в начальном состоянии — пропускаем

    let state = gatherNode(s, rock.cx, rock.cy, NOW);
    state = gatherNode(state, rock.cx, rock.cy, NOW + 100);
    state = gatherNode(state, rock.cx, rock.cy, NOW + 200);

    const cell = state.cells[cellKey(rock.cx, rock.cy)];
    expect(cell.hitsLeft).toBeLessThan(rock.cell.hitsLeft ?? 99);
    expect((state.inventory["stone"] ?? 0)).toBeGreaterThanOrEqual(1);
  });
});
