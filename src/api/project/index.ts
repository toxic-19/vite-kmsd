import axiosInstance from '@/utils/request.ts'
import {
  CreateProjectBody,
  CreateProjectResponseData,
  CreateTaskBody,
  GetAllProjectQuery,
  GetTaskListQuery,
  ProjectResponseData,
  UpdateProjectQuery,
  UpdateTaskBody,
} from '@/api/project/type.ts'

enum API {
  project_create_url = '/project/create', // 创建一个新的项目
  project_list_url = '/project', // 获取项目列表
  project_update_name_url = '/project/updateName', // 项目重命名
  task_create_one_url = '/task/create', // 新建一个任务
  task_list_url = '/task', // 获取项目下流程的任务列表
  task_update_url = '/task/update', // 修改项目
  task_listById_url = '/task/getByProjectId', // 根据项目id获取所有流程的任务
}
export const postCreateProject = (data: CreateProjectBody) =>
  axiosInstance.post<any, CreateProjectResponseData>(API.project_create_url, data)
export const getProjectList = (params: GetAllProjectQuery) =>
  axiosInstance.get<any, ProjectResponseData>(API.project_list_url, { params })
export const postUpdateProject = (params: UpdateProjectQuery) => axiosInstance.post(API.project_update_name_url, {}, { params })
export const getTaskListByName = (params: GetTaskListQuery) => axiosInstance.get(API.task_list_url, { params })
export const postCreateOneTask = (data: CreateTaskBody) => axiosInstance.post(API.task_create_one_url, data)
export const postUpdateOneTask = (data: UpdateTaskBody) => axiosInstance.post(API.task_update_url, data)
export const postTaskListByProjectId = (params: UpdateProjectQuery) => axiosInstance.post(API.task_listById_url, {}, { params })
