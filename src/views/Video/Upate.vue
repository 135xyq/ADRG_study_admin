<template>
  <div class="update-container">
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :title="isEdit ? '编辑' : '新增'"
      :visible.sync="showDialog"
    >
      <el-form :model="form">
        <el-form-item label="标题" label-width="120px">
          <el-input v-model="form.title" autocomplete="off" placeholder="视频标题" />
        </el-form-item>
        <el-form-item label="描述" label-width="120px">
          <el-input v-model="form.description" :rows="5" autocomplete="off" placeholder="视频描述" type="textarea" />
        </el-form-item>
        <el-form-item label="视频" label-width="120px">
          <UploadVideo :video-data="videoData" @uploadSuccess="ooHandelVideoUplaodSuccess" />
        </el-form-item>
        <el-form-item label="封面" label-width="120px">
          <el-upload
            :before-upload="beforeAvatarUpload"
            :on-success="successAvatarUpload"
            :show-file-list="false"
            action="/admin/upload/upload"
            class="avatar-uploader"
          >
            <img v-if="form.thumbnail_url" :src="form.thumbnail_url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="分类" label-width="120px">
          <el-select v-model="form.study_category_id" placeholder="请选择">
            <el-option
              v-for="item in category"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="显示在的封面" label-width="120px">
          <el-switch
            v-model="form.show_cover"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onHandleCancel">取 消</el-button>
        <el-button v-loading="loading" type="primary" @click="onHandleConfrimSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 更新或新增视频

import { updateVideo, addVideo } from '@/api/video'
import UploadVideo from '@/components/UploadVideo'
import pictureConfig from '@/config/picture'
import { getList } from '@/api/studyCategory'

export default {
  name: 'Update',
  components: {
    UploadVideo
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object
    },
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      category: [], // 分类
      form: {},
      loading: false, // 提交加载
      videoData: {
        url: this.formData.url || '',
        duration: this.formData.duration || 0,
        fileSize: this.formData.fileSize || 0
      }
    }
  },
  watch: {
    'formData': function(newVal, oldVal) {
      if (JSON.stringify(newVal) !== '{}') {
        this.$nextTick(() => {
          this.form = { ...newVal }

          this.videoData.url = newVal.url
          this.videoData.duration = newVal.duration
          this.videoData.fileSize = newVal.file_size
        })
      }
    }
  },
  async created() {
    await this.getCategory()
  },
  methods: {
    /**
     * 数据初始化
     */
    initData() {
      this.videoData = {}
      this.form = {}
      this.loading = false
    },
    /**
     * 获取分类
     * @returns {Promise<void>}
     */
    async getCategory() {
      const res = await getList()
      this.category = res.data
    },
    /**
     * 图片上传之前进行验证
     * @param file
     */
    beforeAvatarUpload(file) {
      const fileSize = file.size / 1024 / 1024

      if (pictureConfig.type.indexOf(file.type) === -1) {
        this.$message.error('上传封面格式错误！')
        return
      }
      if (pictureConfig.size < fileSize) {
        this.$message.error(`上传头像图片大小不能超过 ${pictureConfig.size}MB!`)
      }
    },
    /**
     * 视频上传成功
     * @param data
     */
    ooHandelVideoUplaodSuccess(data) {
      this.form.url = data.url
      this.form.duration = data.duration
      this.form.file_size = data.fileSize
    },
    /**
     * 图片上传成功的
     * @param data
     */
    successAvatarUpload(data) {
      this.form.thumbnail_url = data.data.url
    },
    /**
     * 提交表单
     */
    async onHandleConfrimSubmit() {
      this.loading = true

      // 编辑
      if (this.isEdit) {
        const res = await updateVideo(this.form)
        this.$message({
          message: res.msg,
          type: 'success'
        })
      } else {
        //   新增
        const res = await addVideo(this.form)
        this.$message({
          message: res.msg,
          type: 'success'
        })
      }

      this.loading = false
      this.form = {}
      this.initData()
      this.$emit('editSuccess')
    },
    /**
     * 取消提交
     */
    onHandleCancel() {
      // 成功后回调。关闭弹窗，初始化数据
      this.initData()
      this.$emit('editSuccess')
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader {
  .el-upload {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
}

.avatar-uploader-icon {
  font-size: 28px;
  border: 1px dashed #d9d9d9;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

</style>
