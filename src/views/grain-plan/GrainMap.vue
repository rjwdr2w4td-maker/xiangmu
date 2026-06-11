<template>
  <div class="grain-map">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>粮食生产一张图（进度动态可视化 + 到户到田数据钻取）</span>
          <div>
            <el-radio-group v-model="mapType" size="small">
              <el-radio-button label="sowing">播种进度</el-radio-button>
              <el-radio-button label="harvest">收获进度</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </template>

      <div class="map-container">
        <div id="map" ref="mapRef" class="map"></div>
        
        <div class="map-legend">
          <h4>图例说明</h4>
          <div class="legend-item">
            <span class="legend-color" style="background: #67C23A"></span>
            <span>进度 ≥ 95%（优秀）</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background: #409EFF"></span>
            <span>进度 80-95%（良好）</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background: #E6A23C"></span>
            <span>进度 60-80%（一般）</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background: #F56C6C"></span>
            <span>进度 < 60%（滞后）</span>
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
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>各市播种进度排行榜</span>
          </template>
          <el-table :data="progressRanking" border style="width: 100%">
            <el-table-column type="index" label="排名" width="60" />
            <el-table-column prop="name" label="市级名称" width="120" />
            <el-table-column prop="planArea" label="计划面积(万亩)" width="120">
              <template #default="{ row }">
                {{ (row.planArea / 10000).toFixed(0) }}
              </template>
            </el-table-column>
            <el-table-column prop="actualArea" label="已播面积(万亩)" width="120">
              <template #default="{ row }">
                {{ (row.actualArea / 10000).toFixed(0) }}
              </template>
            </el-table-column>
            <el-table-column prop="progress" label="完成度" sortable>
              <template #default="{ row }">
                <el-progress
                  :percentage="row.progress"
                  :color="getProgressColor(row.progress)"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <span>种植统计分析</span>
          </template>
          <div ref="chartRef" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      v-model="drillDownDialogVisible"
      :title="drillDownTitle"
      width="900px"
    >
      <div v-if="drillDownLevel === 'city'">
        <h4 style="margin-bottom: 15px">{{ drillDownData.name }} - 县级数据钻取</h4>
        <el-table :data="drillDownData.counties" border style="width: 100%">
          <el-table-column prop="name" label="县级名称" min-width="150" />
          <el-table-column prop="planArea" label="计划面积(亩)" min-width="150" />
          <el-table-column prop="actualArea" label="已播面积(亩)" min-width="150" />
          <el-table-column prop="progress" label="完成度" min-width="160">
            <template #default="{ row }">
              <el-progress
                :percentage="row.progress"
                :color="getProgressColor(row.progress)"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template #default="{ row }">
              <el-button size="small" type="primary" @click="handleDrillDownCounty(row)">
                查看种植主体(到户)
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-else-if="drillDownLevel === 'county'">
        <h4 style="margin-bottom: 15px">{{ drillDownData.name }} - 种植主体（到户到田）</h4>
        <el-table :data="drillDownData.farmers" border style="width: 100%">
          <el-table-column prop="name" label="主体名称（到户）" min-width="180" />
          <el-table-column prop="type" label="主体类型" min-width="140">
            <template #default="{ row }">
              <el-tag>{{ getTypeName(row.type) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="totalArea" label="种植面积(亩)" min-width="120" />
          <el-table-column prop="sowedArea" label="已播面积(亩)" min-width="120" />
          <el-table-column prop="plotCount" label="地块数量" min-width="100" />
          <el-table-column label="操作" width="140">
            <template #default="{ row }">
              <el-button size="small" type="primary" @click="handleDrillDownFarmer(row)">
                查看地块(到田)
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-else-if="drillDownLevel === 'farmer'">
        <h4 style="margin-bottom: 15px">{{ drillDownData.name }} - 地块详情（到田）</h4>
        <el-table :data="drillDownData.plots" border style="width: 100%">
          <el-table-column prop="plotId" label="地块编号" min-width="140" />
          <el-table-column prop="area" label="面积(亩)" min-width="100" />
          <el-table-column prop="cropType" label="作物类型" min-width="120">
            <template #default="{ row }">
              <el-tag>{{ getCropName(row.cropType) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="sowingTime" label="播种时间" min-width="120" />
          <el-table-column label="地理位置" min-width="180">
            <template #default="{ row }">
              <el-tag type="info" size="small">
                {{ row.location[0].toFixed(2) }}°, {{ row.location[1].toFixed(2) }}°
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="110">
            <template #default="{ row }">
              <el-button size="small" type="primary" @click="handleViewOnMap(row)">
                定位地图
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import L from 'leaflet'
import { plantingTasks } from '@/data/tasks'

const mapRef = ref(null)
const chartRef = ref(null)
const mapType = ref('sowing')
let map = null

const drillDownDialogVisible = ref(false)
const drillDownTitle = ref('')
const drillDownLevel = ref('')
const drillDownData = ref({})

const progressRanking = ref([
  { name: '合肥市', planArea: 3500000, actualArea: 3420000, progress: 97.7 },
  { name: '芜湖市', planArea: 2800000, actualArea: 2750000, progress: 98.2 },
  { name: '蚌埠市', planArea: 4200000, actualArea: 4080000, progress: 97.1 },
  { name: '淮南市', planArea: 3100000, actualArea: 3000000, progress: 96.8 },
  { name: '马鞍山市', planArea: 2200000, actualArea: 2150000, progress: 97.7 }
])

const getProgressColor = (progress) => {
  if (progress >= 95) return '#67C23A'
  if (progress >= 80) return '#409EFF'
  if (progress >= 60) return '#E6A23C'
  return '#F56C6C'
}

const getTypeName = (type) => {
  const map = {
    large_farmer: '规模种植大户',
    family_farm: '家庭农场',
    cooperative: '农民专业合作社',
    ordinary_farmer: '普通农户'
  }
  return map[type] || type
}

const getCropName = (cropType) => {
  const map = {
    wheat: '小麦',
    rice: '水稻',
    corn: '玉米',
    soybean: '大豆',
    rapeseed: '油菜'
  }
  return map[cropType] || cropType
}

const initMap = () => {
  map = L.map(mapRef.value).setView([31.86, 117.28], 7)
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  const cities = [
    { name: '合肥市', coord: [31.82, 117.28], progress: 97.7 },
    { name: '芜湖市', coord: [31.35, 118.38], progress: 98.2 },
    { name: '蚌埠市', coord: [32.94, 117.36], progress: 97.1 },
    { name: '淮南市', coord: [32.63, 117.00], progress: 96.8 },
    { name: '马鞍山市', coord: [31.70, 118.51], progress: 97.7 }
  ]

  cities.forEach(city => {
    const color = getProgressColor(city.progress)
    
    const marker = L.circleMarker(city.coord, {
      radius: 20,
      fillColor: color,
      color: '#fff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8
    }).addTo(map)

    marker.bindPopup(`
      <div style="padding: 10px;">
        <h4 style="margin: 0 0 10px 0;">${city.name}</h4>
        <p style="margin: 5px 0;">播种进度：${city.progress}%</p>
        <button onclick="handleCityClick('${city.name}')" 
                style="padding: 5px 10px; background: #409EFF; color: white; border: none; border-radius: 3px; cursor: pointer;">
          钻取详情
        </button>
      </div>
    `)
  })
}

window.handleCityClick = (cityName) => {
  handleDrillDownCity(cityName)
}

const handleDrillDownCity = (cityName) => {
  const task = plantingTasks[0]
  const cityData = task.decomposition.find(c => c.name === cityName)
  
  if (cityData) {
    drillDownLevel.value = 'city'
    drillDownTitle.value = `${cityName} - 数据钻取`
    drillDownData.value = cityData
    drillDownDialogVisible.value = true
  }
}

const handleDrillDownCounty = (row) => {
  drillDownLevel.value = 'county'
  drillDownTitle.value = `${row.name} - 种植主体`
  drillDownData.value = {
    name: row.name,
    farmers: [
      {
        name: '张明家庭农场',
        type: 'family_farm',
        totalArea: 520,
        sowedArea: 520,
        plotCount: 3
      },
      {
        name: '李华种植专业合作社',
        type: 'cooperative',
        totalArea: 1280,
        sowedArea: 1280,
        plotCount: 4
      },
      {
        name: '王强规模种植大户',
        type: 'large_farmer',
        totalArea: 850,
        sowedArea: 850,
        plotCount: 3
      }
    ]
  }
}

const handleDrillDownFarmer = (row) => {
  drillDownLevel.value = 'farmer'
  drillDownTitle.value = `${row.name} - 地块详情（到田）`
  drillDownData.value = {
    name: row.name,
    plots: [
      { plotId: 'PLOT001', area: 150, cropType: 'wheat', sowingTime: '2026-03-10', location: [117.36, 31.86] },
      { plotId: 'PLOT002', area: 180, cropType: 'wheat', sowingTime: '2026-03-12', location: [117.37, 31.87] },
      { plotId: 'PLOT003', area: 190, cropType: 'rice', sowingTime: '2026-06-15', location: [117.38, 31.85] }
    ]
  }
}

const handleViewOnMap = (row) => {
  ElMessage.info(`在地图上定位地块 ${row.plotId}，位置：${row.location[0]}°E, ${row.location[1]}°N`)
  if (map) {
    map.setView(row.location, 14)
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

const initChart = () => {
  const chart = echarts.init(chartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {
      data: ['计划面积', '已播面积']
    },
    xAxis: {
      type: 'category',
      data: ['合肥市', '芜湖市', '蚌埠市', '淮南市', '马鞍山市']
    },
    yAxis: {
      type: 'value',
      name: '万亩'
    },
    series: [
      {
        name: '计划面积',
        type: 'bar',
        data: [350, 280, 420, 310, 220],
        itemStyle: { color: '#409EFF' }
      },
      {
        name: '已播面积',
        type: 'bar',
        data: [342, 275, 408, 300, 215],
        itemStyle: { color: '#67C23A' }
      }
    ]
  }
  
  chart.setOption(option)
}

onMounted(() => {
  initMap()
  initChart()
})
</script>

<style scoped>
.grain-map {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.map-container {
  position: relative;
  width: 100%;
  height: 500px;
}

.map {
  width: 100%;
  height: 100%;
}

.map-legend {
  position: absolute;
  bottom: 20px;
  left: 20px;
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
  top: 20px;
  right: 20px;
  z-index: 1000;
}

h4 {
  color: #333;
  font-size: 16px;
}
</style>