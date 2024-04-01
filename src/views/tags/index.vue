<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getTagList } from '@/api/tag'
import { Article, Tag } from './contant.ts'
import { getArticleByTagId } from '@/api/article'
// 获取tag列表
const tagList = ref<Array<Tag>>([])
const selectedTagId = ref<number>()
const getTagsList = async () => {
  const { data } = await getTagList()
  tagList.value = data
  selectedTagId.value = data[0].id
}
const articleList = ref<Array<Article>>([])
const selectTag = (item: Tag) => {
  selectedTagId.value = item.id
  getArticleByTagId({ tagId: item.id }).then(({ data }) => {
    articleList.value = data
  })
}
onMounted(() => {
  getTagsList()
})
</script>

<template>
  <div class="tags">
    <div
      class="tag-item"
      v-for="tag in tagList"
      :key="tag.id"
      :class="{ 'tag-active': tag.id === selectedTagId }"
      @click="selectTag(tag)"
    >
      {{ tag.tagName }}
    </div>
  </div>
  <div class="empty-status" v-if="!articleList.length">
    <empty-status></empty-status>
  </div>
  <div class="article-content">
    <div class="doc-item" v-for="doc in articleList" :key="doc.id">
      <div class="item-header">
        <div class="title">
          <SvgIcon name="title"></SvgIcon>
          <span>{{ doc.title }}</span>
        </div>
        <div class="description">
          <SvgIcon name="desc1" width="10px"></SvgIcon>
          {{ doc.description }}
          <SvgIcon name="desc2" width="10px"></SvgIcon>
        </div>
      </div>
      <div class="short-content">
        {{ doc.content }}
      </div>
      <div class="other">
        <div class="create-time time">
          <SvgIcon name="createdAt" width="18px" height="18px"></SvgIcon>
          {{ doc.createdAt }}
        </div>
        <div class="update-time time">
          <SvgIcon name="updatedAt" width="18px" height="18px"></SvgIcon>
          {{ doc.updatedAt }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tags,
.article-content {
  margin: 0 auto;
  width: 76%;
  padding-top: 40px;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  .tag-item {
    min-width: 70px;
    text-align: center;
    font-size: 12px;
    padding: 4px 12px;
    margin: 6px 4px;
    border: 1px solid #0b8235;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s;
    &.tag-active {
      background-color: #ace1f5;
      color: #06a8ee;
      font-size: 13px;
    }
  }
}
.article-content {
  padding-top: 30px;
  .doc-item {
    margin: 0 auto 20px;
    padding: 16px 20px;
    width: 100%;
    overflow: hidden;
    border-radius: 10px;
    box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    transition: all 0.3s;
    background-color: #fff;
    cursor: pointer;
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
          margin: 0 30px 0 10px;
          line-height: 24px;
          color: #333333;
          font-family: microsoft yahei;
          font-weight: 700;
          letter-spacing: 0.2px;
          text-align: left;
        }
      }
      .description {
        align-self: end;
      }
    }
    .short-content {
      color: #666666;
      font-size: 14px;
      line-height: 20px;
      margin: 18px 10px 18px 4px;
      overflow: hidden;
      @include multilineEllipsis(2);
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
    }
    .other {
      display: flex;
      .time {
        display: flex;
        align-items: center;
        height: 20px;
        margin-right: 20px;
      }
      .svg-icon {
        margin-right: 5px;
      }
    }
  }
}
.empty-status {
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
