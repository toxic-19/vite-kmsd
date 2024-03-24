<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Vditor from 'vditor'
import 'vditor/dist/index.css'

const vditor = ref<Vditor>()
function reInitVditor() {
  vditor.value = new Vditor('editor-md', {
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
    },
    outline: {
      enable: true,
      position: 'right',
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
  })
}
onMounted(() => {
  window.addEventListener('resize', reInitVditor)
  reInitVditor()
})
</script>

<template>
  <div class="edit-container">
    <div id="editor-md"></div>
  </div>
</template>

<style scoped lang="scss">
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
#editor-md {
  :deep(.vditor-reset) {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
      'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  }
  :deep(.vditor-reset pre > code) {
    overflow-y: scroll;
    @include scrollBar;
  }
  :deep(.vditor-toolbar.vditor-toolbar--pin) {
    padding-left: 20px !important;
  }
  :deep(.vditor-ir pre.vditor-reset:focus) {
    background-color: #fff;
  }
  :deep(p) {
    font-size: 15px;
    margin-bottom: 12px;
    line-height: 30px;
  }
  :deep(span) {
    font-size: 14px;
    * {
      font-size: 14px;
    }
  }
  :deep(li) {
    font-size: 14px;
  }
  :deep(table) {
    th,
    td {
      font-size: 14px;
    }
  }
}
:deep(.vditor) {
  border: none;
  :deep(.vditor-toolbar--pin) {
    padding-left: 0 !important;
  }
}
:deep(.vditor-reset) {
  @include scrollBar;
}
:deep(.vditor-outline li > span) {
  font-size: 14px;
  svg {
    width: 12px;
    height: 8px;
  }
}
</style>
