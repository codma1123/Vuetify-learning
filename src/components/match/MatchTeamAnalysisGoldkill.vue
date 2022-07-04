<template>  
  <div class="gold-chart">
    <Line 
      :chart-options="chartOptions"      
      :chart-data="chartData"         
      :plugins="plugins"
      :width="30" :height="18"
      v-if="loaded"
    />        
  </div>
</template>

<script>
import { onMounted, ref, computed } from 'vue'
import useSizeSetup from '../../tools/SizeSetup.vue'

import { Line } from 'vue-chartjs'
import { Chart, registerables } from 'chart.js'

export default {
  props: {
    match: Object
  },
  components: {
    Line
  },
  setup(props) {

    const { searchStore } = useSizeSetup()
    
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

    function createPlugins(results) {
      return [myCrossHair]
    }

    const myCrossHair = {
      id: 'mycrosshair',
      afterInit: function(chart) {
        chart.crosshair = {
          enabled: false,
          x: null,
          y: null,
          originalData: [],
          originalXRange: {},
          dragStarted: false,
          dragStartX: null,
          dragEndX: null,  
        }
      },
      getXScale: function(chart) {
        return chart.data.datasets.length ? chart.scales[chart.getDatasetMeta(0).xAxisID] : null;
      },
      getYScale: function(chart) {
        return chart.scales[chart.getDatasetMeta(0).yAxisID];
      },
      afterEvent: function(chart, e) {
        chart.crosshair.x = e.event.x
        chart.crosshair.y = e.event.y
        chart.draw();
      },
      drawTraceLine: (chart) => {
        const {ctx, data, chartArea: {top, bottom, left, right}, scales, width} = chart      
        const x = scales['x-axis-0']
        const y = scales['y-axis-0']
        const lineX = chart.crosshair.x
        const lineY = chart.crosshair.y
        const yScale = myCrossHair.getYScale(chart);
        const textWidth = ctx.measureText('0000-00-00').width + 10
        
        ctx.beginPath()          
        ctx.lineWidth = 2
        ctx.strokeStyle = '#a1a1a3'

        ctx.moveTo(lineX, yScale.getPixelForValue(yScale.max))
        ctx.lineTo(lineX, yScale.getPixelForValue(yScale.min))

        ctx.stroke()
        ctx.closePath()      

        crosshairPoint(chart, chart.crosshair)
      },
      afterDraw: function(chart, e) {      
        if(e.y > chart.chartArea.bottom || e.y < chart.chartArea.top || e.x < chart.chartArea.left || e.x > chart.chartArea.right) {
          return true
        }
        else {
          this.drawTraceLine(chart);
        }
      }
    }

    function crosshairPoint(chart, mousemove) {
      const {ctx, data, chartArea: {top, bottom, left, right}, scales: {x, y}, width} = chart   
      
      const coorX = mousemove.x
      const coorY = mousemove.y

      ctx.beginPath()
      ctx.fillStyle = 'rgba(255, 26, 104, 1)'
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.setLineDash([6, 0])

      const angle = Math.PI / 180
      const segments = x._gridLineItems.length - 1

      for(let i = 0; i < segments; i++) {
        if(coorX >= x._gridLineItems[i].tx1 && coorX <= x._gridLineItems[i + 1].tx1) {
          const y1Start = y.getPixelForValue(data.datasets[0].data[i])
          const y1End = y.getPixelForValue(data.datasets[0].data[i + 1])
          const y2Start = y.getPixelForValue(data.datasets[1].data[i])
          const y2End = y.getPixelForValue(data.datasets[1].data[i + 1])

          // console.log(data.datasets[0].data[i], y1Start, y1End, y2Start, y2End, x._gridLineItems[i].tx1)

          // 297.13867999999997 283.01309999999995 297.144385 290.86888500000003 764.5
          // 41.94262 33.25580666666666 77.72438000000001 71.75314666666668 775.5

          ctx.beginPath()
          ctx.fillStyle = '#5383e8'
          ctx.arc(
            coorX, 
            y1Start + ((y1End - y1Start) / (width / segments) * (coorX - x._gridLineItems[i].tx1)), 
            5, angle * 0, angle * 360, false
          )
          ctx.fill()
          ctx.stroke()
          ctx.closePath()

          ctx.beginPath()
          ctx.fillStyle = '#e84057'
          ctx.arc(
            coorX, 
            y2Start + ((y2End - y2Start) / (width / segments) * (coorX - x._gridLineItems[i].tx1)), 
            5, angle * 0, angle * 360, false
          )
          ctx.fill()
          ctx.stroke()
          ctx.closePath()
        }
      }

      ctx.closePath()

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
            // callback: val => val % 2 === 0 ? val + '분' : ',',
            font: {
              size: 12,
              style: 'normal',
            },            
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
      const results = await searchStore.searchContentTimeLine(props.match.matchId)      
      chartData.value = createChartData(results)
      plugins.value = createPlugins(results)
      loaded.value = true

    })

    return {
      searchStore,
      chartData,
      chartOptions,
      loaded,
      plugins
    }
  }
}
</script>

<style>
.gold-chart {
  height: 550px;
  margin-top: -10px;
}
</style>