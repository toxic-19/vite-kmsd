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

export interface treeData {
  article?: Array<articleMenu>
  group?: groupMenu[]
}
