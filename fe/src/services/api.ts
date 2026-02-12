import axios from 'axios'
import { STORAGE_KEYS } from '../utils/storage.ts'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  response => response.data,
  error => {
    if (error?.response) {
      const status = error.response.status
      const serverMessage =
        error.response?.data?.error?.message

      if (status === 401) {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
        window.location.href = '/'
      }

      throw new Error(
        serverMessage || 'Request failed'
      )
    }

    throw new Error(
      'Network error, please check connection'
    )
  }
)

export default api
