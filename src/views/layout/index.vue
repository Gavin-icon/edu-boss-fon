<template>
  <el-container>
    <el-aside width="200px">
      <!--侧边栏组件-->
      <app-aside></app-aside>
    </el-aside>
    <el-container>
      <el-header>
        <!--头部组件-->
        <app-header></app-header>
      </el-header>
      <el-main>
        <!--设置子路由的出口-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
//  引入侧边栏组件
import AppAside from './components/app-aside.vue'
//  引入头部组件
import AppHeader from './components/app-header.vue'
export default {
  name: 'Layout',
  components: {
    AppAside,
    AppHeader
  }
}
</script>

<style lang="scss" scoped>
.el-container {
  min-width: 980px;
  // 1vh 代表视口高度的1%
  height: 100vh;
}
.el-aside {
  background-color: #d3dce6;
}
.el-header {
  background-color: #f1f1f1;
}
.el-main {
  background-color: #e9eef3;
}
</style>
