import fs from 'node:fs';
import { act, allocate, buy, derived, equip, equipSkill, respec, nextStage, learn, newGame, selectTarget, skill, startBattle, statCost } from '../src/game.ts';
export function random(seed) { let x=seed>>>0;return()=>{x+=0x6D2B79F5;let t=Math.imul(x^x>>>15,1|x);t^=t+Math.imul(t^t>>>7,61|t);return((t^t>>>14)>>>0)/4294967296;}; }
const profiles = {
  basic: {name:'通常攻撃・能力投資', skills:[],slots:[],weights:{atk:4,hp:2,def:2,agi:2,sp:0}},
  combo: {name:'強化・チャージ・決定打',skills:['heavy','ward','regen','charge','finisher','bash'],slots:['regen','charge','finisher','bash'],weights:{atk:4,hp:2,def:1,agi:2,sp:2}},
  efficient: {name:'スマッシュ3枠＋全回復',skills:['heavy','mend','renew'],slots:['heavy','heavy','heavy','renew'],weights:{atk:3,hp:2,def:4,agi:2,sp:1}},
  aoe: {name:'全体攻撃＋回復',skills:['heavy','double','mend','ward','drain'],slots:['double','mend','ward','drain'],weights:{atk:4,hp:2,def:2,agi:2,sp:2}},
  speed: {name:'命中回避・低消費',skills:['heavy','ward','focus','drain','mend','renew'],slots:['heavy','focus','drain','renew'],weights:{atk:3,hp:2,def:2,agi:3,sp:1}},
};
export function buildProfile(id,xp,gold,armor='chain') {
  const p=profiles[id],g=newGame();g.xp=xp;g.gold=gold;
  for(const id of p.skills) { if(!learn(g,id))throw Error('skill budget '+id); }
  if(id==='combo'||id==='aoe') while(derived(g).maxSp<(id==='aoe'?30:28)) {if(!allocate(g,'sp'))throw Error('SP budget');}
  // Diminishing stat gains per XP: fixed declared weights choose the next affordable purchase.
  while(true) { const choices=Object.keys(p.weights).filter(k=>p.weights[k]>0&&statCost(g,k)<=g.xp).sort((a,b)=>p.weights[b]/statCost(g,b)-p.weights[a]/statCost(g,a));if(!choices.length)break;allocate(g,choices[0]); }
  buy(g,'iron');buy(g,armor);
  p.slots.forEach((id,i)=>equipSkill(g,i,id));
  return g;
}
function available(g,id){return g.slots.findIndex((s,i)=>s===id&&g.cooldowns[i]===0&&g.sp>=skill(id).sp&&!g.effects.panic);}
export function choose(g,id,{healerFirst=true}={}) {
  const alive=g.enemies.map((e,i)=>({e,i})).filter(f=>f.e.hp>0);
  const healer=alive.find(f=>f.e.style==='healer');
  const t=healerFirst&&healer?healer:alive[0];selectTarget(g,t.i);
  const d=derived(g),can=s=>available(g,s);
  if(g.effects.panic&&g.remedies>0&&id!=='basic')return 'remedy';
  if(g.hp<d.maxHp*.55&&can('renew')>=0)return can('renew');
  if(g.hp<d.maxHp*.55&&can('mend')>=0)return can('mend');
  if(g.hp<d.maxHp*.35&&g.potions>0)return 'potion';
  if(g.sp<8&&g.ethers>0&&id!=='basic')return 'ether';
  if(id==='combo'){
    if(can('regen')>=0&&(!g.effects.attack||g.effects.attack.power<0)&&g.sp>=24)return can('regen');
    if(can('bash')>=0&&!g.enemy.effects.defense&&g.enemy.def>=18&&g.sp>=28)return can('bash');
    if(can('charge')>=0&&!g.charge&&g.sp>=19)return can('charge');
    if(can('finisher')>=0&&(g.charge||g.enemy.hp>d.atk*2))return can('finisher');
  }
  if(id==='aoe'&&alive.length>1&&can('double')>=0)return can('double');
  if(id==='speed'){
    if(can('focus')>=0&&(!g.effects.agility||g.effects.agility.power<0)&&g.enemy.agi>d.agi)return can('focus');
    if(can('drain')>=0&&!g.enemy.effects.agility&&g.enemy.agi>d.agi)return can('drain');
  }
  if(can('heavy')>=0)return can('heavy');
  return 'attack';
}
export function fight(id,{xp=300,gold=130,stage=2,encounter=0,boss=false,seed=1,armor='chain',healerFirst=true}={}) {
  const g=buildProfile(id,xp,gold,armor),stats={...g.stats},sp=derived(g).maxSp;g.stage=stage;g.kills=3;startBattle(g,boss,encounter);
  const rng=random(seed);let turns=0,spSpent=0,potions=0,ethers=0,remedies=0;
  while(g.phase==='battle'&&turns<150) {
    const action=choose(g,id,{healerFirst});
    if(typeof action==='number')spSpent+=skill(g.slots[action]).sp;
    if(action==='potion')potions++;if(action==='ether')ethers++;if(action==='remedy')remedies++;
    if(!act(g,action,rng))throw Error('policy chose invalid action');turns++;
  }
  return {win:['victory','clear','complete'].includes(g.phase),turns,spSpent,potions,ethers,remedies,stats,maxSp:sp,remainingXp:g.xp-(g.phase==='victory'?([14,24,35,50][stage]):['clear','complete'].includes(g.phase)?([42,72,105,150][stage]):0)};
}
export function measure(id,opts,n=300){
 const runs=Array.from({length:n},(_,i)=>fight(id,{...opts,seed:i+1}));
 const mean=k=>Math.round(runs.reduce((s,r)=>s+r[k],0)/n*100)/100;
 return {build:profiles[id].name,...opts,n,winRate:mean('win'),meanTurns:mean('turns'),meanSP:mean('spSpent'),meanPotions:mean('potions'),meanEthers:mean('ethers'),meanRemedies:mean('remedies'),stats:runs[0].stats,maxSp:runs[0].maxSp};
}

export function campaign(seed=1) {
 const g=newGame(),rng=random(seed);let battles=0,losses=0,farms=0,turns=0,needFarm=false;const visited=[];
 const prepare=()=>{
   respec(g);
   for(const id of ['heavy','mend'])learn(g,id);
   if(g.xp>=90)learn(g,'renew');
   const weights={atk:3,hp:2,def:4,agi:2,sp:1};
   while(true){const choices=Object.keys(weights).filter(k=>statCost(g,k)<=g.xp).sort((a,b)=>weights[b]/statCost(g,b)-weights[a]/statCost(g,a));if(!choices.length)break;allocate(g,choices[0]);}
   g.slots=['heavy','heavy','heavy',g.learned.includes('renew')?'renew':'mend'];
   for(const id of ['iron','leather','chain','mind-robe','steel','rune','moon'])buy(g,id);
   const preferred=(g.stage===1&&g.kills===3||g.stage===3&&g.kills>=1)?'mind-robe':g.owned.includes('rune')?'rune':g.owned.includes('chain')?'chain':g.owned.includes('leather')?'leather':'cloth';
   if(g.owned.includes(preferred))equip(g,preferred);
   while(g.potions<2&&g.gold>=10)buy(g,'potion');
   if(g.ethers<1&&g.gold>=15)buy(g,'ether');
   if(g.remedies<1&&g.gold>=12)buy(g,'remedy');
 };
 while(g.phase!=='complete'&&battles<100) {
   if(g.phase==='clear'){visited.push(g.stage);nextStage(g);}
   prepare();
   const boss=g.kills===3;
   const farming=needFarm;needFarm=false;
   startBattle(g,boss&&!farming,farming?0:Math.min(g.kills,2));
   if(farming)farms++;
   let n=0;while(g.phase==='battle'&&n<150){act(g,choose(g,'efficient'),rng);n++;}turns+=n;battles++;
   if(g.phase==='defeat'){losses++;needFarm=true;}
   if(g.phase==='battle')break;
 }
 return {seed,complete:g.phase==='complete',battles,losses,farms,turns,earnedXp:g.earnedXp,gold:g.gold,visited};
}

export function report() {
 const encounters=[{label:'高DEFのゴーレム',stage:2,encounter:0,xp:300,gold:130},{label:'高AGIの影の剣士',stage:2,encounter:1,xp:300,gold:130},{label:'衛兵＋回復役',stage:2,encounter:2,xp:300,gold:130},{label:'森ボス＋毒',stage:1,boss:true,xp:220,gold:130},{label:'最終ボス＋回復役',stage:3,boss:true,xp:600,gold:130}];
 const rows=encounters.flatMap(e=>Object.keys(profiles).map(id=>({...measure(id,e),encounterName:e.label})));
 rows.push({...measure('efficient',{stage:2,encounter:2,xp:300,gold:130,healerFirst:false}),encounterName:'衛兵＋回復役（回復役後回し）'});
 for(const armor of ['chain','mind-robe'])rows.push({...measure('combo',{stage:1,boss:true,xp:220,gold:130,armor}),encounterName:'森ボス（封印耐性比較）'});
 for(const armor of ['chain','venom-vest'])rows.push({...measure('efficient',{stage:1,encounter:0,xp:130,gold:130,armor}),encounterName:'毒の群れ（毒耐性比較）'});
 const campaigns=Array.from({length:100},(_,i)=>campaign(i+1));
 console.log('campaign',JSON.stringify({completions:campaigns.filter(c=>c.complete).length,maxBattles:Math.max(...campaigns.map(c=>c.battles)),maxLosses:Math.max(...campaigns.map(c=>c.losses)),maxFarms:Math.max(...campaigns.map(c=>c.farms))}));
 fs.writeFileSync('docs/balance-results.json',JSON.stringify({seedRange:'1..300',turnLimit:150,campaigns,rows},null,2)+'\n');
 let md='# 戦闘比較の記録\n\n同じ行グループは総XP・装備予算・初期消耗品が同じ。初期消耗品はHP回復3、SP回復1、治療2。各条件でseed 1〜300の300戦、150ターン上限。勝率は最適戦術の証明ではなく、公開した固定方策の結果。残りXPは使い切れる範囲で能力へ投資。装備は鉄の剣＋指定防具。消耗品の補充費用は装備予算に含めない。\n\n再実行: `node scripts/balance.mjs`。方策、能力配分、各試行の乱数はスクリプトから再現可能。詳細は [JSON](balance-results.json)。\n\n| 敵 | XP | 型 | 勝率 | 平均手数 | SP | HP薬 | SP薬 | 治療薬 |\n|---|---:|---|---:|---:|---:|---:|---:|---:|\n';
 for(const r of rows)md+='| '+[r.encounterName+(r.armor?' / '+r.armor:''),r.xp,r.build,Math.round(r.winRate*100)+'%',r.meanTurns,r.meanSP,r.meanPotions,r.meanEthers,r.meanRemedies].join(' | ')+' |\n';
 md+='\n## 通し進行\n\n初期30XP・20Gから、実際の戦闘報酬だけで育成・装備購入・消耗品補充を行う100seedの進行検証。完走 '+campaigns.filter(c=>c.complete).length+'/100。最大戦闘数 '+Math.max(...campaigns.map(c=>c.battles))+'、最大敗北 '+Math.max(...campaigns.map(c=>c.losses))+'、最大再戦 '+Math.max(...campaigns.map(c=>c.farms))+'。途中に無料振り直しを使う固定方策であり、すべての育て方の完走を保証するものではない。\n';
 md+="\n## 結果の読み方と今回の調整\n\n- 高DEFの単体敵は、同じ300XP・130Gで通常攻撃中心が平均6.84手、強化・チャージ型が3.15手。一方、回復役を含む2体戦では全体攻撃型が5.03手、強化・チャージ型は10.87手。単一の準備コンボを全編隊へ繰り返せばよい結果にはなっていない。\n- 同じ低消費型で、回復役を先に狙うと10.61手、後回しでは12.27手。撃破順で必要手数が変わる。\n- 森ボスの封印に対し、耐性装備では治療薬消費が0になる。通常DEF装備は守りが強い代わりに治療の手数と在庫が必要。毒耐性にも防御値との交換条件がある。\n- 初回は全体攻撃220%が同条件の2体戦で11.79手かかり、育成・SP投資に見合わなかった。300%へ調整後は5.03手。低SP技の待機は2行動とし、3枠に積む意味を保持した。\n- 能力中心の通常攻撃も通用する。育成の価値を消すためにすべての敵を特定スキル必須にはしていない。\n- AGI補助を厚く積んだ今回の固定方策は、単純な手数では不利な結果が残る。勝率だけで全技を均衡済みとは扱わない。命中回避の効果と、準備に使う手数の価値は引き続きプレイ評価する。\n- 自動比較は勝敗・費用・相性を検証する道具であり、原作と同等の面白さを保証するものではない。原作の攻略記録から確認した戦術上の関係を、操作して評価できる段階にした。\n";
 fs.writeFileSync('docs/balance-results.md',md);
 console.table(rows.map(r=>({enemy:r.encounterName,build:r.build,win:r.winRate,turn:r.meanTurns,SP:r.meanSP,HP薬:r.meanPotions,治療:r.meanRemedies,armor:r.armor??'chain'})));
 return rows;
}
if(process.argv[1]?.replaceAll('\\','/').endsWith('/scripts/balance.mjs'))report();
