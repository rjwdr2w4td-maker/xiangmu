<template>
  <div class="mobile-profile">
    <div class="profile-header">
      <div class="user-card">
        <el-avatar :size="64">{{ userStore.userName?.charAt(0) || '用' }}</el-avatar>
        <div class="user-info">
          <h2>{{ userStore.userName }}</h2>
          <p>{{ entryTitle }}</p>
          <el-tag type="success" size="small">{{ userLevelText }}</el-tag>
        </div>
      </div>
    </div>

    <div class="stats-card">
      <div class="stat-item" v-for="stat in userStats" :key="stat.label">
        <span class="stat-value">{{ stat.value }}</span>
        <span class="stat-label">{{ stat.label }}</span>
      </div>
    </div>

    <div class="menu-section">
      <div class="menu-item" v-for="menu in menuList" :key="menu.id" @click="handleMenu(menu)">
        <div class="menu-icon" :style="{ background: menu.color }">
          <el-icon :size="20"><component :is="menu.icon" /></el-icon>
        </div>
        <span class="menu-text">{{ menu.name }}</span>
        <el-badge v-if="menu.badge" :value="menu.badge" :max="99" />
        <el-icon class="menu-arrow"><ArrowRight /></el-icon>
      </div>
    </div>

    <div class="settings-section">
      <h3 class="section-title">系统设置</h3>
      <div class="setting-item">
        <span class="setting-label">消息通知</span>
        <el-switch v-model="settings.notification" />
      </div>
      <div class="setting-item">
        <span class="setting-label">离线模式</span>
        <el-switch v-model="settings.offlineMode" />
      </div>
      <div class="setting-item">
        <span class="setting-label">GPS定位</span>
        <el-switch v-model="settings.gpsEnabled" />
      </div>
      <div class="setting-item" v-if="entryType === 'field-check'">
        <span class="setting-label">自动同步</span>
        <el-switch v-model="settings.autoSync" />
      </div>
    </div>

    <div class="logout-section">
      <el-button type="danger" size="large" style="width: 100%" @click="handleLogout">
        退出登录
      </el-button>
    </div>

    <div class="version-info">
      <p>版本号：v1.0.0</p>
      <p>© 2024 安徽省农业农村厅</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const entryType = computed(() => route.params.entry || 'wanzhengtong')

const entryTitle = computed(() => {
  const titles = {
    wanzhengtong: '皖政通 · 政务端',
    wanqitong: '皖企通 · 企业端',
    'field-check': '现场核查APP'
  }
  return titles[entryType.value] || '移动端'
})

const userLevelText = computed(() => {
  const map = {
    province: '省级用户',
    city: '市级用户',
    county: '县级用户',
    town: '乡镇用户',
    farmer: '种植主体'
  }
  return map[userStore.userLevel] || '用户'
})

const userStats = computed(() => {
  if (entryType.value === 'field-check') {
    return [
      { label: '核查任务', value: 45 },
      { label: '拍照记录', value: 128 },
      { label: '异常上报', value: 3 },
      { label: '工作天数', value: 32 }
    ]
  } else if (entryType.value === 'wanqitong') {
    return [
      { label: '种植面积', value: '520亩' },
      { label: '青贮面积', value: '80亩' },
      { label: '上报次数', value: 26 },
      { label: '补贴金额', value: '¥2.3万' }
    ]
  }
  return [
    { label: '审核任务', value: 156 },
    { label: '处置事件', value: 23 },
    { label: '下发指令', value: 45 },
    { label: '工作天数', value: 180 }
  ]
})

const menuList = computed(() => {
  const commonMenus = [
    { id: 1, name: '个人信息', icon: 'User', color: '#3b82f6', badge: null, action: 'profile' },
    { id: 2, name: '修改密码', icon: 'Lock', color: '#f59e0b', badge: null, action: 'password' },
    { id: 3, name: '通知消息', icon: 'Bell', color: '#8b5cf6', badge: 8, action: 'notifications' },
    { id: 4, name: '操作记录', icon: 'Clock', color: '#10b981', badge: null, action: 'history' }
  ]
  
  if (entryType.value === 'field-check') {
    return [
      ...commonMenus,
      { id: 5, name: '离线数据', icon: 'FolderOpened', color: '#ef4444', badge: 3, action: 'offline' },
      { id: 6, name: '数据同步', icon: 'Refresh', color: '#06b6d4', badge: null, action: 'sync' },
      { id: 7, name: '帮助中心', icon: 'QuestionFilled', color: '#6b7280', badge: null, action: 'help' }
    ]
  } else if (entryType.value === 'wanqitong') {
    return [
      ...commonMenus,
      { id: 5, name: '补贴申请', icon: 'Wallet', color: '#ef4444', badge: 2, action: 'subsidy' },
      { id: 6, name: '合同管理', icon: 'Tickets', color: '#06b6d4', badge: null, action: 'contract' },
      { id: 7, name: '政策公告', icon: 'Document', color: '#f97316', badge: 5, action: 'policy' }
    ]
  }
  return [
    ...commonMenus,
    { id: 5, name: '统计报表', icon: 'DataAnalysis', color: '#ef4444', badge: null, action: 'report' },
    { id: 6, name: '预警配置', icon: 'Warning', color: '#06b6d4', badge: null, action: 'warning' },
    { id: 7, name: '系统日志', icon: 'Tickets', color: '#f97316', badge: null, action: 'log' }
  ]
})

const settings = reactive({
  notification: true,
  offlineMode: false,
  gpsEnabled: true,
  autoSync: true
})

const handleMenu = (menu) => {
  if (menu.action === 'profile') {
    ElMessage.info('个人信息页面开发中')
  } else if (menu.action === 'password') {
    ElMessage.info('修改密码功能开发中')
  } else if (menu.action === 'notifications') {
    ElMessage.info('通知消息列表开发中')
  } else if (menu.action === 'history') {
    ElMessage.info('操作记录开发中')
  } else {
    ElMessage.info(`${menu.name}功能开发中`)
  }
}

const handleLogout = () => {
  ElMessageBox.confirm('确认退出登录吗？', '退出确认', {
    confirmButtonText: '确认退出',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore.logout()
    router.push({ name: 'MobileLogin', params: { entry: entryType.value } })
    ElMessage.success('已退出登录')
  }).catch(() => {})
}
</script>

<style scoped>
.mobile-profile {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 20px;
}

.profile-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  padding: 30px 20px;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-card .el-avatar {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 24px;
}

.user-info h2 {
  margin: 0;
  font-size: 20px;
  color: #fff;
  font-weight: 600;
}

.user-info p {
  margin: 6px 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
}

.stats-card {
  display: flex;
  justify-content: space-around;
  background: #fff;
  padding: 20px;
  margin: -20px 16px 16px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
}

.menu-section {
  background: #fff;
  margin: 16px;
  border-radius: 12px;
  padding: 8px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.menu-item:active {
  background: #f3f4f6;
}

.menu-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.menu-text {
  flex: 1;
  margin-left: 12px;
  font-size: 15px;
  color: #1f2937;
}

.menu-arrow {
  color: #9ca3af;
}

.settings-section {
  background: #fff;
  margin: 16px;
  border-radius: 12px;
  padding: 16px;
}

.section-title {
  margin: 0 0 16px;
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  font-size: 14px;
  color: #374151;
}

.logout-section {
  margin: 20px 16px;
}

.version-info {
  text-align: center;
  padding: 20px;
  color: #9ca3af;
  font-size: 12px;
}

.version-info p {
  margin: 4px 0;
}
</style>