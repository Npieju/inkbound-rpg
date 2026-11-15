import type { Game } from './game.ts';
import { STAGES } from './game.ts';
import type { Skin } from './skins.ts';
import { collectionCount } from './collection.ts';
import { illustratedHero } from './illustrated.ts';

/** One-ink marks: functional silhouettes, not miniature painted objects. */
export function schoolIcon(name:string):string {
  const marks:Record<string,string>={
    compass:'<path d="M16 2 19 11 28 16 19 20 16 30 12 20 3 16 12 11Z"/><path d="m16 10-4 10 8-4Z" fill="var(--icon-cut, var(--school-paper))"/>',
    growth:'<path d="M14 28V15L6 9l2-3 8 6 8-6 2 3-8 6v13Z"/><circle cx="6" cy="6" r="4"/><circle cx="26" cy="6" r="4"/><circle cx="16" cy="27" r="4"/><circle cx="16" cy="14" r="3"/>',
    book:'<path d="M2 6q7-3 13 1v21Q8 24 2 27Zm15 1q6-4 13-1v21q-6-3-13 1Z"/><path d="M6 11h5m-5 5h5m10-5h5m-5 5h5" fill="none" stroke="var(--icon-cut, var(--school-paper))" stroke-width="1.4"/>',
    bag:'<path d="M10 9V6a6 6 0 0 1 12 0v3h-3V6a3 3 0 0 0-6 0v3Zm-7 2h26l2 17H1Z"/><path d="M2 18h28" stroke="var(--icon-cut, var(--school-paper))" stroke-width="2"/><path d="M13 16h6v7h-6Z" fill="var(--icon-cut, var(--school-paper))"/>',
    coin:'<path fill-rule="evenodd" d="M16 2a14 14 0 1 0 0 28 14 14 0 0 0 0-28Zm0 3a11 11 0 1 1 0 22 11 11 0 0 1 0-22Z"/><path d="m16 7 3 6 6 3-6 3-3 6-3-6-6-3 6-3Z"/>',
    xp:'<path d="m16 2 3 9 9 5-9 4-3 10-4-10-9-4 9-5Z"/>',
    crest:'<path fill-rule="evenodd" d="M3 3q13 4 26 0v13q-1 8-13 15Q4 24 3 16Zm3 4v9q1 6 10 12 9-6 10-12V7q-10 2-20 0Z"/><path d="m16 7 2 6 6 3-6 2-2 7-2-7-6-2 6-3Z"/>',
    gate:'<path d="M2 11h4v19H2Zm24 0h4v19h-4ZM1 7h6v3H1Zm24 0h6v3h-6ZM4 1l3 5H1Zm24 0 3 5h-6Z"/><path d="M8 29V10q8-7 16 0v19M8 15h16M8 26h16m-12-16v18m4-20v20m4-18v18" fill="none" stroke="currentColor" stroke-width="1.7"/>',
    fountain:'<path d="M5 24h22l-3 5H8Zm10-10h2v11h-2ZM3 14h26q-2 8-13 8T3 14Zm8-6h10q-1 5-5 5t-5-5Zm4-7h2v6h-2Z"/><path d="M4 12q0-8 7-8m17 8q0-8-7-8" stroke="currentColor" fill="none" stroke-width="1.4" stroke-dasharray="1 2"/>',
    greenhouse:'<path d="M3 14Q3 3 16 2q13 1 13 12v15H3Zm3 1v11h20V15ZM6 12h7V6q-5 1-7 6Zm13-6v6h7q-2-5-7-6Z" fill-rule="evenodd"/><path d="M15 14h2v15h-2Zm-8 6h18v2H7Z"/>',
    tower:'<path d="M11 9 16 1l5 8v21H11ZM2 18l4-7 4 7v12H2Zm20 0 4-7 4 7v12h-8Z"/><circle cx="16" cy="14" r="3" fill="var(--icon-cut, var(--school-paper))"/><path d="M14 24a2 2 0 0 1 4 0v6h-4Z" fill="var(--icon-cut, var(--school-paper))"/>',
    lock:'<path fill-rule="evenodd" d="M7 14V9a9 9 0 0 1 18 0v5h3v16H4V14Zm4 0h10V9a5 5 0 0 0-10 0Z"/><path d="M14 19h4v6h-4Z" fill="var(--icon-cut, var(--school-paper))"/>',
    check:'<path d="m3 16 7 7L28 5l3 4-21 21L0 20Z"/>',
    next:'<path d="m10 3 14 13-14 13-3-4 10-9L7 7Z"/>',
    log:'<path d="M5 2h22v28H5Z"/><path d="M10 8h12m-12 7h12m-12 7h8" stroke="var(--icon-cut, var(--school-paper))" stroke-width="2"/>',
    worlds:'<path d="M16 2a14 14 0 1 0 0 28Zm3 0v28a14 14 0 0 0 0-28Z"/>',
    help:'<path d="M12 11q0-7 6-7t6 6q0 3-5 6l-1 4h-4l1-6q5-2 5-4 0-3-3-3t-3 4Zm2 13h5v5h-5Z"/>',
  };
  return `<svg class="school-icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false" fill="currentColor">${marks[name]??marks.book}</svg>`;
}

const schoolEsc=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));

export function schoolHeader(g:Game,world:Skin,saved:boolean):string {
 return `<header class="school-masthead" data-world-authored><button class="school-seal" data-do="world" data-focus="world" aria-label="世界観を選ぶ">${schoolIcon('crest')}</button><span class="school-brand" data-world-authored>${schoolEsc(world.title)}</span><div class="school-funds"><span aria-label="所持金 ${g.gold}コイン">${schoolIcon('coin')}<b>${g.gold.toLocaleString()}</b><small>G</small></span><span aria-label="育成に使える経験値 ${g.xp}">${schoolIcon('xp')}<b>${g.xp.toLocaleString()}</b><small>XP</small></span></div><button class="school-help" data-do="help" data-focus="help" aria-label="遊び方">${schoolIcon('help')}</button>${!saved?'<span class="school-save-error" role="status">保存できません</span>':''}</header>`;
}

export function schoolNavigation(screen:string,inBattle:boolean):string {
 return `<nav class="school-nav" aria-label="メインメニュー" data-world-authored>${[['map','compass','学園'],['stats','growth','育成'],['skills','book','魔法'],['shop','bag','購買']].map(([id,icon,label])=>`<button class="school-tab school-tab-${id}" data-screen="${id}" data-focus="tab-${id}" ${inBattle?'disabled':''} ${screen===id?'aria-current="page"':''}><span>${schoolIcon(icon)}</span><b>${label}</b></button>`).join('')}</nav>`;
}

export function schoolMap(g:Game,world:Skin,recentFind:number|null):string {
 const won=g.phase==='clear'||g.phase==='complete';
 const bossReady=g.kills>=3;
 const places=['中庭の門','噴水','硝子の温室'];
 const icons=['gate','fountain','greenhouse'];
 const num=g.stage+1;
 const find=recentFind===null?null:world.collection?.entries[recentFind];
 const result=g.phase==='complete'?'全4章をクリア':g.phase==='clear'?'ステージクリア':g.phase==='defeat'?'もう一度、挑戦できる。':g.phase==='victory'?'探索が進んだ。':'';
 const action= g.phase==='complete'?'data-do="reset"':g.phase==='clear'?'data-do="next"':bossReady?'data-do="boss"':`data-encounter="${g.kills}"`;
 const label=g.phase==='complete'?'最初から始める':g.phase==='clear'?'次の章へ':bossReady?'ボスに挑む':g.phase==='defeat'?'もう一度探索する':'探索を始める';
 return `<section class="school-map" aria-label="探索マップ"><header class="school-chapter"><div class="school-chapter-paper"><p class="school-chapter-number">第${num}章 <span>/ 全${STAGES.length}章</span></p><h1 data-world-authored>${schoolEsc(world.places[g.stage])}</h1><span class="school-chapter-rule" aria-hidden="true">✦</span></div><div class="school-portrait" aria-hidden="true">${illustratedHero('academy')}</div></header><div class="school-atlas"><div class="school-index" aria-hidden="true"><i></i><i></i><i></i></div><div class="school-page"><div class="school-page-inner"><div class="school-page-top"><span class="school-page-label">${schoolIcon('compass')} 学園案内</span><span class="school-progress">${won?'踏破':`通常戦 <b>${g.kills}</b><span>/3</span>`}</span></div><div class="school-route"><svg class="school-route-art" viewBox="0 0 340 360" preserveAspectRatio="none" aria-hidden="true"><path class="school-dotted-path" d="M76 69Q160 52 251 120T89 239Q174 296 259 318"/><g class="school-diagram"><circle cx="188" cy="37" r="24"/><ellipse cx="188" cy="37" rx="36" ry="12" transform="rotate(-30 188 37)"/><path d="M158 37h60m-30-27v54m-20 260h83m-47-25v46"/><circle cx="40" cy="310" r="20"/><path d="m23 295 33 30m-34 0 34-30"/></g></svg>${[0,1,2].map(i=>{
 const visited=g.kills>i,available=g.kills===i&&!won,locked=g.kills<i;
 return `<button class="school-stop school-stop-${i} ${available?'is-current':''} ${visited?'is-visited':''}" data-encounter="${i}" data-focus="map-stop-${i}" ${won||locked?'disabled':''} aria-label="通常戦${i+1}：${schoolEsc(STAGES[g.stage].enemies[i])}${visited?'（再戦）':locked?'（未到達）':''}"><span class="school-stop-seal"><span class="school-stop-number">0${i+1}</span><span class="school-stop-mark">${schoolIcon(icons[(g.stage+i)%3])}</span><span class="school-stop-state">${visited?schoolIcon('check'):locked?schoolIcon('lock'):''}</span></span><b>${available?'探索':visited?'再訪':places[(g.stage+i)%3]}</b></button>`;
 }).join('')}<button class="school-stop school-stop-boss ${bossReady&&!won?'is-current':''} ${won?'is-visited':''}" data-do="boss" data-focus="map-boss" ${won||!bossReady?'disabled':''} aria-label="ボス：${schoolEsc(world.bosses[g.stage])}${!bossReady?'（通常戦3回で解放）':''}"><span class="school-stop-seal"><span class="school-stop-mark">${schoolIcon('tower')}</span><span class="school-stop-state">${won?schoolIcon('check'):!bossReady?schoolIcon('lock'):''}</span></span><b>${schoolEsc(world.bosses[g.stage])}</b><small>${won?'撃破済み':bossReady?'挑戦できる':'BOSS'}</small></button><button class="school-collection" data-do="collection" data-focus="collection">${schoolIcon('book')}<span>収集品<b>${collectionCount(g)}<small>/16</small></b></span>${find?'<i aria-label="新しい収集品">NEW</i>':''}</button></div><div class="school-map-result" role="status">${find?`<button data-do="collection">${schoolIcon('book')}<span>${schoolEsc(find.name)}<small>を見つけた</small></span>${schoolIcon('next')}</button>`:result?`<span>${schoolEsc(result)}</span>`:'<span class="school-route-note">3地点の先に、ボスが待つ。</span>'}</div></div></div><span class="school-ring school-ring-1" aria-hidden="true"></span><span class="school-ring school-ring-2" aria-hidden="true"></span><span class="school-ring school-ring-3" aria-hidden="true"></span><button class="school-explore" ${action} data-focus="explore"><span class="school-explore-icon">${schoolIcon(g.phase==='clear'?'next':'compass')}</span><strong>${label}</strong><span class="school-explore-arrow">${schoolIcon('next')}</span></button></div><div class="school-map-foot"><span>第${num}章 / 全${STAGES.length}章</span><button data-do="log">${schoolIcon('log')}探索の記録</button></div></section>`;
}
