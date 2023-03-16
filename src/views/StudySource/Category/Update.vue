<template>
  <div class="update-container">
    <el-dialog :title="isEdit?'编辑':'新增'" :visible.sync="isShowDialog" width="40%">
      <el-form :model="form">
        <el-form-item label="分类名称" label-width="120px">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="分类描述信息" label-width="120px">
          <el-input v-model="form.description" autocomplete="off" type="textarea" />
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
        <el-button v-loading="loading" type="primary" @click="onHandleConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// 更新或新增分类

import { add, update } from '@/api/studyCategory'

export default {
  name: 'Update',
  props: {
    isEdit: {
      type: Boolean
    },
    form: {
      type: Object
    },
    isShowDialog: {
      type: Boolean
    }
  },
  data() {
    return {
      loading: false // 提交时加载中
    }
  },
  methods: {
    /**
     * 取消修改或编辑
     */
    onHandleCancel() {
      this.$emit('endUpdate')
    },
    /**
     * 确认修改或新增数据
     * @returns {Promise<void>}
     */
    async onHandleConfirm() {
      this.loading = true
      // 修改信息
      if (this.isEdit) {
        const res = await update(this.form)
        this.$message({
          message: res.msg,
          type: 'success'
        })
      } else {
        // 新增数据
        const res = await add(this.form)
        this.$message({
          message: res.msg,
          type: 'success'
        })
      }

      this.loading = false
      // 结束回调，关闭弹框
      this.$emit('endUpdate')
    }
  }
}
</script>

<style scoped>

</style>
