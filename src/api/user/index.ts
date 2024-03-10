// 统一管理项目用户相关接口
import axiosInstance from '@/utils/request'
import type { loginFormData, loginResponseData, userInfoResponseData } from './type'
enum API {
  LOGIN_URL = '/user/login',
  USERINFO_URL = '/user/info',
  LOGOUT_URL = '/admin/acl/index/logout',
}
export const requestLogin = (data: loginFormData) => axiosInstance.post<any, loginResponseData>(API.LOGIN_URL, data)
export const requestLogout = () => axiosInstance.post<any, any>(API.LOGOUT_URL)
export const requestUserInfo = () => axiosInstance.get<any, userInfoResponseData>(API.USERINFO_URL)
