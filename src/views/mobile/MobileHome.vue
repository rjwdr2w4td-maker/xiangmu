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
      <el-button text @click="handleLogout" style="color: #fff">
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

    <div class="stats-row">
      <div class="stat-item" v-for="stat in statsData" :key="stat.label">
        <span class="stat-value" :style="{ color: stat.color }">{{ stat.value }}</span>
        <span class="stat-label">{{ stat.label }}</span>
      </div>
    </div>

    <div class="module-section">
      <h3 class="section-title">
        <el-icon><Grid /></el-icon>
        功能模块
      </h3>
      <div class="module-grid">
        <div class="module-item" v-for="mod in modules" :key="mod.id" @click="handleModule(mod)">
          <el-icon :size="28" :style="{ color: mod.color }"><component :is="mod.icon" /></el-icon>
          <span>{{ mod.name }}</span>
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
        <div class="task-item" v-for="task in pendingTasks" :key="task.id" @click="handleTaskClick(task)">
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
      <div
        class="nav-item"
        :class="{ active: activeNav === 'home' }"
        @click="handleNav('home')"
      >
        <el-icon><HomeFilled /></el-icon>
        <span>首页</span>
      </div>
      <div
        class="nav-item"
        :class="{ active: activeNav === 'task' }"
        @click="handleNav('task')"
      >
        <el-icon><Document /></el-icon>
        <span>任务</span>
      </div>
      <div
        class="nav-item"
        :class="{ active: activeNav === 'map' }"
        @click="handleNav('map')"
      >
        <el-icon><Location /></el-icon>
        <span>地图</span>
      </div>
      <div
        class="nav-item"
        :class="{ active: activeNav === 'profile' }"
        @click="handleNav('profile')"
      >
        <el-icon><User /></el-icon>
        <span>我的</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const entryType = computed(() => route.params.entry || 'wanzhengtong')
const activeNav = ref('home')

const entryTitle = computed(() => {
  const titles = {
    wanzhengtong: '皖政通 · 政务端',
    wanqitong: '皖企通 · 企业端',
    'field-check': '现场核查APP'
  }
  return titles[entryType.value] || '移动端'
})

const statsData = computed(() => {
  if (entryType.value === 'field-check') {
    return [
      { label: '待核查', value: 8, color: '#3b82f6' },
      { label: '核查中', value: 2, color: '#f59e0b' },
      { label: '已完成', value: 15, color: '#10b981' },
      { label: '异常', value: 1, color: '#ef4444' }
    ]
  } else if (entryType.value === 'wanqitong') {
    return [
      { label: '种植面积', value: '520亩', color: '#3b82f6' },
      { label: '青贮面积', value: '80亩', color: '#10b981' },
      { label: '待填报', value: 3, color: '#f59e0b' },
      { label: '预警', value: 2, color: '#ef4444' }
    ]
  }
  return [
    { label: '待审核', value: 12, color: '#3b82f6' },
    { label: '待核查', value: 5, color: '#f59e0b' },
    { label: '预警事件', value: 3, color: '#ef4444' },
    { label: '已完成', value: 32, color: '#10b981' }
  ]
})

const quickActions = computed(() => {
  if (entryType.value === 'field-check') {
    return [
      { id: 1, name: '现场拍照', icon: 'Camera', color: 'linear-gradient(135deg, #3b82f6, #60a5fa)', badge: null, action: 'photo' },
      { id: 2, name: 'GPS打卡', icon: 'Location', color: 'linear-gradient(135deg, #10b981, #34d399)', badge: null, action: 'gps' },
      { id: 3, name: '离线数据', icon: 'FolderOpened', color: 'linear-gradient(135deg, #f59e0b, #fbbf24)', badge: '3', action: 'offline' },
      { id: 4, name: '扫码核查', icon: 'Scan', color: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', badge: null, action: 'scan' }
    ]
  } else if (entryType.value === 'wanqitong') {
    return [
      { id: 1, name: '进度填报', icon: 'Edit', color: 'linear-gradient(135deg, #3b82f6, #60a5fa)', badge: null, action: 'report' },
      { id: 2, name: '青贮申报', icon: 'DocumentAdd', color: 'linear-gradient(135deg, #10b981, #34d399)', badge: null, action: 'silage' },
      { id: 3, name: '农药查询', icon: 'Search', color: 'linear-gradient(135deg, #f59e0b, #fbbf24)', badge: null, action: 'pesticide' },
      { id: 4, name: '政策公告', icon: 'Bell', color: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', badge: '5', action: 'notice' }
    ]
  }
  return [
    { id: 1, name: '待审核', icon: 'DocumentChecked', color: 'linear-gradient(135deg, #3b82f6, #60a5fa)', badge: '12', action: 'audit' },
    { id: 2, name: '事件处置', icon: 'Warning', color: 'linear-gradient(135deg, #ef4444, #f87171)', badge: '3', action: 'event' },
    { id: 3, name: '统计报表', icon: 'DataAnalysis', color: 'linear-gradient(135deg, #10b981, #34d399)', badge: null, action: 'stats' },
    { id: 4, name: '通知公告', icon: 'Bell', color: 'linear-gradient(135deg, #f59e0b, #fbbf24)', badge: '8', action: 'notice' }
  ]
})

const modules = computed(() => {
  if (entryType.value === 'field-check') {
    return [
      { id: 1, name: '核查任务', icon: 'Document', color: '#3b82f6', route: 'MobileTaskList' },
      { id: 2, name: '拍照记录', icon: 'Picture', color: '#10b981', route: 'MobileTaskList' },
      { id: 3, name: '轨迹记录', icon: 'MapLocation', color: '#f59e0b', route: 'MobileMap' },
      { id: 4, name: '数据同步', icon: 'Refresh', color: '#8b5cf6', route: null },
      { id: 5, name: '问题上报', icon: 'ChatDotSquare', color: '#ef4444', route: 'MobileIssueReport' },
      { id: 6, name: '帮助中心', icon: 'QuestionFilled', color: '#6b7280', route: null }
    ]
  } else if (entryType.value === 'wanqitong') {
    return [
      { id: 1, name: '种植计划', icon: 'Document', color: '#3b82f6', route: 'MobileTaskList' },
      { id: 2, name: '青贮管理', icon: 'Crop', color: '#10b981', route: 'MobileSilageApply' },
      { id: 3, name: '农药台账', icon: 'FirstAidKit', color: '#f59e0b', route: 'MobilePesticideQuery' },
      { id: 4, name: '补贴申请', icon: 'Wallet', color: '#8b5cf6', route: 'MobileSubsidy' },
      { id: 5, name: '合同管理', icon: 'Tickets', color: '#ef4444', route: null },
      { id: 6, name: '更多服务', icon: 'More', color: '#6b7280', route: null }
    ]
  }
  return [
    { id: 1, name: '计划审核', icon: 'DocumentChecked', color: '#3b82f6', route: 'MobileTaskList' },
    { id: 2, name: '安全监管', icon: 'Warning', color: '#ef4444', route: 'MobileTaskList' },
    { id: 3, name: '青贮审核', icon: 'Crop', color: '#10b981', route: 'MobileTaskList' },
    { id: 4, name: '农药监管', icon: 'FirstAidKit', color: '#f59e0b', route: null },
    { id: 5, name: '数据分析', icon: 'DataAnalysis', color: '#8b5cf6', route: 'MobileStats' },
    { id: 6, name: '更多功能', icon: 'More', color: '#6b7280', route: null }
  ]
})

const pendingTasks = computed(() => {
  if (entryType.value === 'field-check') {
    return [
      { id: 'FC001', type: '核查', title: '长丰县水稻种植现场核查', time: '2024-01-15 09:00', color: '#10b981', taskId: 'TASK002' },
      { id: 'FC002', type: '核查', title: '肥东县小麦种植面积核查', time: '2024-01-14 14:30', color: '#3b82f6', taskId: 'TASK001' },
      { id: 'FC003', type: '异常', title: '庐江县疑似抛荒地块核查', time: '2024-01-14 10:00', color: '#ef4444', taskId: 'TASK003' }
    ]
  } else if (entryType.value === 'wanqitong') {
    return [
      { id: 'WQ001', type: '填报', title: '2024年Q1种植进度填报', time: '2024-01-15 截止', color: '#3b82f6', taskId: 'TASK003' },
      { id: 'WQ002', type: '申报', title: '青贮玉米种植面积申报', time: '2024-01-14 截止', color: '#10b981', taskId: 'TASK004' },
      { id: 'WQ003', type: '预警', title: '农药使用超量提醒', time: '2024-01-13', color: '#ef4444', taskId: 'TASK005' }
    ]
  }
  return [
    { id: 1, type: '审核', title: '肥东县种植计划待审核', time: '2024-01-15 10:30', color: '#3b82f6', taskId: 'TASK001' },
    { id: 2, type: '核查', title: '长丰县现场核查任务', time: '2024-01-15 09:00', color: '#10b981', taskId: 'TASK002' },
    { id: 3, type: '处置', title: '耕地抛荒事件处理', time: '2024-01-14 16:20', color: '#ef4444', taskId: 'TASK003' }
  ]
})

const handleAction = (action) => {
  const routes = {
    audit: { name: 'MobileTaskList' },
    event: { name: 'MobileTaskList' },
    stats: { name: 'MobileStats' },
    notice: { name: 'MobileNotice' },
    report: { name: 'MobileProgressReport', params: { id: 'TASK003' } },
    silage: { name: 'MobileSilageApply' },
    pesticide: { name: 'MobilePesticideQuery' },
    photo: { name: 'MobilePhotoCheck', params: { id: 'TASK002' } },
    issue: { name: 'MobileIssueReport' }
  }
  const routeConfig = routes[action.action]
  if (routeConfig) {
    router.push({
      name: routeConfig.name,
      params: { entry: entryType.value, ...routeConfig.params }
    })
  } else {
    ElMessage.info(`${action.name}功能开发中`)
  }
}

const handleModule = (mod) => {
  const moduleRoutes = {
    MobileTaskList: 'MobileTaskList',
    MobileMap: 'MobileMap',
    MobileStats: 'MobileStats',
    MobileNotice: 'MobileNotice',
    MobilePesticideQuery: 'MobilePesticideQuery',
    MobileSubsidy: 'MobileSubsidy',
    MobileSilageApply: 'MobileSilageApply',
    MobileIssueReport: 'MobileIssueReport'
  }
  const routeName = moduleRoutes[mod.route]
  if (routeName) {
    router.push({ name: routeName, params: { entry: entryType.value } })
  } else {
    ElMessage.info(`${mod.name}功能开发中`)
  }
}

const handleTaskClick = (task) => {
  if (entryType.value === 'wanzhengtong') {
    router.push({ name: 'MobileAuditDetail', params: { entry: entryType.value, id: task.taskId || task.id } })
  } else if (entryType.value === 'wanqitong') {
    router.push({ name: 'MobileProgressReport', params: { entry: entryType.value, id: task.taskId || task.id } })
  } else {
    router.push({ name: 'MobilePhotoCheck', params: { entry: entryType.value, id: task.taskId || task.id } })
  }
}

const handleNav = (nav) => {
  activeNav.value = nav
  if (nav === 'home') return
  if (nav === 'task') {
    router.push({ name: 'MobileTaskList', params: { entry: entryType.value } })
  } else if (nav === 'map') {
    router.push({ name: 'MobileMap', params: { entry: entryType.value } })
  } else if (nav === 'profile') {
    router.push({ name: 'MobileProfile', params: { entry: entryType.value } })
  }
}

const handleLogout = () => {
  userStore.logout()
  router.push({ name: 'MobileLogin', params: { entry: entryType.value } })
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

.stats-row {
  display: flex;
  justify-content: space-around;
  background: #fff;
  padding: 16px 20px;
  margin-top: 12px;
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
  white-space: nowrap;
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
  padding-bottom: calc(10px + env(safe-area-inset-bottom));
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
  transition: color 0.2s;
}

.nav-item.active {
  color: #3b82f6;
}

.nav-item .el-icon {
  font-size: 22px;
}
</style>