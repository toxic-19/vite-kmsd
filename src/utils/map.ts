import { ref } from 'vue'

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
  '7': ['学习', '预研', '感兴趣', '实战', '缺陷', '复习'],
  '8': ['当前计划'],
}
export const TEMPLATE_MAP = new Map([
  [1, progressTemplates['1']],
  [2, progressTemplates['2']],
  [3, progressTemplates['3']],
  [4, progressTemplates['4']],
  [5, progressTemplates['5']],
  [6, progressTemplates['6']],
  [7, progressTemplates['7']],
  [8, progressTemplates['8']],
])
export const selectOptions = ref([
  { value: 1, label: '软件开发', back: 'https://moscdn.lanhuapp.com/prod/7/image/636a2065b5b853eeffbdfa0c_cover.png' },
  { value: 2, label: '需求设计', back: 'https://lhcdn.lanhuapp.com/workbench/template2.jpg' },
  { value: 3, label: '前端开发', back: 'https://lhcdn.lanhuapp.com/workbench/template10.jpg' },
  { value: 4, label: '后端开发', back: 'https://lhcdn.lanhuapp.com/workbench/template9.jpg' },
  { value: 5, label: '产品开发', back: 'https://lhcdn.lanhuapp.com/workbench/template1.jpg' },
  { value: 6, label: '测试开发', back: 'https://lhcdn.lanhuapp.com/workbench/template3.jpg' },
  { value: 7, label: '个人计划', back: 'https://lhcdn.lanhuapp.com/workbench/template5-1.png' },
  { value: 8, label: '团队计划', back: 'https://lhcdn.lanhuapp.com/workbench/template7.jpg' },
])

export const taskStatusList = ref([
  { label: '未开始', value: 0 },
  { label: '进行中', value: 1 },
  { label: '暂停', value: 2 },
  { label: '已完成', value: 3 },
  { label: '已取消', value: 4 },
  { label: '延期', value: 5 },
  { label: '出现问题', value: 6 },
])
export const taskStatusColors = {
  0: 'orange', // 未开始
  1: '#66adf1', // 进行中
  2: '#fcbc6a', // 暂停
  3: 'green', // 已完成
  4: '#949393', // 已取消
  5: '#aecfe2', // 延期
  6: '#f80404', // 出现问题
}
export const ANIMATION_DATA = [
  [
    {
      title: '辩论观点',
      image: 'https://qyai-prod.oss-cn-shanghai.aliyuncs.com/common/home/home_creator_icon_14.png',
    },
    {
      title: '短视频',
      image: 'https://qyai-prod.oss-cn-shanghai.aliyuncs.com/common/home/home_creator_icon_16.png',
    },
    {
      title: '诗歌情诗',
      image: 'https://qyai-prod.oss-cn-shanghai.aliyuncs.com/common/home/home_creator_icon_1.png',
    },
  ],
  [
    {
      title: '概括总结',
      image: 'https://qyai-prod.oss-cn-shanghai.aliyuncs.com/common/home/home_creator_icon_6.png',
    },
    {
      title: '周报',
      image: 'https://qyai-prod.oss-cn-shanghai.aliyuncs.com/common/home/home_creator_icon_3.png',
    },
    {
      title: '日程计划',
      image: 'https://qyai-prod.oss-cn-shanghai.aliyuncs.com/common/home/home_creator_icon_18.png',
    },
  ],
  [
    {
      title: '合同模板',
      image: 'https://qyai-prod.oss-cn-shanghai.aliyuncs.com/common/home/home_creator_icon_10.png',
    },
    {
      title: '考研科目',
      image: 'https://qyai-prod.oss-cn-shanghai.aliyuncs.com/common/home/home_creator_icon_10.png',
    },
    {
      title: '梦境分析',
      image: 'https://qyai-prod.oss-cn-shanghai.aliyuncs.com/common/home/home_creator_icon_20.png',
    },
  ],
]
