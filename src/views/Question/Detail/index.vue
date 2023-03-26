<template>
  <div class="detail-container">
    <el-dialog :visible.sync="dialogVisible" title="问题详情" width="30%" @close="onHandleClose">
      <table border="" class="table">
        <tr class="table-tr">
          <td class="label">题目</td>
          <td class="content">{{ formData.title }}</td>
        </tr>
        <tr v-if="formData.options" class="table-tr">
          <td class="label">选项</td>
          <td class="content">
            <ul>
              <li v-for="(value,key) in formData.options" :key="key">{{ key + '. ' + value }}</li>
            </ul>
          </td>
        </tr>
        <tr class="table-tr">
          <td class="label">答案</td>
          <td class="content">{{ getAnswer(formData.answer) }}</td>
        </tr>
        <tr class="table-tr">
          <td class="label">解析</td>
          <td class="content">{{ formData.parse ? '无解析' : formData.parse }}</td>
        </tr>
        <tr v-if="formData.questionCategory" class="table-tr">
          <td class="label">分类</td>
          <td class="content">{{ formData.questionCategory.title }}</td>
        </tr>
        <tr class="table-tr">
          <td class="label">答题人次</td>
          <td class="content">{{ formData.test_count }} 次</td>
        </tr>
        <tr class="table-tr">
          <td class="label">答对人次</td>
          <td class="content">{{ formData.solve_count }} 次</td>
        </tr>
        <tr class="table-tr">
          <td class="label">等级</td>
          <td class="content">{{ getLevel(formData.level) }}</td>
        </tr>
        <tr class="table-tr">
          <td class="label">种类</td>
          <td class="content">{{ getType(formData.type) }}</td>
        </tr>
        <tr class="table-tr">
          <td class="label">状态</td>
          <td class="content">{{ getStatus(formData.status) }}</td>
        </tr>
        <tr class="table-tr">
          <td class="label">创建时间</td>
          <td class="content">{{ formData.create_time }}</td>
        </tr>
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onHandleClose">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { level, status, type } from '@/config/question'

export default {
  name: 'Detail',
  // eslint-disable-next-line vue/require-prop-types
  props: ['formData', 'dialogShow'],
  data() {
    return {
      type,
      status,
      level,
      dialogVisible: this.dialogShow
    }
  },
  computed: {
    getAnswer(answer) {
      return answer => {
        if (answer) {
          return answer.join('')
        }
        return ''
      }
    },
    getStatus() {
      return data => {
        if (data === 1) {
          return '正常'
        } else if (data === 0) {
          return '禁用'
        } else {
          return ''
        }
      }
    },
    // 等级
    getLevel() {
      return level => {
        const arr = this.level.filter(item => item.value === level)
        return arr[0] ? arr[0].key : '等级有误'
      }
    },
    // 种类
    getType() {
      return type => {
        const arr = this.type.filter(item => item.value === type)
        return arr[0] ? arr[0].key : '类型有误'
      }
    }
  },
  watch: {
    dialogShow: function(val) {
      this.dialogVisible = val
    }
  },
  methods: {
    /**
     * 关闭
     */
    onHandleClose() {
      this.$emit('closeDetail')
    }
  }
}
</script>

<style lang="scss" scoped>
ul, li {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.table {
  width: 100%;

  .table-tr {
    width: 100%;
    text-align: center;

    .label {
      width: 80px;
      background-color: #ccc;
      padding: 10px;
    }

    .content {
      text-align: left;
      padding: 5px 0 0 10px;
    }
  }
}

</style>
