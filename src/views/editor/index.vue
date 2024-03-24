<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCollapsedStore } from '@/stores/icon'
import PreviewEditor from './previewEditor.vue'
import Editor from './editor.vue'
import { useRoute } from 'vue-router'
import request from '@/utils/request'
const store = useCollapsedStore()
const closeDocMenu = () => {
  store.collapseMenu()
}
const type = ref('preview')
const edit = () => {
  type.value = 'edit'
}
const save = () => {
  type.value = 'preview'
}
const docName = ref('')
const docContent = ref('')
const route = useRoute()
const getArticleContent = async (articleId: number) => {
  const { data } = await request(`/article/articleId/${articleId}`)
  docContent.value = data?.content
  docName.value = data?.title
}
watch(
  () => route.params.articleId,
  (newVal) => {
    type.value = 'preview'
    getArticleContent(+newVal)
  },
  { immediate: true },
)
</script>

<template>
  <div class="article">
    <header class="doc-header">
      <div class="doc-icon" @click="closeDocMenu">
        <SvgIcon name="menu-collapsed" width="20px" height="20px"></SvgIcon>
      </div>
      <div class="doc-info">
        <div class="info-title">{{ docName }}</div>
        <div class="info-tags">
          <a-tag color="pink">Vue2</a-tag>
          <a-tag color="red">Vue3</a-tag>
          <a-tag color="orange">JS</a-tag>
        </div>
      </div>
      <div class="doc-btn">
        <div class="self-edit-btn" @click="edit">
          <SvgIcon name="edit"></SvgIcon>
        </div>
        <div class="self-edit-btn save-btn" @click="save">
          <SvgIcon name="save"></SvgIcon>
        </div>
      </div>
    </header>
    <div class="preview-content" id="content" v-if="type === 'preview'">
      <preview-editor :preview="docContent"></preview-editor>
    </div>
    <div class="editor-content" id="editor" v-else>
      <editor :edit-content="docContent"></editor>
    </div>
  </div>
</template>

<style scoped lang="scss">
.article {
  width: 100%;
}
.doc-header {
  padding: 8px 0 12px;
  display: flex;
  align-items: center;
  width: 100%;
  background-color: #ffffff;
  top: 0;
  z-index: 10;
  .doc-info {
    display: flex;
    align-items: center;
    width: calc(100% - 140px);
    height: 100%;
    .info-title {
      color: rgba(0, 0, 0, 0.85);
      font-weight: 600;
      font-size: 20px;
      line-height: 32px;
      margin-right: 10px;
    }
    .info-tags {
      display: flex;
      cursor: pointer;
    }
  }
  .doc-btn {
    display: flex;
    .self-edit-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 32px;
      padding: 5px 10px;
      border: 1px solid #4b638a;
      border-radius: 6px;
      cursor: pointer;
      margin-right: 10px;
      span {
        font-size: 14px;
        padding-left: 10px;
        padding-right: 6px;
      }
      &:hover {
        background: #f8f6f6;
      }
    }
    .save-btn {
      color: #ffffff;
      background: #1758ee;
      &:hover {
        background: rgba(23, 88, 238, 0.8);
      }
    }
  }
  .doc-icon {
    .svg-icon {
      margin-right: 10px;
      padding: 10px;
      cursor: pointer;
    }
  }
}
.preview-content,
.editor-content {
  width: 100%;
  height: calc(100vh - 70px);
  padding-left: 20px;
  overflow-y: scroll;
  @include scrollBar;
}
#editor {
  padding-left: 0;
}
</style>
