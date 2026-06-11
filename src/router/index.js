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