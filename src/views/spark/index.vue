<script setup lang="ts">
import { nextTick, onMounted, reactive, ref, watch } from 'vue'
import { MessageOutlined, LoadingOutlined, EllipsisOutlined } from '@ant-design/icons-vue'
import { Marked } from 'marked'
import hljs from 'highlight.js'
import { markedHighlight } from 'marked-highlight'
import 'highlight.js/styles/atom-one-dark-reasonable.css'
import { message } from 'ant-design-vue'
import { chatWithSpark } from '@/api/spark/index.ts'
import { MessageType } from './constant.ts'
import { OneSession } from '@/api/session/type.ts'
import {
  getHistoryList,
  getListSession,
  postCreateSession,
  postDeleteSession,
  postReNameSession,
  postSaveHistory,
} from '@/api/session/index.ts'
const dialogList = ref<OneSession[]>([])
const nowSessionId = ref()
const dialogMenu = reactive<Record<number, boolean>>({})
const messageList = ref<MessageType[]>([])
// 获取对话框数据
const getDialogList = async () => {
  const { data } = await getListSession()
  dialogList.value = data
  dialogList.value.forEach((item) => (dialogMenu[item.id] = false))
  getMessageList(data[0].id)
}
// 获取对话的聊天数据
const getMessageList = async (sessionId: number) => {
  nowSessionId.value = sessionId
  const { data } = await getHistoryList({ sessionId })
  messageList.value = data
  messageList.value.forEach((item) => {
    if (item.content.includes('ai-image')) item.imageUrls = item.content.split('-img-')
  })
  await autoScrollBottom()
  return data.list
}
// 监听滚动事件
const oldScrollTop = ref(0)
const autoScrollBottom = async () => {
  let msgEnd: HTMLElement | null = document.getElementById('msgEnd')
  await nextTick()
  msgEnd?.scrollIntoView()
  // 判断是否向上滚动，如果向上滚动就停止自动下滑
  const scrollBox = document.getElementById('openai-chat-message-scroll-view') as HTMLElement
  const watchTopScroll = () => {
    const scrollTp = scrollBox.scrollTop || 0
    const scrollStep = scrollTp - oldScrollTop.value
    oldScrollTop.value = scrollTp
    if (scrollStep < -50) {
      msgEnd = null
    }
  }
  scrollBox.addEventListener('scroll', watchTopScroll)

  // 向下滚
  const keep = () => {
    msgEnd && msgEnd.scrollIntoView()
  }

  // 关闭监听
  const close = () => {
    scrollBox.removeEventListener('scroll', watchTopScroll)
  }
  return {
    keep,
    close,
  }
}
// 聊天文本处理
const coverTextToHtml = (text: string) => {
  if (!text) return
  const marked = new Marked(
    markedHighlight({
      langPrefix: 'hljs language-',
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'shell'
        return hljs.highlight(code, { language }).value
      },
    }),
  )
  let result = marked.parse(text)
  if (typeof result === 'string') {
    result = result.replace(/<script>/g, '<code>script</code>')
    result = result.replace(/<pre><code/g, `<pre style="position:relative;"><span class="copy-btn">Copy</span><code`)
  }
  return result
}

// 输入
const messageInput = ref<string>('')
const placeholderText = ref<string>('在这里输入你的问题，当前模型：星火1.5')
const sendLoading = ref<boolean>(false)
const isInputFocused = ref(false)
// 监听输入框的焦点事件
const onInputFocus = () => {
  isInputFocused.value = true
}
const onInputBlur = () => {
  isInputFocused.value = false
}
// 换行和发送快捷键
const inputKeyDownListener = (event: KeyboardEvent) => {
  if (event.shiftKey && event.key === 'Enter') return
  if (event.key === 'Enter') sendChat()
}
// chat聊天事件
const sendChat = async () => {
  if (!messageInput.value.trim().length) {
    message.warn('请输入询问内容！')
    return
  }
  sendLoading.value = true
  const index = messageList.value.push(
    {
      role: 'user',
      content: messageInput.value, // 用户询问
    },
    { role: 'assistant', content: '' }, // AI回答
  )
  const autoScrollBottomM = await autoScrollBottom()
  const chatParams = {
    input: messageInput.value,
    history: messageList.value.slice(-5),
    // sessionId: nowSessionId.value, // 会话id
  }
  const fb = (content: string) => {
    messageList.value[index - 1].content += content
    autoScrollBottomM.keep()
    const currentSession = dialogList.value.find((item) => item.id === nowSessionId.value)
    if (currentSession.sessionName === '新建对话') {
      updateChatName(nowSessionId.value, messageInput.value.slice(0, 7))
    }
  }
  const doneFb = async (totalResults: string) => {
    // 保存此次对话的记录
    await postSaveHistory({
      sessionId: nowSessionId.value,
      userInput: messageInput.value,
      assistantResponse: totalResults,
    })
    autoScrollBottomM.close()
    sendLoading.value = false
    messageInput.value = ''
  }
  const errFb = (error: any) => {
    messageList.value[index - 1].content = error.data || error.message || 'AI生成出错'
    autoScrollBottomM.close()
    sendLoading.value = false
    messageInput.value = ''
  }
  await chatWithSpark(chatParams, fb, doneFb, errFb)
}

// 发起新对话
const chatInputRef = ref<InstanceType<any>>(null)
const addDialog = async () => {
  if (sendLoading.value) return message.warn('聊天回答生成中')
  const { data } = await postCreateSession({ sessionName: '新建对话' })
  dialogList.value.unshift(data)
  nowSessionId.value = data.id
  messageInput.value = ''
  messageList.value = []
  nextTick(() => {
    chatInputRef.value.focus()
  })
}
const editData = reactive<Record<number, string>>({})
const updateChatNameInput = ref<InstanceType<typeof HTMLElement>>()
const editDialogName = (id: number, index: number) => {
  const item = dialogList.value.find((item: OneSession) => item.id == id) as OneSession
  editData[id] = item.sessionName
  nextTick(() => {
    const inputRef = updateChatNameInput.value[index] as HTMLInputElement
    inputRef.focus() // 聚焦
  })
}
// 取消重命名
const cancelEdit = (id: number) => {
  delete editData[id]
}
// 更新对话名称
const updateChatName = async (id: number, inputLetters: string) => {
  console.log('点击勾选')
  let name = ''
  if (!inputLetters) {
    name = editData[id]
    if (!name.trim().length) return message.error('对话名称不能为空')
  } else name = inputLetters
  await postReNameSession({ sessionId: id, sessionName: name })
  delete editData[id]
  getDialogList()
}
const delDialog = async (item: any, index: number) => {
  const { data, code } = await postDeleteSession({ sessionId: item.id })
  if (data == item.id && code === 200) {
    message.success('删除成功')
  }
  dialogList.value.splice(index, 1)
  // addDialog()
}
// 给每一个消息框都做一个事件委托
const messageWrapper = ref<InstanceType<typeof HTMLDivElement>>()
const copy2ClipBoard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    message.success('复制成功', 1)
  })
}
watch(messageWrapper, () => {
  messageWrapper.value?.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (target && target.classList.contains('copy-btn') && target.parentElement) {
      copy2ClipBoard(target.parentElement.innerText.replace('Copy\n', ''))
    }
  })
})

onMounted(() => {
  getDialogList()
})
</script>

<template>
  <a-layout style="width: 76%; height: 100%; margin: auto">
    <a-layout-sider width="18%">
      <div class="layout_sider">
        <div class="dialogue_top">
          <a-button type="text" class="addDialogue_btn" @click="addDialog">
            <template #icon>
              <MessageOutlined style="color: #80abd5; font-size: 18px" />
            </template>
            <span class="text">新建对话</span>
          </a-button>
        </div>
        <div class="dialogue_main">
          <div class="title">近期对话</div>
          <div class="dialogue_content">
            <div v-for="(item, index) in dialogList" :key="index" @click="getMessageList(item.id)">
              <div class="dialogue_item" style="background-color: #f4f3f2" v-show="item.id in editData">
                <input
                  style="padding-left: 4px; height: 26px; border-radius: 4px"
                  v-model="editData[item.id]"
                  @keyup.enter="updateChatName(item.id)"
                  @blur="cancelEdit(item.id)"
                  maxlength="15"
                  ref="updateChatNameInput"
                />
                <!--                <div class="edit">-->
                <!--                  <check-outlined style="font-size: 16px" @click.prevent="updateChatName(item.id)" />-->
                <!--                  <close-outlined style="font-size: 16px" @click.stop="cancelEdit(item.id)" />-->
                <!--                </div>-->
              </div>
              <div
                :class="{ dialogue_item: true, dialogue_item_select: item.id == nowSessionId }"
                v-show="!(item.id in editData)"
              >
                <div class="sessionName-icon">{{ item.sessionName.slice(0, 1) }}</div>
                {{ item.sessionName }}
                <a-popover
                  v-model:open="dialogMenu[item.id]"
                  trigger="hover"
                  arrow-point-at-center
                  placement="bottomLeft"
                  :getPopupContainer="(triggerNode: HTMLElement) => triggerNode.parentNode"
                >
                  <template #content>
                    <div class="popover_resetName" @click="editDialogName(item.id, index)">
                      <SvgIcon name="edit" width="13px" height="13px"></SvgIcon>
                      <span class="operator">重命名</span>
                    </div>
                    <a-popconfirm
                      :title="'Are you sure delete【' + item.sessionName + '】dialog ?'"
                      ok-text="Yes"
                      cancel-text="No"
                      @confirm="delDialog(item, index)"
                      placement="bottom"
                    >
                      <div class="popover_del">
                        <SvgIcon name="delete" width="14px" height="14px"></SvgIcon>
                        <span class="operator">删除</span>
                      </div>
                    </a-popconfirm>
                  </template>
                  <div v-show="!sendLoading" class="dialogue_item_operation">
                    <ellipsis-outlined style="font-size: 20px" />
                  </div>
                </a-popover>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-layout-sider>
    <a-layout-content class="layout_content">
      <div class="layout_content_main">
        <div class="main_messageList" id="openai-chat-message-scroll-view">
          <div class="chat_message" ref="messageWrapper">
            <div id="firstEl"></div>
            <div class="message_content" v-for="(item, index) in messageList" :key="index">
              <div
                :class="{ chat_message_right: item.role == 'user', chat_message_left: item.role == 'assistant' }"
                class="single_message"
                v-html="coverTextToHtml(item.content)"
                v-if="item.content"
              ></div>
              <div class="chat-status" v-else><a-spin tip="正在生成中..."></a-spin></div>
            </div>
          </div>
          <div id="msgEnd" style="height: 1px; overflow: hidden"></div>
        </div>
        <div :class="{ main_chat: true, main_chat_focus: isInputFocused }" ref="chatContainer">
          <div class="main_chat_container">
            <a-textarea
              style="border: none"
              v-model:value="messageInput"
              :placeholder="placeholderText"
              class="main_chat_input"
              @focus="onInputFocus"
              @blur="onInputBlur"
              @keydown="inputKeyDownListener"
              :readonly="sendLoading"
              :autoSize="{ minRows: 1, maxRows: 6 }"
              ref="chatInputRef"
            ></a-textarea>
            <div style="width: 2.4rem">
              <span v-if="!sendLoading">
                <span class="main_chat_icon" v-if="!messageInput" @click="sendChat">
                  <img src="@/assets/send-simple.png" alt="" />
                </span>
                <span class="main_chat_icon" style="background-color: #87a2ff" v-else @click="sendChat">
                  <img src="@/assets/send-simple-else.png" alt="" />
                </span>
              </span>
              <loading-outlined style="font-size: 20px" v-else class="loading-icon" />
            </div>
          </div>
        </div>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<style lang="scss" scoped>
.layout_sider {
  height: 100%;
  position: relative;
  background-color: #fff;
  padding-left: 20px;
  padding-top: 12px;
  .dialogue_top {
    .addDialogue_btn {
      display: flex;
      align-items: center;
      background-color: #f3f6fc;
      border-radius: 12px;
      height: 40px;
      width: 100%;
      .text {
        font-size: 14px;
      }
    }
  }
  .dialogue_main {
    height: 90%;
    @include scrollBar;
    /* 隐藏滚动条 */
    -ms-overflow-style: none; /* IE 和 Edge */
    scrollbar-width: none; /* Firefox */

    /* WebKit 浏览器（包括 Chrome 和 Safari） */
    &::-webkit-scrollbar {
      display: none;
    }
    overflow: auto;
    margin: 20px 0;

    .dialogue_content {
      margin: 8px 0;
      .dialogue_item {
        position: relative;
        cursor: pointer;
        margin: 8px 0;
        height: 40px;
        border-radius: 12px;
        padding: 14px 0 14px 14px;
        display: flex;
        align-items: center;
        transition: all 0.3s;
        &:hover {
          background-color: rgba(128, 171, 213, 0.2);
        }
        &:hover .dialogue_item_operation {
          display: block;
        }
        .dialogue_item_operation {
          position: absolute;
          right: 20px;
          display: none;
        }
        .edit {
          flex: 1;
          line-height: 35px;
          display: flex;
          justify-content: center;
          margin-right: 3px;
          font-size: 20px;
          span {
            padding: 0 3px;
          }
        }
        input {
          width: 78%;
          margin-left: 3px;
          margin-right: 0.36rem;
          &:focus {
            border-color: transparent;
            box-shadow: none;
            outline: none;
          }
        }
        .sessionName-icon {
          width: 24px;
          height: 24px;
          color: #ffffff;
          background-color: #80abd5;
          border-radius: 4px;
          text-align: center;
          line-height: 24px;
          margin-right: 4px;
          transition: all 0.3s;
        }
      }
      .dialogue_item_select {
        background-color: rgba(128, 171, 213, 0.3) !important;
        .sessionName-icon {
          background-color: #ffffff;
          color: #000000;
        }
      }
    }
  }
}
.layout_content {
  background-color: #fff;
  padding: 0 20px;
  .layout_content_main {
    background-color: #f3f6fc;
    height: 98%;
    border-radius: 16px;
    position: relative;
    padding-top: 12px;
    display: flex;
    flex-direction: column;
    .main_messageList {
      overflow-y: auto;
      flex: 1;
      padding: 1.71rem 2.29rem;
      margin-bottom: 20px;
      @include scrollBar;
      -ms-overflow-style: none;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .chat_message {
      .message_content {
        display: flex;
        .chat_message_left {
          padding: 10px 20px;
          background-color: #ffffff;
          margin: 12px auto 12px 0;
          border-radius: 12px;
        }
        .chat_message_right {
          padding: 6px 10px;
          margin: 12px 0 12px auto;
          background-color: #c2ead2;
          border-radius: 4px;
        }
        .single_message {
          :deep(*) {
            letter-spacing: 1px;
          }
          :deep(pre) {
            white-space: pre-wrap;
            //background: #f8f8f8;
            padding: 20px 8px;
            border-radius: 13px;
            code {
              font-size: 14px;
              line-height: 28px;
              border-radius: 10px;
            }
          }
          :deep(ol),
          :deep(ul) {
            list-style: decimal-leading-zero;
            margin-left: 30px;
            li {
              font-size: 14px;
              line-height: 28px;
              code {
                font-size: 14px;
                line-height: 28px;
                border-radius: 6px;
                padding: 2px 6px;
                background: #f8f8f8;
                margin: 0 6px;
              }
            }
          }
          :deep(p) {
            word-break: break-all;
            white-space: pre-wrap;
            margin-bottom: 8px;
            font-size: 14px;
            line-height: 28px;
            &:last-child {
              margin-bottom: 0;
            }
            code {
              font-size: 14px;
              line-height: 28px;
              border-radius: 6px;
              padding: 2px 6px;
              background: #f8f8f8;
              margin: 0 6px;
            }
          }
          :deep(a) {
            font-size: 14px;
            margin: 0 4px;
          }
        }
        .chat-status {
          position: relative;
          left: 50%;
          transform: translate(-50%);
        }
      }
    }
    .main_chat {
      position: relative;
      margin: 10px 30px 15px;
      min-height: 40px;
      border-radius: 10px;
      padding: 4px 20px;
      background-color: #ffffff;
      border: 1px solid transparent;

      &:hover {
        border: 1px solid #87a2ff;
      }

      .main_chat_container {
        display: flex;
      }
      .main_chat_input {
        flex: 1;
        line-height: 35px;
        resize: none;
        margin-right: 10px;
        font-size: 16px;
        &::-webkit-scrollbar {
          width: 0;
        }
        &:focus {
          border-color: transparent;
          box-shadow: none;
          outline: none;
        }
      }
      .main_chat_icon {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 2.6rem;
        height: 2.6rem;
        cursor: pointer;
        text-align: center;
        line-height: 2.6rem;
        border-radius: 50%;
        img {
          width: 2.4rem;
          height: 2.4rem;
          padding: 4px;
          position: relative;
          right: 1px;
          bottom: 1px;
        }
      }
      .loading-icon {
        position: absolute;
        top: 16px;
        cursor: pointer;
        line-height: 24px;
      }
    }
    .main_chat_focus {
      border: 1px solid #87a2ff;
      box-shadow: 0 0 5px rgba(135, 162, 255, 0.3);
    }
  }
}
.popover_resetName,
.popover_del {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-align: center;
  height: 36px;
  line-height: 20px;
  width: 70px;
  font-size: 13px;
  padding: 10px 0;
  .operator {
    width: 40px;
  }
  &:hover {
    background-color: #f4f3f2;
  }
}
:deep(.ant-popover .ant-popover-inner) {
  padding: 6px;
}
:deep(.ant-dropdown-placement-topLeft .ant-dropdown-content) {
  .ant-dropdown-menu {
    border-radius: 16px;
    padding: 8px 0 !important;
    .ant-dropdown-menu-item {
      padding: 12px;
      font-weight: 700;
    }
  }
}
:deep(.ant-spin-text) {
  color: #87a2ff;
}
:deep(.ant-spin-dot-item) {
  background-color: #87a2ff;
}
:deep(.copy-btn) {
  position: absolute;
  top: -4px;
  right: 6px;
  padding: 3px 6px 2px;
  color: rgba(0, 0, 0, 0.8);
  border-radius: 5px;
  font-weight: bold;
  font-size: 15px;
  transition: all 0.2s;
  &:hover {
    cursor: pointer;
    background-color: rgba(241, 234, 222, 0.6);
  }
}
</style>
