<template>
  <div id="app">
    <!--根路由出口-->
    <router-view/>
  </div>
</template>

<script>
//  封装了axios于request中
// import request from '@/utils/request'

// request({
//   mehtod: 'GET',
//   // url: '/front/ad/getAdList'
//   url: '/boss/v2/api-docs?group=edu-boss-boot'
// }).then(res => console.log(res))
export default {

}
</script>

<style lang="scss">
  //scss引入时，~是必须的。 @/ 表示 src/  --这是webpack的别名
  // @import '~@/styles/variables.scss';  //--已经在vue.config.js中配置，无需再写，webpack会读取到scss后自动添加
</style>
