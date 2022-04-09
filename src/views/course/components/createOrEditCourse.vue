<template>
  <div class="create-or-edit-course">
    <!--头部-->
    <div style="height: 40px;">
      <el-page-header @back="goBack"
                      style="float: left; line-height: 40px;"
                      :content="isEdit? editCoourseName: '新增课程'">
      </el-page-header>
      <el-button type="primary"
                 style="float: right;" @click="onSubmit">保存</el-button>
    </div>
    <!--主体-->
    <!--基本信息-->
    <el-card class="box-card">
      <div slot="header"
           clearfix>
        <el-steps :active="activeStep"
                  simple>
          <el-step v-for="(step, i) in steps"
                   :key="step.id"
                   :title="step.title"
                   :icon="step.icon"
                   @click.native="activeStep = i"></el-step>
        </el-steps>
      </div>
      <el-form ref="form"
               :rules="rules"
               :model="form"
               label-width="80px">
        <div v-show="activeStep === 0">
          <el-form-item label="课程名称"
                        prop="courseName">
            <el-input type="text"
                      courseName
                      v-model="form.courseName"
                      maxlength="50"
                      show-word-limit>
            </el-input>
          </el-form-item>
          <el-form-item label="课程简介"
                        prop="brief">
            <el-input type="text"
                      courseName
                      v-model="form.brief"
                      maxlength="100"
                      show-word-limit>
            </el-input>
          </el-form-item>
          <el-form-item label="讲师姓名"
                        prop="teacherName">
            <el-input type="text"
                      v-model="form.teacherDTO.teacherName"
                      maxlength="50"
                      show-word-limit>
            </el-input>
          </el-form-item>
          <el-form-item label="职位"
                        prop="position">
            <el-input type="text"
                      v-model="form.teacherDTO.position"
                      maxlength="50"
                      show-word-limit>
            </el-input>
          </el-form-item>
          <el-form-item label="讲师简介"
                        prop="description">
            <el-input type="text"
                      v-model="form.teacherDTO.description"
                      maxlength="100"
                      show-word-limit>
            </el-input>
          </el-form-item>
          <el-form-item label="课程概述"
                        prop="previewFirstField">
            <el-input type="text"
                      v-model="form.previewFirstField"
                      maxlength="20"
                      style="width: 48%;"
                      show-word-limit>
            </el-input>
            <el-input type="text"
                      v-model="form.previewSecondField"
                      maxlength="20"
                      style="width: 48%; float: right;"
                      show-word-limit>
            </el-input>
          </el-form-item>
          <el-form-item label="课程排序"
                        prop="sortNum">
            <el-input-number
                      controls-position="right"
                      v-model="form.sortNum">
            </el-input-number>
          </el-form-item>
          <el-button type="primary" @click="activeStep++">下一步</el-button>
        </div>
        <div v-show="activeStep === 1">
          <!--v-model可以接受自定义事件的值-->
          <course-image v-model="form.courseListImg" label="课程封面" :limit="3"></course-image>
          <course-image v-model="form.courseImgUrl" :label="'解锁封面'" :limit="3"></course-image>
          <el-button type="primary" @click="activeStep++">下一步</el-button>
        </div>
        <div v-show="activeStep === 2">
          <el-form-item label="售卖价格">
            <el-input v-model="form.discounts" type="number">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品原价">
            <el-input v-model="form.price" type="number">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
                    <el-form-item label="销量">
            <el-input v-model="form.sales" type="number">
              <template slot="append">单</template>
            </el-input>
          </el-form-item>
          <el-form-item label="活动标签">
            <el-input v-model="form.discountsTag"></el-input>
          </el-form-item>
          <el-button type="primary" @click="activeStep++">下一步</el-button>
        </div>
        <div v-show="activeStep === 3">
          <el-form-item label="限时秒杀开关" label-width="120px">
            <el-switch
              v-model="form.activityCourse"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          <template v-if="form.activityCourse">
            <div class="onOrOff" style="margin-left: 12px;">
              <el-form-item label="开始时间">
              <el-date-picker
                v-model="form.activityCourseDTO.beginTime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              </el-form-item>
              <el-form-item label="结束时间">
              <el-date-picker
                v-model="form.activityCourseDTO.endTime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              </el-form-item>
              <el-form-item label="秒杀价">
              <el-input v-model="form.activityCourseDTO.amount" type="number">
                <template slot="append">元</template>
              </el-input>
              </el-form-item>
              <el-form-item label="秒杀库存">
              <el-input v-model="form.activityCourseDTO.stock" type="number">
                <template slot="append">个</template>
              </el-input>
              </el-form-item>
            </div>
          </template>
          <el-button type="primary" @click="activeStep++" style="margin-left: 20px;">下一步</el-button>
        </div>
        <div v-show="activeStep === 4">
          <el-form-item label-width="0">
            <div ref="editor"></div>
          </el-form-item>
          <el-form-item label="是否上架">
            <el-switch
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              v-model="form.status"
            ></el-switch>
          </el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import CourseImage from './courseImage'
import { saveOrUpdateCourse, getCourseInfoById } from '@/services/course'
import E from 'wangeditor'
export default {
  name: 'CreateOrEditCourse',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  components: {
    CourseImage
  },
  data () {
    return {
      editCoourseName: '',
      courseParams: '',
      // 本地图片预览地址
      // imageUrl: '',
      // 步骤的进度
      activeStep: 0,
      // 步骤条的相关信息
      steps: [
        { id: 1, title: '基本信息', icon: 'el-icon-edit' },
        { id: 2, title: '课程封面', icon: 'el-icon-picture' },
        { id: 3, title: '销售信息', icon: 'el-icon-edit' },
        { id: 4, title: '秒杀信息', icon: 'el-icon-edit' },
        { id: 5, title: '课程详情', icon: 'el-icon-upload' }
      ],
      form: {
        // 课程封面
        courseListImg: '',
        // 解锁封面
        courseImgUrl: '',
        // 原价
        price: '',
        // 优惠价
        discounts: '',
        // 销量
        sales: '',
        // 活动标签
        discountsTag: '',
        // 课程名称
        courseName: '',
        // 课程简介
        brief: '',
        // 讲师信息
        teacherDTO: {
          // 名称
          teacherName: '',
          // 职位
          position: '',
          // 描述
          description: ''
        },
        // 课程描述
        previewFirstField: '',
        previewSecondField: '',
        // 上架状态 0 下架 1 上架
        status: 0,
        // 课程描述 详细[富文本]
        courseDescriptionMarkDown: '',
        // 课程排序
        sortNum: '',
        // 秒杀信息展示开关
        activityCourse: false,
        // ，秒杀活动信息
        activityCourseDTO: {
          // 开始时间
          beginTime: '',
          // 结束时间
          endTime: '',
          // 活动价格
          amount: '',
          // 库存值
          stock: ''
        }
      },
      rules: {
        courseName: [
          { required: true, message: '请输入课程名称', trigger: 'blur' }
        ],
        brief: [
          { required: true, message: '请输入课程简介', trigger: 'blur' }
        ],
        // teacherName: [
        //   { required: true, message: '请输入讲师姓名', trigger: 'blur' }
        // ],
        // position: [
        //   { required: true, message: '请输入讲师职位', trigger: 'blur' }
        // ],
        // description: [
        //   { required: true, message: '请输入讲师简介', trigger: 'blur' }
        // ],
        previewFirstField: [
          { required: true, message: '请输入课程概述', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.loadCourseInfoById()
  },
  mounted () {
    // 富文本编辑器初始化
    this.initEditor()
  },
  methods: {
    initEditor () {
      const edit = new E(this.$refs.editor)
      edit.create()
    },
    // 根据Id加载课程信息
    async loadCourseInfoById () {
      // 判断是否处于编辑页面
      if (this.isEdit) {
        // 渲染编辑页面的数据
        const { data } = await getCourseInfoById(this.$route.params.id)
        console.log(data)
        if (data.code === '000000') {
          this.editCoourseName = data.data.courseName
          this.form = data.data
        }
      }
    },
    // 回退
    goBack () {
      this.$router.push({ name: 'course' })
    },
    // 提交
    async onSubmit () {
      try {
        await this.$refs.form.validate()
        const { data } = await saveOrUpdateCourse(this.form)
        if (data.code === '000000') {
          if (this.isEdit) {
            this.$message.success('编辑成功')
          } else {
            this.$message.success('提交成功')
          }
          this.$router.push({ name: 'course' })
        }
      } catch (error) {
        this.$message.info('表单验证失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-card {
    margin: 20px 0;
  }
  .el-step:hover {
    cursor: pointer;
  }
</style>
