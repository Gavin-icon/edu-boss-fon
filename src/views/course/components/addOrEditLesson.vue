<template>
  <div class="add-or-edit-lesson">
    <el-form :model="ruleForm"
             :rules="rules"
             ref="ruleForm"
             label-width="100px"
             class="demo-ruleForm">
      <el-form-item label="课程名称"
                    prop="courseName">
        <el-input v-model="ruleForm.courseName" disabled></el-input>
      </el-form-item>
        <el-form-item label="章节名称"
                    prop="sectionName">
        <el-input v-model="ruleForm.sectionName"></el-input>
      </el-form-item>
      <el-form-item label="课时名称"
                    prop="theme">
        <el-input v-model="ruleForm.theme"></el-input>
      </el-form-item>
      <el-form-item label="时长"
                    prop="duration">
        <el-input v-model="ruleForm.duration">
          <template slot="append">分钟</template>
        </el-input>
      </el-form-item>
      <el-form-item label="是否开放试听"
                    prop="isFree" label-width="100">
        <el-switch v-model="ruleForm.isFree"></el-switch>
      </el-form-item>
      <el-form-item label="课时排序"
                    prop="orderNum">
        <el-input v-model="ruleForm.orderNum" type="number">
          <template slot="append">数字越大越靠后</template>
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary"
                 @click="dialogFormVisible = false">确 定</el-button>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line
import { getLessonById, getChapterById } from '@/services/course-section'
export default {
  name: 'AddOrEditLesson',
  props: {
    isEdit: {
      type: Boolean
    },
    lessonId: {
      type: Number
    },
    editName: {
      type: String
    }
  },
  data () {
    return {
      ruleForm: {
        courseName: this.editName,
        sectionName: '',
        id: '',
        courseId: '',
        sectionId: '',
        theme: '',
        duration: '',
        isFree: '',
        orderNum: '',
        status: 0
      },
      rules: {
        courseName: [
          { required: true, message: '请输入课程名称', trigger: 'blur' }
        ],
        sectionName: [
          { required: true, message: '请输入章节名称', trigger: 'blur' }
        ],
        theme: [
          { required: true, message: '请输入课时名称', trigger: 'blur' }
        ],
        duration: [
          { required: true, message: '请输入时长', trigger: 'blur' }
        ],
        orderNum: [
          { required: true, message: '请输入课时排序', trigger: 'blur' }
        ],
        isFree: [
          { required: true, message: '请选择是否开放试听', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    if (this.isEdit) {
      this.loadLessonById()
    }
  },
  methods: {
    // 获取课时相关信息
    async loadLessonById () {
      const { data: data1 } = await getLessonById(this.lessonId)
      console.log(data1)
      if (data1.code === '000000') {
        this.ruleForm = data1.data
        this.ruleForm.courseName = this.editName
        // 获取章节名称
        const { data: data2 } = await getChapterById(this.ruleForm.sectionId)
        if (data2.code === '000000') {
          // console.log(data2)
          this.ruleForm.sectionName = data2.data.sectionName
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
