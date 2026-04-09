import { useState, useCallback, useEffect, useRef } from "react";
import { CROPS, getLevel, RECIPES, RESOURCE_NODES, EXPANSIONS, TOOLS, BUILDINGS, CHICKEN_LEVELS, COW_LEVELS, BEEHIVE_DEMO_DAILY, BEEHIVE_DAILY_POLLEN, BEEHIVE_ACTION_INTERVAL, BEEHIVE_ACTIONS_TO_UPGRADE, maxBeehiveSlots, ITEM_SELL } from "../data/crops";

export interface PlotState { cropId:string|null; plantedAt:number|null; }
export interface NodeState { type:string; lastHarvest:number; hitsLeft:number; }
export interface AnimalState { type:"chicken"|"cow"; xp:number; lastFed:number; lastCollect:number; sick:boolean; }
export interface BeehiveState { level:number; actions:number; lastAction:number; }
export interface GameState {
  coins:number; xp:number; inventory:Record<string,number>;
  plots:PlotState[]; nodes:NodeState[]; expansion:number;
  buildings:string[]; // built building ids
  animals:AnimalState[];
  beehives:BeehiveState[];
  pollen:number;
}

const KEY="nf_v5";
const load=():GameState|null=>{try{return JSON.parse(localStorage.getItem(KEY)!)}catch{return null}};
const persist=(s:GameState)=>{try{localStorage.setItem(KEY,JSON.stringify(s))}catch{}};

function newGame():GameState{
  return {
    coins:0.5,xp:0,inventory:{sunflower_seed:5,potato_seed:3},
    plots:Array.from({length:5},()=>({cropId:null,plantedAt:null})),
    nodes:[{type:"tree",lastHarvest:0,hitsLeft:-1},{type:"tree",lastHarvest:0,hitsLeft:-1},{type:"tree",lastHarvest:0,hitsLeft:-1},{type:"rock",lastHarvest:0,hitsLeft:20},{type:"rock",lastHarvest:0,hitsLeft:20}],
    expansion:0, buildings:["workbench","market"], animals:[], beehives:[{level:0,actions:0,lastAction:0}], pollen:0,
  };
}

export function useGame(){
  const [g,setG]=useState<GameState>(()=>load()||newGame());
  const t=useRef<any>(null);
  useEffect(()=>{clearTimeout(t.current);t.current=setTimeout(()=>persist(g),300);return()=>clearTimeout(t.current)},[g]);
  useEffect(()=>{const fn=()=>persist(g);window.addEventListener("beforeunload",fn);return()=>window.removeEventListener("beforeunload",fn)},[g]);

  const level=getLevel(g.xp);
  const crops=CROPS.filter(c=>c.level<=level);
  const availBuildings=BUILDINGS.filter(b=>b.level<=level&&!g.buildings.includes(b.id));
  const builtBuildings=g.buildings;

  // === SEEDS ===
  const buySeed=useCallback((cropId:string,qty:number)=>{const c=CROPS.find(x=>x.id===cropId);if(!c)return;setG(p=>{if(p.coins<c.seedPrice*qty)return p;const inv={...p.inventory};const k=`${cropId}_seed`;inv[k]=(inv[k]||0)+qty;return{...p,coins:+(p.coins-c.seedPrice*qty).toFixed(4),inventory:inv}});},[]);
  const plant=useCallback((idx:number,cropId:string)=>{setG(p=>{const k=`${cropId}_seed`;if((p.inventory[k]||0)<1||p.plots[idx]?.cropId)return p;const inv={...p.inventory};inv[k]--;if(inv[k]<=0)delete inv[k];const plots=[...p.plots];plots[idx]={cropId,plantedAt:Date.now()};return{...p,inventory:inv,plots}});},[]);
  const harvest=useCallback((idx:number)=>{setG(p=>{const pl=p.plots[idx];if(!pl?.cropId||!pl.plantedAt)return p;const c=CROPS.find(x=>x.id===pl.cropId);if(!c||Date.now()-pl.plantedAt<c.growMs)return p;const inv={...p.inventory};inv[c.id]=(inv[c.id]||0)+c.harvest;const plots=[...p.plots];plots[idx]={cropId:null,plantedAt:null};return{...p,inventory:inv,plots}});},[]);

  // === SELL (crops + resources) ===
  const sell=useCallback((itemId:string,qty:number)=>{setG(p=>{if((p.inventory[itemId]||0)<qty)return p;const crop=CROPS.find(x=>x.id===itemId);const price=crop?.sellPrice||ITEM_SELL[itemId]||0;if(!price)return p;const inv={...p.inventory};inv[itemId]-=qty;if(inv[itemId]<=0)delete inv[itemId];return{...p,coins:+(p.coins+price*qty).toFixed(4),inventory:inv}});},[]);

  // === COOK ===
  const cook=useCallback((recipeId:string)=>{const r=RECIPES.find(x=>x.id===recipeId);if(!r)return;setG(p=>{if(!p.buildings.includes(r.building)&&r.building!=="campfire")return p;const inv={...p.inventory};for(const i of r.ingredients)if((inv[i.id]||0)<i.n)return p;for(const i of r.ingredients){inv[i.id]-=i.n;if(inv[i.id]<=0)delete inv[i.id]}return{...p,inventory:inv,xp:p.xp+r.xp}});},[]);

  // === RESOURCE NODES ===
  const harvestNode=useCallback((idx:number)=>{setG(p=>{const node=p.nodes[idx];if(!node)return p;const def=RESOURCE_NODES[node.type];if(!def)return p;const now=Date.now();if(node.lastHarvest&&now-node.lastHarvest<def.cooldownMs)return p;
    // Check tool
    const tool=TOOLS.find(t=>t.forResource===node.type);
    if(tool&&(p.inventory[tool.id]||0)<1)return p;
    const inv={...p.inventory};inv[def.resource]=(inv[def.resource]||0)+def.amount;
    if(tool){inv[tool.id]--;if(inv[tool.id]<=0)delete inv[tool.id]}
    const nodes=[...p.nodes];nodes[idx]={...node,lastHarvest:now,hitsLeft:node.hitsLeft>0?node.hitsLeft-1:node.hitsLeft};
    return{...p,inventory:inv,nodes}});},[]);

  // === CRAFT TOOL ===
  const craftTool=useCallback((toolId:string,qty:number)=>{const tool=TOOLS.find(t=>t.id===toolId);if(!tool)return;setG(p=>{const inv={...p.inventory};for(const[res,amt]of Object.entries(tool.cost))if((inv[res]||0)<amt*qty)return p;for(const[res,amt]of Object.entries(tool.cost)){inv[res]-=amt*qty;if(inv[res]<=0)delete inv[res]}inv[tool.id]=(inv[tool.id]||0)+qty;return{...p,inventory:inv}});},[]);

  // === BUILD ===
  const build=useCallback((buildingId:string)=>{const b=BUILDINGS.find(x=>x.id===buildingId);if(!b)return;setG(p=>{if(p.buildings.includes(buildingId))return p;const inv={...p.inventory};let coins=p.coins;for(const[res,amt]of Object.entries(b.cost)){if(res==="coins"){if(coins<amt)return p;coins=+(coins-amt).toFixed(4)}else{if((inv[res]||0)<amt)return p;inv[res]-=amt;if(inv[res]<=0)delete inv[res]}}return{...p,coins,inventory:inv,buildings:[...p.buildings,buildingId]}});},[]);

  // === EXPAND ===
  const expand=useCallback(()=>{setG(p=>{const e=EXPANSIONS[p.expansion];if(!e||getLevel(p.xp)<e.minLevel)return p;const inv={...p.inventory};let coins=p.coins;for(const[res,amt]of Object.entries(e.cost)){if(res==="coins"){if(coins<amt)return p;coins=+(coins-amt).toFixed(4)}else{if((inv[res]||0)<amt)return p;inv[res]-=amt;if(inv[res]<=0)delete inv[res]}}const plots=[...p.plots,...Array.from({length:e.adds.plots},()=>({cropId:null,plantedAt:null}as PlotState))];const nodes=[...p.nodes];for(let i=0;i<e.adds.trees;i++)nodes.push({type:"tree",lastHarvest:0,hitsLeft:-1});for(let i=0;i<e.adds.rocks;i++)nodes.push({type:"rock",lastHarvest:0,hitsLeft:20});for(let i=0;i<e.adds.iron;i++)nodes.push({type:"iron",lastHarvest:0,hitsLeft:10});for(let i=0;i<e.adds.gold;i++)nodes.push({type:"gold",lastHarvest:0,hitsLeft:5});return{...p,coins,inventory:inv,plots,nodes,expansion:p.expansion+1}});},[]);

  // === ANIMALS ===
  const buyChicken=useCallback(()=>{setG(p=>{if(!p.buildings.includes("henhouse"))return p;const chickens=p.animals.filter(a=>a.type==="chicken");if(chickens.length>=10)return p;if(p.coins<5)return p;return{...p,coins:+(p.coins-5).toFixed(4),animals:[...p.animals,{type:"chicken",xp:0,lastFed:0,lastCollect:0,sick:false}]}});},[]);
  const buyCow=useCallback(()=>{setG(p=>{if(!p.buildings.includes("barn"))return p;const total=p.animals.filter(a=>a.type==="cow").length;if(total>=10)return p;if(p.coins<50)return p;return{...p,coins:+(p.coins-50).toFixed(4),animals:[...p.animals,{type:"cow",xp:0,lastFed:0,lastCollect:0,sick:false}]}});},[]);

  const feedAnimal=useCallback((idx:number)=>{setG(p=>{const a=p.animals[idx];if(!a)return p;const inv={...p.inventory};
    if(a.type==="chicken"){const lvl=CHICKEN_LEVELS.find(l=>a.xp>=l.xpNeeded)||CHICKEN_LEVELS[0];if((inv.wheat||0)<lvl.feedCost)return p;inv.wheat-=lvl.feedCost;if(inv.wheat<=0)delete inv.wheat}
    else{if((inv.wheat||0)<5)return p;inv.wheat-=5;if(inv.wheat<=0)delete inv.wheat}
    const animals=[...p.animals];animals[idx]={...a,lastFed:Date.now(),xp:a.xp+10};return{...p,inventory:inv,animals}});},[]);

  const collectAnimal=useCallback((idx:number)=>{setG(p=>{const a=p.animals[idx];if(!a||!a.lastFed)return p;
    const levels=a.type==="chicken"?CHICKEN_LEVELS:COW_LEVELS;
    let lvl=levels[0];for(const l of levels)if(a.xp>=l.xpNeeded)lvl=l;
    if(Date.now()-a.lastFed<lvl.timeMs)return p;
    const inv={...p.inventory};inv[lvl.product]=(inv[lvl.product]||0)+lvl.amount;
    const animals=[...p.animals];animals[idx]={...a,lastCollect:Date.now(),lastFed:0};
    return{...p,inventory:inv,animals}});},[]);

  // === BEEHIVE ===
  const beehiveAction=useCallback((idx:number)=>{setG(p=>{const h=p.beehives[idx];if(!h)return p;const now=Date.now();
    if(h.lastAction&&now-h.lastAction<BEEHIVE_ACTION_INTERVAL)return p;
    const beehives=[...p.beehives];const newActions=h.actions+1;
    let pollen=p.pollen+(h.level===0?BEEHIVE_DEMO_DAILY/3:BEEHIVE_DAILY_POLLEN/3);
    // Auto-upgrade demo to Lv1 at 1000 actions
    if(h.level===0&&newActions>=BEEHIVE_ACTIONS_TO_UPGRADE){beehives[idx]={level:1,actions:0,lastAction:now};pollen+=0}
    else{beehives[idx]={...h,actions:newActions,lastAction:now}}
    return{...p,beehives,pollen:+pollen.toFixed(4)}});},[]);

  const buyBeehive=useCallback(()=>{setG(p=>{const slots=maxBeehiveSlots(getLevel(p.xp));if(p.beehives.length>=slots)return p;if(p.pollen<1000)return p;return{...p,pollen:+(p.pollen-1000).toFixed(4),beehives:[...p.beehives,{level:1,actions:0,lastAction:0}]}});},[]);

  return{g,level,crops,availBuildings,builtBuildings,buySeed,plant,harvest,sell,cook,harvestNode,craftTool,build,expand,buyChicken,buyCow,feedAnimal,collectAnimal,beehiveAction,buyBeehive};
}
