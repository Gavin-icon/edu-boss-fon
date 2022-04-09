<template>
  <div class="app-header">
      <!--左侧面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
    </el-breadcrumb>
      <!--右侧用户信息显示-->
    <el-dropdown>
      <span class="el-dropdown-link">
        <el-avatar :src="userInfo.portrait || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"></el-avatar>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>{{ userInfo.userName }}</el-dropdown-item>
        <!--组件设置点击事件无效，组件设置的是自定义事件，在后边加上.native后该事件变为原生事件-->
        <el-dropdown-item divided @click.native="handleLoginOut">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
//  引入用户信息接口
import { getUserInfo } from '@/services/user.js'

export default {
  name: 'AppHeader',
  created () {
    //  加载用户信息
    this.loadUserInfo()
  },
  data () {
    return {
      // 用户信息
      userInfo: {}
    }
  },
  methods: {
    async loadUserInfo () {
      //  getUserInfo 获取到的是一个包含data的整体内容，通过解构获取内部的data
      const { data } = await getUserInfo()
      this.userInfo = data.content
    },
    handleLoginOut () {
      // 提示信息
      this.$confirm('确定退出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
        //  清除store中user信息
        this.$store.commit('setUser', {
          data: null
        })
        //  跳转登录页
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消此操作'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-header {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
  }
  .el-dropdown-link {
      display: flex;
      align-items: center;
  }
</style>
