import test from 'node:test';
import assert from 'node:assert/strict';
import {act,allocate,baseStats,derived,equipSkill,learn,newGame,respec,SKILLS,startBattle,skillCost,skillBlockReason} from '../src/game.ts';
import {decodeSave,loadGame,SAVE_KEY} from '../src/save.ts';
const mid=()=>.5;
function prepared(ids){const g=newGame();g.xp=1000;for(const id of ids)assert.ok(learn(g,id),id);return g;}
function dummy(g){startBattle(g);g.enemy.hp=g.enemy.maxHp=2000;g.enemy.atk=3;return g;}
test('new tree has four job families, active skills and slot-free passives',()=>{
 assert.equal(SKILLS.length,28);assert.equal(new Set(SKILLS.map(s=>s.branch)).size,4);
 const g=prepared(['cleave','follow','spark','meditation']);
 assert.deepEqual(g.slots,['cleave','spark',null,null]);assert.equal(equipSkill(g,2,'follow'),false);
 assert.equal(learn(g,'not-a-skill'),false);
});
test('a few advanced skills require invested base stats, not equipment bonuses',()=>{
 const g=prepared(['spark']);g.weapon='focus-blade';assert.equal(learn(g,'overload'),false);
 for(let i=0;i<3;i++)allocate(g,'sp');assert.equal(baseStats(g).sp,38);assert.ok(learn(g,'overload'));
 const xp=g.xp;respec(g);assert.ok(g.xp>xp);const refunded=g.xp;respec(g);assert.equal(g.xp,refunded);
});
test('multi-hit wounds and harvest have working interactions',()=>{
 const g=dummy(prepared(['flurry','serration','harvest']));act(g,0,mid);
 assert.equal(g.enemy.effects.bleed.stacks,3);assert.ok(g.log.some(l=>l.includes('裂傷')));
 const before=g.enemy.hp;act(g,1,mid);assert.ok(before-g.enemy.hp>derived(g).atk);
 assert.ok(g.log.some(l=>l.includes('刈り取り')));
});
test('barrier triggers retaliation, storage and bounded SP recovery',()=>{
 const g=dummy(prepared(['shieldstrike','riposte','reservoir','fortitude']));
 g.enemy.atk=14;const r=act(g,0,mid);
 assert.ok(r.playerDamage>derived(g).atk*.8);assert.ok(g.stored>0);assert.equal(g.sp,18);
 const stored=g.stored;act(g,'attack',mid);assert.ok(g.log.some(l=>l.includes('を放出')));assert.ok(g.stored<stored+10);
});
test('spells scale with maximum SP and HP casting uses HP, not SP',()=>{
 const g=prepared(['spark','ember']);
 for(let i=0;i<3;i++)allocate(g,'hp');
 assert.ok(learn(g,'bloodcast'));const power=derived(g).spell;allocate(g,'sp');assert.ok(derived(g).spell>power);
 dummy(g);g.slots=['bloodcast',null,null,null];g.sp=0;const before=g.hp;
 act(g,0,mid);assert.equal(g.sp,0);assert.ok(g.hp<=before-12);assert.ok(g.enemy.effects.burn);
 g.hp=12;g.cooldowns[0]=0;const state=JSON.stringify(g);assert.match(skillBlockReason(g,0),/HP/);assert.equal(act(g,0,mid),null);assert.equal(JSON.stringify(g),state);
});
test('a dodge makes the next manual strike a guaranteed critical; triggered strikes do not recurse',()=>{
 const g=dummy(prepared(['flurry','foresight','pursuit']));
 act(g,'potion',()=>.999);assert.equal(g.readyCrit,true);
 const r=act(g,0,()=>.999);assert.equal(r.critical,true);assert.equal(g.readyCrit,true); // player evades again, ready for next action
 assert.ok(r.hits>=1);assert.ok(r.hits<=2);
});
test('spell pressure raises cost but does not forbid skills; resistance only reduces the surcharge',()=>{
 const g=dummy(prepared(['spark']));g.effects.strain={power:2,turns:2};
 assert.equal(skillCost(g,SKILLS.find(s=>s.id==='spark')),6);
 g.armor='mind-robe';assert.equal(skillCost(g,SKILLS.find(s=>s.id==='spark')),5);assert.ok(act(g,0,mid));
});
test('terminal combat restores resources and the development save loads only v4',()=>{
 const g=prepared(['cleave']);startBattle(g);g.enemy.hp=1;act(g,0,mid);
 assert.equal(g.phase,'victory');assert.equal(g.hp,derived(g).maxHp);assert.equal(g.sp,derived(g).maxSp);
 assert.equal(decodeSave(JSON.stringify({...g,version:3})),null);
 assert.equal(decodeSave(JSON.stringify({...g,gold:-1})),null);
 assert.equal(decodeSave(JSON.stringify(g)).version,4);
 const keys=[];loadGame({getItem:k=>{keys.push(k);return null;}});assert.deepEqual(keys,[SAVE_KEY]);
});
