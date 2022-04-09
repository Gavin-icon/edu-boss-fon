import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // state中的数据在任意组件都能访问
    user: JSON.parse(window.sessionStorage.getItem('user')) || null
  },
  mutations: {
    //  mutations内部可以操作state
    //  mutations只能根据调用顺序来执行，无法按照异步操作执行。
    //  state payLoad commit
    setUser (state, payLoad) {
      state.user = JSON.parse(payLoad.data)
      // 将数据存储到本地存储--本地存储只能存储字符串
      window.sessionStorage.setItem('user', payLoad.data)
    }
  },
  actions: {
    //  actions进行异步操作，mutations中进行数据操作
    //  actions -- context('mutations中对应的名称', 接受dispatch传递的数据)     payLoad     dispatch('actions名称', 传递的数据)

  },
  modules: {
  }
})
