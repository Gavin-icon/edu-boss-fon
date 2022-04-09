import request from '../utils/request'
// 添加资源 接口
export const addResource = (data) => {
  return request({
    method: 'POST',
    url: '/boss/resource/saveOrUpdate',
    data
  })
}

// 编辑资源接口
export const editResourceCon = (id) => {
  return request({
    method: 'GET',
    url: `/boss/resource/${id}`
  })
}

// 删除资源 接口
export const deleteSource = (id) => {
  return request({
    method: 'DELETE',
    url: `/boss/resource/${id}`
  })
}

// 按照条件 分页 查询查询资源
export const queryPageResource = (data) => {
  return request({
    method: 'POST',
    url: '/boss/resource/getResourcePages',
    data
  })
}

//  查询资源分类 接口
export const getResourceCategories = () => {
  return request({
    method: 'GET',
    url: '/boss/resource/category/getAll'
  })
}

//  新增  | 编辑  资源分类 接口
export const editOrAddCategories = (data) => {
  return request({
    method: 'POST',
    url: '/boss/resource/category/saveOrderUpdate',
    data
  })
}

// 删除 资源分类接口
export const deleteCategories = (id) => {
  return request({
    method: 'DELETE',
    url: `/boss/resource/category/${id}`
  })
}

// 获取角色所拥有的的资源列表
export const roleResources = (roleId) => {
  return request({
    method: 'GET',
    url: '/boss/resource/getRoleResources',
    params: {
      roleId
    }
  })
}
