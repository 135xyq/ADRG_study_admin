<template>
  <div class="category-container">
    <div class="search-container">
      <el-form :inline="true" :model="form" class="demo-form-inline" size="mini">
        <el-form-item>
          <el-input v-model="form.name" placeholder="分类名称" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.status" clearable placeholder="分类状态" @change="onHandleSearchForStatusChange">
            <el-option
              label="未禁用"
              :value="1"
            />
            <el-option
              label="禁用"
              :value="0"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="onHandleSubmit">查询</el-button>
          <el-button icon="el-icon-refresh" @click="onHandleReset">重置</el-button>
          <el-button icon="el-icon-plus" type="success" @click="onHandleAdd">新增分类</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-container">
      <el-table
        v-loading="loading"
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
          width="250"
          sortable
        />
        <el-table-column
          align="center"
          label="描述信息"
          prop="description"
          show-overflow-tooltip
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
              @change="onHandleStatusChange(scope.row.id,$event)"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="排序"
          prop="sort"
          show-overflow-tooltip
          width="100"
          sortable
        />
        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="260"
        >
          <template slot-scope="scope">
            <el-row class="el-row">
              <el-button icon="el-icon-edit" size="mini" type="primary" @click="onHandleEdit(scope.row)">编辑分类
              </el-button>
              <el-button icon="el-icon-delete" size="mini" type="danger" @click="onHandleDelete(scope.row.id)">删除分类
              </el-button>
            </el-row>
            <el-row>
              <el-button
                icon="el-icon-video-camera"
                size="mini"
                type="success"
                @click="onHandleGoToVideo(scope.row.id)"
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
        :page-sizes="[10,20, 30, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="onHandleSizeChange"
        @current-change="onHandleCurrentChange"
      />
    </div>
    <Update :form="childForm" :is-edit="childIsEdit" :is-show-dialog="isShowDialog" @endUpdate="onHandleEndUpdate" />
  </div>
</template>

<script>
// 学习视频、文章的分类
import { deleteCategory, page, update } from '@/api/studyCategory'
import Update from './Update'

export default {
  name: 'Category',

  components: {
    Update
  },
  data() {
    return {
      tableData: [], // 分类表格数据
      form: {
        page: 1,
        limit: 20,
        name: '',
        status: ''
      }, // 查询和分页数据
      total: 0, // 数据总数
      loading: false, // 是否在加载数据
      childIsEdit: false, // 是否是修改
      childForm: {}, // 修改或新增的数据对象
      isShowDialog: false // 是否展示修改表单
    }
  },
  async created() {
    // 初始化表格数据
    await this.getData()
  },
  methods: {
    /**
     * 获取分页数据
     * @param isPage
     * @returns {Promise<void>}
     */
    async getData(isPage = false) {
      this.loading = true

      // 如果不是更改页码，则需要将分页数据重置
      if (!isPage) {
        this.form = {
          ...this.form,
          page: 1,
          limit: 20
        }
      }

      // 获取分页数据
      const res = await page(this.form)
      this.total = res.data.total
      this.tableData = res.data.data

      // 结束数据加载loading
      this.loading = false
    },
    /**
     * 修改分类
     * @param data
     */
    onHandleEdit(data) {
      this.childIsEdit = true
      this.childForm = {
        id: data.id,
        name: data.name,
        description: data.description,
        status: data.status,
        sort: data.sort
      }
      this.isShowDialog = true
    },

    /**
     * 删除一个分类
     * @param id 要删除的分类
     * @returns {Promise<void>}
     */
    async onHandleDelete(id) {
      this.$confirm('此操作将删除该分类，并删除该分类下的视频和文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await deleteCategory({ id })
        this.$message({
          message: res.msg,
          type: 'success'
        })
        // 删除后要重新获取数据
        await this.getData()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })

      await this.getData()
    },

    /**
     * 跳转至视频列表页面
     * @param id 分类id
     */
    onHandleGoToVideo(id) {
      this.$router.push({ name: 'VideoList', params: { id: id }})
    },
    /**
     * 跳转至文章列表页
     * @param id 分类id
     */
    onHandleGoToArticle(id) {
      this.$router.push({ name: 'ArticleList', params: { id: id }})
    },
    /**
     * 修改每页显示数量
     * @param limit
     */
    async onHandleSizeChange(limit) {
      this.form.limit = limit
      await this.getData(true)
    },
    /**
     * 修改当前页码数
     * @param page
     */
    async onHandleCurrentChange(page) {
      this.form.page = page
      await this.getData(true)
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
        name: '',
        status: ''
      }
      await this.getData()
    },
    /**
     * 新增一个分类
     */
    onHandleAdd() {
      this.childIsEdit = false
      this.childForm = {
        status: 1,
        sort: 1
      }
      this.isShowDialog = true
    },
    /**
     * 新增或更新的回调函数
     * 关闭弹框、重置数据、重新获取数据
     */
    async onHandleEndUpdate() {
      this.isShowDialog = false
      this.childIsEdit = false
      this.childForm = {}

      await this.getData()
    },
    /**
     * switch开关修改分类的状态
     * @param id 分类id
     * @param val 新状态
     * @returns {Promise<void>}
     */
    async onHandleStatusChange(id, val) {
      const res = await update({ id: id, status: val })
      this.$message({
        message: res.msg,
        type: 'success'
      })
      await this.getData()
    },
    /**
     * 状态下拉框改变自动请求数据
     * @returns {Promise<void>}
     */
    async onHandleSearchForStatusChange() {
      await this.getData()
    }
  }
}
</script>

<style lang="scss" scoped>
.search-container {
  margin: 20px 0 10px 20px;
}

.el-row {
  margin-bottom: 6px;
}

.page-container {
  display: flex;
  justify-content: right;
  margin: 20px;
}
</style>
