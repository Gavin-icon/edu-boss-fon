<template>
  <div class="edit-course">
    <create-or-edit-course :isEdit="true"></create-or-edit-course>
  </div>
</template>

<script>
import CreateOrEditCourse from './components/createOrEditCourse'
export default {
  name: 'EditCourse',
  components: {
    CreateOrEditCourse
  }
}
</script>

<style lang="scss" scoped>

</style>
