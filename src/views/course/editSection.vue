<template>
  <div class="edit-section">
    <div style="height: 40px;">
      <el-page-header @back="goBack"
                      style="float: left; line-height: 40px;"
                      :content="editName">
      </el-page-header>
      <el-button type="primary"
                 style="float: right;"
                 @click="addSection">+添加阶段</el-button>
    </div>
    <el-card class="box-card" style="margin-top: 15px;">
      <el-tree :data="sections"
               v-loading="isLoading"
               draggable
               accordion
               :props="defaultProps"
               :allow-drop="isAllowDrag"
               @node-drop="dropedSuccess"
               @node-click="handleNodeClick">
                <!-- 第一个是节点数据， 第二个是传入的数据data -->
                <div class="inner" slot-scope="{ node, data }">
                  <!-- 内容设置 -->
                  <span>{{ node.label }}</span>
                  <!-- 后续按钮设置
                    一级菜单名称是data.sectionName, 二级菜单名称是data..theme
                    如果是一级菜单展示 --编辑、添加课时、状态
                    如果是二级菜单展示 --编辑、上传视频、状态
                   -->
                  <span v-if="data.sectionName" class="actions">
                    <el-button @click.stop="editSection(data.id)" size="small">编辑</el-button>
                    <el-button type="primary" @click.stop="addLesson(data.id)" size="small">添加课时</el-button>
                    <el-button @click.stop="capterStatus(data.id)" size="small"> {{ data.status === 0 ? '已隐藏' : data.status === 1 ? '待更新' : '已更新' }} </el-button>
                  </span>
                  <span v-else class="actions">
                    <el-button @click.stop="editLesson(data.id)" size="small">编辑</el-button>
                    <el-button type="primary" @click="$router.push({ name: 'course-video', params: { courseId }, query: { lessonId: data.id } })" size="small">上传视频</el-button>
                    <el-button @click.stop="capterStatusLesson(data.id)" size="small">{{ data.status === 0 ? '已隐藏' : data.status === 1 ? '待更新' : '已更新' }}</el-button>
                  </span>
                </div>
               </el-tree>
    </el-card>
    <!--  章节有关信息处理 -->
    <el-dialog title="章节信息" :visible.sync="dialogFormVisible" width="50%" >
      <add-or-edit-section
      v-if="dialogFormVisible"
      :dialogFormVisible="dialogFormVisible"
      @success="handleSuccess"
      @cancel="handleCancel"
      :editName="editName"
      :courseId="courseId"
      :isEdit="isEdit"
      :sectionId="sectionId"
      ></add-or-edit-section>
    </el-dialog>
    <!-- 章节信息之status -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisibleStatus"
      width="30%">
      <capter-status
        v-if="dialogVisibleStatus"
        @success="handleSuccessStatus"
        @cancel="handleCancelStatus"
        :sectionId="sectionId"
        :courseId="courseId"
        :courseName="editName"
      ></capter-status>
    </el-dialog>
    <!-- 课时信息之status -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisibleStatusLesson"
      width="30%">
      <capter-status-lesson
        v-if="dialogVisibleStatusLesson"
        @success="handleSuccessStatusLesson"
        @cancel="handleCancelStatusLesson"
        :lessonId="lessonId"
        :courseId="courseId"
        :courseName="editName"
      ></capter-status-lesson>
    </el-dialog>
    <!-- 添加和编辑课时组件 -->
    <el-dialog title="课时基本信息" :visible.sync="dialogFormVisibleLesson">
      <add-or-edit-lesson
      v-if="dialogFormVisibleLesson"
      :isEdit="isEditLesson"
      :lessonId="lessonId"
      :editName="editName"
      :sectionId="sectionId"
      :courseId="courseIdd"
      @cancel="handleCancelLesson"
      @success="handleSuccessLesson"
      ></add-or-edit-lesson>
    </el-dialog>
  </div>
</template>

<script>
import AddOrEditSection from './components/addOrEditSection.vue'
import CapterStatus from './components/capterStatus.vue'
import CapterStatusLesson from './components/capterStatusLesson.vue'
import AddOrEditLesson from './components/addOrEditLesson.vue'
import { getSectionAndLesson, saveOrUpdateSection, saveOrUpdateLesson } from '@/services/course-section'
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
      isLoading: false,
      editName: '',
      sections: [],
      defaultProps: {
        children: 'lessonDTOS',
        // label可以是string也可以是处理函数
        label (data) {
          // data是章节时，名字为secionName 否则为theme  --后台数据不一致导致
          return data.sectionName || data.theme
        }
      },
      dialogFormVisible: false,
      dialogVisibleStatus: false,
      dialogVisibleStatusLesson: false,
      dialogFormVisibleLesson: false,
      isEdit: '',
      isEditLesson: '',
      lessonId: '',
      sectionId: '',
      courseIdd: this.courseId
    }
  },
  components: {
    AddOrEditSection,
    CapterStatus,
    AddOrEditLesson,
    CapterStatusLesson
  },
  created () {
    this.loadSectionAndLesson()
    this.loadCourseInfoById()
  },
  methods: {
    // 拖拽成功后的回调，向服务端发送数据
    async dropedSuccess (draggingNode, dropNode, type, event) {
      // console.log(dropNode, draggingNode)
      this.isLoading = true
      // 如果课时或者章节过多，会导致大量同步任务出现，我们可以使用promise.all()方法让他们全部执行完再进入同步任务
      try {
        await Promise.all(dropNode.parent.childNodes.map((item, index) => {
          // item指的是子节点本身，index指的是索引
          if (draggingNode.data.sectionId) {
            // 课时 拖拽
            return saveOrUpdateLesson({
              id: item.data.id,
              orderNum: index
            })
          } else {
            // 通过return 返回一个promise对象
            return saveOrUpdateSection({
              id: item.data.id,
              orderNum: index
            })
          }
        }))
        this.$message.success('数据更新成功')
      } catch (error) {
        this.$message.error('数据更新失败', error)
      }
      this.isLoading = false

      // 拖拽结束释放时获取其中父节点内部包含的顺序
      // dropNode.parent.childNodes.map(async (item, index) => {
      //   console.log(item, index)
      //   // 通过判断谁被拖拽来绝对发送哪个请求 拖放者有没有属性比如：sectionId / lessonDTOS
      //   if (draggingNode.data.sectionId) {
      //     // 说明是课时的拖拽
      //     await saveOrUpdateLesson({
      //       id: item.data.id,
      //       orderNum: index
      //     })
      //   } else {
      //     // 说明是章节的拖拽
      //     await saveOrUpdateSection({
      //       id: item.data.id,
      //       orderNum: index
      //     })
      //   }
      // })
    },
    // 拖放判定是否允许, 不允许随意拖拽
    isAllowDrag (draggingNode, dropNode, type) {
      // 只能同级移动 ，type不能为 inner
      return type !== 'inner' && draggingNode.data.sectionId === dropNode.data.sectionId
    },
    // 为了显示标题
    async loadCourseInfoById () {
      const { data } = await getCourseInfoById(this.courseId)
      // console.log('课程信息', data)
      if (data.code === '000000') {
        this.editName = data.data.courseName
      }
    },
    // 根据课程id获取章节和课时
    async loadSectionAndLesson () {
      const { data } = await getSectionAndLesson(this.courseId)
      // console.log('章节和课时', data)
      if (data.code === '000000') {
        this.sections = data.data
      }
    },
    // 回退
    goBack () {
      this.$router.push({ name: 'course' })
    },
    // 添加课时
    addLesson (id) {
      this.sectionId = id
      this.isEditLesson = false
      this.dialogFormVisibleLesson = true
    },
    // 编辑课时
    editLesson (lessonId) {
      this.isEditLesson = true
      this.lessonId = lessonId
      this.dialogFormVisibleLesson = true
    },
    // 章节状态
    capterStatus (id) {
      this.dialogVisibleStatus = true
      this.sectionId = id
    },
    // 课时状态
    capterStatusLesson (id) {
      this.dialogVisibleStatusLesson = true
      this.lessonId = id
    },
    // 添加章节
    addSection () {
      this.isEdit = false
      this.dialogFormVisible = true
    },
    // 编辑章节
    editSection (id) {
      this.isEdit = true
      this.sectionId = id
      this.dialogFormVisible = true
    },
    // 处理子组件传递过来的数据--章节
    handleSuccess () {
      this.dialogFormVisible = false
      this.loadSectionAndLesson()
    },
    handleCancel () {
      this.dialogFormVisible = false
    },
    // 处理子组件传递过来的数据--状态
    handleSuccessStatus () {
      this.dialogVisibleStatus = false
      this.loadSectionAndLesson()
    },
    handleCancelStatus () {
      this.dialogVisibleStatus = false
    },
    // 处理子组件传递过来的数据--课时
    handleSuccessLesson () {
      this.dialogFormVisibleLesson = false
      this.loadSectionAndLesson()
    },
    handleCancelLesson () {
      this.dialogFormVisibleLesson = false
    },
    // 处理子组件传递过来的数据--课时状态
    handleSuccessStatusLesson () {
      this.dialogVisibleStatusLesson = false
      this.loadSectionAndLesson()
    },
    handleCancelStatusLesson () {
      this.dialogVisibleStatusLesson = false
    },
    // node-click
    handleNodeClick () {}
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
