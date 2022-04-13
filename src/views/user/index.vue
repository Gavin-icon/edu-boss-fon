<template>
  <div class="user">
    <el-form :inline="true"
             ref="form"
             :model="filterParams"
             label-position="top"
             class="demo-form-inline">
      <el-form-item label="手机号"
                    prop="phone">
        <el-input v-model="filterParams.phone"
                  placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="用户ID"
                    prop="userId">
        <el-input v-model="filterParams.userId"
                  placeholder="请输入用户ID"></el-input>
      </el-form-item>
      <el-form-item label="注册时间"
                    prop="rangeDate">
        <div class="block">
          <el-date-picker v-model="filterParams.rangeDate"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item style="margin-top: 50px;">
        <el-button :disabled="isLoading"
                   @click="handleReset">重置</el-button>
        <el-button :disabled="isLoading"
                   @click="handleQuery">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card>
      <el-table :data="tableData"
                v-loading="isLoading"
                style="width: 100%">
        <el-table-column prop="id"
                         label="用户ID"
                         width="150">
        </el-table-column>
        <el-table-column prop="portrait"
                         label="头像"
                         width="120">
          <template slot-scope="scope">
            <img width="30px" :src="scope.row.portrait || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'">
          </template>
        </el-table-column>
        <el-table-column prop="name"
                         label="用户名">
        </el-table-column>
        <el-table-column prop="phone"
                         label="手机号">
        </el-table-column>
        <el-table-column prop="createTime"
                         label="注册时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | dataFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status"
                         label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status"
                       active-value="ENABLE"
                       inactive-value="DISABLE"
                       active-color="#13ce66"
                       inactive-color="#ff4949"
                       :disabled="scope.row.isStatusLoading"
                       @change="statusChangeOne(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="180">
          <template slot-scope="scope">
            <el-button size="mini"
                       :disabled="scope.row.isStatusLoading"
                       :type="scope.row.status==='ENABLE'? 'danger': 'success'"
                       @click="statusChangeOne(scope.row)">{{ scope.row.status==='ENABLE'? '禁用': '启用' }}</el-button>
            <el-button size="mini"
                       @click="handleSelectRole(scope.row)">分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分配角色功能 -->
      <el-dialog title="分配角色"
                 :visible.sync="dialogVisible"
                 width="50%"
                 :before-close="handleClose">
        <el-select v-model="roleIdList"
                   multiple
                   placeholder="请选择">
          <el-option v-for="item in roles"
                     :key="item.value"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="onSubmit">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :disabled="isLoading"
        :current-page="filterParams.currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="filterParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="filterParams.totalCount"
        style="float: right; margin-top: 20px; padding-bottom: 20px;">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { queryUserInfo, forbidUser } from '@/services/user.js'
import { getAllRoles, selectRole, queryUserRole } from '@/services/role.js'
export default {
  name: 'UserIndex',
  data () {
    return {
      filterParams: {
        phone: '',
        userId: '',
        rangeDate: [],
        startCreateTime: '',
        endCreateTime: '',
        currentPage: 1,
        pageSize: 10,
        totalCount: 0
      },
      tableData: [],
      isLoading: false,
      dialogVisible: false,
      // 下拉菜单
      roles: [],
      // 选中选项的id 数组
      roleIdList: [],
      // 当前进行角色分配的用户ID
      currentRoleId: null
    }
  },
  created () {
    this.loadQueryUserInfo()
  },
  methods: {
    // 提交分配角色功能
    async onSubmit () {
      const { data } = await selectRole({
        userId: this.currentRoleId,
        roleIdList: this.roleIdList
      })
      // console.log(data)
      if (data.code === '000000') {
        this.$message.success('成功')
        this.dialogVisible = false
        this.roleIdList = []
      }
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    },
    // 禁用  无法实现，后台操作
    async statusChangeOne (user) {
      user.isStatusLoading = true
      const { data } = await forbidUser(user.id)
      if (data.code === '000000') {
        this.user.isStatusLoading = false
      }
    },
    // 分配角色
    async handleSelectRole (role) {
      this.currentRoleId = role.id
      this.dialogVisible = true
      // 请求所有角色列表数据
      const { data: data1 } = await getAllRoles()
      // console.log(data)
      if (data1.code === '000000') {
        this.roles = data1.data
      }
      // 请求当前用户的已分配角色
      const { data: data2 } = await queryUserRole(role.id)
      // console.log(data2)
      if (data2.code === '000000') {
        // 通过map方法将id筛选并存储起来
        this.roleIdList = data2.data.map(item => item.id)
        // console.log(this.roleIdList)
      }
    },
    // 查询
    handleQuery () {
      this.loadQueryUserInfo()
    },
    // 重置
    handleReset () {
      this.$refs.form.resetFields()
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.filterParams.pageSize = val
      this.filterParams.currentPage = 1
      this.loadQueryUserInfo()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.filterParams.currentPage = val
      this.loadQueryUserInfo()
    },
    // 分页查询用户信息加载
    async loadQueryUserInfo () {
      this.isLoading = true
      const { rangeDate } = this.filterParams
      if (rangeDate && rangeDate.length) {
        this.filterParams.startCreateTime = rangeDate[0]
        this.filterParams.endCreateTime = rangeDate[1]
      } else {
        this.filterParams.startCreateTime = ''
        this.filterParams.endCreateTime = ''
      }
      const { data } = await queryUserInfo(this.filterParams)
      // console.log(data)
      if (data.code === '000000') {
        data.data.records.forEach(item => {
          item.isStatusLoading = false
        })
        this.tableData = data.data.records
        this.filterParams.totalCount = data.data.total
        this.isLoading = false
      }
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

<style lang="scss" scoped>
</style>
