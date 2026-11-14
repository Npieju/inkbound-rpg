import { derived, ITEMS, newGame, SKILLS, STAGES, meetsStats } from './game.ts';
import type { Game, Stat } from './game.ts';
export const SAVE_KEY='inkbound.save.v4';
/** Development save format only; earlier prototypes are intentionally not migrated. */
export function decodeSave(raw:string|null):Game|null{
 if(!raw)return null;
 try{
   const v=JSON.parse(raw),integer=(n:unknown,max=1e8)=>typeof n==='number'&&Number.isSafeInteger(n)&&n>=0&&n<=max;
   if(!v||v.version!==4||!integer(v.stage,STAGES.length-1)||!integer(v.kills,3)||
    !['gold','xp','earnedXp','totalKills'].every(k=>integer(v[k]))||
    !['potions','ethers','remedies'].every(k=>integer(v[k],9))||
    !v.stats||!['hp','sp','atk','def','agi'].every(k=>integer(v.stats[k],1000000))||
    !ITEMS.some(i=>i.id===v.weapon&&i.slot==='weapon')||!ITEMS.some(i=>i.id===v.armor&&i.slot==='armor')||
    !['camp','battle','victory','defeat','clear','complete'].includes(v.phase)||
    !Array.isArray(v.learned)||v.learned.length>SKILLS.length||new Set(v.learned).size!==v.learned.length||
    !v.learned.every((id:unknown)=>SKILLS.some(s=>s.id===id))||
    !v.learned.every((id:string)=>SKILLS.find(s=>s.id===id)!.requires.every(p=>v.learned.includes(p)))||
    !Array.isArray(v.slots)||v.slots.length!==4||!v.slots.every((id:unknown)=>id===null||v.learned.includes(id)&&SKILLS.some(s=>s.id===id&&s.kind!=='passive'))||
    !Array.isArray(v.owned)||v.owned.length>ITEMS.length||!v.owned.every((id:unknown)=>ITEMS.some(i=>i.id===id))||!v.owned.includes(v.weapon)||!v.owned.includes(v.armor)||
    !Array.isArray(v.log)||v.log.length>20||!v.log.every((l:unknown)=>typeof l==='string'&&l.length<300))return null;
   if(['clear','complete'].includes(v.phase)&&(v.kills!==3||(v.phase==='complete')!==(v.stage===STAGES.length-1)))return null;
   const g=newGame();
   for(const k of ['stage','kills','gold','xp','earnedXp','totalKills','potions','ethers','remedies']as const)g[k]=v[k];
   g.stats=Object.fromEntries(['hp','sp','atk','def','agi'].map(k=>[k,v.stats[k]]))as Record<Stat,number>;
   g.weapon=v.weapon;g.armor=v.armor;g.owned=[...new Set<string>(v.owned)];g.learned=[...v.learned];g.slots=[...v.slots];
   if(!g.learned.every(id=>meetsStats(g,SKILLS.find(s=>s.id===id)!)))return null;
   g.phase=v.phase==='battle'?'camp':v.phase;g.log=[...v.log];
   if(v.phase==='battle')g.log.unshift('中断した戦闘からマップに戻った。HP・SPが全回復した。');
   g.log=g.log.slice(0,20);g.hp=derived(g).maxHp;g.sp=derived(g).maxSp;return g;
 }catch{return null;}
}
export function loadGame(storage:Pick<Storage,'getItem'>):Game{try{return decodeSave(storage.getItem(SAVE_KEY))??newGame();}catch{return newGame();}}
export function saveGame(g:Game,storage:Pick<Storage,'setItem'>):boolean{try{storage.setItem(SAVE_KEY,JSON.stringify(g));return true;}catch{return false;}}
