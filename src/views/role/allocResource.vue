<template>
  <div class="alloc-resource">
    <el-card class="box-card">
      <el-form v-for="list in list" :key="list.id">
        <el-form-item style="background: rgb(242, 246, 252); border-bottom: 0;">
          <el-checkbox :indeterminate="isIndeterminate"
                       v-model="checkAll"
                       @change="handleCheckAllChange">{{ list.name }}</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox-group v-model="checked"
                             @change="handleCheckedCitiesChange">
            <el-checkbox style="width: 30%; margin-bottom: 15px;"
                         v-for="resource in list.resourceList"
                         :label="resource.name"
                         :key="resource.id">{{resource.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { roleResources } from '@/services/resource.js'
export default {
  name: 'AllocResource',
  props: {
    roleId: {
      type: [Number, String],
      required: true
    }
  },
  created () {
    this.loadReSources()
  },
  data () {
    return {
      checkAll: false,
      checked: [],
      list: [],
      isIndeterminate: true
    }
  },
  methods: {
    // 获取被选中的列表
    getChecked (resource) {
      resource.forEach(item => {
        if (!item.selected) {
          return
        }
        if (item.resourceList) {
          return this.getChecked(item.resourceList)
        }
        this.checked = [...this.checked, item.id]
        // console.log(this.checked)  数据库中一共有51个被选中的资源
      })
    },
    async loadReSources () {
      const { data } = await roleResources(this.roleId)
      // console.log(data)
      if (data.code === '000000') {
        this.list = data.data
      }
      this.getChecked(this.list)
    },
    handleCheckAllChange (val) {
      this.checked = val ? this.checked : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange (value) {
      console.log(value)
      const checkedCount = value.length
      // 获取list中每一个resourceList的长度
      const totalCount = this.list.reduce((pre, cur) => {
        return pre + cur.resourceList.length
      }, 0)
      console.log(totalCount)
      this.checkAll = checkedCount === totalCount
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.checked.length
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-form-item {
    margin-bottom: 0;
    padding: 20px 20px 20px 20px;
    border: 1px solid #ccc;
    border-bottom: 0;
    ::v-deep.el-form-item__content {
      line-height: 0;
    }
  }
  .el-form:last-child {
    border-bottom: 1px solid #ccc;
  }
  .el-form .el-form-item:nth-child(2n) {
    padding-top: 35px;
  }
</style>
