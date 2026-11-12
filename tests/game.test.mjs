import test from 'node:test';
import assert from 'node:assert/strict';
import { act, allocate, buy, derived, equipSkill, ITEMS, learn, newGame, nextStage, rest, SKILLS, startBattle, statCost } from '../src/game.ts';
import { decodeSave, loadGame, saveGame } from '../src/save.ts';
const noCrit = () => 0.5;

test('XP is shared by stats and skills; insufficient funds do not mutate state', () => {
  const g = newGame();
  assert.equal(learn(g, 'heavy'), true); assert.equal(g.xp, 18); assert.equal(g.slots[0], 'heavy');
  assert.equal(allocate(g, 'atk'), true); assert.equal(g.xp, 10); assert.equal(statCost(g, 'atk'), 13);
  const before = JSON.stringify(g); assert.equal(allocate(g, 'atk'), false); assert.equal(JSON.stringify(g), before);
});
test('skill tree prerequisites, duplicate prevention and four-slot loadout', () => {
  const g = newGame(); g.xp = 1000;
  assert.equal(learn(g, 'finisher'), false);
  for (const s of ['heavy', 'double', 'charge', 'finisher']) assert.equal(learn(g, s), true);
  assert.equal(learn(g, 'heavy'), false); assert.equal(learn(g, 'mend'), true); assert.equal(g.slots.includes('mend'), false);
  assert.equal(equipSkill(g, 3, 'heavy'), true); assert.equal(equipSkill(g, 4, 'heavy'), false);
  assert.equal(equipSkill(g, 0, 'renew'), false); assert.equal(equipSkill(g, 0, null), true);
});
test('SP and cooldown are enforced per slot; invalid actions do not consume a turn', () => {
  const g = newGame(); learn(g, 'heavy'); equipSkill(g, 1, 'heavy'); startBattle(g);
  g.enemy.hp = g.enemy.maxHp = 1000; g.hp = 1000;
  assert.ok(act(g, 0, noCrit)); assert.equal(g.sp, 13); assert.equal(g.cooldowns[0], 2);
  const before = JSON.stringify(g); assert.equal(act(g, 0), null); assert.equal(JSON.stringify(g), before);
  assert.ok(act(g, 1, noCrit)); assert.equal(g.sp, 10);
  act(g, 'guard', noCrit); assert.equal(g.cooldowns[0], 0);
  g.sp = 0; const before2 = JSON.stringify(g); assert.equal(act(g, 0), null); assert.equal(JSON.stringify(g), before2);
  assert.equal(allocate(g, 'hp'), false); assert.equal(learn(g, 'mend'), false); assert.equal(equipSkill(g, 1, null), false);
});
test('healing caps at max HP; charge modifies next attack only; ward expires', () => {
  const g = newGame(); g.xp = 500;
  for (const id of ['heavy', 'charge', 'mend', 'ward']) learn(g, id);
  startBattle(g); g.enemy.hp = g.enemy.maxHp = 1000; g.enemy.atk = 2;
  act(g, 2, noCrit); assert.ok(g.hp <= derived(g).maxHp);
  act(g, 1, noCrit); const boosted = act(g, 'attack', noCrit); const normal = act(g, 'attack', noCrit);
  assert.equal(boosted.playerDamage, normal.playerDamage * 2); assert.equal(g.charge, 0);
  act(g, 3, noCrit); assert.equal(g.ward, 2); act(g, 'guard', noCrit); act(g, 'guard', noCrit); assert.equal(g.ward, 0);
});
test('three distinct encounters unlock boss; farming old encounters cannot skip progression', () => {
  const g = newGame(); assert.equal(startBattle(g, true), false); assert.equal(startBattle(g, false, 2), false);
  g.stats.atk = 100;
  for (const encounter of [0, 0, 1, 2]) { rest(g); assert.ok(startBattle(g, false, encounter)); act(g, 'attack', noCrit); }
  assert.equal(g.kills, 3); assert.equal(g.totalKills, 4); assert.equal(startBattle(g, true), true);
  act(g, 'attack', noCrit); assert.equal(g.phase, 'clear'); assert.equal(nextStage(g), true); assert.equal(g.stage, 1); assert.equal(g.kills, 0);
});
test('boss telegraph and guarding reduce damage; defeat retains resources and can recover', () => {
  const a = newGame(); a.kills = 3; startBattle(a, true); a.enemy.turn = 2;
  const b = structuredClone(a);
  const guarded = act(a, 'guard', noCrit), unguarded = act(b, 'attack', noCrit);
  assert.equal(guarded.charged, true); assert.ok(guarded.enemyDamage < unguarded.enemyDamage);
  b.hp = 1; const gold = b.gold, xp = b.xp; act(b, 'guard', noCrit);
  assert.equal(b.phase, 'defeat'); assert.equal(b.gold, gold); assert.equal(b.xp, xp);
  assert.equal(startBattle(b), false); assert.equal(rest(b), true); assert.equal(b.phase, 'camp'); assert.equal(b.sp, derived(b).maxSp);
});
test('shop handles balance, upgrade restrictions and potion cap', () => {
  const g = newGame(); assert.equal(buy(g, 'iron'), false); g.gold = 1000;
  assert.equal(buy(g, 'steel'), true); assert.equal(g.weapon, 'steel');
  const gold = g.gold; assert.equal(buy(g, 'iron'), false); assert.equal(g.gold, gold);
  g.potions = 9; assert.equal(buy(g, 'potion'), false);
  startBattle(g); assert.equal(buy(g, 'moon'), false);
});
test('save validation rejects malformed data and resumes battles at camp', () => {
  const g = newGame(); learn(g, 'heavy');
  assert.deepEqual(decodeSave(JSON.stringify(g)), g);
  for (const patch of [{ version: 1 }, { stage: 99 }, { xp: -1 }, { slots: ['finisher', null, null, null] }, { learned: ['finisher'] }, { hp: 99999 }, { stats: {} }, { phase: 'clear' }]) {
    assert.equal(decodeSave(JSON.stringify({ ...g, ...patch })), null);
  }
  assert.equal(decodeSave('{'), null); startBattle(g);
  assert.equal(decodeSave(JSON.stringify(g)).phase, 'camp');
  assert.equal(saveGame(g, { setItem() { throw Error(); } }), false);
  assert.equal(loadGame({ getItem() { throw Error(); } }).phase, 'camp');
});
test('complete all four stages with earned XP, purchases and a real skill build', () => {
  const g = newGame(); learn(g, 'heavy'); allocate(g, 'atk');
  let fights = 0, usedSkills = 0, defeats = 0;
  while (g.phase !== 'complete' && fights < 180) {
    rest(g);
    // Invest earned resources; no gifted XP, gold, damage, or HP.
    for (const id of ['ward', 'mend', 'double', 'charge', 'finisher']) if (g.xp > (id === 'finisher' ? 150 : 60)) learn(g, id);
    for (const slot of ['weapon', 'armor']) {
      const candidate = ITEMS.filter(i => i.slot === slot && i.cost <= g.gold).at(-1);
      if (candidate) buy(g, candidate.id);
    }
    for (const id of ['heavy', 'double', 'finisher']) if (g.learned.includes(id)) equipSkill(g, 0, id);
    equipSkill(g, 1, g.learned.includes('mend') ? 'mend' : null);
    equipSkill(g, 2, g.learned.includes('ward') ? 'ward' : null);
    equipSkill(g, 3, g.learned.includes('charge') ? 'charge' : null);
    for (const stat of ['atk', 'hp', 'def', 'sp']) if (g.xp >= statCost(g, stat)) allocate(g, stat);
    if (g.phase === 'clear') { nextStage(g); continue; }
    startBattle(g, g.kills >= 3 && fights % 3 !== 0);
    for (let turn = 0; g.phase === 'battle' && turn < 150; turn++) {
      let action = 'attack';
      const ready = i => g.slots[i] && !g.cooldowns[i] && g.sp >= SKILLS.find(s => s.id === g.slots[i]).sp;
      if (g.hp < derived(g).maxHp * 0.55 && ready(1)) action = 1;
      else if (g.enemy.boss && g.enemy.turn % 3 === 2) action = 'guard';
      else if (!g.ward && ready(2)) action = 2;
      else if (ready(0)) action = 0;
      if (typeof action === 'number') usedSkills++;
      act(g, action, noCrit);
    }
    assert.notEqual(g.phase, 'battle'); if (g.phase === 'defeat') defeats++; fights++;
  }
  assert.equal(g.phase, 'complete', `fights=${fights} defeats=${defeats} stage=${g.stage}`);
  assert.ok(usedSkills > 0); assert.ok(g.totalKills >= 16);
});
