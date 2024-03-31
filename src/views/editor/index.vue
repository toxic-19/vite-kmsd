<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCollapsedStore } from '@/stores/icon'
import PreviewEditor from './previewEditor.vue'
import Editor from './editor.vue'
import { useRoute } from 'vue-router'
import { getContentById, getTagsById, updateArticle } from '@/api/article'
import { Tag } from '@/api/article/type'
import emptyPng from '@/assets/empty.png'
import { message } from 'ant-design-vue'
const store = useCollapsedStore()
const closeDocMenu = () => {
  store.collapseMenu()
}
const type = ref('preview')
const edit = () => {
  type.value = 'edit'
}
const docId = ref<number>()
const save = () => {
  // type.value = 'preview'
  const content = localStorage.getItem('cacheMd')
  console.log(content)
  updateArticle(docId.value, {
    content,
  }).then(() => {
    getArticleContent(docId.value)
    message.success('上传成功')
    type.value = 'preview'
  })
}
const docName = ref('')
const docContent = ref('')
const route = useRoute()
const getArticleContent = async (articleId: number) => {
  const { data } = await getContentById({ articleId })
  docContent.value = data?.content || ''
  docName.value = data?.title
  await getTagsName(articleId)
}
const tagsList = ref<Tag[]>([])
const colors = ref(['#4a6288', '#80abd5', '#aecfe2', '#bab3c3', '#c6c9d2', '#a3acbc', '#ff5900', '#f8c01a', '#74bb8a', '#08521f'])
const getTagsName = async (articleId: number) => {
  const { data } = await getTagsById({ articleId })
  tagsList.value = data
}
watch(
  () => route.params.articleId,
  (newVal) => {
    type.value = 'preview'
    if (newVal) {
      getArticleContent(+newVal)
      docId.value = +newVal
    }
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
          <a-tag :color="colors[Math.floor(Math.random() * colors.length)]" v-for="tag in tagsList" :key="tag.tagId">{{ tag.tagName }}</a-tag>
        </div>
      </div>
      <div class="doc-btn">
        <div class="self-edit-btn" v-if="type === 'preview'" @click="edit">
          <SvgIcon name="edit"></SvgIcon>
          <span>编辑</span>
        </div>
        <div class="self-edit-btn save-btn" v-else @click="save">
          <SvgIcon name="save"></SvgIcon>
          <span>保存</span>
        </div>
      </div>
    </header>
    <div class="preview-content" id="content" v-if="type === 'preview'">
      <a-empty v-if="!docContent" :image="emptyPng" :image-style="{ height: '200px' }">
        <template #description>暂无内容</template>
        <a-button type="primary" @click="edit">Create Now</a-button>
      </a-empty>
      <preview-editor v-else :preview="docContent"></preview-editor>
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
      min-width: 90px;
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
  height: calc(100vh - 60px);
  padding-left: 20px;
  overflow-y: scroll;
  @include scrollBar();
}
#editor {
  padding-left: 0;
}
:deep(.ant-empty) {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .ant-empty-description {
    font-size: 18px;
    color: #4a6288;
    font-weight: bold;
    font-family: -apple-system, serif;
    margin-top: 10px;
  }
}
</style>
