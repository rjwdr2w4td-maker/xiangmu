<template>
  <div class="mobile-login">
    <div class="login-header">
      <div class="logo-circle">
        <el-icon :size="48"><TrendCharts /></el-icon>
      </div>
      <h1>安徽省粮食生产安全<br/>监测监管信息系统</h1>
      <p class="subtitle">移动端 · {{ entryTitle }}</p>
    </div>

    <div class="login-form">
      <el-form :model="loginForm" :rules="rules" ref="formRef">
        <el-form-item prop="userName">
          <el-input
            v-model="loginForm.userName"
            placeholder="请输入用户名"
            size="large"
            clearable
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="userLevel">
          <el-select
            v-model="loginForm.userLevel"
            placeholder="请选择用户层级"
            size="large"
            style="width: 100%"
          >
            <el-option label="省级用户" value="province" />
            <el-option label="市级用户" value="city" />
            <el-option label="县级用户" value="county" />
            <el-option label="乡镇用户" value="town" />
            <el-option label="种植主体" value="farmer" />
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
            登 录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="quick-login">
        <p>快速登录：</p>
        <div class="quick-tags">
          <el-tag
            v-for="account in demoAccounts"
            :key="account.level"
            @click="quickLogin(account)"
            size="small"
            effect="plain"
          >
            {{ account.label }}
          </el-tag>
        </div>
      </div>
    </div>

    <div class="login-footer">
      <p>© 2024 安徽省农业农村厅</p>
      <p>技术支持：安徽省农业信息化中心</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { getEntryType } from '@/utils/device'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref(null)
const loading = ref(false)

const entryType = getEntryType()
const entryTitle = computed(() => {
  const titles = {
    wanzhengtong: '皖政通',
    wanqitong: '皖企通',
    'field-check': '现场核查APP'
  }
  return titles[entryType] || '移动端'
})

const loginForm = reactive({
  userName: '',
  password: '',
  userLevel: ''
})

const rules = {
  userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  userLevel: [{ required: true, message: '请选择用户层级', trigger: 'change' }]
}

const demoAccounts = [
  { level: 'province', label: '省级', userName: '省农业农村厅', userRole: 'admin' },
  { level: 'city', label: '市级', userName: '合肥市农业农村局', userRole: 'manager' },
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
        router.push(`/mobile/home/${entryType || 'wanzhengtong'}`)
        loading.value = false
      }, 500)
    }
  })
}

const quickLogin = (account) => {
  loginForm.userName = account.userName
  loginForm.password = '123456'
  loginForm.userLevel = account.level
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
.mobile-login {
  min-height: 100vh;
  background: linear-gradient(180deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%);
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.login-header {
  text-align: center;
  color: #fff;
  margin-bottom: 40px;
}

.logo-circle {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fbbf24;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.login-header h1 {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.4;
  margin: 0 0 12px;
}

.subtitle {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
}

.login-form {
  background: #fff;
  border-radius: 16px;
  padding: 32px 24px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
}

.login-form :deep(.el-input__wrapper) {
  border-radius: 12px;
}

.login-form :deep(.el-select .el-input__wrapper) {
  border-radius: 12px;
}

.login-form :deep(.el-button--primary) {
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  height: 48px;
}

.quick-login {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.quick-login p {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 12px;
}

.quick-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.quick-tags .el-tag {
  cursor: pointer;
  border-radius: 20px;
  padding: 6px 14px;
}

.login-footer {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  margin-top: 40px;
}

.login-footer p {
  margin: 4px 0;
}
</style>
