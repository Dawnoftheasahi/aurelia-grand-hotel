import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/composables/useApi.js'

export const useAuthStore = defineStore('auth', () => {
  const user  = ref(JSON.parse(localStorage.getItem('ag_user') || 'null'))
  const token = ref(localStorage.getItem('ag_token') || null)

  const isLoggedIn = computed(() => !!token.value)
  const isAdmin    = computed(() => user.value?.role === 'admin')

  function setAuth(userData, tokenData) {
    user.value  = userData
    token.value = tokenData
    localStorage.setItem('ag_user',  JSON.stringify(userData))
    localStorage.setItem('ag_token', tokenData)
    api.defaults.headers.common['Authorization'] = `Bearer ${tokenData}`
  }

  function clearAuth() {
    user.value  = null
    token.value = null
    localStorage.removeItem('ag_user')
    localStorage.removeItem('ag_token')
    delete api.defaults.headers.common['Authorization']
  }

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    setAuth(data.user, data.token)
    return data.user
  }

  async function register(name, email, password, phone) {
    const { data } = await api.post('/auth/register', { name, email, password, phone })
    setAuth(data.user, data.token)
    return data.user
  }

  async function fetchMe() {
    if (!token.value) return
    try {
      const { data } = await api.get('/auth/me')
      user.value = data
      localStorage.setItem('ag_user', JSON.stringify(data))
    } catch {
      clearAuth()
    }
  }

  async function updateProfile(payload) {
    const { data } = await api.patch('/auth/profile', payload)
    user.value = data
    localStorage.setItem('ag_user', JSON.stringify(data))
    return data
  }

  function logout() { clearAuth() }

  // Restore token to axios on store init
  if (token.value) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  return { user, token, isLoggedIn, isAdmin, login, register, logout, fetchMe, updateProfile }
})
