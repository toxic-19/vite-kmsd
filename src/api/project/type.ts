import { ResponseData } from '@/api'
export interface GetAllProjectQuery {
  isHangUp: string
  projectName: string
}
export interface CreateProjectBody {
  projectName: string
  projectCover?: string
  processTemplate: number
}
export interface UpdateProjectQuery {
  id: number
  projectName: string
}
export type OneProject = {
  id: number
  projectName: string
  projectCover: string
  processTemplate: number
  isHangUp: boolean
  updatedAt: string
  createdAt: string
  process: Array<string | Array<string>>
}
export interface CreateProjectResponseData extends ResponseData {
  data: OneProject
}
export interface ProjectResponseData extends ResponseData {
  data: Array<OneProject>
}
export interface RowVO {
  id: number
  taskName: string
  taskStatus: string
  days: number
  dateStart: string
  dateEnd: string
}
export interface GetTaskListQuery {
  projectId: number
  processName: string
}
export interface CreateTaskBody {
  projectId: number
  processName: string
  taskName: string
  taskStatus: number
  days: number
  dateStart: Date
  dateEnd: Date
}
export interface UpdateTaskBody {
  id: number
  days?: number
  dateEnd?: string
  dateStart?: string
  taskName?: string
  taskStatus?: number
}
export interface OneTask {
  id: number
  taskName: string
  taskStatus: number
  days: number
  dateStart: Date
  dateEnd: Date
  createdAt: Date
  updatedAt: Date
}
