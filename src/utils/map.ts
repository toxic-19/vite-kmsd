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
  '3': ['前端任务分解', '设计实现方案', '自测Bug', '联调', '验收'],
  '4': ['后端任务分解', '设计实现方案', '自测Bug', '联调', '验收'],
  '5': ['创建产品、执行', '关联需求', '团队管理', '分解任务', '跟踪进度'],
  '6': ['撰写用例', '执行用例', '提交Bug', '验证Bug', '关闭Bug'],
}
export const TEMPLATE_MAP = new Map([
  [1, progressTemplates['1']],
  [2, progressTemplates['2']],
  [3, progressTemplates['3']],
  [4, progressTemplates['4']],
  [5, progressTemplates['5']],
  [6, progressTemplates['6']],
])
