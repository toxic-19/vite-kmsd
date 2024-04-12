<template>
  <a-layout style="width: 80%; height: 100%; margin: auto">
    <a-layout-sider width="19%">
      <div class="layout_sider">
        <div class="addDialogue">
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
        <div class="main_messageList" id="openai-chat-messgae-scroll-view">
          <div class="content_main_chatmessage" ref="messageWrapper">
            <div id="firstEl"></div>
            <div class="chatmessage_contant" v-for="(item, index) in messageList" :key="index">
              <div
                :class="{ chatmessageRight: item.role == 'user', chatmessageLeft: item.role == 'assistant' }"
                class="chatmessage"
                v-html="coverTextToHtml(item.content)"
                v-if="item.content"
              ></div>
              <div class="content_main_spin" v-else><a-spin tip="正在生成中..."></a-spin></div>
            </div>
          </div>
          <div id="msgEnd" style="height: 1px; overflow: hidden"></div>
        </div>
        <div
          :class="{ content_main_chat: true, content_main_chat_focus: isInputFocused }"
          ref="chatContainer"
          v-if="type !== 'speechToText'"
        >
          <div class="content_main_chat_container">
            <a-textarea
              style="border: none"
              v-model:value="messageInput"
              :placeholder="placeholderText"
              class="main_chat_input"
              @focus="onInputFocus"
              @blur="onInputBlur"
              v-on:keydown="inputKeyDownListener"
              :readonly="loadingsend"
              :autoSize="{ minRows: 1, maxRows: 6 }"
              ref="chattextarea"
            ></a-textarea>
            <div style="width: 2.4rem">
              <span v-if="!loadingsend">
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
import { nextTick, onMounted, reactive, ref } from 'vue'
import { dialogListResponse, DialogType, historyListResponse, MessageType } from './response.ts'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { Marked } from 'marked'
import hljs from 'highlight.js'
import { markedHighlight } from 'marked-highlight'
import 'highlight.js/styles/github-dark-dimmed.css'
import copyImage from '@/assets/svg/copy.svg'
import { message } from 'ant-design-vue'
import { sparkChat } from '@/api/spark'
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
  const scrollBox = document.getElementById('openai-chat-messgae-scroll-view') as HTMLElement
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
    result = result.replace(/<pre><code/g, `<pre style="position:relative;"><img src=${copyImage} class="copy-btn" alt=""><code`)
  }
  return result
}

// 输入
const messageInput = ref<string>('')
const placeholderText = ref<string>('在这里输入你的问题，当前模型：星火1.5')
const loadingsend = ref<boolean>(false)
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
  if (event.shiftKey && event.keyCode === 13) return
  if (event.keyCode === 13) sendChat()
}
// chat聊天事件
const sendChat = async () => {
  if (!messageInput.value.trim().length) {
    message.warn('请先输入内容再发送呢亲！')
    return
  }
  loadingsend.value = true
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
  console.log(chatParams)

  const fb = async (content) => {
    messageList.value[index - 1].content += content
    autoScrollBottomM.keep()
  }
  const doneFb = () => {
    autoScrollBottomM.close()
    loadingsend.value = false
  }
  const errFb = (error) => {
    messageList.value[index - 1].content = error.data || error.message || 'AI生成出错'
    autoScrollBottomM.close()
    loadingsend.value = false
  }
  sparkChat(chatParams, fb, doneFb, errFb)
  messageInput.value = ''
}

// 发起新对话
const chattextarea = ref<InstanceType<any>>(null)
const addDialog = () => {}
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
  .addDialogue {
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
.popover_resetname,
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
    .content_main_chatmessage {
      .chatmessage_contant {
        display: flex;
        .chatmessageLeft {
          padding: 20px;
          background-color: #ffffff;
          border-radius: 13px;
          margin: 12px 0;
          margin-right: auto;
        }
        .chatmessageRight {
          padding: 10px;
          background-color: #d3e3fd;
          border-radius: 13px;
          margin: 12px 0;
          margin-left: auto;
        }
        .chatmessage {
          :deep(pre) {
            white-space: pre-wrap;
            background-color: #fbfbfb;
            padding: 20px;
            border-radius: 13px;
            code {
              font-size: 14px;
              line-height: 28px;
              border-radius: 10px;
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
          }
        }
        .content_main_spin {
          position: relative;
          left: 50%;
          transform: translate(-50%);
        }
      }
    }
    .content_main_chat {
      position: relative;
      margin: 10px 30px 15px;
      min-height: 60px;
      border-radius: 26px;
      padding: 0.5rem 20px;
      background-color: #ffffff;
      border: 1px solid transparent;

      &:hover {
        border: 1px solid #87a2ff;
      }

      .content_main_chat_container {
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
    .content_main_chat_focus {
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
  box-shadow: 0px 2px 12px 3px rgba(0, 0, 0, 0.2);
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
  width: 28px;
  height: 28px;
  position: absolute;
  top: -4px;
  right: 10px;
  padding: 1px 5px;
  color: rgba(255, 255, 255, 0.8);
  border-radius: 5px;
  &:hover {
    cursor: pointer;
  }
}
</style>
