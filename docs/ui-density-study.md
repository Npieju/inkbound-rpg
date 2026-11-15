# ゲーム画面の描画密度を見直す

2026-11-15。

## 見た画面

- [レスレリアーナ公式・戦闘](https://www.gamecity.ne.jp/atelier/resleriana/assets/img/system_image_04_01.jpg)：行動アイコン、キャラ顔の小枠、状態やターンの列、メインのスキル表示を観察。大きな人物の絵と数字だけではなく、操作や情報にもそれぞれ固有の図像がある。
- [レスレリアーナ公式・育成](https://www.gamecity.ne.jp/atelier/resleriana/assets/img/system_image_06_01.jpg)：経験・素材・通貨の項目を、異なる描画と縁取りを持つカードとして見せている。人物とUIの間に図像の層がある。
- [オクトパストラベラー 大陸の覇者・公式説明書](https://www.jp.square-enix.com/octopathtraveler_SP/octo_manu_pc/)の戦闘・パーティ画面：小さなキャラと、能力・装備・コマンドを識別する枠や図像の組合せを見た。

以上から今回の画面に落とし込んだ判断は、描き込んだ人物を配置して色だけ合わせる方法では足りず、操作対象そのものを描く必要がある、というもの。これは比較からの設計判断であり、参照作品と同等の品質を達成したという評価ではない。

## 今回の変更

- 人物：長髪とリボン／短髪と眼鏡を残し、毛束・指・襞・服の皺・表情を大きな形に整理。探索中は小さく配置する。
- 地点：門、噴水、温室、鐘楼／机、書架、目録棚、書物を描いた。地点ごとに異なる絵を選ぶ。
- UIの図像：通貨、経験、能力5種、装備、道具、通常操作、メニュー、記録、収集品。魔法28件にも効果を表す図像を割り当てる。字形記号を図像の代用品にしない。
- 枠：章の紋章、区切り飾り、札、メダリオン、縁を重ねたパネル。人物・地点・UIを共通の輪郭と色面で描く。
- 構成：人物ポスター＋縦並びのボタンを、絵のある4地点を選ぶ地図へ変更。小さい画面では2段配置にする。技を選ぶときは戦闘の小さな残り枠を表示せず、コマンドの選択面にする。

図像は `src/game-ui-art.ts`、地点の構成は `atlasHtml`、人物は `public/characters/*.svg`。単一HTML版にもすべて含める。

## 人物の生成方法

組み込み画像生成で、前の人物から描線と色面をさらに減らした。PNGの解像度を落とすだけの処理とは分けて制作した。実行時は512px高へ縮小してSVG内に格納する。

### 学園の生成プロンプト

Transform this character into an EXTREMELY ECONOMICAL 2D Japanese RPG field sprite. This is a radical reduction of drawing complexity, NOT a polished standing illustration and NOT a slightly simplified painting. ONE full-body girl, actual transparent background. Keep identity: long rose-brown hair, half-up burgundy ribbon, small glasses, lilac cape, plum skirt, ivory sleeves, spellbook. 5-head-tall graceful proportions with long legs (not 2-head chibi). A quiet thoughtful sideways gaze.

Design as if hand-drawn for a game with illustrated icon buttons: ONE consistent dark outline, ONLY EIGHT opaque flat fill colors TOTAL, NO gradients and NO soft rendering. Each material is a single plain color, with at most ONE small hard-edge shadow on hair and face. Hair is 4 large continuous clumps, no loose strands or hair texture, no braid detail. Eyes: two small dark tapered anime shapes with one light dot each, no intricate eyelashes. Face: one curve for nose, one for mouth. Glasses are one simple curved line. Blouse: 2 sleeve shapes, no wrinkles, cuff frills or lace. Cape: 2 broad shapes with a single simple clasp dot. Skirt: one trapezoid silhouette and ONLY TWO pleat lines. Legs and boots: clean solid silhouettes, no laces or seams. Spellbook: one flat cover rectangle, one page edge line, tiny star stamp. Hand shapes simplified with thumb only; no separately rendered fingers. No sweets prop. Neutral 3/4 stance, book clasped to chest. Keep the person charming through asymmetrical bangs, ribbon, slightly tilted head and reserved expression. Sharply limited line count and clear blank color areas. Flat-color anime graphic / economical hand-drawn adventure-game sprite, readable at 120px tall, not tiny detailed illustration. No extra portraits, no display sheet, no words, no symbols floating outside, no floor, no shadow, no background. Transparent alpha outside, opaque fills inside.

### 図書館の生成プロンプト

Radically REDUCE this library heroine to an economical hand-drawn Japanese 2D RPG FIELD SPRITE. ONE figure only, actual transparent background. NOT a polished character illustration, NOT a detailed painting, NOT an expression sheet. Identity to preserve: short asymmetric blue-black bob, small silver diamond hairpin, small rectangular glasses, thoughtful blue-grey eyes, ivory blouse, slate ribbon, dark fitted waistcoat, long charcoal skirt, simple boots, open green book. 5-head-tall slender anime proportions, longer legs, not baby chibi. Body turns slightly toward right, head tilted to read, book held at waist.

STRICT GRAPHIC BUDGET: one consistent visible dark blue-grey outline; eight flat fill colors total; large blank areas of solid color. Hair is ONLY 4 shaped clumps and one flat highlight shape, no thin strands. Eyes are 2 simple tapered dark anime shapes with one light dot each. Eyebrows one line, mouth one tiny line, nose one curve. Glasses one thin rectangular shape. Sleeves are smooth broad shapes, NO frill, NO lace, NO cloth wrinkles. Waistcoat one shape with TWO button dots. Skirt one trapezoid with TWO crease lines. A single plain cardigan drape behind left forearm, no knit pattern. Boots plain, no laces. Hands simplified into thumb and one finger group; pencil ONE line, book TWO simple flat rectangles, no written text. No gradients, painterly lighting, skin rendering, fabric grain or ornamental details. At most one small hard-edge shadow on face. Make her quietly endearing and observant through face, hairstyle and posture alone. Thick enough outlines to read at 120px tall. Natural charm rather than a flat doll, keep a gentle reserved gaze. Full body and all shoes visible, compact composition with small transparent margins. No extra portraits, floor, background or floating symbols; transparent alpha outside silhouette, opaque fills within.
