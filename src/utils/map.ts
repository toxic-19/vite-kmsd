export const ERROR_STATUS_MAP = new Map([
  [0, '参数错误或是参数缺少'],
  [400, 'Request Error(400)'],
  [401, 'token is out of date(401)'],
  [403, 'Authentication(403)'],
  [404, 'Not Found(404)'],
  [500, 'Internal Server Error(501)'],
  [501, '服务未实现(501)'],
  [504, 'Network TimeOut(504)'],
  [505, 'HTTP Version Not Support(505)'],
  [502, 'Network Error(502)'],
  [503, '服务不可用(503)'],
])

const progressTemplates = {
  '1': ['产品评审', '前端', '后端', '联调', '测试', '验收'],
  '2': ['市场调研', '产品定义', '设计原型', '开发测试', '用户测试', '产品发布'],
}
export const TEMPLATE_MAP = new Map([
  [1, progressTemplates['1']],
  [2, progressTemplates['2']],
])
