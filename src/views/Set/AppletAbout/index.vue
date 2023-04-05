<template>
  <div class="container">
    <el-form :model="aboutData" class="form" label-width="100px" status-icon>
      <el-form-item label="指南内容：">
        <el-input
          v-model="aboutData.content"
          :rows="20"
          autofocus
          class="input"
          placeholder="请输入指南内容"
          type="textarea"
        />
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
