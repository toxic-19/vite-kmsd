import * as CryptoJS from 'crypto-js/crypto-js.js'

const httpUrl = 'wss://chatdoc.xfyun.cn/openapi/chat'
const APPID = 'eb7b67d3'
const API_SECRET = 'ZmViMTc1MDk0ZGI1ZDgzMGM1YTVlYTdi'
const curTime = Math.floor(Date.now() / 1000).toString()
// 文档问答接口
// 鉴权参数：wss://chatdoc.xfyun.cn/openapi/chat?appId=xxx&timestamp=xxx&signature=xxxxxx
class DocsQa {
  appId: string
  apiSecret: string
  timeStamp: string
  originUrl: string
  constructor(APPId: string, APISecret: string, TimeStamp: string, OriginUrl: string) {
    this.appId = APPId
    this.apiSecret = APISecret
    this.timeStamp = TimeStamp
    this.originUrl = OriginUrl
  }
  getOriginSignature() {
    const data = this.appId + this.timeStamp
    return CryptoJS.MD5(data).toString(CryptoJS.enc.Hex)
  }

  getSignature() {
    const signatureOrigin = this.getOriginSignature()
    return CryptoJS.HmacSHA1(signatureOrigin, this.apiSecret).toString(CryptoJS.enc.Base64)
  }

  getUploadHeader(formData: any) {
    const signature = this.getSignature()
    return {
      ...formData.getHeaders(),
      appId: this.appId,
      timestamp: this.timeStamp,
      signature: signature,
    }
  }

  getWebSocketUrl() {
    const signature = this.getSignature()
    const queryString = `?appId=${this.appId}&timestamp=${this.timeStamp}&signature=${signature}`
    return this.originUrl + queryString
  }

  getRequestBody() {
    return {
      chatExtends: {
        wikiPromptTpl: '请将以下内容作为已知信息：\n<wikicontent>\n请根据以上内容回答用户的问题。\n问题:<wikiquestion>\n回答:',
        wikiFilterScore: 0.83,
        temperature: 0.5,
      },
      fileIds: ['ecb05aa7a434468caea51803775b582e'],
      messages: [
        {
          role: 'user',
          content: '父亲在车站买了什么东西？',
        },
      ],
    }
  }
}

export const chatWithDoc = () => {
  const documentQAndA = new DocsQa(APPID, API_SECRET, curTime, httpUrl)
  const wsUrl = documentQAndA.getWebSocketUrl()
  console.log('wsUrl', wsUrl)
  // const headers = documentQAndA.getHeader();
  const requestBody = documentQAndA.getRequestBody()
  const ws = new WebSocket(wsUrl)

  ws.onopen = () => {
    ws.send(JSON.stringify(requestBody))
  }

  ws.onmessage = (e) => {
    const message = JSON.parse(e.data)
    const code = message.code
    if (code !== 0) {
      console.log(`请求错误: ${code}, ${message}`)
      ws.close()
    } else {
      const content = message.content
      const status = message.status
      console.log(content)
      if (status === 2) {
        ws.close()
      }
    }
  }

  ws.onerror = (error) => {
    console.error('WebSocket error:', error)
  }
  ws.onclose = () => {
    console.log('WebSocket closed')
  }
}
