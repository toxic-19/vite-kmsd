<template>
  <div class="project-gstc-gantt">
    <GanttView :lists="lists" :itemWidth="80" @on-change="updateTime" @on-click="clickItem" />
    <a-dropdown class="project-gstc-dropdown-filtr" placement="bottom">
      <SvgIcon class="project-gstc-dropdown-icon" name="funnel" text="流程"></SvgIcon>
      <template #overlay>
        <div class="select-box" @click="dropdownClick">
          <a-checkbox>全部</a-checkbox>
          <a-checkbox-group :options="TEMPLATE_MAP.get(1)" />
        </div>
      </template>
    </a-dropdown>
    <div class="project-gstc-close" @click="$emit('closeGantt')">
      <SvgIcon name="back" text="返回"></SvgIcon>
    </div>
  </div>
</template>

<script>
import GanttView from './gantt.vue'
import { cloneData, formatDate, runNum } from '@/utils/constant.ts'
import { Modal } from 'ant-design-vue'
import { taskLabelList } from '../../../../mock/task.ts'
import { TEMPLATE_MAP } from '@/utils/map.ts'
export default {
  name: 'TaskGantt',
  computed: {
    TEMPLATE_MAP() {
      return TEMPLATE_MAP
    }
  },
  components: { GanttView },
  props: {
    projectLabel: {
      default: taskLabelList,
    },
  },
  emits: ['closeGantt'],
  data() {
    return {
      loadFinish: false,
      lists: [],
      editData: [],
      editShowInfo: false,
      editLoad: 0,
      filtrProjectId: 0,
    }
  },

  mounted() {
    this.initData()
    this.loadFinish = true
  },

  watch: {
    projectLabel: {
      handler(newVal) {
        if (newVal?.length) this.initData()
      },
      deep: true,
    },
  },

  methods: {
    initData() {
      this.lists = []
      console.log(Array.isArray(this.projectLabel))
      this.projectLabel.forEach((taskData) => {
        let notime = taskData.startdate === 0 || taskData.enddate === 0
        let times = this.getTimeObj(taskData)
        let start = times.start
        let end = times.end
        let color = '#058ce4'
        if (taskData.taskStatus === 1) {
          color = '#ff0000'
        } else if (taskData.taskStatus === 2) {
          color = '#BB9F35'
        } else if (taskData.taskStatus === 3) {
          color = '#449EDD'
        } else if (taskData.taskStatus === 4) {
          color = '#84A83B'
        }
        //
        let tempTime = { start, end }
        let findData = this.editData.find((t) => {
          return t.id === taskData.id
        })
        if (findData) {
          findData.backTime = cloneData(tempTime)
          tempTime = cloneData(findData.newTime)
        }
        this.lists.push({
          id: taskData.id,
          label: taskData.taskName,
          time: tempTime,
          notime: notime,
          style: { background: color },
        })
      })
      if (this.lists.length === 0 && this.filtrProjectId === 0) {
        Modal.warning({
          title: '温馨提示',
          content: '任务列表为空，请先添加任务。',
          onOk: () => {
            this.$emit('on-close')
          },
        })
      }
    },

    updateTime(item) {
      let original = this.getRawTime(item.id)
      if (Math.abs(original.end - item.time.end) > 1000 || Math.abs(original.start - item.time.start) > 1000) {
        //修改时间（变化超过1秒钟)
        let backTime = cloneData(original)
        let newTime = cloneData(item.time)
        let findData = this.editData.find(({ id }) => id === item.id)
        if (findData) {
          findData.newTime = newTime
        } else {
          this.editData.push({
            id: item.id,
            label: item.label,
            notime: item.notime,
            backTime,
            newTime,
          })
        }
      }
    },

    clickItem(item) {
      console.log('详情', item)
    },

    editSubmit(save) {
      // let triggerTask = []
      this.editData.forEach((item) => {
        if (save) {
          this.editLoad++
          let timeStart = formatDate('Y-m-d H:i', Math.round(item.newTime.start / 1000))
          let timeEnd = formatDate('Y-m-d H:i', Math.round(item.newTime.end / 1000))
          let ajaxData = {
            act: 'plannedtime',
            taskid: item.id,
            content: timeStart + ',' + timeEnd,
          }
          console.log(ajaxData)
          // $A.apiAjax({
          //   url: 'project/task/edit',
          //   method: 'post',
          // })
        } else {
          this.lists.some((task) => {
            if (task.id === item.id) {
              this.$set(task, 'time', item.backTime)
              return true
            }
          })
        }
      })
      this.editData = []
    },

    getRawTime(taskId) {
      let times = null
      this.projectLabel.some((item) => {
        item.taskLists.some((taskData) => {
          if (taskData.id === taskId) {
            times = this.getTimeObj(taskData)
            return true
          }
        })
        if (times) {
          return true
        }
      })
      return times
    },

    getTimeObj(taskData) {
      let start = taskData.dateStart || taskData.indate
      let end = taskData.dateEnd || taskData.indate + 86400
      if (end === start) {
        end = Math.round(new Date(formatDate('Y-m-d 23:59:59', end)).getTime() / 1000)
      }
      end = Math.max(end, start + 60)
      start *= 1000
      end *= 1000
      return { start, end }
    },

    tapProject(e) {
      this.filtrProjectId = runNum(e)
      this.initData()
    },
  },
}
</script>

<style lang="scss">
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
