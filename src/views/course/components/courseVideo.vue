<template>
  <div class="course-video">
    <el-card class="box-card">
      <div slot="header">课程相关信息</div>
      <el-form label-width="80px">
        <el-form-item label="课程">
          <el-input disabled
                    style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item label="课时">
          <el-input disabled
                    style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item label="视频上传">
          <input type="file" ref="video-file">
        </el-form-item>
        <el-form-item label="封面上传">
          <input type="file" ref="image-file">
        </el-form-item>
        <el-form-item>
          <el-button @click="handleUpLoad">开始上传</el-button>
          <el-button @click="$router.push({ name: 'editSection', params: { courseId } })">返回</el-button>
          <p v-if="upLoadPercentage">视频上传中: {{ upLoadPercentage }}</p>
          <p v-if="isUpLoadSuccess">视频转码中: {{ isTransCode ? '完成' : '正在转码中:' }}</p>
          <span v-if="transcodeNum"> {{ transcodeNum }} </span>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// eslint-disable-next-line
import { aliyunImageUploadAddressAndAuth, aliyunVideoUploadAddressAndAuth, aliyunTransCode, getAliyunTransCodePercent } from '@/services/aliyun-upload'
export default {
  name: 'CourseVideo',
  props: {
    courseId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      // 图片上传后的地址，用于视频上传请求
      imageURL: '',
      // 保存上传实例
      uploader: null,
      // 视频接口请求成功的凭证id
      videoId: '',
      // 上传百分比
      upLoadPercentage: 0,
      // 上传完毕状态
      isUpLoadSuccess: false,
      // 转码状态
      isTransCode: false,
      transcodeNum: ''
    }
  },
  created () {
    this.initUploader()
  },
  methods: {
    // 用户手动点击上传按钮时的功能
    handleUpLoad () {
      // 重置所有数据 --可能重置使用某个组件进行上传处理， 点击上传时将数据重置
      this.upLoadPercentage = 0
      this.isUpLoadSuccess = false
      this.isTransCode = false

      // console.log(this.$refs['video-file'].files) 获取到的是一个files数组
      // 获取到需要上传的视频文件和图片文件
      const videoFile = this.$refs['video-file'].files[0]
      const imageFile = this.$refs['image-file'].files[0]
      // console.log(this.uploader)  this.uploader就是我们设置的那个实例对象

      // 调用uploader中的方法 addFile将文件添加进去
      this.uploader.addFile(imageFile)
      this.uploader.addFile(videoFile)

      // 开始上传 -- > 只是执行了回调函数
      this.uploader.startUpload()
    },
    initUploader () {
      // 实例化一个上传对象 并赋值在vue组件上
      this.uploader = new window.AliyunUpload.Vod({
        //  userID，必填，您可以使用阿里云账号访问账号中心（https://account.console.aliyun.com/），即可查看账号ID
        userId: '1618139964448548',
        //  上传到视频点播的地域，默认值为'cn-shanghai'，
        //  eu-central-1，ap-southeast-1
        region: 'cn-shanghai',
        //  分片大小默认1 MB，不能小于100 KB（100*1024）
        partSize: 1048576,
        //  并行上传分片个数，默认5
        parallel: 5,
        //  网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        //  网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        //  开始上传 --建议是箭头函数，放置内部调取外部data时this不起作用
        onUploadstarted: async uploadInfo => {
          // console.log(uploadInfo)
          let uploadAddressAndAuth = null
          if (uploadInfo.isImage) {
            // 图片处理
            const { data } = await aliyunImageUploadAddressAndAuth()
            // console.log(data)
            if (data.code === '000000') {
              uploadAddressAndAuth = data.data
              console.log(uploadAddressAndAuth)
              this.imageUrl = uploadAddressAndAuth.imageURL
            }
          } else {
            // 视频处理 需要两个参数：第一个通过uploadInfo获取，第二个通过上一个图片处理返回的参数获取
            const { data } = await aliyunVideoUploadAddressAndAuth({
              fileName: uploadInfo.file.name,
              imageUrl: this.imageURL
            })
            if (data.code === '000000') {
              uploadAddressAndAuth = data.data
              this.videoId = data.data.videoId
              console.log(uploadAddressAndAuth)
            }
          }
          // 获取到凭证后上传到阿里云 包含四个参数：uploadInfo | 上传凭证 | 上传凭证地址 | 视频或图片id ==》上传进度开启
          this.uploader.setUploadAuthAndAddress(
            uploadInfo,
            uploadAddressAndAuth.uploadAuth,
            uploadAddressAndAuth.uploadAddress,
            uploadAddressAndAuth.imageId || uploadAddressAndAuth.videoId)
        },
        //  文件上传成功
        onUploadSucceed: function (uploadInfo) {},
        //  文件上传失败
        onUploadFailed: function (uploadInfo, code, message) {},
        //  文件上传进度，单位：字节
        onUploadProgress: (uploadInfo, totalSize, loadedPercent) => {
          // console.log(Math.floor(loadedPercent * 100) + '%')
          if (!uploadInfo.isImage) {
            this.upLoadPercentage = Math.floor(loadedPercent * 100) + '%'
          }
        },
        //  上传凭证或STS token超时
        onUploadTokenExpired: function (uploadInfo) { },
        //  全部文件上传结束
        onUploadEnd: async uploadInfo => {
          // 上传成功后进行视频解码,发送转码请求
          this.isUpLoadSuccess = true
          const lessonId = this.$route.query.lessonId
          const { data } = await aliyunTransCode({
            lessonId,
            coverImageUrl: this.imageURL,
            fileId: this.videoId,
            fileName: this.$refs['video-file'].files[0].name
          })
          if (data.code === '000000') {
            const timer = setInterval(async () => {
              const { data } = await getAliyunTransCodePercent(lessonId)
              if (data.code === '000000') {
                this.transcodeNum = data.data + '%'
                if (data.data === 100) {
                  this.isTransCode = true
                  this.transcodeNum = 0
                  this.$message.success('视频转码成功')
                  clearInterval(timer)
                }
              }
            }, 1000)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
