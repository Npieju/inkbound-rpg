/** Standalone RPG rules. All balance values are INKBOUND tuning, not claimed original-game values. */
export type Stat = 'hp' | 'sp' | 'atk' | 'def' | 'agi';
export type Action = 'attack' | 'run' | 'potion' | 'ether' | 'remedy' | number;
export type Phase = 'camp' | 'battle' | 'victory' | 'defeat' | 'clear' | 'complete';
export type EquipmentSlot = 'weapon' | 'armor';
export type Affliction = 'poison' | 'panic';
export interface Item { id: string; name: string; slot: EquipmentSlot; cost: number; bonus: number; tier: number; description: string; agi?: number; sp?: number; resist?: Affliction }
export const ITEMS: readonly Item[] = [
  { id: 'twig', name: '旅人の木剣', slot: 'weapon', cost: 0, bonus: 0, tier: 0, description: '攻撃 +0' },
  { id: 'iron', name: '鉄の剣', slot: 'weapon', cost: 35, bonus: 5, tier: 1, description: '攻撃 +5' },
  { id: 'steel', name: '鋼の剣', slot: 'weapon', cost: 110, bonus: 12, tier: 2, description: '攻撃 +12' },
  { id: 'moon', name: '月影の剣', slot: 'weapon', cost: 260, bonus: 23, tier: 3, description: '攻撃 +23' },
  { id: 'rapier', name: '風切りの細剣', slot: 'weapon', cost: 100, bonus: 8, agi: 10, tier: 2, description: '攻撃 +8 / AGI +10。命中と回避を補う。' },
  { id: 'focus-blade', name: '集中の剣', slot: 'weapon', cost: 120, bonus: 9, sp: 14, tier: 2, description: '攻撃 +9 / 最大SP +14。長期戦・全体攻撃に。' },
  { id: 'cloth', name: '旅人の服', slot: 'armor', cost: 0, bonus: 0, tier: 0, description: '防御 +0' },
  { id: 'leather', name: '革のベスト', slot: 'armor', cost: 30, bonus: 3, tier: 1, description: '防御 +3' },
  { id: 'chain', name: '鎖のベスト', slot: 'armor', cost: 95, bonus: 7, tier: 2, description: '防御 +7' },
  { id: 'rune', name: 'ルーンの外套', slot: 'armor', cost: 220, bonus: 13, tier: 3, description: '防御 +13' },
  { id: 'venom-vest', name: '解毒のベスト', slot: 'armor', cost: 70, bonus: 3, resist: 'poison', tier: 2, description: '防御 +3 / 毒を無効化。' },
  { id: 'mind-robe', name: '平静の衣', slot: 'armor', cost: 90, bonus: 4, resist: 'panic', tier: 2, description: '防御 +4 / スキル封印を無効化。' },
  { id: 'swift-coat', name: '疾風のコート', slot: 'armor', cost: 100, bonus: 4, agi: 10, tier: 2, description: '防御 +4 / AGI +10。' },
];
export interface Skill { id: string; name: string; branch: 'blade' | 'guard' | 'life'; cost: number; sp: number; cd: number; requires: string[]; effect: string; symbol: string }
export const SKILLS: readonly Skill[] = [
  { id: 'heavy', name: 'スマッシュ', branch: 'blade', cost: 12, sp: 4, cd: 2, requires: [], effect: '攻撃150%の単体攻撃。低SP。複数枠に積めば待機中も別枠から使える。', symbol: '⚔' },
  { id: 'charge', name: 'チャージ', branch: 'blade', cost: 18, sp: 5, cd: 3, requires: ['heavy'], effect: '次の攻撃行動の威力を2倍にする。通常攻撃でも消費する。', symbol: '↑' },
  { id: 'double', name: 'フレイム', branch: 'blade', cost: 42, sp: 30, cd: 3, requires: ['heavy'], effect: '生きている敵全員に攻撃300%。高消費の全体攻撃。', symbol: '炎' },
  { id: 'finisher', name: 'フェイタル', branch: 'blade', cost: 65, sp: 14, cd: 3, requires: ['charge'], effect: '攻撃320%の単体攻撃。攻撃強化・チャージ・敵の防御低下と組み合わせられる。', symbol: '✦' },
  { id: 'ward', name: 'プロテクト', branch: 'guard', cost: 12, sp: 4, cd: 3, requires: [], effect: '防御を50%上げる。4ターン有効。', symbol: '◇' },
  { id: 'regen', name: 'レイジ', branch: 'guard', cost: 22, sp: 5, cd: 3, requires: ['ward'], effect: '攻撃を50%上げる。4ターン有効。', symbol: '力' },
  { id: 'focus', name: 'スウィフト', branch: 'guard', cost: 18, sp: 4, cd: 3, requires: ['ward'], effect: 'AGIを50%上げる。4ターン有効。命中と回避の両方に影響。', symbol: '速' },
  { id: 'fortress', name: 'ブレッシング', branch: 'guard', cost: 60, sp: 10, cd: 4, requires: ['regen'], effect: '攻撃・防御・AGIを各25%上げる。4ターン有効。同種強化は加算せず強い方を使う。', symbol: '祝' },
  { id: 'mend', name: 'ヒール', branch: 'life', cost: 12, sp: 4, cd: 1, requires: [], effect: '最大HPの40%を回復する。状態異常は残る。', symbol: '+' },
  { id: 'bash', name: 'ブレイク', branch: 'life', cost: 16, sp: 4, cd: 3, requires: [], effect: '対象の防御を50%下げる。4ターン有効。', symbol: '砕' },
  { id: 'drain', name: 'スロウ', branch: 'life', cost: 18, sp: 4, cd: 3, requires: [], effect: '対象のAGIを50%下げる。4ターン有効。命中と回避を崩す。', symbol: '遅' },
  { id: 'renew', name: 'フルリカバー', branch: 'life', cost: 55, sp: 12, cd: 3, requires: ['mend'], effect: 'HPを全回復し、毒・封印・能力低下を取り除く。', symbol: '光' },
];
export const item = (id: string) => ITEMS.find(i => i.id === id)!;
export const skill = (id: string) => SKILLS.find(s => s.id === id)!;
export const STAGES = [
  { name: 'はじまりの草原', subtitle: 'THE QUIET MEADOW', color: '#d5dfbf', enemies: ['草むらスライム', '盗賊の二人組', '衛兵と手当て係'], boss: '草原の番人', hp: 30, atk: 7, gold: 15, xp: 14 },
  { name: 'ささやきの森', subtitle: 'THE WHISPERING WOODS', color: '#9fbaa7', enemies: ['毒の群れ', '俊足の狩人', '森の祈祷隊'], boss: '森の呪術師', hp: 65, atk: 13, gold: 26, xp: 24 },
  { name: '忘れられた遺跡', subtitle: 'THE FORGOTTEN RUINS', color: '#bbb8bd', enemies: ['石の守り', '影の剣士', '遺跡の護衛隊'], boss: '灰色の騎士', hp: 115, atk: 20, gold: 40, xp: 35 },
  { name: '夜明けの城門', subtitle: 'THE GATE OF DAWN', color: '#d0ba9c', enemies: ['城門の双衛', '封印の魔術師', '王の近衛隊'], boss: '夜を継ぐ王', hp: 180, atk: 29, gold: 60, xp: 50 },
] as const;
export interface TimedEffect { power: number; turns: number }
export interface Effects { attack?: TimedEffect; defense?: TimedEffect; agility?: TimedEffect; poison?: TimedEffect; panic?: TimedEffect }
export type EnemyStyle = 'normal' | 'brute' | 'healer' | 'swift' | 'venom' | 'shaman' | 'knight' | 'king';
export interface Enemy { id: string; name: string; hp: number; maxHp: number; atk: number; def: number; agi: number; boss: boolean; kind: number; turn: number; style: EnemyStyle; effects: Effects; abilities: Record<string, number>; heals: number }
interface Foe { id: string; name: string; hp: number; atk: number; def: number; agi: number; style: EnemyStyle; kind?: number }
const foe = (id: string, name: string, hp: number, atk: number, def: number, agi: number, style: EnemyStyle = 'normal', kind = 1): Foe => ({ id, name, hp, atk, def, agi, style, kind });
const ROSTERS: readonly (readonly (readonly Foe[])[])[] = [
  [ [foe('slime', '草むらスライム', 30, 7, 2, 8, 'normal', 0)], [foe('thief-a', '短剣の盗賊', 27, 6, 2, 13), foe('thief-b', '棒持ちの盗賊', 27, 6, 2, 10)], [foe('guard', '草原の衛兵', 48, 9, 12, 8), foe('medic', '手当て係', 28, 4, 1, 8, 'healer')], [foe('warden', '草原の番人', 110, 13, 7, 12, 'brute')] ],
  [ [foe('venom', '毒スライム', 52, 10, 4, 12, 'venom', 0), foe('wolf', '森の狼', 45, 10, 3, 18)], [foe('hunter', '俊足の狩人', 90, 14, 5, 30, 'swift')], [foe('wood-guard', '森の衛兵', 76, 13, 12, 14), foe('wood-medic', '森の治療師', 54, 7, 3, 12, 'healer')], [foe('shaman', '森の呪術師', 145, 15, 8, 18, 'shaman'), foe('fang', '毒牙の獣', 58, 11, 4, 16, 'venom')] ],
  [ [foe('golem', '石のゴーレム', 125, 18, 26, 8, 'normal', 0)], [foe('shadow', '影の剣士', 140, 19, 8, 35, 'swift')], [foe('ruin-guard', '遺跡の衛兵', 110, 16, 21, 15), foe('ruin-medic', '遺跡の修復者', 75, 9, 6, 12, 'healer')], [foe('knight', '灰色の騎士', 250, 23, 28, 22, 'knight')] ],
  [ [foe('gate-a', '鉄壁の近衛', 150, 22, 27, 19), foe('gate-b', '疾風の近衛', 115, 19, 9, 34, 'swift')], [foe('seal-mage', '封印の魔術師', 210, 25, 12, 28, 'shaman')], [foe('royal', '王の近衛', 170, 24, 26, 24, 'knight'), foe('priest', '王の祈祷師', 105, 13, 8, 18, 'healer')], [foe('king', '夜を継ぐ王', 340, 30, 24, 30, 'king'), foe('king-medic', '王の治療師', 100, 12, 9, 20, 'healer')] ],
];
export interface Game {
  version: 3; stage: number; kills: number; xp: number; earnedXp: number; gold: number; stats: Record<Stat, number>;
  hp: number; sp: number; potions: number; ethers: number; remedies: number; weapon: string; armor: string; owned: string[];
  phase: Phase; enemy: Enemy | null; enemies: Enemy[]; target: number; cooldowns: number[]; effects: Effects; charge: number;
  log: string[]; totalKills: number; learned: string[]; slots: (string | null)[];
}
export const statCost = (g: Game, stat: Stat) => 8 + g.stats[stat] * 5;
export const rank = (g: Game) => 1 + Math.floor(g.earnedXp / 50);
const clamp = (lo: number, hi: number, n: number) => Math.max(lo, Math.min(hi, n));
const boosted = (base: number, effect?: TimedEffect) => Math.max(1, Math.round(base * (1 + (effect?.power ?? 0))));
export function derived(g: Game) {
  const w = item(g.weapon), a = item(g.armor);
  return { maxHp: 70 + g.stats.hp * 14, maxSp: 20 + g.stats.sp * 6 + (w.sp ?? 0),
    atk: boosted(11 + g.stats.atk * 3 + w.bonus, g.effects.attack), def: boosted(2 + g.stats.def * 2 + a.bonus, g.effects.defense),
    agi: boosted(10 + g.stats.agi * 3 + (w.agi ?? 0) + (a.agi ?? 0), g.effects.agility), crit: 0.05 };
}
export const hitChance = (attackerAgi: number, defenderAgi: number) => clamp(0.55, 0.98, 0.9 + (attackerAgi - defenderAgi) * 0.012);
export function enemyStats(e: Enemy) { return { atk: boosted(e.atk, e.effects.attack), def: boosted(e.def, e.effects.defense), agi: boosted(e.agi, e.effects.agility) }; }
export function enemyHint(e: Pick<Enemy, 'style'>): string {
  return ({ normal: '通常攻撃で戦う', brute: 'HPが減ると攻撃を強化', healer: '傷ついた仲間を最大3回回復', swift: '高いAGIと速度低下で命中回避を崩す', venom: '毒を与える。解毒装備・治療が有効', shaman: 'スキルを封じる。平静の衣で無効化', knight: '高い防御と攻撃低下を使う', king: '攻撃低下・封印・自己強化を使う' })[e.style];
}
export function encounterPreview(stage: number, encounter: number, boss = false): Enemy[] {
  const roster = ROSTERS[stage]?.[boss ? 3 : encounter];
  if (!roster) return [];
  return roster.map((f, i) => ({ ...f, id: `${f.id}-${i}`, maxHp: f.hp, boss: boss && i === 0, kind: f.kind ?? 1, turn: 0, effects: {}, abilities: {}, heals: 3 }));
}
export function newGame(): Game {
  return { version: 3, stage: 0, kills: 0, xp: 30, earnedXp: 0, gold: 20, stats: { hp: 0, sp: 0, atk: 0, def: 0, agi: 0 },
    hp: 70, sp: 20, potions: 3, ethers: 1, remedies: 2, weapon: 'twig', armor: 'cloth', owned: ['twig', 'cloth'],
    phase: 'camp', enemy: null, enemies: [], target: 0, cooldowns: [0, 0, 0, 0], effects: {}, charge: 0,
    log: ['敵の特徴を確認し、30 XPを能力とスキルに振り分けよう。'], totalKills: 0, learned: [], slots: [null, null, null, null] };
}
function note(g: Game, s: string) { g.log.unshift(s); g.log = g.log.slice(0, 20); }
export function allocate(g: Game, stat: Stat): boolean {
  if (!['hp', 'sp', 'atk', 'def', 'agi'].includes(stat) || g.phase === 'battle' || g.xp < statCost(g, stat)) return false;
  g.xp -= statCost(g, stat); g.stats[stat]++;
  if (stat === 'hp') g.hp += 14; if (stat === 'sp') g.sp += 6; return true;
}
export function learn(g: Game, id: string): boolean {
  const s = SKILLS.find(s => s.id === id);
  if (!s || g.phase === 'battle' || g.learned.includes(id) || g.xp < s.cost || !s.requires.every(p => g.learned.includes(p))) return false;
  g.xp -= s.cost; g.learned.push(id); const empty = g.slots.indexOf(null); if (empty >= 0) g.slots[empty] = id;
  note(g, `${s.name}を習得。${empty >= 0 ? `枠${empty + 1}にセットした。` : '編成画面でセットできる。'}`); return true;
}
export function equipSkill(g: Game, slot: number, id: string | null): boolean {
  if (g.phase === 'battle' || !Number.isInteger(slot) || slot < 0 || slot > 3 || (id !== null && !g.learned.includes(id))) return false;
  g.slots[slot] = id; return true;
}
export function respec(g: Game): boolean {
  if (g.phase === 'battle') return false;
  g.xp += Object.values(g.stats).reduce((sum, n) => sum + 8 * n + 5 * n * (n - 1) / 2, 0) + g.learned.reduce((sum, id) => sum + skill(id).cost, 0);
  g.stats = { hp: 0, sp: 0, atk: 0, def: 0, agi: 0 }; g.learned = []; g.slots = [null, null, null, null]; recover(g);
  note(g, '能力とスキルの費用を全額XPに戻した。'); return true;
}
export function equip(g: Game, id: string): boolean {
  const equipment = ITEMS.find(i => i.id === id);
  if (g.phase === 'battle' || !equipment || !g.owned.includes(id)) return false;
  g[equipment.slot] = id; recover(g); return true;
}
export function buy(g: Game, id: string): boolean {
  if (g.phase === 'battle') return false;
  const consumable = ({ potion: ['potions', 10], ether: ['ethers', 15], remedy: ['remedies', 12] } as const)[id as 'potion' | 'ether' | 'remedy'];
  if (consumable) { const [key, cost] = consumable; if (g.gold < cost || g[key] >= 9) return false; g.gold -= cost; g[key]++; return true; }
  const next = ITEMS.find(i => i.id === id);
  if (!next || g.owned.includes(id) || g.gold < next.cost) return false;
  g.gold -= next.cost; g.owned.push(id); equip(g, id); note(g, `${next.name}を購入し装備した。`); return true;
}
function recover(g: Game) { g.effects = {}; g.charge = 0; g.hp = derived(g).maxHp; g.sp = derived(g).maxSp; }
export function selectTarget(g: Game, index: number): boolean {
  if (g.phase !== 'battle' || !Number.isInteger(index) || !g.enemies[index] || g.enemies[index].hp <= 0) return false;
  g.target = index; g.enemy = g.enemies[index]; return true;
}
function retarget(g: Game) { if (!g.enemies[g.target] || g.enemies[g.target].hp <= 0) { const i = g.enemies.findIndex(e => e.hp > 0); if (i >= 0) { g.target = i; g.enemy = g.enemies[i]; } } }
export function startBattle(g: Game, boss = false, encounter?: number): boolean {
  if (!['camp', 'victory', 'defeat'].includes(g.phase) || (boss && g.kills < 3)) return false;
  const index = encounter ?? Math.min(g.kills, 2);
  if (!Number.isInteger(index) || index < 0 || index > 2 || index > g.kills) return false;
  g.enemies = encounterPreview(g.stage, index, boss); if (!g.enemies.length) return false;
  recover(g); g.target = 0; g.enemy = g.enemies[0]; g.phase = 'battle'; g.cooldowns = [0, 0, 0, 0];
  note(g, `${boss ? STAGES[g.stage].boss : STAGES[g.stage].enemies[index]}との戦闘。${g.enemies.length}体の敵！`);
  // Encounter index is independent of the character's visual kind.
  g.enemies.forEach(e => e.abilities.encounter = index); return true;
}
export function nextStage(g: Game): boolean {
  if (g.phase !== 'clear') return false;
  g.stage++; g.kills = 0; g.phase = 'camp'; g.enemy = null; g.enemies = []; recover(g);
  g.potions = Math.min(9, g.potions + 1); note(g, `${STAGES[g.stage].name}へ。ポーション +1。`); return true;
}
function award(g: Game) {
  const boss = g.enemies.some(e => e.boss), s = STAGES[g.stage], gold = s.gold * (boss ? 4 : 1), xp = s.xp * (boss ? 3 : 1);
  g.gold += gold; g.xp += xp; g.earnedXp += xp; g.totalKills += g.enemies.length;
  if (boss) g.phase = g.stage === STAGES.length - 1 ? 'complete' : 'clear';
  else { g.kills = Math.max(g.kills, (g.enemies[0].abilities.encounter ?? 0) + 1); g.phase = 'victory'; }
  recover(g); note(g, `勝利！ +${gold} G / +${xp} XP。HP・SP全回復。`);
}
function effect(effects: Effects, key: keyof Effects, power: number, turns: number) {
  const old = effects[key];
  effects[key] = { power: old && Math.sign(old.power) === Math.sign(power) ? (power > 0 ? Math.max(old.power, power) : Math.min(old.power, power)) : power, turns: Math.max(old?.turns ?? 0, turns) };
}
function tick(effects: Effects) { for (const key of Object.keys(effects) as (keyof Effects)[]) if (--effects[key]!.turns <= 0) delete effects[key]; }
export function statusLabels(e: Effects): string[] {
  return (Object.keys(e) as (keyof Effects)[]).map(k => `${({ attack: '攻', defense: '防', agility: '速', poison: '毒', panic: '封印' })[k]}${['poison', 'panic'].includes(k) ? '' : e[k]!.power > 0 ? '↑' : '↓'}${e[k]!.turns}T`);
}
export interface TurnResult { playerDamage: number; enemyDamage: number; critical: boolean; dodged: boolean; healed: number; escaped: boolean; hits: number; misses: number }
export function act(g: Game, action: Action, rng: () => number = Math.random): TurnResult | null {
  if (g.phase !== 'battle' || !g.enemy || !['attack', 'run', 'potion', 'ether', 'remedy', 0, 1, 2, 3].includes(action)) return null;
  const slot = typeof action === 'number' ? action : -1, selected = slot >= 0 && g.slots[slot] ? skill(g.slots[slot]!) : null;
  if (slot >= 0 && (!selected || g.effects.panic || g.cooldowns[slot] > 0 || g.sp < selected.sp)) return null;
  if ((action === 'potion' && !g.potions) || (action === 'ether' && !g.ethers) || (action === 'remedy' && !g.remedies)) return null;
  const r: TurnResult = { playerDamage: 0, enemyDamage: 0, critical: false, dodged: false, healed: 0, escaped: false, hits: 0, misses: 0 };
  g.cooldowns = g.cooldowns.map(c => Math.max(0, c - 1));
  if (selected) { g.sp -= selected.sp; g.cooldowns[slot] = selected.cd; }
  const heal = (amount: number) => { const n = Math.min(derived(g).maxHp - g.hp, Math.ceil(amount)); g.hp += n; r.healed += n; return n; };
  const hit = (targets: Enemy[], multiplier: number, name: string) => {
    const charge = g.charge ? 2 : 1; g.charge = 0;
    for (const target of targets) {
      const d = derived(g), es = enemyStats(target);
      if (rng() >= hitChance(d.agi, es.agi)) { r.misses++; note(g, `${name}は${target.name}に当たらなかった。`); continue; }
      const critical = rng() < d.crit;
      const damage = Math.max(1, Math.round((d.atk * multiplier * charge * (critical ? 1.5 : 1) - es.def * 0.65) * (0.95 + rng() * 0.1)));
      target.hp = Math.max(0, target.hp - damage); r.playerDamage += damage; r.hits++; r.critical ||= critical;
      note(g, `${name}${critical ? '・会心' : ''} → ${target.name}に${damage}。`);
    }
  };
  if (action === 'attack') hit([g.enemy], 1, '通常攻撃');
  else if (action === 'potion') { g.potions--; note(g, `ポーションでHP +${heal(derived(g).maxHp * 0.5)}。`); }
  else if (action === 'ether') { g.ethers--; const n = Math.min(derived(g).maxSp - g.sp, Math.ceil(derived(g).maxSp * 0.5)); g.sp += n; note(g, `エーテルでSP +${n}。`); }
  else if (action === 'remedy') { g.remedies--; delete g.effects.poison; delete g.effects.panic; note(g, '治療薬で毒と封印を解除した。'); }
  else if (action === 'run') {
    const fastest = Math.max(...g.enemies.filter(e => e.hp > 0).map(e => enemyStats(e).agi));
    if (rng() < clamp(0.3, 0.9, 0.65 + (derived(g).agi - fastest) * 0.015)) { r.escaped = true; g.phase = 'camp'; recover(g); note(g, '逃走した。報酬・進行なし。HP・SP全回復。'); return r; }
    note(g, '逃走に失敗した。');
  } else if (selected) {
    const id = selected.id;
    if (id === 'heavy' || id === 'finisher') hit([g.enemy], id === 'heavy' ? 1.5 : 3.2, selected.name);
    else if (id === 'double') hit(g.enemies.filter(e => e.hp > 0), 3, selected.name);
    else if (id === 'charge') { g.charge = 1; note(g, 'チャージ。次の攻撃行動の威力2倍。'); }
    else if (id === 'regen' || id === 'ward' || id === 'focus') { effect(g.effects, id === 'regen' ? 'attack' : id === 'ward' ? 'defense' : 'agility', 0.5, 4); note(g, `${selected.name}で能力を強化。`); }
    else if (id === 'fortress') { for (const key of ['attack', 'defense', 'agility'] as const) effect(g.effects, key, 0.25, 4); note(g, 'ブレッシング。攻撃・防御・AGIを強化。'); }
    else if (id === 'bash' || id === 'drain') { effect(g.enemy.effects, id === 'bash' ? 'defense' : 'agility', -0.5, 4); note(g, `${selected.name} → ${g.enemy.name}の${id === 'bash' ? '防御' : 'AGI'}を低下。`); }
    else if (id === 'mend') note(g, `ヒールでHP +${heal(derived(g).maxHp * 0.4)}。`);
    else if (id === 'renew') { for (const key of Object.keys(g.effects) as (keyof Effects)[]) if (g.effects[key]!.power < 0 || key === 'poison' || key === 'panic') delete g.effects[key]; note(g, `フルリカバーでHP +${heal(derived(g).maxHp)}。状態異常・能力低下を治療。`); }
  }
  if (g.enemies.every(e => e.hp <= 0)) { award(g); return r; }
  retarget(g);
  // Each surviving opponent gets an action. Eliminating a target actually removes its future turns.
  for (const enemy of g.enemies.filter(e => e.hp > 0)) {
    if (g.hp <= 0) break;
    enemy.turn++; for (const key of Object.keys(enemy.abilities)) if (key !== 'encounter') enemy.abilities[key] = Math.max(0, enemy.abilities[key] - 1);
    const es = enemyStats(enemy), allies = g.enemies.filter(e => e.hp > 0);
    const wounded = [...allies].sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
    if (enemy.style === 'healer' && enemy.heals > 0 && wounded.hp < wounded.maxHp * 0.75) { const n = Math.min(wounded.maxHp - wounded.hp, Math.ceil(wounded.maxHp * 0.35)); wounded.hp += n; enemy.heals--; note(g, `${enemy.name}が${wounded.name}を${n}回復。`); continue; }
    if (['brute', 'king'].includes(enemy.style) && enemy.hp < enemy.maxHp * 0.6 && !enemy.effects.attack && !enemy.abilities.rage) { effect(enemy.effects, 'attack', 0.4, 4); enemy.abilities.rage = 6; note(g, `${enemy.name}が攻撃を強化した。`); continue; }
    if (['shaman', 'king'].includes(enemy.style) && !g.effects.panic && !enemy.abilities.seal) {
      enemy.abilities.seal = 5;
      if (item(g.armor).resist === 'panic') note(g, `${item(g.armor).name}が封印を防いだ。`);
      else { effect(g.effects, 'panic', 1, 3); note(g, `${enemy.name}の封印！ 技が2回の行動中使えない。`); } continue;
    }
    if (['knight', 'king'].includes(enemy.style) && !enemy.abilities.weaken && (!g.effects.attack || g.effects.attack.power > 0)) { effect(g.effects, 'attack', -0.35, 4); enemy.abilities.weaken = 5; note(g, `${enemy.name}がこちらの攻撃を下げた。`); continue; }
    if (enemy.style === 'swift' && !enemy.abilities.slow && !g.effects.agility) { effect(g.effects, 'agility', -0.35, 4); enemy.abilities.slow = 5; note(g, `${enemy.name}がこちらのAGIを下げた。`); continue; }
    if (rng() >= hitChance(es.agi, derived(g).agi)) { r.dodged = true; note(g, `${enemy.name}の攻撃を回避。`); continue; }
    const damage = Math.max(1, Math.round(es.atk - derived(g).def * 0.65));
    g.hp = Math.max(0, g.hp - damage); r.enemyDamage += damage; note(g, `${enemy.name}の攻撃。${damage}ダメージ。`);
    if (enemy.style === 'venom' && !g.effects.poison) {
      if (item(g.armor).resist === 'poison') note(g, `${item(g.armor).name}が毒を防いだ。`);
      else { effect(g.effects, 'poison', 0.06, 4); note(g, '毒を受けた。治療・全回復で解除できる。'); }
    }
  }
  if (g.effects.poison && g.hp > 0) { const damage = Math.ceil(derived(g).maxHp * g.effects.poison.power); g.hp = Math.max(0, g.hp - damage); r.enemyDamage += damage; note(g, `毒で${damage}ダメージ。`); }
  tick(g.effects); g.enemies.forEach(e => tick(e.effects));
  if (g.hp <= 0) { g.phase = 'defeat'; recover(g); note(g, '敗北…。HP・SP全回復。敵の特徴と編成を見直そう。'); }
  return r;
}
