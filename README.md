# otkzh.github.io

[https://otkzh.github.io/](https://otkzh.github.io/)

Astro で生成する個人サイト兼ウェブツール置き場です。

## Build Setup

```bash
# Node.js 22.12.0以上を使用
# 依存関係をインストール
$ npm ci

# serve with hot reload at localhost:3000
$ npm run dev

# 型とAstroテンプレートを検査
$ npm run check

# dist/へ静的サイトを生成
$ npm run build
```

## Project structure

- `src/pages/`: Astro のページ
- `src/content/`: メモの Markdown
- `src/layouts/`: 共通レイアウト
- `public/`: 地図や変換ツールなどの単体 HTML と静的ファイル
- `docs/development-policy.md`: 情報設計、レスポンシブ、操作、品質の開発方針
- `docs/technical-tips.md`: viewport、3D演出、端末傾き、検証方法の技術TIPS
- `docs/typography.md`: 文字サイズと可読性の基準・調整履歴
