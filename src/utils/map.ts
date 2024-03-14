export const ERROR_STATUS_MAP = new Map([
  [400, '请求错误(400)'],
  [401, 'token is out of date(401)'],
  [403, 'Authentication(403)'],
  [404, 'Not Found(404)'],
  [500, 'Internal Server Error(501)'],
  [501, '服务未实现(501)'],
  [504, '网络超时(504)'],
  [505, 'HTTP版本不受支持(505)'],
  [502, '网络错误(502)'],
  [503, '服务不可用(503)'],
])
