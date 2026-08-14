# ジャソケソバトラー

**v0.2.0 Prototype** — 相手の発言を読み、嘘を見抜いて勝ち抜く心理戦じゃんけんカードバトル。

🎮 **プレイ**

- GitHub Pages: https://kouheyhey.github.io/logiQuiz/
- itch.io: https://murikocreation.itch.io/jasokesobattler

## ゲーム内容

グー・チョキ・パーは何度でも使用できます。相手の特徴、使える手、勝負前の一言を読み、出すカードを選んでください。

- あいこでライフを0.5、敗北でライフを1失う
- 最初の相手はグーだけを出すチュートリアル
- 通常敵を3〜5人倒すと強敵が出現
- 強敵は2回勝つと撃破。ライフが0.5回復し、「グチョパ」を1枚獲得
- グチョパは通常のすべての手に勝つ使い切りカード
- ライフが0になるとゲームオーバー。リトライで最初から再挑戦

## 操作

- スマートフォン: 出したいカードをタップ
- PC: 出したいカードをクリック

## 開発

```bash
npm ci
npm run dev
npm test
npm run build
npm run build:itch
```

ゲームルールの正本は [docs/game-design.md](docs/game-design.md) です。

## デプロイ

`main`へのpushでGitHub Actionsが自動ビルドし、GitHub Pagesへ公開します。

itch.io向けの説明文、カバー画像、リリースノート、HTML5 ZIPは `release/` にまとめています。ButlerのHTML5チャンネルへは `npm run build:itch` の成果物を配信します。

結果演出の比較モックは、公開URLへ `?view=animation-mock` を付けると開けます。
