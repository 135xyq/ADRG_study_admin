<template>
  <div class="category-container">
    <div class="search-container">
      <el-form :inline="true" :model="form" class="demo-form-inline" size="mini">
        <el-form-item>
          <el-input v-model="form.name" placeholder="分类名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onHandleSubmit">查询</el-button>
          <el-button icon="el-icon-refresh" @click="onHandleReset">重置</el-button>
          <el-button type="success" icon="el-icon-plus" @click="onHandleAdd">新增分类</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-container">
      <el-table
        :data="tableData"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        border
        stripe
        style="width: 100%"
        tooltip-effect="dark"
      >
        <el-table-column
          align="center"
          label="编号"
          prop="id"
          show-overflow-tooltip
          width="80"
        />
        <el-table-column
          align="center"
          label="名称"
          prop="name"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          label="描述信息"
          prop="description"
          show-overflow-tooltip
          width="600"
        />
        <el-table-column
          align="center"
          label="创建日期"
          prop="create_time"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="260"
        >
          <template slot-scope="scope">
            <el-row class="el-row">
              <el-button icon="el-icon-edit" size="mini" type="primary" @click="onHandleEdit(scope.row.id)">编辑分类
              </el-button>
              <el-button icon="el-icon-delete" size="mini" type="danger" @click="onHandleDelete(scope.row.id)">删除分类
              </el-button>
            </el-row>
            <el-row>
              <el-button
                icon="el-icon-video-camera"
                size="mini"
                type="success"
                @click="onHandleGoToVedio(scope.row.id)"
              >视频列表
              </el-button>
              <el-button icon="el-icon-document" size="mini" type="info" @click="onHandleGoToArticle(scope.row.id)">
                文章列表
              </el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        :current-page="form.page"
        :page-size="form.limit"
        :page-sizes="[20, 30, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="onHandleSizeChange"
        @current-change="onHandleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
// 学习视频、文章的分类
import { page } from '@/api/studyCategory'

export default {
  name: 'Category',
  data() {
    return {
      tableData: [], // 分类表格数据
      form: {
        page: 1,
        limit: 20,
        name: ''
      }, // 查询和分页数据
      total: 0, // 数据总数
      loading: false // 是否在加载数据
    }
  },
  async created() {
    // 初始化表格数据
    await this.getData()
  },
  methods: {
    /**
     * 获取分页数据
     * @returns {Promise<void>}
     */
    async getData() {
      this.loading = true
      // 获取分页数据
      const res = await page(this.form)
      this.total = res.data.total
      this.tableData = res.data.data

      // 结束数据加载loading
      this.loading = false
    },
    onHandleEdit(id) {
      console.log('edit', id)
    },
    onHandleDelete(id) {
      console.log('delete', id)
    },
    onHandleGoToVedio(id) {
      console.log('vedio', id)
    },
    onHandleGoToArticle(id) {
      console.log('article', id)
    },
    /**
     * 修改每页显示数量
     * @param limit
     */
    async onHandleSizeChange(limit) {
      this.form.limit = limit
      await this.getData()
    },
    /**
     * 修改当前页码数
     * @param page
     */
    async onHandleCurrentChange(page) {
      this.form.page = page
      await this.getData()
    },
    /**
     * 关键词查询
     * @returns {Promise<void>}
     */
    async onHandleSubmit() {
      await this.getData()
    },
    /**
     * 查询信息重置
     * @returns {Promise<void>}
     */
    async onHandleReset() {
      this.form = {
        ...this.form,
        name: ''
      }
      await this.getData()
    },
    onHandleAdd() {
      console.log('add')
    }
  }
}
</script>

<style lang="scss" scoped>
.search-container{
  margin: 20px 0 10px 20px;
}
.el-row {
  margin-bottom: 6px;
}

.page-container{
  display: flex;
  justify-content: right;
  margin: 20px;
}
</style>
