<script setup lang="ts">
import { ref, watch } from 'vue'
import { VxeTableInstance } from 'vxe-table'
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
// 获取临时保存和修改的记录
// const getInsertEvent = () => {
//   if (xTable.value) {
//     console.log(xTable.value?.getInsertRecords())
//   }
// }
const saveOneTask = async (row) => {
  console.log(row)
  emit('addOne', row)
}
</script>
<template>
  <div class="table">
    <a-tooltip title="新建任务">
      <div class="add-icon">
        <SvgIcon name="add" width="13px" height="13px" @click="insertEvent"></SvgIcon>
      </div>
    </a-tooltip>
    <!--      <a-tooltip title="全部保存">-->
    <!--        <SvgIcon name="save-more" width="20px" height="20px" @click="getInsertEvent"></SvgIcon>-->
    <!--      </a-tooltip>-->
    <vxe-table
      ref="xTable"
      round
      border="inner"
      show-overflow
      keep-source
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
      <vxe-column title="操作" width="100" show-overflow align="center">
        <template #default="{ row }">
          <a-button type="dashed" @click="saveOneTask(row)">{{ row?.id ? '保存修改' : '新建' }}</a-button>
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
  width: 44px;
  height: 24px;
  border: 2px solid #f8f8f9;
  border-top: none;
  border-radius: 0 0 4px 4px;
  background-color: #f8f8f9;
  position: absolute;
  bottom: -22px;
  left: -1px;
  display: flex;
  justify-content: center;
  grid-gap: 20px;
  z-index: 2;
  box-shadow: 2px 2px 10px 0 rgba(0, 0, 0, 0.1);
  cursor: pointer;
}
:deep(.vxe-table) {
  box-shadow: 2px 2px 10px 4px rgba(0, 0, 0, 0.1);
}
:deep(.vxe-table--render-default.vxe-editable .vxe-body--column) {
  line-height: 48px;
}
:deep(.vxe-table--render-wrapper) {
  background: #ffffff;
}
:deep(.vxe-cell--label, .vxe-cell--title) {
  font-family: 'lucida grande', 'lucida sans unicode', lucida, helvetica, 'Hiragino Sans GB', 'Microsoft YaHei',
    'WenQuanYi Micro Hei', sans-serif;
}
:deep(.vxe-body--row) {
  background-color: rgba(222, 216, 216, 0.1);
}
</style>
