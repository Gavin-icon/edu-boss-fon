<template>
  <div class="edit-or-create-resoource">
    <el-dialog :title="isEdit? '编辑资源': '添加资源'"
               :visible.sync="dialogFormVisible">
      <el-form :model="form"
               :rules="rules"
               ref="form"
      >
        <el-form-item label="资源名称:"
                      prop="name"
                      :label-width="formLabelWidth">
          <el-input v-model="form.name"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资源路径:"
                      prop="url"
                      :label-width="formLabelWidth">
          <el-input v-model="form.url"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资源分类:"
                      prop="categoryId"
                      :label-width="formLabelWidth">
          <el-select v-model="form.categoryId"
                     placeholder="请选择资源分类信息">
            <el-option v-for="item in resourceCategories"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述:"
                      prop="description"
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
import { getResourceCategories, addResource } from '@/services/resource'
export default {
  name: 'EditOrCreateResource',
  // 通过props 接受父组件的传值， 判断当前是那种功能
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: {
        url: '',
        name: '',
        categoryId: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入资源名称', trigger: 'blur' },
          { min: 3, message: '长度至少 3个字符', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入资源路径', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '请选择资源分类信息', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请输入资源描述信息', trigger: 'blur' }
        ]
      },
      formLabelWidth: '120px',
      dialogFormVisible: false,
      resourceCategories: []
    }
  },
  created () {
    // 加载资源列表
    this.loadResourceCategories()
  },
  methods: {
    // 加载资源列表
    async loadResourceCategories () {
      const { data } = await getResourceCategories()
      // console.log(data)
      if (data.code === '000000') {
        this.resourceCategories = data.data
      }
    },
    async send () {
      try {
        await this.$refs.form.validate()
        const { data } = await addResource(this.form)
        console.log(data)
        if (data.code === '000000') {
          this.dialogFormVisible = false
          this.$refs.form.resetFields()
          this.$parent.$parent.loadQueryResource()
          this.$message.success('创建成功!')
        }
      } catch (error) {
        this.dialogFormVisible = true
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
