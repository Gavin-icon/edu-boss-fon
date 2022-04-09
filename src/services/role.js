import request from '../utils/request'

//  获取角色列表 接口
export const getAllRoles = () => {
  return request({
    method: 'GET',
    url: '/boss/role/all'
  })
}

// 按条件查询角色 接口
export const queryRoles = (data) => {
  return request({
    method: 'POST',
    url: '/boss/role/getRolePages',
    data
  })
}

// 添加角色 接口
export const addRole = (data) => {
  return request({
    method: 'POST',
    url: '/boss/role/saveOrUpdate',
    data
  })
}

// 编辑角色 接口
export const editRole = (id) => {
  return request({
    method: 'GET',
    url: `/boss/role/${id}`
  })
}

// 删除角色 接口
export const deleteRole = (id) => {
  return request({
    method: 'DELETE',
    url: `/boss/role/${id}`
  })
}

// 给角色分配功能
export const selectRole = data => {
  return request({
    method: 'POST',
    url: '/boss/role/allocateUserRoles',
    data
  })
}

// 查询用户角色 接口
export const queryUserRole = (userId) => {
  return request({
    method: 'GET',
    url: `/boss/role/user/${userId}`
  })
}
