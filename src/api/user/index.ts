// 统一管理项目用户相关接口
import axiosInstance from '@/utils/request'
import type { loginFormData, loginResponseData, userInfoResponseData } from './type'
enum API {
  user_login_url = '/user/login',
  user_info_url = '/user/info',
  user_logout_url = '/admin/acl/index/logout',
}
export const postLogin = (data: loginFormData) => axiosInstance.post<any, loginResponseData>(API.user_login_url, data)
export const postLogout = () => axiosInstance.post<any, any>(API.user_logout_url)
export const getUserInfo = () => axiosInstance.get<any, userInfoResponseData>(API.user_info_url)
