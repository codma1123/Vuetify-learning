<template>
  <div>
    killDiff
  </div>
</template>

<script>
import { Line } from 'vue-chartjs'
import { Chart, registerables } from 'chart.js'
import { onMounted } from 'vue'
import useSizeSetup from '@/tools/SizeSetup.vue'

export default {  
  setup() {
    const { searchStore } = useSizeSetup()

    onMounted(() => {
      console.log(searchStore.timeLineKills)
    })
  }
}

</script>