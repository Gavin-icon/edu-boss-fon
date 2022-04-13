import request from '@/utils/request'

// 获取所有的广告位
export const getAllAdvertSpace = () => {
  return request({
    method: 'GET',
    url: '/front/ad/space/getAllSpaces'
  })
}

// 根据 id 获取广告位
export const getAdvertSpaceById = (id) => {
  return request({
    method: 'GET',
    url: '/front/ad/space/getSpaceById',
    params: {
      id
    }
  })
}

// 新增或者修改广告位
export const addOrUpdateAdvertSpace = (data) => {
  return request({
    method: 'POST',
    url: '/front/ad/space/saveOrUpdate',
    data
  })
}
