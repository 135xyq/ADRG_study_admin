<template>
  <div class="container">
    <!-- 创建选项 -->
    <div class="top">
      <el-row>
        <el-col :span="15">
          <el-input v-model="newOption" placeholder="请输入新选项" type="textarea" />
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
            <el-input v-model="option.value" placeholder="请输入选项内容" type="textarea" />
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
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['form'],
  data() {
    return {
      newOption: '',
      options: []
    }
  },
  watch: {
    form: {
      handler(val) {
        console.log(val)
        if (val) {
          this.options = val
        }
      },
      deep: true
    }
  },
  methods: {
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
