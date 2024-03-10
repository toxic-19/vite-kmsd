import axiosInstance from '@/utils/request'
import { knowLedgeBaseInfoData } from './type'
enum API {
  KNOWLEDGE_LIST_URL = '/knowBase/getList',
}
export const getKnowListInfo = () => axiosInstance.get<any, knowLedgeBaseInfoData>(API.KNOWLEDGE_LIST_URL)
