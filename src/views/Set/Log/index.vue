<template>
  <div class="log-container">
    <div class="search-container">
      <el-form :inline="true" :model="form" class="demo-form-inline" size="mini">
        <el-form-item>
          <el-input v-model="form.username" placeholder="管理员" />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="form.create_time"
            end-placeholder="结束日期"
            range-separator="至"
            start-placeholder="开始日期"
            type="datetimerange"
          />
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.type" clearable placeholder="日志类型" @change="onHandleSubmit">
            <el-option :value="1" label="登陆日志" />
            <el-option :value="2" label="操作日志" />
            <el-option :value="3" label="错误日志" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="onHandleSubmit">查询</el-button>
          <el-button icon="el-icon-refresh" @click="onHandleReset">重置</el-button>
          <el-button
            :disabled="deleteIds.length === 0 || isDeleting"
            icon="el-icon-delete"
            type="danger"
            @click="onHandleDelete"
          >删除
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-container">
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        size="mini"
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
          label="管理员"
          prop="username"
          width="120"
        />
        <el-table-column
          label="请求url"
          prop="url"
          show-overflow-tooltip
          width="400"
        />
        <el-table-column
          align="center"
          label="客户端ip"
          prop="ip"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          label="创建时间"
          prop="create_time"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          label="类型"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-tag
              :type="(getType(scope.row.type)).type"
              effect="dark"
              size="mini"
            >
              {{ (getType(scope.row.type)).label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-button icon="el-icon-view" size="mini" type="primary" @click="onHandleShowDetail(scope.row.id)">详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <div class="block">
        <el-pagination
          :current-page="form.page"
          :page-size="20"
          :page-sizes="[20, 50, 100, 200]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="onHandleSizeChange"
          @current-change="onHandleCurrentChange"
        />
      </div>
    </div>
    <div class="dialog-container">
      <el-dialog
        :visible.sync="dialogVisible"
        title="查看详情"
        width="30%"
      >
        <table
          align="center"
          class="table table-bordered"
          style="word-break:break-all; margin-bottom:50px;  font-size:13px;"
          width="100%"
        >
          <tbody>
            <tr>
              <td class="title" width="100">用户名：</td>
              <td>
                {{ detailData.username }}
              </td>
            </tr>
            <tr>
              <td class="title" width="100">请求url：</td>
              <td>
                {{ detailData.url }}
              </td>
            </tr>
            <tr>
              <td class="title" width="100">客户端ip：</td>
              <td>
                {{ detailData.ip }}
              </td>
            </tr>
            <tr>
              <td class="title" width="100">浏览器信息：</td>
              <td>
                {{ detailData.useragent }}
              </td>
            </tr>
            <tr>
              <td class="title" width="100">请求内容：</td>
              <td>
                {{ detailData.content }}
              </td>
            </tr>
            <tr>
              <td class="title" width="100">异常信息：</td>
              <td>
                {{ detailData.error_info }}
              </td>
            </tr>
            <tr>
              <td class="title" width="100">创建时间：</td>
              <td>
                {{ detailData.create_time }}
              </td>
            </tr>
            <tr>
              <td class="title" width="100">类型：</td>
              <td>
                <span v-if="detailData.type === 1">登录日志</span>
                <span v-if="detailData.type === 2">操作日志</span>
                <span v-if="detailData.type === 3">异常日志</span>
              </td>
            </tr>
          </tbody>
        </table>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// 日志记录页面

import { deleteLog, detail, page } from '@/api/log'

export default {
  name: 'Log',
  data() {
    return {
      tableData: [], // 表格数据
      total: 0, // 数据总量
      loading: false,
      deleteIds: [], // 要删除数据的id
      isDeleting: false, // 正在删除数据
      dialogVisible: false, // 显示详情
      form: {
        page: 1,
        limit: 20,
        username: '',
        type: '',
        create_time: ''
      }, // 查询条件
      detailData: {} // 日志详情
    }
  },
  computed: {
    /**
     * 根据传入的type 得到对应的数据
     * @returns {(function(*): (string))|*}
     */
    getType() {
      return (type) => {
        switch (type) {
          case 1:
            return {
              type: 'success',
              label: '登录日志'
            }
          case 2:
            return {
              type: '',
              label: '操作日志'
            }
          case 3:
            return {
              type: 'danger',
              label: '错误日志'
            }
          default:
            return {
              type: 'info',
              label: '其他'
            }
        }
      }
    }
  },
  async created() {
    await this.getData()
  },
  methods: {
    /**
     * 获取数据
     * @returns {Promise<void>}
     */
    async getData() {
      this.loading = true // 开始加载
      const res = await page(this.form)
      if (res.code === 0) {
        this.tableData = res.data.data
        this.total = res.data.total
      }
      this.loading = false // 加载完毕
    },

    /**
     * 表格多选获取选中的id
     * @param val
     */
    onHandleSelectionChange(val) {
      this.deleteIds = val.map(item => {
        return item.id
      })
    },

    /**
     * 修改每页显示多少条数据
     * @param val
     */
    async onHandleSizeChange(val) {
      this.form.limit = val
      await this.getData()
    },

    /**
     * 修改当前的页码
     * @param val
     */
    async onHandleCurrentChange(val) {
      this.form.page = val
      await this.getData()
    },

    /**
     * 根据条件查询数据
     * @returns {Promise<void>}
     */
    async onHandleSubmit() {
      await this.getData()
    },

    /**
     * 重置查询条件
     * @returns {Promise<void>}
     */
    async onHandleReset() {
      this.form = {
        ...this.form,
        username: '',
        type: '',
        create_time: ''
      } // 查询条件
      await this.getData()
    },

    /**
     * 批量删除数据
     * @returns {Promise<void>}
     */
    async onHandleDelete() {
      // 正在删除加载中，无法再次删除
      this.isDeleting = true
      // console.log({ id: this.deleteIds.join() })
      const res = await deleteLog({ id: this.deleteIds.join() })
      if (res.code === 0) {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        await this.getData()
      }
      this.isDeleting = false
    },
    async onHandleShowDetail(id) {
      this.dialogVisible = true
      const res = await detail({ id })
      this.detailData = res.data
    }
  }
}
</script>

<style lang="scss" scoped>
.log-container {
  .search-container {
    margin: 20px 15px 0;
  }

  .page-container {
    display: flex;
    justify-content: right;
    margin: 20px 20px 0 0;
  }

  .dialog-container {
    .table-bordered {
      border: 1px solid #ebebeb;
    }
  }
}

</style>
