import { SSE, SSEvent } from 'sse.js'
import { message } from 'ant-design-vue'
export const sparkChat = async (data, fb, doneFb, errFb) => {
  // sse
  const source = new SSE('/dev/spark/chat', {
    method: 'POST',
    payload: JSON.stringify(data),
  })
  source.onopen = () => {
    console.log('连接开启', JSON.stringify(data))
  }
  source.onmessage = (e: SSEvent) => {
    console.log(e, '正在接收到数据')
    try {
      const result = JSON.parse(e.data)
      const {
        payload: {
          choices: { text },
        },
      } = result
      const { content } = text[0]
      if (content) fb(content)
    } catch (error) {
      // 完成
      message.success('完成响应')
      if (error.message.indexOf('DONE') > -1 || e.data === '[DONE]') {
        return doneFb()
      }
    }
  }
  source.onerror = (err: SSEvent) => {
    errFb(err)
    message.error('出错了')
  }
  source.stream()
}
