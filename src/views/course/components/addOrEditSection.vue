<template>
  <div class="add-or-edit-section"
       style="height: 280px;">
    <el-form :model="form"
             ref="form"
             :rules="rules">
      <el-form-item label="课程名称"
                    prop="courseName"
                    :label-width="formLabelWidth">
        <el-input v-model="form.courseName"
                  autocomplete="off"
                  disabled></el-input>
      </el-form-item>
      <el-form-item label="章节名称"
                    prop="sectionName"
                    :label-width="formLabelWidth">
        <el-input v-model="form.sectionName"
                  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="章节描述"
                    prop="description"
                    :label-width="formLabelWidth">
        <el-input v-model="form.description"
                  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="章节排序"
                    prop="orderNum"
                    :label-width="formLabelWidth">
        <el-input v-model="form.orderNum"
                  autocomplete="off"
                  type="number"
                  min="0">
          <template slot="append">数字控制排序，数字越大越靠后</template>
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer"
         style="float: right;"
         class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary"
                 @click="handleSuccess">确 定</el-button>
    </div>
  </div>
</template>

<script>
/* eslint-disable-next-line */
import { getChapterById, saveOrUpdateSection } from '@/services/course-section.js'
export default {
  name: 'AddOrEditSection',
  props: {
    sectionId: {
      type: [Number, String]
    },
    isEdit: {
      type: Boolean,
      required: true
    },
    editName: {
      type: String
    },
    courseId: {
      type: [String, Number]
    }
  },
  data () {
    return {
      form: {
        courseName: this.editName,
        sectionName: '',
        description: '',
        orderNum: '',
        courseId: this.courseId,
        status: 0,
        id: ''
      },
      formLabelWidth: '120px',
      rules: {
        sectionName: [
          { required: true, message: '请输入章节名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    if (this.isEdit) {
      // console.log('准备执行')
      this.loadChapterById()
    }
  },
  methods: {
    // 根据章节id获取章节信息  为什么每次都需要重新调用渲染？怎么处理？ 父组件v-if
    async loadChapterById () {
      const { data } = await getChapterById(this.sectionId)
      if (data.code === '000000') {
        console.log(data)
        this.form = data.data
        this.form.courseName = this.editName
      }
    },
    // 取消操作
    handleCancel () {
      // 重置表单所有项 ,需注意每一个表单项都要设置prop属性，否则无法清除
      this.$refs.form.resetFields()
      this.$emit('cancel')
    },
    // 确定操作
    async handleSuccess () {
      const { data } = await saveOrUpdateSection(this.form)
      console.log(data)
      this.$emit('success')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
