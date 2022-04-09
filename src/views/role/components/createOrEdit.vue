<template>
  <div class="create-or-edit">
    <el-dialog :title="isEdit? '添加角色': '编辑角色'"
               :before-close="handleClose"
               :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="角色名称"
                      prop="name"
                      :label-width="formLabelWidth">
          <el-input v-model="form.name"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色编码"
                      prop="code"
                      :label-width="formLabelWidth">
          <el-input v-model="form.code"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述"
                      prop="discription"
                      :label-width="formLabelWidth">
          <el-input type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="form.description">
          </el-input>
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
import { addRole } from '@/services/role.js'
export default {
  name: 'CreateOrEdit',
  data () {
    return {
      dialogFormVisible: false,
      form: {
        name: '',
        code: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入角色编码', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请输入角色描述', trigger: 'change' }
        ]
      },
      formLabelWidth: '120px',
      isEdit: false
    }
  },
  methods: {
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    cancel () {
      this.$message.info('已取消该操作!')
      this.dialogFormVisible = false
    },
    async send () {
      await this.$refs.form.validate()
      const { data } = await addRole(this.form)
      // console.log(data)
      if (data.code === '000000') {
        this.$message.success('保存成功!')
        this.dialogFormVisible = false
        this.$parent.loadAllRoles()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
