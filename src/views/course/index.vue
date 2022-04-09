<template>
  <div class="course">
    <el-card class="box-card" style="padding-top: 25px;">
      <el-form :inline="true"
               :model="form"
               class="demo-form-inline">
        <el-form-item label="课程名称">
          <el-input v-model="form.courseName"
                    style="width: 300px;"
                    clearable
                    placeholder="课程名称"></el-input>
        </el-form-item>
        <el-form-item label="状态"
                      prop="status">
          <el-select v-model="form.status">
            <el-option label="全部"
                       value=""></el-option>
            <el-option label="上架"
                       value="1"></el-option>
            <el-option label="下架"
                       value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="onSubmit"
                     :disabled="isLoading">查询</el-button>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary"
                     @click="createCourse"
                     :disabled="isLoading">+ 新建课程</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card" style="margin-top: 15px;">
      <div slot="header">
        <span>查询结果：</span>
      </div>
      <!-- 表格 -->
      <el-table :data="tableData"
                border
                v-loading="isLoading"
                size="mini"
                style="width: 100%">
        <el-table-column prop="id"
                         label="ID"
                         width="100">
        </el-table-column>
        <el-table-column prop="courseName"
                         label="课程名称"
                         width="180">
        </el-table-column>
        <el-table-column prop="price"
                         label="价格">
                         <template slot-scope="scope">
                           <span>{{ scope.row.price | moneyFilter }}</span>
                         </template>
        </el-table-column>
        <el-table-column prop="sortNum"
                         label="排序">
        </el-table-column>
        <el-table-column prop="status"
                         label="上架状态">
                         <template slot-scope="scope">
                          <el-switch
                            v-model="scope.row.status"
                            :active-value="1"
                            :inactive-value="0"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            :disabled="scope.row.isStatusLoading"
                            @change="statusChangeOne(scope.row)">
                          </el-switch>
                         </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="280px">
          <template slot-scope="scope">
            <el-button size="mini"
            @click="statusChangeTwo(scope.row)"
            :disabled="scope.row.isStatusLoading"
            :type="scope.row.status===0? 'success': 'danger'">{{ scope.row.status===0? '上架': '下架' }}</el-button>
            <el-button size="mini"
                       @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini"
                       @click="handleContent(scope.row)">内容管理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="form.currentPage"
                     :page-sizes="[30, 50, 80]"
                     :page-size="form.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="form.totalCount"
                     :disabled="isLoading">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { pageQueryCourse, courseUpOrDown } from '@/services/course.js'
export default {
  name: 'CourseIndex',
  data () {
    return {
      form: {
        //  当前页码
        currentPage: 1,
        // 总条数
        totalCount: 100,
        // 显示多少条 每页
        pageSize: 15,
        // 课程名称
        courseName: '',
        status: ''
      },
      tableData: [],
      isLoading: false,
      value: true
    }
  },
  created () {
    this.loadPageQueryCourse()
  },
  methods: {
    onSubmit () {
      this.loadPageQueryCourse()
    },
    createCourse () {
      this.$router.push({ name: 'createCourse' })
    },
    handleEdit (editIndex) {
      this.$router.push({ name: 'editCourse', params: { id: editIndex.id } })
    },
    handleContent (contentIndex) {

    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.form.pageSize = val
      this.form.currentPage = 1
      this.loadPageQueryCourse()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.form.currentPage = val
      this.loadPageQueryCourse()
    },
    async loadPageQueryCourse () {
      this.isLoading = true
      const { data } = await pageQueryCourse(this.form)
      if (data.code === '000000') {
        data.data.records.forEach(item => {
          item.isStatusLoading = false
        })
        this.form.totalCount = data.data.total
        this.tableData = data.data.records
        // console.log(data, this.tableData)
        this.isLoading = false
      }
    },
    // 上架状态 接口实现 -- statusChangeOne
    async statusChangeOne (index1) {
      // console.log(index1, index1.status, this.form.status)
      index1.isStatusLoading = true
      // console.log(index1.isStatusLoading)
      const { data } = await courseUpOrDown({
        courseId: index1.id,
        status: index1.status
      })
      // console.log(data)
      if (data.code === '000000') {
        // console.log(data)
        index1.isStatusLoading = false
      }
    },
    statusChangeTwo (index2) {
      index2.status === 0 ? index2.status = 1 : index2.status = 0
      this.statusChangeOne(index2)
    }
  },
  filters: {
    moneyFilter (data) {
      return `￥${data}`
    }
  }
}
</script>

<style lang="scss" scoped></style>
