<template>
  <div>
    <nuxt-content :document="index" />
  </div>
</template>

<script>
export default {
  async asyncData({ $content }) {
    const index = await $content('index').fetch()
    // console.log(index.toc)
    return {
      index,
    }
  },
}
</script>
