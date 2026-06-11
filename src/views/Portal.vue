<template>
  <div class="portal-container">
    <div class="portal-header">
      <div class="header-content">
        <div class="logo">
          <el-icon class="logo-icon"><TrendCharts /></el-icon>
          <div class="logo-text">
            <h1>安徽省粮食生产安全监测监管信息系统</h1>
            <p>Anhui Province Grain Production Safety Monitoring and Supervision System</p>
          </div>
        </div>
        <div class="header-actions">
          <el-button type="primary" size="large" @click="goLogin">
            <el-icon><User /></el-icon>
            登录系统
          </el-button>
        </div>
      </div>
    </div>

    <div class="portal-banner">
      <el-carousel height="400px" :interval="5000">
        <el-carousel-item v-for="item in banners" :key="item.id">
          <div class="banner-content" :style="{ background: item.bgColor }">
            <div class="banner-text">
              <h2>{{ item.title }}</h2>
              <p>{{ item.description }}</p>
              <el-button type="primary" size="large" class="banner-btn" @click="goLogin">
                立即登录
                <el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <div class="portal-systems">
      <div class="section-title">
        <h2>业务系统入口</h2>
        <p>选择业务系统后，将进入独立登录页完成统一身份认证</p>
      </div>

      <el-row :gutter="30">
        <el-col :xs="24" :sm="12" :md="6" v-for="system in systems" :key="system.id">
          <el-card class="system-card" shadow="hover" @click="goSystem(system)">
            <div class="system-icon" :style="{ background: system.color }">
              <el-icon :size="40"><component :is="system.icon" /></el-icon>
            </div>
            <h3>{{ system.name }}</h3>
            <p class="system-desc">{{ system.description }}</p>
            <div class="system-stats">
              <el-tag size="small" type="info">{{ system.moduleCount }}个功能模块</el-tag>
            </div>
            <el-button type="primary" class="system-btn" @click.stop="goSystem(system)">
              进入系统
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="portal-mobile">
      <div class="section-title">
        <h2>APP访问入口</h2>
        <p>门户页是移动端访问入口的主要展示位置，同时后台顶部和登录页提供快捷入口</p>
      </div>

      <el-row :gutter="40" justify="center">
        <el-col :xs="24" :sm="12" :md="8" v-for="app in mobileApps" :key="app.id">
          <el-card class="mobile-card" shadow="hover">
            <div class="mobile-header">
              <el-icon :size="30" :color="app.color"><Iphone /></el-icon>
              <h3>{{ app.name }}</h3>
            </div>
            <p class="mobile-desc">{{ app.description }}</p>
            <div class="qr-code">
              <div class="qr-placeholder" @click="openMobileApp(app)">
                <div class="qr-grid">
                  <span v-for="i in 49" :key="i" :class="{ active: app.pattern.includes(i) }"></span>
                </div>
                <p>{{ app.name }}扫码入口</p>
              </div>
            </div>
            <div class="mobile-features">
              <el-tag v-for="feature in app.features" :key="feature" size="small" style="margin: 3px">
                {{ feature }}
              </el-tag>
            </div>
            <div class="mobile-actions">
              <el-button type="primary" @click="openMobileApp(app)">打开移动端演示</el-button>
              <el-button @click="handleDownloadApp(app)">下载APP</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-dialog v-model="mobileDialogVisible" :title="currentMobileApp.name + '访问入口'" width="760px">
      <el-row :gutter="24">
        <el-col :span="9">
          <div class="phone-preview">
            <div class="phone-top"></div>
            <div class="phone-screen">
              <h4>{{ currentMobileApp.name }}</h4>
              <p>{{ currentMobileApp.description }}</p>
              <div class="phone-card" v-for="feature in currentMobileApp.features" :key="feature">
                <el-icon><Check /></el-icon>
                <span>{{ feature }}</span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="15">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="入口位置">门户首页APP访问入口、登录页移动端入口、后台顶部快捷入口</el-descriptions-item>
            <el-descriptions-item label="适用对象">{{ currentMobileApp.target }}</el-descriptions-item>
            <el-descriptions-item label="登录方式">统一身份认证后按角色进入移动端功能</el-descriptions-item>
            <el-descriptions-item label="演示链路">扫码/打开APP → 选择角色 → 接收任务 → 填报/核查/扫码 → 同步PC端</el-descriptions-item>
          </el-descriptions>
          <el-timeline style="margin-top: 20px">
            <el-timeline-item v-for="step in currentMobileApp.steps" :key="step" type="primary">
              {{ step }}
            </el-timeline-item>
          </el-timeline>
        </el-col>
      </el-row>
      <template #footer>
        <el-button @click="mobileDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleOpenMobileDemo">进入模拟操作</el-button>
      </template>
    </el-dialog>

    <div class="portal-features">
      <div class="section-title">
        <h2>系统特色</h2>
        <p>基于新一代信息技术的智慧农业监管平台</p>
      </div>

      <el-row :gutter="30">
        <el-col :xs="24" :sm="12" :md="6" v-for="feature in features" :key="feature.id">
          <div class="feature-item">
            <div class="feature-icon">
              <el-icon :size="50"><component :is="feature.icon" /></el-icon>
            </div>
            <h4>{{ feature.title }}</h4>
            <p>{{ feature.description }}</p>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="portal-footer">
      <div class="footer-content">
        <div class="footer-info">
          <p>主办单位：安徽省农业农村厅</p>
          <p>技术支持：安徽省数据资源管理局</p>
          <p>版权所有 © 2026 安徽省粮食生产安全监测监管信息系统</p>
        </div>
        <div class="footer-links">
          <el-link type="info" :underline="false" @click="handleFooterLink('关于我们')">关于我们</el-link>
          <el-divider direction="vertical" />
          <el-link type="info" :underline="false" @click="handleFooterLink('使用帮助')">使用帮助</el-link>
          <el-divider direction="vertical" />
          <el-link type="info" :underline="false" @click="handleFooterLink('联系方式')">联系方式</el-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

const banners = [
  {
    id: 1,
    title: '智慧监管 保障粮食安全',
    description: '基于遥感、大数据、AI技术的粮食生产安全监测监管平台',
    bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 2,
    title: '到户到田 精准管理',
    description: '实现种植计划到户、种植地块到田的精细化管理',
    bgColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 3,
    title: '移动办公 随时随地',
    description: '皖政通、皖企通移动端应用，支持离线操作',
    bgColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  }
]

const systems = [
  {
    id: 'grain-plan',
    name: '粮食计划管理系统',
    description: '种植计划制定、进度调度、统计分析',
    icon: 'Document',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    moduleCount: 7,
    path: '/grain-plan/subject'
  },
  {
    id: 'grain-security',
    name: '粮食安全监管系统',
    description: '事件智能发现、核查处置、风险预警',
    icon: 'Warning',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    moduleCount: 5,
    path: '/grain-security/discovery'
  },
  {
    id: 'silage',
    name: '青贮饲料管理系统',
    description: '种植备案、收储申报、生产管理',
    icon: 'Crop',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    moduleCount: 4,
    path: '/silage/planting'
  },
  {
    id: 'pesticide',
    name: '农药数字监管系统',
    description: '生产台账、经营台账、追溯查询',
    icon: 'FirstAidKit',
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    moduleCount: 6,
    path: '/pesticide/production'
  }
]

const wanzhengFeatures = ['进度填报审核', '灾情速报处置', '现场核查', '随手拍上报', '任务接收下派']
const wanqiFeatures = ['种植计划填报', '灾情上报', '农事建议', '农药查询', '青贮申报']

const features = [
  { id: 1, title: 'AI智能识别', description: '基于遥感影像的疑似撂荒、种植未落实智能识别', icon: 'Cpu' },
  { id: 2, title: '到户到田', description: '种植计划到户、种植地块到田的精细化管理', icon: 'Location' },
  { id: 3, title: '移动办公', description: '皖政通、皖企通移动端，支持离线操作', icon: 'Iphone' },
  { id: 4, title: '全程追溯', description: '农药生产、经营、使用全流程追溯管理', icon: 'Connection' },
  { id: 5, title: '一张图展示', description: 'GIS地图可视化，数据钻取分析', icon: 'Map' },
  { id: 6, title: '智能预警', description: '气象预警、长势预警、风险预警自动推送', icon: 'Bell' },
  { id: 7, title: '数据共享', description: '与省一体化平台数据互联互通', icon: 'Share' },
  { id: 8, title: '扫码录入', description: '农药二维码扫描，快速录入信息', icon: 'Camera' }
]

const qrPatternGov = [1,2,3,4,5,6,7,8,14,15,17,19,21,22,24,26,29,31,32,35,37,39,41,43,44,45,46,47,48,49]
const qrPatternEnt = [1,2,3,4,5,6,7,9,11,13,15,16,18,20,23,25,27,28,30,33,34,36,38,40,43,44,45,46,47,48,49]
const qrPatternField = [1,2,3,4,5,6,7,10,12,14,15,16,19,21,22,25,27,29,31,33,35,36,38,40,42,43,44,45,46,47,48,49]

const mobileApps = [
  {
    id: 'wanzhengtong',
    name: '皖政通',
    color: '#409EFF',
    description: '面向省、市、县、乡各级管理人员',
    target: '农业农村部门管理人员、基层监管人员、任务审核人员',
    features: wanzhengFeatures,
    pattern: qrPatternGov,
    steps: ['接收上级下发任务', '查看待审核填报和预警事件', '现场核查并上传照片视频', '审核处置结果并同步PC端']
  },
  {
    id: 'wanqitong',
    name: '皖企通',
    color: '#67C23A',
    description: '面向种植户、农业企业等经营主体',
    target: '种植主体、家庭农场、合作社、农资经营主体、青贮收储企业',
    features: wanqiFeatures,
    pattern: qrPatternEnt,
    steps: ['完成主体身份认证', '填报种植计划和青贮申报', '上报灾情与整改材料', '查询农药追溯和农事建议']
  },
  {
    id: 'fieldwork',
    name: '现场核查APP',
    color: '#E6A23C',
    description: '面向外业核查、随手拍、离线采集场景',
    target: '外业核查人员、乡镇网格员、第三方核查队伍',
    features: ['离线采集', 'GPS定位', '照片水印', '视频取证', '一键同步'],
    pattern: qrPatternField,
    steps: ['领取现场核查任务', '离线采集定位和影像', '录入核查结论', '联网后自动同步到事件处置流程']
  }
]

const mobileDialogVisible = ref(false)
const currentMobileApp = ref(mobileApps[0])

const goLogin = () => {
  router.push('/login')
}

const goSystem = (system) => {
  const token = localStorage.getItem('token')
  if (token) {
    ElMessage.success(`正在进入${system.name}`)
    router.push(system.path)
  } else {
    ElMessage.info(`请先登录后进入${system.name}`)
    router.push({ path: '/login', query: { redirect: system.path } })
  }
}

const handleFooterLink = (type) => {
  const content = {
    关于我们: '安徽省粮食生产安全监测监管信息系统提供粮食计划、安全监管、青贮饲料和农药数字监管能力。',
    使用帮助: '可通过业务系统入口进入对应模块，登录后按左侧菜单完成查询、填报、审核和处置。',
    联系方式: '联系电话：0551-12345678，服务时间：工作日 9:00-17:00。'
  }
  ElMessage.info(content[type])
}

const openMobileApp = (app) => {
  currentMobileApp.value = app
  mobileDialogVisible.value = true
}

const handleDownloadApp = (app) => {
  ElMessage.success(`${app.name}下载二维码已展示，请使用手机扫码安装`)
}

const handleOpenMobileDemo = () => {
  ElMessage.success(`${currentMobileApp.value.name}模拟操作已启动，可按演示链路完成移动端闭环`)
  mobileDialogVisible.value = false
}
</script>

<style scoped>
.portal-container {
  min-height: 100vh;
  background:
    radial-gradient(circle at 12% 0%, rgba(56, 189, 248, 0.2), transparent 24%),
    radial-gradient(circle at 88% 12%, rgba(245, 158, 11, 0.14), transparent 30%),
    linear-gradient(180deg, #07111f 0%, #172554 24%, #eef4ff 24%, #f8fbff 100%);
  color: #172554;
}

.portal-header {
  background: rgba(15, 23, 42, 0.72);
  padding: 22px 0;
  box-shadow: none;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(191, 219, 254, 0.24);
  position: sticky;
  top: 0;
  z-index: 30;
}

.header-content {
  max-width: 1480px;
  margin: 0 auto;
  padding: 0 46px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  color: #fff;
}

.logo-icon {
  width: 56px;
  height: 56px;
  margin-right: 18px;
  padding: 12px;
  border-radius: 18px;
  color: #fed7aa;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.78), rgba(245, 158, 11, 0.2));
  box-shadow: inset 0 0 0 1px rgba(249, 214, 137, 0.22), 0 14px 36px rgba(0, 0, 0, 0.25);
}

.logo-text h1 {
  font-size: 25px;
  margin: 0;
  letter-spacing: 0.06em;
  font-weight: 900;
}

.logo-text p {
  font-size: 11px;
  margin: 6px 0 0 0;
  color: rgba(236, 253, 245, 0.66);
  letter-spacing: 0.08em;
}

.portal-banner {
  max-width: 1480px;
  margin: 0 auto;
  padding: 34px 46px 0;
}

.portal-banner :deep(.el-carousel) {
  border-radius: 34px;
  overflow: hidden;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.28);
}

.banner-content {
  height: 430px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #fff;
  padding: 0 80px;
  position: relative;
  overflow: hidden;
}

.banner-content::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(15, 23, 42, 0.82), rgba(30, 64, 175, 0.36)),
    url('https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=realistic%20wide%20aerial%20Anhui%20farmland%20rice%20fields%20remote%20sensing%20digital%20map%20dashboard%20overlay%2C%20green%20and%20gold%20government%20technology%2C%20cinematic%2C%20high%20detail%2C%20no%20text&image_size=landscape_16_9') center/cover;
  opacity: 0.92;
}

.banner-content::after {
  content: '';
  position: absolute;
  width: 420px;
  height: 420px;
  right: 80px;
  top: 40px;
  border-radius: 50%;
  border: 1px solid rgba(249, 214, 137, 0.26);
  box-shadow: inset 0 0 60px rgba(56, 189, 248, 0.18), 0 0 80px rgba(59, 130, 246, 0.16);
}

.banner-text {
  text-align: left;
  position: relative;
  z-index: 2;
  max-width: 620px;
}

.banner-text h2 {
  font-size: 56px;
  line-height: 1.08;
  margin: 0 0 22px 0;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-shadow: 0 12px 28px rgba(0, 0, 0, 0.28);
}

.banner-text p {
  font-size: 20px;
  margin: 0 0 34px 0;
  color: rgba(236, 253, 245, 0.86);
  line-height: 1.8;
}

.banner-btn {
  height: 48px;
  padding: 0 28px;
  box-shadow: 0 18px 36px rgba(29, 78, 216, 0.32);
}

.section-title {
  text-align: center;
  margin-bottom: 42px;
}

.section-title h2 {
  font-size: 36px;
  color: #172554;
  margin: 0 0 12px 0;
  font-weight: 900;
  letter-spacing: 0.04em;
}

.section-title h2::after {
  content: '';
  display: block;
  width: 88px;
  height: 4px;
  margin: 16px auto 0;
  border-radius: 999px;
  background: linear-gradient(90deg, #f59e0b, #38bdf8);
}

.section-title p {
  font-size: 16px;
  color: #64748b;
  margin: 0;
}

.portal-systems {
  max-width: 1480px;
  margin: 0 auto;
  padding: 74px 46px 58px;
}

.system-card {
  text-align: left;
  padding: 30px 26px;
  cursor: pointer;
  transition: all 0.35s;
  margin-bottom: 24px;
  min-height: 300px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(59, 130, 246, 0.12);
  box-shadow: 0 20px 50px rgba(30, 64, 175, 0.1);
  backdrop-filter: blur(18px);
}

.system-card:hover {
  transform: translateY(-12px) scale(1.015);
  box-shadow: 0 30px 70px rgba(30, 64, 175, 0.16);
}

.system-icon {
  width: 78px;
  height: 78px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0 24px;
  color: #fff;
  box-shadow: 0 18px 34px rgba(30, 64, 175, 0.18);
}

.system-card h3 {
  font-size: 22px;
  color: #172554;
  margin: 0 0 12px 0;
  font-weight: 900;
}

.system-desc {
  color: #64748b;
  font-size: 14px;
  line-height: 1.7;
  margin: 0 0 18px 0;
  min-height: 48px;
}

.system-stats {
  margin-bottom: 22px;
}

.system-btn {
  width: 100%;
  height: 42px;
}

.portal-mobile {
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(30, 64, 175, 0.94)),
    radial-gradient(circle at 20% 0%, rgba(56, 189, 248, 0.22), transparent 34%);
  padding: 76px 46px;
}

.portal-mobile .section-title h2,
.portal-mobile .section-title p {
  color: #fff;
}

.portal-mobile .section-title p {
  color: rgba(236, 253, 245, 0.72);
}

.mobile-card {
  text-align: center;
  padding: 32px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.58);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.18);
}

.mobile-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
}

.mobile-header h3 {
  margin: 0;
  font-size: 24px;
}

.mobile-desc {
  color: #666;
  font-size: 14px;
  margin: 0 0 20px 0;
}

.qr-code {
  margin: 20px 0;
}

.qr-placeholder {
  width: 160px;
  min-height: 180px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  background: #fff;
}

.qr-placeholder p {
  margin: 10px 0 0 0;
  font-size: 12px;
}

.qr-grid {
  display: grid;
  grid-template-columns: repeat(7, 14px);
  grid-template-rows: repeat(7, 14px);
  gap: 3px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 6px;
}

.qr-grid span {
  background: #e5e7eb;
  border-radius: 2px;
}

.qr-grid span.active {
  background: #1e3a8a;
}

.mobile-actions {
  margin-top: 18px;
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.phone-preview {
  width: 210px;
  height: 420px;
  margin: 0 auto;
  background: #111827;
  border-radius: 28px;
  padding: 12px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.25);
}

.phone-top {
  width: 58px;
  height: 5px;
  border-radius: 999px;
  background: #374151;
  margin: 2px auto 10px;
}

.phone-screen {
  height: 380px;
  border-radius: 20px;
  background: linear-gradient(180deg, #f8fafc 0%, #e0f2fe 100%);
  padding: 20px 14px;
  overflow: hidden;
}

.phone-screen h4 {
  margin: 0 0 8px 0;
  color: #1e3a5f;
  text-align: center;
}

.phone-screen p {
  font-size: 12px;
  color: #64748b;
  text-align: center;
  margin-bottom: 18px;
}

.phone-card {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.86);
  border-radius: 12px;
  padding: 10px;
  margin-bottom: 10px;
  color: #1f2937;
  font-size: 13px;
}

.portal-features {
  max-width: 1480px;
  margin: 0 auto;
  padding: 76px 46px;
}

.feature-item {
  text-align: left;
  padding: 32px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.76);
  border: 1px solid rgba(59, 130, 246, 0.1);
  box-shadow: 0 18px 46px rgba(30, 64, 175, 0.08);
  min-height: 220px;
  transition: all 0.28s;
}

.feature-item:hover {
  transform: translateY(-8px);
  background: #fff;
}

.feature-icon {
  width: 66px;
  height: 66px;
  border-radius: 22px;
  color: #2563eb;
  margin-bottom: 22px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(245, 158, 11, 0.14));
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-item h4 {
  font-size: 20px;
  color: #172554;
  margin: 0 0 12px 0;
  font-weight: 900;
}

.feature-item p {
  color: #64748b;
  font-size: 14px;
  line-height: 1.75;
  margin: 0;
}

.portal-footer {
  background: linear-gradient(110deg, #07111f, #1e3a8a);
  padding: 46px 0;
  color: #fff;
  border-top: 1px solid rgba(191, 219, 254, 0.18);
}

.footer-content {
  max-width: 1480px;
  margin: 0 auto;
  padding: 0 46px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-info p {
  margin: 6px 0;
  font-size: 14px;
  color: rgba(236, 253, 245, 0.72);
}

.footer-links {
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 20px;
  }

  .logo-text h1 {
    font-size: 18px;
  }

  .banner-text h2 {
    font-size: 28px;
  }

  .footer-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
}
</style>