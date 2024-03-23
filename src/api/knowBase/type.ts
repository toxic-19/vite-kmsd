import { ResponseData } from '@/api'

export interface KnowBase {
  id: number
  knowId: number
  kbName: string
  kbDesc: string
  cover: string
  isPublic: boolean
  isMine: boolean
  isTop: boolean
  isCollected: boolean
  seqNum: number
  creatorId: string
  createdAt: Date
  updatedAt: Date
}
export interface knowLedgeRespData extends ResponseData {
  data: KnowBase[]
}
export interface UpdateTopForm {
  id: number
  isTop: boolean
}
export type CreateKnowForm = {
  kbName: string
  kbDesc: string
}
export interface articleMenu {
  articleId: number
  title: string
  description: string
}
export interface groupMenu {
  groupId: number
  groupName: string
  sortNum: number
  iconName: string
  childrenData: articleMenu[]
}
export interface GroupResponseData extends ResponseData {
  data: {
    article: articleMenu[]
    group: groupMenu[]
  }
}
