<template>
  <div class="edit-advert">
    <add-or-edit-advert :isEdit="true"></add-or-edit-advert>
  </div>
</template>

<script>
import AddOrEditAdvert from './components/addOrEditAdvert'
export default {
  name: 'EditAdvert',
  components: {
    AddOrEditAdvert
  }
}
</script>

<style lang="scss" scoped>

</style>
