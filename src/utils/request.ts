// axios 二次封装
import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios'
import { message } from 'ant-design-vue'
import { ERROR_STATUS_MAP } from '@/utils/map'

// axios实例
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // 基础路径会携带/api【在.env.development文件上】
  timeout: 5000,
  headers: { 'Content-Type': 'application/json;charset=utf-8', token: localStorage.getItem('token') },
} as CreateAxiosDefaults)

// 请求拦截器 interceptors.request
axiosInstance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    const { response } = error
    if (response) {
      // 请求已发出 但是不在2xx的范围
      message.error(response.status)
      return Promise.reject(error)
    } else {
      message.warning('网络连接异常，请稍后再试')
    }
  },
)

// 响应拦截器 interceptors.response
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // 处理请求失败的HTTP网络错误
    const status = error.response.data.statusCode
    const msg = ERROR_STATUS_MAP[status] || 'Http Error'
    message.warning(`${msg}，请检查网络或联系管理员！`)
    return Promise.reject(error)
  },
)
export default axiosInstance
