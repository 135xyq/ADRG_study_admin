<template>
  <div class="article-container">
    Article
    <UploadVideo
      :video-data="data"
      @uploadSuccess="onHandleSuccess"
    />
  </div>
</template>

<script>
import UploadVideo from '@/components/UploadVideo'
export default {
  name: 'Article',
  components: {
    UploadVideo
  },
  data() {
    return {
      isUploading: true,
      data: {
        duration: 768,
        fileSize: 0,
        url: '' // 视频地址
      }
    }
  },
  methods: {
    onHandleSuccess(data) {
      this.isUploading = false
      console.log(data)
    }
  }
}
</script>

<style scoped>

</style>
