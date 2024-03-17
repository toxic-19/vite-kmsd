<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps(['groupData', 'articleData'])
const allData = [...props.groupData, ...props.articleData]
const childrenData = [
  {
    articleId: 1,
    title: '产品授权说明',
    description: '商业授权及价格',
  },
  {
    articleId: 2,
    title: '关于zyplayer-doc项目',
    description: '关于zyplayer-doc项目',
  },
]
</script>

<template>
  <div class="tree-item" v-for="item in allData" :key="item">
    <div class="doc-content" v-if="item.articleId">
      <div class="title">
        <SvgIcon name="md" width="13px" height="13px"></SvgIcon>
        <div class="name">{{ item.title }}</div>
      </div>
    </div>
    <div class="group-content" v-else>
      <div class="title">
        <SvgIcon name="collapsed" width="12px" height="12px" class="group-icon"></SvgIcon>
        <div class="name">{{ item.groupName }}</div>
      </div>
      <div class="doc-content children-doc">
        <template v-for="child in childrenData" :key="child.id">
          <a-tooltip :title="child.title" color="#bab3c3">
            <div class="title">
              <SvgIcon name="md" width="13px" height="13px"></SvgIcon>
              <div class="name">{{ child.title }}</div>
            </div>
          </a-tooltip>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tree-item {
  margin-left: 20px;
  cursor: pointer;
  div {
    font-size: 13px;
  }
}
.doc-content,
.group-content {
  .title {
    padding: 6px 10px;
    display: flex;
    align-items: center;
    border: 1px solid transparent;
    transition: all 0.3s;
    .name {
      padding-left: 10px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &:hover {
      background: rgba(201, 201, 209, 0.4);
      border-radius: 4px;
      border: 1px solid #bab3c3;
    }
  }
  .svg-icon {
    padding: 5px;
  }
}
.children-doc {
  padding-left: 20px;
}
.group-icon:hover {
  background-color: #d4d4d9;
  border-radius: 3px;
}
</style>
