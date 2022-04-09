<template>
  <div class="create-or-edit">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ isEdit? '编辑菜单': '添加菜单' }}</span>
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径" prop="href">
          <el-input v-model="form.href"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentId">
          <el-select v-model="form.parentId" placeholder="请选择上级菜单">
            <!--无上级菜单-->
            <el-option label="无上级菜单" :value="-1"></el-option>
            <!--选择一级菜单-->
            <el-option
              v-for="item in parentMenuList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
            <!--label是显示选择框实际内容的，value是提交时的内容的显示-->
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="前端图标" prop="icon">
          <el-input v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item label="是否显示" prop="shown">
          <el-radio-group v-model="form.shown">
            <el-radio :label="true"></el-radio>
            <el-radio :label="false"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input-number
            v-model="form.orderNum"
            :min="1"
            :max="10"
          ></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button v-if="!isEdit" @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getEditMenuInfo, createOrUpdateMenu } from '@/services/menu.js'
export default {
  name: 'CreateOrEdit',
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
        parentId: -1,
        name: '',
        href: '',
        icon: '',
        orderNum: '',
        description: '',
        shown: true
      },
      rules: {
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '请输入前端图标', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入相关描述', trigger: 'blur' }
        ],
        href: [
          { required: true, message: '请输入菜单路径', trigger: 'blur' }
        ]
      },
      // 存储上级菜单数据
      parentMenuList: []
    }
  },
  created () {
    // 加载上级菜单信息
    this.loadMenuInfo()
  },
  methods: {
    // 采用async 与 promise 结合
    onSubmit () {
      this.$confirm('确认提交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            await this.$refs.form.validate()
            const { data } = await createOrUpdateMenu(this.form)
            if (data.code === '000000') {
              this.$message.success('提交成功！')
              this.$router.push({ name: 'menu' })
              console.log(data)
            }
          } catch (err) {
            this.$message.error('格式错误，校验失败！')
          }
        })
        .catch(() => {
          this.$message.info('已取消该操作！')
        })
    },
    async loadMenuInfo () {
      // 检测是否存在路由参数，并做对应处理
      const id = this.$route.params.id || -1
      // 请求上级菜单数据
      const { data } = await getEditMenuInfo(id)
      if (data.code === '000000') {
        // 将上级菜单保存
        this.parentMenuList = data.data.parentMenuList
        // 检测是否存在菜单数据 menuInfo,如果存在，说明点的是编辑，则应该将数据更新给 form
        if (data.data.menuInfo) {
          this.form = data.data.menuInfo
        }
      }
    },
    onReset () {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-button {
    font-size: 12px;
    padding: 9px 15px;
    border-radius: 3px;
  }
</style>
