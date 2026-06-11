<template>
  <router-view v-if="!isSystemPage" />

  <div v-else class="main-container">
    <div class="header">
      <div class="logo" @click="router.push('/dashboard')">
        <el-icon><TrendCharts /></el-icon>
        <span>安徽省粮食生产安全监测监管信息系统</span>
      </div>
      <div class="user-info">
        <el-button text class="portal-btn" @click="mobileDialogVisible = true">
          <el-icon><Iphone /></el-icon>
          APP入口
        </el-button>
        <el-dropdown>
          <span class="user-dropdown">
            <el-avatar :size="32">{{ userStore.userName?.charAt(0) || '用' }}</el-avatar>
            <span style="margin-left: 8px">{{ userStore.userName }}</span>
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="main-content">
      <div class="sidebar">
        <el-menu
          :default-active="activeMenu"
          router
          background-color="#1e3a5f"
          text-color="#fff"
          active-text-color="#409EFF"
        >
          <el-menu-item index="/dashboard">
            <el-icon><DataAnalysis /></el-icon>
            <span>系统首页</span>
          </el-menu-item>

          <el-sub-menu index="grain-plan">
            <template #title>
              <el-icon><Document /></el-icon>
              <span>粮食计划管理</span>
            </template>
            <el-menu-item index="/grain-plan/subject">种植主体管理</el-menu-item>
            <el-menu-item index="/grain-plan/task">种植计划制定</el-menu-item>
            <el-menu-item index="/grain-plan/audit">种植计划审核</el-menu-item>
            <el-menu-item index="/grain-plan/progress">进度填报</el-menu-item>
            <el-menu-item index="/grain-plan/map">粮食生产一张图</el-menu-item>
            <el-menu-item index="/grain-plan/disaster">防灾减灾</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="grain-security">
            <template #title>
              <el-icon><Warning /></el-icon>
              <span>粮食安全监管</span>
            </template>
            <el-menu-item index="/grain-security/discovery">事件智能发现</el-menu-item>
            <el-menu-item index="/grain-security/process">事件分析流转</el-menu-item>
            <el-menu-item index="/grain-security/handle">事件协同处置</el-menu-item>
            <el-menu-item index="/grain-security/map">粮食安全监测一张图</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="silage">
            <template #title>
              <el-icon><Crop /></el-icon>
              <span>青贮饲料管理</span>
            </template>
            <el-menu-item index="/silage/planting">种植备案</el-menu-item>
            <el-menu-item index="/silage/storage">收储申报</el-menu-item>
            <el-menu-item index="/silage/map">青贮饲料一张图</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="pesticide">
            <template #title>
              <el-icon><FirstAidKit /></el-icon>
              <span>农药数字监管</span>
            </template>
            <el-menu-item index="/pesticide/production">生产电子台账</el-menu-item>
            <el-menu-item index="/pesticide/business">经营电子台账</el-menu-item>
            <el-menu-item index="/pesticide/trace">追溯查询</el-menu-item>
            <el-menu-item index="/pesticide/map">农药数字监管一张图</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>
      <div class="content">
        <router-view />
      </div>
    </div>

    <el-dialog v-model="mobileDialogVisible" title="APP访问入口" width="800px">
      <el-row :gutter="24">
        <el-col :span="8" v-for="app in mobileApps" :key="app.name">
          <div class="app-entry-card">
            <div class="qr-wrapper">
              <img v-if="app.qrCode" :src="app.qrCode" :alt="app.name" class="qr-image" />
              <div v-else class="qr-placeholder">加载中...</div>
            </div>
            <div class="qr-link">{{ getPreviewUrl(app.entry) }}</div>
            <div class="app-info">
              <div class="app-icon" :style="{ background: app.color }">
                <el-icon><Iphone /></el-icon>
              </div>
              <h4>{{ app.name }}</h4>
              <p>{{ app.target }}</p>
              <el-tag size="small" :style="{ background: app.color, borderColor: 'transparent' }">
                {{ app.scene }}
              </el-tag>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-alert
        title="APP入口建议展示在门户首页显著位置；后台顶部保留快捷入口，方便PC业务办理时切换到手机扫码、现场核查、移动填报。"
        type="success"
        :closable="false"
        style="margin-top: 20px"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import QRCode from 'qrcode'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const activeMenu = computed(() => route.path)
const isMobilePage = computed(() => route.meta.isMobile === true || route.path.startsWith('/mobile'))
const isSystemPage = computed(() => route.meta.requiresAuth === true && !isMobilePage.value)
const mobileDialogVisible = ref(false)

watch(
  isMobilePage,
  (value) => {
    document.body.classList.toggle('mobile-page-body', value)
  },
  { immediate: true }
)

const getPreviewUrl = (entry) => {
  const url = new URL(`${import.meta.env.BASE_URL}mobile/${entry}`, window.location.origin)
  return url.toString()
}

const mobileApps = ref([
  { 
    name: '皖政通', 
    target: '管理人员移动审核与现场核查', 
    scene: '政务端', 
    entry: 'wanzhengtong',
    color: 'linear-gradient(135deg, #2563eb, #60a5fa)',
    qrCode: ''
  },
  { 
    name: '皖企通', 
    target: '主体填报、青贮申报、农药查询', 
    scene: '企业端', 
    entry: 'wanqitong',
    color: 'linear-gradient(135deg, #16a34a, #86efac)',
    qrCode: ''
  },
  { 
    name: '现场核查APP', 
    target: 'GPS定位、拍照水印、离线采集', 
    scene: '外业端', 
    entry: 'field-check',
    color: 'linear-gradient(135deg, #d97706, #fbbf24)',
    qrCode: ''
  }
])

onMounted(async () => {
  for (const app of mobileApps.value) {
    try {
      app.qrCode = await QRCode.toDataURL(getPreviewUrl(app.entry), {
        width: 180,
        margin: 2,
        color: {
          dark: '#1e3a8a',
          light: '#ffffff'
        }
      })
    } catch (err) {
      console.error('生成二维码失败:', err)
    }
  }
})

const handleOpenApp = (app) => {
  ElMessage.success(`${app.name}移动端入口已打开，可在门户页扫码或进入演示链路`)
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
  ElMessage.success('已退出登录')
}
</script>

<style scoped>
.main-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(circle at 8% 0%, rgba(56, 189, 248, 0.18), transparent 28%),
    radial-gradient(circle at 94% 8%, rgba(245, 158, 11, 0.14), transparent 30%),
    linear-gradient(135deg, #eef4ff 0%, #f8fbff 48%, #f7f2e8 100%);
  overflow: hidden;
}

.header {
  height: 72px;
  background: linear-gradient(110deg, #0f172a 0%, #1e3a8a 46%, #2563eb 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  box-shadow: 0 18px 44px rgba(30, 64, 175, 0.22);
  position: relative;
  z-index: 10;
}

.header::after {
  content: '';
  position: absolute;
  inset: auto 28px 0 28px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(249, 214, 137, 0.9), transparent);
}

.logo {
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 21px;
  font-weight: 900;
  letter-spacing: 0.04em;
  cursor: pointer;
}

.logo .el-icon {
  width: 42px;
  height: 42px;
  margin-right: 14px;
  border-radius: 14px;
  color: #fed7aa;
  background: rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  box-shadow: inset 0 0 0 1px rgba(249, 214, 137, 0.25);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 14px;
  color: #fff;
}

.portal-btn {
  color: #dffcf5;
  border-radius: 999px;
  padding: 9px 14px;
}

.portal-btn:hover {
  color: #f9d689;
  background: rgba(255, 255, 255, 0.1);
}

.app-entry-card {
  min-height: 280px;
  border: 1px solid rgba(59, 130, 246, 0.12);
  border-radius: 22px;
  padding: 20px;
  text-align: center;
  transition: all 0.25s;
  background: linear-gradient(180deg, #ffffff 0%, #eff6ff 100%);
  box-shadow: 0 14px 35px rgba(30, 64, 175, 0.1);
}

.app-entry-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 45px rgba(6, 78, 59, 0.18);
}

.qr-wrapper {
  width: 160px;
  height: 160px;
  margin: 0 auto 16px;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  border: 2px solid rgba(59, 130, 246, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.qr-placeholder {
  color: #94a3b8;
  font-size: 14px;
}

.qr-link {
  max-width: 100%;
  margin: -6px 0 14px;
  color: #64748b;
  font-size: 11px;
  line-height: 1.35;
  word-break: break-all;
}

.app-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.app-icon {
  width: 42px;
  height: 42px;
  margin-bottom: 10px;
  border-radius: 12px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.app-entry-card h4 {
  margin: 0 0 6px 0;
  color: #0f2f29;
  font-weight: 800;
  font-size: 16px;
}

.app-entry-card p {
  min-height: 38px;
  margin: 0 0 10px 0;
  color: #64756f;
  font-size: 12px;
  line-height: 1.5;
}

.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #fff;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
  padding: 18px;
  gap: 18px;
}

.sidebar {
  width: 248px;
  overflow-y: auto;
  border-radius: 26px;
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(30, 58, 138, 0.98)),
    radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.22), transparent 36%);
  box-shadow: 0 24px 60px rgba(30, 64, 175, 0.22);
  padding: 10px;
}

.sidebar :deep(.el-menu) {
  border-right: 0;
  background: transparent !important;
}

.sidebar :deep(.el-menu-item),
.sidebar :deep(.el-sub-menu__title) {
  height: 48px;
  margin: 6px 0;
  border-radius: 16px;
  color: rgba(236, 253, 245, 0.82) !important;
  font-weight: 700;
}

.sidebar :deep(.el-menu-item:hover),
.sidebar :deep(.el-sub-menu__title:hover) {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #fff !important;
}

.sidebar :deep(.el-menu-item.is-active) {
  background: linear-gradient(90deg, rgba(245, 158, 11, 0.95), rgba(56, 189, 248, 0.78)) !important;
  color: #0f172a !important;
  box-shadow: 0 12px 26px rgba(59, 130, 246, 0.24);
}

.content {
  flex: 1;
  padding: 22px;
  overflow-y: auto;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.64);
  backdrop-filter: blur(18px);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.74), 0 24px 70px rgba(30, 64, 175, 0.08);
}
</style>