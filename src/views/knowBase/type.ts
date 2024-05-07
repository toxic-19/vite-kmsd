import { KnowBase } from '@/api/knowBase/type'

type ListItem = {
  title: string
  list: Array<KnowBase>
  isTop: boolean
}
interface Knowledge {
  id: number
  kbName: string
  kbDesc: string
  isTop: boolean
  cover: string
  isDel: boolean
}
export { ListItem, Knowledge }
