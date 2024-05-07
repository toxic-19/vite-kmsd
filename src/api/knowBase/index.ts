import axiosInstance from '@/utils/request'
import { createGroupData, CreateKnowForm, GroupResponseData, knowLedgeRespData, updateGroupData, UpdateTopForm } from './type'
import {Knowledge} from "@/views/knowBase/type.ts";
enum API {
  knowledge_list_url = '/knowledge-base', // 获取全部知识库
  knowledge_changeTop_url = '/knowledge-base/changeTop', // 知识库的置顶
  knowledge_create_url = '/knowledge-base/create', // 新建知识库
  knowledge_menu_url = '/group', // 知识库下的分组和文章
  knowledge_info_url = '/knowledge-base/byKnowId', // 根据id获取知识库信息
  knowledge_update_url = '/knowledge-base/update', // 修改知识库信息
  group_create_url = '/group/createGroup', // 新建知识库下分组
  group_update_name_url = '/group/updateName', // 重命名分组
}
export const getKnowledgeList = () => axiosInstance.get<any, knowLedgeRespData>(API.knowledge_list_url)
export const postChangeTopStatus = (data: UpdateTopForm) =>
  axiosInstance.post<any, knowLedgeRespData>(API.knowledge_changeTop_url, data)
export const postCreateKnowledge = (data: CreateKnowForm) =>
  axiosInstance.post<any, knowLedgeRespData>(API.knowledge_create_url, data)
export const getGroupList = (knowId: number) =>
  axiosInstance.get<any, GroupResponseData>(`${API.knowledge_menu_url}?knowId=${knowId}`)
export const getKnowledgeInfo = (knowId: number) => axiosInstance.get<any>(`${API.knowledge_info_url}?knowId=${knowId}`)
export const postUpdateKnowInfo = (data: Knowledge) => axiosInstance.post<any>(API.knowledge_update_url, data)
export const postCreateGroup = (data: createGroupData) => axiosInstance.post(API.group_create_url, data)
export const postReNameGroup = (data: updateGroupData) => axiosInstance.post(API.group_update_name_url, data)
