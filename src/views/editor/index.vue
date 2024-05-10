<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCollapsedStore } from '@/stores/icon'
import PreviewEditor from './previewEditor.vue'
import Editor from './Editor.vue'
import KnowInfo from '@/views/knowBase/knowInfo.vue'
import { useRoute } from 'vue-router'
import { addTagForDoc, deleteTag, getContentById, getTagsById, updateArticle } from '@/api/article'
import { Tag } from '@/api/article/type'
import { message } from 'ant-design-vue'
const store = useCollapsedStore()
const closeDocMenu = () => {
  store.collapseMenu()
}
const type = ref('setting')
const edit = () => {
  type.value = 'edit'
}
const docId = ref<number>()
const save = () => {
  // type.value = 'preview'
  const content = localStorage.getItem('cacheMd')
  updateArticle(docId.value, {
    content,
  }).then(() => {
    getArticleContent(docId.value)
    message.success('保存文档成功')
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
const closeTag = async (tagId: number) => {
  const { data } = await deleteTag({
    tagId,
    articleId: docId.value,
  })
  if (data === 1) message.success('Tag removed successfully')
}
const newTag = ref('')
const addItem = async () => {
  const data = await addTagForDoc({
    articleId: docId.value,
    tagName: newTag.value,
  })
  if (data.code === 200) {
    message.success('Tag added successfully')
    getTagsName(docId.value)
  } else message.warning(data.message)
  newTag.value = ''
}
watch(
  () => route.params.articleId,
  (newVal) => {
    if (newVal) {
      type.value = 'preview'
      getArticleContent(+newVal)
      docId.value = +newVal
    } else type.value = 'setting'
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
        <div class="info-title">{{ type !== 'setting' ? docName : '知识库设置' }}</div>
        <div class="info-tags" v-if="type !== 'setting'">
          <a-tag
            :color="colors[Math.floor(Math.random() * colors.length)]"
            v-for="tag in tagsList"
            :key="tag.tagId"
            closable
            @close="closeTag(tag.tagId)"
          >
            {{ tag.tagName }}
          </a-tag>
        </div>
        <div style="padding: 4px 8px; width: 120px; margin-top: 2px" v-if="route.params.articleId">
          <a-input ref="inputRef" size="small" v-model:value="newTag" placeholder="enter tag" @pressEnter="addItem" />
        </div>
      </div>
      <div class="doc-btn" v-if="route.params.articleId">
        <div class="self-edit-btn" v-if="type === 'preview'" @click="edit">
          <SvgIcon name="edit"></SvgIcon>
          <span>编辑</span>
        </div>
        <div class="self-edit-btn" v-if="type === 'edit'" @click="type = 'preview'">
          <SvgIcon name="back" width="18px" height="18px"></SvgIcon>
          <span>返回</span>
        </div>
        <div class="self-edit-btn save-btn" v-if="type === 'edit'" @click="save">
          <SvgIcon name="save"></SvgIcon>
          <span>保存</span>
        </div>
      </div>
    </header>
    <div class="preview-content" id="content" v-if="type === 'preview'">
      <empty-status imageName="empty-content.webp" description="点击按钮进行编辑内容" v-if="!docContent">
        <template #operation>
          <a-button type="primary" @click="edit">Create Now</a-button>
        </template>
      </empty-status>
      <preview-editor v-else :preview="docContent"></preview-editor>
    </div>
    <div class="editor-content" id="editor" v-if="type === 'edit'">
      <editor :edit-content="docContent"></editor>
    </div>
    <div class="preview-content" v-if="type === 'setting'">
      <KnowInfo></KnowInfo>
    </div>
  </div>
</template>

<style scoped lang="scss">
.article {
  flex: 1;
  overflow: hidden;
}
.doc-header {
  padding: 8px 0 12px;
  display: flex;
  align-items: center;
  width: 100%;
  //background-color: #ffffff;
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
</style>
