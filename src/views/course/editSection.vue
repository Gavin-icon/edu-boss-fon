<template>
  <div class="edit-section">
    <div style="height: 40px;">
      <el-page-header @back="goBack"
                      style="float: left; line-height: 40px;"
                      :content="editName">
      </el-page-header>
      <el-button type="primary"
                 style="float: right;"
                 @click="onSubmit">+添加阶段</el-button>
    </div>
    <el-card class="box-card" style="margin-top: 15px;">
      <el-tree :data="sections"
               draggable
               :props="defaultProps"
               @node-click="handleNodeClick">
                <!-- 第一个是节点数据， 第二个是传入的数据data -->
                <div class="inner" slot-scope="{ node, data }">
                  <!-- 内容设置 -->
                  <span>{{ node.label }}</span>
                  <!-- 后续按钮设置
                    一级菜单名称是data.sectionName, 二级菜单名称是data.theme
                    如果是一级菜单展示 --编辑、添加课时、状态
                    如果是二级菜单展示 --编辑、上传视频、状态
                   -->
                  <span v-if="data.sectionName" class="actions">
                    <el-button>编辑</el-button>
                    <el-button type="primary">添加课时</el-button>
                    <el-button>状态</el-button>
                  </span>
                  <span v-else class="actions">
                    <el-button>编辑</el-button>
                    <el-button type="primary">上传视频</el-button>
                    <el-button>状态</el-button>
                  </span>
                </div>
               </el-tree>
    </el-card>
  </div>
</template>

<script>
import { getSectionAndLesson } from '@/services/course-section'
import { getCourseInfoById } from '@/services/course'
export default {
  name: 'EditSection',
  props: {
    courseId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      editName: '',
      sections: [],
      defaultProps: {
        children: 'lessonDTOS',
        // label可以是string也可以是处理函数
        label (data) {
          // data是章节时，名字为secionName 否则为theme  --后台数据不一致导致
          return data.sectionName || data.theme
        }
      }
    }
  },
  created () {
    this.loadSectionAndLesson()
    this.loadCourseInfoById()
  },
  methods: {
    async loadCourseInfoById () {
      const { data } = await getCourseInfoById(this.courseId)
      if (data.code === '000000') {
        this.editName = data.data.courseName
      }
    },
    // 根据课程id获取章节和课时
    async loadSectionAndLesson () {
      const { data } = await getSectionAndLesson(this.courseId)
      console.log(data)
      if (data.code === '000000') {
        this.sections = data.data
      }
    },
    // 回退
    goBack () {
      this.$router.push({ name: 'course' })
    },
    // 提交
    async onSubmit () {

    },
    handleNodeClick (data) {
      // console.log(data)
    }
  }
}
</script>

<style lang="scss" scoped>
  /* 通过flex布局使 按钮正确展示： 居中 、 右对齐 */
  .inner {
    flex: 1;
    display: flex;
    justify-content: space-between;
    padding: 10px;
    align-items: center;
  }
  .el-tree {
    ::v-deep .el-tree-node__content {
      height: auto;
    }
  }
</style>
