<template>
  <div class="login-page">
    <div class="left-scene">
      <div class="scene-content">
        <h2 class="scene-title">粮食安全 · 数字监管</h2>
        <p class="scene-subtitle">Grain Security Digital Supervision Platform</p>
        <div class="scene-metrics">
          <div class="metric">
            <span class="metric-value">16</span>
            <span class="metric-label">地市覆盖</span>
          </div>
          <div class="metric">
            <span class="metric-value">4.2</span>
            <span class="metric-label">粮食生产监测</span>
          </div>
          <div class="metric">
            <span class="metric-value">100%</span>
            <span class="metric-label">到户到田</span>
          </div>
        </div>
        <div class="scene-tags">
          <span>遥感识别</span>
          <span>全程追溯</span>
          <span>移动闭环</span>
        </div>
      </div>
    </div>

    <div class="right-panel">
      <div class="login-card">
        <div class="card-header">
          <div class="system-logo">
            <el-icon :size="32"><TrendCharts /></el-icon>
          </div>
          <div class="system-title">
            <h1>安徽省粮食生产安全监测监管信息系统</h1>
            <p>Anhui Grain Production Security Supervision System</p>
          </div>
        </div>

        <el-form :model="loginForm" :rules="rules" ref="formRef" class="login-form">
          <el-form-item prop="userName">
            <el-input
              v-model="loginForm.userName"
              placeholder="请输入用户名"
              prefix-icon="User"
              size="large"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              prefix-icon="Lock"
              size="large"
              show-password
            />
          </el-form-item>

          <el-form-item prop="userLevel">
            <el-select
              v-model="loginForm.userLevel"
              placeholder="请选择用户层级"
              style="width: 100%"
              size="large"
            >
              <el-option label="省级用户" value="province" />
              <el-option label="市级用户" value="city" />
              <el-option label="县级用户" value="county" />
              <el-option label="乡镇用户" value="town" />
              <el-option label="种植主体" value="farmer" />
            </el-select>
          </el-form-item>

          <el-form-item v-if="loginForm.userLevel === 'city'" prop="cityCode">
            <el-select
              v-model="loginForm.cityCode"
              placeholder="请选择所属市"
              style="width: 100%"
              size="large"
            >
              <el-option label="合肥市" value="340100" />
              <el-option label="芜湖市" value="340200" />
              <el-option label="蚌埠市" value="340300" />
              <el-option label="淮南市" value="340400" />
              <el-option label="马鞍山市" value="340500" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              style="width: 100%"
              :loading="loading"
              @click="handleLogin"
            >
              登录系统
            </el-button>
          </el-form-item>
        </el-form>

        <div class="demo-bar">
          <span>快速登录：</span>
          <el-tag
            v-for="account in demoAccounts"
            :key="account.level"
            @click="quickLogin(account)"
            style="cursor: pointer; margin-left: 6px"
            size="small"
          >
            {{ account.label }}
          </el-tag>
        </div>

        <div class="mobile-bar">
          <el-icon><Iphone /></el-icon>
          <span>移动端：皖政通 / 皖企通 / 现场核查APP</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const formRef = ref(null)
const loading = ref(false)

const loginForm = reactive({
  userName: '',
  password: '',
  userLevel: '',
  cityCode: ''
})

const rules = {
  userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  userLevel: [{ required: true, message: '请选择用户层级', trigger: 'change' }]
}

const demoAccounts = [
  { level: 'province', label: '省级管理员', userName: '省农业农村厅', userRole: 'admin' },
  { level: 'city', label: '市级管理员', userName: '合肥市农业农村局', userRole: 'manager' },
  { level: 'county', label: '县级管理员', userName: '肥东县农业农村局', userRole: 'operator' },
  { level: 'farmer', label: '种植主体', userName: '张明家庭农场', userRole: 'farmer' }
]

const handleLogin = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true

      setTimeout(() => {
        userStore.login({
          userName: loginForm.userName,
          userRole: getUserRole(),
          userLevel: loginForm.userLevel
        })

        ElMessage.success('登录成功')
        router.push(route.query.redirect || '/dashboard')
        loading.value = false
      }, 500)
    }
  })
}

const quickLogin = (account) => {
  loginForm.userName = account.userName
  loginForm.password = '123456'
  loginForm.userLevel = account.level
  if (account.level === 'city') {
    loginForm.cityCode = '340100'
  }
}

const getUserRole = () => {
  const roleMap = {
    province: 'admin',
    city: 'manager',
    county: 'operator',
    town: 'operator',
    farmer: 'farmer'
  }
  return roleMap[loginForm.userLevel] || 'user'
}
</script>

<style scoped>
.login-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  overflow: hidden;
  background: #f0f2f5;
}

.left-scene {
  flex: 1.28;
  position: relative;
  overflow: hidden;
  background: #001529;
}

.scene-content {
  position: absolute;
  left: 60px;
  bottom: 60px;
  z-index: 2;
  color: #fff;
}

.scene-title {
  font-size: 42px;
  margin: 0 0 12px 0;
  font-weight: 600;
  letter-spacing: 0.08em;
}

.scene-subtitle {
  font-size: 14px;
  margin: 0 0 32px 0;
  color: rgba(255, 255, 255, 0.65);
  letter-spacing: 0.2em;
}

.scene-metrics {
  display: flex;
  gap: 36px;
  margin-bottom: 24px;
}

.metric {
  display: flex;
  flex-direction: column;
}

.metric-value {
  font-size: 36px;
  font-weight: 600;
  color: #e6a23c;
  line-height: 1;
}

.metric-label {
  font-size: 12px;
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.55);
}

.scene-tags {
  display: flex;
  gap: 10px;
}

.scene-tags span {
  padding: 5px 14px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.85);
  font-size: 12px;
}

.right-panel {
  width: 520px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.login-card {
  width: 100%;
  max-width: 420px;
}

.card-header {
  text-align: center;
  margin-bottom: 36px;
}

.system-logo {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  border-radius: 4px;
  background: #1a3a5c;
  color: #e6a23c;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.system-title h1 {
  font-size: 22px;
  margin: 0 0 6px 0;
  color: #303133;
  font-weight: 600;
  letter-spacing: 0.03em;
}

.system-title p {
  font-size: 11px;
  margin: 0;
  color: #909399;
  letter-spacing: 0.12em;
}

.login-form {
  margin-bottom: 18px;
}

.demo-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 16px;
  font-size: 13px;
  color: #909399;
}

.mobile-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
  color: #c0c4cc;
  padding-top: 14px;
  border-top: 1px solid #e4e7ed;
}
</style>
