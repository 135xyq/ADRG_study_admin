<template>
  <div class="article-container">
    <div class="search-container">
      <el-form :inline="true" :model="form" class="demo-form-inline" size="mini">
        <el-form-item>
          <el-input v-model="form.title" clearable placeholder="文章标题" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.status" clearable placeholder="文章状态" @change="onHandleSearchChange">
            <el-option
              :value="1"
              label="未禁用"
            />
            <el-option
              :value="0"
              label="禁用"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.show_cover" clearable placeholder="是否展示在封面" @change="onHandleSearchChange">
            <el-option
              :value="1"
              label="是"
            />
            <el-option
              :value="0"
              label="否"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.category" clearable placeholder="分类查询" @change="onHandleSearchChange">
            <el-option
              v-for="item in category"
              :key="item.id"
              :label="categoryStatus(item)"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.order" clearable placeholder="排序方式" @change="onHandleSearchChange">
            <el-option
              label="阅读数优先"
              value="view_count"
            />
            <el-option
              label="点赞数优先"
              value="like_count"
            />
            <el-option
              label="收藏数优先"
              value="star_count"
            />
            <el-option
              label="评论数优先"
              value="comment_count"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="onHandleSearchChange">查询</el-button>
          <el-button icon="el-icon-refresh" @click="onHandleReset">重置</el-button>
          <el-button :disabled="deleteIds.length === 0" icon="el-icon-delete" type="danger" @click="onHandleDelete">删除
          </el-button>
          <el-button icon="el-icon-plus" type="success" @click="onHandleAdd">新增文章</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-container">
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        tooltip-effect="dark"
        @selection-change="onHandleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="45"
        />
        <el-table-column
          label="编号"
          prop="id"
          width="50"
        />
        <el-table-column
          align="center"
          label="标题"
          prop="title"
          show-overflow-tooltip
          width="200"
        />
        <el-table-column
          align="center"
          label="描述信息"
          prop="description"
          show-overflow-tooltip
          width="300"
        />
        <el-table-column
          label="文章封面"
          prop="description"
          width="110"
        >
          <template slot-scope="scope">
            <el-image
              :preview-src-list="[scope.row.thumbnail_url]"
              :src="scope.row.thumbnail_url"
              style="width: 100px; height: 100px"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="阅读数"
          prop="view_count"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          align="center"
          label="点赞数"
          prop="like_count"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          align="center"
          label="收藏数"
          prop="star_count"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          align="center"
          label="评论数"
          prop="comment_count"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          align="center"
          label="状态"
          show-overflow-tooltip
          width="100"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="onHAndleUpdateLine('status',scope.row,$event)"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="是否显示在封面"
          show-overflow-tooltip
          width="100"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.show_cover"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="onHAndleUpdateLine('status',scope.row,$event)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="分类"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-tag
              effect="dark"
              type="success"
            >
              {{ scope.row.studyCategory.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="200"
        >
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" size="mini" type="primary" @click="onHandleEdit(scope.row)">编辑
            </el-button>
            <el-button icon="el-icon-view" size="mini" type="info" @click="onHandleShowDetail(scope.row.id)">详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        :current-page="form.page"
        :page-size="form.limit"
        :page-sizes="[10,20, 30, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="onHandleSizeChange"
        @current-change="onHandleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
// 文章列表页

import { deleteArticle, getArticles, updateArticle } from '@/api/article'
import { formateDate } from '@/utils/formate'
import { getList } from '@/api/studyCategory'

export default {
  name: 'Article',
  data() {
    return {
      tableData: [], // 表格数据
      form: {
        page: 1,
        limit: 20,
        title: '',
        status: '',
        show_cover: '',
        category: '',
        order: ''
      },
      loading: false, // 加载中
      category: [], // 分类列表
      total: 0,
      deleteIds: []// 要删除的数据id
    }
  },
  computed: {
    categoryStatus() {
      return data => {
        const status = data.status === 1 ? ' (已禁用)' : ''
        return data.name + status
      }
    }
  },
  async created() {
    // 如果是从指定分类跳转过来
    if (this.$route.params.id) {
      // console.log(this.$route.params)
      this.form.category = this.$route.params.id
    }
    await this.getArticleData() // 获取分页数据
    await this.getCategoryList() // 获取分类列表
  },
  methods: {
    formateDate,
    /**
     * 获取表格数据
     * @returns {Promise<void>}
     */
    async getArticleData() {
      this.loading = true

      const res = await getArticles(this.form)
      this.total = res.data.total
      this.tableData = res.data.data

      this.loading = false
    },
    /**
     * 获取分类列表
     * @returns {Promise<void>}
     */
    async getCategoryList() {
      const res = await getList()
      this.category = res.data.map(item => {
        return {
          id: item.id,
          name: item.name,
          status: item.status
        }
      })
    },
    /**
     * 多选框选中的数据
     * @param val
     * @returns {Promise<void>}
     */
    async onHandleSelectionChange(val) {
      this.deleteIds = val.map(item => item.id)
    },
    /**
     * 修改每页显示数量
     * @param limit
     */
    async onHandleSizeChange(limit) {
      this.form.limit = limit
      await this.getArticleData()
    },
    /**
     * 修改当前页码数
     * @param page
     */
    async onHandleCurrentChange(page) {
      this.form.page = page
      await this.getArticleData()
    },
    /**
     * 筛选信息改变重新获取数据
     * @returns {Promise<void>}
     */
    async onHandleSearchChange() {
      await this.getArticleData()
    },
    /**
     * 查询信息重置
     * @returns {Promise<void>}
     */
    async onHandleReset() {
      this.form = {
        title: '',
        status: '',
        show_cover: '',
        category: '',
        order: ''
      }
      await this.getArticleData()
    },
    /**
     * 新增文章,
     */
    onHandleAdd() {
      this.$router.push({ name: 'ArticleEdit' })
    },
    /**
     * 修改文章
     * @param data
     */
    onHandleEdit(data) {
      this.$router.push({ name: 'ArticleEdit', query: { id: data.id }})
    },
    /**
     * 修改或新增成功的回调
     */
    async onHandleCloseDialog() {
      this.showDialog = false // 关闭弹窗

      // 初始化数据
      this.newForm = {}
      this.isEdit = false

      // 重新获取数据
      await this.getArticleData()
    },
    /**
     * 批量删除文章
     */
    onHandleDelete() {
      this.$confirm('此操作将删除选中文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const ids = this.deleteIds.join()
        const res = await deleteArticle({ id: ids })
        this.$message({
          type: 'success',
          message: res.msg
        })
        // 重新获取文章列表
        await this.getArticleData()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    /**
     * 跳转到详情页
     * @param id
     */
    onHandleShowDetail(id) {
      this.$router.push({ name: 'ArticleDetail', params: { id: id }})
    },
    /**
     * 直接修改状态或展示在封面
     * @param type 状态还是封面
     * @param data 整行数据
     * @param val 新的数据
     */
    async onHAndleUpdateLine(type, data, val) {
      data[type] = val
      const res = await updateArticle(data)
      this.$message({
        message: res.msg,
        type: 'success'
      })

      await this.getArticleData()
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
