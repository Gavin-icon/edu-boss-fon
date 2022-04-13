<template>
  <div class="add-or-edit-advert">
    <el-card>
      <el-form :model="ruleForm"
               :rules="rules"
               ref="ruleForm"
               label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="广告名称"
                      prop="name">
          <el-input v-model="ruleForm.name"
                    style="width: 470px;"></el-input>
        </el-form-item>
        <el-form-item label="广告位置">
          <el-select v-model="ruleForm.spaceId"
                     placeholder="请选择广告位置">
            <el-option
              v-for="item in advertSpace"
              :key="item.id"
              :label="item.name"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间"
                      prop="startTime">
          <el-date-picker v-model="ruleForm.startTime"
                          type="datetime"
                          placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="到期时间"
                      prop="endTime">
          <el-date-picker v-model="ruleForm.endTime"
                          type="datetime"
                          placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="上线/下线">
          <el-radio v-model="ruleForm.status" label="0">下线</el-radio>
          <el-radio v-model="ruleForm.status" label="1">上线</el-radio>
        </el-form-item>
        <course-image v-model="ruleForm.img" label="广告图片" :limit="3"></course-image>
        <el-form-item label="广告链接" prop="link">
          <el-input v-model="ruleForm.link"></el-input>
        </el-form-item>
        <el-form-item label="广告备注">
          <el-input v-model="ruleForm.text"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="submitForm">立即创建</el-button>
          <el-button size="small" @click="resetForm" v-if="!isEdit">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import CourseImage from '@/components/uploadImage/courseImage.vue'
import { getAllAdvertSpace, saveOrUpdateAdvert, getAdvertById } from '@/services/advert.js'
export default {
  name: 'AddOrEditAdvert',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      ruleForm: {
        name: '',
        spaceId: '',
        startTime: '',
        endTime: '',
        status: '0',
        img: '',
        link: '',
        text: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入广告名称', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请选择开始时间', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '请选择到期时间', trigger: 'blur' }
        ],
        link: [
          { required: true, message: '请输入广告链接', trigger: 'blur' }
        ]
      },
      advertSpace: []
    }
  },
  created () {
    this.loadAllAdvertSpace()
    if (this.isEdit) {
      this.loadAdvertById()
    }
  },
  components: {
    CourseImage
  },
  methods: {
    async loadAdvertById () {
      const { data } = await getAdvertById(this.$route.params.id)
      // console.log(data)
      if (data.state === 1) {
        data.content.status === 0 ? data.content.status = '0' : data.content.status = '1'
        this.ruleForm = data.content
      }
    },
    async loadAllAdvertSpace () {
      const { data } = await getAllAdvertSpace()
      // console.log(data)
      if (data.state === 1) {
        this.advertSpace = data.content
        // console.log(this.advertSpace)
      }
    },
    async submitForm () {
      const { data } = await saveOrUpdateAdvert(this.ruleForm)
      // console.log(data)
      if (data.state === 1) {
        this.$message.success(data.message)
      }
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
