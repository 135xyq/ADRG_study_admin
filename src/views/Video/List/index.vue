<template>
  <div class="video-container">
    <div class="search-container">
      <el-form :inline="true" :model="form" class="demo-form-inline" size="mini">
        <el-form-item>
          <el-input v-model="form.title" placeholder="视频标题" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.status" clearable placeholder="视频状态" @change="onHandleSearchChange">
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
              label="观看数优先"
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
          <el-button icon="el-icon-plus" type="success" @click="onHandleAdd">新增视频</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-container">
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        border
        stripe
        style="width: 100%"
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
          align="center"
          label="视频地址"
          prop="url"
          show-overflow-tooltip
          width="200"
        />
        <el-table-column
          label="视频缩略图"
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
          label="视频时长"
          show-overflow-tooltip
          width="130"
        >
          <template slot-scope="scope">
            {{ formateDate(scope.row.duration) }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="观看数"
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
              @change="onHAndleUpdateLine('show_cover',scope.row,$event)"
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
          width="260"
        >
          <template slot-scope="scope">
            <el-row class="el-row">
              <el-button icon="el-icon-edit" size="mini" type="primary" @click="onHandleEdit(scope.row)">视频编辑
              </el-button>
              <el-button icon="el-icon-view" size="mini" type="info" @click="onHandleShowDetail(scope.row.id)">视频详情
              </el-button>
            </el-row>
            <el-row class="el-row">
              <el-button
                icon="el-icon-s-comment"
                size="mini"
                type="warning"
                @click="onHandleGoToUserOption(scope.row.id,'CommentList')"
              >
                评论列表
              </el-button>
              <el-button
                icon="el-icon-thumb"
                size="mini"
                type="success"
                @click="onHandleGoToUserOption(scope.row.id,'LikeList')"
              >点赞列表
              </el-button>
            </el-row>
            <el-row class="el-row">
              <el-button
                icon="el-icon-star-on"
                size="mini"
                type="danger"
                @click="onHandleGoToUserOption(scope.row.id,'StarList')"
              >收藏列表
              </el-button>
              <el-button
                icon="el-icon-s-claim"
                size="mini"
                @click="onHandleGoToUserOption(scope.row.id,'StudyHistoryList')"
              >学习记录
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
    <Upate :form-data="newForm" :is-edit="isEdit" :show-dialog="showDialog" @editSuccess="onHandleCloseDialog" />
  </div>
</template>

<script>
// 视频列表页

import { deleteVideo, getVideos, updateVideo } from '@/api/video'
import { formateDate } from '@/utils/formate'
import { getList } from '@/api/studyCategory'
import Upate from '@/views/Video/Upate'

export default {
  name: 'Video',
  components: {
    Upate
  },
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
      loading: false,
      category: [], // 分类列表
      total: 0,
      isEdit: false, // 是否是编辑
      newForm: {}, // 修改或新增的数据
      showDialog: false, // 是否展示弹窗
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
      this.form.category = this.$route.params.id
    }
    await this.getVideoData() // 获取分页数据
    await this.getCategoryList() // 获取分类列表
  },
  methods: {
    formateDate,
    /**
     * 获取表格数据
     * @returns {Promise<void>}
     */
    async getVideoData() {
      this.loading = true

      const res = await getVideos(this.form)
      this.total = res.data.total
      this.tableData = res.data.data

      this.loading = false
    },
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
      await this.getVideoData()
    },
    /**
     * 修改当前页码数
     * @param page
     */
    async onHandleCurrentChange(page) {
      this.form.page = page
      await this.getVideoData()
    },
    /**
     * 筛选信息改变重新获取数据
     * @returns {Promise<void>}
     */
    async onHandleSearchChange() {
      await this.getVideoData()
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
      await this.getVideoData()
    },
    /**
     * 新增视频
     */
    onHandleAdd() {
      this.newForm = {}
      this.isEdit = false
      this.showDialog = true
    },
    /**
     * 修改视频
     * @param data
     */
    onHandleEdit(data) {
      this.newForm = { ...data }
      this.isEdit = true
      this.showDialog = true
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
      await this.getVideoData()
    },
    /**
     * 批量删除视频
     */
    onHandleDelete() {
      this.$confirm('此操作将删除选中视频, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const ids = this.deleteIds.join()
        const res = await deleteVideo({ id: ids })
        this.$message({
          type: 'success',
          message: res.msg
        })
        // 重新获取视频列表
        await this.getVideoData()
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
      this.$router.push({ name: 'VideoDetail', query: { videoId: id }})
    },
    /**
     * 直接修改状态或展示在封面
     * @param type 状态还是封面
     * @param data 整行数据
     * @param val 新的数据
     */
    async onHAndleUpdateLine(type, data, val) {
      data[type] = val
      const res = await updateVideo(data)
      this.$message({
        message: res.msg,
        type: 'success'
      })

      await this.getVideoData()
    },
    /**
     * 跳转到视频的评论、点赞、收藏等页面
     * @param id
     * @param routeName
     */
    onHandleGoToUserOption(id, routeName) {
      this.$router.push({ name: routeName, params: { id: id, type: 'video' }})
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

.el-row {
  margin-bottom: 6px;
}
</style>
