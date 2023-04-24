<template>
  <div v-loading="deleteLoading" class="question-reslove-container">
    <div class="search-container">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="mini">
        <el-form-item label="用户">
          <el-autocomplete
            v-model="searchForm.userName"
            :fetch-suggestions="querySearchAsync"
            :trigger-on-focus="false"
            class="inline-input"
            placeholder="用户姓名"
            @select="onHandleSearch"
          />
        </el-form-item>
        <el-form-item label="题目分类">
          <el-select v-model="searchForm.category" clearable placeholder="题目分类列表" @change="onHandleSearch">
            <el-option v-for="item in questionCategoryList" :key="item.value" :label="item.key" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="试卷的状态">
          <el-select v-model="searchForm.type" clearable placeholder="试卷的状态" @change="onHandleSearch">
            <el-option :value="-1" label="全部" />
            <el-option :value="0" label="已完成" />
            <el-option :value="1" label="未完成" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序方式">
          <el-select v-model="searchForm.sort" clearable placeholder="排序方式" @change="onHandleSearch">
            <el-option label="试卷创建时间" value="create_time" />
            <el-option label="用户交卷时间" value="submit_time" />
            <el-option label="答题时长" value="total_time" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="searchForm.time"
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
        :data="questionRecordData"
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
          label="所属题目分类"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-link @click="onHandleGoQuestionCategory(scope.row.questionCategory.id)">
              {{ scope.row.questionCategory.title }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="用户"
          show-overflow-tooltip
          width="200"
        >
          <template slot-scope="scope">
            <el-link @click="onHandleGoUser(scope.row.user.id)">
              {{ scope.row.user.nick_name }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="答题时长"
          prop="total_count"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.is_submit === 0 ? '用户未完成' : formateDate(scope.row.total_time) }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="试卷题目数量"
          show-overflow-tooltip
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.questionHistoryRecord.length }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="试卷状态"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_submit === 1" type="success">已完成</el-tag>
            <el-tag v-if="scope.row.is_submit === 0" type="danger">未完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="试卷创建时间"
          prop="create_time"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          label="用户交卷时间"
          prop="update_time"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="200"
        >
          <template slot-scope="scope">
            <el-button icon="el-icon-view" size="mini" type="info" @click="onHandleGoToDetail(scope.row.id)">详情
            </el-button>
            <el-button
              v-if="scope.row.is_submit === 1"
              icon="el-icon-edit"
              size="mini"
              type="primary"
              @click="onHandleGoToPeopleValidate(scope.row.id)"
            >判卷
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
  </div>
</template>

<script>
// 刷题记录页

import { getAppletUserList } from '@/api/appletUser'
import { getList as getQuestionCategoryList } from '@/api/questionCategory'
import { deleteQuestionRecord, getQuestionRecordPage } from '@/api/questionRecord'
import { formateDate } from '@/utils/formate'

export default {
  name: 'QuestionRecord',
  data() {
    return {
      searchForm: {
        user: '',
        type: -1,
        category: '',
        time: [],
        sort: 'create_time',
        page: 1,
        limit: 20
      },
      questionCategoryList: [], // 题目分类列表
      total: 0,
      loading: false,
      deleteLoading: false, // 删除时的加载
      deleteIds: [], // 要删除的id列表
      questionRecordData: [] // 记录列表
    }
  },
  async created() {
    // 获取题目分类列表
    await this.getQuestionCategoryList()

    // 获取刷题记录列表
    await this.getQuestionRecordData()
  },
  methods: {
    formateDate,
    /**
     * 获取用户信息搜索建议
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
     * 获取题目分类列表
     * @returns {Promise<void>}
     */
    async getQuestionCategoryList() {
      const res = await getQuestionCategoryList()

      if (res.code === 0) {
        this.questionCategoryList = res.data.map(item => {
          return {
            key: item.title,
            value: item.id
          }
        })
      }
    },
    /**
     * 获取记录列表
     * @returns {Promise<void>}
     */
    async getQuestionRecordData() {
      this.loading = true
      const res = await getQuestionRecordPage(this.searchForm)

      if (res.code === 0) {
        this.total = res.data.total
        this.questionRecordData = res.data.data
      }

      this.loading = false
    },
    /**
     * 查询
     * @returns {Promise<void>}
     */
    async onHandleSearch() {
      // console.log(this.searchForm)

      // 请求数据
      await this.getQuestionRecordData()
    },
    async onHnadleReset() {
      // console.log('reset')
      this.searchForm = {
        ...this.searchForm,
        user: '',
        type: -1,
        category: '',
        time: [],
        sort: 'create_time'
      }

      await this.getQuestionRecordData()
    },
    async onHandleDelete() {
      // console.log('delete', this.deleteIds)

      this.$confirm('此操作将删除选中刷题记录信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteLoading = true

        const ids = this.deleteIds.join()
        deleteQuestionRecord({ id: ids }).then(async res => {
          this.$message({
            type: 'success',
            message: res.msg
          })

          // 重新获取学刷题记录列表
          await this.getQuestionRecordData()

          this.deleteLoading = false
        }).catch((res) => {
          this.deleteLoading = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    /**
     * 多选数据改变处理函数
     * @param val 选中的数据
     */
    onHandleSelectionChange(val) {
      this.deleteIds = val.map(item => item.id)
    },
    /**
     * 跳转至题目分类页
     * @param id
     */
    onHandleGoQuestionCategory(id) {
      this.$router.push({ name: 'QuestionCategory', params: { id: id }})
    },
    /**
     * 跳转至用户页
     * @param id
     */
    onHandleGoUser(id) {
      this.$router.push({ name: 'AppletUser', params: { id: id }})
    },
    /**
     * 修改每页显示数量
     * @param limit
     */
    async onHandleSizeChange(limit) {
      this.searchForm.limit = limit
      await this.getQuestionRecordData()
    },
    /**
     * 修改当前页码数
     * @param page
     */
    async onHandleCurrentChange(page) {
      this.searchForm.page = page
      await this.getQuestionRecordData()
    },
    /**
     * 前往详情页
     * @param id
     */
    onHandleGoToDetail(id) {
      this.$router.push({ name: 'QuestionRecordDetail', query: { id: id }})
    },
    onHandleGoToPeopleValidate(id) {
      this.$router.push({ name: 'PeopleValidate', query: { id: id }})
    }
  }
}
</script>

<style lang="scss" scoped>
.search-container {
  margin: 20px 0 10px 20px;
}

.tabs-container {
  margin-left: 20px;
}

.page-container {
  display: flex;
  justify-content: right;
  margin: 20px;
}
</style>
