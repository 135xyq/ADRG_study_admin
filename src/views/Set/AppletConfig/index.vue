<template>
  <div class="applet-config-container">
    <el-form ref="form" :model="configData" label-width="210px" size="medium">
      <el-form-item label="微信小程序Appid：">
        <el-col :span="12">
          <el-input v-model="configData.appid" />
        </el-col>
      </el-form-item>
      <el-form-item label="微信小程序AppSecret：">
        <el-col :span="12">
          <el-input v-model="configData.secret" />
        </el-col>
      </el-form-item>
      <el-form-item label="是否自动审核评论：">
        <el-col :span="12">
          <el-switch
            v-model="configData.is_auto_check_comment"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            active-text="开启自动审核"
            inactive-text="只能人工审核"
          />
        </el-col>
      </el-form-item>
      <el-form-item label="是否自动审核用户名：">
        <el-col :span="12">
          <el-switch
            v-model="configData.is_auto_check_user_name"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            active-text="开启自动审核"
            inactive-text="只能人工审核"
          />
        </el-col>
      </el-form-item>
      <el-form-item label="敏感词(包含将无法通过审核)：">
        <el-col :span="12">
          <el-tag
            v-for="(tag, index) in configData.sensitive_words"
            :key="index"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputVisible"
            ref="saveTagInput"
            v-model="inputValue"
            class="input-new-tag"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
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
        secret: '',
        is_auto_check_user_name: 0,
        is_auto_check_comment: 0,
        sensitive_words: []
      },
      inputVisible: false,
      inputValue: '',
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
        this.configData.is_auto_check_user_name = res.data.is_auto_check_user_name
        this.configData.is_auto_check_comment = res.data.is_auto_check_comment
        this.configData.sensitive_words = res.data.sensitive_words

        this.isEdit = true
      }
    },
    async onSubmit() {
      // 修改配置对象
      if (this.isEdit) {
        updateConfig({
          ...this.configData,
          id: this.id
        }).then(async res => {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          //  更新之后重新获取数据
          await this.getConfigData()
        })
      } else {
        const res = await addConfig(this.configData)
        this.$message({
          message: res.msg,
          type: 'success'
        })
        await this.getConfigData()
      }
    },
    handleClose(tag) {
      this.configData.sensitive_words.splice(this.configData.sensitive_words.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.configData.sensitive_words.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.applet-config-container {
  margin-top: 20px;

  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
}
</style>
