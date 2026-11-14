import test from 'node:test';
import assert from 'node:assert/strict';
import { SKINS, getSkin, readSkin, rememberSkin, SKIN_STORAGE_KEY, worldText } from '../src/skins.ts';
import { SKILLS, ITEMS, newGame, startBattle, act } from '../src/game.ts';

test('all worlds cover every skill and item without cascading name substitutions',()=>{
  for(const world of SKINS){
    assert.equal(world.skillNames.length,SKILLS.length);
    assert.equal(world.itemNames.length,ITEMS.length);
    SKILLS.forEach((s,i)=>{
      assert.equal(worldText(s.name,world),world.skillNames[i]);
      assert.deepEqual(worldText(s.effect,world).match(/\d+/g),s.effect.match(/\d+/g));
    });
    ITEMS.forEach((s,i)=>assert.equal(worldText(s.name,world),world.itemNames[i]));
  }
  assert.equal(worldText('鉄壁の近衛',getSkin('neon')),'装甲護衛機');
  assert.equal(worldText('森の治療師',getSkin('dojo')),'深山の薬師');
});

test('world preference stays separate from gameplay and survives storage failure',()=>{
  const game=newGame();const original=JSON.stringify(game),values=new Map([['progress',original]]);
  const storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};
  rememberSkin(getSkin('neon'),storage);
  assert.equal(values.get(SKIN_STORAGE_KEY),'neon');assert.equal(readSkin(storage).id,'neon');
  assert.equal(values.get('progress'),original);assert.equal(JSON.stringify(game),original);
  assert.equal(getSkin('invalid').id,'journal');
  assert.equal(readSkin({getItem(){throw Error();}}).id,'journal');
  assert.doesNotThrow(()=>rememberSkin(SKINS[0],{setItem(){throw Error();}}));
});

test('the same combat log can be presented in every world without changing the battle',()=>{
  const game=newGame();startBattle(game);act(game,'attack',()=>.5);
  const state=JSON.stringify(game);
  for(const world of SKINS){
    const rendered=game.log.map(l=>worldText(l,world));
    assert.ok(rendered.length>0);assert.equal(JSON.stringify(game),state);
  }
  assert.equal(worldText('勝利。15Gと14XPを獲得。HP・SPが全回復した。',getSkin('neon')),'交戦終了。15Cr／14データ回収。修復・再充電完了。');
});
