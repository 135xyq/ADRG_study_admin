<template>
  <div class="video-detail-container">
    video-detail
  </div>
</template>

<script>
export default {
  name: 'Detail',
  data() {
    return {
      articleId: ''// 视频id
    }
  },
  created() {
    if (JSON.stringify(this.$route.params) !== '{}') {
      this.articleId = this.$route.params.id
    }
    // 视频id为空则调回文章列表
    if (this.articleId === '') {
      this.$router.push({ name: 'VideoList' })
    }
  }
}
</script>

<style scoped>

</style>
