<template>
  <div class="add-or-edit-lesson" style="height: 406px;">
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
        <el-input v-model="ruleForm.sectionName" disabled></el-input>
      </el-form-item>
      <el-form-item label="课时名称"
                    prop="form.theme">
        <el-input v-model="ruleForm.form.theme"></el-input>
      </el-form-item>
      <el-form-item label="时长"
                    prop="form.duration">
        <el-input v-model="ruleForm.form.duration">
          <template slot="append">分钟</template>
        </el-input>
      </el-form-item>
      <el-form-item label="是否开放试听"
                    prop="form.isFree" label-width="100">
        <el-switch v-model="ruleForm.form.isFree"
          active-color="#13ce66"
          inactive-color="#ff4949"
        ></el-switch>
      </el-form-item>
      <el-form-item label="课时排序"
                    prop="form.orderNum">
        <el-input v-model="ruleForm.form.orderNum" type="number">
          <template slot="append">数字越大越靠后</template>
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer"
         class="dialog-footer"
         style="float: right;"
         >
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary"
                 @click="handleSuccess">确 定</el-button>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line
import { getLessonById, getChapterById, saveOrUpdateLessonById } from '@/services/course-section'
export default {
  name: 'AddOrEditLesson',
  props: {
    isEdit: {
      type: Boolean
    },
    lessonId: {
      type: [Number, String]
    },
    sectionId: {
      type: [Number, String]
    },
    courseId: {
      type: [Number, String]
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
        form: {
          // id应该是lessonId
          // id: 0,
          courseId: this.courseId,
          sectionId: this.sectionId,
          theme: '',
          duration: 0,
          isFree: true,
          orderNum: 0,
          status: 0
        }
      },
      /* eslint-disable */
      rules: {
        courseName: [
          { required: true, message: '请输入课程名称', trigger: 'blur' }
        ],
        sectionName: [
          { required: true, message: '请输入章节名称', trigger: 'blur' }
        ],
        "form.theme": [
          { required: true, message: '请输入课时名称', trigger: 'blur' }
        ],
        "form.duration": [
          { required: true, message: '请输入时长', trigger: 'blur' }
        ],
        "form.orderNum": [
          { required: true, message: '请输入课时排序', trigger: 'blur' }
        ],
        "form.isFree": [
          { required: true, message: '请选择是否开放试听', trigger: 'blur' }
        ]
      }
      /* eslint-enable */
    }
  },
  created () {
    if (this.isEdit) {
      this.loadLessonById()
    }
    this.loadChapterById()
  },
  methods: {
    // 获取课时相关信息
    async loadLessonById () {
      const { data: data1 } = await getLessonById(this.lessonId)
      console.log(data1)
      if (data1.code === '000000') {
        this.ruleForm.form = data1.data
        this.ruleForm.courseName = this.editName
      }
    },
    // 获取章节名称
    async loadChapterById () {
      const { data: data2 } = await getChapterById(this.ruleForm.form.sectionId)
      if (data2.code === '000000') {
        // console.log(data2)
        this.ruleForm.sectionName = data2.data.sectionName
      }
    },
    handleCancel () {
      this.$emit('cancel')
    },
    async handleSuccess () {
      if (this.isEdit) {
        // 如果是编辑的话，则传入对应的id,如果不是，不需要传入id
        this.ruleForm.form.id = this.lessonId
      }
      const { data } = await saveOrUpdateLessonById(this.ruleForm.form)
      // console.log(data)
      if (data.code === '000000') {
        if (this.isEdit) {
          this.$message.success('修改成功')
        } else {
          this.$message.success('添加成功')
        }
        this.$emit('success')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
