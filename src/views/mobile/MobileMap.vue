<template>
  <div class="mobile-map">
    <div class="page-header">
      <el-icon @click="goBack"><ArrowLeft /></el-icon>
      <h3>地图总览</h3>
      <el-icon @click="toggleLayer"><Operation /></el-icon>
    </div>

    <div class="map-container">
      <div class="map-placeholder">
        <div class="map-bg">
          <div class="map-region" v-for="region in mapRegions" :key="region.name"
            :style="{ left: region.x + '%', top: region.y + '%' }"
            @click="handleRegionClick(region)"
          >
            <div class="region-dot" :style="{ background: region.color }"></div>
            <span class="region-label">{{ region.name }}</span>
          </div>
        </div>
      </div>
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
          <el-checkbox label="disaster">灾害预警</el-checkbox>
        </el-checkbox-group>
        <el-button type="primary" size="small" @click="showLayer = false" style="margin-top: 12px; width: 100%">
          确定
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()

const entryType = computed(() => route.params.entry || 'wanzhengtong')
const showLayer = ref(false)
const selectedLayers = ref(['planting', 'security'])

const mapRegions = ref([
  { name: '合肥', x: 50, y: 45, color: '#3b82f6' },
  { name: '芜湖', x: 62, y: 58, color: '#10b981' },
  { name: '蚌埠', x: 68, y: 35, color: '#f59e0b' },
  { name: '淮南', x: 42, y: 30, color: '#8b5cf6' },
  { name: '马鞍山', x: 60, y: 52, color: '#ef4444' },
  { name: '安庆', x: 30, y: 65, color: '#06b6d4' },
  { name: '黄山', x: 48, y: 75, color: '#84cc16' },
  { name: '阜阳', x: 25, y: 25, color: '#f97316' }
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
      { label: '预警数', value: 3, color: '#ef4444' }
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
  { name: '淮南市', color: '#8b5cf6', status: '正常', alertLevel: 'success', planArea: 31, actualArea: 30, progress: 96 },
  { name: '马鞍山市', color: '#ef4444', status: '预警', alertLevel: 'danger', planArea: 22, actualArea: 21.5, progress: 97 }
])

const goBack = () => router.back()
const toggleLayer = () => { showLayer.value = !showLayer.value }

const handleRegionClick = (region) => {
  ElMessage.info(`${region.name}区域详情`)
}

const handleRegionDetail = (region) => {
  ElMessage.info(`${region.name}详情查看`)
}
</script>

<style scoped>
.mobile-map {
  min-height: 100vh;
  background: #f5f7fa;
}

.page-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
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
  height: 280px;
  background: linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%);
  position: relative;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  position: relative;
}

.map-bg {
  width: 100%;
  height: 100%;
  position: relative;
  background:
    radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
}

.map-region {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transform: translate(-50%, -50%);
}

.region-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.region-label {
  font-size: 11px;
  color: #374151;
  font-weight: 500;
  white-space: nowrap;
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
  border-radius: 12px;
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
  border-radius: 16px 16px 0 0;
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
