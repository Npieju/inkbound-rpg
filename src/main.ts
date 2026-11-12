import { act, allocate, buy, derived, equipSkill, item, ITEMS, learn, newGame, nextStage, rank, rest, skill, SKILLS, statCost, STAGES, startBattle } from './game.ts';
import type { Action, Stat } from './game.ts';
import { loadGame, saveGame } from './save.ts';
import { fighter, scenery, shieldIcon, swordIcon } from './art.ts';

const app = document.querySelector<HTMLDivElement>('#app')!;
let game = (() => { try { return loadGame(localStorage); } catch { return newGame(); } })();
let modal: 'shop' | 'help' | 'reset' | 'skills' | null = null;
let saved = true;
let toast = '';
let toastTimer: ReturnType<typeof setTimeout>;
let effectTimer: ReturnType<typeof setTimeout>;
let busy = false;
const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const icon = (s: string) => `<span class="icon">${s}</span>`;
const meter = (value: number, max: number, kind: string) => `<div class="meter ${kind}" role="progressbar" aria-label="${kind === 'sp' ? 'SP' : 'HP'}" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="${max}"><i style="width:${Math.max(0, Math.min(100, value / max * 100))}%"></i></div>`;
function persist() { try { saved = saveGame(game, localStorage); } catch { saved = false; } }
function flash(message: string) {
  toast = message; clearTimeout(toastTimer); render(); toastTimer = setTimeout(() => { toast = ''; render(); }, 2400);
}
function render() {
  const g = game, d = derived(g), s = STAGES[g.stage], battle = g.phase === 'battle', e = g.enemy;
  const won = g.phase === 'clear' || g.phase === 'complete';
  const phaseLabel = battle ? (e?.boss ? 'BOSS ENCOUNTER' : 'IN BATTLE') : won ? 'STAGE CLEAR' : 'READY WHEN YOU ARE';
  app.innerHTML = `<div class="shell">
    <header class="topbar"><a class="brand" href="./" aria-label="INKBOUND ホーム"><span class="brand-mark">i.</span>INKBOUND<span class="edition">a tiny adventure</span></a><div class="top-actions"><span class="save-state"><i class="${saved ? '' : 'unsaved'}"></i>${saved ? 'オートセーブ' : '保存できません'}</span><button class="text-button" data-do="help">遊び方 <span>?</span></button><button class="tiny-button" data-do="reset" aria-label="最初からやり直す">↺</button></div></header>
    <div class="intro"><div><p class="eyebrow">A PEN. A SWORD. YOUR STORY.</p><h1>小さな冒険、<span>大きな一撃。</span></h1></div><p class="intro-note">倒して、育てて、もう一戦。<br>この一画面から、冒険は広がる。</p></div>
    <nav class="journey" aria-label="ステージ進行">${STAGES.map((stage, i) => `<div class="journey-stop ${i === g.stage ? 'current' : i < g.stage ? 'done' : ''}"><span class="stage-number">${i < g.stage ? '✓' : `0${i + 1}`}</span><div><small>STAGE 0${i + 1}</small><strong>${stage.name}</strong></div>${i > g.stage ? '<span class="lock">◇</span>' : ''}</div>`).join('')}</nav>
    <main class="game-grid">
      <aside class="panel character"><div class="panel-heading"><h2>冒険者</h2><span class="micro">YOUR CHARACTER</span></div><div class="identity"><div class="portrait">${fighter()}</div><div><span class="level">RANK ${rank(g)}</span><h3>名もなき旅人</h3><p>一歩ずつ、強くなる。</p></div></div>
        <div class="resource-label"><span>HP</span><strong>${g.hp}<em> / ${d.maxHp}</em></strong></div>${meter(g.hp, d.maxHp, 'hp')}
        <div class="resource-label xp-label"><span>SP</span><strong>${g.sp}<em> / ${d.maxSp}</em></strong></div>${meter(g.sp, d.maxSp, 'sp')}<div class="xp-wallet"><span>育成に使えるXP</span><b>${g.xp} <small>XP</small></b></div>
        <div class="gold"><span>◈ 所持金</span><strong>${g.gold.toLocaleString()} <small>G</small></strong></div>
        <div class="stat-heading"><h3>能力を育てる</h3><span class="point-badge">XPで直接強化</span></div>
        ${([['hp', 'HP', 'たいりょく', '最大HP +12'], ['sp', 'SP', 'せいしん', '最大SP +5'], ['atk', 'ATK', 'こうげき', '攻撃力 +3'], ['def', 'DEF', 'ぼうぎょ', '防御力 +2'], ['agi', 'AGI', 'すばやさ', '会心・回避率アップ']] as const).map(([key, code, label, desc]) => `<div class="stat-row"><div><strong>${code}<span>${label}</span></strong><small>${desc}</small></div><b>${g.stats[key]}</b><button class="add-stat" data-stat="${key}" ${g.xp < statCost(g, key) || battle ? 'disabled' : ''} aria-label="${label}を${statCost(g, key)}XPで強化">＋<small>${statCost(g, key)} XP</small></button></div>`).join('')}
        <button class="skill-open" data-do="skills" ${battle ? 'disabled' : ''}>✦ スキルツリー <span>${g.learned.length}/12 習得 →</span></button>
        <div class="derived"><span>攻撃 <b>${d.atk}</b></span><span>防御 <b>${d.def}</b></span><span>会心 <b>${Math.round(d.crit * 100)}%</b></span></div>
        <div class="equipment-title"><h3>装備</h3><small>購入すると自動で装備</small></div><div class="equipped">${icon(swordIcon)}<div><small>WEAPON</small><strong>${item(g.weapon).name}</strong></div><b>+${item(g.weapon).bonus}</b></div><div class="equipped">${icon(shieldIcon)}<div><small>ARMOR</small><strong>${item(g.armor).name}</strong></div><b>+${item(g.armor).bonus}</b></div>
      </aside>
      <section class="right-column">
        <section class="panel arena-panel"><div class="arena-heading"><div><p class="eyebrow">STAGE 0${g.stage + 1} <span>/ ${s.subtitle}</span></p><h2>${s.name}</h2></div><div class="phase-pill"><i class="${battle ? 'live' : ''}"></i>${phaseLabel}</div></div>
          <div class="battlefield ${battle ? 'in-battle' : ''}" style="--stage-color:${s.color}">${scenery(g.stage)}<div class="encounter-track" aria-label="ボス解放までの討伐数">${[0, 1, 2].map(i => `<span class="encounter-dot ${g.kills > i ? 'finished' : ''}">${g.kills > i ? '✓' : icon(swordIcon)}</span>`).join('<i></i>')}<i></i><span class="boss-dot ${g.kills >= 3 ? 'unlocked' : ''}">♛</span><small>${g.kills >= 3 ? 'ボスに挑戦できます' : `あと${3 - g.kills}戦でボス解放`}</small></div>
          <div class="unit hero">${fighter()}<span class="unit-label">YOU <i>Lv.${rank(g)}</i></span><div class="damage hero-damage"></div></div>
          ${e && battle ? `<div class="enemy-info"><span>${e.boss ? '♛ BOSS / ' : ''}${e.name}</span><strong>${e.hp} <small>/ ${e.maxHp}</small></strong>${meter(e.hp, e.maxHp, 'enemy-hp')}</div><div class="unit enemy ${e.boss ? 'boss' : ''}">${fighter(true, e.boss, e.kind)}<div class="damage enemy-damage"></div></div>${e.boss && e.turn % 3 === 2 ? '<div class="intent warning">! 敵が大技の構え。防御で備えよう</div>' : '<div class="intent">次の敵の行動：攻撃</div>'}` : `${won ? '' : fieldMapHtml()}<div class="scene-caption"><strong>${g.phase === 'complete' ? 'そして、あなたの物語になる。' : g.phase === 'clear' ? 'この地に、静けさが戻った。' : g.phase === 'defeat' ? '何度でも、立ち上がろう。' : g.phase === 'victory' ? 'いい一撃だった。次もいこう。' : '風が吹く。冒険がはじまる。'}</strong><span>${won ? 'STAGE CLEAR / よく戦いました！' : '戦いの合間は、焚き火で無料回復できます。'}</span></div>`}
          <div class="ground-note">FIELD NOTES / ${g.totalKills.toString().padStart(3, '0')} ENEMIES DEFEATED</div></div>
          <div class="battle-controls">${battle ? `${combatHtml(busy)}` : `<div class="camp-controls"><div><strong>${g.phase === 'complete' ? 'すべてのステージを制覇！' : won ? 'STAGE CLEAR!' : g.kills >= 3 ? '草の向こうに、強い気配。' : '準備ができたら、いざ一戦。'}</strong><small>${g.phase === 'complete' ? `Lv.${rank(g)} / 討伐 ${g.totalKills}体。次の冒険はあなた次第。` : won ? '次のステージへ進むとHP・SPが全回復。' : '通常戦で経験値とお金を集めて強くなろう。'}</small></div><div class="start-buttons">${g.phase === 'clear' ? '<button class="primary" data-do="next">次のステージへ <span>→</span></button>' : g.phase === 'complete' ? '<button class="primary" data-do="reset">もう一度冒険する ↺</button>' : `<button class="${g.kills >= 3 ? '' : 'primary'}" data-do="fight" ${g.hp <= 0 ? 'disabled' : ''}>${g.kills >= 3 ? '通常戦' : '戦いに出る'} ${icon(swordIcon)}</button>${g.kills >= 3 ? `<button class="primary boss-button" data-do="boss" ${g.hp <= 0 ? 'disabled' : ''}>♛ ボスに挑む</button>` : ''}`}</div></div>`}</div>
        </section>
        <div class="lower-grid"><section class="panel supply"><div class="panel-heading"><h2>旅の支度</h2><span class="micro">PREPARE & GROW</span></div><button class="supply-button" data-do="shop" ${battle ? 'disabled' : ''}><span class="supply-icon">⚒</span><span><strong>旅の道具屋</strong><small>武器・防具・ポーション</small></span><b>↗</b></button><button class="supply-button" data-do="rest" ${battle || g.hp >= d.maxHp && g.sp >= d.maxSp ? 'disabled' : ''}><span class="supply-icon fire">♨</span><span><strong>焚き火で休む</strong><small>HP・SPを全回復 <em>FREE</em></small></span><b>↗</b></button></section>
        <section class="panel journal"><div class="panel-heading"><h2>冒険の記録</h2><span class="micro">BATTLE LOG</span></div><div class="log" role="log" aria-live="polite">${g.log.slice(0, 4).map((l, i) => `<p class="${i === 0 ? 'latest' : ''}"><span>${i === 0 ? '→' : '·'}</span>${esc(l)}</p>`).join('')}</div></section></div>
      </section>
    </main><footer><span>INKBOUND <i>—</i> A LITTLE STRONGER, EVERY BATTLE.</span><span>移動なし。寄り道は、成長だけ。</span></footer>
    ${toast ? `<div class="toast" role="status">${esc(toast)}</div>` : ''}${modal ? modalHtml() : ''}</div>`;
  if (modal) {
    const dialog = app.querySelector<HTMLDialogElement>('dialog')!;
    dialog.showModal(); dialog.addEventListener('cancel', () => { modal = null; });
    dialog.addEventListener('click', event => { if (event.target === dialog) { modal = null; render(); } });
  }
}
function modalHtml(): string {
  const g = game;
  const close = '<button class="tiny-button" data-do="close" aria-label="閉じる">×</button>';
  if (modal === 'skills') return skillTreeHtml();
  if (modal === 'reset') return `<dialog class="small-dialog" aria-labelledby="modal-title"><div class="modal-heading"><h2 id="modal-title">新しい冒険をはじめる？</h2>${close}</div><p>今のセーブデータが消え、レベル・お金・装備が初期状態に戻ります。</p><div class="dialog-actions"><button data-do="close" autofocus>続きに戻る</button><button class="primary" data-do="confirm-reset">最初からはじめる</button></div></dialog>`;
  if (modal === 'help') return `<dialog class="help-dialog" aria-labelledby="modal-title"><div class="modal-heading"><div><p class="eyebrow">HOW TO PLAY</p><h2 id="modal-title">冒険の手引き</h2></div>${close}</div><ol class="help-list"><li><b>育てる</b><p>手持ちXPをHP・SP・ATK・DEF・AGIの強化、またはスキル習得に使います。使い道を選ぼう。</p></li><li><b>戦う</b><p>ボタンを押すたびに1ターン進行。攻撃・防御・ポーションはA・D・H、セットした4つのスキルは1〜4でも操作できます。スキルはSPとクールダウンを管理して使おう。</p></li><li><b>備える</b><p>スキルツリーで技を習得し、4枠に編成。同じ技を複数枠にもセットできます。戦闘の合間は焚き火で無料回復。道具屋で装備を買うと自動装備。通常戦は繰り返し挑戦できます。</p></li><li><b>突破する</b><p>各ステージで敵を3体倒すとボス解放。大技の予告が出たら防御が有効。全4ステージの制覇を目指そう！</p></li></ol><p class="help-foot">自動セーブはこのブラウザに保存されます。戦闘中に再読込するとキャンプから再開します。敗北でお金や経験値は失いません。</p></dialog>`;
  return `<dialog class="shop-dialog" aria-labelledby="modal-title"><div class="modal-heading"><div><p class="eyebrow">THE TRAVELING MERCHANT</p><h2 id="modal-title">旅の道具屋</h2></div><span class="shop-gold">◈ ${g.gold} G</span>${close}</div><p class="shop-note">いい道具は、いい冒険のはじまり。購入すると自動で装備します。</p>${(['weapon', 'armor'] as const).map(slot => `<h3 class="shop-category">${slot === 'weapon' ? 'WEAPONS / 武器' : 'ARMOR / 防具'}</h3><div class="shop-items">${ITEMS.filter(i => i.slot === slot && i.cost > 0).map(i => {
    const owned = item(g[slot]).tier >= i.tier;
    return `<div class="shop-item">${icon(slot === 'weapon' ? swordIcon : shieldIcon)}<strong>${i.name}</strong><p>${i.description}</p><button data-buy="${i.id}" ${owned || g.gold < i.cost ? 'disabled' : ''}>${g[slot] === i.id ? '装備中 ✓' : owned ? '購入済み' : `${i.cost} G で購入`}</button></div>`;
  }).join('')}</div>`).join('')}<div class="potion-shop"><div><strong>♧ 回復ポーション</strong><small>最大HPの50%を回復 / 所持 ${g.potions} / 9</small></div><button data-buy="potion" ${g.gold < 10 || g.potions >= 9 ? 'disabled' : ''}>10 G で購入</button></div></dialog>`;
}
function handleAction(action: Action) {
  if (busy) return;
  const result = act(game, action);
  if (!result) return;
  busy = true; persist(); render();
  const enemy = app.querySelector<HTMLElement>('.enemy-damage');
  const hero = app.querySelector<HTMLElement>('.hero-damage');
  if (enemy && result.playerDamage) { enemy.textContent = `${result.critical ? 'CRIT ' : ''}−${result.playerDamage}`; enemy.classList.add('pop'); }
  if (hero && (result.dodged || result.healed || result.enemyDamage)) { hero.textContent = result.dodged ? 'MISS' : result.healed ? `+${result.healed}` : `−${result.enemyDamage}`; hero.classList.add('pop'); }
  app.querySelector('.hero')?.classList.add(result.playerDamage > 0 ? 'swing' : 'brace');
  clearTimeout(effectTimer); effectTimer = setTimeout(() => { busy = false; render(); }, 350);
}
app.addEventListener('click', event => {
  const button = (event.target as Element).closest<HTMLButtonElement>('button');
  if (!button || button.disabled) return;
  const previousFocus = button.dataset.stat;
  if (button.dataset.action) { const a = button.dataset.action; handleAction(/^\d$/.test(a) ? Number(a) : a as Action); return; }
  if (button.dataset.learn) { learn(game, button.dataset.learn); persist(); render(); return; }
  if (button.dataset.encounter) startBattle(game, false, Number(button.dataset.encounter));
  if (button.dataset.stat) allocate(game, button.dataset.stat as Stat);
  if (button.dataset.buy) { if (buy(game, button.dataset.buy)) { persist(); render(); return; } }
  switch (button.dataset.do) {
    case 'shop': modal = 'shop'; break;
    case 'skills': modal = 'skills'; break;
    case 'help': modal = 'help'; break;
    case 'close': modal = null; break;
    case 'reset': modal = 'reset'; break;
    case 'confirm-reset': game = newGame(); modal = null; busy = false; clearTimeout(effectTimer); break;
    case 'rest': if (rest(game)) { persist(); flash('焚き火でHP・SPが全回復した。'); return; } break;
    case 'fight': startBattle(game); break;
    case 'boss': startBattle(game, true); break;
    case 'next': nextStage(game); break;
  }
  persist(); render();
  if (previousFocus) app.querySelector<HTMLButtonElement>(`[data-stat="${previousFocus}"]`)?.focus();
});
document.addEventListener('keydown', e => {
  if (modal || e.repeat || e.ctrlKey || e.metaKey || e.altKey || (e.target as Element)?.matches('input,textarea,select')) return;
  const action = ({ '1': 0, '2': 1, '3': 2, '4': 3, 'a': 'attack', 'd': 'guard', 'h': 'potion' } as Record<string, Action>)[e.key.toLowerCase()];
  if (action !== undefined) { e.preventDefault(); handleAction(action); }
});
persist(); render();

function combatHtml(locked: boolean): string {
  const g = game;
  return `<div class="basic-actions"><button class="primary" data-action="attack" ${locked ? 'disabled' : ''}>⚔ 攻撃 <kbd>A</kbd></button><button data-action="guard" ${locked ? 'disabled' : ''}>◇ 防御 <kbd>D</kbd></button><button data-action="potion" ${locked || !g.potions ? 'disabled' : ''}>♧ ポーション ×${g.potions} <kbd>H</kbd></button><small>${g.ward ? '◇ 障壁 '+g.ward+'回 ' : ''}${g.charge ? '✦ 次の攻撃2倍 ' : ''}${g.regen ? '♧ 再生 '+g.regen+'T' : ''}</small></div><div class="skill-actions">${g.slots.map((id, i) => {
    const s = id ? skill(id) : null;
    return `<button data-action="${i}" ${locked || !s || g.cooldowns[i] > 0 || g.sp < s.sp ? 'disabled' : ''}><kbd>${i + 1}</kbd><strong>${s ? s.symbol + ' ' + s.name : '未セット'}</strong><small>${s ? g.cooldowns[i] ? 'あと'+g.cooldowns[i]+'ターン' : 'SP '+s.sp+' / CT '+s.cd : '戦闘前に編成'}</small></button>`;
  }).join('')}</div>`;
}
function skillTreeHtml(): string {
  const g = game;
  return `<dialog class="tree-dialog" aria-labelledby="modal-title"><div class="modal-heading"><div><p class="eyebrow">CHOOSE YOUR OWN STRENGTH</p><h2 id="modal-title">スキルツリー</h2></div><span class="shop-gold">${g.xp} XP</span><button class="tiny-button" data-do="close" aria-label="閉じる">×</button></div><p class="shop-note">能力強化と同じXPで習得。枝を伸ばして、自分の戦い方をつくろう。</p><div class="loadout"><strong>戦闘に持ち込む4枠</strong><small>同じ技も複数セット可 / クールダウンは枠ごと</small><div>${g.slots.map((id, i) => `<label><span>SLOT 0${i + 1}</span><select data-slot="${i}" aria-label="スキルスロット${i + 1}"><option value="">未セット</option>${g.learned.map(k => `<option value="${k}" ${k === id ? 'selected' : ''}>${skill(k).name}</option>`).join('')}</select></label>`).join('')}</div></div><div class="skill-trees">${([['blade', '剣技', 'BLADE / 攻めを磨く'], ['guard', '守護', 'GUARD / 戦線を支える'], ['life', '生命', 'LIFE / 粘り強く戦う']] as const).map(([branch, name, sub]) => `<section class="skill-branch"><h3>${name}<small>${sub}</small></h3><div class="branch-nodes">${SKILLS.filter(s => s.branch === branch).map((s, i) => {
    const learned = g.learned.includes(s.id), unlocked = s.requires.every(p => g.learned.includes(p));
    return `<article class="skill-node node-${i} ${learned ? 'learned' : unlocked ? 'available' : 'locked'}"><div><span>${s.symbol}</span><strong>${s.name}</strong><b>${learned ? '✓' : s.cost + ' XP'}</b></div><p>${s.effect}</p><small>SP ${s.sp} / CT ${s.cd}ターン</small><small class="prerequisite">${s.requires.length ? '前提：'+s.requires.map(p => skill(p).name).join('・') : '前提なし'}</small><button data-learn="${s.id}" ${learned || !unlocked || g.xp < s.cost ? 'disabled' : ''}>${learned ? '習得済み' : !unlocked ? '前提スキルが必要' : g.xp < s.cost ? 'XPが足りません' : '習得する'}</button></article>`;
  }).join('')}</div></section>`).join('')}</div><p class="help-foot">CTは使用後の待機ターン数。習得時は空き枠へ自動セット。習得・編成は戦闘の合間に行えます。</p></dialog>`;
}
app.addEventListener('change', event => {
  const select = event.target as HTMLSelectElement;
  if (select.matches('select[data-slot]')) { equipSkill(game, Number(select.dataset.slot), select.value || null); persist(); }
});

function fieldMapHtml(): string {
  const g = game;
  return `<div class="field-map" aria-label="戦闘地点を選ぶマップ"><svg viewBox="0 0 900 330" preserveAspectRatio="none" aria-hidden="true"><path d="M350 165Q380 230 510 215T665 150Q740 130 790 245" fill="none" stroke="#667a53" opacity=".45" stroke-dasharray="3 6" stroke-width="1.5"/></svg>${[0, 1, 2].map(i => `<button class="map-node map-node-${i} ${g.kills > i ? 'beaten' : g.kills === i ? 'next' : ''}" data-encounter="${i}" ${g.kills < i || g.hp <= 0 ? 'disabled' : ''} aria-label="通常戦${i + 1}：${STAGES[g.stage].enemies[i]}${g.kills > i ? '（再戦）' : ''}"><span>${g.kills > i ? '✓' : '⚔'}</span><small>${g.kills > i ? '再戦' : 'BATTLE 0'+(i+1)}</small></button>`).join('')}<button class="map-node map-boss ${g.kills >= 3 ? 'next' : ''}" data-do="boss" ${g.kills < 3 || g.hp <= 0 ? 'disabled' : ''} aria-label="ボス：${STAGES[g.stage].boss}"><span>♛</span><small>BOSS</small></button></div>`;
}
