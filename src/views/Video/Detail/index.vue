<template>
  <div class="video-detail-container">
    <h1 class="title">{{ video.title }}</h1>
    <div class="info">
      <div class="item">
        观看次数：{{ video.view_count }}
      </div>
      <div class="item" @click="onHandleGoToPage('StarList')">
        <el-link :style="{fontSize:'18px'}">收藏数：{{ video.star_count }}</el-link>
      </div>
      <div class="item" @click="onHandleGoToPage('LikeList')">
        <el-link :style="{fontSize:'18px'}">点赞数：{{ video.like_count }}</el-link>
      </div>
      <div class="item" @click="onHandleGoToPage('CommentList')">
        <el-link :style="{fontSize:'18px'}">评论数：{{ video.comment_count }}</el-link>
      </div>
      <div class="item">视频时长：{{ formateDate(video.duration) }}
      </div>
    </div>
    <div class="description">描述：{{ video.description }}</div>
    <video :poster="video.thumbnail_url" :src="video.url" class="video-box" controls />
  </div>
</template>

<script>
// 视频详情页

import { formateDate } from '@/utils/formate'
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
    if (this.$route.query.videoId) {
      this.videoId = this.$route.query.videoId
    }
    // 视频id为空则返回视频列表
    if (this.videoId === '') {
      this.$router.push({ name: 'VideoList' })
    } else {
      await this.getVideoDetail()
    }
  },
  methods: {
    formateDate,
    async getVideoDetail() {
      const res = await videoDetail({ id: this.videoId })
      this.video = res.data
    },
    /**
     * 前往指定页
     * @param pageName
     */
    onHandleGoToPage(pageName) {
      this.$router.push({ name: pageName, params: { videoId: this.videoId }})
    }
  }
}
</script>

<style lang="scss" scoped>
.video-detail-container {
  width: 100%;

  .title {
    text-align: center;
  }

  .info {
    display: flex;
    justify-content: center;
    font-size: 18px;
    margin-bottom: 20px;
    color: #606266;

    .item {
      margin: 0 10px;
    }
  }

  .description {
    padding: 5px 20px;
    color: #333;
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
