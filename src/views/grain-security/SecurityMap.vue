<template>
  <div class="security-map-page">
    <div class="page-header">
      <h1>粮食安全监测一张图</h1>
    </div>

    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-label">总图斑数</div>
      </div>
      <div class="stat-card pending">
        <div class="stat-value">{{ stats.pendingCheck }}</div>
        <div class="stat-label">待核查</div>
      </div>
      <div class="stat-card checking">
        <div class="stat-value">{{ stats.checking }}</div>
        <div class="stat-label">核查中</div>
      </div>
      <div class="stat-card rectifying">
        <div class="stat-value">{{ stats.rectifying }}</div>
        <div class="stat-label">整改中</div>
      </div>
      <div class="stat-card completed">
        <div class="stat-value">{{ stats.completed }}</div>
        <div class="stat-label">已整改</div>
      </div>
    </div>

    <div class="filter-bar">
      <el-radio-group v-model="currentFilter" @change="handleFilterChange">
        <el-radio-button label="">全部</el-radio-button>
        <el-radio-button label="pending_check">待核查</el-radio-button>
        <el-radio-button label="checking">核查中</el-radio-button>
        <el-radio-button label="reported">待审核</el-radio-button>
        <el-radio-button label="rectifying">整改中</el-radio-button>
        <el-radio-button label="completed">已整改</el-radio-button>
        <el-radio-button label="closed">已结案</el-radio-button>
      </el-radio-group>
    </div>

    <div class="main-content">
      <div class="left-panel">
        <div class="panel-header">
          <span>图斑列表</span>
          <span class="count">共 {{ filteredPlots.length }} 条</span>
        </div>
        <div class="plot-list">
          <div
            v-for="plot in filteredPlots"
            :key="plot.id"
            class="plot-item"
            :class="{ 'is-overdue': isOverdue(plot), 'is-selected': selectedPlotId === plot.id }"
            @click="locatePlot(plot)"
          >
            <div class="plot-header">
              <span class="plot-no">{{ plot.plotNo }}</span>
              <el-tag :type="getStatusTagType(plot.status)" size="small">{{ plot.statusName }}</el-tag>
            </div>
            <div class="plot-info">
              <div class="info-row">
                <span class="label">位置：</span>
                <span class="value">{{ plot.location.city }} {{ plot.location.county }}</span>
              </div>
              <div class="info-row">
                <span class="label">面积：</span>
                <span class="value">{{ plot.area }} 亩</span>
              </div>
              <div class="info-row">
                <span class="label">类型：</span>
                <span class="value">{{ plot.problemTypeName }}</span>
              </div>
              <div class="info-row">
                <span class="label">风险：</span>
                <span class="value" :class="'risk-' + plot.riskLevel">{{ getRiskLevelText(plot.riskLevel) }}</span>
              </div>
              <div v-if="isOverdue(plot)" class="overdue-warning">
                <el-icon><WarningFilled /></el-icon>
                <span>已超期</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="map-wrapper">
        <div id="security-map" ref="mapRef"></div>
        <div class="map-legend">
          <h4>图例说明</h4>
          <div class="legend-item">
            <span class="legend-color" style="background: #ef4444"></span>
            <span>待核查</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background: #f97316"></span>
            <span>核查中</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background: #eab308"></span>
            <span>待审核/整改中</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background: #22c55e"></span>
            <span>已整改</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import { changePlots } from '@/data/security'
import { WarningFilled } from '@element-plus/icons-vue'

const mapRef = ref(null)
const currentFilter = ref('')
const selectedPlotId = ref(null)
let map = null
let markers = []

const stats = computed(() => {
  const total = changePlots.length
  const pendingCheck = changePlots.filter(p => p.status === 'pending_check').length
  const checking = changePlots.filter(p => p.status === 'checking').length
  const rectifying = changePlots.filter(p => p.status === 'rectifying').length
  const completed = changePlots.filter(p => p.status === 'completed').length
  return { total, pendingCheck, checking, rectifying, completed }
})

const filteredPlots = computed(() => {
  if (!currentFilter.value) {
    return changePlots
  }
  return changePlots.filter(p => p.status === currentFilter.value)
})

const getStatusColor = (status) => {
  const colorMap = {
    pending_check: '#ef4444',
    checking: '#f97316',
    reported: '#eab308',
    rectifying: '#eab308',
    completed: '#22c55e',
    closed: '#6b7280'
  }
  return colorMap[status] || '#6b7280'
}

const getStatusTagType = (status) => {
  const typeMap = {
    pending_check: 'danger',
    checking: 'warning',
    reported: 'warning',
    rectifying: 'warning',
    completed: 'success',
    closed: 'info'
  }
  return typeMap[status] || 'info'
}

const getRiskLevelText = (level) => {
  const textMap = {
    high: '高风险',
    medium: '中风险',
    low: '低风险'
  }
  return textMap[level] || '未知'
}

const isOverdue = (plot) => {
  if (!plot.deadline) return false
  return new Date(plot.deadline) < new Date()
}

const getRemainingDays = (deadline) => {
  if (!deadline) return null
  const diff = new Date(deadline) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

const createMarkerIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 28px;
        height: 28px;
        background: ${color};
        border: 3px solid #fff;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  })
}

const createPopupContent = (plot) => {
  const remainingDays = getRemainingDays(plot.deadline)
  const overdue = isOverdue(plot)
  
  return `
    <div class="plot-popup">
      <h3>${plot.plotNo}</h3>
      <div class="popup-row">
        <span class="popup-label">位置：</span>
        <span>${plot.location.city} ${plot.location.county} ${plot.location.town} ${plot.location.village}</span>
      </div>
      <div class="popup-row">
        <span class="popup-label">面积：</span>
        <span>${plot.area} 亩</span>
      </div>
      <div class="popup-row">
        <span class="popup-label">类型：</span>
        <span>${plot.problemTypeName}</span>
      </div>
      <div class="popup-row">
        <span class="popup-label">风险等级：</span>
        <span style="color: ${plot.riskLevel === 'high' ? '#ef4444' : plot.riskLevel === 'medium' ? '#f59e0b' : '#22c55e'}">${getRiskLevelText(plot.riskLevel)}</span>
      </div>
      <div class="popup-row">
        <span class="popup-label">当前状态：</span>
        <span style="color: ${getStatusColor(plot.status)}">${plot.statusName}</span>
      </div>
      <div class="popup-row">
        <span class="popup-label">责任人：</span>
        <span>${plot.assignee}</span>
      </div>
      <div class="popup-row">
        <span class="popup-label">剩余时限：</span>
        <span style="color: ${overdue ? '#ef4444' : remainingDays <= 3 ? '#f59e0b' : '#22c55e'}">
          ${overdue ? '已超期' : remainingDays !== null ? remainingDays + ' 天' : '-'}
        </span>
      </div>
    </div>
  `
}

const initMap = () => {
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

  filteredPlots.value.forEach(plot => {
    const color = getStatusColor(plot.status)
    const icon = createMarkerIcon(color)
    
    const marker = L.marker([plot.location.coordinate[1], plot.location.coordinate[0]], {
      icon
    }).addTo(map)

    marker.bindPopup(createPopupContent(plot), {
      maxWidth: 320,
      className: 'custom-popup'
    })

    marker.on('click', () => {
      selectedPlotId.value = plot.id
    })

    markers.push(marker)
  })
}

const locatePlot = (plot) => {
  selectedPlotId.value = plot.id
  if (map) {
    const [lng, lat] = plot.location.coordinate
    map.setView([lat, lng], 10)
    
    const marker = markers.find(m => {
      const latlng = m.getLatLng()
      return Math.abs(latlng.lat - lat) < 0.001 && Math.abs(latlng.lng - lng) < 0.001
    })
    if (marker) {
      marker.openPopup()
    }
  }
}

const handleFilterChange = () => {
  renderMarkers()
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
.security-map-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.page-header {
  background: #fff;
  padding: 16px 24px;
  border-bottom: 1px solid #e4e7ed;
}

.page-header h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.stats-cards {
  display: flex;
  gap: 16px;
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
}

.stat-card {
  flex: 1;
  background: #4a5568;
  border-radius: 8px;
  padding: 16px;
  color: #fff;
  text-align: center;
}

.stat-card.pending {
  background: #ef4444;
}

.stat-card.checking {
  background: #f97316;
}

.stat-card.rectifying {
  background: #eab308;
}

.stat-card.completed {
  background: #22c55e;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
  margin-top: 4px;
}

.filter-bar {
  padding: 12px 24px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
}

.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.left-panel {
  width: 360px;
  background: #fff;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #1f2937;
}

.panel-header .count {
  font-size: 12px;
  color: #909399;
  font-weight: normal;
}

.plot-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.plot-item {
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.plot-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
}

.plot-item.is-selected {
  border-color: #409eff;
  background: #ecf5ff;
}

.plot-item.is-overdue {
  border-left: 3px solid #ef4444;
}

.plot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.plot-no {
  font-weight: 600;
  color: #1f2937;
}

.plot-info {
  font-size: 13px;
}

.info-row {
  display: flex;
  margin-bottom: 4px;
}

.info-row .label {
  color: #909399;
  width: 48px;
  flex-shrink: 0;
}

.info-row .value {
  color: #606266;
}

.risk-high {
  color: #ef4444 !important;
  font-weight: 500;
}

.risk-medium {
  color: #f59e0b !important;
  font-weight: 500;
}

.risk-low {
  color: #22c55e !important;
  font-weight: 500;
}

.overdue-warning {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ef4444;
  font-size: 12px;
  margin-top: 8px;
  padding: 4px 8px;
  background: #fef2f2;
  border-radius: 4px;
}

.map-wrapper {
  flex: 1;
  position: relative;
}

#security-map {
  width: 100%;
  height: 100%;
}

.map-legend {
  position: absolute;
  bottom: 24px;
  left: 24px;
  background: #fff;
  padding: 12px 16px;
  border-radius: 6px;
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
</style>

<style>
.custom-popup .plot-popup {
  padding: 12px;
  min-width: 280px;
}

.custom-popup .plot-popup h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 8px;
}

.custom-popup .popup-row {
  display: flex;
  margin-bottom: 8px;
  font-size: 13px;
}

.custom-popup .popup-label {
  color: #909399;
  width: 72px;
  flex-shrink: 0;
}

.custom-popup .leaflet-popup-content-wrapper {
  border-radius: 8px;
}

.custom-popup .leaflet-popup-content {
  margin: 0;
}
</style>