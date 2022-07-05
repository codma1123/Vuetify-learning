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

const verticalLine = {
  id: 'verticalLine',
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

  if(data.datasets[1]) {
    for(let i = 0; i < segments; i++) {
      if(coorX >= x._gridLineItems[i].tx1 && coorX <= x._gridLineItems[i + 1].tx1) {
        let y1Start = y.getPixelForValue(data.datasets[0].data[i])
        let y1End = y.getPixelForValue(data.datasets[0].data[i + 1])
  
        let y2Start = y.getPixelForValue(data.datasets[1].data[i])
        let y2End = y.getPixelForValue(data.datasets[1].data[i + 1])
  
        if(x._gridLineItems.length !== data.datasets[0].data.length) {
          y1Start = y.getPixelForValue(data.datasets[0].data[i * 2])
          y1End = y.getPixelForValue(data.datasets[0].data[i * 2 + 2])
          y2Start = y.getPixelForValue(data.datasets[1].data[i * 2])
          y2End = y.getPixelForValue(data.datasets[1].data[i * 2 + 2])
        }
  
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

  } else {
    for(let i = 0; i < segments; i++) {
      if(coorX >= x._gridLineItems[i].tx1 && coorX <= x._gridLineItems[i + 1].tx1) {
        let y1Start = y.getPixelForValue(data.datasets[0].data[i])
        let y1End = y.getPixelForValue(data.datasets[0].data[i + 1])
  
        if(x._gridLineItems.length !== data.datasets[0].data.length) {
          y1Start = y.getPixelForValue(data.datasets[0].data[i * 2])
          y1End = y.getPixelForValue(data.datasets[0].data[i * 2 + 2])

        }

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

      }
    }
  }

  ctx.closePath()

}

export default {
  myCrossHair,
  verticalLine
}