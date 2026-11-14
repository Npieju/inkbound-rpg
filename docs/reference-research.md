# Stickman RPGの参照記録

現行仕様は [design.md](design.md)、今回の育成の参照元と実装は [reference-implementation.md](reference-implementation.md)。

ユーザーの指定は、マップとソロの手軽さをIに寄せ、育成はII・IIIの進化も参考にすること。移動なし、固定マップ、XP直接投資、4枠編成、戦闘終了時のHP/SP全回復を維持する。

- [初代の保存されたアプリ説明](https://stickman-rpg.appstor.io/)
- [初代のプレイ記事](https://dotapps.jp/static/articles/qqfs7fmfjbn4pnqf)：5能力とスキルへの投資、SPと待機時間、4枠編成を確認。
- [IIの強化を組み合わせる攻略投稿](https://gamefaqs.gamespot.com/boards/714700-stickman-rpg-ii/70220928)
- [IIの低消費技と回復の攻略投稿](https://gamefaqs.gamespot.com/boards/714700-stickman-rpg-ii/67941751)

攻略投稿はプレイヤーの記録であり作者の仕様書ではない。これらの攻略の完成形をそのまま初期ツリーに並べた旧実装は撤去した。HP全回復は「戦闘が終わるとHPも全回復する」というユーザーの補足を要件として採用。原作の全数値を実機で再現確認したとは扱わない。
