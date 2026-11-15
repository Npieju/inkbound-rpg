import { act, allocate, buy, derived, baseStats, canLearn, JOBS, meetsStats, skillBlockReason, skillCost, equip, encounterPreview, enemyHint, enemyStats, respec, selectTarget, statusLabels, equipSkill, item, ITEMS, learn, newGame, nextStage, rank, skill, SKILLS, statCost, STAGES, startBattle } from './game.ts';
import type { Action, EquipmentSlot, Job, Stat, TurnResult } from './game.ts';
import { loadGame, saveGame } from './save.ts';
import { fighter, swordIcon, shieldIcon } from './art.ts';
import { gameIcon, locationArt, panelFlourish } from './game-ui-art.ts';
import { findArt } from './storybook-art.ts';
import { collectionCount } from './collection.ts';
import { schoolHeader, schoolNavigation, schoolMap } from './school-ui.ts';
import { SKINS, readSkin, rememberSkin, getSkin, presentWorld, worldScenery, worldFighter, worldGuide } from './skins.ts';
let world = (() => { try { return readSkin(localStorage); } catch { return SKINS[0]; } })();
const requestedWorld=SKINS.find(s=>s.id===new URLSearchParams(location.search).get('world'));
if(requestedWorld)world=requestedWorld;
const authored = (text: string) => `<span data-world-authored>${esc(text)}</span>`;
const gearMotifs:Record<string,string>={twig:'skills',iron:'star',steel:'triple',moon:'comet',rapier:'agi','focus-blade':'sp',cloth:'def',leather:'brace',chain:'counter',rune:'ward','venom-vest':'venom','mind-robe':'meditate','swift-coat':'agi'};
const gearIcon=(slot:EquipmentSlot,id='')=>world.collection?gameIcon(gearMotifs[id]??(slot==='weapon'?'skills':'def'),true):slot==='weapon'?swordIcon:shieldIcon;
const character = (enemy=false,boss=false,kind=1,id='') => worldFighter(world,enemy,boss,kind,id)||fighter(enemy,boss,kind);

type Screen = 'map' | 'stats' | 'skills' | 'shop';
type BattleMenu = 'main' | 'skills' | 'items';
const app = document.querySelector<HTMLDivElement>('#app')!;
let game = (() => { try { return loadGame(localStorage); } catch { return newGame(); } })();
let screen: Screen = 'map';
let branch: Job = 'warrior';
let skillView: 'tree' | 'loadout' = 'tree';
let selectedSkill = 'cleave';
let shopCategory: EquipmentSlot | 'items' = 'weapon';
let battleMenu: BattleMenu = 'main';
let modal: 'help' | 'reset' | 'log' | 'skill' | 'encounter' | 'respec' | 'passives' | 'world' | 'collection' | null = null;
let recentFind:number|null = null, selectedFind = 0;
let pendingEncounter = 0, pendingBoss = false;
let busy = false, saved = true;
let lastTurn: TurnResult | null = null;
let effectTimer: ReturnType<typeof setTimeout>;
let returnFocusKey: string | undefined;
const esc = (value: string) => value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const disabled = (condition: boolean) => condition ? 'disabled' : '';
function persist() { try { saved = saveGame(game, localStorage); } catch { saved = false; } }
function meter(value: number, max: number, name: string, type = 'hp'): string {
  return `<div class="meter ${type}" role="progressbar" aria-label="${name}" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="${max}"><i style="width:${Math.max(0, Math.min(100, value / max * 100))}%"></i></div>`;
}
function resourcesHtml(): string {
  const g = game, d = derived(g);
  if(world.id==='academy' && g.phase!=='battle')return '';
  return `<section class="resources" aria-label="プレイヤーの状態"><div class="vitals"><div><p><b data-world-authored>${world.hp}</b><strong>${g.hp}<span> / ${d.maxHp}</span></strong></p>${meter(g.hp, d.maxHp, 'プレイヤーのHP')}</div><div><p><b data-world-authored>${world.sp}</b><strong>${g.sp}<span> / ${d.maxSp}</span></strong></p>${meter(g.sp, d.maxSp, 'プレイヤーのSP', 'sp')}</div></div><div class="wallet"><span><i>${world.collection?gameIcon('coin'):'◈'}</i> <strong>${g.gold.toLocaleString()}</strong> ${authored(world.money)}</span><span><i>${world.collection?gameIcon('xp'):'✦'}</i> <strong>${g.xp.toLocaleString()}</strong> ${authored(world.xp)}</span><span class="save-state ${saved ? '' : 'save-error'}">${saved ? '● 保存済み' : '！保存できません'}</span></div></section>`;
}
function render(): void {
  const oldPane = app.querySelector<HTMLElement>('.scroll-pane');
  const scroll = oldPane?.dataset.screen === screen ? oldPane.scrollTop : 0;
  const focused = document.activeElement instanceof HTMLElement ? document.activeElement.dataset.focus : undefined;
  document.documentElement.dataset.skin = world.id;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',world.themeColor);
  document.title = world.title + ' · INKBOUND';
  app.innerHTML = `<div class="app-shell ${world.id==='academy'?'school-shell':''} ${game.phase === 'battle' ? 'is-battle' : ''} ${game.phase==='battle'&&battleMenu!=='main'?'choosing-command':''}">${world.id==='academy'?schoolHeader(game,world,saved):`<header class="app-header"><span class="brand" data-world-authored><b>${world.emblem}</b><span><small>INKBOUND</small>${world.title}</span></span><span class="rank" data-world-authored>${world.rank} ${rank(game)}</span><button class="world-switch" data-do="world" data-focus="world" aria-label="世界観を選ぶ"><span aria-hidden="true">◐</span><small>世界観</small></button><button class="icon-button" data-do="help" data-focus="help" aria-label="遊び方">?</button></header>`}${resourcesHtml()}<main class="screen" id="main-screen">${game.phase === 'battle' ? battleHtml() : screen === 'map' ? mapHtml() : screen === 'stats' ? statsHtml() : screen === 'skills' ? skillsHtml() : shopHtml()}</main>${navigationHtml()}</div>${modal ? dialogHtml() : ''}`;
  presentWorld(app, world);
  const pane = app.querySelector<HTMLElement>('.scroll-pane');
  if (pane) pane.scrollTop = scroll;
  if (modal) {
    const dialog = app.querySelector<HTMLDialogElement>('dialog')!;
    dialog.showModal();
    dialog.addEventListener('cancel', event => { event.preventDefault(); closeModal(); });
    dialog.addEventListener('click', event => { if (event.target === dialog) closeModal(); });
  } else if (focused) app.querySelector<HTMLElement>(`[data-focus="${focused}"]`)?.focus({ preventScroll: true });
}
function navigationHtml(): string {
  if(world.id==='academy')return schoolNavigation(screen,game.phase==='battle');
  return `<nav data-world-authored class="bottom-nav" aria-label="メインメニュー">${([['map', '⌖', world.map], ['stats', '↑', world.stats], ['skills', '✦', world.skills], ['shop', '▣', world.shop]] as const).map(([id, symbol, name]) => `<button data-screen="${id}" data-focus="tab-${id}" ${disabled(game.phase === 'battle')} ${screen === id ? 'aria-current="page"' : ''}><span aria-hidden="true">${world.collection?gameIcon(id,true):symbol}</span>${name}</button>`).join('')}</nav>`;
}
function mapHtml(): string {
  if(world.id==='academy')return schoolMap(game,world,recentFind);
  if(Boolean(world.collection))return atlasHtml();
  const g = game, s = STAGES[g.stage], won = g.phase === 'clear' || g.phase === 'complete';
  const message = g.phase === 'complete' ? world.complete : g.phase === 'clear' ? world.clear : g.phase === 'defeat' ? world.defeat : g.phase === 'victory' ? world.victory : g.kills >= 3 ? world.bosses[g.stage] + 'に挑む' : world.opening;
  const detail = won ? (g.phase === 'complete' ? world.ending : world.id==='neon'?'次区画への回線が開通した。':world.id==='dojo'?'次の道場への挑戦が認められた。':world.id==='library'?'次の書架から、まだ不揃いな言葉が聞こえる。':'この先の街道を調査できる。') : world.recovery;
  return `<section class="map-screen"><div class="screen-heading"><div><span class="eyebrow" data-world-authored>${world.chapter} 0${g.stage + 1} / 0${STAGES.length}</span><h1 data-world-authored>${world.places[g.stage]}</h1></div><span class="progress-badge">${won ? 'クリア' : `${g.kills} / 3 戦`}</span></div><p class="scene-caption" data-world-authored>${world.scenes[g.stage]}</p><div class="map-field" style="--stage-color:${s.color}">${worldScenery(world,g.stage,g.kills)}${world.collection?`<div class="map-companion">${character()}</div>`:''}<svg class="map-path" viewBox="0 0 400 460" preserveAspectRatio="none" aria-hidden="true"><path class="map-route-wide" d="${world.id==='neon'?'M80 359V165H288V299H296V101':world.id==='dojo'?'M76 340L184 225L308 340L224 83':'M92 340Q20 260 96 184T268 276Q365 230 296 97'}"/>${world.id==='dojo'?'<path class="map-route-compact" d="M76 340L96 129L308 340L304 106"/>':''}<path class="map-route-landscape" d="M72 331L164 184L252 156L336 124"/></svg>${[0, 1, 2].map(i => `<button class="map-node node-${i} ${g.kills > i ? 'beaten' : g.kills === i && !won ? 'next' : ''}" data-encounter="${i}" ${disabled(won || g.kills < i)} aria-label="通常戦${i + 1}：${s.enemies[i]}${g.kills > i ? '（再戦）' : ''}"><span>${g.kills > i ? '✓' : world.collection?findArt(world.collection.entries[g.stage*4+i].icon,g.stage*4+i):'⚔'}</span><b>通常戦 ${i + 1}</b><small>${g.kills > i ? '再戦' : g.kills === i ? '挑戦可能' : '未解放'}</small></button>`).join('')}<button class="map-node boss-node ${g.kills >= 3 && !won ? 'next' : ''}" data-do="boss" ${disabled(won || g.kills < 3)} aria-label="ボス：${s.boss}"><span>${world.collection?findArt(world.collection.entries[g.stage*4+3].icon,g.stage*4+3):'♛'}</span><b>${s.boss}</b><small>${won ? '撃破済み' : g.kills >= 3 ? '挑戦可能' : '3地点クリアで解放'}</small></button></div><div class="map-footer"><div class="result-message" role="status"><strong data-world-authored>${message}</strong>${recentFind!==null&&world.collection?`<button class="new-find" data-do="collection" data-world-authored>${findArt(world.collection.entries[recentFind].icon,recentFind)}<span><small>${world.collection.verb}</small><strong>${world.collection.entries[recentFind].name}</strong></span><b>開く ↗</b></button>`:`<span data-world-authored>${detail}</span>`}</div>${g.phase === 'clear' ? `<button class="primary wide" data-do="next" data-world-authored>${world.next} →</button>` : g.phase === 'complete' ? '<button class="primary wide" data-do="reset">最初から始める</button>' : `<div class="map-summary"><button class="text-button" data-do="log">ログ <b>↗</b></button>${world.collection?`<button class="collection-link" data-do="collection" data-world-authored>${world.collection.name} <b>${collectionCount(g)} / 16</b> ↗</button>`:`<span data-world-authored>${world.id==='neon'?'停止':world.id==='dojo'?'勝ち抜き':'討伐'}：${g.totalKills}${world.id==='neon'?'機':world.id==='dojo'?'':'体'}</span>`}</div>`}${won&&world.collection?`<button class="collection-link wide" data-do="collection" data-world-authored>${world.collection.name} ${collectionCount(g)} / 16 ↗</button>`:''}</div></section>`;
}

function atlasHtml():string {
 const g=game,won=g.phase==='clear'||g.phase==='complete',kind=world.id==='library'?'library':'academy';
 const places=kind==='library'?['閲覧机','書架','目録棚','禁書の台']:['中庭の門','噴水','硝子の温室','鐘楼'];
 const message=g.phase==='complete'?world.complete:g.phase==='clear'?world.clear:g.phase==='defeat'?world.defeat:g.phase==='victory'?world.victory:world.opening;
 return `<section class="atlas-screen"><header class="atlas-heading"><div class="chapter-crest" aria-hidden="true">${gameIcon(kind==='academy'?'sp':'skills',true)}<b>0${g.stage+1}</b></div><div><span class="eyebrow" data-world-authored>${world.chapter} / 0${STAGES.length}</span><h1 data-world-authored>${world.places[g.stage]}</h1></div><span class="atlas-progress">${won?'CLEAR':g.kills+' / 3'}</span></header><div class="atlas-map">${worldScenery(world,g.stage,g.kills)}<svg class="atlas-path" viewBox="0 0 360 400" preserveAspectRatio="none" aria-hidden="true"><path class="atlas-route-normal" d="M80 290C160 320 265 220 230 210S85 175 125 130 285 90 285 65"/><path class="atlas-route-compact" d="M100 288Q180 330 252 288Q285 210 100 100Q190 65 270 100"/></svg><div class="atlas-companion">${character()}</div>${[0,1,2].map(i=>`<button class="atlas-location location-${i} ${g.kills===i&&!won?'available':''} ${g.kills>i?'visited':''}" data-encounter="${i}" ${disabled(won||g.kills<i)} aria-label="${places[(g.stage+i)%4]}：${STAGES[g.stage].enemies[i]}"><span class="location-picture">${locationArt(kind,g.stage,i)}</span><b data-world-authored>${places[(g.stage+i)%4]}</b><small>${g.kills>i?'再訪':g.kills===i?'探索':'未到達'}</small><i class="location-number">0${i+1}</i></button>`).join('')}<button class="atlas-location location-boss ${g.kills>=3&&!won?'available':''}" data-do="boss" ${disabled(won||g.kills<3)} aria-label="${world.bosses[g.stage]}"><span class="boss-crown">${gameIcon(g.kills>=3?'crown':'lock')}</span><span class="location-picture">${locationArt(kind,g.stage,3)}</span><b data-world-authored>${world.bosses[g.stage]}</b><small>${won?'踏破':g.kills>=3?'挑戦':'3地点を探索'}</small></button><aside class="map-caption" data-world-authored>${world.scenes[g.stage]}</aside></div><div class="atlas-message">${panelFlourish()}<strong data-world-authored>${message}</strong>${recentFind!==null?`<button class="atlas-find" data-do="collection" data-world-authored>${findArt(world.collection!.entries[recentFind].icon,recentFind)}<span>${world.collection!.entries[recentFind].name}</span><b>入手 ↗</b></button>`:`<p data-world-authored>${world.recovery}</p>`}</div><div class="atlas-actions">${g.phase==='clear'?`<button data-do="next" class="atlas-next" data-world-authored>${gameIcon('run')}${world.next}</button>`:`<button data-do="log">${gameIcon('log')}<span>ログ</span></button>`}<button data-do="collection" data-world-authored>${gameIcon('album')}<span>${world.collection!.name}<small>${collectionCount(g)} / 16</small></span></button></div>${g.phase==='complete'?'<button class="text-button" data-do="reset">最初から始める</button>':''}</section>`;
}

function battleHtml(): string {
  const g = game, e = g.enemy!;
  const lines = g.log.slice(0, 2).reverse();
  return `<section class="battle-screen"><div class="battle-heading"><span class="eyebrow">${g.enemies.some(f => f.boss) ? 'ボス戦' : '攻撃対象を選択'}</span><button class="text-button" data-do="passives">常時効果 ${g.learned.filter(id=>skill(id).kind==='passive').length}</button><button class="text-button" data-do="log">ログ <span>↗</span></button></div><div class="enemy-targets">${g.enemies.map((f, i) => `<button data-target="${i}" aria-pressed="${g.target === i}" ${disabled(f.hp <= 0 || busy)}><strong>${f.name}</strong><span>${world.id==='library'?'ノイズ ':''}${f.hp} / ${f.maxHp}</span>${meter(f.hp, f.maxHp, f.name + 'のHP', 'enemy-hp')}</button>`).join('')}</div><div class="combat-field" style="--stage-color:${STAGES[g.stage].color}">${worldScenery(world,g.stage)}<div class="fighter player ${busy && lastTurn?.playerDamage ? 'swing' : ''}">${character()}<div class="damage">${busy && lastTurn ? lastTurn.healed ? `+${lastTurn.healed}` : lastTurn.enemyDamage ? `−${lastTurn.enemyDamage}` : lastTurn.dodged ? '回避' : '' : ''}</div></div><div class="foe-group">${g.enemies.map((f, i) => `<div class="foe-figure ${f.hp <= 0 ? 'fallen' : ''} ${i === g.target ? 'selected' : ''}">${character(true, f.boss, f.kind, f.id)}</div>`).join('')}</div><div class="battle-intent">${enemyHint(e)}</div></div><div class="battle-effects">${statusLabels(g.effects).map(t => `<span>${t}</span>`).join('')}${g.barrier ? `<span>防壁${g.barrier}</span>` : ''}${g.stored ? `<span>蓄勢${g.stored}</span>` : ''}${g.readyCrit ? '<span>必中会心</span>' : ''}${g.followReady ? '<span>残心</span>' : ''}<span class="target-status">敵：DEF${enemyStats(e).def} AGI${enemyStats(e).agi} ${statusLabels(e.effects).join(' ')}</span></div><div class="turn-log" role="log" aria-live="polite">${lines.map(l => `<p>${esc(l)}</p>`).join('')}</div><section class="command-panel" aria-label="戦闘コマンド">${commandsHtml()}</section></section>`;
}
function commandsHtml(): string {
  const g = game;
  if (battleMenu === 'skills') return `<div class="command-title"><button class="back-button" data-battle-menu="main">← 戻る</button><strong>スキルを選ぶ</strong></div><div class="command-grid skill-commands">${g.slots.map((id, i) => {
    const s = id ? skill(id) : null;
    return `<button data-action="${i}" data-focus="skill-${i}" ${disabled(busy || !!skillBlockReason(g,i))}><strong>${s ? `${world.collection?gameIcon(s.id):s.symbol} ${s.name}` : '未セット'}</strong>${s ? `<span class="skill-summary">${s.summary}</span>` : ''}<small>${!s ? '戦闘前にセット' : skillBlockReason(g,i) || (s.id === 'bloodcast' ? 'HP12／再使用1T' : `SP${skillCost(g,s)}／再使用${s.cd}T`)}</small></button>`;
  }).join('')}</div>`;
  if (battleMenu === 'items') return `<div class="command-title"><button class="back-button" data-battle-menu="main">← 戻る</button><strong>アイテムを使う</strong></div><div class="consumable-commands">${([['potion', 'ポーション', g.potions, '最大HPの50%回復'], ['ether', 'エーテル', g.ethers, '最大SPの50%回復'], ['remedy', '治療薬', g.remedies, '毒・SP消費増加を解除']] as const).map(([id, name, count, text]) => `<button data-action="${id}" ${disabled(busy || count === 0)}><strong>${name} ×${count}</strong><small>${text}</small></button>`).join('')}</div>`;
  return `<div class="command-grid"><button class="primary" data-action="attack" data-focus="attack" ${disabled(busy)}><span class="command-icon">${world.collection?gameIcon('atk',true):swordIcon}</span>攻撃</button><button data-battle-menu="skills" ${disabled(busy)}><span class="command-symbol">${world.collection?gameIcon('skills',true):'✦'}</span>スキル</button><button data-battle-menu="items" ${disabled(busy)}><span class="command-symbol">${world.collection?gameIcon('item',true):'♧'}</span>アイテム</button><button data-action="run" data-focus="run" ${disabled(busy)}><span class="command-symbol">${world.collection?gameIcon('run',true):'↗'}</span>逃げる</button></div>`;
}
function statsHtml(): string {
  const g = game, d = derived(g);
  return `<section class="scroll-pane" data-screen="stats"><div class="page-heading"><span class="eyebrow" data-world-authored>${world.statsEyebrow??(world.id==='neon'?'CHASSIS / TUNING':world.id==='dojo'?'身を鍛える':'野営地の訓練')}</span><h1 data-world-authored>${world.stats}</h1><p>能力強化とスキル習得には同じXPを使います。</p></div><div class="stat-list">${([['hp', 'HP', '体力', '最大HP +14'], ['sp', 'SP', '精神力', '最大SP＋6、魔法威力上昇'], ['atk', 'ATK', '攻撃力', '攻撃力 +3'], ['def', 'DEF', '防御力', '防御力 +2'], ['agi', 'AGI', '素早さ', '命中率・回避率・会心率が上がる']] as const).map(([key, code, label, desc]) => `<div class="stat-row"><span class="stat-code">${world.collection?gameIcon(key,true):code}</span><div><h2>${label}<small>強化：${g.stats[key]}回</small></h2><p>${desc}</p></div><button data-stat="${key}" data-focus="stat-${key}" ${disabled(g.xp < statCost(g, key))} aria-label="${label}を${statCost(g, key)}XPで強化">＋ <span>${statCost(g, key)} XP</span></button></div>`).join('')}</div><div class="derived"><span>攻撃 <b>${d.atk}</b></span><span>防御 <b>${d.def}</b></span><span>会心 <b>${Math.round(d.crit * 100)}%</b></span><span>AGI <b>${d.agi}</b></span></div><h2 class="section-label">装備中</h2><div class="equipment-card"><span class="equipment-icon">${gearIcon('weapon',g.weapon)}</span><div><small>武器</small><strong>${item(g.weapon).name}</strong><small>${item(g.weapon).description}</small></div></div><div class="equipment-card"><span class="equipment-icon">${gearIcon('armor',g.armor)}</span><div><small>防具</small><strong>${item(g.armor).name}</strong><small>${item(g.armor).description}</small></div></div><button class="text-button" data-do="respec">能力とスキルを振り直す</button></section>`;
}
function skillsHtml():string{
 const g=game,job=JOBS.find(j=>j.id===branch)!;
 const passives=g.learned.filter(id=>skill(id).kind==='passive');
 const loadout=`<div class="loadout"><h2>使用するスキル</h2><div>${g.slots.map((id,i)=>`<label><span>枠 ${i+1}</span><select data-slot="${i}" data-focus="slot-${i}" aria-label="スキルスロット${i+1}"><option value="">未セット</option>${g.learned.filter(k=>skill(k).kind!=='passive').map(k=>`<option value="${k}" ${k===id?'selected':''}>${skill(k).name}</option>`).join('')}</select><span class="loadout-summary">${id?skill(id).summary:'スキルを選択'}</span></label>`).join('')}</div><p>同じ技を複数の枠にセットできます。待ち時間は枠ごとに数えます。1Tなら、別の行動を1回挟むと再使用できます。</p></div><section class="passive-list"><h2>有効な常時効果 <small>${passives.length}</small></h2>${passives.length?passives.map(id=>`<button data-skill="${id}"><strong>◉ ${skill(id).name}</strong><span>${skill(id).summary}</span></button>`).join(''):'<p>常時効果は習得すると有効になります。スキル枠へのセットは不要です。</p>'}</section>`;
 const nodes=SKILLS.filter(s=>s.branch===branch);
 const links=nodes.flatMap(s=>s.requires.map(id=>({parent:nodes.find(p=>p.id===id),child:s}))).filter(l=>l.parent);
 const tree=`<div class="segmented job-tabs" role="group" aria-label="スキル系統">${JOBS.map((j,i)=>`<button data-world-authored data-branch="${j.id}" aria-pressed="${branch===j.id}">${world.jobs[i]}</button>`).join('')}</div><div class="job-heading"><h2 data-world-authored>${world.jobs[JOBS.indexOf(job)]}</h2><p data-world-authored>${world.jobIntros[JOBS.indexOf(job)]}</p><small>複数の系統から習得できます。タップで詳細を表示。</small></div><div class="job-tree"><svg class="job-links" viewBox="0 0 100 400" preserveAspectRatio="none" aria-hidden="true">${links.map(({parent:p,child:s})=>`<path d="M${p!.column*50+25} ${p!.tier*100+50} V${s.tier*100+12} H${s.column*50+25} V${s.tier*100+50}"/>`).join('')}</svg>${nodes.map(s=>{
   const owned=g.learned.includes(s.id),ready=s.requires.every(p=>g.learned.includes(p))&&meetsStats(g,s);
   return `<button class="job-node ${owned?'learned':!ready?'locked':''}" style="grid-row:${s.tier+1};grid-column:${s.column+1}" data-skill="${s.id}" data-focus="node-${s.id}" aria-label="${s.name}：${s.summary}。詳細を開く"><small class="node-kind ${s.kind}">${s.kind==='passive'?'◉ 常時効果':s.kind==='variant'?'◆ 派生技':'✦ 技'}</small>${world.collection?`<span class="skill-art">${gameIcon(s.id,true)}</span>`:''}<strong>${s.name}</strong><span class="node-effect">${s.summary}</span><small>${owned?'✓ 習得済み':!meetsStats(g,s)?Object.entries(s.statRequirements??{}).map(([k,n])=>k.toUpperCase()+' '+n+'以上').join(' / '):!ready?'前提スキルが必要':`${s.cost} XP`}</small><small class="node-parent">${s.requires.length?'← '+s.requires.map(p=>skill(p).name).join('・'):'前提スキルなし'}</small></button>`;
 }).join('')}</div>`;
 return `<section class="scroll-pane skills-pane" data-screen="skills"><div class="page-heading compact-heading"><h1>${authored(world.skills)} <small>${g.learned.length}/${SKILLS.length}</small></h1><div class="skill-mode" role="group" aria-label="スキル画面"><button data-skill-view="tree" aria-pressed="${skillView==='tree'}">ツリー</button><button data-skill-view="loadout" aria-pressed="${skillView==='loadout'}">編成</button></div></div>${skillView==='tree'?tree:loadout}</section>`;
}
function shopHtml(): string {
  const g = game;
  return `<section class="scroll-pane" data-screen="shop"><div class="page-heading"><span class="eyebrow" data-world-authored>${world.shopEyebrow??(world.id==='neon'?'DOCK / SUPPLY':world.id==='dojo'?'刀と胴、薬の商い':'街道の商人')}</span><h1 data-world-authored>${world.shop}</h1><p>購入すると自動で装備します。購入済みの装備は付け替えられます。</p></div><div class="segmented" role="group" aria-label="商品カテゴリ">${([['weapon', '武器'], ['armor', '防具'], ['items', 'アイテム']] as const).map(([id, name]) => `<button data-category="${id}" aria-pressed="${shopCategory === id}">${name}</button>`).join('')}</div><div class="product-list">${shopCategory === 'items' ? ([['potion', 'ポーション', '最大HPの50%回復', 10, g.potions], ['ether', 'エーテル', '最大SPの50%回復', 15, g.ethers], ['remedy', '治療薬', '毒・SP消費増加を解除', 12, g.remedies]] as const).map(([id, name, desc, cost, count]) => `<article class="product-card">${world.collection?`<span class="product-icon">${gameIcon(id==='potion'?'heal':id==='ether'?'sp':'item',true)}</span>`:''}<div><h2>${name}</h2><p>${desc}</p><small>所持 ${count} / 9 ・ 使用時に1ターン消費</small></div><button data-buy="${id}" ${disabled(g.gold < cost || count >= 9)}>${cost} G</button></article>`).join('') : ITEMS.filter(i => i.slot === shopCategory).map(i => {
    const equipped = g[i.slot] === i.id, owned = g.owned.includes(i.id);
    return `<article class="product-card"><span class="product-icon">${gearIcon(i.slot,i.id)}</span><div><h2>${i.name}</h2><p>${i.description}</p><small>${equipped ? '装備中' : owned ? '所持中' : '購入すると装備'}</small></div><button ${owned ? 'data-equip' : 'data-buy'}="${i.id}" ${disabled(equipped || !owned && g.gold < i.cost)}>${equipped ? '装備中' : owned ? '装備' : `${i.cost} G`}</button></article>`;
  }).join('')}</div><p class="page-note">回復・治療アイテムは戦闘中に使用します。</p></section>`;
}
function dialogHtml(): string {
  const close = '<button class="icon-button" data-do="close" aria-label="閉じる">×</button>';
  if(modal==='world') return `<dialog class="world-dialog" aria-labelledby="dialog-heading" data-world-authored><div class="dialog-heading"><div><span class="eyebrow">INKBOUND / WORLDS</span><h2 id="dialog-heading">世界観を選ぶ</h2></div>${close}</div><p class="world-intro">同じ冒険を、異なる世界で。進行はそのまま引き継ぎます。</p><div class="world-choices">${[...SKINS.filter(s=>s.collection),...SKINS.filter(s=>!s.collection)].map(s=>`<button class="world-card preview-${s.id}" data-world="${s.id}" aria-pressed="${world.id===s.id}"><span class="world-preview" aria-hidden="true"><i>${s.emblem}</i><b>${s.places[0]}</b><span>○ ┄ ○ ┄ ◆</span></span><span class="world-card-copy"><small>${world.id===s.id?'● 選択中':s.selectorLabel??(s.id==='journal'?'01 / 旅と手帳':s.id==='neon'?'02 / 機械と地下都市':'03 / 和紙と武者修行')}</small><strong>${s.title}</strong><span>${s.pitch}</span></span></button>`).join('')}</div><p class="page-note">${world.premise}</p></dialog>`;
  if(modal==='collection') return collectionHtml(close);
  if(modal==='passives')return `<dialog aria-labelledby="dialog-heading"><div class="dialog-heading"><h2 id="dialog-heading">有効な常時効果</h2>${close}</div><div class="full-log">${game.learned.filter(id=>skill(id).kind==='passive').map(id=>`<p><strong>${skill(id).name}</strong><br>${skill(id).effect}</p>`).join('')||'<p>常時効果はまだ習得していません。</p>'}</div></dialog>`;
  if (modal === 'encounter') return `<dialog aria-labelledby="dialog-heading"><div class="dialog-heading"><h2 id="dialog-heading">敵の情報</h2>${close}</div>${encounterPreview(game.stage, pendingEncounter, pendingBoss).map(e => `<article class="enemy-preview"><h3>${e.name}</h3><p>HP ${e.maxHp} / ATK ${e.atk} / DEF ${e.def} / AGI ${e.agi}</p><p>${enemyHint(e)}</p></article>`).join('')}<p class="page-note">敵をすべて倒すと勝利です。戦闘中は敵の名前をタップして攻撃対象を選びます。</p><button class="primary wide" data-do="confirm-battle">戦闘開始</button><button class="text-button wide" data-do="close">マップに戻る</button></dialog>`;
  if (modal === 'respec') return `<dialog aria-labelledby="dialog-heading"><div class="dialog-heading"><h2 id="dialog-heading">育成の振り直し</h2>${close}</div><p>能力強化とスキル習得に使ったXPがすべて戻ります。ステージの進行、所持金、装備は変わりません。</p><button class="primary wide" data-do="confirm-respec">振り直す</button></dialog>`;
  if(modal==='skill'){
 const s=skill(selectedSkill),owned=game.learned.includes(s.id),ready=s.requires.every(id=>game.learned.includes(id))&&meetsStats(game,s);
 const thresholds=Object.entries(s.statRequirements??{});
 return `<dialog aria-labelledby="dialog-heading"><div class="dialog-heading"><h2 id="dialog-heading">${world.collection?gameIcon(s.id,true):s.symbol} ${s.name}</h2>${close}</div><p class="skill-type-label">${s.kind==='passive'?'常時効果：習得すると自動で有効になります。':s.kind==='variant'?'派生技：元の技と一緒にセットできます。':'使用スキル：4つのスキル枠にセットして使います。'}</p>${world.skillNotes?.[s.id]?`<p class="skill-story" data-world-authored>${world.skillNotes[s.id]}</p>`:''}<p>${s.effect}</p><div class="skill-detail-meta">${s.kind!=='passive'?`<span>${s.id==='bloodcast'?'消費HP <b>12</b>':`消費SP <b>${s.sp}</b>`}</span><span>再使用まで <b>${s.cd}ターン</b></span>`:''}<span>習得 <b>${s.cost} XP</b></span></div><div class="skill-requirements"><p>${s.requires.length?'前提：'+s.requires.map(id=>`${skill(id).name}（${game.learned.includes(id)?'習得済み':'未習得'}）`).join('・'):'前提スキルなし'}</p>${thresholds.length?`<p>能力条件（装備補正を除く）：</p>${thresholds.map(([k,n])=>`<p class="${baseStats(game)[k as Stat]>=n?'requirement-met':'requirement-missing'}">${k.toUpperCase()} ${n}以上（現在 ${baseStats(game)[k as Stat]}）</p>`).join('')}`:''}</div><button class="primary wide" data-learn="${s.id}" ${disabled(!canLearn(game,s.id))}>${owned?'習得済み ✓':!ready?'習得条件を満たしていません':game.xp<s.cost?'XPが足りません':`${s.cost} XPで習得する`}</button></dialog>`;
 }
  const heading = modal === 'help' ? '遊び方' : modal === 'log' ? 'ログ' : 'データを削除しますか？';
  const body = modal === 'help' ? `<ol class="help-list" data-world-authored>${worldGuide(world).map(([title,body])=>`<li><h3>${title}</h3><p>${body}</p></li>`).join('')}</ol><p class="page-note">キーボード操作：攻撃A、逃走R、ポーションH、スキル1〜4。進行状況はこのブラウザに自動保存されます。</p><button class="danger-link" data-do="reset">セーブデータを削除する</button>` : modal === 'log' ? `<div class="full-log">${game.log.map(l => `<p>${esc(l)}</p>`).join('')}</div>` : '<p>進行状況、能力、スキル、所持品のデータを削除します。</p><div class="dialog-actions"><button data-do="close" autofocus>キャンセル</button><button class="danger-button" data-do="confirm-reset">削除して始める</button></div>';
  return `<dialog aria-labelledby="dialog-heading"><div class="dialog-heading"><h2 id="dialog-heading">${heading}</h2>${close}</div>${body}</dialog>`;
}

function collectionHtml(close:string):string {
  const album=world.collection!,count=collectionCount(game),entry=count?album.entries[Math.min(selectedFind,count-1)]:null;
  return `<dialog class="collection-dialog" aria-labelledby="dialog-heading" data-world-authored><div class="dialog-heading"><div><span class="eyebrow">${world.id==='academy'?'放課後のたからもの':'RECOVERED / ORIGINAL VOICES'}</span><h2 id="dialog-heading">${album.name} <small>${count} / 16</small></h2></div>${close}</div><p class="album-intro">${world.id==='academy'?'初めて騒ぎを片づけると、お菓子や魔導書が見つかるよ。':'初めて改変箇所を突破すると、原文の一節が戻る。復元した本文をここで読める。'}</p>${entry?`<article class="find-detail">${findArt(entry.icon,selectedFind)}<div><small>${String(Math.min(selectedFind,count-1)+1).padStart(2,'0')} / ${world.places[Math.floor(Math.min(selectedFind,count-1)/4)]}</small><h3>${esc(entry.name)}</h3></div>${entry.before?`<div class="overwritten"><small>AIによる上書き</small><p>${esc(entry.before)}</p></div>`:''}<blockquote><small>${world.id==='academy'?'おみやげのメモ':'取り戻した本文'}</small><p>${esc(entry.detail)}</p></blockquote></article>`:''}<div class="album-grid">${album.entries.map((e,i)=>i<count?`<button data-find="${i}" aria-pressed="${i===Math.min(selectedFind,count-1)}">${findArt(e.icon,i)}<small>${String(i+1).padStart(2,'0')}</small><span>${esc(e.name)}</span></button>`:`<div class="unknown-find"><b>?</b><small>${String(i+1).padStart(2,'0')}</small><span>${world.id==='academy'?'まだひみつ':'未復元'}</span></div>`).join('')}</div><p class="page-note">${world.id==='academy'?'おみやげは一か所につき一つ。集めたお菓子は、ここでいつでも眺められる。':'一箇所につき一冊を復元。同じ箇所を再読しても、目録は重複しない。'}</p></dialog>`;
}

function openModal(kind: typeof modal): void { returnFocusKey = (document.activeElement as HTMLElement)?.dataset.focus; modal = kind; render(); }
function closeModal(): void { modal = null; render(); if (returnFocusKey) app.querySelector<HTMLElement>(`[data-focus="${returnFocusKey}"]`)?.focus({ preventScroll: true }); }
function handleAction(action: Action): void {
  if (busy) return;
  const previousFinds=collectionCount(game);
  const result = act(game, action);
  if (!result) return;
  if(collectionCount(game)>previousFinds)recentFind=collectionCount(game)-1;
  lastTurn = result; busy = true; persist(); render();
  clearTimeout(effectTimer);
  effectTimer = setTimeout(() => { busy = false; lastTurn = null; render(); }, 220);
}
app.addEventListener('click', event => {
  const button = (event.target as Element).closest<HTMLButtonElement>('button');
  if (!button || button.disabled) return;
  if(button.dataset.find!==undefined){selectedFind=Number(button.dataset.find);render();return;}
  if (button.dataset.world) {
    world = getSkin(button.dataset.world); try { rememberSkin(world,localStorage); } catch { /* Storage can be unavailable in an embedded browser. */ }
    try { const url=new URL(location.href);url.searchParams.set('world',world.id);history.replaceState(null,'',url); } catch { /* Embedded file views may restrict URL changes. */ }
    modal = null; render(); app.querySelector<HTMLElement>('[data-do="world"]')?.focus({preventScroll:true}); return;
  }
  if (button.dataset.screen) { screen = button.dataset.screen as Screen; render(); return; }
  if (button.dataset.branch) { branch = button.dataset.branch as typeof branch; render(); return; }
  if (button.dataset.skillView) { skillView = button.dataset.skillView as typeof skillView; render(); return; }
  if (button.dataset.skill) { selectedSkill = button.dataset.skill; openModal('skill'); return; }
  if (button.dataset.category) { shopCategory = button.dataset.category as typeof shopCategory; render(); return; }
  if (button.dataset.battleMenu) { battleMenu = button.dataset.battleMenu as BattleMenu; render(); return; }
  if (button.dataset.action !== undefined) { const a = button.dataset.action; handleAction(/^\d$/.test(a) ? Number(a) : a as Action); return; }
  if (button.dataset.target !== undefined) { selectTarget(game, Number(button.dataset.target)); render(); return; }
  if (button.dataset.equip) equip(game, button.dataset.equip);
  if (button.dataset.stat) allocate(game, button.dataset.stat as Stat);
  if (button.dataset.learn) learn(game, button.dataset.learn);
  if (button.dataset.buy) buy(game, button.dataset.buy);
  if (button.dataset.encounter !== undefined) { pendingEncounter = Number(button.dataset.encounter); pendingBoss = false; openModal('encounter'); return; }
  switch (button.dataset.do) {
    case 'collection': selectedFind=recentFind??Math.max(0,collectionCount(game)-1);openModal('collection'); return;
    case 'world': openModal('world'); return;
    case 'help': openModal('help'); return;
    case 'log': openModal('log'); return;
    case 'passives': openModal('passives'); return;
    case 'reset': openModal('reset'); return;
    case 'close': closeModal(); return;
    case 'confirm-reset': recentFind=null;game = newGame(); screen = 'map'; modal = null; busy = false; clearTimeout(effectTimer); break;
    case 'boss': pendingEncounter = 2; pendingBoss = true; openModal('encounter'); return;
    case 'confirm-battle': recentFind=null;startBattle(game, pendingBoss, pendingEncounter); battleMenu = 'main'; modal = null; break;
    case 'respec': openModal('respec'); return;
    case 'confirm-respec': respec(game); modal = null; break;
    case 'next': recentFind=null;nextStage(game); break;
  }
  persist(); render();
});
app.addEventListener('change', event => {
  const select = event.target as HTMLSelectElement;
  if (select.matches('select[data-slot]')) { equipSkill(game, Number(select.dataset.slot), select.value || null); persist(); render(); }
});
document.addEventListener('keydown', event => {
  if (modal || event.repeat || event.ctrlKey || event.metaKey || event.altKey || (event.target as Element)?.matches('input,textarea,select')) return;
  const action = ({ '1': 0, '2': 1, '3': 2, '4': 3, 'a': 'attack', 'r': 'run', 'h': 'potion' } as Record<string, Action>)[event.key.toLowerCase()];
  if (action !== undefined) { event.preventDefault(); handleAction(action); }
});
persist(); render();
