<script setup>
import { formatDate } from '@/utils/constant.ts'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps(['lists', 'menuWidth', 'itemWidth'])
const emit = defineEmits(['onChange', 'onClick'])
const mouseType = ref('') // 进入gantt-timeline时变为timeline。进入gantt-item是变为item
const mouseWidth = ref(0)
const mouseScaleWidth = ref(0)
const dateWidth = ref(100)
const ganttWidth = ref(0)

const ganttRight = ref(null) // $refs 组件实例
onMounted(() => {
  dateWidth.value = props.itemWidth
  ganttRight.value.addEventListener('mousewheel', handleScroll, false)
  document.addEventListener('mousemove', itemMouseMove)
  document.addEventListener('mouseup', itemMouseUp)
  window.addEventListener('resize', handleResize, false)
  handleResize()
})
onBeforeUnmount(() => {
  ganttRight.value.removeEventListener('mousewheel', handleScroll, false)
  document.removeEventListener('mousemove', itemMouseMove)
  document.removeEventListener('mouseup', itemMouseUp)
  window.removeEventListener('resize', handleResize, false)
})
watch(
  () => props.itemWidth,
  (val) => {
    dateWidth.value = val
  },
)
const monthNum = computed(() => {
  return Math.floor(ganttWidth.value / dateWidth.value / 30) + 2
})
const monthStyle = computed(() => {
  return function (index) {
    let mouseDay = mouseWidth.value === 0 ? 0 : mouseWidth.value / dateWidth.value
    let date = new Date()
    // 今天 00:00:00 的时间戳
    let nowDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
    // 当前时间
    let curDay = new Date(nowDay.getTime() + mouseDay * 86400000)
    // 当月最后一天
    let lastDay = new Date(curDay.getFullYear(), curDay.getMonth() + 1, 0, 23, 59, 59)
    // 当月最后一天与当前相差天数
    let diffDay = (lastDay - curDay) / 1000 / 60 / 60 / 24

    let width = dateWidth.value * diffDay
    if (index > 0) {
      lastDay = new Date(curDay.getFullYear(), curDay.getMonth() + 1 + index, 0)
      width = lastDay.getDate() * dateWidth.value
    }
    return {
      width: width + 'px',
    }
  }
})
const monthFormat = computed(() => {
  return function (index) {
    let mouseDay = mouseWidth.value === 0 ? 0 : mouseWidth.value / dateWidth.value
    let date = new Date()
    // 开始位置时间（今天00:00:00）
    let nowDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
    // 当前时间
    let curDay = new Date(nowDay.getTime() + mouseDay * 86400000)
    if (index > 0) {
      curDay = new Date(curDay.getFullYear(), curDay.getMonth() + 1 + index, 0)
    }
    return formatDate('Y-m', curDay)
  }
})
const dateNum = computed(() => {
  return Math.floor(ganttWidth.value / dateWidth.value) + 2
})
const dateStyle = computed(() => {
  return function (index) {
    const style = {}

    let mouseDay = mouseWidth.value === 0 ? 0 : mouseWidth.value / dateWidth.value
    let mouseData = Math.floor(mouseDay) + index
    if (mouseDay === Math.floor(mouseDay)) {
      mouseData--
    }
    let j = mouseWidth.value === 0 ? index - 1 : mouseData
    let date = new Date(new Date().getTime() + j * 86400000)
    if ([0, 6].indexOf(date.getDay()) !== -1) {
      style.backgroundColor = '#f9fafb'
    }

    let width = dateWidth.value
    if (index === 0) {
      width = Math.abs(((mouseWidth.value.width % width) - width) % width)
    }
    style.width = width + 'px'
    return style
  }
})
const dateFormat = computed(() => {
  return function (index, type) {
    let mouseDay = mouseWidth.value === 0 ? 0 : mouseWidth.value / dateWidth.value
    let mouseData = Math.floor(mouseDay) + index
    if (mouseDay === Math.floor(mouseDay)) {
      mouseData--
    }
    let j = mouseWidth.value === 0 ? index - 1 : mouseData
    let date = new Date(new Date().getTime() + j * 86400000)
    if (type === 'day') {
      return date.getDate()
    } else if (type === 'wook') {
      return `星期${'日一二三四五六'.charAt(date.getDay())}`
    } else {
      return date
    }
  }
})
const itemStyle = computed(() => {
  return function (item) {
    const { start, end } = item.time
    const { style, moveX, moveW } = item
    let date = new Date()
    // 开始位置时间戳（今天00:00:00时间戳）
    let nowTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0).getTime()
    // 距离开始位置多少天
    let diffStartDay = (start - nowTime) / 1000 / 60 / 60 / 24
    let diffEndDay = (end - nowTime) / 1000 / 60 / 60 / 24

    let left = dateWidth.value * diffStartDay + mouseWidth.value * -1
    let width = dateWidth.value * (diffEndDay - diffStartDay)
    if (typeof moveX === 'number') {
      left += moveX
    }
    if (typeof moveW === 'number') {
      width += moveW
    }

    const customStyle = {
      left: Math.min(Math.max(left, width * -1.2), ganttWidth.value * 1.2).toFixed(2) + 'px',
      width: width.toFixed(2) + 'px',
    }
    if (left < 0 && Math.abs(left) < width) {
      customStyle.paddingLeft = Math.abs(left).toFixed(2) + 'px'
    }
    if (left + width > ganttWidth.value && left < ganttWidth.value) {
      customStyle.paddingRight = Math.abs(left + width - ganttWidth.value).toFixed(2) + 'px'
    }
    if (typeof style === 'object') {
      return Object.assign(customStyle, style)
    }
    return customStyle
  }
})
const ganttTimeline = ref(null)
const itemScrollListener = (e) => {
  if (mouseType.value === 'timeline') {
    return
  }
  ganttTimeline.value.scrollTop = e.target.scrollTop
}

const ganttItem = ref(null)
const timelineScrollListener = (e) => {
  if (mouseType.value === 'item') {
    return
  }
  ganttItem.value.scrollTop = e.target.scrollTop
}
const handleScroll = (e) => {
  e.preventDefault()
  if (e.ctrlKey) {
    // 缩放
    dateWidth.value = Math.min(600, Math.max(24, dateWidth.value - Math.floor(e.deltaY)))
    mouseWidth.value = (ganttWidth.value / 2) * ((dateWidth.value - 100) / 100) + (dateWidth.value / 100) * mouseScaleWidth.value
    return
  }
  if (e.deltaY !== 0) {
    let newTop = ganttTimeline.value.scrollTop + e.deltaY
    if (newTop < 0) {
      newTop = 0
    } else if (newTop > ganttTimeline.value.scrollHeight - ganttTimeline.value.clientHeight) {
      newTop = ganttTimeline.value.scrollHeight - ganttTimeline.value.clientHeight
    }
    if (ganttTimeline.value.scrollTop !== newTop) {
      mouseType.value = 'timeline'
      ganttTimeline.value.scrollTop = newTop
    }
  }
  if (e.deltaX !== 0) {
    mouseWidth.value += e.deltaX
    mouseScaleWidth.value += e.deltaX * (100 / dateWidth.value)
  }
}
const handleResize = () => {
  ganttWidth.value = ganttTimeline.value.clientWidth
}
const mouseItem = ref(null)
const dateMove = ref(null)
const dateMouseDown = (e) => {
  e.preventDefault()
  mouseItem.value = null
  dateMove.value = {
    clientX: e.clientX,
  }
}
const mouseBak = ref({})
const itemMouseDown = (e, item) => {
  e.preventDefault()
  let type = 'moveX'
  if (e.target.className === 'timeline-resizer') {
    type = 'moveW'
  }
  if (typeof item[type] !== 'number') {
    item[type] = 0
  }
  mouseBak.value = {
    type: type,
    clientX: e.clientX,
    value: item[type],
  }
  mouseItem.value = item
  dateMove.value = null
}

const itemMouseMove = (e) => {
  if (mouseItem.value != null) {
    e.preventDefault()
    let diff = e.clientX - mouseBak.value.clientX
    mouseItem.value[mouseBak.value.type] = mouseBak.value.value + diff
  } else if (dateMove.value != null) {
    e.preventDefault()
    const moveX = (dateMove.value.clientX - e.clientX) * 5
    dateMove.value.clientX = e.clientX
    mouseWidth.value += moveX
    mouseScaleWidth.value += moveX * (100 / dateWidth.value)
  }
}

const itemMouseUp = (e) => {
  if (mouseItem.value != null) {
    const { start, end } = mouseItem.value.time
    let isM = false
    // 一个宽度的时间
    const oneWidthTime = 86400000 / dateWidth.value
    // 修改起止时间
    if (typeof mouseItem.value.moveX === 'number' && mouseItem.value.moveX !== 0) {
      const moveTime = mouseItem.value.moveX * oneWidthTime
      mouseItem.value.time['start'] = start + moveTime
      mouseItem.value.time['end'] = end + moveTime
      mouseItem.value['moveX'] = 0
      isM = true
    }
    // 修改结束时间
    if (typeof mouseItem.value.moveW === 'number' && mouseItem.value.moveW !== 0) {
      const moveTime = mouseItem.value.moveW * oneWidthTime
      mouseItem.value.time['end'] = end + moveTime
      mouseItem.value['moveW'] = 0
      isM = true
    }
    if (isM) {
      emit('onChange', mouseItem.value)
    } else if (e.target.className === 'timeline-title') {
      this.clickItem(mouseItem.value)
    }
    mouseItem.value = null
  } else if (dateMove.value != null) {
    dateMove.value = null
  }
}
const scrollPosition = (pos) => {
  const date = new Date()
  // 今天00:00:00
  const nowDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
  // 一个宽度的时间
  const oneWidthTime = 86400000 / dateWidth.value
  //
  const moveWidth = (props.lists[pos].time.start - nowDay) / oneWidthTime - dateWidth.value - mouseWidth.value
  mouseWidth.value += moveWidth
  mouseScaleWidth.value += moveWidth * (100 / dateWidth.value)
}
const clickItem = (item) => {
  emit('onClick', item)
}
</script>

<template>
  <div class="wook-gantt">
    <div class="gantt-left" :style="{ width: menuWidth + 'px' }">
      <div class="gantt-title">
        <div class="gantt-title-text">任务名称</div>
      </div>
      <ul ref="ganttItem" class="gantt-item" @scroll="itemScrollListener" @mouseenter="mouseType = 'item'">
        <li v-for="(item, key) in props.lists" :key="key">
          <div class="item-title" @click="clickItem(item)">{{ item.label }}</div>
          <SvgIcon class="item-icon" name="focus" @click="scrollPosition(key)"></SvgIcon>
        </li>
      </ul>
    </div>
    <div ref="ganttRight" class="gantt-right">
      <div class="gantt-chart">
        <ul class="gantt-month">
          <li v-for="(item, key) in monthNum" :key="key" :style="monthStyle(key)">
            <div class="month-format">{{ monthFormat(key) }}</div>
          </li>
        </ul>
        <ul class="gantt-date" @mousedown="dateMouseDown">
          <li v-for="(item, key) in dateNum" :key="key" :style="dateStyle(key)">
            <div class="date-format">
              <div class="format-day">{{ dateFormat(key, 'day') }}</div>
              <div v-if="dateWidth > 46" class="format-wook">{{ dateFormat(key, 'wook') }}</div>
            </div>
          </li>
        </ul>
        <ul ref="ganttTimeline" class="gantt-timeline" @scroll="timelineScrollListener" @mouseenter="mouseType = 'timeline'">
          <li v-for="(item, key) in props.lists" :key="key">
            <div class="timeline-item" :style="itemStyle(item)" @mousedown="itemMouseDown($event, item)">
              <div class="timeline-title">{{ item.label }}</div>
              <div class="timeline-resizer"></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wook-gantt {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: row;
  align-items: self-start;
  color: #747a81;
  * {
    box-sizing: border-box;
  }
  .gantt-left {
    flex-grow: 0;
    flex-shrink: 0;
    height: 100%;
    background-color: #ffffff;
    position: relative;
    display: flex;
    flex-direction: column;
    &:after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 1px;
      background-color: rgba(237, 241, 242, 0.75);
    }
    .gantt-title {
      height: 76px;
      flex-grow: 0;
      flex-shrink: 0;
      background-color: #f9fafb;
      padding-left: 12px;
      overflow: hidden;
      .gantt-title-text {
        line-height: 100px;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 600;
      }
    }
    .gantt-item {
      transform: translateZ(0);
      max-height: 100%;
      overflow: auto;
      -ms-overflow-style: none;
      &::-webkit-scrollbar {
        display: none;
      }
      > li {
        height: 40px;
        border-bottom: 1px solid rgba(237, 241, 242, 0.75);
        position: relative;
        display: flex;
        align-items: center;
        &:hover {
          .item-icon {
            display: flex;
          }
        }
        .item-title {
          flex: 1;
          padding: 0 12px;
          cursor: default;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .item-icon {
          display: none;
          align-items: center;
          justify-content: center;
          width: 32px;
          margin-right: 2px;
          font-size: 16px;
          color: #888888;
        }
      }
    }
  }
  .gantt-right {
    flex: 1;
    height: 100%;
    background-color: #ffffff;
    position: relative;
    overflow: hidden;
    .gantt-chart {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      transform: translateZ(0);
      .gantt-month {
        display: flex;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1;
        height: 26px;
        line-height: 20px;
        font-size: 14px;
        background-color: #f9fafb;
        > li {
          flex-grow: 0;
          flex-shrink: 0;
          height: 100%;
          position: relative;
          overflow: hidden;
          &:after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 1px;
            height: 100%;
            background-color: rgba(237, 241, 242, 0.75);
          }
          .month-format {
            overflow: hidden;
            white-space: nowrap;
            padding: 6px 6px 0;
          }
        }
      }
      .gantt-date {
        display: flex;
        align-items: center;
        position: absolute;
        top: 26px;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2;
        cursor: move;
        &:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 50px;
          background-color: #f9fafb;
        }
        > li {
          flex-grow: 0;
          flex-shrink: 0;
          height: 100%;
          position: relative;
          overflow: hidden;
          &:after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 1px;
            height: 100%;
            background-color: rgba(237, 241, 242, 0.75);
          }
          .date-format {
            overflow: hidden;
            white-space: nowrap;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 44px;
            .format-day {
              line-height: 28px;
              font-size: 18px;
            }
            .format-wook {
              line-height: 16px;
              font-weight: 300;
              font-size: 13px;
            }
          }
        }
      }
      .gantt-timeline {
        position: absolute;
        top: 76px;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 3;
        overflow-x: hidden;
        overflow-y: auto;
        > li {
          cursor: default;
          height: 40px;
          border-bottom: 1px solid rgba(237, 241, 242, 0.75);
          position: relative;
          .timeline-item {
            position: absolute;
            top: 0;
            touch-action: none;
            pointer-events: auto;
            padding: 4px;
            margin-top: 4px;
            background: #e74c3c;
            border-radius: 18px;
            color: #fff;
            display: flex;
            align-items: center;
            will-change: contents;
            height: 32px;
            .timeline-title {
              touch-action: none;
              flex-grow: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              margin-left: 4px;
              margin-right: 10px;
            }
            .timeline-resizer {
              height: 22px;
              touch-action: none;
              width: 8px;
              background: rgba(255, 255, 255, 0.1);
              cursor: ew-resize;
              flex-shrink: 0;
              will-change: visibility;
              position: absolute;
              top: 5px;
              right: 5px;
            }
          }
        }
      }
    }
  }
}
</style>
