<template>
  <div v-loading="loading || importLoading" class="applet-config-container">
    <div class="down-container">
      <el-button class="el-icon-upload2" size="small" type="success" @click="onHandleImport"> 导入敏感词</el-button>
      <el-button class="el-icon-download" size="small" type="primary" @click="onHandleDownload"> 导出敏感词</el-button>
    </div>
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
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            active-text="开启自动审核"
            inactive-color="#ff4949"
            inactive-text="只能人工审核"
            @change="onSubmit"
          />
        </el-col>
      </el-form-item>
      <el-form-item label="是否自动审核用户名：">
        <el-col :span="12">
          <el-switch
            v-model="configData.is_auto_check_user_name"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            active-text="开启自动审核"
            inactive-color="#ff4949"
            inactive-text="只能人工审核"
            @change="onSubmit"
          />
        </el-col>
      </el-form-item>
      <el-form-item label="敏感词(包含将无法通过审核)：">
        <el-col :span="12">
          <el-tag
            v-for="(tag, index) in configData.sensitive_words"
            :key="index"
            :disable-transitions="false"
            closable
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
            @blur="handleInputConfirm"
            @keyup.enter.native="handleInputConfirm"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" @click="onSubmit">保存设置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 小程序配置页面
import { addConfig, getConfig, updateConfig } from '@/api/config'
import XLSX from 'xlsx'

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
      loading: false,
      inputVisible: false,
      inputValue: '',
      importLoading: false, // 导入敏感词加载
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
      this.loading = true

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

      this.loading = false
    },
    /**
     * 提交修改或新增
     * @returns {Promise<void>}
     */
    async onSubmit() {
      this.loading = true

      // 修改配置对象
      if (this.isEdit) {
        const res = await updateConfig({
          ...this.configData,
          id: this.id
        })
        this.$message({
          message: res.msg,
          type: 'success'
        })
        //  更新之后重新获取数据
        await this.getConfigData()
      } else {
        const res = await addConfig(this.configData)
        this.$message({
          message: res.msg,
          type: 'success'
        })
        await this.getConfigData()
      }

      this.loading = false
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
        if (this.configData.sensitive_words.indexOf(inputValue) !== -1) {
          this.$message({
            message: '敏感词已存在',
            type: 'warning',
            duration: 1500
          })
        } else {
          this.configData.sensitive_words.push(inputValue)
        }

        // 数组去重
        // this.configData.sensitive_words = [...(new Set(this.configData.sensitive_words))]
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    /**
     * 导出敏感词
     */
    onHandleDownload() {
      // 表格配置
      const options = {
        '!cols': [
          { wpx: 100 }
        ]
      }
      const data = this.configData.sensitive_words.map(item => [item])
      const worksheet = XLSX.utils.aoa_to_sheet(data, { header: ['name'] })
      worksheet['!cols'] = options['!cols'] // 设置每列的列宽
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
      XLSX.writeFile(workbook, '敏感词.xlsx')
    },
    /**
     * 导入敏感词
     */
    async onHandleImport() {
      this.importLoading = true

      // 创建一个input元素来选择文件
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.xlsx'
      input.style.display = 'none'

      const that = this

      // 当input元素的值发生改变时，触发上传操作
      input.onchange = async function() {
        const file = input.files[0] // 获取选择的文件
        // console.log(file)
        const reader = new FileReader() // 创建一个FileReader对象

        // 读取文件
        reader.readAsArrayBuffer(file)
        reader.onload = function() {
          const file = reader.result
          const wb = XLSX.read(file, {
            type: 'binary' // 以二进制的方式读取
          })

          const sheet0 = wb.Sheets[wb.SheetNames[0]]// sheet0代表excel表格中的第一页

          // ["A1='暴力", "B1='政治"]数据格式
          const data = XLSX.utils.sheet_to_formulae(sheet0)

          // 格式化后的数据["'暴力", "'政治"]
          const formateData = data.map(item => {
            const itemData = item.split('=')
            let finalData = ''

            if (itemData.length > 1) {
              finalData = itemData[1]

              if (finalData.length > 0 && finalData[0] === '\'') {
                finalData = finalData.slice(1)
              }
            }
            return finalData
          })

          // console.log(formateData)

          that.configData.sensitive_words.push(...formateData)

          // 数组去重
          that.configData.sensitive_words = [...(new Set(that.configData.sensitive_words))]

          // 提交修改
          that.onSubmit()
        }
      }

      // 触发，选择文件
      input.click()

      this.importLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.applet-config-container {
  margin-top: 20px;

  .down-container {
    margin-bottom: 30px;
    display: flex;
    justify-content: left;
    margin-left: 50px;
  }

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
