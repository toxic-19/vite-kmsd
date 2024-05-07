<script setup lang="ts">
// import emptyPng from '../../assets/original.png'
import { ref } from 'vue'

const props = defineProps(['description', 'imageName'])
const emptyPng = ref('original.png')
console.log(props.imageName)
if (props.imageName) {
  emptyPng.value = props.imageName
}
</script>

<template>
  <div class="empty-status" :data-type="emptyPng">
    <img :src="'../../../src/assets/empty/' + emptyPng" alt="" />
    <div class="description">{{ props.description || '暂无内容' }}</div>
    <slot name="operation"></slot>
  </div>
</template>
<style scoped lang="scss">
.empty-status {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  img {
    height: 240px;
    object-fit: contain;
  }
}
.description {
  font-size: 16px;
  font-weight: bold;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
