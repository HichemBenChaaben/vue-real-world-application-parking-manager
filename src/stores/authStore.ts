import { ref } from 'vue'
import api from '@/services/api'
import { defineStore } from 'pinia'
import axios, { AxiosError } from 'axios'
import router from '@/router'
import type { Maybe } from 'types'

export type User = {
  readonly id?: string | number
  readonly email?: string
}

export type UserProfile = {
  readonly user?: User
}

export type Auth = {
  readonly accessToken?: string
  readonly expiresIn?: number
}

const useLoginStore = defineStore(
  'login',
  () => {
    const loading = ref(false)
    const error = ref('')
    const isAuthenticated = ref(false)

    const user = ref<Maybe<UserProfile>>({
      user: {
        id: undefined,
        email: undefined
      }
    })

    /** Actions */
    const setUser = (userResponse: UserProfile) => {
      user.value = userResponse.user
    }

    const login = async (credentials: { email: string; password: string }): Promise<void> => {
      try {
        loading.value = true
        const response = await api.loginService.login(credentials)
        console.log('response', response)
        setUser(response.data.data)
        if (response.status === 200) {
          isAuthenticated.value = true
          await getMe()
          router.push('/dashboard')
          error.value = null
        }
      } catch (err: unknown | Error | AxiosError) {
        if (axios.isAxiosError(err)) {
          error.value = err.response?.data.message
        }
        // stock error message if not coming from axios
        error.value = 'Invalid email or password'
      } finally {
        loading.value = false
      }
    }

    const getMe = async (): Promise<void> => {
      if (isAuthenticated.value) {
        return
      }
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
        resetStore()
      } catch (err: unknown | Error | AxiosError) {
        if (axios.isAxiosError(err)) {
          error.value = err.response?.data.message
        }
      } finally {
        loading.value = false
        router.push('/')
      }
    }

    const resetStore = () => {
      loading.value = false
      error.value = ''
      isAuthenticated.value = false

      user.value = {
        user: {
          id: undefined,
          email: undefined
        }
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
  },
  {
    persist: true
  }
)

export default useLoginStore
