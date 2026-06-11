import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userName = ref(localStorage.getItem('userName') || '')
  const userRole = ref(localStorage.getItem('userRole') || '')
  const userLevel = ref(localStorage.getItem('userLevel') || '')
  const token = ref(localStorage.getItem('token') || '')

  const login = (userInfo) => {
    userName.value = userInfo.userName
    userRole.value = userInfo.userRole
    userLevel.value = userInfo.userLevel
    token.value = 'mock-token-' + Date.now()
    
    localStorage.setItem('userName', userInfo.userName)
    localStorage.setItem('userRole', userInfo.userRole)
    localStorage.setItem('userLevel', userInfo.userLevel)
    localStorage.setItem('token', token.value)
  }

  const logout = () => {
    userName.value = ''
    userRole.value = ''
    userLevel.value = ''
    token.value = ''
    
    localStorage.removeItem('userName')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userLevel')
    localStorage.removeItem('token')
  }

  return {
    userName,
    userRole,
    userLevel,
    token,
    login,
    logout
  }
})