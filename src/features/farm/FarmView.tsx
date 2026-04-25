import { useState, useRef, useCallback } from "react";
import { useStore } from "../../state/store";
import { useTick } from "../../hooks/useTick";
import { getCropDef } from "../../data/crops.data";
import { FRUITS } from "../../data/fruits.data";
import { FLOWERS } from "../../data/flowers.data";
import { RESOURCE_NODES } from "../../data/resourceNodes.data";
import { getExpansionList } from "../../data/expansions.data";
import { progress as calcProgress } from "../../domain/time/time";
import { isReady, remaining, fmtDuration } from "../../domain/time/time";
import { Progress } from "../shared/Progress";
import { PixelButton } from "../shared/PixelButton";
import { HenhouseScreen } from "../locations/HenhouseScreen";
import { BarnScreen } from "../locations/BarnScreen";
import { BLOCK_SIZE, computeGridBounds, getNextExpansionPos } from "../../domain/expansion/blocks";
import { getLevel } from "../../domain/level/level";
import { cellKey } from "../../domain/types/game";
import type { Cell } from "../../domain/types/game";
import type { CropId, FruitId, FlowerId } from "../../domain/types/ids";
import { cropStageSrc, nodeSrc, buildingSrc, beehiveSrc } from "../../lib/assets";

const CELL_SIZE = 52;

const GRASS_STYLE: React.CSSProperties = {
  backgroundImage: `url(/tiles/grass_basic.png)`,
  backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
  backgroundRepeat: "repeat",
};

export function FarmView() {
  useTick(1000);
  const blocks = useStore((s) => s.blocks);
  const cells = useStore((s) => s.cells);
  const clickCell = useStore((s) => s.clickCell);
  const selectedTool = useStore((s) => s.selectedTool);
  const location = useStore((s) => s.activeLocation);
  const expansion = useStore((s) => s.expansion);
  const island = useStore((s) => s.island);
  const pendingExpansion = useStore((s) => s.pendingExpansion);
  const xp = useStore((s) => s.xp);
  const inventory = useStore((s) => s.inventory);
  const coins = useStore((s) => s.coins);
  const startExpansion = useStore((s) => s.startExpansion);
  const completeExpansion = useStore((s) => s.completeExpansion);
  const moveMode = useStore((s) => s.moveMode);
  const moveSource = useStore((s) => s.moveSource);
  const buildingLevels = useStore((s) => s.buildingLevels);
  const beehives = useStore((s) => s.beehives);

  const [showExpandPopup, setShowExpandPopup] = useState(false);
  const [hoveredParent, setHoveredParent] = useState<string | null>(null);

  // Zoom & pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const panOrigin = useRef({ x: 0, y: 0 });

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.min(2, Math.max(0.4, z - e.deltaY * 0.001)));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only pan with middle button or when not clicking on interactive elements
    if (e.button === 1 || (e.button === 0 && e.target === e.currentTarget)) {
      isPanning.current = true;
      panStart.current = { x: e.clientX, y: e.clientY };
      panOrigin.current = { ...pan };
      e.preventDefault();
    }
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return;
    setPan({
      x: panOrigin.current.x + (e.clientX - panStart.current.x),
      y: panOrigin.current.y + (e.clientY - panStart.current.y),
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  if (location === "henhouse") return <HenhouseScreen />;
  if (location === "barn") return <BarnScreen />;

  const now = Date.now();
  const level = getLevel(xp);
  const nextPos = getNextExpansionPos(expansion);
  const allPositions = nextPos ? [...blocks, nextPos] : [...blocks];
  const bounds = computeGridBounds(allPositions);
  const blockSet = new Set(blocks.map((b) => `${b.bx},${b.by}`));

  // Pending expansion
  const pendingReady = pendingExpansion
    ? isReady(pendingExpansion.startedAt, pendingExpansion.durationMs, now)
    : false;
  const pendingRem = pendingExpansion
    ? remaining(pendingExpansion.startedAt, pendingExpansion.durationMs, now)
    : 0;

  // Next expansion info
  const expansionList = getExpansionList(island);
  const nextExp = expansion < expansionList.length ? expansionList[expansion] : null;
  const levelOk = nextExp ? level >= nextExp.minLevel : false;
  const canAfford = nextExp
    ? Object.entries(nextExp.cost).every(([res, needed]) => {
        if (res === "coins") return coins >= needed - 0.001;
        return (inventory[res] ?? 0) >= needed;
      })
    : false;

  return (
    <div
      className="flex-1 overflow-hidden relative cursor-grab active:cursor-grabbing"
      style={{
        background: "radial-gradient(ellipse at center, #7ec8e3 0%, #b8d4e8 40%, #e8eff5 70%, #f0f4f8 100%)",
      }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Zoom/pan container */}
      <div
        className="relative"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "center center",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
      {/* Island grid — grass goes on each in-block cell, not the whole container */}
      <div
        className="grid gap-0 relative"
        style={{
          gridTemplateColumns: `repeat(${bounds.gridW}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${bounds.gridH}, ${CELL_SIZE}px)`,
        }}
      >
        {Array.from({ length: bounds.gridH }, (_, gy) =>
          Array.from({ length: bounds.gridW }, (_, gx) => {
            const cx = bounds.minCellX + gx;
            const cy = bounds.minCellY + gy;
            const bx = Math.floor(cx / BLOCK_SIZE);
            const by = Math.floor(cy / BLOCK_SIZE);
            const bKey = `${bx},${by}`;
            const inBlock = blockSet.has(bKey);
            const isNextBlock = nextPos && bx === nextPos.bx && by === nextPos.by;
            const isPending = pendingExpansion &&
              bx === pendingExpansion.blockPos.bx &&
              by === pendingExpansion.blockPos.by;
            const key = cellKey(cx, cy);
            const cell = cells[key] ?? null;

            // Outside any block
            if (!inBlock && !isNextBlock && !isPending) {
              return <div key={`${gx}-${gy}`} className="bg-transparent" style={{ width: CELL_SIZE, height: CELL_SIZE }} />;
            }

            // Pending expansion block (building)
            if (isPending && !inBlock) {
              const localX = cx - pendingExpansion!.blockPos.bx * BLOCK_SIZE;
              const localY = cy - pendingExpansion!.blockPos.by * BLOCK_SIZE;
              const isCenter = localX === 1 && localY === 1;
              return (
                <div key={`${gx}-${gy}`}
                  className="bg-[#4a3a20] border border-dashed border-yellow-600/40 flex items-center justify-center"
                  style={{ width: CELL_SIZE, height: CELL_SIZE }}>
                  {isCenter && (pendingReady ? (
                    <button onClick={completeExpansion} className="font-game text-[7px] text-green-300 animate-pulse cursor-pointer">
                      Done!
                    </button>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="text-sm">🏗️</span>
                      <span className="font-game text-[6px] text-yellow-300">{fmtDuration(pendingRem)}</span>
                    </div>
                  ))}
                </div>
              );
            }

            // Next expansion block (expand button)
            if (isNextBlock && !inBlock) {
              const localX = cx - nextPos!.bx * BLOCK_SIZE;
              const localY = cy - nextPos!.by * BLOCK_SIZE;
              const isCenter = localX === 1 && localY === 1;
              return (
                <div key={`${gx}-${gy}`}
                  className="bg-[#1a3a10] border border-dashed border-green-700/30 flex items-center justify-center"
                  style={{ width: CELL_SIZE, height: CELL_SIZE }}>
                  {isCenter && nextExp && !pendingExpansion && (
                    <button
                      onClick={() => setShowExpandPopup(true)}
                      className="font-game text-[7px] text-green-400 hover:text-green-200 cursor-pointer flex flex-col items-center"
                    >
                      <span className="text-lg">➕</span>
                    </button>
                  )}
                </div>
              );
            }

            // Normal cell — wrap in grass background (only inside expanded blocks)
            return (
              <div key={`${gx}-${gy}`} style={GRASS_STYLE}>
                <CellView cell={cell} cx={cx} cy={cy}
                  onClick={() => clickCell(cx, cy)} selectedTool={selectedTool}
                  moveMode={moveMode} moveSource={moveSource}
                  hoveredParent={hoveredParent} setHoveredParent={setHoveredParent}
                  buildingLevels={buildingLevels} beehives={beehives} />
              </div>
            );
          }),
        )}
      </div>
      </div>{/* end zoom container */}

      {/* Expand popup overlay */}
      {showExpandPopup && nextExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowExpandPopup(false)}>
          <div className="bg-brown-700 border-2 border-black p-4 min-w-[260px] shadow-lg"
            onClick={(e) => e.stopPropagation()}>
            <h3 className="font-game text-[10px] text-yellow-300 mb-3">
              Expansion {nextExp.id}
            </h3>

            {/* Cost */}
            <div className="space-y-1 mb-3">
              <p className="font-game text-[8px] text-white/70">Cost:</p>
              {Object.entries(nextExp.cost).map(([res, needed]) => {
                const have = res === "coins" ? coins : (inventory[res] ?? 0);
                const ok = res === "coins" ? have >= needed - 0.001 : have >= needed;
                return (
                  <div key={res} className="flex justify-between font-game text-[8px]">
                    <span className="text-white">{res}: {needed}</span>
                    <span className={ok ? "text-green-400" : "text-red-400"}>
                      (have: {Math.floor(have)})
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Adds */}
            <div className="mb-3">
              <p className="font-game text-[8px] text-white/70">Добавляет:</p>
              <p className="font-game text-[7px] text-white">
                +{nextExp.adds.plots} грядок, +{nextExp.adds.trees} деревьев
                {(nextExp.adds.rocks ?? 0) > 0 && `, +${nextExp.adds.rocks} камень`}
                {(nextExp.adds.iron ?? 0) > 0 && `, +${nextExp.adds.iron} железо`}
                {(nextExp.adds.gold ?? 0) > 0 && `, +${nextExp.adds.gold} золото`}
                {(nextExp.adds.crimstone ?? 0) > 0 && `, +${nextExp.adds.crimstone} 🔴 crimstone`}
                {(nextExp.adds.flower_beds ?? 0) > 0 && `, +${nextExp.adds.flower_beds} 🌸 цветники`}
              </p>
            </div>

            {/* Level check */}
            {!levelOk && (
              <p className="font-game text-[7px] text-red-400 mb-2">
                Requires level {nextExp.minLevel} (you: {level})
              </p>
            )}

            {/* Buttons */}
            <div className="flex gap-2">
              <PixelButton
                disabled={!canAfford || !levelOk}
                onClick={() => { startExpansion(); setShowExpandPopup(false); }}
              >
                Build
              </PixelButton>
              <PixelButton variant="secondary" onClick={() => setShowExpandPopup(false)}>
                Cancel
              </PixelButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Cell rendering ---

interface CellViewProps {
  cell: Cell | null;
  cx: number;
  cy: number;
  onClick: () => void;
  selectedTool: string | null;
  moveMode: boolean;
  moveSource: string | null;
  hoveredParent: string | null;
  setHoveredParent: (key: string | null) => void;
  buildingLevels: Record<string, number>;
  beehives: Array<{ level: number }>;
}

function CellView({ cell, cx, cy, onClick, selectedTool, moveMode, moveSource, hoveredParent, setHoveredParent, buildingLevels, beehives }: CellViewProps) {
  const now = Date.now();
  const key = cellKey(cx, cy);
  const isSource = moveSource === key;
  const parentIsSource = cell?.parentKey ? moveSource === cell.parentKey : false;
  const effectiveIsSource = isSource || parentIsSource;

  // Determine parent key for hover grouping
  const parentKey = cell?.parentKey ?? ((cell?.w ?? 1) >= 2 ? key : null);
  const isHovered = parentKey ? hoveredParent === parentKey : false;

  const moveOverlay = moveMode && !effectiveIsSource
    ? "ring-1 ring-inset ring-orange-400/30"
    : effectiveIsSource
      ? "ring-2 ring-inset ring-orange-400 animate-pulse"
      : "";

  // Hover handlers for 2x2 group highlighting
  const hoverHandlers = parentKey ? {
    onMouseEnter: () => setHoveredParent(parentKey),
    onMouseLeave: () => setHoveredParent(null),
  } : {};

  const hoverHighlight = isHovered ? "brightness-125" : "";

  // Child cell (part of a 2x2 object) — transparent, click delegates to parent
  if (cell?.parentKey) {
    return (
      <div
        onClick={onClick}
        {...hoverHandlers}
        className={`cursor-pointer ${moveOverlay} ${hoverHighlight}`}
        style={{ width: CELL_SIZE, height: CELL_SIZE, filter: isHovered ? "brightness(1.25)" : undefined }}
      />
    );
  }

  // Empty cell — transparent over grass; only highlights in move mode
  if (!cell) {
    return (
      <div
        onClick={onClick}
        className={moveMode && moveSource ? "cursor-pointer border border-dashed border-green-400/50 bg-green-400/15" : ""}
        style={{ width: CELL_SIZE, height: CELL_SIZE }}
      />
    );
  }

  // Plot
  if (cell.type === "plot") {
    const growing = cell.cropId && cell.plantedAt;
    let icon = "🟫";
    let prog = -1;
    let ready = false;
    let cropImg: string | null = null;

    if (growing) {
      const crop = getCropDef(cell.cropId as CropId);
      icon = crop.emoji;
      prog = calcProgress(cell.plantedAt!, crop.growMs, now);
      ready = prog >= 1;
      cropImg = cropStageSrc(crop.id, prog, ready);
    } else if (selectedTool?.endsWith("_seed")) {
      icon = "➕";
    }

    return (
      <div onClick={onClick}
        className={`relative flex flex-col items-center justify-center cursor-pointer
          ${ready ? "animate-pulse" : ""} ${moveOverlay}`}
        style={{ width: CELL_SIZE, height: CELL_SIZE }}>
        {/* Empty plot dirt patch — only when nothing growing */}
        {!growing && (
          <img
            src="/plot/plot_empty.png"
            alt=""
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        )}
        {cropImg && growing ? (
          <img
            src={cropImg}
            alt=""
            className="relative w-full h-full object-contain pointer-events-none"
            style={{ imageRendering: "auto" }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          selectedTool?.endsWith("_seed") && <span className="relative text-lg">➕</span>
        )}
        {growing && !ready && (
          <>
            <span
              className="absolute font-game text-white leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]"
              style={{ bottom: "5px", fontSize: "7px" }}
            >
              {fmtDuration(remaining(cell.plantedAt!, getCropDef(cell.cropId as CropId).growMs, now))}
            </span>
            <Progress value={prog} className="absolute bottom-0 left-0 right-0 h-1" />
          </>
        )}
        {ready && (
          <span className="absolute top-0 right-0 text-[8px] font-game text-green-300">!</span>
        )}
      </div>
    );
  }

  // Fruit patch
  if (cell.type === "fruit_patch") {
    const fruitDef = cell.fruitId ? FRUITS.find((f) => f.id === (cell.fruitId as FruitId)) : null;
    const growing = !!cell.fruitId && !!cell.fruitPlantedAt;
    const prog = growing && fruitDef ? calcProgress(cell.fruitPlantedAt!, fruitDef.growMs, now) : -1;
    const ready = prog >= 1;
    const harvestsLeft = cell.fruitHarvestsLeft ?? 0;
    return (
      <div onClick={onClick}
        className={`relative flex flex-col items-center justify-center cursor-pointer
          border border-black/10 ${ready ? "bg-[#4a2a60] animate-pulse" : "bg-[#3a1a50] hover:bg-[#4a2a60]"} ${moveOverlay}`}
        style={{ width: CELL_SIZE, height: CELL_SIZE }}>
        <span className="text-lg">{fruitDef ? fruitDef.emoji : (selectedTool?.endsWith("_seed") ? "➕" : "🌿")}</span>
        {growing && !ready && fruitDef && (
          <>
            <span className="absolute font-game text-white leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]"
              style={{ bottom: "5px", fontSize: "7px" }}>
              {fmtDuration(remaining(cell.fruitPlantedAt!, fruitDef.growMs, now))}
            </span>
            <Progress value={prog} className="absolute bottom-0 left-0 right-0 h-1" />
          </>
        )}
        {ready && <span className="absolute top-0 right-0 text-[8px] font-game text-green-300">!</span>}
        {harvestsLeft > 0 && (
          <span className="absolute bottom-0 left-0 font-game text-[6px] text-yellow-300 ml-0.5 mb-0.5">{harvestsLeft}x</span>
        )}
      </div>
    );
  }

  // Flower bed
  if (cell.type === "flower_bed") {
    const flowerDef = cell.flowerId ? FLOWERS.find((f) => f.id === (cell.flowerId as FlowerId)) : null;
    const growing = !!cell.flowerId && !!cell.flowerPlantedAt;
    const prog = growing && flowerDef ? calcProgress(cell.flowerPlantedAt!, flowerDef.growMs, now) : -1;
    const ready = prog >= 1;
    return (
      <div onClick={onClick}
        className={`relative flex flex-col items-center justify-center cursor-pointer
          border border-black/10 ${ready ? "bg-[#5a1a4a] animate-pulse" : "bg-[#3a1a35] hover:bg-[#5a1a4a]"} ${moveOverlay}`}
        style={{ width: CELL_SIZE, height: CELL_SIZE }}>
        <span className="text-lg">{flowerDef ? flowerDef.emoji : (selectedTool?.endsWith("_seed") ? "➕" : "🌱")}</span>
        {growing && !ready && flowerDef && (
          <>
            <span className="absolute font-game text-white leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]"
              style={{ bottom: "5px", fontSize: "7px" }}>
              {fmtDuration(remaining(cell.flowerPlantedAt!, flowerDef.growMs, now))}
            </span>
            <Progress value={prog} className="absolute bottom-0 left-0 right-0 h-1" />
          </>
        )}
        {ready && <span className="absolute top-0 right-0 text-[8px] font-game text-green-300">!</span>}
      </div>
    );
  }

  // Resource node
  if (["tree", "rock", "iron", "gold", "crimstone", "oil_reserve", "obsidian_rock", "sunstone_rock", "lava_pit"].includes(cell.type)) {
    const nodeDef = RESOURCE_NODES[cell.type];
    const onCooldown = !isReady(cell.lastHarvest ?? 0, nodeDef.cooldownMs, now);
    const exhausted = nodeDef.maxNodes >= 0 && (cell.hitsLeft ?? 0) <= 0;
    const rawHits = cell.currentHits ?? 0;
    const lastHitAt = cell.lastHitAt ?? 0;
    const idleExpired = lastHitAt > 0 && (now - lastHitAt) > 5000;
    const hits = idleExpired ? 0 : rawHits;
    const hitProg = hits > 0 ? hits / nodeDef.hitsToGather : 0;
    const rem = remaining(cell.lastHarvest ?? 0, nodeDef.cooldownMs, now);

    const is2x2Node = (cell.w ?? 1) >= 2;
    const sz = is2x2Node ? 2 : 1;
    const isTree = cell.type === "tree";
    const showEmpty = exhausted || (isTree && onCooldown);
    const imgSrc = nodeSrc(cell.type, showEmpty);
    const fallbackIcon = isTree && onCooldown ? "🪵" : nodeDef.emoji;
    const iconSize = is2x2Node ? (onCooldown ? "32px" : "48px") : "20px";

    return (
      <div onClick={onClick}
        {...hoverHandlers}
        className={`relative flex flex-col items-center justify-center cursor-pointer ${exhausted ? "opacity-50" : ""} ${moveOverlay}`}
        style={{
          width: CELL_SIZE, height: CELL_SIZE,
          overflow: is2x2Node ? "visible" : "hidden",
          zIndex: is2x2Node ? 10 : 1,
          filter: isHovered ? "brightness(1.25)" : undefined,
        }}>
        {/* Icon spanning 2x2 (autocropped sources fill their own bbox) */}
        {imgSrc ? (
          <img
            src={imgSrc}
            alt=""
            className={`absolute object-contain pointer-events-none max-w-none ${exhausted ? "grayscale" : ""}`}
            style={{ top: 0, left: 0, width: CELL_SIZE * sz, height: CELL_SIZE * sz }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <span
            className={`absolute flex items-center justify-center pointer-events-none ${exhausted ? "grayscale" : ""}`}
            style={{ top: 0, left: 0, width: CELL_SIZE * sz, height: CELL_SIZE * sz, fontSize: iconSize }}>
            {fallbackIcon}
          </span>
        )}

        {/* Cooldown timer — centered on 2x2 */}
        {onCooldown && !exhausted && (
          <span
            className="absolute font-game text-yellow-300 text-center pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
            style={{
              top: is2x2Node ? CELL_SIZE * 0.8 : CELL_SIZE * 0.6,
              left: 0,
              width: CELL_SIZE * sz,
              fontSize: is2x2Node ? "10px" : "6px",
            }}>
            {fmtDuration(rem)}
          </span>
        )}

        {exhausted && <span className="font-game text-[6px] text-red-400">Empty</span>}

        {/* Hit progress bar spanning 2x2 */}
        {hits > 0 && !onCooldown && !exhausted && (
          <div
            className="absolute pointer-events-none"
            style={{ bottom: 0, left: 0, width: CELL_SIZE * sz, height: 6 }}>
            <Progress value={hitProg} className="w-full h-full" color="bg-orange-400" />
          </div>
        )}
      </div>
    );
  }

  // Building
  if (cell.type === "building") {
    const is2x2 = (cell.w ?? 1) >= 2;
    const bId = cell.buildingId ?? "";
    const bLevel = buildingLevels[bId] ?? 1;
    const buildingImg = buildingSrc(bId, bLevel);
    const wPx = is2x2 ? CELL_SIZE * 2 : CELL_SIZE;
    return (
      <div onClick={onClick}
        {...hoverHandlers}
        className={`relative flex items-center justify-center cursor-pointer ${moveOverlay}`}
        style={{
          width: CELL_SIZE, height: CELL_SIZE,
          overflow: is2x2 ? "visible" : "hidden",
          zIndex: is2x2 ? 10 : 1,
          filter: isHovered ? "brightness(1.25)" : undefined,
        }}>
        {buildingImg ? (
          <img
            src={buildingImg}
            alt=""
            className="absolute object-contain pointer-events-none max-w-none"
            style={{ top: 0, left: 0, width: wPx, height: wPx }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <span
            className="absolute flex items-center justify-center pointer-events-none"
            style={{ top: 0, left: 0, width: wPx, height: wPx, fontSize: is2x2 ? "40px" : "20px" }}>
            {buildingEmoji(cell.buildingId)}
          </span>
        )}
      </div>
    );
  }

  // Beehive
  if (cell.type === "beehive") {
    const bee = cell.beehiveIdx != null ? beehives[cell.beehiveIdx] : null;
    const lvl = bee?.level ?? 1;
    const hiveImg = beehiveSrc(lvl);
    return (
      <div onClick={onClick}
        className={`flex items-center justify-center cursor-pointer ${moveOverlay}`}
        style={{ width: CELL_SIZE, height: CELL_SIZE }}>
        <img
          src={hiveImg}
          alt=""
          className="w-full h-full object-contain pointer-events-none"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
      </div>
    );
  }

  // Greenhouse (2x2)
  if (cell.type === "greenhouse") {
    const is2x2 = (cell.w ?? 1) >= 2;
    const hasPlant = !!cell.greenhouseCropId;
    const ready = hasPlant && cell.greenhousePlantedAt != null; // simplified — actual ready check in action
    return (
      <div onClick={onClick}
        {...hoverHandlers}
        className={`relative flex items-center justify-center bg-[#1a4a30] border border-black/10 cursor-pointer hover:bg-[#255a3a] ${moveOverlay}`}
        style={{
          width: CELL_SIZE, height: CELL_SIZE,
          overflow: is2x2 ? "visible" : "hidden",
          zIndex: is2x2 ? 10 : 1,
          filter: isHovered ? "brightness(1.25)" : undefined,
        }}>
        <span
          className="absolute flex items-center justify-center pointer-events-none"
          style={{
            top: 0, left: 0,
            width: is2x2 ? CELL_SIZE * 2 : CELL_SIZE,
            height: is2x2 ? CELL_SIZE * 2 : CELL_SIZE,
            fontSize: is2x2 ? "36px" : "18px",
          }}>
          {hasPlant ? (ready ? "✅" : "🌱") : "🏡"}
        </span>
      </div>
    );
  }

  return <div className="bg-[#3a7a28] border border-[#2d6a1e]/30" style={{ width: CELL_SIZE, height: CELL_SIZE }} />;
}

function buildingEmoji(id?: string): string {
  switch (id) {
    case "workbench": return "🔨";
    case "market": return "🏪";
    case "campfire": return "🔥";
    case "well": return "🪣";
    case "henhouse": return "🐔";
    case "kitchen": return "🍳";
    case "barn": return "🐄";
    case "bakery": return "🧁";
    case "feeder": return "🥣";
    case "toolshed": return "🧰";
    default: return "🏠";
  }
}
