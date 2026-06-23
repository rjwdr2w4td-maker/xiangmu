<template>
  <div class="mobile-stats">
    <div class="page-header">
      <el-icon @click="goBack"><ArrowLeft /></el-icon>
      <h3>统计报表</h3>
      <el-icon @click="handleExport"><Download /></el-icon>
    </div>

    <div class="time-filter">
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        size="small"
      />
    </div>

    <div class="stats-overview">
      <div class="overview-card" v-for="item in overviewData" :key="item.label">
        <div class="overview-value" :style="{ color: item.color }">{{ item.value }}</div>
        <div class="overview-label">{{ item.label }}</div>
        <div class="overview-trend" :class="item.trend > 0 ? 'up' : 'down'">
          <el-icon><component :is="item.trend > 0 ? 'Top' : 'Bottom'" /></el-icon>
          {{ Math.abs(item.trend) }}%
        </div>
      </div>
    </div>

    <div class="chart-section">
      <div class="section-header">
        <h3>种植面积统计</h3>
        <el-radio-group v-model="chartType" size="small">
          <el-radio-button label="bar">柱状图</el-radio-button>
          <el-radio-button label="pie">饼图</el-radio-button>
        </el-radio-group>
      </div>
      <div class="chart-container">
        <div class="chart-placeholder">
          <div class="bar-chart" v-if="chartType === 'bar'">
            <div class="bar-item" v-for="item in areaData" :key="item.name">
              <div class="bar-label">{{ item.name }}</div>
              <div class="bar-wrapper">
                <div class="bar-fill" :style="{ width: item.percent + '%', background: item.color }"></div>
              </div>
              <div class="bar-value">{{ item.value }}万亩</div>
            </div>
          </div>
          <div class="pie-chart" v-else>
            <div class="pie-visual">
              <div class="pie-center">
                <div class="pie-total">{{ totalArea }}</div>
                <div class="pie-unit">万亩</div>
              </div>
            </div>
            <div class="pie-legend">
              <div class="legend-item" v-for="item in areaData" :key="item.name">
                <div class="legend-dot" :style="{ background: item.color }"></div>
                <span>{{ item.name }}</span>
                <span class="legend-value">{{ item.value }}万亩</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="chart-section">
      <h3>区域排名</h3>
      <div class="ranking-list">
        <div class="ranking-item" v-for="(item, index) in rankingData" :key="item.name">
          <div class="ranking-order" :class="{ top: index < 3 }">{{ index + 1 }}</div>
          <div class="ranking-info">
            <span class="ranking-name">{{ item.name }}</span>
            <el-progress :percentage="item.percent" :stroke-width="6" :show-text="false" />
          </div>
          <div class="ranking-value">{{ item.value }}万亩</div>
        </div>
      </div>
    </div>

    <div class="chart-section">
      <h3>作物类型分布</h3>
      <div class="crop-grid">
        <div class="crop-item" v-for="crop in cropData" :key="crop.name">
          <div class="crop-icon" :style="{ background: crop.color }">
            <el-icon><component :is="crop.icon" /></el-icon>
          </div>
          <div class="crop-info">
            <span class="crop-name">{{ crop.name }}</span>
            <span class="crop-area">{{ crop.area }}万亩</span>
          </div>
          <div class="crop-trend" :class="crop.trend > 0 ? 'up' : 'down'">
            {{ crop.trend > 0 ? '+' : '' }}{{ crop.trend }}%
          </div>
        </div>
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

const chartType = ref('bar')
const dateRange = ref([])

const overviewData = ref([
  { label: '种植总面积', value: '425.6万亩', color: '#3b82f6', trend: 5.2 },
  { label: '完成任务数', value: '156', color: '#10b981', trend: 12.3 },
  { label: '待审核数', value: '23', color: '#f59e0b', trend: -8.5 },
  { label: '预警事件', value: '5', color: '#ef4444', trend: -15.2 }
])

const areaData = ref([
  { name: '小麦', value: 158, percent: 37, color: '#3b82f6' },
  { name: '水稻', value: 125, percent: 29, color: '#10b981' },
  { name: '玉米', value: 82, percent: 19, color: '#f59e0b' },
  { name: '大豆', value: 38, percent: 9, color: '#1a3a5c' },
  { name: '油菜', value: 22, percent: 6, color: '#ef4444' }
])

const totalArea = computed(() => areaData.value.reduce((sum, item) => sum + item.value, 0))

const rankingData = ref([
  { name: '合肥市', value: 35.2, percent: 100 },
  { name: '蚌埠市', value: 42.8, percent: 95 },
  { name: '阜阳市', value: 48.5, percent: 92 },
  { name: '滁州市', value: 38.6, percent: 88 },
  { name: '芜湖市', value: 28.3, percent: 80 },
  { name: '安庆市', value: 32.1, percent: 75 },
  { name: '宿州市', value: 35.8, percent: 72 },
  { name: '六安市', value: 30.2, percent: 68 }
])

const cropData = ref([
  { name: '小麦', area: 158, trend: 5.2, icon: 'Wheat', color: '#3b82f6' },
  { name: '水稻', area: 125, trend: 3.8, icon: 'Rice', color: '#10b981' },
  { name: '玉米', area: 82, trend: -2.1, icon: 'Corn', color: '#f59e0b' },
  { name: '大豆', area: 38, trend: 8.5, icon: 'Soybean', color: '#1a3a5c' },
  { name: '油菜', area: 22, trend: 1.2, icon: 'Flower', color: '#ef4444' }
])

const goBack = () => router.back()
const handleExport = () => ElMessage.success('报表导出功能开发中')
</script>

<style scoped>
.mobile-stats {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 20px;
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

.time-filter {
  padding: 12px 16px;
  background: #fff;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 16px;
}

.overview-card {
  background: #fff;
  border-radius: 4px;
  padding: 16px;
  position: relative;
}

.overview-value {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 4px;
}

.overview-label {
  font-size: 13px;
  color: #6b7280;
}

.overview-trend {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 2px;
}

.overview-trend.up {
  color: #10b981;
}

.overview-trend.down {
  color: #ef4444;
}

.chart-section {
  background: #fff;
  margin: 12px 16px;
  border-radius: 4px;
  padding: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-section h3 {
  margin: 0 0 16px;
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
}

.section-header h3 {
  margin-bottom: 0;
}

.chart-container {
  min-height: 200px;
}

.bar-chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bar-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bar-label {
  width: 50px;
  font-size: 13px;
  color: #374151;
}

.bar-wrapper {
  flex: 1;
  height: 12px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s;
}

.bar-value {
  width: 60px;
  font-size: 12px;
  color: #6b7280;
  text-align: right;
}

.pie-chart {
  display: flex;
  gap: 20px;
}

.pie-visual {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: conic-gradient(#3b82f6 0% 37%, #10b981 37% 66%, #f59e0b 66% 85%, #1a3a5c 85% 94%, #ef4444 94% 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pie-center {
  width: 80px;
  height: 80px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.pie-total {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
}

.pie-unit {
  font-size: 11px;
  color: #9ca3af;
}

.pie-legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

.legend-value {
  margin-left: auto;
  color: #6b7280;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ranking-order {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
}

.ranking-order.top {
  background: #3b82f6;
  color: #fff;
}

.ranking-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ranking-name {
  font-size: 13px;
  color: #374151;
}

.ranking-value {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.crop-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 10px;
}

.crop-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 4px;
}

.crop-icon {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.crop-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.crop-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.crop-area {
  font-size: 12px;
  color: #6b7280;
}

.crop-trend {
  font-size: 13px;
  font-weight: 500;
}

.crop-trend.up {
  color: #10b981;
}

.crop-trend.down {
  color: #ef4444;
}
</style>