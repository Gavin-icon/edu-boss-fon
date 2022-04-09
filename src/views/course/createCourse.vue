<template>
  <div class="create-course">
    <create-or-edit-course></create-or-edit-course>
  </div>
</template>

<script>
import CreateOrEditCourse from './components/createOrEditCourse'
export default {
  name: 'CreateCourse',
  components: {
    CreateOrEditCourse
  }
}
</script>

<style lang="scss" scoped>

</style>
