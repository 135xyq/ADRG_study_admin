<template>
  <div class="edit-container">
    <el-form ref="form" :model="formData" :rules="rules" class="demo-ruleForm" label-width="130px">
      <el-form-item label="文章标题" prop="title">
        <el-col :span="11">
          <el-input v-model="formData.title" />
        </el-col>
      </el-form-item>
      <el-form-item label="文章描述">
        <el-col :span="11">
          <el-input v-model="formData.description" :rows="5" autosize type="textarea" />
        </el-col>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <mavon-editor ref="md" v-model="formData.content" placeholder="编辑文章内容" @imgAdd="onHandleAddImg" />
      </el-form-item>
      <el-form-item label="文章封面" prop="thumbnail_url">
        <el-upload
          :before-upload="beforeAvatarUpload"
          :on-success="successAvatarUpload"
          :show-file-list="false"
          action="/admin/upload/upload"
          class="avatar-uploader"
        >
          <img v-if="formData.thumbnail_url" :src="formData.thumbnail_url" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item label="文章分类" prop="study_category_id">
        <el-select v-model="formData.study_category_id" placeholder="请选择">
          <el-option
            v-for="item in category"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否显示在的封面">
        <el-switch
          v-model="formData.show_cover"
          :active-value="1"
          :inactive-value="0"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch
          v-model="formData.status"
          :active-value="1"
          :inactive-value="0"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="onHandleCancel('ruleForm')">取消</el-button>
        <el-button type="primary" @click="onHandleConfirm('ruleForm')">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
// 文章的编辑和修改

import { addArticle, articleDetail, updateArticle } from '@/api/article'
import request from '@/utils/request'
import pictureConfig from '@/config/picture'
import { getList } from '@/api/studyCategory'

export default {
  name: 'Index',
  data() {
    return {
      id: '', // 编辑的id
      category: [], // 分类
      formData: {
        title: '',
        content: '',
        description: '',
        thumbnail_url: '',
        study_category_id: '',
        status: 1,
        show_cover: 1
      }, // 文章的数据
      rules: {
        'title': { required: true, message: '请输入文章标题', trigger: 'blur' },
        'content': { required: true, message: '请输入文章内容', trigger: 'blur' },
        'thumbnail_url': { required: true, message: '请上传图片封面', trigger: 'blur' },
        'study_category_id': { required: true, message: '请选择文章分类', trigger: 'blur' }
      }
    }
  },
  async created() {
    // 获取地址栏传来的id
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      await this.getDetail()
    }
    await this.getCategory()
  },
  methods: {
    /**
     * 获取文章详情
     * @returns {Promise<void>}
     */
    async getDetail() {
      const res = await articleDetail(this.id)
      this.formData = { ...res.data }
    },
    /**
     * 获取分类
     * @returns {Promise<void>}
     */
    async getCategory() {
      const res = await getList()
      this.category = res.data
    },
    initData() {
      this.formData = {
        title: '',
        content: '',
        description: '',
        thumbnail_url: '',
        study_category_id: '',
        status: 1,
        show_cover: 1
      }
      this.id = ''
    },
    /**
     * 上传markdown中的图片
     * @param pos
     * @param $file
     */
    onHandleAddImg(pos, $file) {
      // 第一步.将图片上传到服务器.
      const formdata = new FormData()
      formdata.append('file', $file)
      request({
        url: '/admin/upload/upload',
        method: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then((res) => {
        // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
        this.$refs.md.$img2Url(pos, res.data.url)
      })
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
        return
      }
      // 图片正在上传，无法提交
      this.imgIsUploading = true
    },
    /**
     * 图片上传成功的
     * @param data
     */
    successAvatarUpload(data) {
      this.formData.thumbnail_url = data.data.url
    },
    /**
     * 取消修改
     */
    onHandleCancel() {
      this.initData()
      this.$router.go(-1)
    },
    /**
     * 确定修改
     */
    onHandleConfirm() {
      // 数据验证
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          // 修改文章
          if (this.id) {
            const res = await updateArticle(this.formData)
            this.$message({
              message: res.msg,
              type: 'success'
            })
          } else {
            //  新增文章
            const res = await addArticle(this.formData)
            this.$message({
              message: res.msg,
              type: 'success'
            })
          }
          this.$confirm('是否跳转回文章列表页?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$router.push({ name: 'Article' })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消跳转'
            })
          })
        }
      })
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
