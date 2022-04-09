<template>
  <div class="alloc-menu">
    <el-card>
      <el-tree :data="menuList"
         :props="defaultProps"
         default-expand-all
         show-checkbox
         node-key="id"
         :default-checked-keys="checkedKeys"
         ref="menu-tree"
         @node-click="handleNodeClick"></el-tree>
         <div style="margin: 20px;">
           <el-button style="margin-right: 20px;" @click="onReset">清空</el-button>
           <el-button type="primary" @click="onSave">保存</el-button>
         </div>
    </el-card>
  </div>
</template>

<script>
import { roleInAllMenu, allocRoleMenus, getRoleMenuList } from '@/services/menu.js'
export default {
  name: 'AllocMenu',
  props: {
    roleId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      menuList: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      checkedKeys: []
    }
  },
  created () {
    // 加载所有菜单信息
    this.loadRoleInAllMenu()
    // 加载角色所拥有的的菜单列表
    this.loadRoleMenuList()
  },
  methods: {
    // 自定义筛选方法，用于筛选被选中的项
    getCheckedSelect (menuList) {
      menuList.forEach((menu) => {
        // 如果第一级中没有被选中的 直接返回
        if (!menu.selected) {
          return
        }
        // 如果第一级中有被选中的 检测内部是否有子项
        if (menu.subMenuList) {
          return this.getCheckedSelect(menu.subMenuList)
        }
        // 不是前两种情况，说明被选中且无子项

        // 由于data是响应式数据，且操作是异步的，如果过多的遍历会导致视图更新失败
        // this.checkedKeys.push(menu.id)

        // 采用这种方式, ES6 ...运算符，每次局部获取， 将最新的值放在数组的最后一项
        this.checkedKeys = [...this.checkedKeys, menu.id]
      })
    },
    // 加载角色所拥有的所有菜单
    async loadRoleInAllMenu () {
      const { data } = await roleInAllMenu()
      if (data.code === '000000') {
        // console.log(data)
        this.menuList = data.data
      }
    },
    // 加载角色所拥有的的菜单列表向 调用getCheckedSelect()筛选selected数据
    async loadRoleMenuList () {
      const { data } = await getRoleMenuList(this.roleId)
      console.log(data)
      if (data.code === '000000') {
        this.getCheckedSelect(data.data)
      }
    },
    handleNodeClick (data) {
      // console.log(data)
      // getCheckNodes 获取的是该菜单项以及子菜单项
      // console.log(this.$refs['menu-tree'].getCheckedNodes())

      // getCheckedKeys 与 node-keys属性搭配，获取到的是node-keys设置的那条数据，若是id，则获取到的是id组成的数组
      // console.log(this.$refs['menu-tree'].getCheckedKeys())
    },

    // 保存分配菜单项
    async onSave () {
      // 发送请求，传递角色ID 和 菜单项列表
      const { data } = await allocRoleMenus({
        roleId: this.roleId,
        menuIdList: this.$refs['menu-tree'].getCheckedKeys()
      })
      // console.log(data)
      if (data.code === '000000') {
        this.$message.success('分配菜单成功!')
        this.$router.push({ name: 'role' })
      }
    },
    // 重置分配菜单项
    onReset () {
      this.$refs['menu-tree'].setCheckedKeys([])
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
