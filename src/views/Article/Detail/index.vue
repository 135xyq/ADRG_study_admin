<template>
  <div class="article-detail-contsiner">
    Article-Detail
  </div>
</template>

<script>
export default {
  name: 'Detail',
  data() {
    return {
      articleId: ''// 文章id
    }
  },
  created() {
    if (JSON.stringify(this.$route.params) !== '{}') {
      this.articleId = this.$route.params.id
    }
    // 文章id为空则调回文章列表
    if (this.articleId === '') {
      this.$router.push({ name: 'ArticleList' })
    }
  }
}
</script>

<style scoped>

</style>
