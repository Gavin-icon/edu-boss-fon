<template>
  <div class="capter-status" style="height: 240px;">
    <div class="icon-item">
      <i class="el-icon-info"></i>
      <span>当前状态：{{  }}</span>
    </div>
    <el-form :model="form">
      <el-form-item label="状态变更为" prop="status">
        <el-select v-model="form.status" style="width: 280px;">
          <el-option label="已隐藏"
                     value="0"></el-option>
          <el-option label="待更新"
                     value="1"></el-option>
                               <el-option label="已更新"
                     value="2"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer"
         style="float: right; margin-top: 30px;"
         class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary"
                 @click="handleSuccess">确 定</el-button>
    </div>
  </div>
</template>

<script>
import { saveOrUpdateSection, getChapterById } from '@/services/course-section.js'
export default {
  name: 'CapterStatus',
  props: {
    sectionId: {
      type: Number
    },
    courseId: {
      type: String
    },
    courseName: {
      type: String
    }
  },
  data () {
    return {
      form: {
        status: '0'
      }
    }
  },
  created () {
    this.loadCapterById()
  },
  methods: {
    // 获取章节信息
    loadCapterById () {
      getChapterById(this.sectionId).then(res => {
        if (res.data.code === '000000') {
          console.log(res)
          this.form = res.data.data
          this.form.status = this.form.status.toString()
        }
      })
    },
    handleSuccess () {
      this.form.status = Number(this.form.status)
      saveOrUpdateSection(this.form).then(res => {
        console.log(res)
        if (res.data.code === '000000') {
          this.$message.success('状态修改成功')
          this.$emit('success')
        }
      })
    },
    handleCancel () {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
  div.icon-item {
    margin-bottom: 20px;
    text-align: center;
    i {
      display: block;
      font-size: 50px;
      margin-bottom: 20px;
    }
    span {
      display: block;
      font-size: 20px;
    }
  }
</style>
