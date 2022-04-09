<template>
  <div class="resource">
    <create-resource ref="CreateResource"></create-resource>
    <edit-resource ref="EditResource"></edit-resource>
    <el-card class="box-card">
      <div slot="header"
           class="clearfix"
           style="margin-top: 15px;">
        <el-form :inline="true"
                 :model="form"
                 size="small"
                 class="demo-form-inline">
          <el-form-item label="资源名称">
            <el-input v-model="form.name"
                      placeholder="请输入资源名称"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="资源路径">
            <el-input v-model="form.url"
                      placeholder="请输入资源路径"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="资源分类">
            <el-select v-model="form.categoryId"
                       placeholder="全部"
                       clearable>
              <el-option v-for="item in resourceCategories"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="float: right;">
            <el-button style="margin-right: 15px"
                       @click="onReset">重置</el-button>
            <el-button type="primary"
                       @click="onSubmit" :disabled="loading">查询搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 添加 / 资源分类 -->
      <div>
        <el-button type="primary" @click="addResource" :disabled="loading">添加资源</el-button>
        <el-button type="primary" @click="categoryResource" :disabled="loading">资源分类</el-button>
      </div>
    </el-card>
    <el-card>
      <!-- Table组件 -->
      <el-table :data="tableData"
                border
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                style="width: 100%">
        <el-table-column prop="id"
                         label="编号"
                         width="180">
        </el-table-column>
        <el-table-column prop="name"
                         label="资源名称"
                         width="180">
        </el-table-column>
        <el-table-column prop="url"
                         label="资源路径"
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
                       @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini"
                       type="danger"
                       @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页结构-->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="form.current"
                     :page-sizes="[10, 15, 20]"
                     :page-size="form.size"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="form.totalCount"
                     :disabled="loading"
                    >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { queryPageResource, getResourceCategories, deleteSource, editResourceCon } from '@/services/resource'
import CreateResource from './createResource'
import EditResource from './editResource'
export default {
  name: 'ResourceIndex',
  data () {
    return {
      form: {
        // 当前显示的页号
        current: 1,
        //  每页显示的数据条数
        size: 10,
        // 总的条数
        totalCount: 0,
        // 资源名称
        name: '',
        // 资源路径
        url: '',
        // 资源分类ID
        categoryId: ''
      },
      tableData: [],
      resourceCategories: [],
      loading: false
    }
  },
  created () {
    // Vue生命周期为created时，渲染页面
    this.loadQueryResource()
    // 加载资源列表
    this.loadResourceCategories()
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
  methods: {
    onSubmit () {
      // 每次查询 请求数据前将current 当前页码设置为1 防止current=2，数据不够只有第一页有数据
      this.form.current = 1
      this.loadQueryResource()
    },
    onReset () {
      this.form.name = ''
      this.form.url = ''
      this.form.categoryId = ''
    },
    async loadQueryResource () {
      this.loading = true
      // 传递空数据能够获取页数的第一条
      const { data } = await queryPageResource(this.form)
      // console.log(data)
      if (data.code === '000000') {
        this.tableData = data.data.records
        this.form.totalCount = data.data.total
        this.loading = false
      }
    },
    // 加载资源列表
    async loadResourceCategories () {
      const { data } = await getResourceCategories()
      // console.log(data)
      if (data.code === '000000') {
        this.resourceCategories = data.data
      }
    },
    // 编辑资源列表
    async handleEdit (index) {
      // console.log(this.$refs.EditResource.$children[0].dialogFormVisible)
      this.$refs.EditResource.$children[0].dialogFormVisible = true
      const { data } = await editResourceCon(index.id)
      // console.log(data)
      if (data.code === '000000') {
        this.$refs.EditResource.$children[0].form = data.data
      }
    },
    // 删除资源列表
    async handleDelete (index) {
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const { data } = await deleteSource(index.id)
        if (data.code === '000000') {
          this.loadQueryResource()
          this.$message.success('删除成功!')
        } else if (data.code === '10000') {
          this.$message.info('无系统资源操作权限')
        }
      } catch (error) {
        this.$message.info('已取消该操作!')
      }
    },
    //  添加资源列表
    addResource () {
      this.$refs.CreateResource.$children[0].dialogFormVisible = true
    },
    //  资源分类
    categoryResource () {
      //  跳转到资源分类页面
      this.$router.push({ name: 'resourceCategory' })
    },

    // handleDelete (deleteIndex) {
    //   this.$confirm('确认删除么?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   })
    //     .then(async () => {
    //       // 发送删除请求
    //       const { data } = await deleteSource(deleteIndex.id)
    //       if (data.code === '000000') {
    //         // 删除成功，提示信息 + 渲染列表
    //         this.$message({
    //           type: 'success',
    //           message: '删除成功!'
    //         })
    //         // 渲染列表
    //         this.loadQueryResource()
    //       }
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: 'info',
    //         message: '已取消删除'
    //       })
    //     })
    // },

    //  每页显示条数变化时触发
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.form.size = val
      // 由于修改了每页显示的条数，数据应当重新渲染，我们应当将当前的页数还原为默认值1
      this.form.current = 1
      this.loadQueryResource()
    },
    //  页数变化触发
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.form.current = val
      this.loadQueryResource()
    }
  },
  components: {
    CreateResource,
    EditResource
  }
}
</script>

<style lang="scss" scoped>
</style>
