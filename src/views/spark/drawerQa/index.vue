<script setup lang="ts">
import { h, nextTick, onMounted, ref, watch } from 'vue'
import { LoadingOutlined, ReadOutlined, CopyOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark-reasonable.css'
import { getFileContentByDocId, getHistoryList, postSaveHistory } from '@/api/session/index.ts'
import { MessageType } from '../constant.ts'
import { useRoute } from 'vue-router'
import { chatWithDoc } from '@/api/spark/docsQa.ts'

const emit = defineEmits(['changeOpen'])
const messageList = ref<MessageType[]>([])
// 获取对话的聊天数据
const getMessageList = async (articleId: number) => {
  // nowSessionId.value = sessionId
  const { data } = await getHistoryList({ articleId })
  messageList.value = data
  messageList.value.forEach((item) => {
    if (item.content.includes('ai-image')) item.imageUrls = item.content.split('-img-')
  })
  await autoScrollBottom()
  return data
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
  if (scrollBox) {
    scrollBox.addEventListener('scroll', watchTopScroll)
  }
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
    result = result.replace(/<pre><code/g, `<pre style="position:relative;"><span class="copy-btn">Copy</span><code`)
  }
  return result
}
// 输入
const messageInput = ref<string>('')
const placeholderText = ref<string>('请输入对该文档的询问内容')
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
    userInput: messageInput.value,
    fileId: fileId.value,
    // sessionId: nowSessionId.value, // 会话id
  }
  const fb = (content: string) => {
    messageList.value[index - 1].content += content
    autoScrollBottomM.keep()
  }
  const doneFb = async (totalResults: string) => {
    // 保存此次对话的记录
    await postSaveHistory({
      articleId: route.params.articleId,
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
  await chatWithDoc(chatParams, fb, doneFb, errFb)
}

// 发起新对话
const chatInputRef = ref<InstanceType<any>>(null)
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
const open = ref<boolean>(false)
const drawerWidth = ref<number | string>(520)
const showDrawer = () => {
  open.value = true
}
const closeDrawer = () => {
  open.value = false
  drawerWidth.value = 520
}
const fullscreenIcon = ref('fullscreen')
const fullScreen = () => {
  drawerWidth.value = drawerWidth.value === '100%' ? 520 : '100%'
  fullscreenIcon.value = fullscreenIcon.value === 'fullscreen' ? 'close-fullscreen' : 'fullscreen'
}
const isShowSummary = ref<boolean>(true)
const showSummary = () => {
  isShowSummary.value = !isShowSummary.value
}
watch(open, (newVal) => {
  emit('changeOpen', newVal)
})
defineExpose({
  showDrawer,
  open,
})
const route = useRoute()
const summary = ref()
const fileId = ref()
const getSummary = async (articleId: number) => {
  const { code, data } = await getFileContentByDocId({ articleId })
  if (code === 200) {
    summary.value = data.summary
    fileId.value = data.fileId
    // 根据对应的fileId来获取聊天记录
    await getMessageList(articleId)
  }
}
watch(
  () => route.params.articleId,
  (newVal) => {
    getSummary(+newVal)
  },
)
onMounted(() => {
  const { articleId } = route.params
  getSummary(+articleId)
})
</script>

<template>
  <a-drawer
    title="欢迎来到AI文章问答"
    destroy-on-close
    :open="open"
    @close="closeDrawer"
    :mask="false"
    :headerStyle="{ padding: '10px 24px 6px' }"
    :bodyStyle="{ padding: '10px 20px 16px', background: '#f3f6fc' }"
    :width="drawerWidth"
  >
    <template #extra>
      <div class="extra-operate">
        <a-tooltip title="文档总结">
          <SvgIcon name="summary" width="20px" height="20px" @click="showSummary"></SvgIcon>
        </a-tooltip>
        <a-tooltip title="全屏">
          <SvgIcon :name="fullscreenIcon" width="18px" height="18px" @click="fullScreen"></SvgIcon>
        </a-tooltip>
      </div>
    </template>
    <div class="layout_content_main">
      <!-- 总结 -->
      <transition>
        <div class="doc-summary" v-if="isShowSummary">
          <div class="summary-title">
            <SvgIcon name="summary" width="16" height="16"></SvgIcon>
            <span class="title">以下为该文档的总结概要：</span>
            <a-button size="large" type="link" class="summary-btn" :icon="h(CopyOutlined)" @click="copy2ClipBoard(summary)">
              Copy
            </a-button>
          </div>
          <div class="summary-content">
            <div class="content" v-html="coverTextToHtml(summary)"></div>
            <div class="summary-restart">
              <div class="restart-tips">注意：如对以上生成内容不满意，可点击右侧按钮重新生成</div>
              <a-button size="large" type="link" class="summary-btn" :icon="h(ReadOutlined)" :autoInsertSpaceInButton="false">
                ReCap
              </a-button>
            </div>
          </div>
        </div>
      </transition>
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
        <div id="msgEnd" style="height: 10px; overflow: hidden"></div>
      </div>
      <div :class="{ main_chat: true, main_chat_focus: isInputFocused }" ref="chatContainer">
        <div class="main_chat_container">
          <a-textarea
            v-model:value="messageInput"
            :placeholder="placeholderText"
            :bordered="false"
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
  </a-drawer>
</template>

<style scoped lang="scss">
.extra-operate {
  display: flex;
  align-items: center;
  justify-content: center;
  grid-gap: 20px;
}
.doc-summary {
  padding: 10px 0 10px 10px;
  background-color: #fbfcff;
  border-radius: 8px;
  box-shadow: 4px 7px 12px 3px rgba(76, 99, 140, 0.4);
  width: 100%;
  .summary-title {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    .title {
      font-size: 15px;
      line-height: 16px;
      font-weight: bold;
    }
  }
  .summary-btn {
    margin-left: auto;
    cursor: pointer;
    display: flex;
    align-items: center;
    :deep(span) {
      font-size: 15px;
    }
  }
  .summary-content {
    width: 100%;
    max-height: 220px;
    padding: 0 10px;
    overflow-y: scroll;
    @include scrollBar;
    .content {
      padding-bottom: 10px;
      :deep(p) {
        padding: 2px 0;
        font-size: 14px;
        line-height: 26px;
      }
    }
    .summary-restart {
      display: flex;
      align-items: center;
      .restart-tips {
        flex: 1;
        color: rgba(76, 99, 140, 0.9);
        font-size: 13px;
      }
    }
  }
}
.layout_content_main {
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  .main_messageList {
    overflow-y: auto;
    flex: 1;
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
    margin: 10px 20px;
    border-radius: 12px;
    padding: 0.5rem 10px;
    background-color: #ffffff;
    border: 1px solid #cccccc;

    &:hover {
      border: 1px solid #87a2ff;
    }

    .main_chat_container {
      display: flex;
    }
    .main_chat_input {
      flex: 1;
      line-height: 22px;
      resize: none;
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
:deep(.ant-drawer .ant-drawer-header) {
  padding: 8px 24px;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 1s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
