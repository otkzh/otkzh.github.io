# 技術TIPS

この文書は、デジタル名刺をAstroとCSSで実装・保守するときの実践的な注意点をまとめたものです。設計判断は[開発方針](./development-policy.md)を参照してください。

## 基本構成

- Astroで静的HTMLを生成し、GitHub Pagesへ配置する
- 共通の`head`、viewport、フォントは`src/layouts/BaseLayout.astro`で管理する
- トップページのカード、ページ切り替え、端末傾きは`src/pages/index.astro`で管理する
- Memo共通枠は`src/layouts/MemoLayout.astro`で管理する
- 静的ファイルとfaviconは`public/`へ置く

## モバイルviewport

viewportは次の指定を基本にします。

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, viewport-fit=cover"
/>
```

- `width=device-width`: レイアウトviewportを端末幅に合わせる
- `initial-scale=1`: 初期倍率を明示し、変形中の描画領域を基準に縮小される余地を減らす
- `viewport-fit=cover`: ノッチを含む画面で`safe-area-inset-*`を利用できるようにする
- `maximum-scale=1`や`user-scalable=no`は指定せず、利用者の拡大操作を残す

ルートとカード外枠には横方向の封じ込めも設定します。

```css
html,
body.home {
  width: 100%;
  max-width: 100%;
  overflow-x: clip;
}

.mobile-card-shell,
.card-scene {
  overflow: clip;
}

.card-scene {
  contain: paint;
  isolation: isolate;
}
```

`overflow: hidden`だけで済ませるとスクロールコンテナを作る場合があります。横方向の描画だけを切りたい場所では`overflow: clip`を優先します。

## 高さと安全領域

モバイルブラウザのアドレスバーは表示中に高さが変わるため、固定カードの高さには`100vh`ではなく`100dvh`を使います。

```css
.mobile-card-shell {
  height: 100dvh;
  padding: max(0.5rem, env(safe-area-inset-top))
    max(0.5rem, env(safe-area-inset-right))
    max(0.5rem, env(safe-area-inset-bottom))
    max(0.5rem, env(safe-area-inset-left));
}
```

横位置は高さが小さくなるので、幅のメディアクエリだけでは判定しません。

```css
@media (orientation: landscape) and (max-height: 560px),
  (min-width: 721px) {
  /* 横型名刺レイアウト */
}
```

特に横長の端末は`min-aspect-ratio: 2 / 1`で列比率を調整できます。

## 3Dページめくりを安全に使う

カード全体とカード面を同時に3D変形すると、Chrome on Androidで合成レイヤーの描画範囲が一時的にviewportより大きくなることがあります。カード全体は固定し、ページ面だけを枠内で回転させます。

```css
.card-scene {
  overflow: clip;
  contain: paint;
  perspective: 1800px;
}

.business-card {
  position: relative;
  width: 100%;
  height: 100%;
}

.card-face.is-exiting-next {
  transform: rotateY(-88deg) scale(0.99);
  transform-origin: left center;
}

.card-face.is-exiting-previous {
  transform: rotateY(88deg) scale(0.99);
  transform-origin: right center;
}
```

安全上の要点は次のとおりです。

- `translateX()`を回転と併用してカード枠外へ出さない
- 90度を大きく超える回転を避ける
- `transform`を親子で重ねすぎない
- アニメーション終了後に一時クラスを必ず外す
- `prefers-reduced-motion`ではtransitionを停止する

## 左右タップとスワイプ

タップ方向はカードの境界を基準に判定します。

```ts
const bounds = card.getBoundingClientRect()
const direction = event.clientX < bounds.left + bounds.width / 2 ? -1 : 1
turnCard(direction)
```

操作がリンク上で始まった場合はカードをめくらないようにします。

```ts
if ((event.target as HTMLElement).closest('a')) return
```

スワイプは小さな指ぶれを誤認しないよう、移動量と縦横比の両方で判定します。

```ts
const isSwipe = Math.abs(deltaX) > 36 && Math.abs(deltaX) > Math.abs(deltaY)
const isTap = Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8
```

カードには`touch-action: pan-y pinch-zoom`を指定し、縦方向の標準操作とピンチズームを残します。

## URLとページ状態の同期

カードのページ名を配列で管理し、ページ変更時に`history.replaceState()`でURLへ反映します。

- プロフィール: `/`
- 活動: `/?card=activity`
- Memo: `/?card=memo`

初期表示時にもクエリを読み、該当面を直接表示します。`/redirect/`は静的HTMLから`/?card=activity`へ遷移させることで、GitHub Pagesでもサーバー側リダイレクトを必要としません。

## 端末傾きは装飾だけに使う

`deviceorientation`は端末やブラウザによって利用可否と許可方法が異なります。機能の成立条件にせず、progressive enhancementとして扱います。

- 初回操作後にセンサー利用を開始する
- iOS系の`requestPermission()`がある場合だけ許可を要求する
- 未対応、拒否、例外時は通常表示を維持する
- 傾きでviewport、幅、高さ、カード全体の`transform`を変更しない
- CSSカスタムプロパティで反射位置を変え、`data-lean`で縁や影を変える程度に留める
- `prefers-reduced-motion`ではセンサー演出を開始しない

最初のセンサー値を基準値として保存し、差分を上限付きで使うと、端末の持ち方による急な変化を防げます。

## 共通フッター

SNSフッターは各カード面へ複製せず、`.card-inner`の外側かつ`.business-card`の内側へ1つだけ置きます。

この構成には次の利点があります。

- ページ切り替え中も連絡先が消えない
- リンクの重複を避けられる
- 非表示面の`tabIndex`制御から独立できる
- `data-page`に応じて背景、罫線、アイコン色を切り替えられる

フッターは本文に重ねるのではなく、カード面の下余白をフッター高以上に確保します。活動面のようなスクロール領域では、フッター背景を不透明にして背後のリンクを見せないようにします。

## 非表示ページのアクセシビリティ

非表示のカード面には`aria-hidden="true"`を設定し、内部リンクを`tabIndex = -1`にします。表示面だけを`tabIndex = 0`へ戻します。

SNSフッターは常時表示されるため、この切り替え対象に含めません。アイコンのみのリンクには、メールアドレスやアカウント名を含む`aria-label`を設定します。

## フォント

- 縦型の本文: `Zen Kaku Gothic New`
- 横型の日本語見出し・本文: `Shippori Mincho`
- 英数字、番号、操作ラベル: `Space Grotesk`

Google Fontsは`BaseLayout.astro`でまとめて読み込みます。ウェイトを追加すると転送量が増えるため、実際に使用するウェイトだけを指定します。

## 実機に近い検証

最低限、次の画面サイズを確認します。

| 用途 | viewport |
| --- | --- |
| スマートフォン縦 | 390×844 |
| Pixel 6a相当 | 412×915 |
| 超横長スマートフォン | 932×360 |
| PC | 1280×900 |

表示だけでなく、ページめくり中と完了後の値も確認します。

```js
({
  innerWidth,
  visualWidth: visualViewport?.width,
  scale: visualViewport?.scale,
  rootScrollWidth: document.documentElement.scrollWidth,
  bodyScrollWidth: document.body.scrollWidth,
})
```

正常時は次を満たします。

- `visualViewport.scale`が意図せず変わらない
- `rootScrollWidth`と`bodyScrollWidth`が`innerWidth`を超えない
- タップ中と終了後でviewport幅が変わらない
- フッターが本文リンクを隠さない

エミュレーションで再現しない場合は、実機の機種、OS、ブラウザ、文字サイズ、表示サイズ、画面の向き、再現操作を記録します。

## チェックとビルド

変更後は次を実行します。

```bash
npm run check
npm run build
git diff --check
```

`npm run check`が成功しても、3D変形、固定フッター、ブラウザUIを含む高さは実表示で確認する必要があります。

## よくある問題

### タップ後にページ全体が縮小する

確認する項目:

1. viewportに`initial-scale=1`があるか
2. 変形中の要素が横へはみ出していないか
3. 親と子へ3D transformを重ねていないか
4. `rootScrollWidth`が`innerWidth`を超えていないか
5. 端末傾きの開始タイミングとページめくりが重なっていないか

### フッターと本文が重なる

- カード面の下paddingをフッター高より大きくする
- スクロール面のフッターを不透明にする
- フッターをカード面ごとに複製せず、共通レイヤーへ置く

### リンクを押すとカードもめくれる

- `pointerup`の先頭で`closest('a')`を確認する
- 共通フッターのリンクだけ`pointer-events: auto`にし、フッターの空白部分はカード操作へ渡す
