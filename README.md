# otkzh.github.io

[https://otkzh.github.io/](https://otkzh.github.io/)

Astro で生成する個人サイト兼ウェブツール置き場です。

## Build Setup

```bash
# Node.js 22.12.0以上を使用
# 依存関係をインストール
$ npm ci

# serve with hot reload at localhost:4321
$ npm run dev

# 型とAstroテンプレートを検査
$ npm run check

# dist/へ静的サイトを生成
$ npm run build
```

## Project structure

- `src/pages/`: Astro のページ
- `src/content/`: Fragmentsの Markdown
- `src/layouts/`: 共通レイアウト
- `public/`: 地図や変換ツールなどの単体 HTML と静的ファイル
- `docs/development-policy.md`: 情報設計、レスポンシブ、操作、品質の開発方針
- `docs/technical-tips.md`: viewport、3D演出、端末傾き、検証方法の技術TIPS
- `docs/typography.md`: 文字サイズと可読性の基準・調整履歴

## Fragmentsと開発記録

記事は`src/content/fragments/`へ追加します。日時・タイトル・サマリーの指定方法と開発意図の残し方は[記事の書き方](docs/fragments-authoring.md)を参照してください。

変更はローカルで確認してから共有します。明示的な依頼なしにコミット・pushは行いません。
