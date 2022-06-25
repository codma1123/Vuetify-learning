<template>
  <v-chip v-if="text" color="#E84057" size="20">
    <span class="multikill"> {{ text }} </span>
  </v-chip>
</template>

<script>
import useSizeSetup from '@/tools/SizeSetup.vue'

export default {
  props: {
    text: String | Number,
    default: 0
  },
  setup(props) {
    const { contentSize, searchStore } = useSizeSetup()
  }
}
</script>

<style>
.multikill {
  color: white !important;
  font-size: 12px;
  background-color: #E84057;  
  padding-left: 2px;
  padding-right: 2px;
}

</style>