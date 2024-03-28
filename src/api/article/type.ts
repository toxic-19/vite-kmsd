import { ResponseData } from '@/api'
export type GetContentForm = {
  articleId: number
}
// 文章下的标签详情
export interface Tag {
  tagId: number
  tagName: string
}
export interface TagResData extends ResponseData {
  data: Tag[]
}
// 创建新文章
export interface CreateArticle {
  knowId?: number // 必须在知识库id下
  groupId?: number // 不一定需要分组id
  title: string
  description: string
  content?: string
  preview?: string
}
export interface CreateResData extends ResponseData {
  data: {
    id: number
    groupId: number
    articleId: number
    updatedAt: string
    createdAt: string
  }
}
