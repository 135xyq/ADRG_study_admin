<template>
  <el-dialog :title="isEdit ? '编辑' : '新增'" :visible.sync="dialogVisible" width="50%" @close="closeDialog">
    <el-form :model="form" size="medium">
      <el-form-item label="题目" label-width="100px">
        <el-input v-model="form.title" autocomplete="off" placeholder="题目" type="textarea" />
      </el-form-item>
      <el-form-item label="类型" label-width="100px">
        <el-select v-model="form.type" placeholder="题目类型" @change="onHandleGetType">
          <el-option v-for="item in type" :key="item.key" :label="item.key" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.type === 0 || form.type === 1" label="选项" label-width="100px">
        <div class="container">
          <!-- 创建选项 -->
          <div class="top">
            <el-row>
              <el-col :span="15">
                <el-input v-model="newOption" autosize placeholder="请输入新选项" type="textarea" />
              </el-col>
              <el-col :span="7" style="margin-left: 20px">
                <el-button type="primary" @click="addOption">添加选项</el-button>
              </el-col>
            </el-row>
          </div>

          <!-- 选项列表 -->
          <el-form ref="form">
            <el-form-item
              v-for="(option, index) in options"
              :key="option.id"
              :label="'选项 ' + String.fromCharCode(index + 65)"
            >
              <el-row>
                <el-col :span="10" class="col">
                  <el-input v-model="option.value" autosize placeholder="请输入选项内容" type="textarea" />
                </el-col>
                <el-col :span="4" class="col">
                  <el-button type="danger" @click="deleteOption(index)">删除选项</el-button>
                </el-col>
                <el-col :span="3" class="col">
                  <el-button v-if="index !== 0" @click="moveOption(index, index - 1)">上移</el-button>
                </el-col>
                <el-col :span="3" class="col">
                  <el-button v-if="index !== options.length - 1" @click="moveOption(index, index + 1)">下移</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </div>
      </el-form-item>
      <el-form-item v-if="form.type === 0 || form.type === 1" label="答案" label-width="100px">
        <el-checkbox-group v-if="form.type === 1" v-model="form.answer">
          <el-checkbox v-for="item in answer" :key="item" :label="item" />
        </el-checkbox-group>
        <el-radio-group v-else v-model="form.answer">
          <el-radio v-for="item in answer" :key="item" :label="item" />
        </el-radio-group>
      </el-form-item>
      <el-form-item v-else label="答案" label-width="100px">
        <el-input v-model="otherAnswer" autocomplete="off" autosize placeholder="答案" type="textarea" />
      </el-form-item>
      <el-form-item label="解析" label-width="100px">
        <el-input v-model="form.parse" autocomplete="off" autosize placeholder="题目解析" type="textarea" />
      </el-form-item>
      <el-form-item label="分类" label-width="100px">
        <el-select v-model="form.question_category_id" placeholder="题目分类">
          <el-option v-for="item in category" :key="item.id" :label="item.title" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="难度" label-width="100px">
        <el-select v-model="form.level" placeholder="题目等级">
          <el-option v-for="item in level" :key="item.key" :label="item.key" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" label-width="100px">
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
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button :loading="loading" type="primary" @click="onHandleSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// 题目的编辑和新增

import { getList } from '@/api/questionCategory'
import { level, type } from '@/config/question'
import { addQuestion, updateQuestion } from '@/api/question'

export default {
  name: 'Edit',
  // eslint-disable-next-line vue/require-prop-types
  props: ['isEdit', 'formData', 'showDialog'],
  data() {
    return {
      type,
      level,
      dialogVisible: this.showDialog,
      form: {
        answer: [],
        status: 1,
        level: 0
      },
      loading: false,
      category: [],
      newOption: '',
      otherAnswer: '', // 当为填空或简单时的答案
      options: [] // 选项
    }
  },
  computed: {
    answer() {
      return this.options.map((item, index) => {
        return String.fromCharCode(index + 65)
      })
    }
  },
  watch: {
    showDialog: function(val) {
      this.dialogVisible = val
    },
    formData: {
      handler(val) {
        // console.log(val)
        if (JSON.stringify(val) !== '{}') {
          this.form = { ...val }
          if (this.form.options) {
            this.options = []
            let index = 0
            for (const valKey in this.form.options) {
              index++
              this.options.push({
                id: index,
                value: this.form.options[valKey]
              })
            }
          }
          // 取出答案的值
          if (val.type !== 0 && val.type !== 1) {
            if (val.answer.length > 0) {
              this.otherAnswer = val.answer[0]
            }
          }

          // 如果是单选则将答案组合
          if (val.type === 0) {
            this.form.answer = this.form.answer.length > 0 ? this.form.answer[0] : ''
          }
        }
      },
      deep: true
    }
  },
  async created() {
    await this.getCategoryList()
  },
  methods: {
    /**
     * 获取分类列表
     * @returns {Promise<void>}
     */
    async getCategoryList() {
      const res = await getList()
      this.category = res.data.map(item => {
        return {
          id: item.id,
          title: item.title
        }
      })
    },
    // 初始化数据
    initData() {
      this.form = {
        answer: [],
        status: 1
      }
      this.options = []
      this.otherAnswer = ''
      this.loading = false
    },
    /**
     * 新增或修改完成
     * @param flag 是否修改了数据
     */
    closeDialog(flag) {
      // 重置数据
      this.initData()

      this.$emit('closeEditDialog', flag)
    },
    // 添加选项
    addOption() {
      const newId = this.options.length > 0 ? Math.max(...this.options.map((option) => option.id)) + 1 : 1
      this.options.push({ id: newId, value: this.newOption })
      this.newOption = ''
    },
    // 删除选项
    deleteOption(index) {
      this.options.splice(index, 1)
    },
    // 移动选项
    moveOption(oldIndex, newIndex) {
      const option = this.options.splice(oldIndex, 1)[0]
      this.options.splice(newIndex, 0, option)
    },
    onHandleGetType(type) {
      if (type === 0) {
        this.form.answer = this.form.answer.length > 0 ? this.form.answer[0] : ''
      } else if (type === 1) {
        this.form.answer = this.form.answer.split('')
      }
    },
    /**
     * 提交修改或新增
     * @returns {Promise<void>}
     */
    async onHandleSubmit() {
      this.loading = true

      const formData = { ...this.form }

      // 类型不合法
      if (([0, 1, 2, 3]).indexOf(formData.type) === -1) {
        this.$message({
          message: '题目类型不能为空',
          type: 'warning'
        })
        return
      }

      if (([0, 1, 2]).indexOf(formData.level) === -1) {
        this.$message({
          message: '题目难度不能为空',
          type: 'warning'
        })
        return
      }

      // 判断单选题合理
      if (formData.type === 0) {
        if (formData.answer.length === 0) {
          this.$message({
            message: '答案不能为空',
            type: 'warning'
          })
          return
        }
        if (formData.answer.length > 1) {
          this.$message({
            message: '单选题答案只有一个',
            type: 'warning'
          })
          return
        }

        //  转换答案的格式
        formData.answer = formData.answer.split('')
      }
      if (formData.type === 1) {
        if (formData.answer.length < 2) {
          this.$message({
            message: '多选题答案为多个',
            type: 'warning'
          })
          return
        }

        // 多选、对答案进行排序
        formData.answer.sort()
      }

      // 填空题和简单题的答案不能为空
      if ((formData.type !== 1 && formData.type !== 0) && this.otherAnswer.trim() === '') {
        this.$message({
          message: '答案不能为空',
          type: 'warning'
        })
        return
      }
      // 不是选择题将答案置空
      if (formData.type !== 1 && formData.type !== 0) {
        formData.options = {}
        formData.answer[0] = this.otherAnswer
      } else {
        const obj = {}
        this.options.forEach((item, index) => {
          const key = String.fromCharCode(index + 65)
          obj[key] = item.value
        })
        formData.options = { ...obj }
      }

      // console.log(formData)

      // 编辑
      if (this.isEdit) {
        updateQuestion(formData).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.loading = false
          // 完成操作
          this.closeDialog(true)
        }).catch(() => {
          this.loading = false
        })
      } else {
        //   新增
        addQuestion(formData).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          })

          this.loading = false

          // 完成操作
          this.closeDialog(true)
        }).catch(() => {
          this.loading = false
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.top {
  margin-bottom: 20px;
}

.col {
  margin-left: 5px;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
