import test from 'node:test';
import assert from 'node:assert/strict';
import { act, allocate, buy, derived, encounterPreview, equip, equipSkill, hitChance, learn, newGame, nextStage, respec, selectTarget, startBattle, statCost } from '../src/game.ts';
import { decodeSave, loadGame, saveGame, SAVE_KEY } from '../src/save.ts';
const mid = () => .5;
function sandbox(ids = []) {
  const g = newGame(); g.xp = 1000;
  for (const id of ids) assert.equal(learn(g, id), true);
  startBattle(g); g.enemies[0].hp = g.enemies[0].maxHp = 10000; g.enemies[0].atk = 1;
  return g;
}
test('one XP pool, prerequisites and immutable invalid actions', () => {
  const g = newGame(); assert.equal(learn(g, 'finisher'), false);
  assert.ok(learn(g, 'heavy')); assert.ok(allocate(g, 'atk')); assert.equal(g.xp, 10); assert.equal(statCost(g, 'atk'), 13);
  const before = JSON.stringify(g); assert.equal(allocate(g, 'atk'), false); assert.equal(JSON.stringify(g), before);
});
test('three duplicate cheap attacks rotate while each slot has an independent cooldown', () => {
  const g = sandbox(['heavy']); equipSkill(g, 1, 'heavy'); // forbidden during combat
  assert.equal(g.slots[1], null); g.phase = 'camp'; equipSkill(g, 1, 'heavy'); equipSkill(g, 2, 'heavy'); startBattle(g);
  g.enemy.hp = 1000; g.enemy.atk = 1;
  assert.ok(act(g, 0, mid)); const before = JSON.stringify(g);
  assert.equal(act(g, 0, mid), null); assert.equal(JSON.stringify(g), before);
  assert.ok(act(g, 1, mid)); assert.ok(act(g, 2, mid)); assert.ok(act(g, 0, mid)); assert.equal(g.sp, 4);
});
test('Rage → Charge → Fatal amplifies one strike, not all future attacks', () => {
  const g = sandbox(['heavy', 'charge', 'finisher', 'ward', 'regen']);
  g.slots = ['regen', 'charge', 'finisher', null]; g.sp = 100;
  act(g, 0, mid); act(g, 1, mid); const burst = act(g, 2, mid).playerDamage;
  const normal = act(g, 'attack', mid).playerDamage;
  assert.ok(burst > normal * 5); assert.equal(g.charge, 0);
});
test('Break and Slow modify the target DEF and actual hit probability', () => {
  const g = sandbox(['bash', 'drain']); g.enemy.def = 26; g.enemy.agi = 35;
  const unmodified = act(g, 'attack', mid).playerDamage;
  act(g, 0, mid); const modified = act(g, 'attack', mid).playerDamage; assert.ok(modified > unmodified);
  const before = hitChance(derived(g).agi, g.enemy.agi); act(g, 1, mid);
  assert.ok(hitChance(derived(g).agi, Math.round(g.enemy.agi * .5)) > before);
  assert.ok(hitChance(35, 10) > hitChance(10, 35));
});
test('buffs do not multiply without bound and expire after their stated action window', () => {
  const g = sandbox(['ward']); g.slots = ['ward', 'ward', null, null];
  act(g, 0, mid); const defense = derived(g).def; act(g, 1, mid); assert.equal(derived(g).def, defense);
  for (let i = 0; i < 3; i++) act(g, 'attack', mid); assert.equal(g.effects.defense, undefined);
});
test('killing a selected foe removes its action; reward waits for the whole group', () => {
  const g = newGame(); g.kills = 1; startBattle(g, false, 1); const xp = g.xp;
  g.enemies[1].hp = 1; assert.ok(selectTarget(g, 1)); act(g, 'attack', mid);
  assert.equal(g.phase, 'battle'); assert.equal(g.enemies[1].turn, 0); assert.equal(g.xp, xp); assert.equal(g.target, 0);
  assert.equal(selectTarget(g, 1), false); g.enemy.hp = 1; act(g, 'attack', mid);
  assert.equal(g.phase, 'victory'); assert.equal(g.kills, 2); assert.equal(g.xp, xp + 14);
  assert.equal(g.hp, derived(g).maxHp); assert.equal(g.sp, derived(g).maxSp);
});
test('Flame hits both living targets, spends 30 SP and consumes Charge once', () => {
  const g = newGame(); g.xp = 1000; for(const id of ['heavy','charge','double']) learn(g,id);
  g.kills = 1; startBattle(g,false,1); g.slots = ['double','charge',null,null]; g.sp = 100;
  g.enemies.forEach(e => { e.hp = e.maxHp = 1000; e.atk = 1; e.def = 0; e.agi = 10; });
  act(g,1,mid); const before=g.sp; const r=act(g,0,mid);
  assert.equal(before-g.sp,30); assert.equal(r.hits,2); assert.equal(g.enemies[0].hp,g.enemies[1].hp); assert.equal(g.charge,0);
});
test('a healer actually restores a wounded ally; targeting the healer bypasses this', () => {
  const g=newGame(); g.kills=2; startBattle(g,false,2); g.enemies[0].hp=20;
  selectTarget(g,1); act(g,'attack',mid); assert.equal(g.enemies[1].heals,2); assert.ok(g.enemies[0].hp>20);
});
test('poison resistance and seal resistance change usable resources and actions', () => {
  for(const armor of ['cloth','venom-vest']) {
    const g=newGame();g.stage=1;g.armor=armor;startBattle(g);act(g,'potion',mid);
    assert.equal(!!g.effects.poison,armor==='cloth');
  }
  for(const armor of ['cloth','mind-robe']) {
    const g=newGame();learn(g,'heavy');g.stage=1;g.kills=3;g.armor=armor;startBattle(g,true);
    act(g,'attack',mid); assert.equal(!!g.effects.panic,armor==='cloth');
    if(armor==='cloth'){const before=JSON.stringify(g);assert.equal(act(g,0,mid),null);assert.equal(JSON.stringify(g),before);act(g,'remedy',mid);assert.equal(g.effects.panic,undefined);}
    else assert.ok(act(g,0,mid));
  }
});
test('Heal, Full Recover, Ether cap resources and recovery does not become a free action', () => {
  const g=sandbox(['mend','renew']);g.hp=10;act(g,0,mid);assert.ok(g.hp>10);assert.ok(g.hp<derived(g).maxHp);
  g.effects.poison={power:.06,turns:3};g.effects.attack={power:-.35,turns:3};g.sp=20;
  act(g,1,mid);assert.equal(g.effects.poison,undefined);assert.equal(g.effects.attack,undefined);assert.ok(g.hp<=derived(g).maxHp);
  g.sp=19;act(g,'ether',mid);assert.equal(g.sp,20);assert.equal(g.ethers,0);
});
test('owned gear is a collection: expensive damage gear does not block resistance gear or switching back', () => {
  const g=newGame();g.gold=1000;buy(g,'rune');buy(g,'venom-vest');assert.equal(g.armor,'venom-vest');
  assert.ok(equip(g,'rune'));assert.equal(g.armor,'rune');assert.equal(buy(g,'rune'),false);
});
test('respec refunds exact escalating stat costs and skill costs without duplicating XP', () => {
  const g=newGame();g.xp=500;for(let i=0;i<4;i++)allocate(g,'atk');learn(g,'heavy');learn(g,'charge');
  assert.ok(respec(g));assert.equal(g.xp,500);assert.equal(g.stats.atk,0);assert.deepEqual(g.learned,[]);
  respec(g);assert.equal(g.xp,500);
});
test('escape never awards XP or advances a map node; all terminal battle outcomes restore HP/SP', () => {
  const g=newGame();startBattle(g);g.hp=10;g.sp=1;
  assert.ok(act(g,'run',()=>0).escaped);assert.equal(g.xp,30);assert.equal(g.kills,0);assert.equal(g.hp,70);assert.equal(g.sp,20);
  startBattle(g);g.hp=1;act(g,'potion',mid);g.hp=1;act(g,'attack',mid);
  assert.equal(g.phase,'defeat');assert.equal(g.hp,70);assert.equal(g.sp,20);
});
test('v2 migration refunds old skill costs while retaining progress, stats and owned equipment', () => {
  const v={...newGame(),version:2,stage:1,kills:2,weapon:'steel',armor:'chain',xp:7,learned:['heavy','charge'],slots:['charge','heavy',null,null]};
  const g=decodeSave(JSON.stringify(v));assert.ok(g);assert.equal(g.xp,47);assert.equal(g.stage,1);assert.equal(g.kills,2);
  assert.deepEqual(g.learned,[]);assert.ok(g.owned.includes('steel'));assert.equal(g.version,3);
  const storage={getItem:k=>k==='inkbound.save.v2'?JSON.stringify(v):null};assert.equal(loadGame(storage).xp,47);
});
test('save validation rejects malicious/invalid fields and reload does not trust a combat enemy', () => {
  for(const patch of [{gold:-1},{weapon:'<script>'},{learned:['unknown']},{stats:{hp:-1}},{slots:['heavy']},{owned:[]}])
    assert.equal(decodeSave(JSON.stringify({...newGame(),...patch})),null);
  const g=newGame();startBattle(g);g.enemy.atk=999999;
  const loaded=decodeSave(JSON.stringify(g));assert.equal(loaded.phase,'camp');assert.deepEqual(loaded.enemies,[]);assert.equal(loaded.enemy,null);
  let key;assert.ok(saveGame(g,{setItem:k=>{key=k;}}));assert.equal(key,SAVE_KEY);
  assert.equal(saveGame(g,{setItem(){throw Error('quota');}}),false);
});
test('encounter previews are isolated and stage/boss gates are enforced',()=>{
 const g=newGame();assert.equal(startBattle(g,true),false);assert.equal(startBattle(g,false,2),false);
 const a=encounterPreview(0,0);a[0].hp=0;assert.equal(encounterPreview(0,0)[0].hp,30);
 assert.equal(nextStage(g),false);
});

import { campaign, measure } from '../scripts/balance.mjs';
test('same-budget comparisons keep single-target burst, group damage and target priority distinct',()=>{
 const opts={stage:2,encounter:0,xp:300,gold:130};
 assert.ok(measure('combo',opts,100).meanTurns<measure('basic',opts,100).meanTurns);
 const group={...opts,encounter:2};
 assert.ok(measure('aoe',group,100).meanTurns<measure('combo',group,100).meanTurns);
 assert.ok(measure('efficient',group,100).meanTurns<measure('efficient',{...group,healerFirst:false},100).meanTurns);
});
test('campaign completes all four stages using only initial funds and earned rewards',()=>{
 for(let seed=1;seed<=100;seed++){const r=campaign(seed);assert.ok(r.complete,JSON.stringify(r));assert.ok(r.battles<=24);assert.ok(r.farms<=4);assert.deepEqual(r.visited,[0,1,2]);}
});
