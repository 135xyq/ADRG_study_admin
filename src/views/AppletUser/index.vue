<template>
  <div class="applet-user-container">
    <div class="search-container">
      <el-form :inline="true" :model="form" class="demo-form-inline" size="mini">
        <el-form-item label="用户昵称">
          <el-input v-model="form.keyword" placeholder="用户昵称" />
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="onHandleSearchChange">查询</el-button>
          <el-button icon="el-icon-refresh" @click="onHandleReset">重置</el-button>
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
      >
        <el-table-column
          align="center"
          label="编号"
          prop="id"
          width="100"
        />
        <el-table-column
          align="center"
          label="昵称"
          prop="nick_name"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          label="性别"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ getUserGender(scope.row.gender) }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="头像"
          prop="description"
        >
          <template slot-scope="scope">
            <el-image
              :preview-src-list="[scope.row.avatar]"
              :src="scope.row.avatar"
              style="width: 100px; height: 100px"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="试卷出题数"
          prop="userSet.question_count"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          label="试卷出题难度"
          show-overflow-tooltip
        >
          <template v-if="scope.row.userSet" slot-scope="scope">
            <el-tag v-if="scope.row.userSet.level === 0" type="success">简单</el-tag>
            <el-tag v-if="scope.row.userSet.level === 1" type="warning">中等</el-tag>
            <el-tag v-if="scope.row.userSet.level === 2" type="danger">困难</el-tag>
            <el-tag v-if="scope.row.userSet.level === 3" type="info">不限制</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="试卷出题类型"
          show-overflow-tooltip
        >
          <template v-if="scope.row.userSet" slot-scope="scope">
            <el-tag v-if="scope.row.userSet.question_type === 1" type="success">只出新题</el-tag>
            <el-tag v-if="scope.row.userSet.question_type === 2" type="warning">只出错题</el-tag>
            <el-tag v-if="scope.row.userSet.question_type === 3" type="danger">新题加错题</el-tag>
            <el-tag v-if="scope.row.userSet.question_type === 4" type="info">不限制</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="点赞数"
          prop="create_time"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          label="收藏数"
          prop="create_time"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          label="评论数"
          prop="create_time"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          label="注册日期"
          prop="create_time"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="250"
        >
          <template slot-scope="scope">
            <el-row>
              <el-button class="el-icon-s-comment" size="mini" type="primary" @click="onHandleToPage('CommentList',scope.row.id)">评论列表</el-button>
              <el-button class="el-icon-star-on" size="mini" type="success" @click="onHandleToPage('StarList',scope.row.id)">收藏列表</el-button>
            </el-row>
            <el-row style="margin-top: 10px">
              <el-button class="el-icon-s-release" size="mini" type="info" @click="onHandleToPage('QuestionRecord',scope.row.id)">做题记录</el-button>
              <el-button class="el-icon-thumb" size="mini" type="warning" @click="onHandleToPage('LikeList',scope.row.id)">点赞列表</el-button>
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
  </div>
</template>

<script>
// 用户列表页

import { getAppletUsers } from '@/api/appletUser'

export default {
  name: 'AppletUser',
  data() {
    return {
      tableData: [], // 表格数据
      form: {
        page: 1,
        limit: 20,
        keyword: ''
      },
      total: 0,
      loading: false
    }
  },
  computed: {
    getUserGender(gender) {
      return gender => {
        switch (gender) {
          case 1:
            return '男'
          case 2:
            return '女'
          default:
            return '未知'
        }
      }
    }
  },
  async created() {
    await this.getAppletUserData() // 获取分页数据
  },
  methods: {
    /**
     * 获取表格数据
     * @returns {Promise<void>}
     */
    async getAppletUserData() {
      this.loading = true

      const res = await getAppletUsers(this.form)
      this.total = res.data.total
      this.tableData = res.data.data

      this.loading = false
    },
    /**
     * 修改每页显示数量
     * @param limit
     */
    async onHandleSizeChange(limit) {
      this.form.limit = limit
      await this.getAppletUserData()
    },
    /**
     * 修改当前页码数
     * @param page
     */
    async onHandleCurrentChange(page) {
      this.form.page = page
      await this.getAppletUserData()
    },
    /**
     * 确认查询数据
     * @returns {Promise<void>}
     */
    async onHandleSearchChange() {
      await this.getAppletUserData()
    },
    /**
     * 查询信息重置
     * @returns {Promise<void>}
     */
    async onHandleReset() {
      this.form = {
        keyword: ''
      }
      await this.getAppletUserData()
    },
    /**
     * 跳转到指定页面
     * @param pageName
     * @param id
     */
    onHandleToPage(pageName, id) {
      this.$router.push({ name: pageName, params: { userId: id }})
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
