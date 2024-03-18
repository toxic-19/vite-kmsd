export type articleMenu = {
  articleId: number
  title: string
  description: string
}
export type groupMenu = {
  groupId: number
  groupName: string
  sortNum: number
  iconName: string
  childrenData: Array<articleMenu>
}
