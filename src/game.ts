/** Platform-independent rules. No DOM, timers, storage, or framework dependencies. */
export type Stat = 'hp' | 'sp' | 'atk' | 'def' | 'agi';
export type Action = 'attack' | 'guard' | 'potion' | number;
export type Phase = 'camp' | 'battle' | 'victory' | 'defeat' | 'clear' | 'complete';
export type EquipmentSlot = 'weapon' | 'armor';
export interface Item { id: string; name: string; slot: EquipmentSlot; cost: number; bonus: number; tier: number; description: string }
export const ITEMS: readonly Item[] = [
  { id: 'twig', name: '旅人の木剣', slot: 'weapon', cost: 0, bonus: 0, tier: 0, description: '冒険のはじまり。使い慣れた一本。' },
  { id: 'iron', name: '鉄の剣', slot: 'weapon', cost: 35, bonus: 5, tier: 1, description: '攻撃 +5 / まずは頼れる相棒を。' },
  { id: 'steel', name: '鋼の剣', slot: 'weapon', cost: 110, bonus: 12, tier: 2, description: '攻撃 +12 / ボスの守りも切り裂く。' },
  { id: 'moon', name: '月影の剣', slot: 'weapon', cost: 260, bonus: 23, tier: 3, description: '攻撃 +23 / 最後の門を開く刃。' },
  { id: 'cloth', name: '旅人の服', slot: 'armor', cost: 0, bonus: 0, tier: 0, description: '身軽な旅支度。' },
  { id: 'leather', name: '革のベスト', slot: 'armor', cost: 30, bonus: 3, tier: 1, description: '防御 +3 / 小さな傷から身を守る。' },
  { id: 'chain', name: '鎖のベスト', slot: 'armor', cost: 95, bonus: 7, tier: 2, description: '防御 +7 / 長い戦いに備えて。' },
  { id: 'rune', name: 'ルーンの外套', slot: 'armor', cost: 220, bonus: 13, tier: 3, description: '防御 +13 / 古い魔法が織りこまれている。' },
];
export const STAGES = [
  { name: 'はじまりの草原', subtitle: 'THE QUIET MEADOW', color: '#d5dfbf', enemies: ['草むらスライム', 'はぐれゴブリン', '森の見張り'], boss: '草原の番人', hp: 30, atk: 7, gold: 15, xp: 14 },
  { name: 'ささやきの森', subtitle: 'THE WHISPERING WOODS', color: '#9fbaa7', enemies: ['苔むすスライム', '森の盗賊', '影の狩人'], boss: '古樹の守護者', hp: 65, atk: 13, gold: 26, xp: 24 },
  { name: '忘れられた遺跡', subtitle: 'THE FORGOTTEN RUINS', color: '#bbb8bd', enemies: ['石くれゴーレム', 'さまよう剣士', '遺跡の衛兵'], boss: '灰色の騎士', hp: 115, atk: 20, gold: 40, xp: 35 },
  { name: '夜明けの城門', subtitle: 'THE GATE OF DAWN', color: '#d0ba9c', enemies: ['城門の影', '黒衣の兵士', '夜の守り手'], boss: '夜を継ぐ王', hp: 180, atk: 29, gold: 60, xp: 50 },
] as const;
export interface Enemy { name: string; hp: number; maxHp: number; atk: number; boss: boolean; kind: number; turn: number }
export interface Game {
  version: 2; stage: number; kills: number; xp: number; earnedXp: number; gold: number;
  stats: Record<Stat, number>; hp: number; sp: number; potions: number; weapon: string; armor: string;
  phase: Phase; enemy: Enemy | null; cooldowns: number[]; log: string[]; totalKills: number;
  learned: string[]; slots: (string | null)[]; ward: number; regen: number; charge: number;
}
export interface Skill { id: string; name: string; branch: 'blade' | 'guard' | 'life'; cost: number; sp: number; cd: number; requires: string[]; effect: string; symbol: string }
export const SKILLS: readonly Skill[] = [
  { id: 'heavy', name: '強撃', branch: 'blade', cost: 12, sp: 3, cd: 2, requires: [], effect: '攻撃力の160%で敵を打つ。', symbol: '⚔' },
  { id: 'double', name: '双連撃', branch: 'blade', cost: 32, sp: 5, cd: 2, requires: ['heavy'], effect: '攻撃力の210%の連撃。', symbol: 'Ⅱ' },
  { id: 'charge', name: '闘気', branch: 'blade', cost: 28, sp: 4, cd: 3, requires: ['heavy'], effect: '次の攻撃・攻撃スキルの威力が2倍。', symbol: '↑' },
  { id: 'finisher', name: '天断', branch: 'blade', cost: 70, sp: 9, cd: 4, requires: ['double', 'charge'], effect: '攻撃力の340%の必殺剣。', symbol: '✦' },
  { id: 'ward', name: '障壁', branch: 'guard', cost: 12, sp: 3, cd: 2, requires: [], effect: '敵の攻撃を3回、45%軽減。', symbol: '◇' },
  { id: 'bash', name: '盾撃', branch: 'guard', cost: 32, sp: 5, cd: 3, requires: ['ward'], effect: '攻撃力150%で攻撃し、敵の攻撃を1回45%軽減。', symbol: '▣' },
  { id: 'focus', name: '瞑想', branch: 'guard', cost: 28, sp: 0, cd: 4, requires: ['ward'], effect: 'SPを最大値の35%回復。', symbol: '◎' },
  { id: 'fortress', name: '不落の構え', branch: 'guard', cost: 70, sp: 8, cd: 4, requires: ['bash', 'focus'], effect: 'HPを30%回復し、敵の攻撃を3回45%軽減。', symbol: '♜' },
  { id: 'mend', name: '手当て', branch: 'life', cost: 12, sp: 3, cd: 2, requires: [], effect: '最大HPの30%を回復。', symbol: '+' },
  { id: 'regen', name: '再生', branch: 'life', cost: 28, sp: 5, cd: 4, requires: ['mend'], effect: 'このターンから3ターン、HPを最大値の12%回復。', symbol: '♧' },
  { id: 'drain', name: '吸命', branch: 'life', cost: 32, sp: 5, cd: 3, requires: ['mend'], effect: '攻撃力140%で攻撃し、与ダメージの50%回復。', symbol: '↗' },
  { id: 'renew', name: '生命の光', branch: 'life', cost: 70, sp: 9, cd: 4, requires: ['regen', 'drain'], effect: '最大HPの75%を回復。', symbol: '☀' },
];
export const skill = (id: string) => SKILLS.find(s => s.id === id)!;
export const statCost = (g: Game, stat: Stat) => 8 + g.stats[stat] * 5;
export const rank = (g: Game) => 1 + Math.floor(g.earnedXp / 50);
export const item = (id: string) => ITEMS.find(i => i.id === id)!;
export function derived(g: Game) {
  return { maxHp: 60 + g.stats.hp * 12, maxSp: 16 + g.stats.sp * 5, atk: 9 + g.stats.atk * 3 + item(g.weapon).bonus,
    def: 1 + g.stats.def * 2 + item(g.armor).bonus, crit: Math.min(0.4, 0.05 + g.stats.agi * 0.035),
    dodge: Math.min(0.3, g.stats.agi * 0.025) };
}
export function newGame(): Game {
  return { version: 2, stage: 0, kills: 0, xp: 30, earnedXp: 0, gold: 20,
    stats: { hp: 0, sp: 0, atk: 0, def: 0, agi: 0 }, hp: 60, sp: 16, potions: 3, weapon: 'twig', armor: 'cloth',
    phase: 'camp', enemy: null, cooldowns: [0, 0, 0, 0], log: ['30 XPを能力強化やスキル習得に使って、最初の戦いへ。'], totalKills: 0,
    learned: [], slots: [null, null, null, null], ward: 0, regen: 0, charge: 0 };
}
function note(g: Game, s: string) { g.log.unshift(s); g.log = g.log.slice(0, 20); }
export function allocate(g: Game, stat: Stat): boolean {
  if (!['hp', 'sp', 'atk', 'def', 'agi'].includes(stat) || g.xp < statCost(g, stat) || g.phase === 'battle') return false;
  g.xp -= statCost(g, stat); g.stats[stat]++;
  if (stat === 'hp') g.hp += 12;
  if (stat === 'sp') g.sp += 5;
  return true;
}
export function learn(g: Game, id: string): boolean {
  const s = SKILLS.find(s => s.id === id);
  if (!s || g.phase === 'battle' || g.learned.includes(id) || g.xp < s.cost || !s.requires.every(p => g.learned.includes(p))) return false;
  g.xp -= s.cost; g.learned.push(id);
  const empty = g.slots.indexOf(null); if (empty >= 0) g.slots[empty] = id;
  note(g, `${s.name}を習得！${empty >= 0 ? ` スロット${empty + 1}にセット。` : ' 編成画面でセットできます。'}`); return true;
}
export function equipSkill(g: Game, slot: number, id: string | null): boolean {
  if (g.phase === 'battle' || !Number.isInteger(slot) || slot < 0 || slot > 3 || (id !== null && !g.learned.includes(id))) return false;
  g.slots[slot] = id; return true;
}
export function buy(g: Game, id: string): boolean {
  if (g.phase === 'battle') return false;
  if (id === 'potion') {
    if (g.gold < 10 || g.potions >= 9) return false;
    g.gold -= 10; g.potions++; return true;
  }
  const next = ITEMS.find(i => i.id === id);
  if (!next || g.gold < next.cost || next.tier <= item(g[next.slot]).tier) return false;
  g.gold -= next.cost; g[next.slot] = next.id; note(g, `${next.name}を購入して装備した。`); return true;
}
export function startBattle(g: Game, boss = false, encounter?: number): boolean {
  if (!['camp', 'victory', 'defeat'].includes(g.phase) || (boss && g.kills < 3) || g.hp <= 0) return false;
  const s = STAGES[g.stage];
  if (encounter !== undefined && (!Number.isInteger(encounter) || encounter < 0 || encounter > 2 || encounter > g.kills)) return false;
  const kind = encounter ?? Math.min(g.kills, 2);
  g.hp = derived(g).maxHp; g.sp = derived(g).maxSp;
  const hp = Math.round(s.hp * (boss ? 2.65 : 1 + kind * 0.17));
  g.enemy = { name: boss ? s.boss : s.enemies[kind], hp, maxHp: hp,
    atk: Math.round(s.atk * (boss ? 1.35 : 1 + kind * 0.1)), boss, kind, turn: 0 };
  g.phase = 'battle'; g.cooldowns = [0, 0, 0, 0]; g.ward = 0; g.regen = 0; g.charge = 0;
  note(g, `${g.enemy.name}が立ちはだかった！`); return true;
}
export function nextStage(g: Game): boolean {
  if (g.phase !== 'clear') return false;
  g.stage++; g.kills = 0; g.enemy = null; g.phase = 'camp'; g.hp = derived(g).maxHp; g.sp = derived(g).maxSp;
  g.potions = Math.min(9, g.potions + 1); note(g, `${STAGES[g.stage].name}へ。HP回復、ポーション +1。`); return true;
}
function award(g: Game, e: Enemy) {
  const s = STAGES[g.stage], gold = s.gold * (e.boss ? 4 : 1), xp = s.xp * (e.boss ? 3 : 1);
  g.gold += gold; g.xp += xp; g.earnedXp += xp; g.totalKills++;
  g.hp = derived(g).maxHp; g.sp = derived(g).maxSp;
  note(g, `${e.name}を倒した！ +${gold} G / +${xp} EXP`);
  if (e.boss) { g.phase = g.stage === STAGES.length - 1 ? 'complete' : 'clear'; g.hp = derived(g).maxHp; g.sp = derived(g).maxSp; }
  else { g.kills = Math.max(g.kills, e.kind + 1); g.phase = 'victory'; }
}
export interface TurnResult { playerDamage: number; enemyDamage: number; critical: boolean; dodged: boolean; healed: number; charged: boolean }
export function act(g: Game, action: Action, rng: () => number = Math.random): TurnResult | null {
  const e = g.enemy;
  if (g.phase !== 'battle' || !e || !['attack', 'guard', 'potion', 0, 1, 2, 3].includes(action) || (action === 'potion' && g.potions <= 0)) return null;
  const index = typeof action === 'number' ? action : -1;
  const selected = index >= 0 && g.slots[index] ? skill(g.slots[index]!) : null;
  if (index >= 0 && (!selected || g.cooldowns[index] > 0 || g.sp < selected.sp)) return null;
  const d = derived(g);
  const r: TurnResult = { playerDamage: 0, enemyDamage: 0, critical: false, dodged: false, healed: 0, charged: e.boss && e.turn % 3 === 2 };
  g.cooldowns = g.cooldowns.map(c => Math.max(0, c - 1));
  if (selected) { g.sp -= selected.sp; g.cooldowns[index] = selected.cd; }
  const heal = (amount: number) => { const hp = Math.min(d.maxHp - g.hp, Math.ceil(amount)); g.hp += hp; r.healed += hp; };
  const hit = (multiplier: number, name: string) => {
    r.critical = rng() < d.crit;
    r.playerDamage = Math.max(1, Math.round(d.atk * multiplier * (g.charge ? 2 : 1) * (r.critical ? 1.6 : 1) * (0.9 + rng() * 0.2)));
    g.charge = 0; e.hp = Math.max(0, e.hp - r.playerDamage);
    note(g, `${name}${r.critical ? '・会心！' : ''} ${r.playerDamage}ダメージ。`);
  };
  if (action === 'potion') {
    g.potions--; r.healed = Math.min(d.maxHp - g.hp, Math.ceil(d.maxHp * 0.5)); g.hp += r.healed;
    note(g, `ポーションでHPを${r.healed}回復。`);
  } else if (selected) {
    const id = selected.id;
    if (['heavy', 'double', 'finisher', 'bash', 'drain'].includes(id)) hit(({ heavy: 1.6, double: 2.1, finisher: 3.4, bash: 1.5, drain: 1.4 } as Record<string, number>)[id], selected.name);
    else note(g, `${selected.name}を使った。`);
    if (id === 'ward' || id === 'fortress') g.ward = 3;
    if (id === 'bash') g.ward = Math.max(g.ward, 1);
    if (id === 'charge') g.charge = 1;
    if (id === 'focus') g.sp = Math.min(d.maxSp, g.sp + Math.ceil(d.maxSp * 0.35));
    if (id === 'mend' || id === 'fortress') heal(d.maxHp * 0.3);
    if (id === 'renew') heal(d.maxHp * 0.75);
    if (id === 'drain') heal(r.playerDamage * 0.5);
    if (id === 'regen') g.regen = 3;
  } else if (action === 'attack') {
    hit(1, '攻撃');
  } else { note(g, '身構えた。受けるダメージを75%軽減。'); }
  if (e.hp === 0) { award(g, e); return r; }
  r.dodged = rng() < d.dodge;
  if (!r.dodged) {
    r.enemyDamage = Math.max(1, Math.round((Math.max(1, e.atk * (r.charged ? 2.1 : 1) - d.def)) * (action === 'guard' ? 0.25 : 1) * (g.ward ? 0.55 : 1)));
    g.hp = Math.max(0, g.hp - r.enemyDamage);
  }
  note(g, r.dodged ? 'ひらりと敵の攻撃をかわした！' : `${r.charged ? '敵の大技！' : '敵の反撃。'} ${r.enemyDamage}ダメージ。`);
  e.turn++;
  if (g.ward > 0) g.ward--;
  if (g.hp > 0 && g.regen > 0) { heal(d.maxHp * 0.12); g.regen--; }
  if (g.hp === 0) {
    g.phase = 'defeat'; g.hp = d.maxHp; g.sp = d.maxSp;
    note(g, '敗北…。HP・SPは全回復。装備やスキルを見直して再挑戦しよう。');
  }
  return r;
}
