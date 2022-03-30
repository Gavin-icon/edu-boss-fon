import Vue from 'vue'
import VueRouter from 'vue-router'
//  引入路由中需要使用的组件功能
import Login from '@/views/login/index.vue'
import Layout from '@/views/layout/index.vue'
import Home from '@/views/home/index.vue'
import Role from '@/views/role/index.vue'
import Menu from '@/views/menu/index.vue'
import Resource from '@/views/resource/index.vue'
import Course from '@/views/course/index.vue'
import User from '@/views/user/index.vue'
import Advert from '@/views/advert/index.vue'
import AdvertSpace from '@/views/advert-space/index.vue'
import ErrorPage from '@/views/error-page/index.vue'
//  Vue.use方法中传入需要使用的Vue功能
Vue.use(VueRouter)

//  路由规则
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'home',
        component: Home
      },
      {
        path: '/role',
        name: 'role',
        component: Role
      },
      {
        path: '/menu',
        name: 'menu',
        component: Menu
      },
      {
        path: '/resource',
        name: 'resource',
        component: Resource
      },
      {
        path: '/course',
        name: 'course',
        component: Course
      },
      {
        path: '/user',
        name: 'user',
        component: User
      },
      {
        path: '/advert',
        name: 'advert',
        component: Advert
      },
      {
        path: '/advert-space',
        name: 'advert-space',
        component: AdvertSpace
      }
    ]
  },
  {
    path: '*',
    name: 'error-page',
    component: ErrorPage
  }
]

const router = new VueRouter({
  routes
})

export default router
