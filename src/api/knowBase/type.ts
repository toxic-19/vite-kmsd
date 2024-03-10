import { ResponseData } from '@/api/user/type'

interface KnowBase {
  knowId: string
  title: string
  description: string
  coverImage: string
  public: boolean
  author: string
  createTime: string
  updatedTime: string
}
export interface knowLedgeBaseInfoData extends ResponseData {
  data: KnowBase[]
}
