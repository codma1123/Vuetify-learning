<template>
  <div class="dount-chart" :style="dountChartStyle">
    <div class="dount-chart-hole">
      <div>
        <div class="win-area text-center"> {{ datas.win.toLocaleString() }} </div>
        <v-divider class="divider"></v-divider>
        <div class="lose-area text-center"> {{ datas.lose.toLocaleString() }} </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  props: {
    datas: Object
  },
  setup(props) {

    const dountChartStyle = computed(() => {
      const { win, lose } = props.datas
      const loseDeg = 360 / (win + lose) * lose

      return {
        'background' : `conic-gradient(#e84057 0deg ${loseDeg}deg, #5383e8 ${loseDeg}deg 360deg )`
      }
    })  

    return {
      dountChartStyle
    }
  }
}
</script>

<style scoped>
.dount-chart {
  margin-left: 20px;  
  min-width: 90px; min-height: 90px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dount-chart-hole {
  min-width: 70px; 
  min-height: 70px;
  border-radius: 50%;
  /* font-weight: bold; */
  background: #31313C;
  /* display: flex; */
  /* justify-content: center;
  align-items: center; */
}

.win-area {
  font-size: 13px;
  color: #5383e8
}

.divider {
  width: 30px !important;
}

.lose-area {
  font-size: 13px;
  color: #e84057
}
</style>