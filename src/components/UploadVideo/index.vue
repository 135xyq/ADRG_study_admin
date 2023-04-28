<template>
  <div class="upload-container">
    <el-upload
      :before-upload="beforeUploadVideo"
      :on-progress="uploadVideoProcess"
      :on-success="handleVideoSuccess"
      :show-file-list="false"
      action="/admin/upload/upload"
      class="uploader"
    >
      <video
        v-if="videoForm.url !=='' && !videoFlag"
        ref="video"
        :src="videoForm.url"
        class="avatar video-avatar"
        controls="controls"
        height="180"
        width="240"
      >
        您的浏览器不支持视频播放
      </video>
      <i
        v-else-if="videoForm.url ==='' && !videoFlag"
        class="el-icon-plus uploader"
      />
      <el-progress
        v-if="videoFlag === true"
        :percentage="videoUploadPercent"
        style="margin-top:7px;"
        type="circle"
      />
    </el-upload>
  </div>
</template>

<script>
// 上传视频的组件

import videoConfig from '@/config/video'

export default {
  name: 'UploadVideo',
  props: {
    videoData: {
      type: Object,
      default() {
        return {
          url: '',
          duration: 0,
          fileSize: 0
        }
      }
    }
  },
  data() {
    return {
      videoFlag: false, // 是否显示进度条
      videoUploadPercent: 0, // 进度条的进度
      videoForm: {
        url: this.videoData.url,
        duration: this.videoData.duration,
        fileSize: this.videoData.fileSize
      }
    }
  },
  watch: {
    // 获取视频的详细信息
    'videoData': {
      handler(newVal, oldVal) {
        this.videoForm = {
          url: newVal.url,
          duration: newVal.duration,
          fileSize: newVal.fileSize
        }

        // console.log('Upload', this.videoData)
      },
      deep: true
    }
  },
  methods: {
    /**
     * 上传前回调
     * @param file
     * @returns {boolean}
     */
    beforeUploadVideo(file) {
      const fileSize = file.size / 1024 / 1024
      // console.log(file)
      // 判断上传文件格式是否合法
      if (videoConfig.fileType.indexOf(file.type) === -1) {
        this.$message({
          message: '请上传正确的视频格式',
          type: 'error'
        })
        return false
      }
      // 判断 件大小是否合法
      if (fileSize > videoConfig.fileSize) {
        this.$message({
          message: `视频大小不能超过${videoConfig.fileSize}MB`,
          type: 'error'
        })
        return false
      }
      // 文件准备上传，父组件要做一些事情
      this.$emit('beforUpload')
    },
    /**
     *  控制进度条
     * @param event
     * @param file
     * @param fileList
     */
    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true
      this.videoUploadPercent = Number(file.percentage.toFixed(0))
    },
    /**
     * 上传成功回调
     * @param res
     * @param file
     */
    async handleVideoSuccess(res, file) {
      this.videoFlag = false
      this.videoUploadPercent = 0

      if (res.code === 0) {
        this.videoForm.url = res.data.url
        this.videoForm.fileSize = file.raw.size // 视频的大小

        // this.getVideoPlayerInfo(file.raw).then(result => {
        //   console.log(1)
        //   this.$emit('uoloadSuccess', {
        //     isUploading: true,
        //     url: res.data.url,
        //     duration: result.duration,
        //     fileSize
        //   })
        // })

        const result = await this.getVideoPlayerInfo(file.raw)
        this.videoForm.duration = result.duration
        this.$emit('uploadSuccess', this.videoForm)
      } else {
        this.$message(res.Message)
      }
    },
    /**
     * 获取视频信息,时长
     * @param file
     * @returns {Promise<unknown>}
     */
    getVideoPlayerInfo(file) {
      return new Promise(resolve => {
        const videoElement = document.createElement('video')
        videoElement.src = URL.createObjectURL(file)
        videoElement.addEventListener('loadedmetadata', function() {
          resolve({
            duration: videoElement.duration
          })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-container {
  .uploader {
    border: 1px dashed #d9d9d9;
    font-size: 60px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
}
</style>
