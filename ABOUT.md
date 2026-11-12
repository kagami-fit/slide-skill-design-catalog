# スライドスキル デザインカタログ

## 一言で言うと

スライド生成スキルごとのデザイン傾向を、実生成画像・参照トーン・スタイル見本で見比べられる静的HTMLサイトです。
GitHub Pagesで公開できるよう、画像素材もすべてこのフォルダ内に同梱しています。

## 何ができるのか

- 23種類のスライド生成スキル、150枚分の実生成画像を一覧表示
- スキル名、用途、色、タグで検索・絞り込み
- 各スキルの実生成画像を、1枚ずつ大きなビューで確認
- 参照トーン、生成結果のコンタクトシートも大判ビューとライトボックスで確認
- サムネイル、前後ボタン、表示タブで詳細画像を切り替え
- ブラウザだけで閲覧でき、ビルド処理なしでGitHub Pagesに公開可能

## 構成

- `index.html` — サイト本体
- `styles.css` — レイアウトと見た目
- `data.js` — スキル名、用途、色、画像パスなどのカタログデータ
- `app.js` — 検索、絞り込み、大判ギャラリー、詳細表示、ライトボックスの動作
- `assets/all-skills-expanded-contact-sheet.jpg` — 全体比較のメイン画像
- `assets/catalog/` — 各スキルの参照トーン、生成結果、個別スライド画像
- `.nojekyll` — GitHub Pagesで静的ファイルをそのまま配信するための空ファイル

## 使い方

ローカルで確認する場合は、`index.html` をブラウザで開きます。

```bash
open "/Users/hayatokagami/Documents/Codex/slide-skill-design-catalog/index.html"
```

GitHub Pagesでは、リポジトリの `main` ブランチ直下を公開元にします。

## 状態

- `slide-skill-design-catalog/` — 稼働中。静的HTMLサイトとして閲覧可能
- `assets/` — 稼働中。GitHub公開用に必要な画像を同梱済み
- 大判ギャラリービュー — 稼働中。生成スライド、参照画像、生成一覧を切り替えて確認可能
- GitHub公開 — 設定後、GitHub Pages URLから閲覧可能
