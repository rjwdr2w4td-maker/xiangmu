<template>
  <div class="task-board">
    <div class="header">
      <h2>任务跟踪看板</h2>
    </div>

    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-label">图斑总数</div>
      </div>
      <div class="stat-card checking">
        <div class="stat-value">{{ stats.checking }}</div>
        <div class="stat-label">核查中</div>
      </div>
      <div class="stat-card pending">
        <div class="stat-value">{{ stats.pending }}</div>
        <div class="stat-label">待审核</div>
      </div>
      <div class="stat-card rectifying">
        <div class="stat-value">{{ stats.rectifying }}</div>
        <div class="stat-label">整改中</div>
      </div>
      <div class="stat-card completed">
        <div class="stat-value">{{ stats.completed }}</div>
        <div class="stat-label">已结案</div>
      </div>
      <div class="stat-card overdue">
        <div class="stat-value">{{ stats.overdue }}</div>
        <div class="stat-label">超期预警</div>
      </div>
    </div>

    <div class="main-content">
      <div class="map-section">
        <el-card>
          <div id="task-map" ref="mapRef"></div>
          <div class="map-legend">
            <div class="legend-item">
              <span class="legend-color checking-color"></span>
              <span>核查中</span>
            </div>
            <div class="legend-item">
              <span class="legend-color pending-color"></span>
              <span>待审核</span>
            </div>
            <div class="legend-item">
              <span class="legend-color rectifying-color"></span>
              <span>整改中</span>
            </div>
            <div class="legend-item">
              <span class="legend-color completed-color"></span>
              <span>已结案</span>
            </div>
            <div class="legend-item">
              <span class="legend-color overdue-color"></span>
              <span>超期</span>
            </div>
          </div>
        </el-card>
      </div>

      <div class="list-section">
        <el-card>
          <template #header>
            <div class="list-header">
              <span>图斑列表</span>
              <el-select v-model="stageFilter" placeholder="按阶段筛选" clearable size="small" style="width: 140px">
                <el-option label="全部阶段" value="" />
                <el-option label="核查中" value="checking" />
                <el-option label="待审核" value="pending" />
                <el-option label="整改中" value="rectifying" />
                <el-option label="已结案" value="completed" />
              </el-select>
            </div>
          </template>

          <el-table 
            :data="filteredPlots" 
            border 
            style="width: 100%"
            :row-class-name="getRowClass"
            @row-click="handleRowClick"
            highlight-current-row
          >
            <el-table-column prop="plotNo" label="图斑编号" width="140" />
            <el-table-column label="位置" min-width="150">
              <template #default="{ row }">
                {{ row.location.city }} {{ row.location.county }}
              </template>
            </el-table-column>
            <el-table-column label="当前阶段" width="100">
              <template #default="{ row }">
                <el-tag :type="getStageTagType(row.stage)" size="small">
                  {{ row.stageName }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="assignee" label="责任人" width="150" />
            <el-table-column label="剩余时限" width="100">
              <template #default="{ row }">
                <span :class="{ 'overdue-text': row.remainingDays <= 0 }">
                  {{ row.remainingDays <= 0 ? '已超期' : row.remainingDays + '天' }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import dayjs from 'dayjs'
import { getPlots } from '@/data/plotStore'

const mapRef = ref(null)
const stageFilter = ref('')
const plots = ref([])
let map = null
let markers = []

const getStage = (status) => {
  const stageMap = {
    'pending_check': 'checking',
    'checking': 'checking',
    'reported': 'pending',
    'rectifying': 'rectifying',
    'completed': 'completed'
  }
  return stageMap[status] || 'checking'
}

const getStageName = (stage) => {
  const nameMap = {
    'checking': '核查中',
    'pending': '待审核',
    'rectifying': '整改中',
    'completed': '已结案'
  }
  return nameMap[stage] || '未知'
}

const plotsWithStage = computed(() => {
  return plots.value.map(plot => {
    const deadline = dayjs(plot.deadline)
    const now = dayjs()
    const remainingDays = deadline.diff(now, 'day')
    const stage = getStage(plot.status)
    return {
      ...plot,
      stage,
      stageName: getStageName(stage),
      remainingDays
    }
  })
})

const stats = computed(() => {
  const data = plotsWithStage.value
  return {
    total: data.length,
    checking: data.filter(p => p.stage === 'checking').length,
    pending: data.filter(p => p.stage === 'pending').length,
    rectifying: data.filter(p => p.stage === 'rectifying').length,
    completed: data.filter(p => p.stage === 'completed').length,
    overdue: data.filter(p => p.remainingDays <= 0).length
  }
})

const filteredPlots = computed(() => {
  if (!stageFilter.value) return plotsWithStage.value
  return plotsWithStage.value.filter(p => p.stage === stageFilter.value)
})

const getStageTagType = (stage) => {
  const typeMap = {
    'checking': 'warning',
    'pending': 'info',
    'rectifying': 'primary',
    'completed': 'success'
  }
  return typeMap[stage] || ''
}

const getRowClass = ({ row }) => {
  if (row.remainingDays <= 0) {
    return 'overdue-row'
  }
  return ''
}

const getMarkerColor = (plot) => {
  if (plot.remainingDays <= 0) return '#ef4444'
  
  const colorMap = {
    'checking': '#f59e0b',
    'pending': '#3b82f6',
    'rectifying': '#8b5cf6',
    'completed': '#10b981'
  }
  return colorMap[plot.stage] || '#6b7280'
}

const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 24px;
      height: 24px;
      background: ${color};
      border: 3px solid #fff;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  })
}

const initMap = () => {
  if (mapRef.value) {
    map = L.map(mapRef.value, {
      center: [31.86, 117.28],
      zoom: 7
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map)

    addMarkers()
  }
}

const addMarkers = () => {
  markers.forEach(m => map.removeLayer(m))
  markers = []

  plotsWithStage.value.forEach(plot => {
    const color = getMarkerColor(plot)
    const marker = L.marker(plot.location.coordinate, {
      icon: createCustomIcon(color)
    }).addTo(map)

    marker.bindPopup(`
      <div style="padding: 8px; min-width: 180px;">
        <div style="font-weight: bold; margin-bottom: 8px; color: #1f2937;">${plot.plotNo}</div>
        <div style="font-size: 12px; color: #4b5563; margin-bottom: 4px;">
          <strong>位置:</strong>${plot.location.city} ${plot.location.county}
        </div>
        <div style="font-size: 12px; color: #4b5563; margin-bottom: 4px;">
          <strong>阶段:</strong>${plot.stageName}
        </div>
        <div style="font-size: 12px; color: #4b5563; margin-bottom: 4px;">
          <strong>责任人:</strong>${plot.assignee}
        </div>
        <div style="font-size: 12px; color: ${plot.remainingDays <= 0 ? '#ef4444' : '#4b5563'};">
          <strong>剩余时限:</strong>${plot.remainingDays <= 0 ? '已超期' : plot.remainingDays + '天'}
        </div>
      </div>
    `)

    marker.plotId = plot.id
    markers.push(marker)
  })
}

const handleRowClick = (row) => {
  const marker = markers.find(m => m.plotId === row.id)
  if (marker && map) {
    map.setView(row.location.coordinate, 10)
    marker.openPopup()
  }
}

onMounted(() => {
  plots.value = getPlots()
  initMap()
})

onUnmounted(() => {
  if (map) {
    map.remove()
  }
})
</script>

<style scoped>
.task-board {
  padding: 0;
}

.header {
  margin-bottom: 20px;
}

.header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.stats-cards {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #6b7280;
}

.stat-card.checking {
  border-left-color: #f59e0b;
}

.stat-card.pending {
  border-left-color: #3b82f6;
}

.stat-card.rectifying {
  border-left-color: #8b5cf6;
}

.stat-card.completed {
  border-left-color: #10b981;
}

.stat-card.overdue {
  border-left-color: #ef4444;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
}

.main-content {
  display: flex;
  gap: 16px;
  height: calc(100vh - 280px);
  min-height: 500px;
}

.map-section {
  flex: 1;
}

.map-section :deep(.el-card) {
  height: 100%;
}

.map-section :deep(.el-card__body) {
  height: 100%;
  padding: 0;
  position: relative;
}

#task-map {
  height: 100%;
  width: 100%;
  border-radius: 4px;
}

.map-legend {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: white;
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  font-size: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  margin: 6px 0;
}

.legend-color {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  margin-right: 8px;
  border: 2px solid #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.checking-color {
  background: #f59e0b;
}

.pending-color {
  background: #3b82f6;
}

.rectifying-color {
  background: #8b5cf6;
}

.completed-color {
  background: #10b981;
}

.overdue-color {
  background: #ef4444;
}

.list-section {
  width: 520px;
  flex-shrink: 0;
}

.list-section :deep(.el-card) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.list-section :deep(.el-card__body) {
  flex: 1;
  overflow: auto;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-header span {
  font-size: 15px;
  font-weight: 500;
}

.overdue-text {
  color: #ef4444;
  font-weight: 600;
}

:deep(.overdue-row) {
  background-color: #fee2e2 !important;
}

:deep(.overdue-row:hover > td) {
  background-color: #fecaca !important;
}

:deep(.el-table__row) {
  cursor: pointer;
}

:deep(.el-table .el-table__row:hover > td) {
  background-color: #f3f4f6 !important;
}
</style>
