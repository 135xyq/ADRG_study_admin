<template>
  <div class="feedback-container">
    <div class="search-container">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="mini">
        <el-form-item label="用户姓名">
          <el-autocomplete
            v-model="searchForm.userName"
            :fetch-suggestions="querySearchAsync"
            :trigger-on-focus="false"
            class="inline-input"
            placeholder="请输入内容"
            @select="onHandleSearch"
          />
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="内容关键词" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" clearable placeholder="用户反馈状态" @change="onHandleSubmit">
            <el-option :value="0" label="待回复" />
            <el-option :value="1" label="已回复" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="onHandleSubmit">查询</el-button>
          <el-button icon="el-icon-refresh" @click="onHandleReset">重置</el-button>
          <el-button :disabled="deleteIds.length === 0" icon="el-icon-delete" type="danger" @click="onHandleDelete">删除
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-container">
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="feedbackData"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        border
        stripe
        style="width: 100%"
        tooltip-effect="dark"
        @selection-change="onHandleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          align="center"
          label="编号"
          prop="id"
          width="100"
        />
        <el-table-column
          align="center"
          label="反馈用户"
          prop="appletUser.nick_name"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          label="反馈内容"
          prop="content"
          show-overflow-tooltip
          width="400"
        />
        <el-table-column
          label="问题图片"
          prop="description"
          width="110"
        >
          <template slot-scope="scope">
            <el-image
              :preview-src-list="[scope.row.image]"
              :src="scope.row.image"
              style="width: 100px; height: 100px"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="反馈时间"
          prop="create_time"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          label="回复内容"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.is_response === 1 ? scope.row.response_content : '暂未回复' }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="用户反馈状态"
        >
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.is_response === 0"
              effect="dark"
              size="small"
              type="info"
            >
              待回复
            </el-tag>
            <el-tag
              v-if="scope.row.is_response === 1"
              effect="dark"
              size="small"
              type="success"
            >
              已回复
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="100px"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.is_response === 0"
              size="mini"
              type="primary"
              @click="onHandleResponse(scope.row)"
            >回复
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        :current-page="searchForm.page"
        :page-size="searchForm.limit"
        :page-sizes="[20, 30, 50, 100,200]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="onHandleSizeChange"
        @current-change="onHandleCurrentChange"
      />
    </div>
    <div class="audit-container">
      <el-dialog :visible.sync="dialogFormVisible" title="反馈回复">
        <el-form :model="responseForm">
          <el-form-item label="回复内容" label-width="120px">
            <el-input v-model="responseForm.responseContent" autocomplete="off" autosize type="textarea" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="onHandleCloseDialog">取 消</el-button>
          <el-button type="primary" @click="onHandleConfirmDialog">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// 用户反馈列表

import { deleteFeedback, getFeedbackPage, responseFeedback } from '@/api/feedback'
import { getAppletUserList } from '@/api/appletUser'

export default {
  name: 'Feedback',
  data() {
    return {
      feedbackData: [], // 表格数据
      searchForm: {
        page: 1,
        limit: 20,
        status: '',
        keyword: '',
        userName: ''
      }, // 查找数据
      total: 0, // 数据总量
      deleteIds: [], // 要删除用户反馈的列表
      loading: false, // 数据加载中
      dialogFormVisible: false,
      responseForm: {
        id: '',
        responseContent: ''
      } // 审核数据
    }
  },
  async created() {
    await this.getFeedBackData()
  },
  methods: {
    /**
     * 获取反馈列表
     * @returns {Promise<void>}
     */
    async getFeedBackData() {
      this.loading = true

      const res = await getFeedbackPage(this.searchForm)
      this.total = res.data.total
      this.feedbackData = res.data.data

      this.loading = false
    },
    /**
     * 多选数据改变处理函数
     * @param val 选中的数据
     */
    onHandleSelectionChange(val) {
      this.deleteIds = val.map(item => item.id)
    },
    /**
     * 打开审核弹窗
     * @param data
     */
    onHandleResponse(data) {
      this.dialogFormVisible = true
      this.responseForm.id = data.id
      this.responseForm.responseContent = data.response_content
    },
    /**
     * 修改每页显示数量
     * @param limit
     */
    async onHandleSizeChange(limit) {
      this.searchForm.limit = limit
      await this.getFeedBackData()
    },
    /**
     * 修改当前页码数
     * @param page
     */
    async onHandleCurrentChange(page) {
      this.searchForm.page = page
      await this.getFeedBackData()
    },
    /**
     * 数据查询
     * @returns {Promise<void>}
     */
    async onHandleSubmit() {
      await this.getFeedBackData()
    },
    /**
     * 查询信息重置
     * @returns {Promise<void>}
     */
    async onHandleReset() {
      this.searchForm = {
        ...this.searchForm,
        keyword: '',
        status: '',
        userName: ''
      }
      await this.getFeedBackData()
    },
    /**
     * 批量删除用户反馈
     */
    onHandleDelete() {
      this.$confirm('此操作将删除选中用户反馈, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const ids = this.deleteIds.join()
        const res = await deleteFeedback({ id: ids })
        this.$message({
          type: 'success',
          message: res.msg
        })
        // 重新获取用户反馈列表
        await this.getFeedBackData()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    /**
     * 跳转到文章或视频页
     * @param type
     * @param id
     */
    onHandleGoToSource(type, id) {
      if (type === 'article') {
        this.$router.push({ name: 'ArticleDetail', params: { id: id }})
      }
      if (type === 'video') {
        this.$router.push({ name: 'VideoDetail', params: { id: id }})
      }
    },
    /**
     * 取消审核
     */
    onHandleCloseDialog() {
      this.responseForm = {
        id: '',
        responseContent: ''
      }
      this.dialogFormVisible = false
    },
    /**
     * 确认修改
     */
    async onHandleConfirmDialog() {
      const res = await responseFeedback({
        id: this.responseForm.id,
        response_content: this.responseForm.responseContent
      })
      this.$message({
        message: res.msg,
        type: 'success'
      })
      this.onHandleCloseDialog()
      await this.getFeedBackData()
    },
    /**
     * 获取搜索建议
     * @param queryString
     * @param cb
     * @returns {Promise<void>}
     */
    async querySearchAsync(queryString, cb) {
      const res = await getAppletUserList({ name: queryString })
      const data = res.data.map(item => {
        return {
          value: item.name
        }
      })

      cb(data)
    },
    /**
     * 查询
     * @returns {Promise<void>}
     */
    async onHandleSearch() {
      await this.getFeedBackData()
    }
  }
}
</script>

<style lang="scss" scoped>
.search-container {
  margin: 20px 0 10px 20px;
}

.page-container {
  display: flex;
  justify-content: right;
  margin: 20px;
}
</style>
