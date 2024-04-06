<script setup lang="ts">
import { ref, watch } from 'vue'
import { VxeTableInstance } from 'vxe-table'
import { RowVO } from '@/api/project/type.ts'
const props = defineProps(['tableData'])
const emit = defineEmits(['addOne'])
const tableData = ref(props.tableData)
watch(
  () => props.tableData,
  (newVal) => {
    if (newVal) {
      tableData.value = newVal
    }
  },
)
const taskStatusList = ref([
  { label: '刚发布', value: 0 },
  { label: '未开始', value: 1 },
  { label: '进行中', value: 2 },
  { label: '已完成', value: 3 },
  { label: '已关闭', value: 4 },
])
const formatSex = (value: string) => {
  return taskStatusList.value.find((item) => value === item.value)?.label
}
const xTable = ref<VxeTableInstance>()
// 临时显示在表格中
const insertEvent = async () => {
  const $table = xTable.value
  if ($table) {
    const record = {
      taskName: '',
      taskStatus: 0,
      dateStart: '',
    }
    const { row: newRow } = await $table.insertAt(record, -1)
    await $table.setEditCell(newRow, 'taskName')
  }
}
const getInsertEvent = () => {
  if (xTable.value) {
    console.log(xTable.value?.getInsertRecords())
  }
}
const saveOneTask = async (row) => {
  emit('addOne', row)
}
</script>
<template>
  <div class="table">
    <div class="add-icon">
      <a-tooltip title="新建任务">
        <SvgIcon name="add-task" width="20px" height="20px" @click="insertEvent"></SvgIcon>
      </a-tooltip>
      <a-tooltip title="批量保存">
        <SvgIcon name="save-more" width="20px" height="20px" @click="getInsertEvent"></SvgIcon>
      </a-tooltip>
    </div>
    <vxe-table
      ref="xTable"
      round
      border="inner"
      show-overflow
      keep-source
      min-height="400px"
      :data="tableData"
      :column-config="{ resizable: true }"
      :edit-config="{ trigger: 'dblclick', mode: 'cell', showStatus: true, showIcon: false }"
    >
      <vxe-column type="seq" width="60"></vxe-column>
      <vxe-column field="taskName" title="任务名称" :edit-render="{ autofocus: '.vxe-input--inner' }">
        <template #edit="{ row }">
          <vxe-input v-model="row.taskName" type="text"></vxe-input>
        </template>
      </vxe-column>
      <vxe-column field="taskStatus" title="任务状态" :edit-render="{}">
        <template #default="{ row }">
          <span>{{ formatSex(row.taskStatus) }}</span>
        </template>
        <template #edit="{ row }">
          <vxe-select v-model="row.taskStatus" transfer>
            <vxe-option v-for="item in taskStatusList" :key="item.value" :value="item.value" :label="item.label"></vxe-option>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column field="days" title="人天" :edit-render="{}">
        <template #edit="{ row }">
          <vxe-input v-model="row.days" type="number" placeholder="请输入数值"></vxe-input>
        </template>
      </vxe-column>
      <vxe-column field="dateStart" title="预计开始时间" :edit-render="{}">
        <template #edit="{ row }">
          <vxe-input v-model="row.dateStart" type="date" placeholder="请选择日期" transfer></vxe-input>
        </template>
      </vxe-column>
      <vxe-column field="dateEnd" title="预计结束时间" :edit-render="{}">
        <template #edit="{ row }">
          <vxe-input v-model="row.dateEnd" type="date" placeholder="请选择日期" transfer></vxe-input>
        </template>
      </vxe-column>
      <vxe-column title="操作" width="100" show-overflow>
        <template #default="{ row }">
          <a-button type="dashed" @click="saveOneTask(row)">{{ row?.id ? '保存' : '新建' }}</a-button>
        </template>
      </vxe-column>
      <template v-slot:empty>
        <div style="padding: 20px 0">
          <empty-status></empty-status>
        </div>
      </template>
    </vxe-table>
  </div>
</template>

<style lang="scss" scoped>
.table {
  width: 76%;
  height: 100%;
  margin: 40px auto;
  position: relative;
}
.add-icon {
  position: absolute;
  top: -30px;
  right: 0;
  display: flex;
  grid-gap: 20px;
  .svg-icon {
    cursor: pointer;
  }
}
:deep(.vxe-table--render-default.vxe-editable .vxe-body--column) {
  line-height: 48px;
}
:deep(.vxe-table--render-wrapper) {
  background: #ffffff;
}
</style>
