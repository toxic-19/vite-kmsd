<script setup lang="ts">
const targetFn = () => {
  console.log(document.getElementById('scroll'))
  return document.getElementById('scroll')
}
</script>

<template>
  <div id="scroll" :style="{ height: '500vh', padding: '10px' }">
    <div>Scroll to bottom</div>
    <div>Scroll to bottom</div>
    <div>Scroll to bottom</div>
    <div>Scroll to bottom</div>
    <div>Scroll to bottom</div>
    <div>Scroll to bottom</div>
    <div>Scroll to bottom</div>
    <div class="backTop">
      <a-back-top :target="targetFn" :visibilityHeight="120" style="z-index: 999" />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
