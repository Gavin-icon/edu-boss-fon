<template>
  <edit-or-create-resource :isEdit="true"></edit-or-create-resource>
</template>

<script>
import EditOrCreateResource from './components/EditOrCreateResource.vue'
export default {
  name: 'EditResource',
  components: {
    EditOrCreateResource
  }
}
</script>

<style lang="scss" scoped></style>
