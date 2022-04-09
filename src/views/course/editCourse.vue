<template>
  <div class="edit-course">
    <create-or-edit-course :isEdit="true" :courseId="courseId"></create-or-edit-course>
  </div>
</template>

<script>
import CreateOrEditCourse from './components/createOrEditCourse'
export default {
  name: 'EditCourse',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  components: {
    CreateOrEditCourse
  }
}
</script>

<style lang="scss" scoped>

</style>
