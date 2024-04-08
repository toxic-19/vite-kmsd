<script setup lang="ts">
import HeaderBar from './HeaderBar.vue'
</script>

<template>
  <div class="layout">
    <header-bar></header-bar>
    <div class="content">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component"></component>
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<style scoped lang="scss">
.layout {
  //display: flex;
  height: 100vh;
}
.left {
  width: 164px;
  padding: 12px 0;
  background-color: rgba(215, 211, 211, 0.28);
  position: relative;
  .top-icon {
    height: 64px;
    padding-left: 8px;
    font-size: 20px;
    span {
      letter-spacing: 1px;
      margin-left: 8px;
    }
  }
  .catalog {
    li {
      display: flex;
      align-items: center;
      padding: 10px 12px;
      line-height: 14px;
      cursor: pointer;
      &:hover {
        background-color: rgba(128, 128, 128, 0.2);
      }
      span {
        font-size: 15px;
        padding-left: 10px;
      }
    }
    .active {
      background-color: rgb(53, 190, 146, 0.2);
    }
  }
  .avatar {
    position: absolute;
    bottom: 20px;
    left: 10px;
    img {
      width: 40px;
      border-radius: 50%;
    }
  }
}
.content {
  height: calc(100vh - 50px);
  width: 100%;
  background-color: rgba(206, 216, 228, 0.4);
  overflow-y: scroll;
  @include scrollBar;
  @include scrollBarInX;
  position: relative;
}
</style>
