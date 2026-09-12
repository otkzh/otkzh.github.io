---
title: モバイルでページ全体を縮ませないviewport設計
date: 2026-09-12
tags:
  - AI記事
  - CSS
  - モバイル
source: docs/technical-tips.md
---

# モバイルでページ全体を縮ませないviewport設計

スマートフォンで「カードだけでなくページ全体が小さくなった」ときは、カード幅より先にviewportを疑う。モバイルブラウザには、レイアウトに使う領域と、実際に見えている領域があり、拡大率が変わると両者の幅は一致しなくなる。

## 初期倍率を明示する

このサイトでは、次の指定を基本にしている。

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, viewport-fit=cover"
/>
```

`initial-scale=1`で初期倍率を明示し、`viewport-fit=cover`と`safe-area-inset-*`でノッチ周辺を扱う。ただし、`user-scalable=no`や小さな`maximum-scale`は指定しない。表示の安定と、利用者が文字を拡大できることは両立させたい。

## 横幅を数値で確認する

見た目だけでなく、`innerWidth`、`visualViewport.width`、`documentElement.scrollWidth`を比べる。通常はスクロール幅が`innerWidth`を超えず、意図しない操作で`visualViewport.scale`が変わらない状態が望ましい。タップ前だけでなく、アニメーション中と終了後も測ると、一瞬だけ生まれるはみ出しを見つけやすい。
