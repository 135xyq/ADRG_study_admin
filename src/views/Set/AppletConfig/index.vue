<template>
  <div class="applet-config-container">
    <el-form ref="form" :model="configData" label-width="80px" size="mini">
      <el-form-item label="appid">
        <el-col :span="12">
          <el-input v-model="configData.appid" />
        </el-col>
      </el-form-item>
      <el-form-item label="secrett">
        <el-col :span="12">
          <el-input v-model="configData.secret" />
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存设置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 小程序配置页面
import { addConfig, getConfig, updateConfig } from '@/api/config'

export default {
  name: 'AppletConfig',
  data() {
    return {
      configData: {
        appid: '',
        secret: ''
      },
      id: '', // 配置信息的id
      isEdit: false // 是否是修改配置信息
    }
  },
  async created() {
    await this.getConfigData()
  },
  methods: {
    // 获取小程序配置信息
    async getConfigData() {
      const res = await getConfig()
      // 返回值为空对象，没有配置信息，新增一个配置对象
      if (JSON.stringify(res.data) === '{}') {
        this.isEdit = false // 新增配置
      } else {
        this.id = res.data.id
        this.configData.appid = res.data.appid
        this.configData.secret = res.data.secret
        this.isEdit = true
      }
    },
    async onSubmit() {
      // 修改配置对象
      if (this.isEdit) {
        updateConfig({
          ...this.configData,
          id: this.id
        }).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          })
        })
      } else {
        const res = await addConfig(this.configData)
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
.applet-config-container {
  margin-top: 20px;
}
</style>
