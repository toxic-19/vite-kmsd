import axiosInstance from '@/utils/request'
import { CreateTag, TagResData } from '@/api/article/type.ts'
enum API {
  tag_all_url = '/tag',
  tag_add_url = '/tag/add',
}
export const getTagList = () => axiosInstance.get<any, TagResData>(API.tag_all_url)
export const postAddNewTag = (data: CreateTag) => axiosInstance.post<any, TagResData>(API.tag_add_url, data)
