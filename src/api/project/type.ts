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
