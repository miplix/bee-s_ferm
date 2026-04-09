import { useState, useEffect } from "react";
import { useGame } from "./hooks/useGame";
import { CROPS, RECIPES, LEVELS, getLevel, SPRITE_SIZE, SPRITE_FRAMES, RESOURCE_NODES, EXPANSIONS, TOOLS, BUILDINGS, CHICKEN_LEVELS, COW_LEVELS, BEEHIVE_ACTION_INTERVAL, BEEHIVE_ACTIONS_TO_UPGRADE, BEEHIVE_DAILY_POLLEN, maxBeehiveSlots, ITEM_SELL } from "./data/crops";

function fmt(ms:number){if(ms<=0)return"Готово!";const s=Math.floor(ms/1000),m=Math.floor(s/60),h=Math.floor(m/60);return h>0?`${h}ч${m%60}м`:m>0?`${m}м${s%60}с`:`${s}с`}
function CropSprite({sprite,progress}:{sprite:string;progress:number}){const f=Math.min(SPRITE_FRAMES-1,Math.floor(progress*SPRITE_FRAMES));return<div className="w-9 h-9 overflow-hidden mx-auto" style={{imageRendering:"pixelated"}}><img src={sprite} alt="" draggable={false} style={{width:SPRITE_FRAMES*SPRITE_SIZE,height:SPRITE_SIZE,objectFit:"none",objectPosition:`-${f*SPRITE_SIZE}px 0`}}/></div>}

type Panel="shop"|"inv"|"cook"|"expand"|"craft"|"build"|"animals"|"beehive"|null;

export default function App(){
  const{g,level,crops,availBuildings,builtBuildings,buySeed,plant,harvest,sell,cook,harvestNode,craftTool,build,expand,buyChicken,buyCow,feedAnimal,collectAnimal,beehiveAction,buyBeehive}=useGame();
  const[panel,setPanel]=useState<Panel>(null);
  const[selPlot,setSelPlot]=useState<number|null>(null);
  const[,tick]=useState(0);
  useEffect(()=>{const i=setInterval(()=>tick(t=>t+1),1000);return()=>clearInterval(i)},[]);

  const curLvl=LEVELS.find(l=>l.level===level);const nextLvl=LEVELS.find(l=>l.level===level+1);
  const xpCur=g.xp-(curLvl?.xp||0);const xpNeed=(nextLvl?.xp||g.xp)-(curLvl?.xp||0);
  const plotCols=Math.min(7,Math.max(3,Math.ceil(Math.sqrt(g.plots.length))));

  const PanelWrap=({children,title}:{children:React.ReactNode;title:string})=>(
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={()=>setPanel(null)}>
      <div className="bg-brown-700 border-2 border-brown-600 rounded-xl p-3 w-[340px] max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e=>e.stopPropagation()}>
        <div className="flex justify-between items-center mb-2"><span className="text-[10px] text-amber-200 font-bold">{title}</span><button onClick={()=>setPanel(null)} className="text-gray-400 hover:text-white text-sm">✕</button></div>
        {children}
      </div>
    </div>
  );

  const Btn=({children,onClick,disabled,color="green"}:{children:React.ReactNode;onClick:()=>void;disabled?:boolean;color?:string})=>(
    <button onClick={onClick} disabled={disabled} className={`text-[7px] bg-${color}-800 hover:bg-${color}-700 disabled:opacity-30 text-white px-1.5 py-0.5 rounded shrink-0`}>{children}</button>
  );

  return(
    <div className="w-full h-full flex flex-col overflow-hidden" style={{background:"linear-gradient(180deg,#87CEEB 0%,#5da33a 50%,#3d7a25 100%)"}}>
      {/* HUD */}
      <div className="flex items-center justify-between px-2 py-1 z-10 shrink-0 flex-wrap gap-1">
        <div className="flex items-center gap-1 flex-wrap">
          <div className="bg-brown-700/90 border border-brown-600 rounded px-2 py-0.5 flex items-center gap-1 text-[8px]">
            ⭐Ур.{level} <div className="w-8 h-1 bg-brown-600 rounded-full overflow-hidden"><div className="h-full bg-yellow-400" style={{width:`${xpNeed>0?(xpCur/xpNeed)*100:100}%`}}/></div>
          </div>
          <div className="bg-brown-700/90 border border-brown-600 rounded px-2 py-0.5 flex items-center gap-1 text-[8px]">🪙{g.coins.toFixed(2)}</div>
          <div className="bg-brown-700/90 border border-brown-600 rounded px-2 py-0.5 flex items-center gap-1 text-[8px]">🌸{g.pollen.toFixed(1)}</div>
        </div>
        <div className="flex items-center gap-0.5 flex-wrap">
          {([["shop","🏪"],["inv","📦"],["cook","🍳"],["craft","🔨"],["build","🏗️"],["animals","🐔"],["beehive","🐝"],["expand","🗺️"]] as [Panel,string][]).map(([id,icon])=>(
            <button key={id!} onClick={()=>setPanel(panel===id?null:id)} className={`bg-brown-700/90 hover:bg-brown-500 border border-brown-600 rounded px-1.5 py-0.5 text-[8px] ${panel===id?"ring-1 ring-yellow-400":""}`}>{icon}</button>
          ))}
        </div>
      </div>

      {/* FARM */}
      <div className="flex-1 overflow-auto flex items-start justify-center pt-1 pb-4 px-2">
        <div className="flex flex-col items-center gap-3">
          {/* Plots */}
          <div className="grid gap-0.5" style={{gridTemplateColumns:`repeat(${plotCols},56px)`}}>
            {g.plots.map((plot,i)=>{const crop=plot.cropId?CROPS.find(c=>c.id===plot.cropId):null;const elapsed=plot.plantedAt?Date.now()-plot.plantedAt:0;const ready=crop?elapsed>=crop.growMs:false;const progress=crop?Math.min(1,elapsed/crop.growMs):0;
              return(<div key={i} className="relative cursor-pointer hover:scale-105 active:scale-95 transition-transform" style={{width:56,height:56,background:"#6b4226",borderRadius:3,border:ready?"2px solid #ffd700":"1px solid #4a2f1a",boxShadow:ready?"0 0 6px #ffd700":"inset 0 1px 2px rgba(0,0,0,0.4)"}} onClick={()=>{if(ready)harvest(i);else if(!crop)setSelPlot(i)}}>
                {crop?<div className="absolute inset-0 flex flex-col items-center justify-center"><CropSprite sprite={crop.sprite} progress={progress}/>{!ready&&<><span className="text-[6px] text-amber-200">{fmt(crop.growMs-elapsed)}</span><div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/30"><div className="h-full bg-green-400" style={{width:`${progress*100}%`}}/></div></>}{ready&&<span className="text-[6px] text-yellow-300 font-bold animate-pulse">✅</span>}</div>
                :<div className="absolute inset-0 flex items-center justify-center text-[7px] text-amber-700/40">🌱</div>}
              </div>)})}
          </div>
          {/* Resources */}
          <div className="flex flex-wrap gap-1.5 justify-center">
            {g.nodes.map((node,i)=>{const def=RESOURCE_NODES[node.type];if(!def)return null;const cd=node.lastHarvest?def.cooldownMs-(Date.now()-node.lastHarvest):0;const ok=cd<=0&&(node.hitsLeft<0||node.hitsLeft>0);const tool=TOOLS.find(t=>t.forResource===node.type);const hasTool=!tool||(g.inventory[tool.id]||0)>0;
              return(<div key={i} className={`flex flex-col items-center justify-center cursor-pointer transition-transform ${ok&&hasTool?"hover:scale-110":"opacity-40"}`} style={{width:44,height:44,background:"#3d5a1e",borderRadius:4,border:"1px solid #2d4a15"}} onClick={()=>ok&&hasTool&&harvestNode(i)}>
                <span className="text-lg">{def.emoji}</span><span className="text-[6px] text-green-200">{def.resource}</span>
                {cd>0&&<span className="text-[5px] text-yellow-300">{fmt(cd)}</span>}
                {!hasTool&&ok&&<span className="text-[5px] text-red-300">🔧</span>}
              </div>)})}
          </div>
          {/* Buildings */}
          <div className="flex flex-wrap gap-1.5 justify-center">
            {builtBuildings.filter(id=>!["workbench","market"].includes(id)).map(id=>{const b=BUILDINGS.find(x=>x.id===id);if(!b)return null;
              return(<div key={id} className="flex flex-col items-center justify-center" style={{width:48,height:48,background:"#5a3210",borderRadius:6,border:"1px solid #3e2210"}}>
                <span className="text-lg">{b.emoji}</span><span className="text-[6px] text-amber-200">{b.name}</span>
              </div>)})}
          </div>
          {/* Beehives */}
          <div className="flex flex-wrap gap-1.5 justify-center">
            {g.beehives.map((h,i)=>{const cd=h.lastAction?BEEHIVE_ACTION_INTERVAL-(Date.now()-h.lastAction):0;const ok=cd<=0;const pct=h.level===0?Math.min(100,(h.actions/BEEHIVE_ACTIONS_TO_UPGRADE)*100):100;
              return(<div key={i} className={`flex flex-col items-center justify-center cursor-pointer transition-transform ${ok?"hover:scale-110":"opacity-50"}`} style={{width:52,height:52,background:"#8B6914",borderRadius:6,border:"1px solid #6b5210"}} onClick={()=>ok&&beehiveAction(i)}>
                <span className="text-lg">🐝</span><span className="text-[6px] text-amber-200">Ур.{h.level}</span>
                {h.level===0&&<div className="w-8 h-1 bg-black/30 rounded-full overflow-hidden"><div className="h-full bg-yellow-400" style={{width:`${pct}%`}}/></div>}
                {cd>0&&<span className="text-[5px] text-yellow-300">{fmt(cd)}</span>}
              </div>)})}
          </div>
        </div>
      </div>

      {/* Plant popup */}
      {selPlot!==null&&(<div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 bg-brown-700/95 border border-brown-600 rounded-lg p-2 shadow-xl backdrop-blur">
        <div className="text-[8px] text-amber-200 mb-1">🌱 Грядка #{selPlot+1}</div>
        <div className="flex gap-1 flex-wrap max-w-[280px]">{crops.map(c=>{const seeds=g.inventory[`${c.id}_seed`]||0;return(<button key={c.id} disabled={seeds<1} onClick={()=>{plant(selPlot,c.id);setSelPlot(null)}} className="flex flex-col items-center bg-brown-600/50 hover:bg-brown-500 disabled:opacity-25 rounded p-1 min-w-[40px]"><span className="text-sm">{c.emoji}</span><span className="text-[6px] text-amber-200">{c.name}</span><span className="text-[5px] text-gray-400">×{seeds}</span></button>)})}</div>
        <button onClick={()=>setSelPlot(null)} className="mt-1 text-[6px] text-gray-400 hover:text-white">✕</button>
      </div>)}

      {/* === PANELS === */}
      {panel==="shop"&&<PanelWrap title="🏪 Рынок семян">{crops.map(c=>(<div key={c.id} className="flex items-center gap-1.5 bg-brown-600/30 rounded p-1 mb-1"><span className="text-base">{c.emoji}</span><div className="flex-1 min-w-0"><div className="text-[8px] text-amber-100">{c.name}</div><div className="text-[6px] text-gray-400">{fmt(c.growMs)}·×{c.harvest}·🪙{c.sellPrice}</div></div><Btn onClick={()=>buySeed(c.id,1)} disabled={g.coins<c.seedPrice}>🪙{c.seedPrice}</Btn><Btn onClick={()=>buySeed(c.id,10)} disabled={g.coins<c.seedPrice*10}>×10</Btn></div>))}</PanelWrap>}

      {panel==="inv"&&<PanelWrap title="📦 Инвентарь">{Object.keys(g.inventory).length===0?<div className="text-[7px] text-gray-500 py-2 text-center">Пусто</div>:
        <div className="grid grid-cols-4 gap-1">{Object.entries(g.inventory).map(([id,count])=>{const crop=CROPS.find(c=>c.id===id);const isSeed=id.endsWith("_seed");const seedCrop=isSeed?CROPS.find(c=>c.id===id.replace("_seed","")):null;const tool=TOOLS.find(t=>t.id===id);
          const emoji=crop?.emoji||seedCrop?.emoji||tool?.emoji||({wood:"🪵",stone:"🪨",iron:"⛏️",gold:"🪙",egg:"🥚",milk:"🥛",honey:"🍯",pollen:"🌸"}[id]||"📦");
          const name=crop?.name||(seedCrop?`${seedCrop.name} сем.`:(tool?.name||id));
          const price=crop?.sellPrice||ITEM_SELL[id]||0;
          return(<div key={id} className="relative bg-brown-600/40 rounded p-1 flex flex-col items-center"><span className="text-sm">{emoji}</span><span className="text-[5px] text-amber-200 truncate w-full text-center">{name}</span><span className="absolute -top-0.5 -right-0.5 bg-amber-700 text-white text-[6px] font-bold rounded-full min-w-[10px] h-2.5 flex items-center justify-center px-0.5">{count}</span>{price>0&&<button onClick={()=>sell(id,1)} className="text-[5px] bg-green-800 hover:bg-green-700 text-green-200 px-0.5 rounded mt-0.5">🪙{price}</button>}</div>)})}</div>
      }</PanelWrap>}

      {panel==="cook"&&<PanelWrap title="🍳 Готовка → XP">{RECIPES.filter(r=>builtBuildings.includes(r.building)).map(r=>{const can=r.ingredients.every(i=>(g.inventory[i.id]||0)>=i.n);return(<div key={r.id} className="flex items-center gap-1.5 bg-brown-600/30 rounded p-1 mb-1"><span className="text-base">{r.emoji}</span><div className="flex-1"><div className="text-[8px] text-amber-100">{r.name} <span className="text-yellow-400">+{r.xp}XP</span></div><div className="text-[6px] text-gray-400">{r.ingredients.map(i=>`${CROPS.find(c=>c.id===i.id)?.emoji||({egg:"🥚",milk:"🥛",honey:"🍯"}[i.id]||"?")} ×${i.n}`).join(" + ")}</div></div><Btn onClick={()=>cook(r.id)} disabled={!can} color="amber">Готовить</Btn></div>)})}{RECIPES.filter(r=>builtBuildings.includes(r.building)).length===0&&<div className="text-[7px] text-gray-500 py-2 text-center">Постройте Костёр или Кухню</div>}</PanelWrap>}

      {panel==="craft"&&<PanelWrap title="🔨 Верстак — Инструменты">{TOOLS.map(tool=>{const can=Object.entries(tool.cost).every(([r,a])=>(g.inventory[r]||0)>=a);const have=g.inventory[tool.id]||0;return(<div key={tool.id} className="flex items-center gap-1.5 bg-brown-600/30 rounded p-1 mb-1"><span className="text-base">{tool.emoji}</span><div className="flex-1"><div className="text-[8px] text-amber-100">{tool.name} <span className="text-gray-400">(×{have})</span></div><div className="text-[6px] text-gray-400">{Object.entries(tool.cost).map(([r,a])=>`${r} ×${a}`).join(" + ")}</div></div><Btn onClick={()=>craftTool(tool.id,1)} disabled={!can}>Крафт</Btn><Btn onClick={()=>craftTool(tool.id,5)} disabled={!can}>×5</Btn></div>)})}
      </PanelWrap>}

      {panel==="build"&&<PanelWrap title="🏗️ Строительство">{availBuildings.length===0?<div className="text-[7px] text-gray-500 py-2 text-center">Все доступные здания построены</div>:availBuildings.map(b=>{const can=Object.entries(b.cost).every(([r,a])=>r==="coins"?g.coins>=a:(g.inventory[r]||0)>=a);return(<div key={b.id} className="flex items-center gap-1.5 bg-brown-600/30 rounded p-1.5 mb-1"><span className="text-xl">{b.emoji}</span><div className="flex-1"><div className="text-[8px] text-amber-100">{b.name} <span className="text-gray-400">ур.{b.level}+</span></div><div className="text-[6px] text-gray-400">{b.desc}</div><div className="text-[6px] text-amber-300 mt-0.5">{Object.entries(b.cost).map(([r,a])=>`${r==="coins"?"🪙":r} ×${a}`).join(" + ")||"Бесплатно"}</div></div><Btn onClick={()=>build(b.id)} disabled={!can}>Построить</Btn></div>)})}</PanelWrap>}

      {panel==="expand"&&<PanelWrap title="🗺️ Расширение">{(()=>{const e=EXPANSIONS[g.expansion];if(!e)return<div className="text-[7px] text-green-300 py-2 text-center">✅ Все расширения!</div>;const can=level>=e.minLevel&&Object.entries(e.cost).every(([r,a])=>r==="coins"?g.coins>=a:(g.inventory[r]||0)>=a);return(<div className="bg-brown-600/30 rounded p-2"><div className="text-[8px] text-amber-100 mb-1">Расширение #{e.id} (мин.ур.{e.minLevel})</div><div className="text-[6px] text-gray-400 mb-1">{Object.entries(e.cost).map(([r,a])=>`${r==="coins"?"🪙":r} ×${a}`).join(", ")}</div><div className="text-[6px] text-green-300 mb-1.5">+{e.adds.plots}грядок +{e.adds.trees}дер. +{e.adds.rocks}камн.{e.adds.iron>0?` +${e.adds.iron}жел.`:""}{e.adds.gold>0?` +${e.adds.gold}зол.`:""}</div><Btn onClick={()=>{expand();setPanel(null)}} disabled={!can}>{can?"🔓 Расширить":`🔒 Ур.${e.minLevel}`}</Btn></div>)})()}<div className="text-[7px] text-gray-400 mt-2">Грядок: {g.plots.length} | Ресурсов: {g.nodes.length} | Расш: {g.expansion}/{EXPANSIONS.length}</div></PanelWrap>}

      {panel==="animals"&&<PanelWrap title="🐔 Животные">{!builtBuildings.includes("henhouse")&&!builtBuildings.includes("barn")?<div className="text-[7px] text-gray-500 py-2 text-center">Постройте Курятник или Хлев</div>:<>
        {builtBuildings.includes("henhouse")&&<><div className="text-[8px] text-amber-200 mb-1">🐔 Куры ({g.animals.filter(a=>a.type==="chicken").length}/10)</div>
          {g.animals.filter(a=>a.type==="chicken").map((a,i)=>{const idx=g.animals.indexOf(a);let lvl=CHICKEN_LEVELS[0];for(const l of CHICKEN_LEVELS)if(a.xp>=l.xpNeeded)lvl=l;const ready=a.lastFed&&Date.now()-a.lastFed>=lvl.timeMs;const cd=a.lastFed?lvl.timeMs-(Date.now()-a.lastFed):0;
            return(<div key={idx} className="flex items-center gap-1.5 bg-brown-600/30 rounded p-1 mb-0.5"><span>🐔</span><div className="flex-1"><span className="text-[7px] text-amber-100">Ур.{lvl.level} XP:{a.xp}</span>{a.lastFed&&!ready&&<span className="text-[6px] text-gray-400 ml-1">{fmt(cd)}</span>}{ready&&<span className="text-[6px] text-yellow-300 ml-1">🥚Готово!</span>}</div>{!a.lastFed&&<Btn onClick={()=>feedAnimal(idx)} disabled={(g.inventory.wheat||0)<lvl.feedCost}>Кормить({lvl.feedCost}🌾)</Btn>}{ready&&<Btn onClick={()=>collectAnimal(idx)}>Собрать</Btn>}</div>)})}
          <Btn onClick={buyChicken} disabled={g.coins<5||g.animals.filter(a=>a.type==="chicken").length>=10}>+🐔 (5🪙)</Btn></>}
        {builtBuildings.includes("barn")&&<><div className="text-[8px] text-amber-200 mb-1 mt-2">🐄 Коровы ({g.animals.filter(a=>a.type==="cow").length}/10)</div>
          {g.animals.filter(a=>a.type==="cow").map((a,i)=>{const idx=g.animals.indexOf(a);let lvl=COW_LEVELS[0];for(const l of COW_LEVELS)if(a.xp>=l.xpNeeded)lvl=l;const ready=a.lastFed&&Date.now()-a.lastFed>=lvl.timeMs;const cd=a.lastFed?lvl.timeMs-(Date.now()-a.lastFed):0;
            return(<div key={idx} className="flex items-center gap-1.5 bg-brown-600/30 rounded p-1 mb-0.5"><span>🐄</span><div className="flex-1"><span className="text-[7px] text-amber-100">Ур.{lvl.level} XP:{a.xp}</span>{a.lastFed&&!ready&&<span className="text-[6px] text-gray-400 ml-1">{fmt(cd)}</span>}{ready&&<span className="text-[6px] text-yellow-300 ml-1">🥛Готово!</span>}</div>{!a.lastFed&&<Btn onClick={()=>feedAnimal(idx)} disabled={(g.inventory.wheat||0)<5}>Кормить(5🌾)</Btn>}{ready&&<Btn onClick={()=>collectAnimal(idx)}>Собрать</Btn>}</div>)})}
          <Btn onClick={buyCow} disabled={g.coins<50||g.animals.filter(a=>a.type==="cow").length>=10}>+🐄 (50🪙)</Btn></>}
      </>}</PanelWrap>}

      {panel==="beehive"&&<PanelWrap title="🐝 Пчелиные домики">{g.beehives.map((h,i)=>{const cd=h.lastAction?BEEHIVE_ACTION_INTERVAL-(Date.now()-h.lastAction):0;const ok=cd<=0;const pct=h.level===0?(h.actions/BEEHIVE_ACTIONS_TO_UPGRADE)*100:100;
        return(<div key={i} className="bg-brown-600/30 rounded p-1.5 mb-1"><div className="flex items-center gap-1.5"><span className="text-lg">🐝</span><div className="flex-1"><div className="text-[8px] text-amber-100">{h.level===0?"Демо-домик":`Домик Ур.${h.level}`}</div>{h.level===0&&<><div className="text-[6px] text-gray-400">Прогресс: {h.actions}/{BEEHIVE_ACTIONS_TO_UPGRADE} ({pct.toFixed(1)}%)</div><div className="w-full h-1 bg-black/30 rounded-full overflow-hidden mt-0.5"><div className="h-full bg-yellow-400" style={{width:`${pct}%`}}/></div></>}{h.level>0&&<div className="text-[6px] text-green-300">+{(BEEHIVE_DAILY_POLLEN/3).toFixed(1)} пыльцы/действие</div>}</div>{ok?<Btn onClick={()=>beehiveAction(i)}>Действие</Btn>:<span className="text-[6px] text-yellow-300">{fmt(cd)}</span>}</div></div>)})}<div className="mt-1.5 flex items-center gap-2"><span className="text-[7px] text-amber-200">Пыльца: 🌸{g.pollen.toFixed(1)}</span><span className="text-[7px] text-gray-400">Слотов: {g.beehives.length}/{maxBeehiveSlots(level)}</span></div>{maxBeehiveSlots(level)>g.beehives.length&&<Btn onClick={buyBeehive} disabled={g.pollen<1000}>+🐝 Домик (1000🌸)</Btn>}</PanelWrap>}
    </div>
  );
}
