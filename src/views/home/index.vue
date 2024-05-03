<template>
  <div class="home">
    <div class="main flex relative">
      <div class="left">
        <div class="app-name">《基于Vue3+Nest的在线知识库管理系统》毕业设计</div>
        <div class="card">
          <div class="bg"></div>
          <div class="blob">
            <img src="@/assets/logo.png" class="title-image" alt="" />
          </div>
        </div>
        <div class="title typing">——全功能AI智能知识库服务解决方案</div>
        <div class="description">
          <p>融合了集成知识库、文档管理、AI对话、文档对话、项目监控以及甘特图控制等功能</p>
          <p>每一项功能都旨在简化工作流程，提升工作效率，最终实现资源的最大化利用</p>
        </div>
      </div>
      <div class="right"></div>
    </div>
    <div class="image-word">
      <img src="@/assets/home-bg1.png" alt="5555" />
      <div class="message-forImage">
        <SvgIcon name="ai-chat" width="120px" height="120px"></SvgIcon>
        <div class="item-title">AI对话</div>
        <div class="item-line"></div>
        <div class="item-description">无所不知，身边的智囊团，最全面的建议与支持。</div>
      </div>
    </div>
    <div class="image-word">
      <div class="message-forImage">
        <SvgIcon name="know-docs" width="120px" height="120px"></SvgIcon>
        <div class="item-title">知识库-文档管理</div>
        <div class="item-line"></div>
        <div class="item-description">智慧的源泉，有序的信息架构，神清气爽地汲取知识。</div>
      </div>
      <img src="@/assets/home-bg3.png" alt="5555" />
    </div>
    <div class="image-word">
      <img src="@/assets/home-bg2.png" alt="5555" />
      <div class="message-forImage">
        <SvgIcon name="task-gatte" width="120px" height="120px"></SvgIcon>
        <div class="item-title">任务-甘特图</div>
        <div class="item-line"></div>
        <div class="item-description">监控项目进度，轻而易举调整时间。</div>
      </div>
    </div>
    <div class="animate-container">
      <div class="animate-group" v-for="(line, index) in ANIMATION_DATA" :key="line.title">
        <div
          v-for="item in line"
          :key="item.title"
          :class="`
              animate-item
              animate-item-${index}`"
        >
          <img width="24" :src="item.image" alt="" />
          <span class="text">{{ item.title }}</span>
        </div>
      </div>
    </div>
    <div class="list">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="item"
        :style="{ backgroundImage: 'url(src/assets/' + item.icon + ')' }"
      >
        <div class="item-content">
          <img :src="'src/assets/' + item.icon" class="item-icon" alt="" />
          <div class="item-title">{{ item.title }}</div>
          <div class="item-line"></div>
          <div class="item-description">{{ item.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { ANIMATION_DATA } from '@/utils/map.ts'

const list = ref([
  {
    title: '知识库-文档管理',
    description: '智慧的源泉，有序的信息架构',
    icon: 'knowledge.webp',
  },
  {
    title: '文档问答',
    description: '智能的交流体验，快速的文档概要',
    icon: 'docs.webp',
  },
  {
    title: 'AI对话',
    description: '智能AI接口使用自然语言查询信息，满足用户对话需求',
    icon: 'ai.webp',
  },
  {
    title: '项目-甘特图',
    description: '掌控项目细节，统筹项目时间表',
    icon: 'project.webp',
  },
])
</script>
<style lang="scss" scoped>
@import './animation.scss';
.home {
  background-color: rgba(100, 172, 243, 0.1);
}
.main {
  display: flex;
  padding: 60px 120px 20px;
  background-image: url('@/assets/cover.png');
  background-size: 36%;
  background-position: 810px 30px;
  background-repeat: no-repeat;
  .left {
    flex: 1;
    height: 320px;
    margin-top: 20px;
    background-image: url('@/assets/arrow-bg.png');
    background-repeat: no-repeat;
    background-position: left bottom;
    .app-name {
      height: 60px;
      font-size: 20px;
      font-weight: bold;
      font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
      letter-spacing: 1px;
      code {
        font-size: 22px;
        font-weight: bold;
        background-color: #fff0f0;
      }
    }
    .title-image {
      height: 40px;
    }
    .title {
      font-size: 20px;
      color: #222222;
      line-height: 50px;
      margin-left: 200px;
      margin-top: 14px;
    }
    .description {
      margin-top: 16px;
      margin-left: 36px;
      margin-bottom: 16px;
      p {
        font-size: 15px;
        color: #5d5d5d;
        margin-bottom: 8px;
      }
    }
  }
  .right {
    width: 510px;
    height: 338px;
    border-radius: 12px;
  }
}
.image-word {
  display: flex;
  margin: 30px 100px;
  padding-bottom: 40px;
  .message-forImage {
    margin-left: 30px;
    margin-right: 30px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }
  img {
    border-radius: 22px;
    height: 450px;
  }
  .item-title {
    font-size: 32px;
  }
  .item-line {
    margin: 8px 0 16px;
    width: 40px;
  }
}
.animate-container {
  .animate-group {
    display: flex;
    justify-content: center;
    margin-top: 16px;
  }
  .animate-item {
    display: flex;
    align-items: center;
    padding: 10px 14px;
    column-gap: 10px;
    background: #ffffff;
    margin-right: 20px;
    border-radius: 4px;
    .text {
      font-size: 16px;
    }
  }
  .animate-item-0,
  .animate-item-2 {
    animation: leftToRight infinite 5s alternate-reverse linear;
  }
  .animate-item-1 {
    animation: rightToLeft infinite 5s alternate-reverse linear;
  }
}
.list {
  display: flex;
  justify-content: center;
  padding: 80px 100px;
}
.item {
  flex: 1;
  height: 200px;
  margin-right: 36px;
  background: #ffffff;
  box-shadow: 0 0 12px 0 rgba(42, 5, 5, 0.08);
  border-radius: 12px;
  border: 1px solid #f3f3f3;
  cursor: pointer;
  margin-top: 20px;
  z-index: 1;
  background-size: 100%;
  .item-content {
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    background-color: #f2f2f2;
    transform: rotateX(-90deg);
    transform-origin: bottom;
    transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    opacity: 0;
  }
  .item-icon {
    display: block;
    width: 48px;
    height: 48px;
    margin: auto;
  }
  &:last-child {
    margin-right: 0;
  }
  &:hover .item-content {
    transform: rotateX(0deg);
    opacity: 1;
  }
}
.item-title {
  font-size: 24px;
  font-weight: 500;
  color: #222222;
  margin-top: 8px;
  text-align: center;
}
.item-description {
  font-size: 14px;
  font-family:
    PingFangSC-Regular,
    PingFang SC,
    serif;
  font-weight: 400;
  color: #222222;
  line-height: 22px;
  text-align: center;
}
.item-line {
  width: 18px;
  height: 3px;
  background: #06a8ee;
  margin: 8px auto;
}
@keyframes leftToRight {
  0% {
    transform: translate(-100px);
  }

  100% {
    transform: translate(100px);
  }
}
@keyframes rightToLeft {
  0% {
    transform: translate(100px);
  }

  100% {
    transform: translate(-100px);
  }
}
:deep(.ant-typography) {
  margin-left: 36px;
}
</style>
