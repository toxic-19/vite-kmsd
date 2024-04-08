<script setup lang="ts">
import { computed, ref } from 'vue'
import { OneProject } from '@/api/project/type.ts'
import { showCorrectTime } from '@/utils/constant.ts'
import { postUpdateProject } from '@/api/project'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useBreadcrumbsStore } from '@/stores/breadcrumbs.ts'
const store = useBreadcrumbsStore()
const props = defineProps(['project'])
const emit = defineEmits(['refresh'])
const projectContent = computed<OneProject>(() => {
  return props.project
})
const taskList = [{ text: '项目总任务数' }, { text: '项目未完成任务' }, { text: '项目超期任务' }, { text: '项目已完成任务' }]

// CSS翻转效果
const rotateFront = ref('0deg')
const rotateBack = ref('180deg')
const transfer = () => {
  rotateFront.value = rotateFront.value === '0deg' ? '180deg' : '0deg'
  rotateBack.value = rotateBack.value === '180deg' ? '360deg' : '180deg'
}
const collectIcon = ref<string>('unCollect')
const collect = () => {
  collectIcon.value = collectIcon.value === 'collected' ? 'unCollect' : 'collected'
}
const reNameId = ref<number>(0)
const reNameValue = ref<string>(projectContent.value.projectName)
const reName = () => {
  reNameId.value = projectContent.value.id
  console.log('reName')
}
const sureUpdateName = async () => {
  const { data } = await postUpdateProject({
    id: projectContent.value.id,
    projectName: reNameValue.value,
  })
  if (data[0] === 1) {
    // 刷新
    emit('refresh')
  } else message.error('重命名失败')
  reNameId.value = 0
}
const deleteProject = () => {
  console.log('delete')
}
const router = useRouter()
const toTaskPage = () => {
  router.push(`/task/${projectContent.value.id}`)
  store.setProject(projectContent.value)
}
</script>
<template>
  <div class="card-box">
    <a-card hoverable class="card" @click="toTaskPage">
      <template #cover>
        <img alt="example" src="@/assets/projectCover.png" />
      </template>
      <template #actions>
        <a-tooltip :title="collectIcon === 'collected' ? '取消收藏' : '收藏'">
          <SvgIcon :name="collectIcon" width="24px" height="24px" @click="collect"></SvgIcon>
        </a-tooltip>
        <a-tooltip title="重命名">
          <SvgIcon name="reName" width="30px" height="28px" @click="reName"></SvgIcon>
        </a-tooltip>
        <a-tooltip title="挂起">
          <SvgIcon name="hangup" width="26px" height="26px" @click="deleteProject"></SvgIcon>
        </a-tooltip>
      </template>
      <a-card-meta>
        <template #title>
          <template v-if="reNameId !== projectContent.id">{{ projectContent.projectName }}</template>
          <a-input v-else type="text" autofocus v-model:value="reNameValue" @pressEnter="sureUpdateName"></a-input>
        </template>
        <template #description>创建时间：{{ showCorrectTime(projectContent.createdAt) }}</template>
      </a-card-meta>
      <div class="transfer" @click="transfer">
        <SvgIcon name="transfer" width="24px" height="24px"></SvgIcon>
      </div>
    </a-card>
    <a-card class="card-back">
      <div class="title">{{ projectContent.projectName }}</div>
      <div class="statistics">
        <div class="left-num">
          <div class="task-item" v-for="item in taskList" :key="item.text">
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
            :format="(percent: number) => `${percent} Days`"
          />
          <div class="progress-title">项目进度</div>
        </div>
      </div>
      <div class="members">
        <div style="padding-bottom: 8px">团队成员：</div>
        <a-avatar-group
          :max-count="8"
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
</template>

<style lang="scss" scoped>
.card-box {
  flex: 1;
  max-width: 276px;
  min-width: 230px;
  height: 310px;
  position: relative;
  .card {
    height: 100%;
    width: 100%;
    position: absolute;
    transition: 1s ease-in-out;
    transform: rotateY(v-bind(rotateFront)); // 翻转 0 -> 180deg
  }
  .card-back {
    height: 100%;
    width: 100%;
    position: absolute;
    backface-visibility: hidden;
    transform: rotateY(v-bind(rotateBack)); // 翻转前 180deg -> 360deg
    transition: 1s ease-in-out;
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
