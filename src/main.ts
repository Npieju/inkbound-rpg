import { act, allocate, buy, derived, baseStats, canLearn, JOBS, meetsStats, skillBlockReason, skillCost, equip, encounterPreview, enemyHint, enemyStats, respec, selectTarget, statusLabels, equipSkill, item, ITEMS, learn, newGame, nextStage, rank, skill, SKILLS, statCost, STAGES, startBattle } from './game.ts';
import type { Action, EquipmentSlot, Job, Stat, TurnResult } from './game.ts';
import { loadGame, saveGame } from './save.ts';
import { fighter, scenery, swordIcon, shieldIcon } from './art.ts';

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
let modal: 'help' | 'reset' | 'log' | 'skill' | 'encounter' | 'respec' | 'passives' | null = null;
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
  return `<section class="resources" aria-label="冒険者の状態"><div class="vitals"><div><p><b>HP</b><strong>${g.hp}<span> / ${d.maxHp}</span></strong></p>${meter(g.hp, d.maxHp, '冒険者のHP')}</div><div><p><b>SP</b><strong>${g.sp}<span> / ${d.maxSp}</span></strong></p>${meter(g.sp, d.maxSp, '冒険者のSP', 'sp')}</div></div><div class="wallet"><span><i>◈</i> <strong>${g.gold.toLocaleString()}</strong> G</span><span><i>✦</i> <strong>${g.xp.toLocaleString()}</strong> XP</span><span class="save-state ${saved ? '' : 'save-error'}">${saved ? '● 保存済み' : '！保存不可'}</span></div></section>`;
}
function render(): void {
  const oldPane = app.querySelector<HTMLElement>('.scroll-pane');
  const scroll = oldPane?.dataset.screen === screen ? oldPane.scrollTop : 0;
  const focused = document.activeElement instanceof HTMLElement ? document.activeElement.dataset.focus : undefined;
  app.innerHTML = `<div class="app-shell ${game.phase === 'battle' ? 'is-battle' : ''}"><header class="app-header"><span class="brand"><b>i.</b> INKBOUND</span><span class="rank">RANK ${rank(game)}</span><button class="icon-button" data-do="help" data-focus="help" aria-label="遊び方">?</button></header>${resourcesHtml()}<main class="screen" id="main-screen">${game.phase === 'battle' ? battleHtml() : screen === 'map' ? mapHtml() : screen === 'stats' ? statsHtml() : screen === 'skills' ? skillsHtml() : shopHtml()}</main>${navigationHtml()}</div>${modal ? dialogHtml() : ''}`;
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
  return `<nav class="bottom-nav" aria-label="メインメニュー">${([['map', '⌖', 'マップ'], ['stats', '↑', '能力'], ['skills', '✦', 'スキル'], ['shop', '▣', '道具屋']] as const).map(([id, symbol, name]) => `<button data-screen="${id}" data-focus="tab-${id}" ${disabled(game.phase === 'battle')} ${screen === id ? 'aria-current="page"' : ''}><span aria-hidden="true">${symbol}</span>${name}</button>`).join('')}</nav>`;
}
function mapHtml(): string {
  const g = game, s = STAGES[g.stage], won = g.phase === 'clear' || g.phase === 'complete';
  const message = g.phase === 'complete' ? 'すべてのステージを制覇！' : g.phase === 'clear' ? 'ステージクリア！' : g.phase === 'defeat' ? '装備とスキルを見直して、再挑戦。' : g.phase === 'victory' ? '勝利！ XPとお金を獲得した。' : '赤い地点を選んで戦おう。';
  return `<section class="map-screen"><div class="screen-heading"><div><span class="eyebrow">STAGE ${g.stage + 1} / ${STAGES.length}</span><h1>${s.name}</h1></div><span class="progress-badge">${won ? 'CLEAR' : `${g.kills} / 3 戦`}</span></div><div class="map-field" style="--stage-color:${s.color}">${scenery(g.stage)}<svg class="map-path" viewBox="0 0 400 460" preserveAspectRatio="none" aria-hidden="true"><path d="M90 340Q20 260 90 215T265 270Q365 230 290 120"/></svg><span class="map-label">${won ? 'この地に、静けさが戻った。' : g.kills >= 3 ? 'ボスへの道が開いた。' : 'ひとつずつ、道をひらく。'}</span>${[0, 1, 2].map(i => `<button class="map-node node-${i} ${g.kills > i ? 'beaten' : g.kills === i && !won ? 'next' : ''}" data-encounter="${i}" ${disabled(won || g.kills < i)} aria-label="通常戦${i + 1}：${s.enemies[i]}${g.kills > i ? '（再戦）' : ''}"><span>${g.kills > i ? '✓' : '⚔'}</span><b>通常戦 ${i + 1}</b><small>${g.kills > i ? '再戦できる' : g.kills === i ? '挑戦する' : '未解放'}</small></button>`).join('')}<button class="map-node boss-node ${g.kills >= 3 && !won ? 'next' : ''}" data-do="boss" ${disabled(won || g.kills < 3)} aria-label="ボス：${s.boss}"><span>♛</span><b>${s.boss}</b><small>${won ? '討伐済み' : g.kills >= 3 ? 'ボスに挑む' : '通常戦3つで解放'}</small></button></div><div class="map-footer"><div class="result-message" role="status"><strong>${message}</strong><span>${won ? 'よく戦いました。次の冒険へ。' : '戦闘終了でHP・SPは全回復。'}</span></div>${g.phase === 'clear' ? '<button class="primary wide" data-do="next">次のステージへ →</button>' : g.phase === 'complete' ? '<button class="primary wide" data-do="reset">新しい冒険をはじめる</button>' : `<div class="map-summary"><button class="text-button" data-do="log">冒険の記録 <b>↗</b></button><span>${g.totalKills}体 討伐済み</span></div>`}</div></section>`;
}
function battleHtml(): string {
  const g = game, e = g.enemy!;
  const lines = g.log.slice(0, 2).reverse();
  return `<section class="battle-screen"><div class="battle-heading"><span class="eyebrow">${g.enemies.some(f => f.boss) ? 'BOSS BATTLE' : '攻撃対象を選択'}</span><button class="text-button" data-do="passives">常時 ${g.learned.filter(id=>skill(id).kind==='passive').length}</button><button class="text-button" data-do="log">記録 ↗</button></div><div class="enemy-targets">${g.enemies.map((f, i) => `<button data-target="${i}" aria-pressed="${g.target === i}" ${disabled(f.hp <= 0 || busy)}><strong>${f.name}</strong><span>${f.hp} / ${f.maxHp}</span>${meter(f.hp, f.maxHp, f.name + 'のHP', 'enemy-hp')}</button>`).join('')}</div><div class="combat-field" style="--stage-color:${STAGES[g.stage].color}">${scenery(g.stage)}<div class="fighter player ${busy && lastTurn?.playerDamage ? 'swing' : ''}">${fighter()}<div class="damage">${busy && lastTurn ? lastTurn.healed ? `+${lastTurn.healed}` : lastTurn.enemyDamage ? `−${lastTurn.enemyDamage}` : lastTurn.dodged ? '回避' : '' : ''}</div></div><div class="foe-group">${g.enemies.map((f, i) => `<div class="foe-figure ${f.hp <= 0 ? 'fallen' : ''} ${i === g.target ? 'selected' : ''}">${fighter(true, f.boss, f.kind)}</div>`).join('')}</div><div class="battle-intent">${enemyHint(e)}</div></div><div class="battle-effects">${statusLabels(g.effects).map(t => `<span>${t}</span>`).join('')}${g.barrier ? `<span>防壁${g.barrier}</span>` : ''}${g.stored ? `<span>蓄積${g.stored}</span>` : ''}${g.readyCrit ? '<span>必中会心</span>' : ''}${g.followReady ? '<span>残心</span>' : ''}<span class="target-status">敵：防${enemyStats(e).def} 速${enemyStats(e).agi} ${statusLabels(e.effects).join(' ')}</span></div><div class="turn-log" role="log" aria-live="polite">${lines.map(l => `<p>${esc(l)}</p>`).join('')}</div><section class="command-panel" aria-label="戦闘コマンド">${commandsHtml()}</section></section>`;
}
function commandsHtml(): string {
  const g = game;
  if (battleMenu === 'skills') return `<div class="command-title"><button class="back-button" data-battle-menu="main">← 戻る</button><strong>スキルを選ぶ</strong></div><div class="command-grid skill-commands">${g.slots.map((id, i) => {
    const s = id ? skill(id) : null;
    return `<button data-action="${i}" data-focus="skill-${i}" ${disabled(busy || !!skillBlockReason(g,i))}><strong>${s ? `${s.symbol} ${s.name}` : '未セット'}</strong>${s ? `<span class="skill-summary">${s.summary}</span>` : ''}<small>${!s ? '戦闘前にセット' : skillBlockReason(g,i) || (s.id === 'bloodcast' ? 'HP 12・待機 1' : `SP ${skillCost(g,s)}・待機 ${s.cd}`)}</small></button>`;
  }).join('')}</div>`;
  if (battleMenu === 'items') return `<div class="command-title"><button class="back-button" data-battle-menu="main">← 戻る</button><strong>アイテム / 各1ターン</strong></div><div class="consumable-commands">${([['potion', 'ポーション', g.potions, 'HP 50%回復'], ['ether', 'エーテル', g.ethers, 'SP 50%回復'], ['remedy', '治療薬', g.remedies, '毒・術乱を解除']] as const).map(([id, name, count, text]) => `<button data-action="${id}" ${disabled(busy || count === 0)}><strong>${name} ×${count}</strong><small>${text}</small></button>`).join('')}</div>`;
  return `<div class="command-grid"><button class="primary" data-action="attack" data-focus="attack" ${disabled(busy)}><span class="command-icon">${swordIcon}</span>攻撃</button><button data-battle-menu="skills" ${disabled(busy)}><span class="command-symbol">✦</span>スキル</button><button data-battle-menu="items" ${disabled(busy)}><span class="command-symbol">♧</span>アイテム</button><button data-action="run" data-focus="run" ${disabled(busy)}><span class="command-symbol">↗</span>逃げる</button></div>`;
}
function statsHtml(): string {
  const g = game, d = derived(g);
  return `<section class="scroll-pane" data-screen="stats"><div class="page-heading"><h1>能力を育てる</h1><p>スキル習得と同じXPを使います。</p></div><div class="stat-list">${([['hp', 'HP', 'たいりょく', '最大HP +14'], ['sp', 'SP', 'せいしん', '最大SP +6 / 術威力も上昇'], ['atk', 'ATK', 'こうげき', '攻撃力 +3'], ['def', 'DEF', 'ぼうぎょ', '防御力 +2'], ['agi', 'AGI', 'すばやさ', '命中・回避・会心に影響']] as const).map(([key, code, label, desc]) => `<div class="stat-row"><span class="stat-code">${code}</span><div><h2>${label}<small>強化 ${g.stats[key]}回</small></h2><p>${desc}</p></div><button data-stat="${key}" data-focus="stat-${key}" ${disabled(g.xp < statCost(g, key))} aria-label="${label}を${statCost(g, key)}XPで強化">＋ <span>${statCost(g, key)} XP</span></button></div>`).join('')}</div><div class="derived"><span>攻撃 <b>${d.atk}</b></span><span>防御 <b>${d.def}</b></span><span>会心 <b>${Math.round(d.crit * 100)}%</b></span><span>AGI <b>${d.agi}</b></span></div><h2 class="section-label">装備中</h2><div class="equipment-card"><span class="equipment-icon">${swordIcon}</span><div><small>武器</small><strong>${item(g.weapon).name}</strong><small>${item(g.weapon).description}</small></div></div><div class="equipment-card"><span class="equipment-icon">${shieldIcon}</span><div><small>防具</small><strong>${item(g.armor).name}</strong><small>${item(g.armor).description}</small></div></div><button class="text-button" data-do="respec">能力・スキルを振り直す（XP全額返却）</button></section>`;
}
function skillsHtml():string{
 const g=game,job=JOBS.find(j=>j.id===branch)!;
 const passives=g.learned.filter(id=>skill(id).kind==='passive');
 const loadout=`<div class="loadout"><h2>戦闘に持ち込む4枠</h2><div>${g.slots.map((id,i)=>`<label><span>枠 ${i+1}</span><select data-slot="${i}" data-focus="slot-${i}" aria-label="スキルスロット${i+1}"><option value="">未セット</option>${g.learned.filter(k=>skill(k).kind!=='passive').map(k=>`<option value="${k}" ${k===id?'selected':''}>${skill(k).name}</option>`).join('')}</select><span class="loadout-summary">${id?skill(id).summary:'技・変化技をセット'}</span></label>`).join('')}</div><p>同じ技や別の変化技もセット可。待機は枠ごと。</p></div><section class="passive-list"><h2>有効な常時効果 <small>${passives.length}</small></h2>${passives.length?passives.map(id=>`<button data-skill="${id}"><strong>◉ ${skill(id).name}</strong><span>${skill(id).summary}</span></button>`).join(''):'<p>常時効果は習得するだけで有効。4枠を使いません。</p>'}</section>`;
 const nodes=SKILLS.filter(s=>s.branch===branch);
 const links=nodes.flatMap(s=>s.requires.map(id=>({parent:nodes.find(p=>p.id===id),child:s}))).filter(l=>l.parent);
 const tree=`<div class="segmented job-tabs" role="group" aria-label="スキル系統">${JOBS.map(j=>`<button data-branch="${j.id}" aria-pressed="${branch===j.id}">${j.name}</button>`).join('')}</div><div class="job-heading"><h2>${job.name}</h2><p>${job.description}</p><small>系統は自由に混成できます。技をタップして詳細へ。</small></div><div class="job-tree"><svg class="job-links" viewBox="0 0 100 400" preserveAspectRatio="none" aria-hidden="true">${links.map(({parent:p,child:s})=>`<path d="M${p!.column*50+25} ${p!.tier*100+50} V${s.tier*100+12} H${s.column*50+25} V${s.tier*100+50}"/>`).join('')}</svg>${nodes.map(s=>{
   const owned=g.learned.includes(s.id),ready=s.requires.every(p=>g.learned.includes(p))&&meetsStats(g,s);
   return `<button class="job-node ${owned?'learned':!ready?'locked':''}" style="grid-row:${s.tier+1};grid-column:${s.column+1}" data-skill="${s.id}" data-focus="node-${s.id}" aria-label="${s.name}：${s.summary}。詳細を開く"><small class="node-kind ${s.kind}">${s.kind==='passive'?'◉ 常時':s.kind==='variant'?'◆ 変化技':'✦ 技'}</small><strong>${s.name}</strong><span class="node-effect">${s.summary}</span><small>${owned?'✓ 習得済み':!meetsStats(g,s)?Object.entries(s.statRequirements??{}).map(([k,n])=>k.toUpperCase()+' '+n+'以上').join(' / '):!ready?'前提未習得':`${s.cost} XP`}</small><small class="node-parent">${s.requires.length?'← '+s.requires.map(p=>skill(p).name).join('・'):'入口・前提なし'}</small></button>`;
 }).join('')}</div>`;
 return `<section class="scroll-pane skills-pane" data-screen="skills"><div class="page-heading compact-heading"><h1>スキル <small>${g.learned.length}/${SKILLS.length}</small></h1><div class="skill-mode" role="group" aria-label="スキル画面"><button data-skill-view="tree" aria-pressed="${skillView==='tree'}">ツリー</button><button data-skill-view="loadout" aria-pressed="${skillView==='loadout'}">編成</button></div></div>${skillView==='tree'?tree:loadout}</section>`;
}
function shopHtml(): string {
  const g = game;
  return `<section class="scroll-pane" data-screen="shop"><div class="page-heading"><h1>旅の道具屋</h1><p>購入済みの装備は何度でも着替えられます。</p></div><div class="segmented" role="group" aria-label="商品カテゴリ">${([['weapon', '武器'], ['armor', '防具'], ['items', 'アイテム']] as const).map(([id, name]) => `<button data-category="${id}" aria-pressed="${shopCategory === id}">${name}</button>`).join('')}</div><div class="product-list">${shopCategory === 'items' ? ([['potion', 'ポーション', 'HP 50%回復', 10, g.potions], ['ether', 'エーテル', 'SP 50%回復', 15, g.ethers], ['remedy', '治療薬', '毒・術乱を解除', 12, g.remedies]] as const).map(([id, name, desc, cost, count]) => `<article class="product-card"><div><h2>${name}</h2><p>${desc}</p><small>所持 ${count} / 9 ・ 使用に1ターン</small></div><button data-buy="${id}" ${disabled(g.gold < cost || count >= 9)}>${cost} G</button></article>`).join('') : ITEMS.filter(i => i.slot === shopCategory).map(i => {
    const equipped = g[i.slot] === i.id, owned = g.owned.includes(i.id);
    return `<article class="product-card"><span class="product-icon">${i.slot === 'weapon' ? swordIcon : shieldIcon}</span><div><h2>${i.name}</h2><p>${i.description}</p><small>${equipped ? '装備中' : owned ? '購入済み・着替え可能' : '購入時に自動装備'}</small></div><button ${owned ? 'data-equip' : 'data-buy'}="${i.id}" ${disabled(equipped || !owned && g.gold < i.cost)}>${equipped ? '装備中' : owned ? '装備' : `${i.cost} G`}</button></article>`;
  }).join('')}</div><p class="page-note">敵に合わせて、攻防・命中回避・耐性を選ぼう。HP・SPは戦闘終了時に全回復。</p></section>`;
}
function dialogHtml(): string {
  const close = '<button class="icon-button" data-do="close" aria-label="閉じる">×</button>';
  if(modal==='passives')return `<dialog aria-labelledby="dialog-heading"><div class="dialog-heading"><h2 id="dialog-heading">有効な常時効果</h2>${close}</div><div class="full-log">${game.learned.filter(id=>skill(id).kind==='passive').map(id=>`<p><strong>${skill(id).name}</strong><br>${skill(id).effect}</p>`).join('')||'<p>常時効果はまだ習得していません。</p>'}</div></dialog>`;
  if (modal === 'encounter') return `<dialog aria-labelledby="dialog-heading"><div class="dialog-heading"><h2 id="dialog-heading">敵の情報</h2>${close}</div>${encounterPreview(game.stage, pendingEncounter, pendingBoss).map(e => `<article class="enemy-preview"><h3>${e.name}</h3><p>HP ${e.maxHp} / ATK ${e.atk} / DEF ${e.def} / AGI ${e.agi}</p><p>${enemyHint(e)}</p></article>`).join('')}<p class="page-note">全員を倒すと勝利。戦闘中は敵の名前で攻撃対象を選べます。</p><button class="primary wide" data-do="confirm-battle">この編成で挑む</button><button class="text-button wide" data-do="close">装備・スキルを見直す</button></dialog>`;
  if (modal === 'respec') return `<dialog aria-labelledby="dialog-heading"><div class="dialog-heading"><h2 id="dialog-heading">育成を振り直す</h2>${close}</div><p>能力とスキルに使ったXPを全額返却します。進行・所持金・装備は引き継ぎます。</p><button class="primary wide" data-do="confirm-respec">XPを戻して振り直す</button></dialog>`;
  if(modal==='skill'){
 const s=skill(selectedSkill),owned=game.learned.includes(s.id),ready=s.requires.every(id=>game.learned.includes(id))&&meetsStats(game,s);
 const thresholds=Object.entries(s.statRequirements??{});
 return `<dialog aria-labelledby="dialog-heading"><div class="dialog-heading"><h2 id="dialog-heading">${s.symbol} ${s.name}</h2>${close}</div><p class="skill-type-label">${s.kind==='passive'?'常時効果・枠を使わず習得で有効':s.kind==='variant'?'変化技・基本技とは別の枠にもセット可能':'能動技・戦闘の4枠にセット'}</p><p>${s.effect}</p><div class="skill-detail-meta">${s.kind!=='passive'?`<span>${s.id==='bloodcast'?'消費HP <b>12</b>':`消費SP <b>${s.sp}</b>`}</span><span>待機 <b>${s.cd}行動</b></span>`:''}<span>習得 <b>${s.cost} XP</b></span></div><div class="skill-requirements"><p>${s.requires.length?'前提：'+s.requires.map(id=>`${game.learned.includes(id)?'✓':'未'} ${skill(id).name}`).join('・'):'前提スキルなし'}</p>${thresholds.length?`<p>装備を除く基礎値の条件：</p>${thresholds.map(([k,n])=>`<p class="${baseStats(game)[k as Stat]>=n?'requirement-met':'requirement-missing'}">${k.toUpperCase()} ${n}以上（現在 ${baseStats(game)[k as Stat]}）</p>`).join('')}`:''}</div><button class="primary wide" data-learn="${s.id}" ${disabled(!canLearn(game,s.id))}>${owned?'習得済み ✓':!ready?'前提・能力条件を満たすと習得':game.xp<s.cost?'XPが足りません':`${s.cost} XPで習得する`}</button></dialog>`;
 }
  const heading = modal === 'help' ? '冒険の手引き' : modal === 'log' ? '冒険の記録' : '最初からはじめる？';
  const body = modal === 'help' ? `<ol class="help-list"><li><h3>赤い地点から戦闘へ</h3><p>通常戦3地点を突破するとボス解放。クリア済み地点は何度でも再戦できます。</p></li><li><h3>XPの使い道を選ぶ</h3><p>能力を伸ばすか、技を覚えるか。スキル画面で4枠を編成してから戦いましょう。</p></li><li><h3>戦闘は1回ずつ全力で</h3><p>戦闘が終わるとHP・SPは全回復。戦闘中はスキルやポーションで回復します。4系統の技・常時効果を自由に組み合わせられます。能動技と変化技を4枠にセットし、常時効果は習得するだけで有効になります。</p></li></ol><p class="page-note">操作はすべてタップ対応。キーボードでは攻撃A、逃走R、回復H、スキル1〜4。セーブはこのブラウザ内に自動保存されます。</p><button class="danger-link" data-do="reset">セーブを消してやり直す</button>` : modal === 'log' ? `<div class="full-log">${game.log.map(l => `<p>${esc(l)}</p>`).join('')}</div>` : '<p>能力・スキル・お金・装備を含む、今のセーブデータが消えます。</p><div class="dialog-actions"><button data-do="close" autofocus>続きに戻る</button><button class="danger-button" data-do="confirm-reset">最初から</button></div>';
  return `<dialog aria-labelledby="dialog-heading"><div class="dialog-heading"><h2 id="dialog-heading">${heading}</h2>${close}</div>${body}</dialog>`;
}
function openModal(kind: typeof modal): void { returnFocusKey = (document.activeElement as HTMLElement)?.dataset.focus; modal = kind; render(); }
function closeModal(): void { modal = null; render(); if (returnFocusKey) app.querySelector<HTMLElement>(`[data-focus="${returnFocusKey}"]`)?.focus({ preventScroll: true }); }
function handleAction(action: Action): void {
  if (busy) return;
  const result = act(game, action);
  if (!result) return;
  lastTurn = result; busy = true; persist(); render();
  clearTimeout(effectTimer);
  effectTimer = setTimeout(() => { busy = false; lastTurn = null; render(); }, 220);
}
app.addEventListener('click', event => {
  const button = (event.target as Element).closest<HTMLButtonElement>('button');
  if (!button || button.disabled) return;
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
    case 'help': openModal('help'); return;
    case 'log': openModal('log'); return;
    case 'passives': openModal('passives'); return;
    case 'reset': openModal('reset'); return;
    case 'close': closeModal(); return;
    case 'confirm-reset': game = newGame(); screen = 'map'; modal = null; busy = false; clearTimeout(effectTimer); break;
    case 'boss': pendingEncounter = 2; pendingBoss = true; openModal('encounter'); return;
    case 'confirm-battle': startBattle(game, pendingBoss, pendingEncounter); battleMenu = 'main'; modal = null; break;
    case 'respec': openModal('respec'); return;
    case 'confirm-respec': respec(game); modal = null; break;
    case 'next': nextStage(game); break;
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
