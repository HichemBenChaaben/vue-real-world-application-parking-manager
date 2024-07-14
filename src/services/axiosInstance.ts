import router from '@/router'
import axios, {
  type AxiosInstance,
  type AxiosResponse,
  AxiosError,
  type CancelTokenSource
} from 'axios'

// Create a single instance of Axios
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
    // Remove the cancel token from the map on success
    cancelTokens.delete(response.config.url!)
    return response
  },
  (error: AxiosError) => {
    // Handle cancellation
    if (axios.isCancel(error)) {
      cancelTokens.delete(error?.config?.url!)
    }
    // Redirect to the login page if the user is not authorised
    // example the session expires while the user is still logged in in the frontend
    if (error.response && error.response.status === 401) {
      // window.location.href = '/'
      // router.push('/')
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
