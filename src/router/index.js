import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
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
  //  只要to的任意一条路由的requiresAuth为true，我们就返回TRUE
  if (to.matched.some(record => record.meta.requiresAuth)) {
    console.log('需要认证')
    //  验证 Vuex的 store中的登录用户存储信息是否存在,user中获取本地数据/null
    if (!store.state.user) {
      //  未登录，则跳转到登录页面
      // next('/login')
      next({ name: 'login' })
    } else {
      //  登录，返回上次浏览的页面
      next({ name: '' })
    }
  } else {
    console.log('不需要认证')
    next()
  }
})
export default router
