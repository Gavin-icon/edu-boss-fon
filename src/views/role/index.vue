<template>
  <div class="role">
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <span>筛选搜索</span>
        <el-button style="float: right; padding: 10px"
                   type="primary"
                   @click="query">查询搜索</el-button>
        <el-button style="float: right; margin-right: 10px; padding: 10px;"
                   @click="onReset">重置</el-button>
        <el-form ref="form"
                 :model="form"
                 label-width="80px"
                 style="margin-top: 25px;">
          <el-form-item label="输入搜索"
                        prop="name">
            <el-input v-model="form.name"
                      placeholder="角色名称"
                      size="small"
                      style="width: 260px;"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-button @click="handleAdd">添加角色</el-button>
      </div>
    </el-card>
    <!--表格-->
    <el-table :data="tableData"
              border
              size="mini"
              style="width: 100%">
      <el-table-column prop="id"
                       label="编号"
                       width="180">
      </el-table-column>
      <el-table-column prop="name"
                       label="角色名称"
                       width="180">
      </el-table-column>
      <el-table-column prop="description"
                       label="描述">
      </el-table-column>
      <el-table-column prop="createdTime"
                       label="添加时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createdTime | dataFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini"
                     @click="distributeMenu(scope.row)">分配菜单</el-button>
          <el-button size="mini"
                     @click="distributeResource(scope.row)">分配资源</el-button>
          <el-button size="mini"
                     type="danger"
                     @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini"
                     type="danger"
                     @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--引入添加角色 / 编辑角色的组件-->
    <create-or-edit ref="createOrEdit"></create-or-edit>
  </div>
</template>

<script>
import { getAllRoles, queryRoles, editRole, deleteRole } from '@/services/role'
import CreateOrEdit from './components/createOrEdit'
export default {
  name: 'LoginIndex',
  data () {
    return {
      form: {
        name: ''
      },
      tableData: []
    }
  },
  created () {
    this.loadAllRoles()
  },
  methods: {
    // 分配菜单
    distributeMenu (index) {
      this.$router.push({ name: 'allocMenu', params: { roleId: index.id } })
    },
    // 分配资源
    distributeResource (index) {
      this.$router.push({ name: 'allocResource', params: { roleId: index.id } })
    },
    // 添加角色
    handleAdd () {
      // console.log(this.$refs.createOrEdit)
      this.$refs.createOrEdit.isEdit = false
      this.$refs.createOrEdit.form = {}
      this.$refs.createOrEdit.dialogFormVisible = true
    },
    // 删除角色
    handleDelete (deleteIndex) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await deleteRole(deleteIndex.id)
        if (data.code === '000000') {
          this.loadAllRoles()
          this.$message.success('删除成功!')
        }
      }).catch(() => {
        this.$message.info('已取消该操作!')
      })
    },
    // 编辑角色
    async handleEdit (currentIndex) {
      this.$refs.createOrEdit.form = {}
      const { data } = await editRole(currentIndex.id)
      // console.log(data)
      if (data.code === '000000') {
        this.$refs.createOrEdit.isEdit = true
        this.$refs.createOrEdit.dialogFormVisible = true
        this.$refs.createOrEdit.form = data.data
        this.loadAllRoles()
      }
    },
    // 重置
    onReset () {
      this.$refs.form.resetFields()
    },
    // 加载所有角色
    async loadAllRoles () {
      const { data } = await getAllRoles()
      // console.log(data)
      if (data.code === '000000') {
        this.tableData = data.data
      }
    },
    // 查询角色
    async query () {
      // await this.$refs.form.validate()
      const { data } = await queryRoles(this.form)
      // console.log(data)
      if (data.code === '000000') {
        this.tableData = data.data.records
      }
    }
  },
  filters: {
    //  日期过滤器
    dataFormat (date) {
      date = new Date(date)
      return `
        ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
      `
    }
  },
  components: {
    CreateOrEdit
  }
}
</script>

<style lang="scss" scoped>
.text {
  font-size: 22px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 100%;
}

.el-button {
  padding: 5px;
}
</style>
