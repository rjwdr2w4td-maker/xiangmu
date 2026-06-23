import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/grain-plan/subject',
    name: 'GrainSubject',
    component: () => import('@/views/grain-plan/SubjectManage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/grain-plan/task',
    name: 'GrainTask',
    component: () => import('@/views/grain-plan/TaskPlan.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/grain-plan/audit',
    name: 'GrainAudit',
    component: () => import('@/views/grain-plan/TaskAudit.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/grain-plan/progress',
    name: 'GrainProgress',
    component: () => import('@/views/grain-plan/ProgressReport.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/grain-plan/map',
    name: 'GrainMap',
    component: () => import('@/views/grain-plan/GrainMap.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/grain-plan/disaster',
    name: 'GrainDisaster',
    component: () => import('@/views/grain-plan/DisasterManage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/grain-plan/warning',
    name: 'GrainWarning',
    component: () => import('@/views/grain-plan/WeatherWarning.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/grain-security/discovery',
    name: 'SecurityDiscovery',
    component: () => import('@/views/grain-security/EventDiscovery.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/grain-security/process',
    name: 'SecurityProcess',
    component: () => import('@/views/grain-security/EventProcess.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/grain-security/handle',
    name: 'SecurityHandle',
    component: () => import('@/views/grain-security/EventHandle.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/grain-security/map',
    name: 'SecurityMap',
    component: () => import('@/views/grain-security/SecurityMap.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/grain-security/board',
    name: 'TaskBoard',
    component: () => import('@/views/grain-security/TaskBoard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/grain-security/growth',
    name: 'GrowthCompare',
    component: () => import('@/views/grain-security/GrowthCompare.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/silage/planting',
    name: 'SilagePlanting',
    component: () => import('@/views/silage/PlantingManage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/silage/storage',
    name: 'SilageStorage',
    component: () => import('@/views/silage/StorageManage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/silage/map',
    name: 'SilageMap',
    component: () => import('@/views/silage/SilageMap.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pesticide/production',
    name: 'PesticideProduction',
    component: () => import('@/views/pesticide/ProductionLedger.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pesticide/business',
    name: 'PesticideBusiness',
    component: () => import('@/views/pesticide/BusinessLedger.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pesticide/trace',
    name: 'PesticideTrace',
    component: () => import('@/views/pesticide/TraceQuery.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pesticide/map',
    name: 'PesticideMap',
    component: () => import('@/views/pesticide/PesticideMap.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mobile/:entry?',
    name: 'MobileLogin',
    component: () => import('@/views/mobile/MobileLogin.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/mobile/home/:entry',
    name: 'MobileHome',
    component: () => import('@/views/mobile/MobileHome.vue'),
    meta: { requiresAuth: true, isMobile: true }
  },
  {
    path: '/mobile/task/:entry',
    name: 'MobileTaskList',
    component: () => import('@/views/mobile/MobileTaskList.vue'),
    meta: { requiresAuth: true, isMobile: true }
  },
  {
    path: '/mobile/map/:entry',
    name: 'MobileMap',
    component: () => import('@/views/mobile/MobileMap.vue'),
    meta: { requiresAuth: true, isMobile: true }
  },
  {
    path: '/mobile/profile/:entry',
    name: 'MobileProfile',
    component: () => import('@/views/mobile/MobileProfile.vue'),
    meta: { requiresAuth: true, isMobile: true }
  },
  {
    path: '/mobile/audit/:entry/:id',
    name: 'MobileAuditDetail',
    component: () => import('@/views/mobile/MobileAuditDetail.vue'),
    meta: { requiresAuth: true, isMobile: true }
  },
  {
    path: '/mobile/report/:entry/:id',
    name: 'MobileProgressReport',
    component: () => import('@/views/mobile/MobileProgressReport.vue'),
    meta: { requiresAuth: true, isMobile: true }
  },
  {
    path: '/mobile/check/:entry/:id',
    name: 'MobilePhotoCheck',
    component: () => import('@/views/mobile/MobilePhotoCheck.vue'),
    meta: { requiresAuth: true, isMobile: true }
  },
  {
    path: '/mobile/notice/:entry',
    name: 'MobileNotice',
    component: () => import('@/views/mobile/MobileNotice.vue'),
    meta: { requiresAuth: true, isMobile: true }
  },
  {
    path: '/mobile/stats/:entry',
    name: 'MobileStats',
    component: () => import('@/views/mobile/MobileStats.vue'),
    meta: { requiresAuth: true, isMobile: true }
  },
  {
    path: '/mobile/pesticide/:entry',
    name: 'MobilePesticideQuery',
    component: () => import('@/views/mobile/MobilePesticideQuery.vue'),
    meta: { requiresAuth: true, isMobile: true }
  },
  {
    path: '/mobile/subsidy/:entry',
    name: 'MobileSubsidy',
    component: () => import('@/views/mobile/MobileSubsidy.vue'),
    meta: { requiresAuth: true, isMobile: true }
  },
  {
    path: '/mobile/silage/:entry',
    name: 'MobileSilageApply',
    component: () => import('@/views/mobile/MobileSilageApply.vue'),
    meta: { requiresAuth: true, isMobile: true }
  },
  {
    path: '/mobile/planting/:entry',
    name: 'MobilePlantingRecord',
    component: () => import('@/views/mobile/MobilePlantingRecord.vue'),
    meta: { requiresAuth: true, isMobile: true }
  },
  {
    path: '/mobile/storage/:entry',
    name: 'MobileStorageDeclare',
    component: () => import('@/views/mobile/MobileStorageDeclare.vue'),
    meta: { requiresAuth: true, isMobile: true }
  },
  {
    path: '/mobile/photo-report/:entry',
    name: 'MobilePhotoReport',
    component: () => import('@/views/mobile/MobilePhotoReport.vue'),
    meta: { requiresAuth: true, isMobile: true }
  },
  {
    path: '/mobile/issue/:entry',
    name: 'MobileIssueReport',
    component: () => import('@/views/mobile/MobileIssueReport.vue'),
    meta: { requiresAuth: true, isMobile: true }
  },
  {
    path: '/mobile/advice/:entry',
    name: 'MobileFarmingAdvice',
    component: () => import('@/views/mobile/MobileFarmingAdvice.vue'),
    meta: { requiresAuth: true, isMobile: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !token) {
    if (to.meta.isMobile || to.path.startsWith('/mobile/')) {
      const entry = to.params.entry || to.path.split('/').pop()
      next({ path: `/mobile/${entry || 'wanzhengtong'}` })
    } else {
      next({ path: '/login', query: { redirect: to.fullPath } })
    }
  } else {
    next()
  }
})

export default router