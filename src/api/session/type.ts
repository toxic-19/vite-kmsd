import { ResponseData } from '@/api'

// session
export type CreateSessionDto = {
  sessionName: string
}
export type DeleteSessionDto = {
  sessionId: number
}
export type ReNameDto = {
  sessionId: number
  sessionName: string
}
export type OneSession = {
  id: number
  sessionName: string
  isDel: boolean
  updatedAt: string
  createdAt: string
}
export interface CreateSessionResponseData extends ResponseData {
  data: OneSession
}
export interface SessionListResponseData extends ResponseData {
  data: OneSession[]
}
export type OneHistoryRecord = {
  id: number
  sessionId: string
  content: string
  role: string
  updatedAt: string
  createdAt: string
}
// history
export type SaveHistoryDto = {
  sessionId: number // 所属会话
  userInput: string // 用户输入
  assistantResponse: string // AI输出
}
export interface HistoryResData extends ResponseData {
  data: OneHistoryRecord[]
}
type FileContentRecord = {
  id: number
  sid: string
  fileId: string
  summary: string | null
  createdAt: string
  updatedAt: string
}
export interface FileContentResData extends ResponseData {
  data: FileContentRecord
}
export type FileUploadDto = {
  articleId: number
  needSummary: boolean
}
