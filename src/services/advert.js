import request from '@/utils/request'
// 获取所有广告列表
export const getAdvertList = () => {
  return request({
    method: 'GET',
    url: '/front/ad/getAdList'
  })
}

// 上下架状态改变
export const changeAdvertStatus = params => {
  return request({
    method: 'GET',
    url: '/front/ad/updateStatus',
    params
  })
}

// 获取所有的广告位
export const getAllAdvertSpace = () => {
  return request({
    method: 'GET',
    url: '/front/ad/space/getAllSpaces'
  })
}

// 新增或修改广告信息
export const saveOrUpdateAdvert = data => {
  return request({
    method: 'POST',
    url: '/front/ad/saveOrUpdate',
    data
  })
}

// 根据id获取广告信息
export const getAdvertById = id => {
  return request({
    method: 'GET',
    url: '/front/ad/getAdById',
    params: {
      id
    }
  })
}
