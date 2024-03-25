import { ResponseData } from '@/api'
export type GetContentForm = {
  articleId: number
}
export interface Tag {
  tagId: number
  tagName: string
}
export interface TagResData extends ResponseData {
  data: Tag[]
}
