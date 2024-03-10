// axios 二次封装
import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios'
import { message } from 'ant-design-vue'

// axios实例
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // 基础路径会携带/api【在.env.development文件上】
  timeout: 5000,
  headers: { 'Content-Type': 'application/json;charset=utf-8', token: localStorage.getItem('token') },
} as CreateAxiosDefaults)

// 请求拦截器 interceptors.request
axiosInstance.interceptors.request.use((config) => {
  return config
})

// 响应拦截器 interceptors.response
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // 处理请求失败的HTTP网络错误
    let msg = ''
    const status = error.response.status
    switch (status) {
      case 401:
        msg = 'token is out of date'
        break
      case 403:
        msg = 'Authentication'
        break
      case 404:
        msg = 'Not Found'
        break
      case 500:
        msg = 'Internal Server Error'
        break
      default:
        msg = 'Network Error'
    }
    message.info(msg)
    return Promise.reject(error)
  },
)
export default axiosInstance
