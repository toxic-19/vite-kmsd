import axiosInstance from '@/utils/request.ts'
import {
  CreateSessionDto,
  CreateSessionResponseData,
  DeleteSessionDto,
  HistoryResData,
  ReNameDto,
  SaveHistoryDto,
  SessionListResponseData,
} from '@/api/session/type.ts'

enum API {
  session_create_url = '/spark/session/add', // 创建一个新对话
  session_list_url = '/spark/session/list', // 获取会话列表
  session_delete_url = '/spark/session/delete', // 删除对话
  session_reName_url = '/spark/session/reName', // 重命名对话
  history_save_url = '/spark/history/save', // 保存对话记录
  history_list_url = '/spark/history/list', // 获取聊天记录
}
export const postCreateSession = (data: CreateSessionDto) =>
  axiosInstance.post<any, CreateSessionResponseData>(API.session_create_url, data)
export const getListSession = () => axiosInstance.get<any, SessionListResponseData>(API.session_list_url)
export const postDeleteSession = (params: DeleteSessionDto) => axiosInstance.post(API.session_delete_url, {}, { params })
export const postReNameSession = (data: ReNameDto) => axiosInstance.post(API.session_reName_url, data)
export const postSaveHistory = (data: SaveHistoryDto) => axiosInstance.post<any, HistoryResData>(API.history_save_url, data)
export const getHistoryList = (params: { sessionId: number }) => axiosInstance.get<any>(API.history_list_url, { params })
