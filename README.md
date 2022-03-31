# edu-boss-fon

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### problems in project 
```
1.axios请求中拦截器中config的url与baseURL：
const request = axios.create({
    timeout: 2000
})

function getBaseURL(url) {
    if (url.startsWith('/boss')) {
        return 'http://eduboss.lagounews.com
    } else {
        return 'http://edufront.lagounews.com
    }
}
//  拦截器的作用仅仅是修改config中的baseURL
request.interceptors.request.use( config => {
    const baseURL = getBaseURL(config.url)
    return config
} )

2.组件的懒加载以及命名是如何实现的？
通过给路由中的component设置箭头函数: component : () => import(/* webpackChunkName: 'name' */'@/home/index.vue')

3.为什么使用elementUI组件的侧边栏并利用index跳转后，能够在main区域显示路由跳转的结果？
因为我们在<el-main></el-main>中设置了路由出口：<router-view></router-view>

4.element-ui的使用：
安装--在入口文件引入[main.js]--如有修改element-ui中的数据，再引入对应修改的scss文件--Vue.use(ElementUI)

5.vue.config.js中配置全局scss有什么用，说是webpack识别到scss文件后自动引入，具体是引入哪个呢？

6.对于保存Vuex的数据，在根实例等地方[ 如果是在script区域可通过this.$store.state.dataName访问； 如果实在html区域、插值表达式区域直接通过$store.state.dataName访问。
```
