<template>
  <div class="menu">
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <el-button @click="$router.push({ name: 'menu-create' })">添加菜单</el-button>
      </div>
      <!--底部展示区域-->
      <el-table :data="tableData"
                border
                style="width: 100%">
        <el-table-column prop="id"
                         label="编号"
                         width="180"></el-table-column>
        <el-table-column prop="name"
                         label="菜单名称"
                         width="180"></el-table-column>
        <el-table-column prop="level"
                         label="菜单级数"
                         width="180"></el-table-column>
        <el-table-column prop="icon"
                         label="前端图标"></el-table-column>
        <el-table-column prop="orderNum"
                         label="排序"></el-table-column>
        <el-table-column label="操作">
          <!--通过 Scoped slot 可以获取到 row, column, $index 和 store（table 内部的状态管理）的数据，用法参考 demo。-->
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
import { getAllMenus, deleteMenu } from '@/services/menu.js'
export default {
  name: 'MenuIndex',
  data () {
    return {
      tableData: []
    }
  },
  created () {
    this.loadAllMenus()
  },
  methods: {
    handleEdit (editIndex) {
      // 路由跳转 --将index +1 处理，因为editIndex为0，实际要传入1
      // 跳转到编辑页面时才传入参数，否则不传参，默认为-1，方便获取上级菜单
      this.$router.push({ name: 'menu-edit', params: { id: editIndex.id } })
    },
    handleDelete (deleteIndex) {
      this.$confirm('确认删除么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 发送删除请求
          const { data } = await deleteMenu(deleteIndex.id)
          // console.log(data)
          if (data.code === '000000') {
            // 删除成功，提示信息 + 渲染列表
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // 渲染列表
            this.loadAllMenus()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async loadAllMenus () {
      const { data } = await getAllMenus()
      // console.log(data)
      if (data.code === '000000') {
        this.tableData = data.data
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
