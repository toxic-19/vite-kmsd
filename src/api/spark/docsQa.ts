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

  getWebSocketUrl() {
    const signature = this.getSignature()
    const queryString = `?appId=${this.appId}&timestamp=${this.timeStamp}&signature=${signature}`
    return this.originUrl + queryString
  }

  getRequestBody(fileId: string, userInput: string) {
    return {
      chatExtends: {
        wikiPromptTpl: '请将以下内容作为已知信息：\n<wikicontent>\n请根据以上内容回答用户的问题。\n问题:<wikiquestion>\n回答:',
        wikiFilterScore: 0.83,
        temperature: 0.5,
      },
      fileIds: [fileId],
      messages: [
        {
          role: 'user',
          content: userInput,
        },
      ],
    }
  }
}
type ChatParams = {
  fileId: string
  userInput: string
}
type oneArgsFunction = (content: any) => void
export const chatWithDoc = (chatParams: ChatParams, fb: oneArgsFunction, doneFb: oneArgsFunction, errFb: oneArgsFunction) => {
  const documentQAndA = new DocsQa(APPID, API_SECRET, curTime, httpUrl)
  const wsUrl = documentQAndA.getWebSocketUrl()
  const { fileId, userInput } = chatParams
  const requestBody = documentQAndA.getRequestBody(fileId, userInput)
  const ws = new WebSocket(wsUrl)
  let totalResults = ''
  ws.onopen = () => {
    ws.send(JSON.stringify(requestBody))
  }
  ws.onmessage = (e) => {
    const message = JSON.parse(e.data)
    console.log(message, message.content)
    if (message.content !== undefined) {
      fb(message.content)
      totalResults += message.content
    }
    const status = message.status
    if (status === 2) {
      ws.close()
    }
  }
  ws.onerror = (error) => {
    console.error('WebSocket error:', error)
    errFb(error)
  }
  ws.onclose = () => {
    console.log('WebSocket closed')
    doneFb(totalResults)
  }
}
