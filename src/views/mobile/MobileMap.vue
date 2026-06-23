<template>
  <div class="mobile-map">
    <div class="page-header">
      <el-icon @click="goBack"><ArrowLeft /></el-icon>
      <h3>地图总览</h3>
      <el-icon @click="toggleLayer"><Operation /></el-icon>
    </div>

    <div class="map-container">
      <div id="mobileLeafletMap" class="leaflet-map"></div>
    </div>

    <div class="map-stats">
      <div class="stat-item" v-for="stat in mapStats" :key="stat.label">
        <span class="stat-value" :style="{ color: stat.color }">{{ stat.value }}</span>
        <span class="stat-label">{{ stat.label }}</span>
      </div>
    </div>

    <div class="region-list">
      <h3 class="section-title">区域概览</h3>
      <div class="region-card" v-for="region in regionList" :key="region.name" @click="handleRegionDetail(region)">
        <div class="region-header">
          <div class="region-name">
            <div class="dot" :style="{ background: region.color }"></div>
            {{ region.name }}
          </div>
          <el-tag :type="region.alertLevel" size="small">{{ region.status }}</el-tag>
        </div>
        <div class="region-data">
          <div class="data-item">
            <span class="data-value">{{ region.planArea }}</span>
            <span class="data-label">计划(万亩)</span>
          </div>
          <div class="data-item">
            <span class="data-value">{{ region.actualArea }}</span>
            <span class="data-label">已落实(万亩)</span>
          </div>
          <div class="data-item">
            <span class="data-value">{{ region.progress }}%</span>
            <span class="data-label">完成率</span>
          </div>
        </div>
      </div>
    </div>

    <div class="layer-panel" v-if="showLayer">
      <div class="layer-mask" @click="showLayer = false"></div>
      <div class="layer-content">
        <h4>图层选择</h4>
        <el-checkbox-group v-model="selectedLayers">
          <el-checkbox label="planting">种植计划</el-checkbox>
          <el-checkbox label="security">安全监管</el-checkbox>
          <el-checkbox label="silage">青贮种植</el-checkbox>
          <el-checkbox label="pesticide">农药监管</el-checkbox>
          <el-checkbox label="disaster">灾情上报</el-checkbox>
        </el-checkbox-group>
        <el-button type="primary" size="small" @click="showLayer = false" style="margin-top: 12px; width: 100%">
          确定
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const router = useRouter()
const route = useRoute()

const entryType = computed(() => route.params.entry || 'wanzhengtong')
const showLayer = ref(false)
const selectedLayers = ref(['planting', 'security'])
let mapInstance = null

const mapRegions = ref([
  { name: '合肥', lng: 117.2272, lat: 31.8206, color: '#3b82f6' },
  { name: '芜湖', lng: 118.4331, lat: 31.3525, color: '#10b981' },
  { name: '蚌埠', lng: 117.3885, lat: 32.9168, color: '#f59e0b' },
  { name: '淮南', lng: 117.0186, lat: 32.6476, color: '#1a3a5c' },
  { name: '马鞍山', lng: 118.5079, lat: 31.6894, color: '#ef4444' },
  { name: '安庆', lng: 117.0637, lat: 30.5435, color: '#06b6d4' },
  { name: '黄山', lng: 118.3173, lat: 29.7092, color: '#84cc16' },
  { name: '阜阳', lng: 115.8142, lat: 32.8901, color: '#f97316' }
])

const mapStats = computed(() => {
  if (entryType.value === 'field-check') {
    return [
      { label: '待核查', value: 23, color: '#f59e0b' },
      { label: '核查中', value: 5, color: '#3b82f6' },
      { label: '已完成', value: 18, color: '#10b981' },
      { label: '异常', value: 2, color: '#ef4444' }
    ]
  } else if (entryType.value === 'wanqitong') {
    return [
      { label: '种植面积', value: '58.6', color: '#3b82f6' },
      { label: '青贮面积', value: '12.3', color: '#10b981' },
      { label: '农药批次', value: 156, color: '#f59e0b' },
      { label: '灾情数', value: 3, color: '#ef4444' }
    ]
  }
  return [
    { label: '计划任务', value: 48, color: '#3b82f6' },
    { label: '待核查', value: 23, color: '#f59e0b' },
    { label: '预警事件', value: 5, color: '#ef4444' },
    { label: '已完成', value: 32, color: '#10b981' }
  ]
})

const regionList = ref([
  { name: '合肥市', color: '#3b82f6', status: '正常', alertLevel: 'success', planArea: 35, actualArea: 34.2, progress: 97 },
  { name: '芜湖市', color: '#10b981', status: '正常', alertLevel: 'success', planArea: 28, actualArea: 27.5, progress: 98 },
  { name: '蚌埠市', color: '#f59e0b', status: '关注', alertLevel: 'warning', planArea: 42, actualArea: 40.8, progress: 97 },
  { name: '淮南市', color: '#1a3a5c', status: '正常', alertLevel: 'success', planArea: 31, actualArea: 30, progress: 96 },
  { name: '马鞍山市', color: '#ef4444', status: '灾情', alertLevel: 'danger', planArea: 22, actualArea: 21.5, progress: 97 }
])

const initMap = async () => {
  await nextTick()
  if (mapInstance) return
  mapInstance = L.map('mobileLeafletMap', {
    zoomControl: false,
    attributionControl: false
  }).setView([31.8257, 117.2264], 7)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18
  }).addTo(mapInstance)
  L.control.zoom({ position: 'bottomright' }).addTo(mapInstance)
  mapRegions.value.forEach(region => {
    L.circleMarker([region.lat, region.lng], {
      radius: 8,
      color: '#fff',
      weight: 2,
      fillColor: region.color,
      fillOpacity: 0.9
    }).addTo(mapInstance).bindPopup(`${region.name}区域概览`)
  })
  setTimeout(() => mapInstance.invalidateSize(), 200)
}

const goBack = () => router.back()
const toggleLayer = () => { showLayer.value = !showLayer.value }

const handleRegionDetail = (region) => {
  ElMessage.info(`${region.name}详情查看`)
}

onMounted(initMap)
</script>

<style scoped>
.mobile-map {
  min-height: 100vh;
  background: #f5f7fa;
}

.page-header {
  background: #1a3a5c;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
}

.page-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.page-header .el-icon {
  font-size: 22px;
  cursor: pointer;
}

.map-container {
  width: 100%;
  height: 320px;
  background: #dbeafe;
  position: relative;
}

.leaflet-map {
  width: 100%;
  height: 100%;
  z-index: 1;
}

.map-stats {
  display: flex;
  justify-content: space-around;
  padding: 16px 20px;
  background: #fff;
  margin-top: -1px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
}

.region-list {
  padding: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px;
}

.region-card {
  background: #fff;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.region-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.region-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.region-data {
  display: flex;
  justify-content: space-around;
}

.data-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.data-value {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
}

.data-label {
  font-size: 11px;
  color: #9ca3af;
}

.layer-panel {
  position: fixed;
  inset: 0;
  z-index: 100;
}

.layer-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
}

.layer-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 4px 4px 0 0;
  padding: 24px;
}

.layer-content h4 {
  margin: 0 0 16px;
  font-size: 16px;
  color: #1f2937;
}

.layer-content .el-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
