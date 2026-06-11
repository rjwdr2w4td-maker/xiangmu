<template>
  <div class="mobile-home">
    <div class="home-header">
      <div class="user-info">
        <el-avatar :size="44">{{ userStore.userName?.charAt(0) || '用' }}</el-avatar>
        <div class="user-detail">
          <h2>{{ userStore.userName }}</h2>
          <p>{{ entryTitle }}</p>
        </div>
      </div>
      <el-button text @click="handleLogout">
        <el-icon><SwitchButton /></el-icon>
      </el-button>
    </div>

    <div class="quick-actions">
      <div class="action-card" v-for="action in quickActions" :key="action.id" @click="handleAction(action)">
        <div class="action-icon" :style="{ background: action.color }">
          <el-icon :size="24"><component :is="action.icon" /></el-icon>
        </div>
        <span>{{ action.name }}</span>
        <el-badge v-if="action.badge" :value="action.badge" class="action-badge" />
      </div>
    </div>

    <div class="module-section">
      <h3 class="section-title">
        <el-icon><Grid /></el-icon>
        功能模块
      </h3>
      <div class="module-grid">
        <div class="module-item" v-for="module in modules" :key="module.id" @click="handleModule(module)">
          <el-icon :size="28" :style="{ color: module.color }"><component :is="module.icon" /></el-icon>
          <span>{{ module.name }}</span>
        </div>
      </div>
    </div>

    <div class="task-section">
      <h3 class="section-title">
        <el-icon><Bell /></el-icon>
        待办事项
        <span class="task-count">{{ pendingTasks.length }}</span>
      </h3>
      <div class="task-list">
        <div class="task-item" v-for="task in pendingTasks" :key="task.id">
          <div class="task-type" :style="{ background: task.color }">{{ task.type }}</div>
          <div class="task-content">
            <h4>{{ task.title }}</h4>
            <p>{{ task.time }}</p>
          </div>
          <el-icon><ArrowRight /></el-icon>
        </div>
      </div>
    </div>

    <div class="bottom-nav">
      <div class="nav-item active">
        <el-icon><HomeFilled /></el-icon>
        <span>首页</span>
      </div>
      <div class="nav-item">
        <el-icon><Document /></el-icon>
        <span>任务</span>
      </div>
      <div class="nav-item">
        <el-icon><Location /></el-icon>
        <span>地图</span>
      </div>
      <div class="nav-item">
        <el-icon><User /></el-icon>
        <span>我的</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const entryType = router.currentRoute.value.params.entry || 'wanzhengtong'

const entryTitle = computed(() => {
  const titles = {
    wanzhengtong: '皖政通 · 政务端',
    wanqitong: '皖企通 · 企业端',
    'field-check': '现场核查APP'
  }
  return titles[entryType] || '移动端'
})

const quickActions = computed(() => {
  if (entryType === 'field-check') {
    return [
      { id: 1, name: '现场拍照', icon: 'Camera', color: 'linear-gradient(135deg, #3b82f6, #60a5fa)', badge: null },
      { id: 2, name: 'GPS打卡', icon: 'Location', color: 'linear-gradient(135deg, #10b981, #34d399)', badge: null },
      { id: 3, name: '离线数据', icon: 'FolderOpened', color: 'linear-gradient(135deg, #f59e0b, #fbbf24)', badge: '3' },
      { id: 4, name: '扫码核查', icon: 'Scan', color: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', badge: null }
    ]
  } else if (entryType === 'wanqitong') {
    return [
      { id: 1, name: '进度填报', icon: 'Edit', color: 'linear-gradient(135deg, #3b82f6, #60a5fa)', badge: null },
      { id: 2, name: '青贮申报', icon: 'DocumentAdd', color: 'linear-gradient(135deg, #10b981, #34d399)', badge: null },
      { id: 3, name: '农药查询', icon: 'Search', color: 'linear-gradient(135deg, #f59e0b, #fbbf24)', badge: null },
      { id: 4, name: '政策公告', icon: 'Bell', color: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', badge: '5' }
    ]
  } else {
    return [
      { id: 1, name: '待审核', icon: 'DocumentChecked', color: 'linear-gradient(135deg, #3b82f6, #60a5fa)', badge: '12' },
      { id: 2, name: '事件处置', icon: 'Warning', color: 'linear-gradient(135deg, #ef4444, #f87171)', badge: '3' },
      { id: 3, name: '统计报表', icon: 'DataAnalysis', color: 'linear-gradient(135deg, #10b981, #34d399)', badge: null },
      { id: 4, name: '通知公告', icon: 'Bell', color: 'linear-gradient(135deg, #f59e0b, #fbbf24)', badge: '8' }
    ]
  }
})

const modules = computed(() => {
  if (entryType === 'field-check') {
    return [
      { id: 1, name: '核查任务', icon: 'Document', color: '#3b82f6' },
      { id: 2, name: '拍照记录', icon: 'Picture', color: '#10b981' },
      { id: 3, name: '轨迹记录', icon: 'MapLocation', color: '#f59e0b' },
      { id: 4, name: '数据同步', icon: 'Refresh', color: '#8b5cf6' },
      { id: 5, name: '问题上报', icon: 'ChatDotSquare', color: '#ef4444' },
      { id: 6, name: '帮助中心', icon: 'QuestionFilled', color: '#6b7280' }
    ]
  } else if (entryType === 'wanqitong') {
    return [
      { id: 1, name: '种植计划', icon: 'Document', color: '#3b82f6' },
      { id: 2, name: '青贮管理', icon: 'Crop', color: '#10b981' },
      { id: 3, name: '农药台账', icon: 'FirstAidKit', color: '#f59e0b' },
      { id: 4, name: '补贴申请', icon: 'Wallet', color: '#8b5cf6' },
      { id: 5, name: '合同管理', icon: 'Tickets', color: '#ef4444' },
      { id: 6, name: '更多服务', icon: 'More', color: '#6b7280' }
    ]
  } else {
    return [
      { id: 1, name: '计划审核', icon: 'DocumentChecked', color: '#3b82f6' },
      { id: 2, name: '安全监管', icon: 'Warning', color: '#ef4444' },
      { id: 3, name: '青贮审核', icon: 'Crop', color: '#10b981' },
      { id: 4, name: '农药监管', icon: 'FirstAidKit', color: '#f59e0b' },
      { id: 5, name: '数据分析', icon: 'DataAnalysis', color: '#8b5cf6' },
      { id: 6, name: '更多功能', icon: 'More', color: '#6b7280' }
    ]
  }
})

const pendingTasks = ref([
  { id: 1, type: '审核', title: '肥东县种植计划待审核', time: '2024-01-15 10:30', color: '#3b82f6' },
  { id: 2, type: '核查', title: '长丰县现场核查任务', time: '2024-01-15 09:00', color: '#10b981' },
  { id: 3, type: '处置', title: '耕地抛荒事件处理', time: '2024-01-14 16:20', color: '#ef4444' }
])

const handleAction = (action) => {
  ElMessage.info(`功能开发中：${action.name}`)
}

const handleModule = (module) => {
  ElMessage.info(`模块开发中：${module.name}`)
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
  ElMessage.success('已退出登录')
}
</script>

<style scoped>
.mobile-home {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 70px;
}

.home-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-detail h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.user-detail p {
  margin: 4px 0 0;
  font-size: 13px;
  opacity: 0.9;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 20px;
  margin-top: -20px;
  background: #fff;
  border-radius: 20px 20px 0 0;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 8px;
  border-radius: 12px;
  background: #f9fafb;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.action-card:active {
  transform: scale(0.95);
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.action-card span {
  font-size: 12px;
  color: #374151;
}

.action-badge {
  position: absolute;
  top: 8px;
  right: 8px;
}

.module-section {
  background: #fff;
  padding: 20px;
  margin-top: 12px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px;
}

.task-count {
  margin-left: auto;
  background: #ef4444;
  color: #fff;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.module-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 12px;
  background: #f9fafb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.module-item:active {
  transform: scale(0.95);
  background: #f3f4f6;
}

.module-item span {
  font-size: 13px;
  color: #374151;
}

.task-section {
  background: #fff;
  padding: 20px;
  margin-top: 12px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: #f9fafb;
  border-radius: 12px;
  cursor: pointer;
}

.task-type {
  padding: 4px 10px;
  border-radius: 6px;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
}

.task-content {
  flex: 1;
}

.task-content h4 {
  margin: 0;
  font-size: 14px;
  color: #1f2937;
}

.task-content p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #9ca3af;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  border-top: 1px solid #e5e7eb;
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #9ca3af;
  font-size: 11px;
  cursor: pointer;
}

.nav-item.active {
  color: #3b82f6;
}

.nav-item .el-icon {
  font-size: 22px;
}
</style>
