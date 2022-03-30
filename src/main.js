import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//  引入element-ui
import ElementUI from 'element-ui'
//  引入element的主题文件/分格
// import 'element-ui/lib/theme-chalk/index.css'
//  引入修改后的element主题文件
import './styles/index.scss'
//  将 Element 注册为 Vue插件
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
