import request from '../utils/request'

// 分页查询课程信息
export const pageQueryCourse = (data) => {
  return request({
    method: 'POST',
    url: '/boss/course/getQueryCourses',
    data
  })
}

// 课程上下架接口
export const courseUpOrDown = (data) => {
  return request({
    method: 'GET',
    url: '/boss/course/changeState',
    params: data
    // url: `/boss/course/changeState?courseId=${data.courseId}&status=${data.status}`
  })
}

// 保存或者更改课程信息接口
export const saveOrUpdateCourse = data => {
  return request({
    method: 'POST',
    url: '/boss/course/saveOrUpdateCourse',
    data
  })
}

// 根据id获取课程信息
export const getCourseInfoById = (courseId) => {
  return request({
    method: 'GET',
    url: '/boss/course/getCourseById',
    params: {
      courseId
    }
  })
}

// 上传图片接口
export const upLoadCourseImage = (data, onUploadProgress) => {
  // data应当为FormData最新
  return request({
    method: 'POST',
    url: '/boss/course/upload',
    data,
    // 进度条事件
    // onUploadProgress (event) {
    //   console.log(event.total, event.loaded)
    // }
    onUploadProgress
  })
}
