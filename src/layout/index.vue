<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const menuList = [
  { id: 0, name: '主页', icon: 'home', path: '/home' },
  { id: 1, name: '知识库', icon: 'knowledgeBase', path: '/knowledge' },
  { id: 2, name: '文档', icon: 'tags', path: '/tags' },
]
const activeCategory = ref(0) // 当前目录激活
const clickMenu = (menu) => {
  activeCategory.value = menu.id
  router.push(menu.path)
}
</script>

<template>
  <div class="layout">
    <div class="left">
      <div class="top-icon">
        <img src="/vite.svg" width="24px" alt="" />
        <span>KMSD</span>
      </div>
      <ul class="catalog">
        <li v-for="menu in menuList" :key="menu.id" :class="{ active: activeCategory === menu.id }" @click="clickMenu(menu)">
          <SvgIcon :name="menu.icon" width="20px" height="20px"></SvgIcon>
          <span>{{ menu.name }}</span>
        </li>
      </ul>
      <div class="avatar">
        <img src="@/assets/avatar.jpg" alt="" />
      </div>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped lang="scss">
.layout {
  display: flex;
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
  height: 100vh;
  width: calc(100vw - 170px);
  overflow-y: scroll;
}
</style>
