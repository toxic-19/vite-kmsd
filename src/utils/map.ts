export const ERROR_STATUS_MAP = new Map([
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
