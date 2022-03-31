import axios from 'axios'
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
//  发送请求时拦截请求，判断url属于前台还是后台，如果是前台则返回http://edufront.lagoiunews.com
request.interceptors.request.use(function (config) {
  // console.log(config.url)
  //  判断config的url的前缀，来进行baseURL的配置
  config.baseURL = getBaseURL(config.url)
  // console.log(config.baseURL)
  return config
})

//  前台接口基地址：http://edufront.lagounews.com/front/ad/getAdList
//  后台接口基地址：http://eduboss.lagounews.com
export default request
