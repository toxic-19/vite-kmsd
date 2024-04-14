<template>
  <a-layout style="width: 80%; height: 100%; margin: auto">
    <a-layout-sider width="18%">
      <div class="layout_sider">
        <div class="dialogue_top">
          <a-button type="text" class="addDialogue_btn" @click="addDialog">
            <PlusOutlined class="addDialogue_icon" />
            发起新对话
          </a-button>
        </div>
        <div class="dialogue_main">
          <div class="title">近期对话</div>
          <div class="dialogue_content">
            <div v-for="(item, index) in dialogList" :key="index">
              <div :class="{ dialogue_item: true, dialogue_item_select: item.id == nowSessionId }">
                {{ item.session_name }}
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

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref, watch } from 'vue'
import { dialogListResponse, DialogType, historyListResponse, MessageType } from './response.ts'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { Marked } from 'marked'
import hljs from 'highlight.js'
import { markedHighlight } from 'marked-highlight'
import 'highlight.js/styles/atom-one-dark-reasonable.css'
// import copyImage from '@/assets/svg/copy.svg'
import { message } from 'ant-design-vue'
import { chatWithSpark } from './sparkApi/index.ts'
const dialogList = ref<DialogType[]>([])
const nowSessionId = ref()
const dialogMenu = reactive<Record<number, boolean>>({})
const messageList = ref<MessageType[]>([])
// 获取对话框数据
const getDialogList = () => {
  const { data } = dialogListResponse
  dialogList.value = data
  dialogList.value.forEach((item) => (dialogMenu[item.id] = false))
}
// 获取对话的聊天数据
const getMessageList = async (id: number) => {
  nowSessionId.value = id
  const { data } = historyListResponse
  messageList.value = data.list
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
    // result = result.replace(/<pre><code/g, `<!--<pre style="position:relative;"><img src=${copyImage} class="copy-btn" alt=""><code-->`)
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
    message.warn('请先输入内容再发送呢亲！')
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
    // sessionId: nowSessionId.value, // 会话id
  }
  const fb = (content: string) => {
    messageList.value[index - 1].content += content
    autoScrollBottomM.keep()
  }
  const doneFb = () => {
    autoScrollBottomM.close()
    sendLoading.value = false
  }
  const errFb = (error: any) => {
    messageList.value[index - 1].content = error.data || error.message || 'AI生成出错'
    autoScrollBottomM.close()
    sendLoading.value = false
  }
  await chatWithSpark(chatParams, fb, doneFb, errFb)
  messageInput.value = ''
}

// 发起新对话
const chatInputRef = ref<InstanceType<any>>(null)
const addDialog = () => {}

// 给每一个消息框都做一个事件委托
const messageWrapper = ref<InstanceType<typeof HTMLDivElement>>()
const copy2ClipBoard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    message.success('复制成功', 1)
  })
}
watch(messageWrapper, () => {
  messageWrapper.value?.addEventListener('click', (e: MouseEvent) => {
    if (e.target && e.target.classList.contains('copy-btn')) {
      copy2ClipBoard(e.target?.parentElement.innerText.replace('Copy\n', ''))
    }
  })
})

onMounted(() => {
  getDialogList()
  getMessageList(342)
})
</script>

<style lang="scss" scoped>
.layout_sider {
  height: 100%;
  position: relative;
  background-color: #fff;
  padding-left: 20px;
  padding-top: 6px;
  .dialogue_top {
    .addDialogue_btn {
      display: flex;
      align-items: center;
      background-color: #ebeff4;
      border-radius: 20px;
      height: 43px;
      font-size: 1rem;
      font-weight: 700;
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
        border-radius: 20px;
        padding: 14px 0 14px 14px;
        display: flex;
        align-items: center;
        &:hover {
          background-color: #f4f3f2;
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
      }
      .dialogue_item_select {
        background-color: #f4f3f2;
      }
    }
  }
}
.popover_resetName,
.popover_del {
  cursor: pointer;
  text-align: center;
  height: 40px;
  line-height: 20px;
  width: 90px;
  font-size: 13px;
  font-weight: 700;
  padding: 12px 0;
  &:hover {
    background-color: #f4f3f2;
  }
}
:deep(.dialogue_item .ant-popover) {
  .ant-popover-content .ant-popover-inner {
    border-radius: 10px;
    .ant-popover-inner-content {
      padding: 5px 0;
    }
  }
}
:deep(.layout_sider .ant-popover-placement-right) {
  .ant-popover-content .ant-popover-inner {
    border-radius: 10px;
    .ant-popover-inner-content {
      padding: 5px 0;
    }
  }
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

.layout_content {
  background-color: #fff;
  padding: 0 20px;
  .layout_content_main {
    background-color: #f3f6fc;
    height: 98%;
    border-radius: 30px;
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
          :deep(ol) {
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
            margin-bottom: 16px;
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
      min-height: 60px;
      border-radius: 10px;
      padding: 0.5rem 20px;
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
:deep(.ant-spin-text) {
  color: #87a2ff;
}
:deep(.ant-spin-dot-item) {
  background-color: #87a2ff;
}
:deep(.ant-modal > .ant-modal-content > .ant-modal-footer) {
  .ant-btn:hover {
    color: #87a2ff;
    border-color: #87a2ff;
  }
  .ant-btn-primary {
    background-color: #87a2ff;
    border-color: #87a2ff;
    &:hover {
      color: #fff;
      opacity: 0.9;
    }
  }
}

.main-chat-more {
  // display: none;
  position: absolute;
  width: 96%;
  display: flex;
  background-color: #fff;
  left: 50%;
  transform: translateX(-50%);
  bottom: 100px;
  border-radius: 13px;
  min-height: 40%;
  max-height: 50%;
  transition: all 0.3s linear;
  box-shadow: 0 2px 12px 3px rgba(0, 0, 0, 0.2);
  .main-chat-more__left {
    display: flex;
    flex-direction: column;
    width: 20%;
    max-width: 240px;
    border-right: 1px #f7f7f7 solid;
    position: relative;
    .main-chat-more__left-list {
      padding: 10px 12px;
      .main-chat-more__left-item {
        min-width: 100%;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        border-radius: 10px;
        margin-bottom: 10px;
        background-color: #fff;
        &:last-child {
          margin-bottom: 0;
        }
        &:hover {
          background-color: #f1f1f1;
        }
      }
      .active-item {
        background-color: #f1f1f1;
      }
    }
  }
  .main-chat-more__right {
    flex: 1;
    padding: 10px 12px;
    overflow: hidden;
    .main-chat-more__right-container {
      padding: 2px;
      overflow: auto;
      @include scrollBar;
      width: 100%;
      height: 100%;
      .main-chat-more__right-item {
        cursor: pointer;
        padding: 10px 12px;
        border-radius: 8px;
        margin-bottom: 5px;
        &:last-child {
          margin-bottom: 0;
        }
        &:hover {
          background-color: #f1f1f1;
        }
        .main-chat-more__right-item-header {
          font-weight: bold;
          font-size: 14px;
        }
        .main-chat-more__right-item-content {
          //@include ellipsis(1);
          font-size: 14px;
        }
      }
      .main-chat-more__right-option {
        padding: 10px 12px;
      }
      .main-chat-more__right-savebtn {
        background-color: #87a2ff;
        color: #fff;
        border: none;
        position: relative;
        left: 50%;
        transform: translate(-50%);
      }
      .language_model_item {
        width: 150px;
        cursor: pointer;
        background-color: #f2f2f2;
        display: inline-block;
        padding: 7px 13px;
        font-size: 14px;
        text-align: center;
        border-radius: 6px;
        margin-right: 15px;
        margin-top: 10px;
        .dropdown_icon {
          margin-left: 30px;
        }
      }
      .language_model_item_activite {
        background-color: #87a2ff;
        color: #fff;
      }
    }
  }
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
