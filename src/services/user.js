import request from '@/utils/request'
import qs from 'qs'

//  用户登录接口
export const login = data => {
  return request({
    method: 'POST',
    url: '/front/user/login',
    // headers: { 'content-type': 'application/x-www-form-urlencoded' },
    //  urlencoded: 名=值&名=值
    //  qs 包：json => urlencoded
    data: qs.stringify(data)
  })
}
