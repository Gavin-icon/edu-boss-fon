<template>
  <div class="advert">
    <el-card>
      <div slot="header">
        <el-button @click="handleAdd">添加广告</el-button>
      </div>
      <el-table :data="tableData"
                style="width: 100%">
        <el-table-column prop="id"
                         label="ID"
                         width="100">
        </el-table-column>
        <el-table-column prop="name"
                         label="广告名称"
                         width="150">
        </el-table-column>
        <el-table-column prop="spaceId"
                         label="广告位置"
                         width="120">
        </el-table-column>
        <el-table-column prop="img"
                         label="广告图片"
                         width="160">
          <template slot-scope="scope">
            <img :src="scope.row.img"
                 style="height: 80px;">
          </template>
        </el-table-column>
        <el-table-column prop="startTime, endTime"
                         label="时间"
                         width="240">
          <template slot-scope="scope">
            <p>开始时间:{{scope.row.startTime | dataFormat}}</p>
            <p>结束时间:{{scope.row.endTime | dataFormat}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="status"
                         label="上/下线"
                         width="180">
          <template slot-scope="scope">
            <el-switch @change="statusChange(scope.row)"
                       v-model="scope.row.status"
                       :active-value="1"
                       :inactive-value="0"
                       active-color="#13ce66"
                       inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini"
                       @click="handleEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[15, 25, 35, 45]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
// 引入广告列表的接口
import { getAdvertList, changeAdvertStatus } from '@/services/advert'
export default {
  name: 'AdvertIndex',
  data () {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 15,
      totalCount: 0
    }
  },
  created () {
    this.loadAdvertList()
  },
  methods: {
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.currentPage = 1
      this.loadAdvertList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.currentPage = val
      this.loadAdvertList()
    },
    statusChange (item) {
      var s = item.status
      this.$confirm('是否要修改上线/下线状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 状态改变请求接口
        const { data } = await changeAdvertStatus({
          id: item.id,
          status: s
        })
        if (data.code === 0) {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消该操作'
        })
        item.status = s
      })
    },
    loadAdvertList () {
      // 加载广告位列表get方式
      getAdvertList().then(res => {
        console.log(res)
        this.tableData = res.data.content
        this.totalCount = res.data.content.length
      })
    },
    handleEdit (edit) {
      this.$router.push({ name: 'editAdvert', params: { id: edit.id } })
    },
    handleAdd (add) {
      this.$router.push({ name: 'addAdvert' })
    }
  },
  filters: {
    //  日期过滤器
    dataFormat (date) {
      date = new Date(date)
      return `
        ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}:${date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()}
      `
    }
  }
}
</script>

<style lang="scss" scoped></style>
