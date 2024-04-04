<script setup lang="ts">
import { ref } from 'vue'
const taskList = [
  { text: '项目总任务数' },
  { text: '项目未完成任务' },
  { text: '项目超期任务' },
  { text: '项目已完成任务' },
]
const rotateFront = ref('0deg')
const rotateBack = ref('180deg')
const transfer = () => {
  rotateFront.value = rotateFront.value === '0deg' ? '180deg' : '0deg'
  rotateBack.value = rotateBack.value === '180deg' ? '360deg' : '180deg'
}
const collect = () => {
  console.log('collect')
}
const reName = () => {
  console.log('reName')
}
const deleteProject = () => {
  console.log('delete')
}
</script>

<template>
  <div class="project">
    <div class="card-box">
      <a-card hoverable class="card">
        <template #cover>
          <img alt="example" src="@/assets/projectCover.png" />
        </template>
        <template #actions>
          <SvgIcon name="unCollect" width="24px" height="24px" @click="collect"></SvgIcon>
          <SvgIcon name="reName" width="30px" height="28px" @click="reName"></SvgIcon>
          <SvgIcon name="delete" width="22px" height="22px" @click="deleteProject"></SvgIcon>
        </template>
        <a-card-meta title="项目001号">
          <template #description>创建时间：2024/1/02 09:09:28</template>
        </a-card-meta>
        <div class="transfer" @click="transfer">
          <SvgIcon name="transfer" width="24px" height="24px"></SvgIcon>
        </div>
      </a-card>
      <a-card class="card-back">
        <div class="title">项目001号</div>
        <div class="statistics">
          <div class="left-num">
            <div class="task-item" v-for="item in taskList" :key="item">
              <a-space :size="10">
                <span class="text">{{ item.text }}</span>
                <span class="num">3</span>
              </a-space>
            </div>
          </div>
          <a-divider type="vertical" />
          <div>
            <a-progress
              type="circle"
              :stroke-color="{
                '0%': '#80abd5',
                '100%': '#aecfe2',
              }"
              :percent="90"
              :size="100"
              :format="(percent) => `${percent} Days`"
            />
            <div class="progress-title">项目进度</div>
          </div>
        </div>
        <div class="members">
          <div style="padding-bottom: 8px">团队成员：</div>
          <a-avatar-group
            :max-count="10"
            max-popover-trigger="click"
            :max-style="{ color: '#f56a00', backgroundColor: '#fde3cf', cursor: 'pointer' }"
          >
            <a-avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />
            <a-avatar style="background-color: #f56a00">K</a-avatar>
            <a-avatar style="background-color: #87d068">T</a-avatar>
            <a-avatar style="background-color: #1890ff">X</a-avatar>
            <a-avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />
            <a-avatar style="background-color: #f56a00">K</a-avatar>
            <a-avatar style="background-color: #87d068">T</a-avatar>
            <a-avatar style="background-color: #1890ff">X</a-avatar>
            <a-avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />
            <a-avatar style="background-color: #f56a00">K</a-avatar>
            <a-avatar style="background-color: #87d068">T</a-avatar>
            <a-avatar style="background-color: #1890ff">X</a-avatar>
          </a-avatar-group>
        </div>
        <div class="transfer" @click="transfer">
          <SvgIcon name="transfer" width="24px" height="24px"></SvgIcon>
        </div>
      </a-card>
    </div>
  </div>
</template>

<style scoped lang="scss">
.project {
  width: 76%;
  margin: 0 auto;
  padding-top: 40px;
  display: flex;
}
.card-box {
  flex: 1;
  max-width: 310px;
  height: 310px;
  position: relative;
  .card {
    height: 100%;
    width: 100%;
    position: absolute;
    transition: 2s ease-in-out;
    transform: rotateY(v-bind(rotateFront)); // 翻转 0 -> 180deg
  }
  .card-back {
    height: 100%;
    width: 100%;
    position: absolute;
    backface-visibility: hidden;
    transform: rotateY(v-bind(rotateBack)); // 翻转前 180deg -> 360deg
    transition: 2s ease-in-out;
    .title {
      font-weight: bold;
      font-size: 15px;
    }
    .statistics {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 20px 0;
    }
    .left-num {
      .task-item {
        margin: 4px 0;
      }
      .text {
        display: inline-block;
        width: 100px;
        font-size: 13px;
        color: #949393;
      }
      .num {
        font-size: 20px;
      }
    }
    .ant-divider {
      height: 120px;
    }
    .progress-title {
      text-align: center;
      margin-top: 6px;
      color: #949393;
    }
  }
}
.transfer {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}
</style>
