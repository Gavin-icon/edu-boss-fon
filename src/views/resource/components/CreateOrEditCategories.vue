<template>
  <div class="create-or-edit-categories">
    <el-dialog :title="isEdit? '编辑分类': '添加分类'"
               :visible.sync="dialogFormVisible">
      <el-form :model="form"
               :rules="rules"
               ref="form">
        <el-form-item label="名称"
                      prop="name"
                      :label-width="formLabelWidth">
          <el-input v-model="form.name"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序"
                      prop="sort"
                      :label-width="formLabelWidth">
          <el-input v-model.number="form.sort"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary"
                   @click="send">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { editOrAddCategories } from '@/services/resource.js'
export default {
  name: 'CreateOrEditCategories',
  data () {
    return {
      dialogFormVisible: false,
      form: {
        name: '',
        sort: 0,
        id: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入资源分类名称', trigger: 'change' }
        ],
        sort: [
          { required: true, message: '请输入正确的排序 Number', trigger: 'change', type: 'number' }
        ]
      },
      formLabelWidth: '120px',
      isEdit: false
    }
  },
  methods: {
    async send () {
      try {
        await this.$refs.form.validate()
        const { data } = await editOrAddCategories(this.form)
        console.log(data)
        if (data.code === '000000') {
          this.dialogFormVisible = false
          this.$refs.form.resetFields()
          this.$parent.loadResourceCategories()
          this.$message.success('保存成功!')
        }
      } catch (error) {
        this.$message.info('表单验证失败!')
      }
    },
    cancel () {
      this.dialogFormVisible = false
      this.$message.info('已取消该操作!')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
