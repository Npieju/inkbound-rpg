# ジョブを参考にした育成の置き換え

2026-11-14。旧12技のツリーを撤去し、戦士・盗賊・守護者・魔術師の4系統を混成できる28ノードへ置き換えた。今回はユーザーの指定に従い初期数値を定めて実装。旧セーブの互換・移行処理は作らない。

- [世界樹Vのフェンサー（ATLUS公式）](https://atlus.com/etrian5/characters-fencer.html)：回避からの反撃、能力の伸ばし方と戦い方の接続を参照。今回の見切りは回避後に手動攻撃の最初の一発を必中会心にする。
- [Last Epochのスキル紹介](https://lastepoch.com/skills/)と[Healing Handsの公式ノード一覧](https://support.lastepoch.com/hc/en-us/articles/46362493169691-Paladin-Skill-Tree)：元の技の用途を変える分岐、攻撃・防壁・回復の接続を参照。今回は変化技を独立したセット候補にし、基本技と4枠を取り合う。
- [Grim Dawnの能力・スキルガイド](https://www.grimdawn.com/guide/character/character-basics/)と[誘発効果](https://www.grimdawn.com/guide/character/item-skills/)：能動・常時・修飾を区別し、能力と誘発条件をつなぐ考え方を参照。
- [Battle Brothersの開発記事](https://battlebrothersgame.com/dev-blog-16-progress-update-game-trailer/)：数値だけでなく戦い方を変える取得効果を設計基準にする考え方を参照。今回は撃破によるSP回収などへ落とし込む。当時の記事であり現在の製品仕様の再現とは扱わない。

ソロ・移動なし・マップ・戦闘終了時の全回復・XP直接投資・4枠編成はStickman RPGを参考にした従来の要件を維持。各作品の数値やツリーをそのまま複製したものではない。

数値・効果・前提は [design.md](design.md)。初期数値でプレイ可能にする段階であり、以前の旧ツリーに対する自動攻略比較は現行の根拠として使わず削除した。
