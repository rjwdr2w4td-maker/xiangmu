<template>
  <div class="security-map">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>粮食安全监测一张图 - GIS可视化</span>
          <el-radio-group v-model="viewType" size="small">
            <el-radio-button label="plot">图斑分布</el-radio-button>
            <el-radio-button label="growth">长势对比</el-radio-button>
            <el-radio-button label="warning">风险预警</el-radio-button>
          </el-radio-group>
        </div>
      </template>

      <div class="map-container">
        <div id="security-map" ref="mapRef" style="height: 550px; width: 100%; position: relative"></div>
        
        <div class="map-legend">
          <h4>图例说明</h4>
          <div class="legend-item">
            <span class="legend-color" style="background: #FFA500"></span>
            <span>待核查</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background: #FF0000"></span>
            <span>问题属实</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background: #00FF00"></span>
            <span>已整改</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background: #808080"></span>
            <span>不属实</span>
          </div>
        </div>

        <div class="map-tools">
          <el-button-group>
            <el-button size="small" @click="handleZoomIn">
              <el-icon><ZoomIn /></el-icon>
            </el-button>
            <el-button size="small" @click="handleZoomOut">
              <el-icon><ZoomOut /></el-icon>
            </el-button>
            <el-button size="small" @click="handleResetView">
              <el-icon><RefreshRight /></el-icon>
            </el-button>
          </el-button-group>
        </div>

        <div class="map-stats">
          <el-statistic title="总图斑数" :value="5" />
          <el-statistic title="待核查" :value="2" />
          <el-statistic title="问题属实" :value="2" />
          <el-statistic title="已整改" :value="1" />
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>长势对比分析</span>
          </template>
          <div ref="growthChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <span>风险预警分布</span>
          </template>
          <el-table :data="warningList" border style="width: 100%">
            <el-table-column prop="region" label="区域" width="120" />
            <el-table-column prop="type" label="预警类型" width="120" />
            <el-table-column prop="level" label="预警等级" width="100">
              <template #default="{ row }">
                <el-tag :type="row.level === 'high' ? 'danger' : 'warning'">
                  {{ row.level === 'high' ? '高风险' : '中风险' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="area" label="影响面积(亩)" width="120" />
            <el-table-column prop="suggestion" label="建议措施" min-width="200" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import L from 'leaflet'
import { changePlots, growthComparisons } from '@/data/security'

const mapRef = ref(null)
const growthChartRef = ref(null)
const viewType = ref('plot')

const warningList = ref([
  { region: '合肥市', type: '长势偏差', level: 'high', area: 200000, suggestion: '加强田间管理，追施氮肥' },
  { region: '芜湖市', type: '病虫害', level: 'medium', area: 150000, suggestion: '开展病虫害防治' }
])

let map = null

onMounted(() => {
  initMap()
  initGrowthChart()
})

const initMap = () => {
  if (mapRef.value) {
    map = L.map(mapRef.value).setView([31.86, 117.28], 7)
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map)

    changePlots.forEach(plot => {
      const color = plot.status === 'pending_check' ? '#FFA500' : 
                    plot.status === 'completed' ? '#00FF00' : 
                    plot.status === 'reported' ? '#FF0000' : '#808080'
      
      L.circleMarker(plot.location.coordinate, {
        radius: 15,
        fillColor: color,
        color: '#fff',
        weight: 2,
        fillOpacity: 0.8
      }).addTo(map).bindPopup(`
        <div style="padding: 10px;">
          <h4 style="margin: 0 0 10px 0;">${plot.plotNo}</h4>
          <p style="margin: 5px 0;">问题类型：${plot.problemTypeName}</p>
          <p style="margin: 5px 0;">面积：${plot.area}亩</p>
          <p style="margin: 5px 0;">风险等级：${plot.riskLevel === 'high' ? '高风险' : '中风险'}</p>
          <p style="margin: 5px 0;">状态：${plot.statusName}</p>
          <button onclick="alert('查看详情功能演示')" 
                  style="padding: 5px 10px; background: #409EFF; color: white; border: none; border-radius: 3px; cursor: pointer; margin-top: 10px;">
            钻取详情
          </button>
        </div>
      `)
    })
  }
}

const initGrowthChart = () => {
  if (growthChartRef.value) {
    const chart = echarts.init(growthChartRef.value)
    
    const regions = growthComparisons.map(g => g.region)
    const currentData = growthComparisons.map(g => g.currentYearIndex)
    const lastData = growthComparisons.map(g => g.lastYearIndex)
    
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['今年长势', '去年长势']
      },
      xAxis: {
        type: 'category',
        data: regions
      },
      yAxis: {
        type: 'value',
        name: '长势指数',
        max: 1
      },
      series: [
        {
          name: '今年长势',
          type: 'line',
          data: currentData,
          itemStyle: { color: '#67C23A' }
        },
        {
          name: '去年长势',
          type: 'line',
          data: lastData,
          itemStyle: { color: '#409EFF' }
        }
      ]
    }
    
    chart.setOption(option)
  }
}

const handleZoomIn = () => {
  if (map) map.zoomIn()
}

const handleZoomOut = () => {
  if (map) map.zoomOut()
}

const handleResetView = () => {
  if (map) map.setView([31.86, 117.28], 7)
}
</script>

<style scoped>
.security-map {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.map-container {
  position: relative;
}

.map-legend {
  position: absolute;
  bottom: 30px;
  left: 30px;
  background: white;
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 1000;
}

.map-legend h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #333;
}

.legend-item {
  display: flex;
  align-items: center;
  margin: 8px 0;
  font-size: 12px;
}

.legend-color {
  width: 20px;
  height: 12px;
  margin-right: 8px;
  border-radius: 2px;
}

.map-tools {
  position: absolute;
  top: 30px;
  right: 30px;
  z-index: 1000;
}

.map-stats {
  position: absolute;
  top: 30px;
  left: 30px;
  background: white;
  padding: 10px 20px;
  border-radius: 4px;
  display: flex;
  gap: 20px;
  z-index: 1000;
}
</style>