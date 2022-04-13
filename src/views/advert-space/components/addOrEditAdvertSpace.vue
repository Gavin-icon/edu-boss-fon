<template>
  <div class="add-or-edit-advert-space">
    <el-card>
      <el-form :rules="rules"
               ref="form"
               :model="form"
               label-width="100px">
        <el-form-item label="广告位名称"
                      prop="name">
          <el-input v-model="form.name"
                    style="width: 480px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="handleSubmit">提交</el-button>
          <el-button @click="handleReset" size="small">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getAdvertSpaceById, addOrUpdateAdvertSpace } from '@/services/advert-space.js'
export default {
  name: 'AddOrEditAdvertSpace',
  data () {
    return {
      form: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入广告位名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.loadAdvertSpaceById()
  },
  methods: {
    async loadAdvertSpaceById () {
      const { id } = this.$route.params
      if (id) {
        const { data } = await getAdvertSpaceById(id)
        if (data.state === 1) {
          this.form = data.content
        }
      }
    },
    handleSubmit () {
      // 保存更改广告位
      this.$refs.form.validate(async valid => {
        if (valid) {
          const { data } = await addOrUpdateAdvertSpace(this.form)
          if (data.state === 1) {
            this.$message({
              type: 'success',
              message: '提交成功'
            })
            this.$router.push({
              name: 'advert-space'
            })
          }
        }
      })
    },
    handleReset () {
      // 表单重置
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
