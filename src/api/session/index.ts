import axiosInstance from '@/utils/request.ts'
import {
  CreateSessionDto,
  CreateSessionResponseData,
  DeleteSessionDto,
  FileContentResData,
  FileUploadDto,
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
  file_content_url = '/spark/file/fileId', // 获取文章下的fileId和summary
  file_upload_url = '/spark/file/save', // 上传文件返回fileId
  file_summary_url = '/spark/file/summary', // 总结文件
}
export const postCreateSession = (data: CreateSessionDto) =>
  axiosInstance.post<any, CreateSessionResponseData>(API.session_create_url, data)
export const getListSession = () => axiosInstance.get<any, SessionListResponseData>(API.session_list_url)
export const postDeleteSession = (params: DeleteSessionDto) => axiosInstance.post(API.session_delete_url, {}, { params })
export const postReNameSession = (data: ReNameDto) => axiosInstance.post(API.session_reName_url, data)
export const postSaveHistory = (data: SaveHistoryDto) => axiosInstance.post<any, HistoryResData>(API.history_save_url, data)
export const getHistoryList = (params: { sessionId?: number; articleId?: number }) =>
  axiosInstance.get<any>(API.history_list_url, { params })
export const getFileContentByDocId = (params: { articleId: number }) =>
  axiosInstance.get<any, FileContentResData>(API.file_content_url, { params })
export const postUploadFile = (data: FileUploadDto) => axiosInstance.post(API.file_upload_url, data)
export const postFileSummary = (params: { fileId: number }) => axiosInstance.post(API.file_summary_url, {}, { params })
