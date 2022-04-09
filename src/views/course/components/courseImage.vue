<template>
  <div class="course-image">
    <el-form-item :label="label">
      <el-progress v-if="isUpLoading"
        type="circle"
        :percentage="percentage"
        :width="178"></el-progress>
      <el-upload v-else
                 class="avatar-uploader"
                 action="https://jsonplaceholder.typicode.com/posts/"
                 :show-file-list="false"
                 :on-success="handleAvatarSuccess"
                 :http-request="handleUpload"
                 :before-upload="beforeAvatarUpload">
        <img v-if="value"
             :src="value"
             class="avatar">
        <i v-else
           class="el-icon-plus avatar-uploader-icon">
        </i>
      </el-upload>
    </el-form-item>
  </div>
</template>

<script>
import { upLoadCourseImage } from '@/services/course.js'
export default {
  name: 'CourseImage',
  props: {
    value: {
      type: String
    },
    label: {
      type: String
    },
    limit: {
      type: Number,
      default: 2
    }
  },
  data () {
    return {
      // 用于保存上传状态
      isUpLoading: false,
      percentage: 0
    }
  },
  methods: {
    // 自定义覆盖上传
    async handleUpload (option) {
      this.isUpLoading = true
      // 创建formData形式的上传文件格式
      var fd = new FormData()
      fd.append('file', option.file)
      // 发送请求
      const { data } = await upLoadCourseImage(fd, event => {
        this.percentage = Math.floor(event.loaded / event.total * 100)
      })
      if (data.code === '000000') {
        this.$emit('input', data.data.name)
        this.isUpLoading = false
        this.percentage = 0
      }
    },
    // 图片上传显示
    handleAvatarSuccess (res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw)
    },
    // 图片上传限制
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < this.limit
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
    // handleProgress (event, file) {
    //   // 这里得不到任何信息，因为已经自定义过上传策略，应该在接口中查看
    // }
  }
}
</script>

<style lang="scss" scoped>
  .avatar-uploader ::v-deep .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader ::v-deep .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
