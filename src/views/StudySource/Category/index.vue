<template>
  <div class="category-container">
    <div class="search-container" />
    <div class="table-container">
      <el-table
        :data="tableData"
        style="width: 100%"
        tooltip-effect="dark"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        stripe
        border
      >
        <el-table-column
          label="编号"
          prop="id"
          show-overflow-tooltip
          width="80"
          align="center"
        />
        <el-table-column
          label="名称"
          prop="name"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          label="描述信息"
          prop="description"
          align="center"
          width="600"
          show-overflow-tooltip
        />
        <el-table-column
          label="创建日期"
          prop="create_time"
          show-overflow-tooltip
          align="center"
        />
        <el-table-column
          label="操作"
          align="center"
          width="260"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-row class="el-row">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="onHandleEdit(scope.row.id)">编辑分类</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="onHandleDelete(scope.row.id)">删除分类</el-button>
            </el-row>
            <el-row>
              <el-button type="success" icon="el-icon-video-camera" size="mini" @click="onHandleGoToVedio(scope.row.id)">视频列表</el-button>
              <el-button type="info" icon="el-icon-document" size="mini" @click="onHandleGoToArticle(scope.row.id)">文章列表</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
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
    }
  }
}
</script>

<style scoped lang="scss">
.el-row{
  margin-bottom: 6px;
}
</style>
