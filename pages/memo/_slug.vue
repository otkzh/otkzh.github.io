<template>
  <article>
    <NuxtContent :document="post" />
  </article>
</template>
<script>
export default {
  async asyncData({ $content, params }) {
    // URIから変数を取得 /memo/{_slug}
    const slug = params.slug
    return {
      // content/memo/{_slug}.mdのマークダウンを取得
      post: await $content('memo/' + slug).fetch(),
    }
  },
}
</script>
