<script setup lang="ts">
import emptyPng from '@/assets/original.png'
const props = defineProps(['description'])
</script>

<template>
  <a-empty :image="emptyPng" :image-style="{ height: '200px' }">
    <template #description>{{ props.description || '暂无内容' }}</template>
  </a-empty>
</template>
<style scoped lang="scss">
:deep(.ant-empty) {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
:deep(.ant-empty-description) {
  font-size: 18px;
  color: #4a6288;
  font-weight: bolder;
  font-family: -apple-system, serif;
  margin-top: 10px;
}
</style>
