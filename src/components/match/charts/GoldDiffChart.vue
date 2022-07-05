<template>
  <Line       
    :chart-options="chartOptions"      
    :chart-data="chartData"             
    :width="30" :height="18"    
  />      
</template>

<script>
import { Line } from 'vue-chartjs'
import { Chart, registerables } from 'chart.js'
import { onMounted, ref } from 'vue'
import useSizeSetup from '@/tools/SizeSetup.vue'

export default {  
  components: {
    Line
  },
  
  setup() {

    const { searchStore } = useSizeSetup()
    const chartData = ref({})
    const plugins = ref({})

    const createChartData = () => ({
      labels: Object.keys(searchStore.timeLineValues),
      datasets: [
        {
          label: '',
          borderColor: '#fff',
          data: searchStore.timeLineValues.map(value => Math.abs(value.totalGold.team1 - value.totalGold.team2)),
          // pointRadius: element => 
          //   Math.abs(
          //     searchStore.timeLineValues[element.index].totalGold.team1 - searchStore.timeLineValues[element.index].totalGold.team2 
          //   ) > 0 ? 
          backgroundColor: element =>{ 
            const v =  searchStore.timeLineValues[element.index].totalGold.team1 - searchStore.timeLineValues[element.index].totalGold.team2
            if(v > 0) return '#5383e8'
            if(v < 0) return '#e84057'
            return 'black'
          }, 
          pointStyle: 'circle',
          pointRadius: 5,
          pointBorderWidth: 0,
          borderWidth: 2
           
        }
      ]
    })

    const chartOptions = {
      responsive: true,      
      scales: {
        y: {
          grid: {
            display: true,
            color: 'black',
            lineWidth: val => (val.tick.value % 2000 === 0) ? 0.3 : 0            
          },
          ticks: {
            color: '#7b7a8e',
            callback: val => (val / 1000).toFixed(1) + 'k'
          },          
        },
        x: {
          grid: {
            display: false,
            color: 'black'
          },
          ticks: {
            color: '#7b7a8e',
            maxRotation: 0,
            callback: val => val % 2 === 0 ? val + '분' : 'temp',
            font: ctc => ctc.tick.label === 'temp' ? { size: 0 } : { size: 12 }            
            // textStrokeColor: '#fff',
            // textStrokeWidth: 3,
          },     
        }
      },
      elements: {
        point: {
          borderWidth: 0,
          hoverBorderWidth: 3
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          titleColor: 'black',
          bodyColor: 'black',
          borderColor: '#5383e8',
          borderWidth: 1,
          backgroundColor: '#bfbfc1',
          callbacks: {
            title: tooltipItems => tooltipItems[0].label + '분'
          },          
        }
      },
      interaction: {
        intersect: false,
        mode: 'index',
      },
    }

    onMounted(() => {
      chartData.value = createChartData()
    })

    return {
      chartData,
      chartOptions,
    }
  }
}

</script>