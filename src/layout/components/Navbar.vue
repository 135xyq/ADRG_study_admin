<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <span class="name">{{ name }}</span>
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item @click.native="dialogFormVisible = true">
            <span style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出账号</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="update-password">
      <el-dialog :visible.sync="dialogFormVisible" title="修改密码" width="30%">
        <el-form :model="form">
          <el-form-item label="旧密码:" label-width="80px">
            <el-input v-model="form.oldPassword" autocomplete="off" />
          </el-form-item>
          <el-form-item label="新密码:" label-width="80px">
            <el-input v-model="form.newPassword" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="onHandleCancel">取 消</el-button>
          <el-button type="primary" :loading="loding" @click="onHandleupdatePassword">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { updatePassword } from '@/api/user'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      dialogFormVisible: false,
      form: {
        oldPassword: '',
        newPassword: ''
      },
      loding: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name',
      'token'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // 退出登录
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    // 修改密码
    async onHandleupdatePassword() {
      this.loding = true // 按钮加载中，防止重复提交
      // 输入验证，不能为空
      if (this.form.oldPassword.trim().length === 0 || this.form.newPassword.trim().length === 0) {
        this.$message({
          message: '密码格式错误！',
          type: 'error'
        })
        this.loding = false // 按钮加载结束
        return 0
      } else {
        this.loding = false
        const res = await updatePassword({
          ...this.form,
          token: this.token
        })

        // 修改成功
        if (res.code === 0) {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          // 修改成功需要 退出登录
          await this.logout()
          this.dialogFormVisible = false
        }
      }
    },
    // 取消修改密码，重置数据、关闭弹出框
    onHandleCancel() {
      this.dialogFormVisible = false
      this.form = {
        oldPassword: '',
        newPassword: ''
      }
      this.loding = false
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .name {
          display: inline-block;
          position: absolute;
          width: 50px;
          top: 0;
          right: 50px;
        }

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
