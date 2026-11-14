/** Standalone RPG rules. All balance values are INKBOUND tuning, not claimed original-game values. */
export type Stat = 'hp' | 'sp' | 'atk' | 'def' | 'agi';
export type Action = 'attack' | 'run' | 'potion' | 'ether' | 'remedy' | number;
export type Phase = 'camp' | 'battle' | 'victory' | 'defeat' | 'clear' | 'complete';
export type EquipmentSlot = 'weapon' | 'armor';
export type Affliction = 'poison' | 'strain';
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
  { id: 'venom-vest', name: '解毒のベスト', slot: 'armor', cost: 70, bonus: 3, resist: 'poison', tier: 2, description: '防御 +3 / 毒のダメージを半減。' },
  { id: 'mind-robe', name: '平静の衣', slot: 'armor', cost: 90, bonus: 4, resist: 'strain', tier: 2, description: '防御 +4 / 術乱の追加SP費用を半減。' },
  { id: 'swift-coat', name: '疾風のコート', slot: 'armor', cost: 100, bonus: 4, agi: 10, tier: 2, description: '防御 +4 / AGI +10。' },
];
export type Job = 'warrior' | 'rogue' | 'knight' | 'mage';
export const JOBS = [
 {id:'warrior',name:'戦士',description:'一撃・防御崩し・撃破から次の攻勢へ'},
 {id:'rogue',name:'盗賊',description:'手数・傷・回避と会心をつなぐ'},
 {id:'knight',name:'守護者',description:'防壁・反撃・防いだ力を放出'},
 {id:'mage',name:'魔術師',description:'SPで術を育て、燃焼やHP消費へ分岐'}
] as const;
export interface Skill { id:string; name:string; branch:Job; kind:'active'|'passive'|'variant'; cost:number; sp:number; cd:number; requires:string[]; statRequirements?:Partial<Record<Stat,number>>; summary:string; effect:string; symbol:string; tier:number; column:number }
export const SKILLS:readonly Skill[] = [
  {
    "id": "cleave",
    "name": "強斬",
    "branch": "warrior",
    "kind": "active",
    "cost": 8,
    "sp": 4,
    "cd": 1,
    "requires": [],
    "summary": "単体に攻撃165%",
    "effect": "攻撃力165%の単体物理攻撃。大きな一発で防御を抜く。",
    "tier": 0,
    "column": 0,
    "symbol": "✦"
  },
  {
    "id": "sunder",
    "name": "鎧砕き",
    "branch": "warrior",
    "kind": "variant",
    "cost": 18,
    "sp": 5,
    "cd": 1,
    "requires": [
      "cleave"
    ],
    "summary": "攻撃110%＋防御低下",
    "effect": "強斬の変化技。攻撃110%で攻撃し、防御を35%下げる（4ターン）。",
    "tier": 1,
    "column": 0,
    "symbol": "◆"
  },
  {
    "id": "sweep",
    "name": "薙ぎ払い",
    "branch": "warrior",
    "kind": "variant",
    "cost": 22,
    "sp": 7,
    "cd": 2,
    "requires": [
      "cleave"
    ],
    "summary": "全体に攻撃105%",
    "effect": "強斬の変化技。すべての敵に攻撃105%の物理攻撃。",
    "tier": 1,
    "column": 1,
    "symbol": "◆"
  },
  {
    "id": "follow",
    "name": "残心",
    "branch": "warrior",
    "kind": "passive",
    "cost": 16,
    "sp": 0,
    "cd": 0,
    "requires": [
      "cleave"
    ],
    "summary": "技の後の通常攻撃を強化",
    "effect": "攻撃スキル命中後、次の通常攻撃に攻撃65%の追撃とSP2回復を付ける。1回分だけ保持。",
    "tier": 2,
    "column": 0,
    "symbol": "◉"
  },
  {
    "id": "executioner",
    "name": "処刑剣",
    "branch": "warrior",
    "kind": "active",
    "cost": 38,
    "sp": 8,
    "cd": 2,
    "requires": [
      "sunder"
    ],
    "summary": "攻撃240%／瀕死に360%",
    "effect": "単体に攻撃240%。対象のHPが35%以下なら360%。",
    "statRequirements": {
      "atk": 26
    },
    "tier": 2,
    "column": 1,
    "symbol": "✦"
  },
  {
    "id": "battleflow",
    "name": "戦意吸収",
    "branch": "warrior",
    "kind": "passive",
    "cost": 28,
    "sp": 0,
    "cd": 0,
    "requires": [
      "follow"
    ],
    "summary": "撃破ごとにSP4回収",
    "effect": "自分の攻撃・継続ダメージ・反撃による撃破でSP4回復。",
    "tier": 3,
    "column": 0,
    "symbol": "◉"
  },
  {
    "id": "grit",
    "name": "逆境",
    "branch": "warrior",
    "kind": "passive",
    "cost": 24,
    "sp": 0,
    "cd": 0,
    "requires": [
      "cleave"
    ],
    "summary": "HP40%以下で攻撃+30%",
    "effect": "HPが最大値の40%以下の間、攻撃力が30%上がる。",
    "tier": 3,
    "column": 1,
    "symbol": "◉"
  },
  {
    "id": "flurry",
    "name": "三連斬",
    "branch": "rogue",
    "kind": "active",
    "cost": 8,
    "sp": 5,
    "cd": 1,
    "requires": [],
    "summary": "攻撃60%を3回",
    "effect": "同じ敵に攻撃60%を3回。各命中が傷刻みを発動できる。",
    "tier": 0,
    "column": 0,
    "symbol": "✦"
  },
  {
    "id": "venomcut",
    "name": "毒刃",
    "branch": "rogue",
    "kind": "active",
    "cost": 10,
    "sp": 4,
    "cd": 1,
    "requires": [],
    "summary": "攻撃80%＋毒・3T",
    "effect": "攻撃80%で攻撃し、攻撃力35%+2の毒を3ターン与える。毒は最大3重。",
    "tier": 0,
    "column": 1,
    "symbol": "✦"
  },
  {
    "id": "serration",
    "name": "傷刻み",
    "branch": "rogue",
    "kind": "passive",
    "cost": 18,
    "sp": 0,
    "cd": 0,
    "requires": [
      "flurry"
    ],
    "summary": "物理の各命中で裂傷",
    "effect": "手動の物理攻撃の各命中で裂傷を1追加。1重につき攻撃力12%（最低2）の防御無視ダメージを3ターン。最大5重。",
    "tier": 1,
    "column": 0,
    "symbol": "◉"
  },
  {
    "id": "foresight",
    "name": "見切り",
    "branch": "rogue",
    "kind": "passive",
    "cost": 22,
    "sp": 0,
    "cd": 0,
    "requires": [
      "flurry"
    ],
    "summary": "回避→次の一発が必中会心",
    "effect": "回避すると、次の手動攻撃の最初の1発が必中・会心になる。保持は1回分。",
    "tier": 1,
    "column": 1,
    "symbol": "◉"
  },
  {
    "id": "harvest",
    "name": "刈り取り",
    "branch": "rogue",
    "kind": "active",
    "cost": 30,
    "sp": 5,
    "cd": 1,
    "requires": [
      "serration"
    ],
    "summary": "裂傷を回収＋攻撃80%",
    "effect": "裂傷を消費し、残る継続ダメージの80%を即時回収。さらに攻撃80%の物理攻撃。",
    "tier": 2,
    "column": 0,
    "symbol": "✦"
  },
  {
    "id": "pursuit",
    "name": "追撃",
    "branch": "rogue",
    "kind": "passive",
    "cost": 32,
    "sp": 0,
    "cd": 0,
    "requires": [
      "foresight"
    ],
    "summary": "会心→攻撃45%の追撃",
    "effect": "手動攻撃で会心が出ると攻撃45%の追撃。1行動につき1回。追撃から追撃は発生しない。",
    "tier": 2,
    "column": 1,
    "symbol": "◉"
  },
  {
    "id": "siphon",
    "name": "血の巡り",
    "branch": "rogue",
    "kind": "passive",
    "cost": 30,
    "sp": 0,
    "cd": 0,
    "requires": [
      "venomcut"
    ],
    "summary": "継続ダメージの30%を吸収",
    "effect": "自分の毒・裂傷・燃焼が実際に与えたダメージの30%をHPに戻す。",
    "tier": 3,
    "column": 0,
    "symbol": "◉"
  },
  {
    "id": "shieldstrike",
    "name": "盾撃",
    "branch": "knight",
    "kind": "active",
    "cost": 8,
    "sp": 4,
    "cd": 1,
    "requires": [],
    "summary": "攻撃80%＋防御120%／防壁",
    "effect": "攻撃力80%+防御力120%で攻撃し、防御力2倍+4の防壁を得る。防壁は直接ダメージを肩代わりする。",
    "tier": 0,
    "column": 0,
    "symbol": "✦"
  },
  {
    "id": "brace",
    "name": "守りの備え",
    "branch": "knight",
    "kind": "passive",
    "cost": 12,
    "sp": 0,
    "cd": 0,
    "requires": [],
    "summary": "開始時に防御3倍の防壁",
    "effect": "戦闘開始時、防御力3倍の防壁を張る。",
    "tier": 0,
    "column": 1,
    "symbol": "◉"
  },
  {
    "id": "riposte",
    "name": "反撃",
    "branch": "knight",
    "kind": "passive",
    "cost": 20,
    "sp": 0,
    "cd": 0,
    "requires": [
      "shieldstrike"
    ],
    "summary": "防壁で受けると反撃",
    "effect": "防壁が敵の直接攻撃を吸収すると、攻撃50%+防御150%で反撃。敵の1行動につき1回。",
    "tier": 1,
    "column": 0,
    "symbol": "◉"
  },
  {
    "id": "reservoir",
    "name": "蓄勢",
    "branch": "knight",
    "kind": "passive",
    "cost": 18,
    "sp": 0,
    "cd": 0,
    "requires": [
      "shieldstrike"
    ],
    "summary": "軽減した力を通常攻撃へ",
    "effect": "防御・防壁で防いだ量の半分を蓄積。次の通常攻撃の命中で全放出。上限は防御力6倍。",
    "tier": 1,
    "column": 1,
    "symbol": "◉"
  },
  {
    "id": "shockwave",
    "name": "解放撃",
    "branch": "knight",
    "kind": "active",
    "cost": 34,
    "sp": 7,
    "cd": 2,
    "requires": [
      "reservoir"
    ],
    "summary": "全体に攻撃80%＋蓄積70%",
    "effect": "蓄積をすべて消費し、各敵へ攻撃80%+蓄積70%で攻撃。蓄積が必要。",
    "statRequirements": {
      "def": 10
    },
    "tier": 2,
    "column": 1,
    "symbol": "✦"
  },
  {
    "id": "fortitude",
    "name": "不退転",
    "branch": "knight",
    "kind": "passive",
    "cost": 30,
    "sp": 0,
    "cd": 0,
    "requires": [
      "riposte"
    ],
    "summary": "軽減するとSP2回収",
    "effect": "防御・防壁で直接ダメージを軽減するとSP2回復。自分の1行動につき1回まで。",
    "tier": 2,
    "column": 0,
    "symbol": "◉"
  },
  {
    "id": "aegis",
    "name": "城壁",
    "branch": "knight",
    "kind": "active",
    "cost": 28,
    "sp": 6,
    "cd": 2,
    "requires": [
      "reservoir"
    ],
    "summary": "防御4倍＋最大SP30%の防壁",
    "effect": "防御力4倍+最大SP30%の防壁を得る。防壁の総量には最大HPと防御から決まる上限がある。",
    "tier": 3,
    "column": 1,
    "symbol": "✦"
  },
  {
    "id": "spark",
    "name": "魔弾",
    "branch": "mage",
    "kind": "active",
    "cost": 8,
    "sp": 4,
    "cd": 1,
    "requires": [],
    "summary": "最大SPで威力が伸びる術",
    "effect": "術威力（最大SP70%+4）の単体攻撃。物理より敵の防御の影響が小さい。",
    "tier": 0,
    "column": 0,
    "symbol": "✦"
  },
  {
    "id": "firstaid",
    "name": "応急治療",
    "branch": "mage",
    "kind": "active",
    "cost": 10,
    "sp": 6,
    "cd": 2,
    "requires": [],
    "summary": "HPを16＋最大SP60%回復",
    "effect": "HPを16+最大SP60%回復する。最大HPへの比例回復や状態治療は行わない。",
    "tier": 0,
    "column": 1,
    "symbol": "✦"
  },
  {
    "id": "ember",
    "name": "残火",
    "branch": "mage",
    "kind": "passive",
    "cost": 18,
    "sp": 0,
    "cd": 0,
    "requires": [
      "spark"
    ],
    "summary": "術の命中で燃焼・3T",
    "effect": "手動の術攻撃が燃焼を1追加。1重につき最大SP12%+2の継続ダメージを3ターン。最大3重。",
    "tier": 1,
    "column": 0,
    "symbol": "◉"
  },
  {
    "id": "meditation",
    "name": "魔力還流",
    "branch": "mage",
    "kind": "passive",
    "cost": 16,
    "sp": 0,
    "cd": 0,
    "requires": [
      "spark"
    ],
    "summary": "通常攻撃命中でSP4回収",
    "effect": "通常攻撃が命中するとSP4回復。残心によるSP回収とも併用できる。",
    "tier": 1,
    "column": 1,
    "symbol": "◉"
  },
  {
    "id": "overload",
    "name": "魔力圧縮",
    "branch": "mage",
    "kind": "variant",
    "cost": 36,
    "sp": 10,
    "cd": 2,
    "requires": [
      "spark"
    ],
    "summary": "術威力220%の単体攻撃",
    "effect": "魔弾の変化技。術威力220%の大きな一発。高い消費と待機を伴う。",
    "statRequirements": {
      "sp": 38
    },
    "tier": 2,
    "column": 0,
    "symbol": "◆"
  },
  {
    "id": "spellward",
    "name": "魔力障壁",
    "branch": "mage",
    "kind": "passive",
    "cost": 26,
    "sp": 0,
    "cd": 0,
    "requires": [
      "firstaid"
    ],
    "summary": "術を使うと防壁を得る",
    "effect": "攻撃の術を発動すると最大SP15%+2の防壁を得る。命中しなくても発動。",
    "tier": 2,
    "column": 1,
    "symbol": "◉"
  },
  {
    "id": "bloodcast",
    "name": "血の契り",
    "branch": "mage",
    "kind": "variant",
    "cost": 40,
    "sp": 0,
    "cd": 1,
    "requires": [
      "ember"
    ],
    "summary": "HP12で術威力135%",
    "effect": "魔弾の変化技。SPの代わりにHP12を払い、術威力135%で攻撃。HP12以下では使用不可。",
    "statRequirements": {
      "hp": 112
    },
    "tier": 3,
    "column": 0,
    "symbol": "◆"
  }
];
export const item = (id: string) => ITEMS.find(i => i.id === id)!;
export const skill = (id: string) => SKILLS.find(s => s.id === id)!;
export const STAGES = [
  { name: 'はじまりの草原', subtitle: 'THE QUIET MEADOW', color: '#d5dfbf', enemies: ['草むらスライム', '盗賊の二人組', '衛兵と手当て係'], boss: '草原の番人', hp: 30, atk: 7, gold: 15, xp: 14 },
  { name: 'ささやきの森', subtitle: 'THE WHISPERING WOODS', color: '#9fbaa7', enemies: ['毒の群れ', '俊足の狩人', '森の祈祷隊'], boss: '森の呪術師', hp: 65, atk: 13, gold: 26, xp: 24 },
  { name: '忘れられた遺跡', subtitle: 'THE FORGOTTEN RUINS', color: '#bbb8bd', enemies: ['石の守り', '影の剣士', '遺跡の護衛隊'], boss: '灰色の騎士', hp: 115, atk: 20, gold: 40, xp: 35 },
  { name: '夜明けの城門', subtitle: 'THE GATE OF DAWN', color: '#d0ba9c', enemies: ['城門の双衛', '術乱の魔術師', '王の近衛隊'], boss: '夜を継ぐ王', hp: 180, atk: 29, gold: 60, xp: 50 },
] as const;
export interface TimedEffect { power:number; turns:number; stacks?:number }
export interface Effects { attack?:TimedEffect; defense?:TimedEffect; agility?:TimedEffect; poison?:TimedEffect; strain?:TimedEffect; bleed?:TimedEffect; burn?:TimedEffect }
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
 version:4; stage:number; kills:number; xp:number; earnedXp:number; gold:number; stats:Record<Stat,number>;
 hp:number; sp:number; potions:number; ethers:number; remedies:number; weapon:string; armor:string; owned:string[];
 phase:Phase; enemy:Enemy|null; enemies:Enemy[]; target:number; cooldowns:number[]; effects:Effects;
 barrier:number; stored:number; readyCrit:boolean; followReady:boolean;
 log:string[]; totalKills:number; learned:string[]; slots:(string|null)[];
}
export const statCost=(g:Game,stat:Stat)=>8+g.stats[stat]*5;
export const rank=(g:Game)=>1+Math.floor(g.earnedXp/50);
const clamp=(lo:number,hi:number,n:number)=>Math.max(lo,Math.min(hi,n));
const boosted=(n:number,e?:TimedEffect)=>Math.max(1,Math.round(n*(1+(e?.power??0))));
export function baseStats(g:Game){return {hp:70+g.stats.hp*14,sp:20+g.stats.sp*6,atk:11+g.stats.atk*3,def:2+g.stats.def*2,agi:10+g.stats.agi*3};}
export function derived(g:Game){
 const b=baseStats(g),w=item(g.weapon),a=item(g.armor);
 const maxSp=b.sp+(w.sp??0),agi=boosted(b.agi+(w.agi??0)+(a.agi??0),g.effects.agility);
 let atk=boosted(b.atk+w.bonus,g.effects.attack);
 if(g.learned.includes('grit')&&g.hp<=b.hp*.4)atk=Math.round(atk*1.3);
 return {maxHp:b.hp,maxSp,atk,def:boosted(b.def+a.bonus,g.effects.defense),agi,crit:clamp(.05,.45,.05+(agi-10)*.008),spell:Math.round(maxSp*.7+4)};
}
export const hitChance=(a:number,d:number)=>clamp(.6,.98,.9+(a-d)*.009);
export function enemyStats(e:Enemy){return {atk:boosted(e.atk,e.effects.attack),def:boosted(e.def,e.effects.defense),agi:boosted(e.agi,e.effects.agility)};}
export function enemyHint(e:Pick<Enemy,'style'>):string{
 return ({normal:'通常攻撃で戦う',brute:'HPが減ると攻撃を強化',healer:'傷ついた仲間を最大3回回復',swift:'高いAGI。こちらのAGIを下げる',venom:'命中時に毒を付与。毒は3ターン続く',shaman:'術乱を付与：技の消費SPが2増える',knight:'高い防御。こちらの攻撃を下げる',king:'仲間の死を吸収し強化。術乱・攻撃低下を使う'})[e.style];
}
export function encounterPreview(stage:number,encounter:number,boss=false):Enemy[]{
 const roster=ROSTERS[stage]?.[boss?3:encounter];if(!roster)return [];
 return roster.map((f,i)=>({...f,id:`${f.id}-${i}`,maxHp:f.hp,boss:boss&&i===0,kind:f.kind??1,turn:0,effects:{},abilities:{},heals:3}));
}
export function newGame():Game{
 return {version:4,stage:0,kills:0,xp:40,earnedXp:0,gold:20,stats:{hp:0,sp:0,atk:0,def:0,agi:0},hp:70,sp:20,potions:3,ethers:1,remedies:2,weapon:'twig',armor:'cloth',owned:['twig','cloth'],phase:'camp',enemy:null,enemies:[],target:0,cooldowns:[0,0,0,0],effects:{},barrier:0,stored:0,readyCrit:false,followReady:false,log:['4つの系統を自由に組み合わせよう。技は4枠、常時効果は習得で有効。'],totalKills:0,learned:[],slots:[null,null,null,null]};
}
function note(g:Game,s:string){g.log.unshift(s);g.log=g.log.slice(0,20);}
export function meetsStats(g:Game,s:Skill):boolean{return Object.entries(s.statRequirements??{}).every(([k,n])=>baseStats(g)[k as Stat]>=n);}
export function canLearn(g:Game,id:string):boolean{
 const s=SKILLS.find(s=>s.id===id);return !!s&&g.phase!=='battle'&&!g.learned.includes(id)&&g.xp>=s.cost&&s.requires.every(p=>g.learned.includes(p))&&meetsStats(g,s);
}
export function allocate(g:Game,stat:Stat):boolean{
 if(!['hp','sp','atk','def','agi'].includes(stat)||g.phase==='battle'||g.xp<statCost(g,stat))return false;
 g.xp-=statCost(g,stat);g.stats[stat]++;if(stat==='hp')g.hp+=14;if(stat==='sp')g.sp+=6;return true;
}
export function learn(g:Game,id:string):boolean{
 if(!canLearn(g,id))return false;const s=skill(id);g.xp-=s.cost;g.learned.push(id);
 const empty=g.slots.indexOf(null);
 if(s.kind!=='passive'&&empty>=0)g.slots[empty]=id;
 note(g,`${s.name}を習得。${s.kind==='passive'?'常時効果が有効になった。':empty>=0?`枠${empty+1}にセット。`:'編成からセットできる。'}`);return true;
}
export function equipSkill(g:Game,slot:number,id:string|null):boolean{
 if(g.phase==='battle'||!Number.isInteger(slot)||slot<0||slot>3||(id!==null&&(!g.learned.includes(id)||skill(id).kind==='passive')))return false;
 g.slots[slot]=id;return true;
}
export function respec(g:Game):boolean{
 if(g.phase==='battle')return false;
 g.xp+=Object.values(g.stats).reduce((sum,n)=>sum+8*n+5*n*(n-1)/2,0)+g.learned.reduce((sum,id)=>sum+skill(id).cost,0);
 g.stats={hp:0,sp:0,atk:0,def:0,agi:0};g.learned=[];g.slots=[null,null,null,null];recover(g);note(g,'能力とスキルの費用をXPへ戻した。');return true;
}
export function equip(g:Game,id:string):boolean{const e=ITEMS.find(i=>i.id===id);if(g.phase==='battle'||!e||!g.owned.includes(id))return false;g[e.slot]=id;recover(g);return true;}
export function buy(g:Game,id:string):boolean{
 if(g.phase==='battle')return false;
 const c=({potion:['potions',10],ether:['ethers',15],remedy:['remedies',12]} as const)[id as 'potion'|'ether'|'remedy'];
 if(c){const[k,cost]=c;if(g.gold<cost||g[k]>=9)return false;g.gold-=cost;g[k]++;return true;}
 const next=ITEMS.find(i=>i.id===id);if(!next||g.owned.includes(id)||g.gold<next.cost)return false;
 g.gold-=next.cost;g.owned.push(id);equip(g,id);note(g,`${next.name}を購入して装備した。`);return true;
}
function recover(g:Game){g.effects={};g.barrier=0;g.stored=0;g.readyCrit=false;g.followReady=false;g.hp=derived(g).maxHp;g.sp=derived(g).maxSp;}
export function skillCost(g:Game,s:Skill):number{
 if(s.kind==='passive'||s.id==='bloodcast')return 0;
 return s.sp+(g.effects.strain?(item(g.armor).resist==='strain'?1:2):0);
}
export function skillBlockReason(g:Game,slot:number):string{
 const id=g.slots[slot],s=id?skill(id):null;
 if(!s)return '未セット';
 if(g.cooldowns[slot]>0)return `あと${g.cooldowns[slot]}T`;
 if(s.id==='bloodcast'&&g.hp<=12)return 'HPが足りない';
 if(s.id==='shockwave'&&g.stored===0)return '蓄積が必要';
 if(g.sp<skillCost(g,s))return `SP不足（${skillCost(g,s)}）`;
 return '';
}
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
  recover(g); g.target = 0; g.enemy = g.enemies[0]; g.phase = 'battle'; g.cooldowns = [0, 0, 0, 0]; if(g.learned.includes('brace'))g.barrier=derived(g).def*3;
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
function effect(e:Effects,k:keyof Effects,power:number,turns:number){e[k]={power,turns};}
function addDot(e:Effects,k:'bleed'|'burn'|'poison',power:number,stacks=1,max=5){
 const old=e[k];e[k]={power:Math.max(power,old?.power??0),turns:3,stacks:Math.min(max,(old?.stacks??0)+stacks)};
}
function tick(e:Effects){for(const k of Object.keys(e) as (keyof Effects)[])if(--e[k]!.turns<=0)delete e[k];}
export function statusLabels(e:Effects):string[]{
 return (Object.keys(e) as (keyof Effects)[]).map(k=>`${({attack:'攻',defense:'防',agility:'速',poison:'毒',strain:'術乱',bleed:'傷',burn:'燃'})[k]}${['attack','defense','agility'].includes(k)?e[k]!.power>0?'↑':'↓':(e[k]!.stacks??1)>1?'×'+e[k]!.stacks+'・':''}${e[k]!.turns}T`);
}
export interface TurnResult {playerDamage:number;enemyDamage:number;critical:boolean;dodged:boolean;healed:number;escaped:boolean;hits:number;misses:number}
export function act(g:Game,action:Action,rng:()=>number=Math.random):TurnResult|null{
 if(g.phase!=='battle'||!g.enemy||!['attack','run','potion','ether','remedy',0,1,2,3].includes(action))return null;
 const slot=typeof action==='number'?action:-1,s=slot>=0&&g.slots[slot]?skill(g.slots[slot]!):null;
 if(slot>=0&&(skillBlockReason(g,slot)||!s||s.kind==='passive'))return null;
 if((action==='potion'&&!g.potions)||(action==='ether'&&!g.ethers)||(action==='remedy'&&!g.remedies))return null;
 const r:TurnResult={playerDamage:0,enemyDamage:0,critical:false,dodged:false,healed:0,escaped:false,hits:0,misses:0};
 const has=(id:string)=>g.learned.includes(id);
 const gainSp=(n:number)=>{const amount=Math.min(n,derived(g).maxSp-g.sp);g.sp+=amount;if(amount>0)note(g,`SPを${amount}回収。`);};
 const heal=(n:number)=>{const amount=Math.min(Math.ceil(n),derived(g).maxHp-g.hp);g.hp+=amount;r.healed+=amount;return amount;};
 const shield=(n:number)=>{g.barrier=Math.min(Math.ceil(derived(g).maxHp*.6+derived(g).def*2),g.barrier+Math.ceil(n));};
 const killed=new Set<string>();let anyCritical=false,manualHits=0,fortitudeUsed=false;
 const markKill=(e:Enemy)=>{if(e.hp<=0&&!killed.has(e.id)){killed.add(e.id);note(g,`${e.name}を倒した。`);if(has('battleflow'))gainSp(4);}};
 const damage=(e:Enemy,base:number,physical:boolean,manual=true,armorFactor=physical?.5:.25):number=>{
   if(e.hp<=0)return 0;
   const d=derived(g),es=enemyStats(e),sure=manual&&g.readyCrit;
   if(!sure&&rng()>=hitChance(d.agi,es.agi)){r.misses++;note(g,`${e.name}に当たらなかった。`);return 0;}
   const critical=sure||rng()<d.crit;if(sure)g.readyCrit=false;
   const n=Math.max(1,Math.round((base*(critical?1.65:1)-es.def*armorFactor)*(.95+rng()*.1)));
   const actual=Math.min(e.hp,n);e.hp-=actual;r.playerDamage+=actual;r.hits++;r.critical||=critical;
   if(manual){manualHits++;anyCritical||=critical;
     if(physical&&has('serration')&&e.hp>0)addDot(e.effects,'bleed',Math.max(2,Math.ceil(d.atk*.12)));
     if(!physical&&has('ember')&&e.hp>0)addDot(e.effects,'burn',Math.ceil(d.maxSp*.12+2),1,3);
   }
   note(g,`${s&&manual?s.name:manual?'通常攻撃':'追撃・反撃'}${critical?'・会心':''} → ${e.name}に${actual}。`);markKill(e);return actual;
 };
 const finish=()=>{if(g.enemies.every(e=>e.hp<=0)){award(g);return true;}retarget(g);return false;};
 g.cooldowns=g.cooldowns.map(c=>Math.max(0,c-1));
 if(s){g.cooldowns[slot]=s.cd;if(s.id==='bloodcast')g.hp-=12;else g.sp-=skillCost(g,s);}
 const target=g.enemy;
 if(action==='attack'){
   const bank=has('reservoir')?g.stored:0,follow=g.followReady;g.followReady=false;
   damage(target,derived(g).atk+bank,true);
   if(manualHits>0){
     if(bank){g.stored=0;note(g,`蓄積${bank}を放出。`);}
     if(follow){if(target.hp>0)damage(target,derived(g).atk*.65,true,false);gainSp(2);}
     if(has('meditation'))gainSp(4);
   }
 }else if(action==='potion'){g.potions--;note(g,`ポーションでHP+${heal(derived(g).maxHp*.5)}。`);}
 else if(action==='ether'){g.ethers--;gainSp(Math.ceil(derived(g).maxSp*.5));}
 else if(action==='remedy'){g.remedies--;delete g.effects.poison;delete g.effects.strain;note(g,'治療薬で毒・術乱を解除。');}
 else if(action==='run'){
   const fastest=Math.max(...g.enemies.filter(e=>e.hp>0).map(e=>enemyStats(e).agi));
   if(rng()<clamp(.3,.9,.65+(derived(g).agi-fastest)*.015)){r.escaped=true;g.phase='camp';recover(g);g.enemy=null;g.enemies=[];note(g,'逃走。報酬・進行なし。HP・SP全回復。');return r;}
   note(g,'逃走に失敗。');
 }else if(s){
   const d=derived(g);
   switch(s.id){
    case 'cleave':damage(target,d.atk*1.65,true);break;
    case 'sunder':damage(target,d.atk*1.1,true);if(manualHits&&target.hp>0)effect(target.effects,'defense',-.35,4);break;
    case 'sweep':for(const e of g.enemies)damage(e,d.atk*1.05,true);break;
    case 'executioner':damage(target,d.atk*(target.hp/target.maxHp<=.35?3.6:2.4),true);break;
    case 'flurry':for(let i=0;i<3;i++)damage(target,d.atk*.6,true);break;
    case 'venomcut':damage(target,d.atk*.8,true);if(manualHits&&target.hp>0)addDot(target.effects,'poison',Math.ceil(d.atk*.35+2),1,3);break;
    case 'harvest':{
      const dot=target.effects.bleed;
      const cash=dot?Math.ceil(dot.power*(dot.stacks??1)*dot.turns*.8):0;
      delete target.effects.bleed;
      if(cash){const actual=Math.min(target.hp,cash);target.hp-=actual;r.playerDamage+=actual;note(g,`裂傷を刈り取り${actual}ダメージ。`);markKill(target);}
      damage(target,d.atk*.8,true);break;
    }
    case 'shieldstrike':damage(target,d.atk*.8+d.def*1.2,true);shield(d.def*2+4);note(g,`防壁${g.barrier}を展開。`);break;
    case 'shockwave':{const bank=g.stored;g.stored=0;for(const e of g.enemies)damage(e,d.atk*.8+bank*.7,true);note(g,`蓄積${bank}を解放。`);break;}
    case 'aegis':shield(d.def*4+d.maxSp*.3);note(g,`城壁を展開。防壁${g.barrier}。`);break;
    case 'spark':damage(target,d.spell,false);break;
    case 'overload':damage(target,d.spell*2.2,false);break;
    case 'bloodcast':damage(target,d.spell*1.35,false);break;
    case 'firstaid':note(g,`応急治療でHP+${heal(16+d.maxSp*.6)}。`);break;
   }
   if(['spark','overload','bloodcast'].includes(s.id)&&has('spellward'))shield(d.maxSp*.15+2);
 }
 if(anyCritical&&has('pursuit')){
   const next=target.hp>0?target:g.enemies.find(e=>e.hp>0);
   if(next)damage(next,derived(g).atk*.45,true,false);
 }
 if(s&&manualHits>0&&has('follow'))g.followReady=true;
 if(finish())return r;
 for(const enemy of g.enemies){
   if(enemy.hp<=0||g.hp<=0)continue;
   for(const key of ['bleed','burn','poison'] as const){
     const dot=enemy.effects[key];if(!dot||enemy.hp<=0)continue;
     const n=Math.min(enemy.hp,Math.ceil(dot.power*(dot.stacks??1)));enemy.hp-=n;r.playerDamage+=n;
     note(g,`${enemy.name}に${key==='bleed'?'裂傷':key==='burn'?'燃焼':'毒'}${n}。`);
     if(has('siphon')){const nHeal=heal(n*.3);if(nHeal)note(g,`血の巡りでHP+${nHeal}。`);}
     markKill(enemy);
   }
   if(enemy.hp<=0)continue;
   enemy.turn++;for(const key of Object.keys(enemy.abilities))if(key!=='encounter'&&key!=='absorbed')enemy.abilities[key]=Math.max(0,enemy.abilities[key]-1);
   const es=enemyStats(enemy),alive=g.enemies.filter(e=>e.hp>0);
   const wounded=[...alive].sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0];
   if(enemy.style==='king'){
     const dead=g.enemies.filter(e=>e!==enemy&&e.hp<=0).length;
     if(dead>(enemy.abilities.absorbed??0)){enemy.abilities.absorbed=dead;effect(enemy.effects,'attack',.4,5);note(g,'王が倒れた仲間の力を吸収した。');continue;}
   }
   if(enemy.style==='healer'&&enemy.heals>0&&wounded.hp<wounded.maxHp*.75){const n=Math.min(wounded.maxHp-wounded.hp,Math.ceil(wounded.maxHp*.35));wounded.hp+=n;enemy.heals--;note(g,`${enemy.name}が${wounded.name}を${n}回復。`);continue;}
   if(['brute','king'].includes(enemy.style)&&enemy.hp<enemy.maxHp*.6&&!enemy.effects.attack&&!enemy.abilities.rage){effect(enemy.effects,'attack',.4,4);enemy.abilities.rage=6;note(g,`${enemy.name}が攻撃を強化。`);continue;}
   if(['shaman','king'].includes(enemy.style)&&!g.effects.strain&&!enemy.abilities.strain){enemy.abilities.strain=5;effect(g.effects,'strain',2,3);note(g,`${enemy.name}の術乱。2行動の間、技の追加SP費用。`);continue;}
   if(['knight','king'].includes(enemy.style)&&!enemy.abilities.weaken&&(!g.effects.attack||g.effects.attack.power>0)){effect(g.effects,'attack',-.35,4);enemy.abilities.weaken=5;note(g,`${enemy.name}がこちらの攻撃を下げた。`);continue;}
   if(enemy.style==='swift'&&!enemy.abilities.slow&&!g.effects.agility){effect(g.effects,'agility',-.35,4);enemy.abilities.slow=5;note(g,`${enemy.name}がこちらのAGIを下げた。`);continue;}
   if(rng()>=hitChance(es.agi,derived(g).agi)){r.dodged=true;if(has('foresight'))g.readyCrit=true;note(g,`${enemy.name}の攻撃を回避。${g.readyCrit?'見切り！次の一発が必中会心。':''}`);continue;}
   const beforeArmor=Math.max(1,es.atk),afterArmor=Math.max(1,Math.round(beforeArmor-derived(g).def*.65));
   const absorbed=Math.min(g.barrier,afterArmor);g.barrier-=absorbed;
   const hpDamage=afterArmor-absorbed;g.hp=Math.max(0,g.hp-hpDamage);r.enemyDamage+=hpDamage;
   const prevented=beforeArmor-hpDamage;
   if(prevented>0){
     if(has('reservoir'))g.stored=Math.min(derived(g).def*6,g.stored+Math.ceil(prevented*.5));
     if(has('fortitude')&&!fortitudeUsed){gainSp(2);fortitudeUsed=true;}
   }
   note(g,`${enemy.name}の攻撃。${hpDamage}ダメージ${absorbed?`／防壁が${absorbed}吸収`:''}。`);
   if(enemy.style==='venom'&&!g.effects.poison&&g.hp>0){const resist=item(g.armor).resist==='poison'?.5:1;effect(g.effects,'poison',Math.ceil(derived(g).maxHp*.06*resist),3);note(g,'毒を受けた。');}
   if(absorbed>0&&has('riposte')&&g.hp>0)damage(enemy,derived(g).atk*.5+derived(g).def*1.5,true,false);
 }
 if(g.effects.poison&&g.hp>0){const n=Math.min(g.hp,Math.ceil(g.effects.poison.power));g.hp-=n;r.enemyDamage+=n;note(g,`毒で${n}ダメージ。`);}
 tick(g.effects);g.enemies.forEach(e=>tick(e.effects));
 if(g.hp<=0){g.phase='defeat';recover(g);note(g,'敗北。HP・SP全回復。育成と編成を変えて再挑戦できる。');}
 else finish();
 return r;
}
