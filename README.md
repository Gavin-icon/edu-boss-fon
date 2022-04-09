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

7.meta.requiresAuth的意义：
meta.requiresAuth指的是Vuex登录路由验证，如果存在则说明需要登录验证才可放行；通过检测其值可以设置路由守卫；

8.路由守卫中如果本地存储无值且访问了需要登录才能访问的功能，则需要重定向到登录页面，通过next('/login')；但是我们采用会话级存储时，每次登录时才会往其中传递token值，所以需要点击两次才能进入；这时我们需要修改一下路由跳转的配置，先让其存储，再跳转到指定页面；

9.CreateOrEdit中，在编辑时无法不存在info信息，可能是添加菜单时，数据没有上传成功，现在仍然为解决该问题！！！！！！！！！！！！！！！！！！！
--2022.4.2找到答案：因为项目中他人已经创建多次菜单结构，在后台中平台已经删除记录的信息，但是那个空位却保持着，因此里边没有信息；[id被断开]项目中将那些不存在数据进行不显示处理，而我的项目中数据仍然按照普通的加载顺序，有几条数据，项目编号一次递增，导致了错误。
--(1)解决方法：当编辑页面实现路由跳转时，将传递的id参数修改为包含那些被删除数据的id值，||换个说法，就是将添加菜单时那个编号id修改为包含那些被删除数据的id值； 【第一种方法解决了问题，type="index"  ++index=1  ++  this.$router.push({ name: 'menu-edit', params: { id: editIndex + 396 } })，但是视图中的编号和后台不对应，但美观】【第二种方法解决了根本性的问题，后台的id是多少我们的编号就是多少；prop="id'  ++  this.$router.push({ name: 'menu-edit', params: { id: editIndex + 1 } })】
注意： elementUI 提供的 editIndex 获取索引时是从0开始的，所以即使根据后台数据[方法2]也得在传参时+1
--(2)在传入参数时直接在编号那使用后台中的id,不使用type=index；点击编辑或者是删除时通过scope.row获取到其中的id参数，不使用scope.$index；解决！！！

10.对资源列表中添加时间进行修改后再显示的问题：
①采用Vue过滤器进行设置：通过elementui的自定义模板获取数据: 通过 | 过滤器名称过滤
<template slot-scope="scope"><span>{{ scope.row.createdTime | dateFormat }}</span></template>;
②通过new Date() 进行过滤， 然后通过模板字符串进行拼接，${date.getFullYears()}......

11.当我们查询资源列表后，如果数据很多，我们看到了第三页...，当我们此时查询一个数据不足三页内容的时，会发现无数据，----我们需要在每次查询前手动将页码设置为1。

12.服务端错误一般是因为传递参数不对！！！

13.资源分类中  编辑资源分类接口无法实现，找不到对应的接口地址;
已经解决，并不是所有的内容都需要接口，可以自己传递值。

14.资源分类中产生一个想法：为什么编辑和添加内容公用一个组件，同一接口时可以实现不同的功能,即系统怎么知道你是编辑还是添加？
因为有id属性，id为空时，就是添加，id不为空就为编辑。

15.如果出现报错： loading chunk error :--services中文件错误 / async await 参数错误

16.get方式传参需要经过params传递，默认就是urlencoded形式；post方式传参直接传json/经过qs转化为urlencoded形式；

17.对于课程上下架的接口中，遇到问题：(1)上架状态调节时，用到了el-switch组件，但是el-switch组件通过v-model绑定status时需要通过template slot-scope="scope"模板来获取当前行的status； (2) 通过v-model绑定的status，v-model要的是boolean值，但status给的是0和1，这时需要手动通过:active-value="1" 、 :inactive-value="0"来设置status的对应值；

18.课程上下架接口防止频繁点击的设置： 在接口获取到值 赋值给tableData前 遍历data中的records数组，向其中添加一个isStatusLoading=false，然后在上下架操作前通过scope获取到该属性，每次状态修改前isStatusLoading=true，然后请求成功isStatusLoading=false

19.动态路由传参的方式：(1)通过params传递后经过$route.params拿取参数；缺点是组件与路由耦合；(2)通过路由跳转设置props=true，然后子组件通过props属性接受该值；

20.资源分配有问题；

21.深度选择器： >>> 、 ::v-deep 、 /deep/

22.问题：(1)添加的组件和编辑的组件一致时，当点击编辑组件时系统是怎么知道你点的是创建还是编辑，如何让编辑的信息传入？ ---> 添加if判断isEdit是否为真，为真就是编辑页面，就渲染页面；
(2)表单验证中，对于需要验证的规则，如果对应的属性处于form.data.data1，会导致即使符合规则也验证失败的现象!!!  --->
(3)为什么子组件createCourse / editCourse 在使用$children查找子组件 create-or-edit 时命名能看到该组件，但是数组为[]？ | 使用$refs查找也是如此，未定义？？？

23. 富文本编辑器： ueditor 、 quill 、 ckeditor 、 tinymce 、 wangeditor

12.【resource中控制添加资源和编辑资源】子组件如何在不使用$emit时向父组件传参？

13.【resource中控制添加资源和编辑资源】父组件即便接受到了子组件的值来控制显示，但是隐藏又如何实现呢？

14.【resource中控制添加资源和编辑资源】，控制编辑资源和添加资源的显示与隐藏？
(1)通过动态组件实现，让编辑资源和添加资源都默认显示；父组件引入动态组件决定哪个组件显示(2)当我们通过动态组件让其显示后，点击确认或者取消后，动态组件并不知道我们已经让其关闭了，所以再次点击时无法打开； 【PASS】
```
