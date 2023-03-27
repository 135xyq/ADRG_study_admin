<template>
  <div class="question-container">
    <div class="search-container">
      <el-form :inline="true" :model="form" class="demo-form-inline" size="mini">
        <el-form-item>
          <el-input v-model="form.title" clearable placeholder="题目标题" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.type" clearable placeholder="题目类型" @change="onHandleSearchChange">
            <el-option
              v-for="(item,index) in type"
              :key="index"
              :label="item.key"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.level" clearable placeholder="题目等级" @change="onHandleSearchChange">
            <el-option
              v-for="(item,index) in level"
              :key="index"
              :label="item.key"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.category" clearable placeholder="分类查询" @change="onHandleSearchChange">
            <el-option
              v-for="item in category"
              :key="item.id"
              :label="getStatus(item)"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.parse" clearable placeholder="是否有解析" @change="onHandleSearchChange">
            <el-option
              v-for="(item,index) in parse"
              :key="index"
              :label="item.key"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.status" clearable placeholder="题目状态" @change="onHandleSearchChange">
            <el-option
              v-for="(item,index) in status"
              :key="index"
              :label="item.key"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.sort" clearable placeholder="排序方式" @change="onHandleSearchChange">
            <el-option
              v-for="(item,index) in sort"
              :key="index"
              :label="item.key"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="onHandleSearchChange">查询</el-button>
          <el-button icon="el-icon-refresh" @click="onHandleReset">重置</el-button>
          <el-button :disabled="deleteIds.length === 0" icon="el-icon-delete" type="danger" @click="onHandleDelete">删除
          </el-button>
          <el-button icon="el-icon-plus" type="success" @click="onHandleAdd">新增题目</el-button>
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
          label="题目"
          prop="title"
          show-overflow-tooltip
          width="200"
        />
        <el-table-column
          align="center"
          label="答案"
          prop="answer"
          show-overflow-tooltip
          width="200"
        />
        <el-table-column
          align="center"
          label="解析"
          show-overflow-tooltip
          width="300"
        >
          <template slot-scope="scope">
            {{ scope.row.parse ? scope.row.parse : '暂无解析' }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="答题人次"
          prop="test_count"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          label="正确率"
          prop="like_count"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{
              scope.row.solve_count === 0 ? '0%' : ((scope.row.solve_count / scope.row.test_count) * 100).toFixed(2) + '%'
            }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="类型"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-tag size="medium">{{ getType(scope.row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="难度"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === 0" effect="dark" size="medium" type="success">简单</el-tag>
            <el-tag v-if="scope.row.level === 1" effect="dark" size="medium" type="waring">中等</el-tag>
            <el-tag v-if="scope.row.level === 2" effect="dark" size="medium" type="danger">困难</el-tag>
          </template>
        </el-table-column>
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
              @change="onHandleStatusChange(scope.row,$event)"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="分类"
          show-overflow-tooltip
          width="200"
        >
          <template slot-scope="scope">
            <el-link @click="onHandleGoToCategory(scope.row.question_category_id)">
              <el-tag
                type="success"
              >
                {{ scope.row.questionCategory.title }}
              </el-tag>
            </el-link>
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
            <el-button icon="el-icon-view" size="mini" type="info" @click="onHandleShowDetail(scope.row)">详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        :current-page="form.page"
        :page-size="form.limit"
        :page-sizes="[20, 30, 50, 100,200]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="onHandleSizeChange"
        @current-change="onHandleCurrentChange"
      />
    </div>
    <Detail :dialog-show="showDetailDialog" :form-data="detailData" @closeDetail="onHandleCloseDetail" />
    <Edit :form-data="newForm" :is-edit="isEdit" :show-dialog="showEditDialog" @closeEditDialog="onHandleCloseDialog" />
  </div>
</template>

<script>
// 题目列表页

import { deleteQuestion, getQuestion, updateQuestion } from '@/api/question'
import { formateDate } from '@/utils/formate'
import { getList } from '@/api/questionCategory'
import { level, parse, sort, status, type } from '@/config/question'
import Detail from '@/views/Question/Detail'
import Edit from '@/views/Question/Edit'

export default {
  name: 'Question',
  components: {
    Detail,
    Edit
  },
  data() {
    return {
      type,
      status,
      level,
      sort,
      parse,
      tableData: [], // 表格数据
      form: {
        page: 1,
        limit: 20,
        title: '',
        status: '',
        type: '',
        level: '',
        category: '',
        order: '',
        parse: ''
      },
      loading: false, // 数据加载
      category: [], // 分类列表
      total: 0,
      isEdit: false, // 是否是编辑
      newForm: {}, // 修改或新增的数据
      showEditDialog: false, // 是否展示修改和新增弹窗
      deleteIds: [], // 要删除的数据id
      showDetailDialog: false, // 是否展示详情弹窗
      detailData: {} // 详情数据
    }
  },
  computed: {
    getStatus() {
      return data => {
        const status = data.status === 1 ? ' (已禁用)' : ''
        return data.title + status
      }
    },
    // 等级
    getLevel() {
      return level => {
        const arr = this.level.filter(item => item.value === level)
        return arr[0] ? arr[0].key : '等级有误'
      }
    },
    // 种类
    getType() {
      return type => {
        const arr = this.type.filter(item => item.value === type)
        return arr[0] ? arr[0].key : '类型有误'
      }
    }
  },
  async created() {
    // 如果是从指定分类跳转过来
    if (this.$route.query.id) {
      this.form.category = this.$route.query.id
    }
    await this.getQuestionData() // 获取分页数据
    await this.getCategoryList() // 获取分类列表
  },
  methods: {
    formateDate,
    /**
     * 获取表格数据
     * @returns {Promise<void>}
     */
    async getQuestionData() {
      this.loading = true

      const res = await getQuestion(this.form)
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
          title: item.title,
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
      await this.getQuestionData()
    },
    /**
     * 修改当前页码数
     * @param page
     */
    async onHandleCurrentChange(page) {
      this.form.page = page
      await this.getQuestionData()
    },
    /**
     * 筛选信息改变重新获取数据
     * @returns {Promise<void>}
     */
    async onHandleSearchChange() {
      await this.getQuestionData()
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
      await this.getQuestionData()
    },
    /**
     * 新增题目
     */
    onHandleAdd() {
      this.newForm = {}
      this.isEdit = false
      this.showEditDialog = true
    },
    /**
     * 修改题目
     * @param data
     */
    onHandleEdit(data) {
      this.newForm = { ...data }
      this.isEdit = true
      this.showEditDialog = true
    },
    /**
     * 修改或新增成功的回调
     */
    async onHandleCloseDialog() {
      this.showEditDialog = false // 关闭弹窗

      // 初始化数据
      this.newForm = {}
      this.isEdit = false

      // 重新获取数据
      await this.getQuestionData()
    },
    /**
     * 批量删除题目
     */
    onHandleDelete() {
      this.$confirm('此操作将删除选中题目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const ids = this.deleteIds.join()
        const res = await deleteQuestion({ id: ids })
        this.$message({
          type: 'success',
          message: res.msg
        })
        // 重新获取问题列表
        await this.getQuestionData()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    /**
     * 跳转到分类页
     * @param id
     */
    onHandleGoToCategory(id) {
      this.$router.push({ name: 'QuestionCategory', params: { id: id }})
    },
    /**
     * 展示详情页
     * @param data
     */
    onHandleShowDetail(data) {
      this.showDetailDialog = true
      this.detailData = { ...data }
    },
    /**
     * 关闭详情页展示
     */
    onHandleCloseDetail() {
      this.showDetailDialog = false
    },
    /**
     * 修改题目的状态
     * @param data 数据
     * @param val 修改后的值
     * @returns {Promise<void>}
     */
    async onHandleStatusChange(data, val) {
      data.status = val

      const res = await updateQuestion(data)
      this.$message({
        message: res.msg,
        type: 'success'
      })

      // 重新获取数据
      await this.getQuestionData()
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
