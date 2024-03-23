import axiosInstance from '@/utils/request'
import { CreateKnowForm, GroupResponseData, knowLedgeRespData, UpdateTopForm } from './type'
enum API {
  knowledge_list_url = '/knowledge-base',
  knowledge_changeTop_url = '/knowledge-base/changeTop',
  knowledge_create_url = '/knowledge-base/create',
  knowledge_menu_url = '/group',
}
export const getKnowledgeList = () => axiosInstance.get<any, knowLedgeRespData>(API.knowledge_list_url)
export const postChangeTopStatus = (data: UpdateTopForm) => axiosInstance.post<any, knowLedgeRespData>(API.knowledge_changeTop_url, data)
export const postCreateKnowledge = (data: CreateKnowForm) => axiosInstance.post<any, knowLedgeRespData>(API.knowledge_create_url, data)
export const getGroupList = (knowId: number) => axiosInstance.get<any, GroupResponseData>(`${API.knowledge_menu_url}?knowId=${knowId}`)
