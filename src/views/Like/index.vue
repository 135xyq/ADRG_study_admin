<template>
  <div class="like-container">
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
        <el-form-item label="视频id">
          <el-input v-model="searchForm.video" clearable placeholder="视频id" />
        </el-form-item>
        <el-form-item label="文章id">
          <el-input v-model="searchForm.article" clearable placeholder="文章id" />
        </el-form-item>
        <el-form-item label="资源类型">
          <el-select v-model="searchForm.type" clearable placeholder="资源类型" @change="onHandleSearch">
            <el-option label="全部" value="all" />
            <el-option label="视频" value="video" />
            <el-option label="文章" value="article" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="searchForm.time"
            :default-time="['00:00:00', '23:59:59']"
            end-placeholder="结束日期"
            range-separator="至"
            start-placeholder="开始日期"
            type="daterange"
            @change="onHandleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="onHandleSearch">查询
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-refresh" @click="onHnadleReset">重置
          </el-button>
        </el-form-item>
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
          label="资源类型"
          show-overflow-tooltip
          width="100"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.video_id" size="medium" type="waring">视频</el-tag>
            <el-tag v-if="scope.row.article_id" size="medium" type="success">文章</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="点赞用户"
          prop="user.nick_name"
          show-overflow-tooltip
          width="200"
        />
        <el-table-column
          align="center"
          label="点赞时间"
          prop="create_time"
          show-overflow-tooltip
          width="200"
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

import { deleteLike, getLikePage } from '@/api/like'
import { getAppletUserList } from '@/api/appletUser'

export default {
  name: 'Like',
  data() {
    return {
      commentData: [], // 表格数据
      searchForm: {
        page: 1,
        limit: 20,
        article: '',
        video: '',
        userName: '',
        type: 'all',
        time: []
      }, // 查找数据
      total: 0, // 数据总量
      deleteIds: [], // 要删除点赞的列表
      loading: false // 数据加载中

    }
  },
  computed: {},
  async created() {
    // 接收传来的参数
    if (this.$route.params.id) {
      if (this.$route.params.type === 'article') {
        this.searchForm.article = this.$route.params.id
      } else if (this.$route.params.type === 'video') {
        this.searchForm.video = this.$route.params.id
      }
    }

    // 接收传来的用户id
    if (this.$route.params.userId) {
      this.searchForm.userName = this.$route.params.userId
    }

    await this.getLiketData()
  },
  methods: {
    /**
     * 获取点赞列表
     * @param isPage
     * @returns {Promise<void>}
     */
    async getLiketData(isPage = false) {
      this.loading = true

      // 如果不是更改页码，则需要将分页数据重置
      if (!isPage) {
        this.searchForm = {
          ...this.searchForm,
          page: 1,
          limit: 20
        }
      }
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
      await this.getLiketData(true)
    },
    /**
     * 修改当前页码数
     * @param page
     */
    async onHandleCurrentChange(page) {
      this.searchForm.page = page
      await this.getLiketData(true)
    },
    /**
     * 批量删除点赞信息
     */
    onHandleDelete() {
      this.$confirm('此操作将删除选中的点赞信息, 是否继续?', '提示', {
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
        this.$router.push({ name: 'ArticleDetail', query: { articleId: id }})
      }
      if (type === 'video') {
        this.$router.push({ name: 'VideoDetail', query: { videoId: id }})
      }
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
      await this.getLiketData()
    },
    /**
     * 数据重置
     */
    onHnadleReset() {
      this.searchForm = {
        article: '',
        video: '',
        userName: '',
        type: 'all',
        time: [],
        page: 1,
        limit: 20
      }

      this.getLiketData()
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
