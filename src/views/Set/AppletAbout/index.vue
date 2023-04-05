<template>
  <div class="container">
    <el-form :model="aboutData" class="form" label-width="100px" status-icon>
      <el-form-item label="指南内容：">
        <mavon-editor ref="md" v-model="aboutData.content" placeholder="编辑文章内容" @imgAdd="onHandleAddImg" />
      </el-form-item>
      <el-form-item size="large">
        <el-button class="button" type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 小程序使用指南页

import { getAppletAbout, updateAppletAbout } from '@/api/appletAbout'
import request from '@/utils/request'

export default {
  name: 'AppletAbout',
  data() {
    return {
      aboutData: {
        content: '',
        id: ''
      }
    }
  },
  async created() {
    await this.getAboutData()
  },
  methods: {
    /**
     * 获取数据
     * @returns {Promise<void>}
     */
    async getAboutData() {
      const res = await getAppletAbout()
      if (res.code === 0) {
        this.aboutData.content = res.data.content
        this.aboutData.id = res.data.id
      }
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
     * 提交修改
     * @returns {Promise<void>}
     */
    async onSubmit() {
      const res = await updateAppletAbout({
        ...this.aboutData
      })

      if (res.code === 0) {
        this.$message({
          message: res.msg,
          type: 'success'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  font-size: 16px;

  .form {
    margin-top: 30px;

  }

  .input {
    width: 80%;
    font-size: 16px;
  }

}
</style>
