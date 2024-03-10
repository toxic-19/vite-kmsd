// 定义用户相关数据的ts类型
export interface loginFormData {
  username: string
  password: string
}
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
export interface loginResponseData extends ResponseData {
  data: {
    token: string // 返回token
  }
}
export interface User {
  userId: number
  avatar: string
  username: string
  password: string
  desc: string
  roles: string[]
  buttons: string[]
  routes: string[]
  token: string
}
export interface userInfoResponseData extends ResponseData {
  data: User
}
