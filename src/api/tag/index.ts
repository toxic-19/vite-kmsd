import axiosInstance from '@/utils/request'
import { TagResData } from '@/api/article/type.ts'
enum API {
  tag_all_url = '/tag',
}
export const getTagList = () => axiosInstance.get<any, TagResData>(API.tag_all_url)
