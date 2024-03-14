import axiosInstance from '@/utils/request'
import { knowLedgeRespData, UpdateTopForm } from './type'
enum API {
  knowledge_list_url = '/knowledge-base',
  knowledge_changeTop_url = '/knowledge-base/changeTop',
}
export const getKnowledgeList = () => axiosInstance.get<any, knowLedgeRespData>(API.knowledge_list_url)
export const postChangeTopStatus = (data: UpdateTopForm) => axiosInstance.post<any, knowLedgeRespData>(API.knowledge_changeTop_url, data)
