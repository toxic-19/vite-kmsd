import axiosInstance from '@/utils/request'
enum API {
  article_menu_url = '/knowledge-base',
}
export const getKnowledgeList = () => axiosInstance.get<any>(API)
