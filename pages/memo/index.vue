<template>
  <article>
    <h1>Memo</h1>
    <nuxt-link v-for="(article, index) in data" :key="index" :to="article.path">
      <p>{{ article.slug }}</p></nuxt-link
    >
  </article>
</template>
<script>
export default {
  async asyncData({ $content }) {
    const query = $content('memo', { deep: true }).sortBy('date', 'desc')
    const tech = await query.fetch()
    const data = tech.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date)
    })

    return {
      data,
    }
  },
}
</script>
