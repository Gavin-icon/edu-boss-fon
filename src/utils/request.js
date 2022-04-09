import axios from 'axios'
import store from '@/store'
import router from 'vue-router'
//  通过局部引入方式引入Element的Message组件功能
import { Message } from 'element-ui'
//  引入qs进行请求参数处理
import qs from 'qs'
//  create创建axios实例
const request = axios.create({
  // timeout: 2000
  // baseURL:
  // headers:
})

function getBaseURL (url) {
  if (url.startsWith('/boss')) {
    return 'http://eduboss.lagounews.com'
  }
  return 'http://edufront.lagounews.com'
}

function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      //  redirect存储之前的url，通过router.currentRoute获取当前的url信息
      redirect: router.currentRoute.fullPath
    }
  })
}

//  发送请求时拦截请求，判断url属于前台还是后台
request.interceptors.request.use(function (config) {
  // console.log(config.url)
  //  判断config的url的前缀，来进行baseURL的配置
  config.baseURL = getBaseURL(config.url)
  // console.log(config.baseURL)

  //  user内部存储着登录用户的相关信息，包括token等， 统一设置token信息
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  return config
})

//  响应拦截器
let isRefreshing = false
let requests = []
request.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // console.log('响应成功了,响应体为：', response)
  return response
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  if (error.response) {
    // console.log('响应失败，失败的响应体为：')
    // console.dir(error)
    //  请求成功，响应未成功
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    //  判断失败的状态码的情况 主要处理401
    const { status } = error.response
    let errorMessage = ''
    if (status === 400) {
      errorMessage = '请求参数错误'
    } else if (status === 401) {
      errorMessage = 'Token 无效'
      Message.error(errorMessage)
      // 1.无token /未登录 --取决于会话级存储内有无数据
      if (!store.state.user) {
        redirectLogin()
        // 让处理函数接受错误
        return Promise.reject(error)
      }

      // 对于token多次请求进行限制，如果存在正在刷新的请求，我们就将之前的失败的请求存储起来，[以request()请求存储]
      if (isRefreshing) {
        //  加入还有其他的请求未发送成功，失败了，我们应该将这些请求储存起来
        return requests.push(() => {
          request(error.config)
        })
      }
      isRefreshing = true
      // 2.Token无效(错误/过期)
      // 发送请求，获取新的access_token
      return request({
        method: 'POST',
        url: '/front/user/refresh_token',
        data: qs.stringify({
          refreshtoken: store.state.user.refresh_token
        })
      }).then(res => {
        // 发送成功后获得响应参数后，清除无效的用户信息
        // 清除无效的用户信息
        store.commit('setUser', {
          data: null
        })
        if (res.data.state !== 1) {
          // 跳转到登录页面
          redirectLogin()
          return Promise.reject(error)
        }
        // 刷新token 成功
        // --先存储新的token
        store.commit('setUser', {
          data: res.data.content
        })

        //  在发送本次请求之前，将之前的请求全部重新发送，然后清除掉请求失败的请求
        requests.forEach(callback => callback())
        requests = []

        // --重新发送之前失败的请求 error.config里面有失败请求的信息
        // error.config 本次失败的请求的配置对象 将本次失败的请求再次发送
        return request(error.config)
      }).catch(err => console.log(err)).finally(() => {
        //  请求发送完毕，响应处理完毕，将刷新状态变为FALSE
        isRefreshing = false
      })
    } else if (status === 403) {
      errorMessage = '没有权限，联系管理员'
    } else if (status === 500) {
      errorMessage = '服务端错误，联系管理员'
    }
    Message.error(errorMessage)
  } else if (error.request) {
    //  请求发送，未收到响应
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    Message.error('请求超时，请重试')
  } else {
    //  意料之外的错误
    // Something happened in setting up the request that triggered an Error
    Message.error(error.message)
  }
  //  将拦截器的错误继续向后抛出,本次请求的错误对象error继续向后排除，让实际接受响应的处理函数进行操作；
  return Promise.reject(error)
})

//  前台接口基地址：http://edufront.lagounews.com/front/ad/getAdList
//  后台接口基地址：http://eduboss.lagounews.com
export default request
