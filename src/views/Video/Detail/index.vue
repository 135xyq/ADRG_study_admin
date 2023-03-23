<template>
  <div class="video-detail-container">
    <h1 class="title">{{ video.title }}</h1>
    <div class="description">{{ video.description }}</div>
    <video :poster="video.thumbnail_url" :src="video.url" class="video-box" controls />
  </div>
</template>

<script>
// 视频详情页

import { videoDetail } from '@/api/video'

export default {
  name: 'Detail',
  data() {
    return {
      videoId: '', // 视频id
      video: {} // 视频详情
    }
  },
  async created() {
    if (JSON.stringify(this.$route.params) !== '{}') {
      this.videoId = this.$route.params.id
    }
    // 视频id为空则调回文章列表
    if (this.videoId === '') {
      this.$router.push({ name: 'VideoList' })
    } else {
      await this.getVideoDetail()
    }
  },
  methods: {
    async getVideoDetail() {
      const res = await videoDetail({ id: this.videoId })
      this.video = res.data
    }
  }
}
</script>

<style lang="scss" scoped>
.video-detail-container{
  width: 100%;
  .title{
    text-align: center;
  }
  .description{
    padding: 5px 20px;
  }
}
.video-box {
  margin: 20px auto;
  box-sizing: border-box;
  border: 0;
  display: block;
  width: 60%;
  outline: none !important;
}

</style>
