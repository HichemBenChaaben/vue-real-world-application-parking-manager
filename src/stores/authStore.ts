import { ref, computed } from 'vue'
import api from '@/services/api'
import { defineStore } from 'pinia'
import axios, { AxiosError } from 'axios'

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

  // TODO: fix after the login
  const user = ref<UserProfile | null>({
    user: {
      id: 'string',
      email: 'string'
    },
    auth: {
      accessToken: 'string',
      expiresIn: 0
    }
  })

  const isAuthenticated = () => user.value !== null
  /** Getters */
  const getUser = () => user.value

  /** Actions */
  const setUser = (u: UserProfile) => {
    user.value = u
  }

  // Todo: add credentials object and remove the dummy one
  const login = async (credentials: User): Promise<void> => {
    try {
      const credentials = {
        username: email,
        password
      }
      const response = await api.loginService.login(credentials)
      setUser(response.data.user)
      console.log(me)
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
      const response = await api.loginService.me()
      setUser(response.data)
    } catch (err: unknown | Error | AxiosError) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data.message
      }
    } finally {
      loading.value = false
    }
  }

  return {
    isAuthenticated,
    loading,
    error,
    getUser,
    getMe,
    login,
    user
  }
})

export default useLoginStore
