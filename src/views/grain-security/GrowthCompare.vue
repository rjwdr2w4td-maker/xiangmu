<template>
  <div class="growth-compare-page">
    <div class="page-header">
      <h1>在地作物长势对比图</h1>
      <div class="header-actions">
        <el-select v-model="selectedCrop" placeholder="选择作物" style="width: 160px">
          <el-option label="水稻" value="rice" />
          <el-option label="小麦" value="wheat" />
          <el-option label="玉米" value="corn" />
        </el-select>
      </div>
    </div>

    <div class="main-content">
      <div class="left-panel">
        <div class="map-wrapper">
          <div id="growth-map" ref="mapRef"></div>
          <div class="map-legend">
            <h4>长势对比图例</h4>
            <div class="legend-item">
              <span class="legend-color" style="background: #22c55e"></span>
              <span>向好 (今年≥去年)</span>
            </div>
            <div class="legend-item">
              <span class="legend-color" style="background: #eab308"></span>
              <span>持平 (差异<0.03)</span>
            </div>
            <div class="legend-item">
              <span class="legend-color" style="background: #ef4444"></span>
              <span>偏差 (今年<去年)</span>
            </div>
          </div>
        </div>

        <div class="data-table">
          <el-table :data="filteredData" border style="width: 100%" max-height="300">
            <el-table-column prop="region" label="区域" width="90" />
            <el-table-column prop="cropType" label="作物" width="70">
              <template #default="{ row }">
                {{ getCropName(row.cropType) }}
              </template>
            </el-table-column>
            <el-table-column prop="currentYearIndex" label="今年指数" width="85">
              <template #default="{ row }">
                {{ row.currentYearIndex.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="lastYearIndex" label="去年指数" width="85">
              <template #default="{ row }">
                {{ row.lastYearIndex.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="comparison" label="对比结论" min-width="180" show-overflow-tooltip />
            <el-table-column prop="trend" label="趋势" width="80" align="center">
              <template #default="{ row }">
                <el-tag :type="getTrendTagType(row.trend)" size="small">
                  {{ getTrendText(row.trend) }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <div class="right-panel">
        <div class="panel-header">
          <el-icon><Warning /></el-icon>
          <span>长势偏差预警</span>
          <el-tag type="danger" size="small">{{ alertList.length }}</el-tag>
        </div>
        <div class="alert-list">
          <div v-if="alertList.length === 0" class="no-alert">
            <el-icon :size="32"><CircleCheck /></el-icon>
            <p>暂无长势偏差预警</p>
          </div>
          <div
            v-for="alert in alertList"
            :key="alert.id"
            class="alert-item"
            @click="handleAlertClick(alert)"
          >
            <div class="alert-header">
              <span class="alert-region">{{ alert.region }}</span>
              <el-tag type="danger" size="small">偏差</el-tag>
            </div>
            <div class="alert-content">
              <div class="alert-row">
                <span class="label">作物：</span>
                <span>{{ getCropName(alert.cropType) }}</span>
              </div>
              <div class="alert-row">
                <span class="label">今年指数：</span>
                <span class="value-down">{{ alert.currentYearIndex.toFixed(2) }}</span>
              </div>
              <div class="alert-row">
                <span class="label">去年指数：</span>
                <span>{{ alert.lastYearIndex.toFixed(2) }}</span>
              </div>
              <div class="alert-row">
                <span class="label">差值：</span>
                <span class="value-down">{{ (alert.currentYearIndex - alert.lastYearIndex).toFixed(2) }}</span>
              </div>
            </div>
            <div class="alert-reason">{{ alert.comparison }}</div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog v-model="detailVisible" title="长势详情" width="500px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="地区">{{ currentDetail.region }}</el-descriptions-item>
        <el-descriptions-item label="作物">{{ getCropName(currentDetail.cropType) }}</el-descriptions-item>
        <el-descriptions-item label="今年长势指数">
          <span :class="getTrendClass(currentDetail.trend)">{{ currentDetail.currentYearIndex?.toFixed(2) }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="去年长势指数">{{ currentDetail.lastYearIndex?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="正常年份指数">{{ currentDetail.normalIndex?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="趋势">
          <el-tag :type="getTrendTagType(currentDetail.trend)" size="small">
            {{ getTrendText(currentDetail.trend) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="种植面积(亩)" :span="2">
          {{ formatArea(currentDetail.area) }}
        </el-descriptions-item>
        <el-descriptions-item label="对比结论" :span="2">
          {{ currentDetail.comparison }}
        </el-descriptions-item>
      </el-descriptions>
      <div v-if="currentDetail.trend === 'down'" class="measure-section">
        <h4>田管措施建议</h4>
        <el-input
          v-model="measureText"
          type="textarea"
          :rows="4"
          placeholder="请输入田管措施建议..."
        />
        <div class="measure-actions">
          <el-button type="primary" @click="handleSendMeasure">下发种植主体</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog v-model="measureResultVisible" title="下发成功" width="400px">
      <el-result icon="success" title="田管措施已下发" sub-title="相关种植主体将收到短信通知">
        <template #extra>
          <el-button type="primary" @click="measureResultVisible = false">确定</el-button>
        </template>
      </el-result>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import L from 'leaflet'
import { Warning, CircleCheck } from '@element-plus/icons-vue'
import { growthComparisons } from '@/data/security'

const mapRef = ref(null)
const selectedCrop = ref('rice')
const detailVisible = ref(false)
const measureResultVisible = ref(false)
const currentDetail = ref({})
const measureText = ref('')
let map = null
let markers = []

const cityCoordinates = {
  '合肥市': [117.27, 31.86],
  '芜湖市': [118.38, 31.33],
  '蚌埠市': [117.36, 32.94],
  '淮南市': [116.99, 32.62],
  '马鞍山市': [118.51, 31.68],
  '淮北市': [116.82, 33.97],
  '铜陵市': [117.81, 30.93],
  '安庆市': [117.05, 30.53],
  '黄山市': [118.33, 29.72],
  '滁州市': [118.32, 32.32],
  '阜阳市': [115.82, 32.89],
  '宿州市': [116.97, 33.64],
  '六安市': [116.51, 31.75],
  '亳州市': [115.78, 33.88],
  '池州市': [117.49, 30.67],
  '宣城市': [118.76, 30.95]
}

const filteredData = computed(() => {
  return growthComparisons.filter(item => item.cropType === selectedCrop.value)
})

const alertList = computed(() => {
  return filteredData.value.filter(item => item.trend === 'down')
})

const getCropName = (cropType) => {
  const map = {
    'rice': '水稻',
    'wheat': '小麦',
    'corn': '玉米'
  }
  return map[cropType] || cropType
}

const getTrendTagType = (trend) => {
  const map = {
    'up': 'success',
    'stable': 'warning',
    'down': 'danger'
  }
  return map[trend] || 'info'
}

const getTrendText = (trend) => {
  const map = {
    'up': '向好',
    'stable': '持平',
    'down': '偏差'
  }
  return map[trend] || '未知'
}

const getTrendClass = (trend) => {
  const map = {
    'up': 'value-up',
    'stable': 'value-stable',
    'down': 'value-down'
  }
  return map[trend] || ''
}

const getTrendColor = (trend) => {
  const map = {
    'up': '#22c55e',
    'stable': '#eab308',
    'down': '#ef4444'
  }
  return map[trend] || '#6b7280'
}

const formatArea = (area) => {
  if (!area) return '-'
  return (area / 10000).toFixed(1) + ' 万亩'
}

const createMarkerIcon = (color) => {
  return L.divIcon({
    className: 'growth-marker',
    html: `
      <div style="
        width: 36px;
        height: 36px;
        background: ${color};
        border: 3px solid #fff;
        border-radius: 50%;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 12px;
          height: 12px;
          background: rgba(255,255,255,0.6);
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  })
}

const createPopupContent = (data) => {
  return `
    <div class="growth-popup">
      <h3>${data.region}</h3>
      <div class="popup-row">
        <span class="popup-label">作物：</span>
        <span>${getCropName(data.cropType)}</span>
      </div>
      <div class="popup-row">
        <span class="popup-label">今年指数：</span>
        <span style="color: ${getTrendColor(data.trend)}; font-weight: 600;">${data.currentYearIndex.toFixed(2)}</span>
      </div>
      <div class="popup-row">
        <span class="popup-label">去年指数：</span>
        <span>${data.lastYearIndex.toFixed(2)}</span>
      </div>
      <div class="popup-row">
        <span class="popup-label">种植面积：</span>
        <span>${formatArea(data.area)}</span>
      </div>
      <div class="popup-row">
        <span class="popup-label">对比结论：</span>
        <span style="color: ${getTrendColor(data.trend)};">${data.comparison}</span>
      </div>
    </div>
  `
}

const initMap = async () => {
  await nextTick()
  if (!mapRef.value) return

  map = L.map(mapRef.value, {
    center: [31.8, 117.3],
    zoom: 7,
    zoomControl: false
  })

  L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
    subdomains: ['1', '2', '3', '4'],
    maxZoom: 18,
    attribution: ''
  }).addTo(map)

  L.control.zoom({ position: 'topright' }).addTo(map)

  renderMarkers()
}

const renderMarkers = () => {
  markers.forEach(marker => marker.remove())
  markers = []

  filteredData.value.forEach(data => {
    const coords = cityCoordinates[data.region]
    if (!coords) return

    const color = getTrendColor(data.trend)
    const icon = createMarkerIcon(color)

    const marker = L.marker([coords[1], coords[0]], { icon }).addTo(map)

    marker.bindPopup(createPopupContent(data), {
      maxWidth: 320,
      className: 'custom-popup'
    })

    marker.on('click', () => {
      currentDetail.value = data
      if (data.trend === 'down') {
        measureText.value = generateMeasure(data)
      } else {
        measureText.value = ''
      }
      detailVisible.value = true
    })

    markers.push(marker)
  })
}

const generateMeasure = (data) => {
  const measures = {
    'rice': '建议加强水肥管理，及时追施分蘖肥，保持田间适当水层，促进水稻分蘖生长。同时注意防治稻飞虱、稻纵卷叶螟等病虫害。',
    'wheat': '建议适时追施拔节孕穗肥，加强田间排水防渍，注意防治小麦赤霉病、蚜虫等病虫害，确保小麦正常灌浆。',
    'corn': '建议及时追施穗肥，加强田间管理，注意防治玉米螟、蚜虫等害虫，适时灌溉保证玉米拔节孕穗期水分供应。'
  }
  return measures[data.cropType] || '请根据实际情况制定田管措施。'
}

const handleAlertClick = (alert) => {
  currentDetail.value = alert
  measureText.value = generateMeasure(alert)
  detailVisible.value = true

  const coords = cityCoordinates[alert.region]
  if (map && coords) {
    map.setView([coords[1], coords[0]], 9)
  }
}

const handleSendMeasure = () => {
  if (!measureText.value.trim()) {
    return
  }
  detailVisible.value = false
  measureResultVisible.value = true
}

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (map) {
    map.remove()
  }
})
</script>

<style scoped>
.growth-compare-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.page-header {
  background: #fff;
  padding: 16px 24px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
  padding: 16px;
  gap: 16px;
}

.left-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.map-wrapper {
  flex: 1;
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  min-height: 400px;
}

#growth-map {
  width: 100%;
  height: 100%;
}

.map-legend {
  position: absolute;
  bottom: 16px;
  left: 16px;
  background: #fff;
  padding: 12px 16px;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.map-legend h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.legend-item {
  display: flex;
  align-items: center;
  margin: 6px 0;
  font-size: 13px;
  color: #606266;
}

.legend-color {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.data-table {
  background: #fff;
  border-radius: 4px;
  padding: 16px;
}

.right-panel {
  width: 320px;
  background: #fff;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 14px 16px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #1f2937;
}

.panel-header .el-icon {
  color: #ef4444;
}

.alert-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.no-alert {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #909399;
}

.no-alert .el-icon {
  color: #67c23a;
  margin-bottom: 12px;
}

.no-alert p {
  margin: 0;
  font-size: 14px;
}

.alert-item {
  background: #fff;
  border: 1px solid #fecaca;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.alert-item:hover {
  border-color: #ef4444;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.15);
}

.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.alert-region {
  font-weight: 600;
  color: #1f2937;
}

.alert-content {
  font-size: 13px;
}

.alert-row {
  display: flex;
  margin-bottom: 4px;
}

.alert-row .label {
  color: #909399;
  width: 72px;
  flex-shrink: 0;
}

.value-up {
  color: #22c55e;
  font-weight: 600;
}

.value-stable {
  color: #eab308;
  font-weight: 600;
}

.value-down {
  color: #ef4444;
  font-weight: 600;
}

.alert-reason {
  font-size: 12px;
  color: #606266;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #e4e7ed;
  line-height: 1.5;
}

.measure-section {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e4e7ed;
}

.measure-section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.measure-actions {
  margin-top: 12px;
  text-align: right;
}
</style>

<style>
.growth-popup {
  padding: 12px;
  min-width: 260px;
}

.growth-popup h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 8px;
}

.growth-popup .popup-row {
  display: flex;
  margin-bottom: 8px;
  font-size: 13px;
}

.growth-popup .popup-label {
  color: #909399;
  width: 72px;
  flex-shrink: 0;
}

.custom-popup .leaflet-popup-content-wrapper {
  border-radius: 4px;
}

.custom-popup .leaflet-popup-content {
  margin: 0;
}
</style>
