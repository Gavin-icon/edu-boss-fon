import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // state中的数据在任意组件都能访问
    // count: 0
    user: JSON.parse(window.localStorage.getItem('user')) || null
  },
  mutations: {
    //  mutations内部可以操作state
    //  mutations只能根据调用顺序来执行，无法按照异步操作执行。
    //  state payLoad commit
    // add (state, payLoad) {
    //   state.count += payLoad.data1
    // },
    // add1 (state, payLoad) {
    //   state.count += payLoad
    // },
    // add2 (state, payLoad) {
    //   setTimeout(() => {
    //     state.count = payLoad.count
    //   }, payLoad.delay)
    // },
    // add3 (state, payLoad) {
    //   state.count = payLoad
    // }
    setUser (state, payLoad) {
      state.user = JSON.parse(payLoad.data)
      // 将数据存储到本地存储--本地存储只能存储字符串
      window.localStorage.setItem('user', payLoad.data)
    }
  },
  actions: {
    //  actions内部提交的是mutations，无法进行state数据的操作
    //  actions进行异步操作，mutations中进行数据操作
    //  actions -- context('mutations中对应的名称', 接受dispatch传递的数据)     payLoad     dispatch('actions名称', 传递的数据)
    // add3Handle (context, payLoad) {
    //   setTimeout(() => {
    //     context.commit('add3', payLoad.count)
    //   }, payLoad.delay)
    // }

  },
  modules: {
  }
})
