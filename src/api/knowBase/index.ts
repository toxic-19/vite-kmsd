import axiosInstance from '@/utils/request'
import { CreateKnowForm, knowLedgeRespData, UpdateTopForm } from './type'
enum API {
  knowledge_list_url = '/knowledge-base',
  knowledge_changeTop_url = '/knowledge-base/changeTop',
  knowledge_create_url = '/knowledge-base/create',
}
export const getKnowledgeList = () => axiosInstance.get<any, knowLedgeRespData>(API.knowledge_list_url)
export const postChangeTopStatus = (data: UpdateTopForm) => axiosInstance.post<any, knowLedgeRespData>(API.knowledge_changeTop_url, data)
export const postCreateKnowledge = (data: CreateKnowForm) => axiosInstance.post<any, knowLedgeRespData>(API.knowledge_create_url, data)
