<template>
  <Line       
    :chart-options="chartOptions"      
    :chart-data="chartData"         
    :plugins="plugins"    
    :width="30" :height="13"    
  />    
</template>

<script>
import { Line } from 'vue-chartjs'
import { Chart, registerables } from 'chart.js'
import { onMounted, ref } from 'vue'
import useSizeSetup from '@/tools/SizeSetup.vue'

export default {  
  components: {
    Line,
  },

  setup() {
    const { searchStore, chartConfig } = useSizeSetup()
    const chartData = ref({})
    const plugins = ref([])

    const chartOptions = {
      responsive: true,      
      scales: {
        y: {
          grid: {
            display: true,
            color: 'black',
            lineWidth: 0.3
          },
          ticks: {
            color: '#7b7a8e',
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
          hoverBorderWidth: 8
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

    const createChartData = () => ({
      labels: Object.keys(searchStore.timeLineValues),
      datasets: [
        {
          label: '',
          borderColor: '#fff',
          data: searchStore.timeLineKills.map(value => Math.abs(value.totalKill.team1 - value.totalKill.team2)),

          backgroundColor: element =>{ 
            const v =  searchStore.timeLineKills[element.index].totalKill.team1 - searchStore.timeLineKills[element.index].totalKill.team2
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

    onMounted(() => {
      console.log(searchStore.thisLineKills)
      chartData.value = createChartData()
      plugins.value = [chartConfig.verticalLine]
    })

    return {
      chartData,
      chartOptions,
      plugins
    }
  }
}

</script>