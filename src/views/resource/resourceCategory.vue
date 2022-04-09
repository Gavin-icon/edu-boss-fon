<template>
  <div class="resource-category">
    <create-or-edit-categories></create-or-edit-categories>
    <el-card class="box-card">
      <div slot="header"
           clearfix>
        <el-button size="small"
                   @click="handleAdd">添加</el-button>
      </div>
      <el-table :data="tableData"
                border
                style="width: 100%">
        <el-table-column prop="id"
                         label="编号"
                         width="180">
        </el-table-column>
        <el-table-column prop="name"
                         label="名称"
                         width="180">
        </el-table-column>
        <el-table-column prop="createdTime"
                         label="创建时间"
                         width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.createdTime | dataFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sort"
                         label="排序">
        </el-table-column>
        <el-table-column label="操作"
                         width="180">
          <template slot-scope="scope">
            <el-button size="mini"
                       @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini"
                       type="danger"
                       @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getResourceCategories, deleteCategories } from '@/services/resource.js'
import CreateOrEditCategories from './components/CreateOrEditCategories'
export default {
  name: 'ResourceCategory',
  data () {
    return {
      tableData: []
    }
  },
  created () {
    this.loadResourceCategories()
  },
  methods: {
    async loadResourceCategories () {
      const { data } = await getResourceCategories()
      // console.log(data)
      if (data.code === '000000') {
        this.tableData = data.data
      }
    },
    handleAdd () {
      this.$children[0].isEdit = false
      this.$children[0].form = {}
      this.$children[0].dialogFormVisible = true
    },
    handleEdit (edit) {
      // console.log(this.$children[0]._props.isEdit)
      // Vue警告：不要直接操作props，由于父组件的渲染 会被重写
      // 点击编辑后，我们需要将从后台获得的数据传递给子组件的form，让其渲染编辑页面
      this.$children[0].isEdit = true
      this.$children[0].dialogFormVisible = true
      // console.log(edit.name, edit.sort)
      this.$children[0].form = { name: edit.name, sort: edit.sort, id: edit.id }
    },
    async handleDelete (deleteIndex) {
      this.$confirm('确认删除么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await deleteCategories(deleteIndex.id)
        // console.log(data)
        if (data.code === '000000') {
          this.loadResourceCategories()
          this.$message.success('删除成功!')
        } else if (data.code === '10000') {
          this.$message.info('无系统资源操作权限!')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消该操作'
        })
      })
    }
  },
  filters: {
    dataFormat (data) {
      const date = new Date(data)
      return `
        ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
      `
    }
  },
  components: {
    CreateOrEditCategories
  }
}
</script>

<style lang="scss" scoped>
</style>
