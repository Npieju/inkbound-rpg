/** Presentation only: IDs, rules, costs and saves never depend on a world's vocabulary. */
import { ACADEMY, LIBRARY } from './storybook.ts';
import { storyScenery, storyFighter } from './storybook-art.ts';
export type SkinId = 'journal' | 'neon' | 'dojo' | 'academy' | 'library';
export interface WorldFind { name:string; detail:string; icon:'sweet'|'book'|'flower'|'key'; before?:string }
export interface Skin {
  id: SkinId; name: string; title: string; emblem: string; chapter: string;
  pitch: string; premise: string; hp: string; sp: string; money: string; xp: string;
  map: string; stats: string; skills: string; shop: string; rank: string;
  places: readonly string[]; scenes: readonly string[]; bosses: readonly string[];
  jobs: readonly string[]; jobIntros: readonly string[];
  skillNames: readonly string[]; itemNames: readonly string[];
  words: Record<string, string>; phrases: Record<string, string>;
  opening: string; victory: string; defeat: string; clear: string; complete: string;
  recovery: string; ending: string; next: string; themeColor: string;
  selectorLabel?:string; statsEyebrow?:string; shopEyebrow?:string;
  terminology?:Record<string,string>; enemyNames?:Record<string,string>;
  guide?:readonly (readonly [string,string])[];
  skillNotes?:Record<string,string>;
  collection?:{name:string; verb:string; entries:readonly WorldFind[]};
}
export const SKINS: readonly Skin[] = [
  {
    id:'journal', name:'遠征手帳', title:'辺境遠征録', emblem:'✥', chapter:'調査地',
    pitch:'街道を調べる冒険者。地図と手帳に、戦いの記録を残す。',
    premise:'街道の先で各地の主が旅人を阻んでいる。技を学び、装備を整え、辺境の調査を進める。',
    hp:'HP 体力', sp:'SP 気力', money:'金貨', xp:'経験',
    map:'地図', stats:'訓練', skills:'職業の技', shop:'露店', rank:'等級',
    places:['羊飼いの丘','樫の森','旧砦の跡','領主の城'],
    scenes:['丘を越える街道に、魔物と追いはぎが居ついた。','森の奥で呪術師が獣を集めている。','見捨てられた砦を、石の兵と騎士が守る。','城主と近衛隊が、街道の終点を塞いでいる。'],
    bosses:['丘の巨人','森の呪術師','砦の黒騎士','街道領主'],
    jobs:['戦士','斥候','護衛','術師'],
    jobIntros:['鎧を砕き、敵陣を薙ぐ。剣を主力に戦う者の技。','連撃で傷を重ね、隙を突く。身軽な探索者の技。','盾で受け、力を溜めて押し返す。隊商を守る者の技。','気力を魔法に変える。攻撃と手当てを学ぶ者の技。'],
    skillNames:['強斬','鎧砕き','薙ぎ払い','残心','断頭剣','勝鬨','窮地の力','三連斬','毒刃','刻み傷','見切り','傷口狙い','追い打ち','吸血の印','盾打ち','盾構え','返し刃','蓄勢','衝撃波','踏みとどまり','鉄壁','魔弾','治癒術','残り火','魔力還流','収束魔弾','護りの魔力','血の代償'],
    itemNames:['木剣','鉄剣','鋼の長剣','騎士の長剣','細身の剣','魔晶の剣','旅装','革の胴衣','鎖帷子','護符の外套','耐毒の胴衣','静心の法衣','軽業の外套'],
    words:{'ポーション':'傷薬','エーテル':'気付け薬','治療薬':'解毒の丸薬','防壁':'盾の守り','裂傷':'傷','蓄勢':'蓄勢','魔法威力':'魔法威力'},
    phrases:{
      '能力強化':'鍛錬','能力強化とスキル習得には同じXPを使います。':'旅で得た経験を、体の鍛錬にも職業の技にも使える。',
      '購入すると自動で装備します。購入済みの装備は付け替えられます。':'「仕入れた品だ。気に入ったら、その場で着けていきな」',
      '回復・治療アイテムは戦闘中に使用します。':'傷薬と気付け薬は戦いの最中に。戦いのあとは野営で手当てする。',
      '複数の系統から習得できます。タップで詳細を表示。':'職業をまたいで学べる。技の札を開いて確かめる。',
      '使用するスキル':'携える技','有効な常時効果':'身につけた心得','常時効果':'心得','派生技':'派生技','編成':'支度','ツリー':'伝授',
      '敵の情報':'街道の見張り報告','戦闘開始':'戦いに挑む','マップに戻る':'地図を閉じる','攻撃対象を選択':'狙う相手を選ぶ',
      '通常戦':'遭遇','ボス戦':'主との戦い','挑戦可能':'挑める','未解放':'未踏','3地点クリアで解放':'三戦の先に待つ','再戦':'再び戦う','撃破済み':'討伐済み',
      'ログ':'遠征記録','記録':'遠征記録','遊び方':'遠征の手引き','ステージの進め方':'街道を進む','能力とスキル':'経験を技に変える','戦闘と回復':'交戦と野営',
      'セーブデータを削除する':'遠征記録を消す','最初から始める':'新しい遠征を始める','育成の振り直し':'訓練をやり直す','振り直す':'学び直す',
      '攻撃':'斬る','逃げる':'退く','アイテム':'道具','スキル':'技','道具屋':'露店',
    },
    opening:'街道を調査する', victory:'遭遇を切り抜けた', defeat:'野営地へ退いた', clear:'この地の主を討伐した', complete:'街道の調査を終えた',
    recovery:'野営で手当て済み。HP・SPは一戦ごとに全回復。', ending:'四地域の主を討ち、街道の通行を取り戻した。遠征の記録は、この手帳に残る。', next:'次の調査地へ', themeColor:'#e9dfc7',
  },
  {
    id:'neon', name:'NEON DEPTHS', title:'NEON DEPTHS', emblem:'⌁', chapter:'SECTOR',
    pitch:'閉鎖都市の回収屋。機体を改造し、管理機の支配する地下へ。',
    premise:'地下都市の管理機が暴走した。回収屋の機体で四区画に侵入し、中枢までの経路を確保する。',
    hp:'HP 装甲', sp:'SP 電力', money:'Cr', xp:'データ',
    map:'区画図', stats:'機体改修', skills:'モジュール', shop:'補給所', rank:'機体LV',
    places:['外縁スクラップ街','培養プラント','旧防衛区画','管理中枢'],
    scenes:['回収ルート上に、自律警備機の反応。','培養槽から漏れた汚染体が通路を塞ぐ。','旧式の重装機が、防衛網を維持している。','中枢機が護衛ドローンを再起動した。'],
    bosses:['重機 BULL','汚染管制機 HEX','防衛機 CITADEL','統括機 REGENT'],
    jobs:['強襲','潜行','重装','電装'],
    jobIntros:['装甲を破り、前線を制圧する近接戦闘モジュール。','多段攻撃と腐食、回避と弱点射撃のモジュール。','シールドで衝撃を蓄え、反撃に転用するモジュール。','最大電力を火力と修復に変えるエネルギーモジュール。'],
    skillNames:['パワースラッシュ','アーマーブレイク','ワイドスイープ','追従ユニット','フィニッシャー','撃破充電','リミッター解除','トリプルエッジ','腐食ブレード','切断チップ','予測回避','損傷起爆','追加射撃','吸収回路','シールドバッシュ','初期シールド','迎撃ユニット','衝撃蓄電','パルス放出','緊急隔壁','多重シールド','プラズマ弾','自己修復','残留熱','回生充電','収束ビーム','電磁防壁','装甲転換'],
    itemNames:['回収ブレード','工業用カッター','強化ブレード','軍用ブレード','軽量エッジ','蓄電ブレード','作業スーツ','装甲ベスト','積層装甲','耐圧コート','耐腐食スーツ','安定化スーツ','機動スーツ'],
    words:{'ポーション':'修復パック','エーテル':'予備セル','治療薬':'除染キット','防壁':'シールド','裂傷':'切断損傷','燃焼':'過熱','毒':'腐食','会心':'弱点命中','魔法':'電撃','魔力':'電力','蓄勢':'蓄電','通常攻撃':'近接攻撃'},
    phrases:{
      '能力強化':'機体改修','能力強化とスキル習得には同じXPを使います。':'回収データで機体を改修するか、モジュールを解禁するか。',
      '購入すると自動で装備します。購入済みの装備は付け替えられます。':'回収屋のための補給ドック。購入した装備は即時換装。',
      '回復・治療アイテムは戦闘中に使用します。':'消耗品は交戦中に使用。帰還時に装甲と電力を全回復。',
      '複数の系統から習得できます。タップで詳細を表示。':'系統をまたいで接続可能。モジュールを選んで仕様を確認。',
      '使用するスキル':'接続モジュール','有効な常時効果':'稼働中のユニット','常時効果':'常駐ユニット','派生技':'拡張','編成':'接続','ツリー':'回路図',
      '敵の情報':'敵機スキャン','戦闘開始':'交戦開始','マップに戻る':'スキャンを閉じる','攻撃対象を選択':'ロック対象を選択',
      '通常戦':'交戦','ボス戦':'管理機との交戦','挑戦可能':'接続可能','未解放':'未接続','3地点クリアで解放':'3戦で回線開通','再戦':'再侵入','撃破済み':'停止確認',
      'ログ':'交戦履歴','記録':'交戦履歴','遊び方':'作戦ブリーフ','ステージの進め方':'区画への侵入','能力とスキル':'改修と接続','戦闘と回復':'交戦と修復',
      '中断した戦闘からマップに戻った。HP・SPが全回復した。':'中断した交戦を終了。ドックで修復・再充電した。',
      '城主が倒れた仲間を吸収し、攻撃力を上げた。':'統括機 REGENTが護衛機の残骸を回収。出力が上昇。',
      'セーブデータを削除する':'機体記録を初期化','最初から始める':'新規機体で出撃','育成の振り直し':'構成を初期化','振り直す':'再構成する',
      '攻撃':'斬撃','逃げる':'離脱','アイテム':'補給品','スキル':'モジュール','道具屋':'補給所',
      '体力':'装甲強度','精神力':'蓄電容量','攻撃力':'出力','防御力':'装甲値','素早さ':'機動性','武器':'兵装','防具':'外装',
      'HP・SPが全回復した。':'装甲修復・電力充填完了。','敗北した。HP・SPが全回復し、マップに戻った。':'機体停止。自動回収後に修復・再充電し、区画図へ帰還。',
      '逃走した。報酬はなし。HP・SPが全回復した。':'交戦離脱。回収品なし。ドックで修復・再充電完了。',
      '逃走に失敗した。':'離脱失敗。敵機が追従。',
    },
    opening:'侵入経路を選択', victory:'交戦終了・回収完了', defeat:'機体を回収した', clear:'管理機の停止を確認', complete:'都市中枢を制圧した',
    recovery:'交戦終了後、ドックでHP・SPを全回復。', ending:'全管理機の停止を確認。閉鎖されていた四区画に、回収ルートが通った。', next:'次区画に接続', themeColor:'#081621',
  },
  {
    id:'dojo', name:'武芸帳', title:'四門武芸帳', emblem:'武', chapter:'道場',
    pitch:'四つの道場を巡る武芸者。流派を越えて技を学び、師範に挑む。',
    premise:'剣、忍、盾、符術。流派を問わず技を修め、四つの道場の師範に挑む武者修行。',
    hp:'HP 体力', sp:'SP 気力', money:'文', xp:'修練',
    map:'道場', stats:'鍛錬', skills:'技の書', shop:'武具屋', rank:'段位',
    places:['青葉の道場','深山の道場','石垣の道場','本家の道場'],
    scenes:['門下生との三試合を経て、師範への挑戦が認められる。','毒と足運びを使う門人たちが、山の道場で待つ。','守りを固めた門人と、重鎧の師範が控える。','師範代と付き人の先に、総師範の試合場がある。'],
    bosses:['青葉の師範','深山の師範','石垣の師範','総師範'],
    jobs:['剣術','忍術','盾術','符術'],
    jobIntros:['鎧を断ち、間合いを薙ぐ。太刀を振るう者の系譜。','手数と毒を重ね、見切って返す。忍びの系譜。','盾で受け止め、衝撃を溜めて返す。守りの系譜。','気力を符に込め、火と癒やしを操る。術者の系譜。'],
    skillNames:['袈裟斬り','鎧割り','横薙ぎ','残心','兜割り','勝ち鬨','背水','三段斬り','毒塗り','傷刻み','見切り','傷口崩し','追い太刀','血気','盾当て','構え','返し','溜め','震脚','不動','金剛','火符','癒やしの符','燻り','気の巡り','重ね火符','護符','血判'],
    itemNames:['木刀','鉄刀','鋼の太刀','名匠の太刀','小太刀','霊刀','稽古着','革胴','鎖胴','護符の羽織','耐毒の胴着','静心の羽織','忍装束'],
    words:{'ポーション':'傷薬','エーテル':'気付け丸','治療薬':'解毒丸','防壁':'守り','魔法':'符術','魔力':'気','蓄勢':'溜め','通常攻撃':'打ち込み','スライム':'稽古人形'},
    phrases:{
      '能力強化':'鍛錬','能力強化とスキル習得には同じXPを使います。':'修練を積み、身を鍛えるか、新たな技を学ぶか。',
      '購入すると自動で装備します。購入済みの装備は付け替えられます。':'「刀も胴も揃っている。買った武具は、ここで身につけるといい」',
      '回復・治療アイテムは戦闘中に使用します。':'薬は試合中にも使える。一戦ごとに手当てを受けてから次へ。',
      '複数の系統から習得できます。タップで詳細を表示。':'流派を越えて学べる。札を開くと技の詳説を読める。',
      '使用するスキル':'試合に用いる技','有効な常時効果':'修めた心得','常時効果':'心得','派生技':'応用技','編成':'技組み','ツリー':'系譜',
      '敵の情報':'対戦相手','戦闘開始':'試合を申し込む','マップに戻る':'帳面に戻る','攻撃対象を選択':'相手を選ぶ',
      '通常戦':'試合','ボス戦':'師範との試合','挑戦可能':'手合わせ可','未解放':'未挑戦','3地点クリアで解放':'三勝の後に挑戦','再戦':'再試合','撃破済み':'勝利の印',
      'ログ':'試合記録','記録':'試合記録','遊び方':'修行の手引き','ステージの進め方':'道場に挑む','能力とスキル':'鍛錬と伝授','戦闘と回復':'試合と手当て',
      '中断した戦闘からマップに戻った。HP・SPが全回復した。':'中断した試合を終え、手当てを受けた。HP・SP全回復。',
      '城主が倒れた仲間を吸収し、攻撃力を上げた。':'総師範が倒れた付き人に代わって前に出た。攻撃力が上昇。',
      '仲間が倒れると1ターン使って攻撃力を上げる。こちらの消費SPを増やし、攻撃力も下げる。':'付き人が倒れると1ターンかけて構えを変え、攻撃力を上げる。こちらの消費SPを増やし、攻撃力も下げる。',
      'セーブデータを削除する':'修行の記録を消す','最初から始める':'新たな修行を始める','育成の振り直し':'修行をやり直す','振り直す':'学び直す',
      '攻撃':'打つ','逃げる':'退く','アイテム':'薬箱','スキル':'技','道具屋':'武具屋','防具':'胴衣',
      'HP・SPが全回復した。':'手当てを受け、HP・SPが全回復した。','敗北した。HP・SPが全回復し、マップに戻った。':'試合に敗れた。手当てを受け、HP・SPが全回復した。',
      '逃走した。報酬はなし。HP・SPが全回復した。':'試合を棄権した。報酬なし。手当てを受け、HP・SPが全回復した。','逃走に失敗した。':'間合いを切れず、退けなかった。',
    },
    opening:'門人との手合わせ', victory:'この試合、勝利', defeat:'この試合、敗北', clear:'師範に勝利した', complete:'四道場の師範に勝利した',
    recovery:'一戦ごとに手当てを受け、HP・SPが全回復。', ending:'四人の師範を破り、帳面に四つの勝利の印を受けた。', next:'次の道場へ', themeColor:'#ece7d9',
  },
  ACADEMY, LIBRARY,
];

const canonicalSkills = ['強斬','鎧砕き','薙ぎ払い','残心','処刑剣','戦意吸収','逆境','三連斬','毒刃','傷刻み','見切り','刈り取り','追撃','血の巡り','盾撃','守りの備え','反撃','蓄勢','解放撃','不退転','城壁','魔弾','応急治療','残火','魔力還流','魔力圧縮','魔力障壁','血の契り'];
const canonicalItems = ['木剣','鉄の剣','鋼の剣','騎士の剣','細剣','魔力の剣','布の服','革のベスト','鎖のベスト','ルーンの外套','耐毒のベスト','平静の衣','疾風のコート'];
const canonicalPlaces = ['草原','森','遺跡','城門'];
const canonicalBosses = ['草原の番人','森の呪術師','重装の騎士','城主'];
// One substitution pass prevents a translated name from being translated a second time.
const skinLexicons = new Map<SkinId, { words: Record<string,string>; pattern: RegExp }>();
export function getSkin(id: string | null | undefined): Skin { return SKINS.find(s=>s.id===id)??SKINS[0]; }
export const SKIN_STORAGE_KEY = 'inkbound-world';
export function readSkin(storage: Pick<Storage,'getItem'>): Skin { try { return getSkin(storage.getItem(SKIN_STORAGE_KEY)); } catch { return SKINS[0]; } }
export function rememberSkin(skin: Skin, storage: Pick<Storage,'setItem'>): void { try { storage.setItem(SKIN_STORAGE_KEY,skin.id); } catch { /* The world can still change for this session. */ } }

function lexicon(skin: Skin) {
  const cached=skinLexicons.get(skin.id); if(cached)return cached;
  const pairs=(keys:readonly string[],values:readonly string[])=>Object.fromEntries(keys.map((k,i)=>[k,values[i]]));
  const terms=['能力強化','常時効果','派生技','通常戦','ボス戦','体力','精神力','攻撃力','防御力','素早さ','武器','防具','道具屋'];
  const terminology:Record<string,string>=skin.id==='neon'?{'戦闘':'交戦','スキル':'モジュール','習得':'解禁','未セット':'未接続','セット':'接続','枠':'スロット','編成画面':'接続画面','ステージ':'区画','マップ':'区画図','物理':'近接','技の後':'攻撃後'}:skin.id==='dojo'?{'戦闘':'試合','未セット':'技なし','敵を倒すと':'相手に勝つと','敵：':'相手：','スキル':'技','ステージ':'道場','マップ':'道場図','セット':'用意','編成画面':'技組みの頁'}:{'スキル':'技','ステージ':'調査地','マップ':'地図','編成画面':'支度の頁'};
  const words:Record<string,string>={...skin.words,...terminology,...Object.fromEntries(terms.filter(t=>skin.phrases[t]).map(t=>[t,skin.phrases[t]])),...pairs(canonicalSkills,skin.skillNames),...pairs(canonicalItems,skin.itemNames),...pairs(canonicalPlaces,skin.places),...pairs(canonicalBosses,skin.bosses),...pairs(['戦士','守護者','魔術師'],[skin.jobs[0],skin.jobs[2],skin.jobs[3]])};
  const foeNames=skin.id==='neon'?{
    'スライム':'廃液ゲル','毒スライム':'汚染ゲル','狼':'追跡ドローン','盗賊の二人組':'回収機の二機編成','衛兵と手当て係':'警備機と修復機','毒スライムと狼':'汚染ゲルと追跡機','俊足の狩人':'高速警備機','森の祈祷隊':'プラントの保守機群','石のゴーレム':'防衛ゴーレム','影の剣士':'遮光ブレード機','遺跡の護衛隊':'旧型の警備機群','城門の衛兵':'中枢の警備機','妨害の魔術師':'妨害電装機','城の近衛隊':'中枢の護衛機群','近衛兵':'護衛ドローン','祈祷師':'電装機','治療師':'修復機','手当て係':'修復機','衛兵':'警備機','盗賊':'回収機',
  }:skin.id==='dojo'?{
    'スライム':'稽古人形','毒スライム':'毒仕込みの人形','狼':'山犬使い','盗賊の二人組':'二人の門下生','衛兵と手当て係':'門下生と薬師','毒スライムと狼':'毒人形と山犬使い','俊足の狩人':'俊足の門人','森の祈祷隊':'山の術者たち','石のゴーレム':'石の稽古人形','影の剣士':'黒衣の門人','遺跡の護衛隊':'石垣の門人たち','城門の衛兵':'本家の門下生','妨害の魔術師':'気封じの術者','城の近衛隊':'本家の師範代たち','近衛兵':'師範代','祈祷師':'符術使い','治療師':'薬師','手当て係':'薬師','衛兵':'門下生','盗賊':'忍び',
  }:{'盗賊の二人組':'追いはぎの二人組','盗賊':'追いはぎ'};
  Object.assign(words,foeNames,skin.terminology);
  // Names that contain a place or job must be mapped as a whole, not assembled from fragments.
  const foes=['短剣の盗賊','棒持ちの盗賊','草原の衛兵','森の狼','森の衛兵','森の治療師','毒牙の獣','遺跡の衛兵','遺跡の修復者','鉄壁の近衛','疾風の近衛','封印の魔術師'];
  const foeEdition=skin.id==='neon'?['切断アーム機','打撃アーム機','外縁警備機','追跡ドローン','プラント警備機','保守ドローン','腐食ドローン','旧型装甲機','修復ドローン','装甲護衛機','高速護衛機','妨害電装機']:skin.id==='dojo'?['短刀の門人','棒術の門人','青葉の門人','山犬使い','深山の門人','深山の薬師','毒使いの門人','石垣の門人','石垣の薬師','重装の師範代','俊足の師範代','気封じの術者']:['短剣の追いはぎ','棍棒の追いはぎ','丘の衛兵','森の狼','森の衛兵','森の薬師','毒牙の獣','砦の衛兵','砦の修復者','重装の近衛','俊足の近衛','気封じの術師'];
  Object.assign(words,pairs(foes,foeEdition),skin.enemyNames);
  const pattern=new RegExp(Object.keys(words).sort((a,b)=>b.length-a.length).map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'g');
  const result={words,pattern};skinLexicons.set(skin.id,result);return result;
}

/** Canonical UI and persisted rule messages enter here; world-authored copy never does. */
export function worldText(text: string, skin: Skin): string {
  const trimmed=text.trim();
  const ruleLabels:Record<string,readonly string[]>={
    '常時効果：習得すると自動で有効になります。':['心得：身につけると、戦いのたびに効果を発揮する。','常駐ユニット：解禁すると自動で稼働。接続スロットを使わない。','心得：修めると、試合のたびに効果を発揮する。'],
    '派生技：元の技と一緒にセットできます。':['派生技：元の技と並べて持ち込める。','拡張モジュール：元のモジュールと同時に接続可能。','応用技：元の技と組み合わせて試合に用意できる。'],
    '使用スキル：4つのスキル枠にセットして使います。':['使用技：4つの枠にセットし、戦いに持ち込む。','起動モジュール：4つの接続スロットに装着して使う。','使用技：4つの枠に用意して、試合中に使う。'],
    '同じ技を複数の枠にセットできます。待ち時間は枠ごとに数えます。1Tなら、別の行動を1回挟むと再使用できます。':['同じ技を複数の枠に携えられる。待ち時間は枠ごとに数える。1Tなら、他の行動を1回挟むと再使用できる。','同型モジュールの重複接続が可能。再起動待ちはスロットごとに独立。1Tなら、別の行動1回で再使用可能。','同じ技を複数の枠に用意できる。待ち時間は枠ごとに数える。1Tなら、他の行動を1回挟むと再使用できる。'],
    '敵をすべて倒すと勝利です。戦闘中は敵の名前をタップして攻撃対象を選びます。':['相手をすべて倒せば勝利。戦いの最中にも、敵の名を選んで狙いを変えられる。','敵機をすべて停止させれば交戦終了。敵機名を選択してロックを切り替える。','相手全員に勝てば試合終了。相手の名を選ぶと、狙いを変えられる。'],
    '常時効果は習得すると有効になります。スキル枠へのセットは不要です。':['心得は学ぶだけで身につく。携える技の枠は使わない。','常駐ユニットは解禁時に自動で稼働。接続スロットを消費しない。','心得は修めるだけで身につく。技の枠を用意する必要はない。'],
  };
  const edition=SKINS.indexOf(skin);
  // Full sentences are authored for each world, rather than created by changing nouns.
  if(skin.phrases[trimmed])return text.replace(trimmed,skin.phrases[trimmed]);
  if(ruleLabels[trimmed]?.[edition])return text.replace(trimmed,ruleLabels[trimmed][edition]);
  let narration=text;
  if(skin.id==='neon') narration=narration
    .replace(/^戦闘開始：/,'交戦記録：')
    .replace(/^勝利。(\d+)Gと(\d+)XPを獲得。HP・SPが全回復した。$/,'交戦終了。$1Cr／$2データ回収。修復・再充電完了。')
    .replace(/を倒した。$/,'の停止を確認。')
    .replace(/初期XP：40。能力強化とスキル習得に使用できます。/,'初期データ：40。改修とモジュール解禁に使用可能。');
  if(skin.id==='dojo') narration=narration
    .replace(/^戦闘開始：/,'手合わせ：')
    .replace(/^勝利。(\d+)Gと(\d+)XPを獲得。HP・SPが全回復した。$/,'勝利。報奨$1文、修練$2を得た。手当てを受け、HP・SP全回復。')
    .replace(/を倒した。$/,'に勝った。')
    .replace(/初期XP：40。能力強化とスキル習得に使用できます。/,'修練40から始める。鍛錬にも、技の伝授にも使える。');
  if(skin.id==='academy') narration=narration
    .replace(/^戦闘開始：/,'おさわがせ発見：')
    .replace(/^勝利。(\d+)Gと(\d+)XPを獲得。HP・SPが全回復した。$/,'騒ぎはおしまい！ おこづかい$1枚、ひらめき$2。保健室でHP・SP全回復。')
    .replace(/を倒した。$/,'は、おとなしくなった。')
    .replace(/初期XP：40。能力強化とスキル習得に使用できます。/,'入学祝いのひらめき40。まずは授業で魔法を覚えよう。');
  if(skin.id==='library') narration=narration
    .replace(/^戦闘開始：/,'書き換え箇所：')
    .replace(/^勝利。(\d+)Gと(\d+)XPを獲得。HP・SPが全回復した。$/,'本文を復元。蔵書票$1枚、知見$2。閲覧室でHP・SP全回復。')
    .replace(/^(.+?)：(.+?)に(\d+)ダメージ。$/,'$1：$2のノイズを$3除去。')
    .replace(/^(.+?)の攻撃：(\d+)ダメージ。$/,'$1の雑音が侵入。余力−$2。')
    .replace(/を倒した。$/,'が、本来の言葉を取り戻した。')
    .replace(/初期XP：40。能力強化とスキル習得に使用できます。/,'最初の知見40。論理を鍛えるか、まだ読める言葉を覚えるか。');
  const {words,pattern}=lexicon(skin);
  return narration.replace(pattern,k=>words[k]).replace(/XP/g,skin.xp).replace(/(\d|\s)G\b/g,`$1${skin.money}`);
}

export function worldGuide(skin: Skin): readonly (readonly [string,string])[] {
  if(skin.guide)return skin.guide;
  return skin.id==='neon'?[
    ['区画への侵入','区画図の反応を選び、敵機をスキャンする。3交戦を突破すると管理機への回線が開く。通過済みの交戦地点にも再侵入できる。'],
    ['改修と接続','戦闘データは機体の改修とモジュール解禁に使う。4系統を混用可能。起動モジュールは4つのスロットに接続し、常駐ユニットは解禁するだけで稼働する。'],
    ['交戦と修復','こちらの行動後、生存中の敵機が動く。モジュールも補給品も1ターンを使う。交戦が終わるたびにドックでHP・SPを全回復する。'],
  ]:skin.id==='dojo'?[
    ['道場に挑む','帳面の札から相手を選ぶ。門人との三試合に勝つと、その道場の師範に挑める。勝った相手にも再び手合わせを申し込める。'],
    ['鍛錬と伝授','修練は身を鍛えるためにも、技を学ぶためにも使える。四流派をまたいで学んでよい。使用技は4つの枠に用意し、心得は修めるだけで身につく。'],
    ['試合と手当て','こちらが動くと、残った相手も動く。技や薬の使用も1ターン。一戦が終わるたびに手当てを受け、HP・SPを全回復して次へ向かう。'],
  ]:[
    ['街道を進む','地図の印を開いて、相手を確かめる。三つの遭遇を切り抜けると、この地の主に挑める。通った地点でも再び戦える。'],
    ['経験を技に変える','旅で得た経験は、体の鍛錬にも職業の技にも使える。職業をまたいで学んでよい。使用技は4つの枠に携え、心得は学ぶだけで身につく。'],
    ['交戦と野営','こちらが動くと、生き残った敵も動く。技や道具の使用も1ターン。戦いのあとは野営で手当てを受け、HP・SPを全回復する。'],
  ];
}

/** Present text nodes and accessible labels alike; never touch action IDs, values or markup. */
export function presentWorld(root: HTMLElement, skin: Skin): void {
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  let node:Node|null;
  while((node=walker.nextNode())) {
    if(node.parentElement?.closest('[data-world-authored]'))continue;
    node.textContent=worldText(node.textContent??'',skin);
  }
  root.querySelectorAll<HTMLElement>('[aria-label]').forEach(el=>{
    if(!el.closest('[data-world-authored]'))el.setAttribute('aria-label',worldText(el.getAttribute('aria-label')??'',skin));
  });
}

export function worldScenery(skin: Skin, stage: number, restored=0): string {
  if(skin.id==='academy'||skin.id==='library')return storyScenery(skin.id,stage,restored);
  if(skin.id==='journal')return `<svg class="world-art journal-art" viewBox="0 0 400 360" preserveAspectRatio="none" aria-hidden="true"><defs><pattern id="contour" width="90" height="80" patternUnits="userSpaceOnUse"><path d="M-20 40Q20-20 60 30T140 40M-20 52Q20-8 60 42T140 52M-20 64Q20 4 60 54T140 64" fill="none" stroke="currentColor" stroke-width=".6" opacity=".16"/></pattern></defs><rect width="400" height="360" fill="url(#contour)"/><path d="M0 210Q100 180 150 260T400 290" fill="none" stroke="currentColor" stroke-width="14" opacity=".09"/><g fill="none" stroke="currentColor" opacity=".23"><path d="m33 94 12-25 12 25Zm12-7v19m260 150 12-25 12 25Zm12-7v19m-55 5 10-21 10 21Zm10-5v13"/><path d="M285 45v-18h25v18m-29 0h33m-17-16v-13m-15 18v-8m32 8v-8"/><circle cx="52" cy="300" r="22"/><path d="m52 270 6 30-6 30-6-30Zm-30 30h60"/></g><text x="52" y="266" text-anchor="middle" fill="currentColor" font-size="11">N</text><path d="M200 0v360M0 180h400" stroke="currentColor" opacity=".09"/><text x="20" y="24" fill="currentColor" font-size="10" opacity=".5">FIELD NOTES / 0${stage+1}</text></svg>`;
  if(skin.id==='neon')return `<svg class="world-art neon-art" viewBox="0 0 400 360" preserveAspectRatio="none" aria-hidden="true"><defs><pattern id="sector-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="currentColor" stroke-width=".5" opacity=".18"/></pattern></defs><rect width="400" height="360" fill="url(#sector-grid)"/><g fill="none" stroke="currentColor" opacity=".27"><path d="M15 15h65l20 20h80v35h70l20-20h110v125h-40v110h-70v55H110v-35H20V190h35V85H15Z"/><path d="M25 25h50m300 0h-50M25 335h50m300 0h-50M200 0v360M0 180h400" stroke-dasharray="3 6"/><rect x="145" y="114" width="75" height="38"/><rect x="28" y="242" width="52" height="30"/><path d="m304 290 15-26 15 26Z"/></g><text x="18" y="43" fill="currentColor" font-size="10" opacity=".7">DEPTH 0${stage+1} // SIGNAL ACTIVE</text><circle class="radar-sweep" cx="297" cy="83" r="38" fill="none" stroke="currentColor" opacity=".12"/></svg>`;
  return `<svg class="world-art dojo-art" viewBox="0 0 400 360" preserveAspectRatio="none" aria-hidden="true"><defs><pattern id="paper-lines" width="400" height="28" patternUnits="userSpaceOnUse"><path d="M0 27h400" stroke="currentColor" opacity=".07"/></pattern></defs><rect width="400" height="360" fill="url(#paper-lines)"/><circle cx="302" cy="78" r="51" fill="currentColor" opacity=".045"/><g fill="none" stroke="currentColor" opacity=".18"><path d="M30 312Q42 198 25 90m13 146 23-30m-25 7-22-35m17 1 27-29m-29 0-16-35m10-4 24-24" stroke-width="4"/><path d="M254 44h90m-80 9h70m-60 0v48m50-48v48M258 74h82" stroke-width="4"/><path d="M80 340h280M100 334h240" stroke-width="2"/></g><text x="375" y="170" fill="currentColor" opacity=".2" font-size="22" writing-mode="tb">手合わせ之図</text><path d="M72 15h260M72 21h260" stroke="currentColor" opacity=".12"/></svg>`;
}

export function worldFighter(skin: Skin, enemy=false, boss=false, kind=1, foeId=''): string {
  if(skin.id==='academy'||skin.id==='library')return storyFighter(skin.id,enemy,boss,foeId);
  if(skin.id==='journal')return ''; // The original line-drawn traveller belongs to the field journal.
  if(skin.id==='neon')return `<svg viewBox="0 0 140 160" aria-hidden="true" class="machine ${enemy?'hostile':''}"><ellipse cx="70" cy="150" rx="42" ry="5" fill="currentColor" opacity=".15"/><g stroke="currentColor" fill="var(--paper)" stroke-width="2.5" stroke-linejoin="bevel">${enemy&&kind===0&&!boss?'<path d="m22 111 15-35h66l15 35-14 30H36Z"/><path d="M40 92h60M35 124h70"/><circle cx="70" cy="108" r="12"/><path d="m14 104 10 12m102-12-10 12"/>':'<path d="m50 34 8-12h26l8 12-5 27H54Z"/><path d="M58 40h27" stroke-width="5"/><path d="m48 69 40-3 11 42-51 4Z"/><path d="m55 113-11 30h17l11-27m10-3 13 31h17l-15-39M45 75l-20 24 8 22 12-5-5-15 16-15m42-11 15 26 15-10M118 95l10-42-9-16-10 48Z"/><path d="M59 76h20v22H59Z"/>'}${boss?'<path d="m38 29 9-14 12 8 14-17 12 17 13-10 9 21M38 64l-14 13 12 22m68-33 16 12-10 23" stroke-width="4"/>':''}</g></svg>`;
  return `<svg viewBox="0 0 140 160" aria-hidden="true" class="ink-fighter ${enemy?'opponent':''}"><ellipse cx="70" cy="152" rx="40" ry="4" fill="currentColor" opacity=".1"/><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="70" cy="40" r="16" stroke-width="4"/><path d="M53 37q17-14 34 0M58 27l-5-10m6 8 11-8" stroke-width="5"/><path d="m54 64 29-3 8 39-41 1Zm5 40-18 41m28-41 26 42M52 70l-20 31 13 13m38-45 17 24 13-13" stroke-width="6"/><path d="m108 82 17-45m-23 41 14 7M45 103l48-3" stroke-width="3"/>${boss?'<path d="M48 63l-12 46 18-4m33-44 17 51-16-7M50 55l38 1" stroke-width="4"/>':''}</g><path d="m51 78 34-2-3 22H53Z" fill="var(--accent)" opacity=".6"/></svg>`;
}
