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

//  用户信息接口 | 未经授权需要接口鉴权：则应该将用户登录成功的access_token存储并展示给服务器
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
  })
}

// 分页查询用户信息
export const queryUserInfo = data => {
  return request({
    method: 'POST',
    url: '/boss/user/getUserPages',
    data
  })
}

// 禁用用户
export const forbidUser = data => {
  return request({
    type: 'POST',
    url: '/boss/user/forbidUser',
    data
  })
}

// 启用用户
export const openUser = userId => {
  return request({
    method: 'GET',
    url: '/boss/user/enableUser',
    params: {
      userId
    }
  })
}
