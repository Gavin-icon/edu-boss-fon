<template>
  <div class="advert-space">
    <el-card>
      <div slot="header">
        <el-button size="small"
                   @click="handleAdd">添加广告位</el-button>
      </div>
      <el-table :data="tableData"
                border
                style="width: 100%">
        <el-table-column prop="spaceKey"
                         label="spaceKey"
                         width="180">
        </el-table-column>
        <el-table-column prop="name"
                         label="广告位名称"
                         width="180">
        </el-table-column>
        <el-table-column prop="createTime"
                         label="创建时间">
                         <template slot-scope="scope">
                           {{ scope.row.createTime | filterDate }}
                         </template>
        </el-table-column>
        <el-table-column prop="updateTime"
                         label="更新时间">
                         <template slot-scope="scope">
                           {{ scope.row.updateTime | filterDate }}
                         </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small"
                       @click="handleEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getAllAdvertSpace } from '@/services/advert-space.js'
import moment from 'moment'
export default {
  name: 'AdvertSpaceIndex',
  data () {
    return {
      tableData: []
    }
  },
  created () {
    this.loadAllAdvertSpace()
  },
  methods: {
    async loadAllAdvertSpace () {
      const { data } = await getAllAdvertSpace()
      // console.log(data)
      if (data.state === 1) {
        this.tableData = data.content
      }
    },
    handleAdd () {
      this.$router.push({
        name: 'addAdvertSpace'
      })
    },
    handleEdit (row) {
      this.$router.push({
        name: 'editAdvertSpace',
        params: {
          id: row.id
        }
      })
    }
  },
  filters: {
    filterDate (val) {
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-table ::v-deep th, .el-table ::v-deep td {
    text-align: center;
  }
</style>
