<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { getTagList } from '@/api/tag'
import { Article, Tag } from './contant.ts'
import { getArticleByTagId } from '@/api/article'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/foundation.css'
import { useRandomColorStore } from '@/stores/colors'
const store = useRandomColorStore()
// 获取tag列表
const showTagList = ref<Array<Tag>>([])
const allTagList = ref<Array<Tag>>([])
const selectedTagId = ref<number>()
let savedList = JSON.parse(localStorage.getItem('checkedTagList') as string)
const getTagsList = async () => {
  const savedList = JSON.parse(localStorage.getItem('checkedTagList') as string)
  const { data } = await getTagList()
  allTagList.value = data
  showTagList.value = data?.filter((item) => savedList.includes(item.tagName))
  selectTag(showTagList.value[0])
  treeData.value = data.map((item) => item.tagName)
}
const articleList = ref<Array<Article>>([])
const selectTag = (item: Tag) => {
  selectedTagId.value = item.id
  getArticleByTagId({ tagId: item.id }).then(({ data }) => {
    articleList.value = data
  })
}

// marked使用
const render = new marked.Renderer()
marked.setOptions({
  renderer: render,
  gfm: true,
  pedantic: false,
  sanitize: false,
  highlight: (code: string, lang: string) => {
    const language = hljs.getLanguage(lang) ? lang : 'html'
    return hljs.highlight(code, { language }).value
  },
})
const toHtml = (value: string) => {
  return marked.parse(value || '')
}
const colorsList = ref<string[]>([])

// 树选择展示
const treeData = ref<Array<string | undefined>>([])
const visible = ref<boolean>(false)
const state = reactive({
  indeterminate: true,
  checkAll: false,
  checkedList: savedList || [],
})
const onCheckAllChange = (e: any) => {
  Object.assign(state, {
    checkedList: e.target.checked ? treeData.value : [],
    indeterminate: false,
  })
}
watch(
  () => state.checkedList,
  (val) => {
    state.indeterminate = !!val.length && val.length < treeData.value.length
    state.checkAll = val.length === treeData.value.length
    localStorage.setItem('checkedTagList', JSON.stringify(state.checkedList))
    getTagsList()
  },
)
const dropdownClick = () => {
  visible.value = true
}
onMounted(async () => {
  await getTagsList()
  store.getColors(allTagList.value.length)
  colorsList.value = store.colorsList
})

const targetFn = () => {
  return document.querySelector('.content') // 监听滚动的容器
}
</script>

<template>
  <div class="tags">
    <div
      class="tag-item"
      v-for="tag in showTagList"
      :key="tag.id"
      :class="{ 'tag-active': tag.id === selectedTagId }"
      @click="selectTag(tag)"
    >
      {{ tag.tagName }}
    </div>
    <div class="dropdown">
      <a-dropdown v-model:open="visible" placement="bottomLeft" :arrow="{ pointAtCenter: true }">
        <a class="ant-dropdown-link" @click.prevent>
          <SvgIcon name="choose-tag" width="24px" height="30px"></SvgIcon>
        </a>
        <template #overlay>
          <div class="select-box" @click="dropdownClick">
            <a-checkbox v-model:checked="state.checkAll" :indeterminate="state.indeterminate" @change="onCheckAllChange">
              Show all
            </a-checkbox>
            <a-checkbox-group v-model:value="state.checkedList" :options="treeData" />
          </div>
        </template>
      </a-dropdown>
    </div>
    <a-tooltip title="标签管理" placement="bottom">
      <SvgIcon name="tag-manager" width="24px" height="30px"></SvgIcon>
    </a-tooltip>
  </div>
  <div class="article-content">
    <div class="doc-item" v-for="doc in articleList" :key="doc.id">
      <div class="item-header">
        <div class="title">
          <SvgIcon name="title" width="26px" height="26px"></SvgIcon>
          <span>{{ doc.title }}</span>
        </div>
        <a-tooltip :title="doc.description">
          <div class="description">
            <SvgIcon name="desc1" width="10px"></SvgIcon>
            <span class="desc">{{ doc.description }}</span>
            <SvgIcon name="desc2" width="10px"></SvgIcon>
          </div>
        </a-tooltip>
      </div>
      <div class="short-content single_message" v-html="toHtml(doc.content)"></div>
      <div class="other">
        <div class="create-time time">
          <SvgIcon name="createdAt" width="18px" height="18px"></SvgIcon>
          {{ new Date(doc.createdAt).toLocaleString() }}
        </div>
        <div class="update-time time">
          <SvgIcon name="updatedAt" width="18px" height="18px"></SvgIcon>
          {{ new Date(doc.updatedAt).toLocaleString() }}
        </div>
      </div>
    </div>
    <a-back-top :target="targetFn" :visibilityHeight="50" />
  </div>
  <div class="empty-status" v-if="!articleList.length">
    <empty-status imageName="empty-content.webp" description="该标签暂无所属文档列表"></empty-status>
  </div>
</template>

<style scoped lang="scss">
.tags,
.article-content {
  margin: 0 auto;
  width: 76%;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background-color: #fff;
  margin-top: 40px;
  border-radius: 10px;
  padding: 6px 0;
  .tag-item {
    text-align: center;
    font-size: 12px;
    padding: 4px 8px;
    margin: 6px 8px;
    border: 1px solid transparent;
    border-radius: 4px;
    background-color: #ffffff;
    cursor: pointer;
    transition: all 0.2s;
    opacity: 80%;
    &:hover {
      background-color: #f1f5f9;
    }
    &.tag-active {
      background-color: #f1f5f9 !important;
      //border: 1px solid #06a8ee;
      //color: #06a8ee;
      //font-weight: bold;
      font-size: 13px;
      //transform: scale(1.2);
    }
  }
}
.article-content {
  padding-top: 30px;
  display: flex;
  flex-wrap: wrap;
  column-gap: 24px;
  .doc-item {
    margin-bottom: 20px;
    padding: 16px 20px;
    width: calc(50% - 12px);
    overflow: hidden;
    border-radius: 10px;
    box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    transition: all 0.3s;
    background-color: #fff;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    &:hover {
      box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.2);
    }
    .item-header {
      display: flex;
      .title {
        min-width: 250px;
        display: flex;
        align-items: center;
        span {
          font-size: 20px;
          margin: 0 30px 0 6px;
          line-height: 24px;
          color: #333333;
          font-family:
            microsoft yahei,
            serif;
          font-weight: 700;
          letter-spacing: 0.2px;
          text-align: left;
          position: relative;
          &::after {
            content: '';
            position: absolute;
            width: 110%;
            height: 3px;
            bottom: -4px;
            left: -5%;
            background-color: #64acf3;
            visibility: hidden;
            transform: scaleX(0);
            transition: 0.3s ease-in-out;
          }
          &:hover::after {
            visibility: visible;
            transform: scaleX(1);
          }
        }
      }
      .description {
        align-self: end;
        @include textOverflow;
      }
    }
    .short-content {
      flex: 1;
      color: #666666;
      font-size: 14px;
      line-height: 20px;
      margin: 18px 10px 18px 4px;
      overflow: hidden;
      @include multilineEllipsis(8);
      :deep(img) {
        width: 100px;
      }
      :deep(pre) {
        background-color: rgba(222, 229, 235, 0.6);
        border-radius: 4px;
        line-height: 22px;
      }
      //&::before {
      //  position: absolute;
      //  left: 0;
      //  top: 0;
      //  width: 3px;
      //  height: 100%;
      //  background: rgba(76, 99, 140, 0.84);
      //  content: ' ';
      //}
    }
    .description {
      display: flex;
      .svg-icon {
        margin: 0 4px;
      }
      .desc {
        @include textOverflow;
      }
    }
    .other {
      display: flex;
      .time {
        display: flex;
        height: 20px;
        margin-right: 20px;
      }
      .svg-icon {
        margin-right: 5px;
      }
    }
  }
  .doc-simple-item {
    width: 180px;
    height: 232px;
    background-image: url('@/assets/doc-bg.png');
    background-size: contain;
    position: relative;
    .title {
      /* 最多七个字 */
      width: 100px;
      position: absolute;
      left: 30px;
      top: 30px;
      text-align: center;
      color: #ffffff;
      font-weight: bold;
    }
  }
}
.empty-status {
  //height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  :deep(img) {
    width: 260px;
  }
}
.dropdown {
  margin-left: auto;
  margin-right: 16px;
}
.select-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 6px;
  width: 200px;
  height: 300px;
  padding: 10px 0;
  overflow-y: scroll;
  z-index: 99;
  background-color: #ffffff;
  border: 1px solid rgba(76, 99, 140, 0.4);
  border-radius: 6px;
  @include scrollBar;
}
:deep(.ant-checkbox-wrapper) {
  width: 150px;
}
:deep(.ant-checkbox-group) {
  flex-direction: column;
  row-gap: 6px;
}
</style>
