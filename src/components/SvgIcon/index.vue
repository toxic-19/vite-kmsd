<script setup lang="ts">
import { defineProps } from 'vue'

defineProps({
  prefix: {
    type: String,
    default: '#icon-', // xlink:href属性值的前缀
  },
  name: String, // svg矢量图的名字
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
  <div class="svg-icon">
    <svg :style="{ width: width, height: height }">
      <use :xlink:href="prefix + name" :fill="color"></use>
    </svg>
  </div>
</template>

<style scoped lang="scss">
.svg-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
