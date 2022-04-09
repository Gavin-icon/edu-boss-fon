import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import { Message } from 'element-ui'
// import store from '@/store'

//  引入路由中需要使用的组件功能
// import Login from '@/views/login/index.vue'
// import Layout from '@/views/layout/index.vue'
// import Home from '@/views/home/index.vue'
// import Role from '@/views/role/index.vue'
// import Menu from '@/views/menu/index.vue'
// import Resource from '@/views/resource/index.vue'
// import Course from '@/views/course/index.vue'
// import User from '@/views/user/index.vue'
// import Advert from '@/views/advert/index.vue'
// import AdvertSpace from '@/views/advert-space/index.vue'
// import ErrorPage from '@/views/error-page/index.vue'
//  Vue.use方法中传入需要使用的Vue功能
Vue.use(VueRouter)

//  路由规则,添加需要认证的 requireAuth信息
const routes = [
  {
    path: '/login',
    name: 'login',
    // vue-router 懒加载  ++  魔法注释：/* webpackChunkName: 'name' */,使得打包的文件加上前缀名称
    component: () => import(/* webpackChunkName: 'login' */'@/views/login/index.vue')
  },
  {
    path: '/',
    component: () => import(/* webpackChunkName: 'index' */'@/views/layout/index.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import(/* webpackChunkName: 'home' */'@/views/home/index.vue')
      },
      {
        path: '/role',
        name: 'role',
        component: () => import(/* webpackChunkName: 'role' */'@/views/role/index.vue')
      },
      {
        path: '/menu',
        name: 'menu',
        component: () => import(/* webpackChunkName: 'menu' */'@/views/menu/index.vue')
      },
      {
        path: '/resource',
        name: 'resource',
        component: () => import(/* webpackChunkName: 'resource' */'@/views/resource/index.vue')
      },
      {
        path: '/course',
        name: 'course',
        component: () => import(/* webpackChunkName: 'source' */'@/views/course/index.vue')
      },
      {
        path: '/user',
        name: 'user',
        component: () => import(/* webpackChunkName: 'user' */'@/views/user/index.vue')
      },
      {
        path: '/advert',
        name: 'advert',
        component: () => import(/* webpackChunkName: 'advert' */'@/views/advert/index.vue')
      },
      {
        path: '/advert-space',
        name: 'advert-space',
        component: () => import(/* webpackChunkName: 'advert-space' */'@/views/advert-space/index.vue')
      },
      //  菜单创建 的路由组件
      {
        path: '/menu/create',
        name: 'menu-create',
        component: () => import(/* webpackChunkName: 'menu-create' */'@/views/menu/menuCreate.vue')
      },
      // 编辑的路由组件
      {
        path: '/menu/:id/edit',
        name: 'menu-edit',
        component: () => import(/* webpackChunkName: 'menu-edit */'@/views/menu/menuEdit.vue')
      },
      //  资源列表的 资源分类组件
      {
        path: '/resourcesCategory',
        name: 'resourceCategory',
        component: () => import(/* webpackChunkName: 'resourceCategory' */'@/views/resource/resourceCategory.vue')
      },
      //  分配菜单 动态组件
      {
        path: '/role/:roleId/allocMenu',
        name: 'allocMenu',
        component: () => import(/* webpackChunkName: 'allocMenu' */'@/views/role/allocMenu.vue'),
        props: true
      },
      // 分配资源 动态组件
      {
        path: '/role/:roleId/allocResource',
        name: 'allocResource',
        component: () => import(/* webpackChunkName: 'allocResource' */'@/views/role/allocResource.vue'),
        props: true
      },
      // 课程 创建 组件
      {
        path: '/course/create',
        name: 'createCourse',
        component: () => import(/* webpackChunkName: 'createCourse' */'@/views/course/createCourse.vue')
      },
      // 课程 编辑 组件
      {
        path: '/course/:id/edit',
        name: 'editCourse',
        component: () => import(/* webpackChunkName: 'editCourse' */'@/views/course/editCourse.vue')
      }
    ]
  },
  {
    path: '*',
    name: 'error-page',
    component: () => import(/* webpackChunkName: 'error-page' */'@/views/error-page/index.vue')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // console.log(to)
  //  只要to的任意一条路由的requiresAuth为true，我们就返回TRUE
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // console.log('当前页面需要验证')
    // 验证登录信息是否存在 --不存在的话
    if (!store.state.user) {
      return next(
        {
          name: 'login',
          query: {
            // 将本次路由的fullPath传递给login页面，在login页面通过跳转到 this.$route.query.redirect
            redirect: to.fullPath
          }
        })
    }
    next()
  } else {
    // console.log('当前页面不需要验证')
    next()
  }
})
router.onError((error) => {
  const pattern = /Loading chunk chunk-(.*)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  if (isChunkLoadFailed) {
    Message({
      message: '系统已升级，正在刷新本地存储，请稍候...',
      type: 'warning',
      duration: 1500,
      offset: 60
    })
    location.reload()
  }
})
export default router
