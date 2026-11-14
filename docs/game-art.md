# ゲーム用イラストとUI

2026-11-15。承認された人物原案から、組み込み画像生成で各1体の透明な立ち絵を制作した。

髪型、眼鏡、目元、立ち姿を識別点として残し、毛束、服の織り柄、刺繍、細かな陰影を整理。実行時素材は768px高のPNGを自己完結するSVGに格納し、探索画面と戦闘画面で共用する。原案とゲーム用立ち絵を混同しない。

- `public/characters/academy.svg`：長髪、赤紫のリボン、ケープと魔導書。
- `public/characters/library.svg`：短い黒髪、眼鏡、開いた本と鉛筆。
- `src/illustrated.ts`：絵を配置するマークアップ、静かな建築背景と敵の線画。

人物の輪郭色にUIを合わせ、学園は灰紫、図書館は青灰の色面に統一。探索は左に人物、右に4つの遭遇地点を置く。戦闘の通常コマンドは4列にして人物の高さを確保する。320×568、390×844の表示を確認。単一HTML版でも立ち絵が埋め込み画像から読み込まれることを確認した。

## 学園用・生成プロンプト

Edit the supplied character concept reference into a finished production GAME SPRITE. Reference is the design source, not a layout to reproduce. Output ONLY ONE full-body figure of the SAME academy heroine, on a genuinely transparent background. No portraits, sheet, extra figures, text, scenery, floor or shadow. Keep the long ash-rose/chestnut half-up hair, burgundy ribbon and side braids, subtle round spectacles, wistful half-lidded eyes, ivory blouse, lilac waistcoat and cape, plum pleated skirt, grey tights and lace-up boots, held mauve spellbook and small offered wrapped sweet. Preserve her charming reserved personality, graceful stance and fine anime face.

This is deliberate graphic simplification for a 180–240 pixel tall mobile RPG battle sprite, NOT a downsized detailed illustration. Approximately 5.5–6 heads tall, slender adolescent/adult anime proportions, no chibi or baby proportions. Main silhouette: long hair sweeps in two or three large curves, draped short cape, distinct narrow waist, pleated knee/calf-length skirt, long legs. Head slightly turned toward the right, body three-quarter view, book tucked in left arm, right hand extends the small sweet toward the right. Preserve hair part, expression, glasses and ribbon as identity anchors.

Rendering: clean Japanese anime game art with elegant economical DARK MAUVE OUTLINES, clearly designed large color shapes, TWO CEL SHADING VALUES PER MATERIAL, muted rose, dusty violet, warm ivory, burgundy. Flat opaque colors inside figure, fully opaque face and clothes, genuinely transparent outside. One or two broad highlights in hair; 6–8 hair clumps, not individual strands. Simple readable anime eyes with a restrained eyelash, not round dot eyes. Show only main skirt pleats, cuff and collar shapes, a single star clasp. Remove cloth texture, embroidery, ornamental book border, tiny chains, lace pattern, fine hatch shading, gradients, noise and painterly lighting. Boots simple with 2–3 lace marks. Keep crisp edges and expressive face while reducing detail. Entire silhouette comfortably inside canvas, including hair, fingers and feet. Single figure tightly framed with modest transparent margins, visually coherent at small scale. No white box or artificial checkerboard.

## 図書館用・生成プロンプト

Edit the provided library heroine reference into ONE transparent full-body mobile RPG sprite of the SAME woman. The reference is character identity only; do not reproduce the sheet layout or extra portraits. Preserve the asymmetric ink-black collarbone-length bob, silver geometric hair clip, small rectangular glasses, blue-grey half-lidded eyes, ivory blouse, slate-blue ribbon, dark fitted waistcoat and long pleated skirt, opaque tights, modest black ankle boots, open dark green book and pencil. Her personality is reserved, observant, intellectual and privately tender. Delicate Japanese anime girl, melancholy quiet face with a tiny subtle softness, not an expressionless doll.

This must be deliberately simplified GAME ART suitable for 180–240px on-screen height, not merely a detailed painting shrunk down. Approximately 5.5–6-head-tall graceful anime proportions, long slender legs, fine hands. Body three-quarter toward right, book held open near waist, pencil poised at a page, face looks slightly toward right/the opponent. Complete figure with hair and boots inside canvas, modest transparent margins. Keep the silhouette recognizable.

Use clean economical dark blue-grey linework, large flat opaque color shapes, at most TWO CEL SHADE VALUES per material, a restricted desaturated ink-blue/charcoal/ivory palette with one slate ribbon accent. Hair rendered in 5–7 main shaped clumps with 1–2 broad blue-violet highlights; no individual strand rendering. The same eye shapes and glasses, refined eyelash shapes, restrained mouth. Clothing: clear collar, cuffs, waistcoat edge, 5 main skirt pleats and 3 buttons. Remove cardigan knit patterns, lace patterns, tiny seams, book lettering and all decorative hatching, fabric grain, gradients, painterly illumination and noise. Glasses and facial expression must stay readable, no dot eyes. A loosely draped plain smoky-blue cardigan may remain behind one arm as ONE clean drapery shape. Single small bookmark/pressed blue flower if legible. No text, scenery, floor shadow, UI, border or additional face views. Actual alpha transparency outside the figure, fully opaque fills within. Do not turn her into chibi, a mascot, geometric SVG cartoon, giant-head SD character, or a sexy pose. Character charm comes from face, hair shape and poised posture.
