import * as CryptoJS from 'crypto-js/crypto-js.js'
// websocket协议通用鉴权
const httpUrl = new URL('https://spark-api.xf-yun.com/v1.1/chat')
let modelDomain = ''
const APPID = 'eb7b67d3'
const API_SECRET = 'ZmViMTc1MDk0ZGI1ZDgzMGM1YTVlYTdi'
const API_KEY = 'e577238d7a4c27b7484a487c830003b2'
type ChatDto = {
  input: string
}
// type noArgsFunction = () => void
type oneArgsFunction = (content: any) => void
const getWebsocketUrl = (): Promise<string> => {
  // 动态获取domain信息
  switch (httpUrl.pathname) {
    case '/v1.1/chat':
      modelDomain = 'general'
      break
    case '/v2.1/chat':
      modelDomain = 'generalv2'
      break
    case '/v3.1/chat':
      modelDomain = 'generalv3'
      break
    case '/v3.5/chat':
      modelDomain = 'generalv3.5'
      break
  }
  return new Promise((resolve) => {
    const apiKey = API_KEY
    const apiSecret = API_SECRET

    let url = 'wss://' + httpUrl.host + httpUrl.pathname
    // 鉴权参数: host【请求的主机】 date【当前时间戳】 authorization【base64编码的签名方式】
    const host = 'localhost:9951' // 前端发起请求的地址
    const date = new Date().toUTCString() // toGMTString已被ES6废弃

    const algorithm = 'hmac-sha256'
    const headers = 'host date request-line'
    const signatureOrigin = `host: ${host}\ndate: ${date}\nGET ${httpUrl.pathname} HTTP/1.1`
    const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret)
    console.log(signatureSha)
    const signature = CryptoJS.enc.Base64.stringify(signatureSha)
    const authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
    const authorization = btoa(authorizationOrigin)

    url = `${url}?authorization=${authorization}&date=${date}&host=${host}`
    resolve(url)
  })
}
// 拼接参数
const generateParams = (chatDto: ChatDto) => {
  const { input } = chatDto
  return {
    header: {
      app_id: APPID,
      uid: 'fd3f47e4-d',
    },
    parameter: {
      chat: {
        domain: modelDomain,
        temperature: 0.5,
        max_tokens: 1024,
      },
    },
    payload: {
      message: {
        // 历史聊天记录
        text: [
          {
            role: 'user',
            content: '中国第一个皇帝是谁？',
          },
          {
            role: 'assistant',
            content: '秦始皇',
          },
          {
            role: 'user',
            content: '秦始皇修的长城吗',
          },
          {
            role: 'assistant',
            content: '是的',
          },
          {
            role: 'user',
            content: input,
          },
        ],
      },
    },
  }
}

export const chatWithSpark = async (chatDto: ChatDto, fb: oneArgsFunction, doneFb: oneArgsFunction, errFb: oneArgsFunction) => {
  // 连接websocket
  const url = await getWebsocketUrl()
  const ttsWS = new WebSocket(url)
  let totalResults = ''
  ttsWS.onopen = () => {
    // websocket发送数据
    const params = generateParams(chatDto)
    ttsWS.send(JSON.stringify(params))
  }
  ttsWS.onmessage = (e) => {
    const jsonData = JSON.parse(e.data)
    const {
      payload: {
        choices: { text },
      },
    } = jsonData
    const { content } = text[0]
    if (content) {
      fb(content)
      totalResults += content
    }
    // 提问失败
    if (jsonData.header.code !== 0) {
      alert(`提问失败: ${jsonData.header.code}:${jsonData.header.message}`)
      doneFb(' ')
      return `${jsonData.header.code}:${jsonData.header.message}`
    }
    if (jsonData.header.code === 0 && jsonData.header.status === 2) {
      // code为0正常状态码且status为2是最后一个文本结果
      ttsWS.close()
      doneFb(totalResults)
      return
    }
  }
  ttsWS.onerror = (error) => {
    alert('WebSocket报错，请f12查看详情')
    errFb(error)
  }
  ttsWS.onclose = () => {
    console.log('Close WebSocket')
  }
}
