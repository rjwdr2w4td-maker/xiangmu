<template>
  <div class="weather-warning">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>气象灾害预警</span>
          <el-tag type="warning">{{ weatherWarnings.length }} 条预警</el-tag>
        </div>
      </template>

      <el-row :gutter="20" class="stats-row">
        <el-col :span="8">
          <el-statistic title="橙色预警" :value="orangeCount" suffix="条" />
        </el-col>
        <el-col :span="8">
          <el-statistic title="黄色预警" :value="yellowCount" suffix="条" />
        </el-col>
        <el-col :span="8">
          <el-statistic title="蓝色预警" :value="blueCount" suffix="条" />
        </el-col>
      </el-row>

      <el-divider />

      <el-card shadow="hover" class="map-card">
        <template #header>
          <span>预警影响区域</span>
        </template>

        <div class="warning-map">
          <div id="warningLeafletMap" class="leaflet-map"></div>
        </div>
        <div class="map-legend">
          <span><i class="legend-dot orange"></i>橙色预警</span>
          <span><i class="legend-dot yellow"></i>黄色预警</span>
          <span><i class="legend-dot blue"></i>蓝色预警</span>
        </div>
      </el-card>

      <el-divider content-position="left">预警列表</el-divider>

      <el-table :data="weatherWarnings" border style="width: 100%">
        <el-table-column prop="typeName" label="预警类型" width="120" />
        <el-table-column label="预警等级" width="110">
          <template #default="{ row }">
            <el-tag :type="getWarningTag(row.level)">{{ getWarningLevelName(row.level) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="预警标题" min-width="240" show-overflow-tooltip />
        <el-table-column label="影响区域" min-width="220">
          <template #default="{ row }">{{ row.affectRegion.join('、') }}</template>
        </el-table-column>
        <el-table-column prop="issueTime" label="发布时间" width="170" />
        <el-table-column prop="expireTime" label="失效时间" width="170" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="handleViewWarning(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="warningVisible" title="气象灾害预警详情" width="720px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="预警编号">{{ currentWarning.id }}</el-descriptions-item>
        <el-descriptions-item label="预警类型">{{ currentWarning.typeName }}</el-descriptions-item>
        <el-descriptions-item label="预警等级">
          <el-tag :type="getWarningTag(currentWarning.level)">{{ getWarningLevelName(currentWarning.level) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="发布时间">{{ currentWarning.issueTime }}</el-descriptions-item>
        <el-descriptions-item label="失效时间">{{ currentWarning.expireTime }}</el-descriptions-item>
        <el-descriptions-item label="影响区域">{{ currentWarning.affectRegion?.join('、') }}</el-descriptions-item>
        <el-descriptions-item label="预警标题" :span="2">{{ currentWarning.title }}</el-descriptions-item>
        <el-descriptions-item label="预警内容" :span="2">{{ currentWarning.content }}</el-descriptions-item>
        <el-descriptions-item label="防范建议" :span="2">
          <div class="suggestion-list">
            <div v-for="suggestion in currentWarning.suggestions" :key="suggestion" class="suggestion-item">
              {{ suggestion }}
            </div>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, nextTick } from 'vue'
import { weatherWarnings } from '@/data/disasters'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const warningVisible = ref(false)
const currentWarning = ref({})
let mapInstance = null

const orangeCount = computed(() => weatherWarnings.filter(w => w.level === 'orange').length)
const yellowCount = computed(() => weatherWarnings.filter(w => w.level === 'yellow').length)
const blueCount = computed(() => weatherWarnings.filter(w => w.level === 'blue').length)

const cityCoordinates = {
  合肥市: [31.8206, 117.2272],
  芜湖市: [31.3525, 118.4331],
  蚌埠市: [32.9168, 117.3885],
  淮南市: [32.6476, 117.0186],
  马鞍山市: [31.6894, 118.5079],
  淮北市: [33.9717, 116.7947],
  铜陵市: [30.9299, 117.8121],
  安庆市: [30.5435, 117.0637],
  黄山市: [29.7092, 118.3173],
  滁州市: [32.3173, 118.3163],
  阜阳市: [32.8901, 115.8142],
  宿州市: [33.6461, 116.9641],
  六安市: [31.7529, 116.5078],
  亳州市: [33.8712, 115.7783],
  池州市: [30.6668, 117.4892],
  宣城市: [30.9457, 118.7588]
}

const warningMapPoints = computed(() => {
  const levelPriority = { orange: 3, yellow: 2, blue: 1 }
  const points = {}
  weatherWarnings.forEach(warning => {
    warning.affectRegion.forEach(region => {
      const current = points[region]
      if (!current || levelPriority[warning.level] > levelPriority[current.level]) {
        points[region] = { name: region, level: warning.level }
      }
    })
  })
  return Object.values(points)
})

const initMap = async () => {
  await nextTick()
  if (mapInstance) return
  mapInstance = L.map('warningLeafletMap', {
    zoomControl: false,
    attributionControl: false
  }).setView([31.8257, 117.2264], 7)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18
  }).addTo(mapInstance)
  L.control.zoom({ position: 'bottomright' }).addTo(mapInstance)
  warningMapPoints.value.forEach(point => {
    const coords = cityCoordinates[point.name]
    if (coords) {
      const color = point.level === 'orange' ? '#f97316' : point.level === 'yellow' ? '#eab308' : '#3b82f6'
      L.circleMarker(coords, {
        radius: 12,
        color: '#fff',
        weight: 3,
        fillColor: color,
        fillOpacity: 0.9
      }).addTo(mapInstance).bindPopup(`<b>${point.name}</b><br>${getWarningLevelName(point.level)}`)
    }
  })
  setTimeout(() => mapInstance.invalidateSize(), 200)
}

const getWarningTag = level => {
  const map = { orange: 'danger', yellow: 'warning', blue: 'primary' }
  return map[level] || 'info'
}

const getWarningLevelName = level => {
  const map = { orange: '橙色预警', yellow: '黄色预警', blue: '蓝色预警' }
  return map[level] || level
}

const handleViewWarning = row => {
  currentWarning.value = row
  warningVisible.value = true
}

onMounted(initMap)
</script>

<style scoped>
.weather-warning {
  padding: 0;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stats-row {
  margin-bottom: 10px;
}

.map-card {
  margin-bottom: 16px;
}

.warning-map {
  position: relative;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.leaflet-map {
  width: 100%;
  height: 100%;
  z-index: 1;
}

.map-legend {
  display: flex;
  gap: 18px;
  justify-content: center;
  margin-top: 12px;
  color: #4b5563;
  font-size: 13px;
}

.legend-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 6px;
}

.legend-dot.orange {
  background: #f97316;
}

.legend-dot.yellow {
  background: #eab308;
}

.legend-dot.blue {
  background: #3b82f6;
}

.suggestion-list {
  display: grid;
  gap: 8px;
}

.suggestion-item {
  padding: 8px 10px;
  border-radius: 6px;
  background: #f8fafc;
  color: #475569;
}
</style>
