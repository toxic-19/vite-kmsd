<script setup lang="ts">
import GanttView from './gantt.vue'
import { cloneData, formatDate, runNum } from '@/utils/constant.ts'
import { Modal } from 'ant-design-vue'
import { TEMPLATE_MAP, taskStatusColors } from '@/utils/map.ts'
import { onMounted, ref } from 'vue'
import { postTaskListByProjectId } from '@/api/project'
import { useBreadcrumbsStore } from '@/stores/breadcrumbs.ts'
import { storeToRefs } from 'pinia'
type ListType = {
  id: number
  label: string
  time: object
  notime: boolean
  style: Record<string, string>
}
const emit = defineEmits(['closeGantt'])
const loadFinish = ref(false)
const lists = ref<ListType[]>([])
const editData = ref<Array<{ id: any; label: any; notime: any; backTime: any; newTime: any }>>([])
const editShowInfo = ref(false)
const editLoad = ref(0)
const filtrProjectId = ref(0)
const initData = () => {
  lists.value = []
  taskLabelList.value.forEach((item: any) => {
    if (filtrProjectId.value > 0) {
      if (item.id !== filtrProjectId.value) {
        return
      }
    }
    item.taskLists.forEach((taskData: any) => {
      let notime = taskData.dateStart === 0 || taskData.dateEnd === 0
      let times = getTimeObj(taskData)
      let start = times.start
      let end = times.end
      let color = taskStatusColors[taskData.taskStatus] || '#058ce4'
      //
      let tempTime = { start, end }
      let findData = editData.value.find((t) => {
        return t.id === taskData.id
      })
      if (findData) {
        findData.backTime = cloneData(tempTime)
        tempTime = cloneData(findData.newTime)
      }
      lists.value.push({
        id: taskData.id,
        label: taskData.taskName,
        time: tempTime,
        notime: notime,
        style: { background: color },
      })
    })
  })
  console.log(lists.value)
  if (lists.value.length === 0 && filtrProjectId.value === 0) {
    Modal.warning({
      title: '温馨提示',
      content: '任务列表为空，请先添加任务。',
      onOk: () => {
        emit('closeGantt')
      },
    })
  }
}

const updateTime = (item: any) => {
  const original = getRawTime(item.id)
  if (Math.abs(original?.end - item.time.end) > 1000 || Math.abs(original?.start - item.time.start) > 1000) {
    // 修改时间（变化超过1秒钟)
    const backTime = cloneData(original)
    const newTime = cloneData(item.time)
    const findData = editData.value.find(({ id }) => id === item.id)
    if (findData) {
      findData.newTime = newTime
    } else {
      editData.value.push({
        id: item.id,
        label: item.label,
        notime: item.notime,
        backTime,
        newTime,
      })
    }
  }
}

const clickItem = (item: any) => {
  console.log('详情', item)
}

const editSubmit = (save: any) => {
  editData.value.forEach((item) => {
    if (save) {
      editLoad.value++
      let timeStart = formatDate('Y-m-d H:i', Math.round(item.newTime.start / 1000))
      let timeEnd = formatDate('Y-m-d H:i', Math.round(item.newTime.end / 1000))
      let ajaxData = {
        act: 'plannedtime',
        taskid: item.id,
        content: timeStart + ',' + timeEnd,
      }
      console.log(ajaxData)
    } else {
      lists.value.some((task) => {
        if (task.id === item.id) {
          task['time'] = item.backTime
          return true
        }
      })
    }
  })
  editData.value = []
}

const getRawTime = (taskId: number) => {
  let times = null
  taskLabelList.value.some((item) => {
    item.taskLists.some((taskData) => {
      if (taskData.id === taskId) {
        times = getTimeObj(taskData)
        return true
      }
    })
    if (times) {
      return true
    }
  })
  return times
}

const getTimeObj = (taskData) => {
  let start = taskData.dateStart || taskData.indate
  let end = taskData.dateEnd || taskData.indate + 86400
  if (end === start) {
    end = Math.round(new Date(formatDate('Y-m-d 23:59:59', end)).getTime() / 1000)
  }
  end = Math.max(end, start + 60)
  start *= 1000
  end *= 1000
  return { start, end }
}

const tapProject = (e) => {
  filtrProjectId.value = runNum(e)
  initData()
}
const store = useBreadcrumbsStore()
const { currentProject } = storeToRefs(store)
const taskLabelList = ref()
const getAllTaskList = async () => {
  const { data } = await postTaskListByProjectId({ projectId: currentProject.value.id })
  taskLabelList.value = data
  initData()
  loadFinish.value = true
}
onMounted(() => {
  getAllTaskList()
})
</script>

<template>
  <div class="project-gstc-gantt">
    <GanttView :lists="lists" :menu-width="260" :itemWidth="80" @on-change="updateTime" @on-click="clickItem" />
    <a-dropdown class="project-gstc-dropdown-filtr" placement="bottom">
      <SvgIcon class="project-gstc-dropdown-icon" name="funnel"></SvgIcon>
      <template #overlay>
        <div class="select-box">
          <a-checkbox>全部</a-checkbox>
          <a-checkbox-group :options="TEMPLATE_MAP.get(1)" />
        </div>
      </template>
    </a-dropdown>
    <div class="project-gstc-close" @click="emit('closeGantt')">
      <SvgIcon name="back" text="返回"></SvgIcon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.project-gstc-gantt {
  position: absolute;
  top: 15px;
  left: 15px;
  right: 15px;
  bottom: 15px;
  z-index: 1;
  transform: translateZ(0);
  background-color: #fdfdfd;
  border-radius: 3px;
  overflow: hidden;
  .project-gstc-dropdown-filtr {
    position: absolute;
    top: 38px;
    left: 222px;
    .project-gstc-dropdown-icon {
      cursor: pointer;
      color: #999;
      font-size: 20px;
      &.filtr {
        color: #058ce4;
      }
    }
  }
  .project-gstc-close {
    position: absolute;
    top: 8px;
    left: 12px;
    cursor: pointer;
    &:hover {
      i {
        transform: scale(1) rotate(45deg);
      }
    }
    i {
      color: #666666;
      font-size: 28px;
      transform: scale(0.92);
      transition: all 0.2s;
    }
  }
  .project-gstc-edit {
    position: absolute;
    bottom: 6px;
    right: 6px;
    background: #ffffff;
    border-radius: 4px;
    opacity: 0;
    transform: translate(120%, 0);
    transition: all 0.2s;
    &.visible {
      opacity: 1;
      transform: translate(0, 0);
    }
    &.info {
      .project-gstc-edit-info {
        display: block;
      }
      .project-gstc-edit-small {
        display: none;
      }
    }
    .project-gstc-edit-info {
      display: none;
      border: 1px solid #e4e4e4;
      background: #ffffff;
      padding: 6px;
      border-radius: 4px;
      width: 500px;
      .project-gstc-edit-btns {
        margin: 12px 6px 4px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .ivu-btn {
          margin-right: 8px;
          font-size: 13px;
        }
        .zoom {
          font-size: 20px;
          color: #444444;
          cursor: pointer;
          &:hover {
            color: #57a3f3;
          }
        }
      }
    }
    .project-gstc-edit-small {
      border: 1px solid #e4e4e4;
      background: #ffffff;
      padding: 6px 12px;
      display: flex;
      align-items: center;
      .project-gstc-edit-text {
        cursor: pointer;
        text-decoration: underline;
        color: #444444;
        margin-right: 8px;
        &:hover {
          color: #57a3f3;
        }
      }
      .ivu-btn {
        margin-left: 4px;
        font-size: 13px;
      }
    }
  }
}
.select-box {
  padding-left: 10px;
  width: 100px;
  height: auto;
  align-items: flex-start;
}
</style>
