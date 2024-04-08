<script setup lang="ts">
import { defineProps } from 'vue'

defineProps({
  prefix: {
    type: String,
    default: '#icon-', // xlink:href属性值的前缀
  },
  name: String, // svg矢量图的名字
  text: String,
  color: {
    type: String,
    default: 'green', // svg图标的颜色
  },
  width: {
    type: String,
    default: '16px', // svg宽度
  },
  height: {
    type: String,
    default: '16px',
  },
})
</script>

<template>
  <div class="svg-icon" :data-type="prefix + name">
    <svg :style="{ width: width, height: height }">
      <use :xlink:href="prefix + name" :fill="color"></use>
    </svg>
    <span class="text">{{ text }}</span>
  </div>
</template>

<style scoped lang="scss">
.svg-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  grid-gap: 4px;
  .text {
    color: #313c52;
    font-family: cursive;
    font-size: 16px;
  }
}
</style>
