<script setup lang="ts">
import { QueryRecordsParams, Record } from '@/helpers';
import { useRecordsStore } from '@/stores'
import { ElTable, InputInstance, Sort } from 'element-plus';
import { storeToRefs } from 'pinia';
import { reactive, ref } from 'vue';

const recStore = useRecordsStore()
const { records, query } = storeToRefs(recStore)

recStore.getRecords()

const recordProperties = {
  type: {
    label: 'Operation Type',
    format: (row: Record) => row.type as any,
    sortable: 'custom',
  },
  operationResponse: {
    label: 'Result',
    format: (row: Record) => row.operationResponse as any,
    sortable: false,
  },
  amount: {
    label: 'Cost',
    format: (row: Record) => row.amount as any,
    sortable: 'custom',
  },
  userBalance: {
    label: 'User Balance',
    format: (row: Record) => row.userBalance as any,
    sortable: 'custom',
  },
  dateTime: {
    label: 'Timestamp',
    format: (row: Record) => new Date(row.dateTime).toLocaleString() as any,
    sortable: 'custom',
  },
}


const sortOrder = { ascending: 'asc', descending: 'desc' } as const
const tableSort = ref<{ prop: string, order: Sort['order'] } | undefined>(undefined)
const formSearch = reactive({
  text: ''
})

const tableRef = ref<InstanceType<typeof ElTable>>()
const searchInputRef = ref<InputInstance>()

// Event handlers
const handleSortChange = (params: Sort) => {
  tableSort.value = { prop: params.prop, order: params.order }

  recStore.setQuery({
    orderBy: (params.order ? params.prop : undefined) as QueryRecordsParams['orderBy'],
    sortingOrder: sortOrder[params.order],
  })
  recStore.getRecords()
}

const handleSearchInput = (text: string) => {
  tableRef.value!.clearSort()
  recStore.setQuery({
    orderBy: undefined,
    sortingOrder: undefined,
    text,
  })
  recStore.getRecords()
}
const handleClear = () => {
  searchInputRef.value?.clear()
  recStore.$reset()
  recStore.getRecords()
}

const handleDeleteRecord = (idx: number, row: Record) => {
  recStore.deleteRecord(idx, row)
}

const handlePageChange = (value: number) => {
  recStore.getRecords({
    offset: (value - 1) * query.value.limit,
  })
}

</script>
<template>
  <el-row>
    <el-col :xl="16" :lg="18">
      <el-form inline :model="formSearch">
        <el-form-item>
          <el-input ref="searchInputRef" v-model="formSearch.text" placeholder="Search Results"
            @input="handleSearchInput" />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleClear">Clear</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
  <el-row>
    <el-col :xl="16" :lg="18">
      <el-table ref="tableRef" :data="records?.store" :v-loading="records?.loading" border @sort-change="handleSortChange"
        :default-sort="tableSort">
        <el-table-column v-for="(value, key) in recordProperties" :prop="key" :label="value.label"
          :formatter="value.format" :sortable="value.sortable" />
        <el-table-column>
          <template #default="scope">
            <el-button size="small" type="danger" @click="handleDeleteRecord(scope.$index, scope.row)"
              :disabled="records?.loading">
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="prev, pager, next" :page-size="query.limit" :total="records?.count"
        @current-change="handlePageChange" @next-click="handlePageChange" @prev-click="handlePageChange" />
    </el-col>
  </el-row>
</template>
