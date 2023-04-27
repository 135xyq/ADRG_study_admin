<template>
  <div class="comment-container">
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
          <el-select v-model="searchForm.status" clearable placeholder="评论状态" @change="onHandleSubmit">
            <el-option :value="0" label="待审核" />
            <el-option :value="1" label="审核通过" />
            <el-option :value="2" label="审核不通过" />
          </el-select>
        </el-form-item>
        <el-form-item label="视频id">
          <el-input v-model="searchForm.video" clearable placeholder="视频id" />
        </el-form-item>
        <el-form-item label="文章id">
          <el-input v-model="searchForm.article" clearable placeholder="文章id" />
        </el-form-item>
        <el-form-item label="资源类型">
          <el-select v-model="searchForm.type" clearable placeholder="资源类型" @change="onHandleSearch">
            <el-option value="all" label="全部" />
            <el-option value="video" label="视频" />
            <el-option value="article" label="文章" />
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
        :data="commentData"
        border
        stripe
        style="width: 100%"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
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
          width="120"
        />
        <el-table-column
          align="center"
          label="评论内容"
          prop="content"
          show-overflow-tooltip
          width="500"
        />
        <el-table-column
          align="center"
          label="所属视频/文章"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-link v-if="scope.row.video_id" @click="onHandleGoToSource('video',scope.row.video_id)">
              {{ scope.row.video.title }}
            </el-link>
            <el-link v-if="scope.row.article_id" @click="onHandleGoToSource('article',scope.row.article_id)">
              {{ scope.row.article.title }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="资源类型"
          width="100"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.video_id" size="medium" type="waring">视频</el-tag>
            <el-tag v-if="scope.row.article_id" size="medium" type="success">文章</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="评论用户"
          prop="user.nick_name"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          label="评论时间"
          prop="create_time"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          label="评论状态"
        >
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.status === 0"
              effect="dark"
              size="small"
              type="info"
            >
              待审核
            </el-tag>
            <el-tag
              v-if="scope.row.status === 1"
              effect="dark"
              size="small"
              type="success"
            >
              审核通过
            </el-tag>
            <el-tag
              v-if="scope.row.status === 2"
              effect="dark"
              size="small"
              type="danger"
            >
              审核不通过
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          fixed="right"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              :type="scope.row.status === 0 ? 'primary' : 'warning'"
              size="mini"
              @click="onHandleAuditComment(scope.row)"
            >{{
              scope.row.status === 0 ? '审核' : '复核'
            }}
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
      <el-dialog :visible.sync="dialogFormVisible" title="评论审核">
        <el-form :model="audtForm">
          <el-form-item label="状态" label-width="120px">
            <el-radio v-model="audtForm.status" :label="1">审核通过</el-radio>
            <el-radio v-model="audtForm.status" :label="2">审核不通过</el-radio>
          </el-form-item>
          <el-form-item label="备注信息" label-width="120px">
            <el-input v-model="audtForm.err_msg" autocomplete="off" type="textarea" />
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
// 评论列表

import { deleteComment, getCommentPage, auditComment } from '@/api/comment'
import { getAppletUserList } from '@/api/appletUser'

export default {
  name: 'Comment',
  data() {
    return {
      commentData: [], // 表格数据
      searchForm: {
        page: 1,
        limit: 20,
        status: '',
        keyword: '',
        article: '',
        video: '',
        userName: '',
        type: 'all'
      }, // 查找数据
      total: 0, // 数据总量
      deleteIds: [], // 要删除评论的列表
      loading: false, // 数据加载中
      dialogFormVisible: false,
      audtForm: {
        id: '',
        status: '',
        err_msg: ''
      } // 审核数据
    }
  },
  computed: {
    // 获取评论的状态
    getCommentStatus(status) {
      return status => {
        switch (status) {
          case 0:
            return '待审核'
          case 1:
            return '已审核'
          case 2:
            return '审核不通过'
          default:
            return '未知状态'
        }
      }
    }
  },
  async created() {
    // 接受传来的参数
    if (this.$route.params.id) {
      if (this.$route.params.type === 'article') {
        this.searchForm.article = this.$route.params.id
      } else if (this.$route.params.type === 'video') {
        this.searchForm.video = this.$route.params.id
      }
    }

    await this.getCommentData()
  },
  methods: {
    /**
     * 获取评论列表
     * @returns {Promise<void>}
     */
    async getCommentData() {
      this.loading = true

      const res = await getCommentPage(this.searchForm)
      this.total = res.data.total
      this.commentData = res.data.data

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
    onHandleAuditComment(data) {
      this.dialogFormVisible = true
      this.audtForm.id = data.id
      this.audtForm.status = data.status
      this.audtForm.err_msg = data.err_msg
    },
    /**
     * 修改每页显示数量
     * @param limit
     */
    async onHandleSizeChange(limit) {
      this.searchForm.limit = limit
      await this.getCommentData()
    },
    /**
     * 修改当前页码数
     * @param page
     */
    async onHandleCurrentChange(page) {
      this.searchForm.page = page
      await this.getCommentData()
    },
    /**
     * 数据查询
     * @returns {Promise<void>}
     */
    async onHandleSubmit() {
      await this.getCommentData()
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
        userName: '',
        video: '',
        article: '',
        type: 'all'
      }
      await this.getCommentData()
    },
    /**
     * 批量删除评论
     */
    onHandleDelete() {
      this.$confirm('此操作将删除选中评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const ids = this.deleteIds.join()
        const res = await deleteComment({ id: ids })
        this.$message({
          type: 'success',
          message: res.msg
        })
        // 重新获取评论列表
        await this.getCommentData()
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
        this.$router.push({ name: 'ArticleDetail', query: { articleId: id }})
      }
      if (type === 'video') {
        this.$router.push({ name: 'VideoDetail', query: { videoId: id }})
      }
    },
    /**
     * 取消审核
     */
    onHandleCloseDialog() {
      this.audtForm = {
        id: '',
        status: '',
        err_msg: ''
      }
      this.dialogFormVisible = false
    },
    /**
     * 确认修改
     */
    async onHandleConfirmDialog() {
      const res = await auditComment(this.audtForm)
      this.$message({
        message: res.msg,
        type: 'success'
      })
      this.onHandleCloseDialog()
      await this.getCommentData()
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
      await this.getCommentData()
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
