<template>
  <div class="mobile-farming-advice">
    <div class="page-header">
      <el-icon @click="goBack"><ArrowLeft /></el-icon>
      <h3>农事建议</h3>
    </div>

    <div class="weather-card">
      <div>
        <div class="weather-title">肥东县 · 小麦拔节期</div>
        <div class="weather-desc">未来3天多云转小雨，田间湿度偏高</div>
      </div>
      <div class="weather-temp">18℃</div>
    </div>

    <div class="advice-tabs">
      <div
        v-for="tab in tabs"
        :key="tab.value"
        class="tab-item"
        :class="{ active: activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
      </div>
    </div>

    <div class="advice-list">
      <div v-for="item in filteredAdvices" :key="item.id" class="advice-card">
        <div class="advice-header">
          <div class="advice-icon" :style="{ background: item.color }">
            <el-icon><component :is="item.icon" /></el-icon>
          </div>
          <div class="advice-title">
            <h4>{{ item.title }}</h4>
            <p>{{ item.time }}</p>
          </div>
          <el-tag :type="item.levelType" size="small">{{ item.level }}</el-tag>
        </div>
        <div class="advice-content">{{ item.content }}</div>
        <div class="action-list">
          <div v-for="action in item.actions" :key="action" class="action-item">{{ action }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('all')

const tabs = [
  { label: '全部', value: 'all' },
  { label: '种植', value: 'planting' },
  { label: '防灾', value: 'disaster' },
  { label: '用药', value: 'pesticide' }
]

const advices = ref([
  {
    id: 1,
    type: 'planting',
    title: '小麦拔节期田管建议',
    time: '今日 09:20',
    level: '重点',
    levelType: 'warning',
    icon: 'Crop',
    color: '#10b981',
    content: '当前小麦进入拔节期，应加强肥水管理，结合苗情适量追施拔节肥。',
    actions: ['弱苗田块补施尿素', '保持沟渠通畅', '雨后及时查苗']
  },
  {
    id: 2,
    type: 'disaster',
    title: '降雨天气防渍涝提醒',
    time: '今日 08:00',
    level: '紧急',
    levelType: 'danger',
    icon: 'Warning',
    color: '#ef4444',
    content: '未来降雨可能造成低洼田块积水，请提前清沟理墒，降低渍害风险。',
    actions: ['清理田间排水沟', '低洼地块重点巡查', '积水田块及时排水']
  },
  {
    id: 3,
    type: 'pesticide',
    title: '赤霉病防治窗口期',
    time: '昨日 17:30',
    level: '提示',
    levelType: 'primary',
    icon: 'FirstAidKit',
    color: '#f59e0b',
    content: '小麦抽穗扬花期遇阴雨天气，需关注赤霉病防控，按推荐药剂规范使用。',
    actions: ['选择登记药剂', '避开大风时段施药', '做好用药台账记录']
  }
])

const filteredAdvices = computed(() => {
  if (activeTab.value === 'all') return advices.value
  return advices.value.filter(item => item.type === activeTab.value)
})

const goBack = () => router.back()
</script>

<style scoped>
.mobile-farming-advice {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 20px;
}

.page-header {
  background: #1a3a5c;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  color: #fff;
}

.page-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.page-header .el-icon {
  font-size: 22px;
}

.weather-card {
  margin: 16px;
  padding: 18px;
  border-radius: 4px;
  background: #dcfce7;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.weather-title {
  font-size: 16px;
  font-weight: 600;
  color: #14532d;
}

.weather-desc {
  margin-top: 6px;
  font-size: 13px;
  color: #166534;
}

.weather-temp {
  font-size: 30px;
  font-weight: 600;
  color: #15803d;
}

.advice-tabs {
  display: flex;
  gap: 10px;
  padding: 0 16px 12px;
  overflow-x: auto;
}

.tab-item {
  padding: 8px 16px;
  border-radius: 4px;
  background: #fff;
  color: #4b5563;
  font-size: 14px;
  white-space: nowrap;
}

.tab-item.active {
  background: #22c55e;
  color: #fff;
}

.advice-list {
  padding: 0 16px;
}

.advice-card {
  background: #fff;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 14px;
}

.advice-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.advice-icon {
  width: 42px;
  height: 42px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.advice-title {
  flex: 1;
}

.advice-title h4 {
  margin: 0;
  font-size: 15px;
  color: #111827;
}

.advice-title p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #9ca3af;
}

.advice-content {
  margin-top: 12px;
  color: #4b5563;
  font-size: 14px;
  line-height: 1.6;
}

.action-list {
  margin-top: 12px;
  display: grid;
  gap: 8px;
}

.action-item {
  padding: 8px 10px;
  border-radius: 4px;
  background: #f0fdf4;
  color: #166534;
  font-size: 13px;
}
</style>
