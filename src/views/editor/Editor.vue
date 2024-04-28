<script setup lang="ts">
import { ref, onMounted, watch, defineProps } from 'vue'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import { message } from 'ant-design-vue'
const props = defineProps(['editContent'])
const vditor = ref<Vditor>()
interface Data {
  name: string
  url: string
}
interface Success {
  [key: string]: string
}
function reInitVditor() {
  vditor.value = new Vditor('editor-md', {
    cdn: '/vditor',
    height: '100%',
    width: '100%',
    placeholder: '君子藏器于身，待时而动',
    counter: {
      enable: true,
      type: 'markdown',
    },
    preview: {
      delay: 0,
      hljs: {
        style: 'monokai',
        lineNumber: true,
      },
      markdown: {
        toc: true,
        mark: true,
        footnotes: true,
        autoSpace: true,
      },
    },
    outline: {
      enable: true,
      position: 'right',
    },
    hint: {
      emojiPath: '/vditor/dist/images/emoji',
      emojiTail: '<a href="https://ld246.com/settings/function" target="_blank">设置常用表情</a>',
      emoji: {
        sd: '💔',
        j: 'https://cdn.jsdelivr.net/npm/vditor@1.3.1/dist/images/emoji/j.png',
      },
      parse: false,
      extend: [
        {
          key: '@',
          hint: (key: string) => {
            console.log(key)
            if ('vanessa'.indexOf(key.toLocaleLowerCase()) > -1) {
              return [
                {
                  value: '@Vanessa',
                  html: '<img src="https://avatars0.githubusercontent.com/u/970828?s=60&v=4" alt=""/> Vanessa',
                },
              ]
            }
            return []
          },
        },
        {
          key: '#',
          hint: (key: string) => {
            console.log(key)
            if ('vditor'.indexOf(key.toLocaleLowerCase()) > -1) {
              return [
                {
                  value: '#Vditor',
                  html: '<span style="color: #999;">#Vditor</span> ♏ 一款浏览器端的 Markdown 编辑器，支持所见即所得（富文本）、即时渲染（类似 Typora）和分屏预览模式。',
                },
              ]
            }
            return []
          },
        },
      ],
    },
    tab: '\t',
    upload: {
      accept: 'image/jpg, image/jpeg, image/png', // 规定上传的图片格式
      url: '/dev/upload', // 请求的接口
      multiple: false,
      fieldName: 'file',
      max: 5242880, // 上传图片的大小5M
      linkToImgUrl: '/dev/upload', // 粘贴图片请求接口
      // format 和 success error 不能一起定义 否则format不会执行
      format: (_: any, responseText: string) => {
        const { code, data } = JSON.parse(responseText)
        if (code === 200) {
          let success: Success = {}
          data.forEach((item: Data) => {
            success[item.name] = item.url // {name, url}
          })
          console.log(success)
          return JSON.stringify({
            msg: '',
            code: 0,
            data: {
              errFiles: [],
              succMap: success, // 一个对象 key[name] - value[url]
            },
          })
        }
        return 'false'
      },
      error(msg: string) {
        message.error(msg || '上传失败')
      },
    },
    toolbarConfig: {
      pin: true,
    },
    toolbar: [
      'headings',
      'bold',
      'italic',
      'strike',
      'link',
      'emoji',
      '|',
      'list',
      'ordered-list',
      'check',
      'outdent',
      'indent',
      '|',
      'quote',
      'line',
      'code',
      'inline-code',
      'insert-before',
      'insert-after',
      '|',
      'upload',
      'table',
      '|',
      'undo',
      'redo',
      '|',
      'outline',
      'export',
      {
        name: 'more',
        toolbar: ['edit-mode', 'preview', 'both', 'code-theme'],
      },
    ],
    cache: {
      /** 缓存 key，第一个参数为元素且启用缓存时必填 */
      id: 'cacheMd',
      /** 是否使用 localStorage 进行缓存。默认值: true */
      enable: true,
      /** 缓存后的回调 */
      after() {
        // console.log(markdown)
      },
    },
    after() {
      if (vditor.value) {
        vditor.value.setValue(content.value)
      }
    },
  })
}
onMounted(() => {
  window.addEventListener('resize', reInitVditor)
  reInitVditor()
})
const content = ref<string>('')
watch(
  props,
  (newVal: { editContent: any }) => {
    content.value = newVal.editContent
  },
  { immediate: true },
)
</script>

<template>
  <div class="edit-container">
    <div id="editor-md"></div>
  </div>
</template>

<style scoped lang="scss">
@import './editor-reset.scss';
.btn-check {
  margin-bottom: 20px;
}
.edit-container {
  width: 100%;
  height: 100%;
}
.vditor-content {
  font-size: 20px;
}
:deep(.vditor) {
  border: none;
  :deep(.vditor-toolbar--pin) {
    padding-left: 0 !important;
  }
}
:deep(.vditor-reset) {
  @include scrollBar();
}
:deep(.vditor-outline li > span) {
  font-size: 14px;
  svg {
    width: 12px;
    height: 8px;
  }
}
</style>
