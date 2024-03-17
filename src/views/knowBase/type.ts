import { KnowBase } from '@/api/knowBase/type'

type ListItem = {
  title: string
  list: Array<KnowBase>
  isTop: boolean
}

export { ListItem }
