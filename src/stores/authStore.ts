import { ref, computed } from 'vue'
import api from '@/services/api'
import { defineStore } from 'pinia'
import axios, { AxiosError } from 'axios'
import router from '@/router'

interface LoginState {
  loading: boolean
  error: string | null
  cookie: string | null
}

export type UserProfile = {
  readonly user?: User
  readonly auth?: Auth
}

export type Auth = {
  readonly accessToken?: string
  readonly expiresIn?: number
}

export type User = {
  readonly id?: string
  readonly email?: string
}

const useLoginStore = defineStore('login', () => {
  /** State */
  const loading = ref(false)
  const error = ref('')
  const isAuthenticated = ref(false)

  const user = ref<UserProfile | null>({
    user: {
      id: undefined,
      email: undefined
    },
    auth: {
      accessToken: undefined,
      expiresIn: undefined
    }
  })

  /** Actions */
  const setUser = (userResponse: UserProfile) => {
    user.value = userResponse.data
  }

  const login = async (credentials: { email: string; password: string }): Promise<void> => {
    try {
      loading.value = true
      const response = await api.loginService.login(credentials)
      if (response.status === 200) {
        isAuthenticated.value = true
        await getMe()
        router.push('/dashboard')
      }
    } catch (err: unknown | Error | AxiosError) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data.message
      }
    } finally {
      loading.value = false
    }
  }

  const getMe = async (): Promise<void> => {
    try {
      loading.value = true
      const {
        data: { data }
      } = await api.loginService.me()
      setUser(data)

      if (data.user?.email) {
        isAuthenticated.value = true
      }
    } catch (err: unknown | Error | AxiosError) {
      isAuthenticated.value = false
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data.message
      }
    } finally {
      loading.value = false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      loading.value = true
      await api.loginService.logout()
      isAuthenticated.value = false
    } catch (err: unknown | Error | AxiosError) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data.message
      }
    } finally {
      loading.value = false
      router.push('/')
    }
  }

  return {
    isAuthenticated,
    loading,
    error,
    getMe,
    login,
    logout,
    user
  }
})

export default useLoginStore
