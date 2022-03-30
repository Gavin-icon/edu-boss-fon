<template>
  <div id="app">
    <h1>拉勾教育</h1>
    <!--根路由出口-->
    <router-view/>
  </div>
</template>

<style lang="scss">
  //scss引入时，~是必须的。 @/ 表示 src/  --这是webpack的别名
  // @import '~@/styles/variables.scss';  //--已经在vue.config.js中配置，无需再写，webpack会读取到scss后自动添加
</style>
