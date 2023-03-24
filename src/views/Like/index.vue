<template>
  <div class="like-container">
    <div class="search-container">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="mini">
        <el-form-item>
          <el-button :disabled="deleteIds.length === 0" icon="el-icon-delete" type="danger" @click="onHandleDelete">批量删除
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
          label="点赞用户"
          prop="user.nick_name"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          label="点赞时间"
          prop="create_time"
          show-overflow-tooltip
        />
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
  </div>
</template>

<script>
// 点赞列表

import { getLikePage, deleteLike } from '@/api/like'

export default {
  name: 'Like',
  data() {
    return {
      commentData: [], // 表格数据
      searchForm: {
        page: 1,
        limit: 20,
        article: '',
        video: ''
      }, // 查找数据
      total: 0, // 数据总量
      deleteIds: [], // 要删除点赞的列表
      loading: false // 数据加载中

    }
  },
  computed: {
  },
  async created() {
    await this.getLiketData()
  },
  methods: {
    /**
     * 获取评论列表
     * @returns {Promise<void>}
     */
    async getLiketData() {
      this.loading = true

      const res = await getLikePage(this.searchForm)
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
     * 修改每页显示数量
     * @param limit
     */
    async onHandleSizeChange(limit) {
      this.searchForm.limit = limit
      await this.getLiketData()
    },
    /**
     * 修改当前页码数
     * @param page
     */
    async onHandleCurrentChange(page) {
      this.searchForm.page = page
      await this.getLiketData()
    },
    /**
     * 批量删除点赞信息
     */
    onHandleDelete() {
      this.$confirm('此操作将删除选中点赞信息论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const ids = this.deleteIds.join()
        const res = await deleteLike({ id: ids })
        this.$message({
          type: 'success',
          message: res.msg
        })
        // 重新获取点赞列表
        await this.getLiketData()
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
