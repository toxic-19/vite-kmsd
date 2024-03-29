<script setup lang="ts">
import { ref, onMounted, watch, defineProps } from 'vue'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
const props = defineProps(['editContent'])
const vditor = ref<Vditor>()
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
          hint: (key) => {
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
          hint: (key) => {
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
      url: '/upload', // 请求的接口
      multiple: false,
      fieldName: 'file',
      max: 2 * 1024 * 1024, // 上传图片的大小
      extraData: { token: localStorage.getItem('token') }, // 为 FormData 添加额外的参数
      linkToImgUrl: '/upload',
      filename(name) {
        return name
      },
      // validate(msg: string){
      //   return msg
      // },
      // 粘贴图片回显处理，如果有图片加了防盗链，则让后台代理替换成自己的图片
      linkToImgFormat(files) {
        const resData = JSON.parse(files)
        const code = resData.code
        const msg = resData.msg
        const data = resData.data
        // 上传图片请求状态
        if (code === '0') {
          const success = {}
          success[data.fileName] = data.url
          // 图片回显
          return JSON.stringify({
            msg,
            code,
            data: {
              errFiles: [],
              successMap: success,
            },
          })
        } else {
          console.log(msg + '上传失败了')
        }
      },
      // 上传图片回显处理
      format(files, responseText) {
        const resData = JSON.parse(responseText)
        const code = resData.code
        const msg = resData.msg
        const data = resData.data
        // 上传图片请求状态
        if (code === '0') {
          const success = {}
          success[data.fileName] = data.url
          // 图片回显
          return JSON.stringify({
            msg,
            code,
            data: {
              errFiles: [],
              successMap: success,
            },
          })
        } else {
          console.log(msg + '上传失败了')
        }
      },
      error(msg) {
        console.log(msg + '上传失败了')
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
      'fullscreen',
      'outline',
      'export',
      {
        name: 'more',
        toolbar: ['edit-mode', 'preview', 'both', 'code-theme'],
      },
    ],
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
  (newVal) => {
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
