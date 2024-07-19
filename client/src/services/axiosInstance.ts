import axios, {
  type AxiosInstance,
  type AxiosResponse,
  AxiosError,
  type CancelTokenSource
} from 'axios'
import useAuthStore from '@/stores/authStore'
import router from '@/router'
import { useRoute } from 'vue-router'

/**
 * Axios instance with base URL, interceptors and cancellation token
 * we use this instance to make all the API requests
 * this will make requests configurable in one place (singleton)
 * the cancellation token will also prevent memory leaks by cancelling requests that are no longer needed
 * the cancellation token will also prevent the user from seeing outdated data by cancelling requests that are no longer needed
 * if the session expires while the user is still logged in in the frontend, the user will be redirected to the login page
 */

const axiosInstance: AxiosInstance = axios.create({
  baseURL: '/',
  withCredentials: true
})

// Map to store cancel tokens for each URL
const cancelTokens: Map<string, CancelTokenSource> = new Map()

axiosInstance.interceptors.request.use((config) => {
  // Check if there's already a cancel token for the URL
  if (cancelTokens.has(config.url!)) {
    const source = cancelTokens.get(config.url!)!
    // Cancel the previous request
    source?.cancel('Request canceled by new request')
  }

  // Create a new cancel token and store it for the URL
  const source = axios.CancelToken.source()
  config.cancelToken = source.token
  cancelTokens.set(config.url!, source)

  return config
})

// Axios response interceptor to handle cancellation
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    cancelTokens.delete(response.config.url!)
    return response
  },
  (error: AxiosError) => {
    if (axios.isCancel(error)) {
      cancelTokens.delete(error?.config?.url!)
    }
    // Redirect to the login page if the user is not authorised
    // example the session expires while the user is still logged in in the frontend
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore()
      const route = useRoute()
      authStore.isAuthenticated = false
      if (router.currentRoute.value.fullPath !== '/') {
        router.push('/?expired=1')
      }
    }
  }
)

export default axiosInstance
