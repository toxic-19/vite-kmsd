<script setup lang="ts">
import { getKnowListInfo } from '@/api/knowBase'
import { onMounted, ref } from 'vue'
const knowList = ref([])
const getBaseList = async () => {
  const { data } = await getKnowListInfo()
  knowList.value = data
}
onMounted(() => {
  getBaseList()
})
</script>

<template>
  <div class="flex-container">
    <div class="base-item" v-for="base in knowList" :key="base.knowId" :style="{ backgroundImage: `url(${base.coverImage})` }">
      <div class="item-content">
        <div class="title">{{ base.title }}</div>
        <div class="desc">{{ base.description }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.flex-container {
  display: flex;
  padding: 24px;
  .base-item {
    width: 140px;
    height: 196px;
    margin-right: 24px;
    margin-bottom: 24px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.3s ease-out;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(31, 35, 41, 0.1);
    background-repeat: no-repeat;
    background-position: 50% 50%;
    &:hover {
      box-shadow: 4px 6px 6px rgba(31, 35, 41, 0.3);
    }
  }
  .item-content {
    margin-top: 16px;
    .title {
      font-size: 15px;
      font-weight: bold;
      padding-bottom: 6px;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      word-break: break-word;
    }
    .desc {
      font-size: 13px;
    }
  }
}
</style>
