<template>
  <Line       
    :chart-options="chartOptions"      
    :chart-data="chartData"         
    :plugins="plugins"
    :width="30" :height="13"
    v-if="loaded"
  />    
</template>

<script>
import { Line } from 'vue-chartjs'
import { Chart, registerables } from 'chart.js'
import { onMounted, ref, computed, onUpdated, onBeforeMount } from 'vue'
import useSizeSetup from '@/tools/SizeSetup.vue'

export default {  
  props: {
    match: Object
  },

  components: {
    Line,
  },

  setup(props) {
    const { searchStore, chartConfig } = useSizeSetup()
    
    const chartData = ref({})
    const plugins = ref({})
    const loaded = ref(false)

    function createChartData(results) {
      return {
        labels: Object.keys(results),
        datasets: [
          {
            label: '승리팀',
            borderColor: '#5383e8',
            data: results.map(result => result.totalGold.team1),            
            pointRadius: 0,                        
            tension: 0.4
          },
          {
            label: '패배팀',
            borderColor: '#e84057',
            data: results.map(result => result.totalGold.team2),
            pointRadius: 0,
            tension: 0.4
          }
        ]          
      }
    }

    const chartOptions = {
      responsive: true,      
      scales: {
        y: {
          grid: {
            display: true,
            color: 'black',
            lineWidth: val => (val.tick.value % 20000 === 0) ? 0.3 : 0            
          },
          ticks: {
            color: '#7b7a8e',
            callback: val => (val % 20000 === 0) ? (val / 1000).toFixed() + 'k' : '',            
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
      element: {
        line: {
          tension: 0.4
        }
      },
      plugins: {
        'myCrossHair': true,
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


    onMounted(async () => {
      Chart.register(...registerables)

      loaded.value = false
      const results = searchStore.timeLineValues
      chartData.value = createChartData(results)
      plugins.value = [chartConfig.myCrossHair]
      loaded.value = true
    })

    

    return {
      chartData,
      chartOptions,
      plugins,
      loaded
    }

  }
}

</script>