import axiosInstance from '@/utils/request.ts'
import {
  CreateProjectBody,
  CreateProjectResponseData,
  GetAllProjectQuery,
  ProjectResponseData,
  UpdateProjectQuery,
} from '@/api/project/type.ts'

enum API {
  project_create_url = '/project/create', // 创建一个新的项目
  project_list_url = '/project', // 获取项目列表
  project_update_name_url = '/project/updateName', // 项目重命名
}
export const postCreateProject = (data: CreateProjectBody) =>
  axiosInstance.post<any, CreateProjectResponseData>(API.project_create_url, data)
export const getProjectList = (params: GetAllProjectQuery) => axiosInstance.get<any, ProjectResponseData>(API.project_list_url, { params })
export const postUpdateProject = (params: UpdateProjectQuery) => axiosInstance.post(API.project_update_name_url, {}, { params })
