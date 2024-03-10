// 关于知识库的mock接口
// 获取知识库列表信息 /api/knowBase/getList
type KnowBase = {
  knowId: string
  title: string
  description: string
  coverImage: string
  isPublic: boolean
  author: string
  createTime: string
  updatedTime: string
}
function createKnowledgeBaseList() {
  return <KnowBase[]>[
    {
      knowId: 'uuid0101',
      title: 'Knowledge01',
      description: '我的开发空间',
      coverImage: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      isPublic: true,
      author: 'toxic',
    },
    {
      knowId: 'uuid0102',
      title: 'Knowledge02',
      description: '企业系统产品管理',
      coverImage: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      isPublic: false,
      author: 'toxic',
    },
  ]
}
export default [
  {
    url: '/api/knowBase/getList', // 请求地址
    method: 'get', // 请求方式
    response: (request) => {
      // 获取请求头携带token
      if (request.headers.token === 'Admin Token') {
        return { code: 200, message: 'success', data: createKnowledgeBaseList() }
      }
    },
  },
]
