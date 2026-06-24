<template>
  <div class="mobile-weather-warning">
    <div class="page-header">
      <el-icon @click="goBack"><ArrowLeft /></el-icon>
      <h3>属地化气象预警</h3>
      <el-badge :value="activeCount" :max="99" />
    </div>

    <div class="city-selector">
      <el-select v-model="selectedCity" placeholder="请选择城市" size="large" style="width: 100%">
        <el-option
          v-for="city in cities"
          :key="city"
          :label="city"
          :value="city"
        />
      </el-select>
    </div>

    <div class="warning-list">
      <div
        v-for="warning in filteredWarnings"
        :key="warning.id"
        class="warning-card"
        :class="warning.level"
        @click="handleWarningClick(warning)"
      >
        <div class="level-stripe" :class="warning.level"></div>
        <div class="card-content">
          <div class="warning-header">
            <span class="warning-type">{{ warning.typeName }}</span>
            <span class="warning-level" :class="warning.level">{{ levelText(warning.level) }}</span>
          </div>
          <h4 class="warning-title">{{ warning.title }}</h4>
          <p class="warning-summary">{{ warning.content.slice(0, 60) }}...</p>
          <div class="warning-footer">
            <span class="warning-time">
              <el-icon><Clock /></el-icon>
              {{ formatTime(warning.issueTime) }}
            </span>
            <span class="warning-expire">有效期至 {{ formatTime(warning.expireTime) }}</span>
          </div>
        </div>
      </div>

      <el-empty v-if="filteredWarnings.length === 0" description="当前城市暂无气象预警" />
    </div>

    <el-dialog v-model="detailVisible" title="预警详情" width="100%" fullscreen>
      <div class="warning-detail" v-if="currentWarning">
        <div class="detail-header">
          <div class="level-badge" :class="currentWarning.level">
            {{ levelText(currentWarning.level) }}
          </div>
          <span class="detail-type">{{ currentWarning.typeName }}</span>
        </div>
        <h3 class="detail-title">{{ currentWarning.title }}</h3>
        <div class="detail-times">
          <div class="time-item">
            <el-icon><Clock /></el-icon>
            <span>发布时间：{{ currentWarning.issueTime }}</span>
          </div>
          <div class="time-item">
            <el-icon><Timer /></el-icon>
            <span>失效时间：{{ currentWarning.expireTime }}</span>
          </div>
        </div>
        <div class="detail-section">
          <h4>影响区域</h4>
          <p>{{ currentWarning.affectRegion?.join('、') }}</p>
        </div>
        <div class="detail-section">
          <h4>预警内容</h4>
          <p>{{ currentWarning.content }}</p>
        </div>
        <div class="detail-section suggestions">
          <h4>防范建议</h4>
          <div class="suggestion-list">
            <div
              v-for="(suggestion, index) in currentWarning.suggestions"
              :key="index"
              class="suggestion-item"
            >
              <span class="suggestion-index">{{ index + 1 }}</span>
              <span class="suggestion-text">{{ suggestion }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { weatherWarnings } from '@/data/disasters'

const router = useRouter()

const cities = [
  '合肥市', '芜湖市', '蚌埠市', '淮南市', '马鞍山市', '淮北市',
  '铜陵市', '安庆市', '黄山市', '滁州市', '阜阳市', '宿州市',
  '六安市', '亳州市', '池州市', '宣城市'
]

const selectedCity = ref('合肥市')
const detailVisible = ref(false)
const currentWarning = ref(null)

const activeCount = computed(() => {
  return weatherWarnings.filter(w => w.affectRegion?.includes(selectedCity.value)).length
})

const filteredWarnings = computed(() => {
  return weatherWarnings.filter(w => w.affectRegion?.includes(selectedCity.value))
})

const levelText = (level) => {
  const map = {
    red: '红色',
    orange: '橙色',
    yellow: '黄色',
    blue: '蓝色'
  }
  return map[level] || level
}

const formatTime = (time) => {
  if (!time) return ''
  return time.slice(5, 16).replace('-', '/')
}

const goBack = () => router.back()

const handleWarningClick = (warning) => {
  currentWarning.value = warning
  detailVisible.value = true
}
</script>

<style scoped>
.mobile-weather-warning {
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

.city-selector {
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}

.warning-list {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.warning-card {
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.warning-card:active {
  transform: scale(0.98);
}

.level-stripe {
  width: 4px;
  flex-shrink: 0;
}

.level-stripe.red {
  background: #ef4444;
}

.level-stripe.orange {
  background: #f97316;
}

.level-stripe.yellow {
  background: #eab308;
}

.level-stripe.blue {
  background: #3b82f6;
}

.card-content {
  flex: 1;
  padding: 14px 16px;
}

.warning-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.warning-type {
  font-size: 13px;
  color: #6b7280;
}

.warning-level {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
}

.warning-level.red {
  background: #fef2f2;
  color: #dc2626;
}

.warning-level.orange {
  background: #fff7ed;
  color: #ea580c;
}

.warning-level.yellow {
  background: #fefce8;
  color: #ca8a04;
}

.warning-level.blue {
  background: #eff6ff;
  color: #2563eb;
}

.warning-title {
  margin: 0 0 8px;
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.4;
}

.warning-summary {
  margin: 0 0 10px;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.warning-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #9ca3af;
}

.warning-time {
  display: flex;
  align-items: center;
  gap: 4px;
}

.warning-detail {
  padding: 16px;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.level-badge {
  font-size: 14px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 12px;
}

.level-badge.red {
  background: #ef4444;
  color: #fff;
}

.level-badge.orange {
  background: #f97316;
  color: #fff;
}

.level-badge.yellow {
  background: #eab308;
  color: #fff;
}

.level-badge.blue {
  background: #3b82f6;
  color: #fff;
}

.detail-type {
  font-size: 14px;
  color: #6b7280;
}

.detail-title {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.4;
}

.detail-times {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 4px;
}

.time-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6b7280;
}

.detail-section {
  margin-bottom: 20px;
}

.detail-section h4 {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.detail-section p {
  margin: 0;
  font-size: 14px;
  color: #4b5563;
  line-height: 1.8;
  background: #f9fafb;
  padding: 12px;
  border-radius: 4px;
}

.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  background: #f0fdf4;
  border-radius: 4px;
  border-left: 3px solid #22c55e;
}

.suggestion-index {
  width: 22px;
  height: 22px;
  background: #22c55e;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.suggestion-text {
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
  flex: 1;
}
</style>