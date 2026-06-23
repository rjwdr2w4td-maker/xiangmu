<template>
  <div class="storage-manage">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>青贮饲料收储申报</span>
          <el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon>新增申报</el-button>
        </div>
      </template>

      <el-row :gutter="20" class="stats-row">
        <el-col :span="6"><el-statistic title="收储记录" :value="records.length" suffix="条" /></el-col>
        <el-col :span="6"><el-statistic title="收储重量" :value="totalWeight" suffix="吨" /></el-col>
        <el-col :span="6"><el-statistic title="收储金额" :value="totalAmount" suffix="万元" /></el-col>
        <el-col :span="6"><el-statistic title="待审核" :value="pendingCount" suffix="条" /></el-col>
      </el-row>

      <el-divider />

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="收储企业"><el-input v-model="searchForm.keyword" placeholder="企业或来源农户" clearable /></el-form-item>
        <el-form-item label="备案状态">
          <el-select v-model="searchForm.status" placeholder="全部状态" clearable>
            <el-option label="待审核" value="pending" />
            <el-option label="已备案" value="approved" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="filteredRecords" border style="width: 100%">
        <el-table-column prop="id" label="申报编号" width="150" />
        <el-table-column prop="subjectName" label="收储企业" min-width="190" />
        <el-table-column prop="sourceFarmer" label="来源主体" min-width="170" />
        <el-table-column prop="varietyName" label="品种" width="110" />
        <el-table-column prop="price" label="单价(元/吨)" width="120" sortable />
        <el-table-column prop="weight" label="重量(吨)" width="110" sortable />
        <el-table-column label="总金额" width="120"><template #default="{ row }">{{ formatAmount(row.totalAmount) }}万元</template></el-table-column>
        <el-table-column prop="storageDate" label="收储日期" width="120" />
        <el-table-column label="状态" width="100"><template #default="{ row }"><el-tag :type="row.status === 'approved' ? 'success' : 'warning'">{{ row.statusName }}</el-tag></template></el-table-column>
        <el-table-column label="操作" width="260" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleView(row)">详情</el-button>
            <el-button size="small" type="primary" @click="handleSubmit(row)">提交</el-button>
            <el-button size="small" type="success" :disabled="row.status === 'approved'" @click="handleApprove(row)">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="detailVisible" title="收储申报详情" width="760px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="申报编号">{{ currentRecord.id }}</el-descriptions-item>
        <el-descriptions-item label="收储企业">{{ currentRecord.subjectName }}</el-descriptions-item>
        <el-descriptions-item label="来源主体">{{ currentRecord.sourceFarmer }}</el-descriptions-item>
        <el-descriptions-item label="收储品种">{{ currentRecord.varietyName }}</el-descriptions-item>
        <el-descriptions-item label="收储单价">{{ currentRecord.price }}元/吨</el-descriptions-item>
        <el-descriptions-item label="收储重量">{{ currentRecord.weight }}吨</el-descriptions-item>
        <el-descriptions-item label="总金额">{{ formatAmount(currentRecord.totalAmount) }}万元</el-descriptions-item>
        <el-descriptions-item label="收储日期">{{ currentRecord.storageDate }}</el-descriptions-item>
        <el-descriptions-item label="审核单位">{{ currentRecord.reviewer || '待审核' }}</el-descriptions-item>
        <el-descriptions-item label="审核时间">{{ currentRecord.reviewTime || '待审核' }}</el-descriptions-item>
      </el-descriptions>
      <el-divider content-position="left">资金核验</el-divider>
      <el-steps :active="currentRecord.status === 'approved' ? 3 : 1" finish-status="success" align-center>
        <el-step title="企业申报" />
        <el-step title="来源核验" />
        <el-step title="备案通过" />
      </el-steps>
    </el-dialog>

    <el-dialog v-model="formVisible" title="新增收储申报" width="640px">
      <el-form :model="form" label-width="110px">
        <el-form-item label="收储企业"><el-input v-model="form.subjectName" /></el-form-item>
        <el-form-item label="来源主体"><el-input v-model="form.sourceFarmer" /></el-form-item>
        <el-form-item label="单价"><el-input-number v-model="form.price" :min="1" /></el-form-item>
        <el-form-item label="重量"><el-input-number v-model="form.weight" :min="1" /></el-form-item>
        <el-form-item label="收储日期"><el-date-picker v-model="form.storageDate" type="date" value-format="YYYY-MM-DD" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">提交申报</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { silageStorageRecords } from '@/data/silage'

function loadMobileStorageRecords() {
  try {
    return JSON.parse(localStorage.getItem('mobileStorageRecords') || '[]')
  } catch (error) {
    return []
  }
}

const records = ref([
  ...loadMobileStorageRecords(),
  ...silageStorageRecords.map(item => ({ ...item }))
])
const detailVisible = ref(false)
const formVisible = ref(false)
const currentRecord = ref({})
const searchForm = reactive({ keyword: '', status: '' })
const form = reactive({ subjectName: '', sourceFarmer: '', price: 450, weight: 100, storageDate: '' })

const filteredRecords = computed(() => records.value.filter(item => {
  const keyword = searchForm.keyword.trim()
  return (!keyword || item.subjectName.includes(keyword) || item.sourceFarmer.includes(keyword)) && (!searchForm.status || item.status === searchForm.status)
}))
const totalWeight = computed(() => records.value.reduce((sum, item) => sum + item.weight, 0))
const totalAmount = computed(() => Number((records.value.reduce((sum, item) => sum + item.totalAmount, 0) / 10000).toFixed(1)))
const pendingCount = computed(() => records.value.filter(item => item.status === 'pending').length)

const formatAmount = value => value ? (value / 10000).toFixed(2) : '0.00'
const handleSearch = () => ElMessage.success(`查询到 ${filteredRecords.value.length} 条收储记录`)
const handleReset = () => Object.assign(searchForm, { keyword: '', status: '' })
const handleView = row => { currentRecord.value = row; detailVisible.value = true }
const handleSubmit = row => ElMessage.success(`${row.id} 已提交县级复核`)
const handleApprove = row => {
  row.status = 'approved'
  row.statusName = '已备案'
  row.reviewer = '县级农业农村局'
  row.reviewTime = '2026-08-21 10:00:00'
  ElMessage.success(`${row.id} 已审核备案`)
}
const handleAdd = () => { Object.assign(form, { subjectName: '', sourceFarmer: '', price: 450, weight: 100, storageDate: '' }); formVisible.value = true }
const handleSave = () => { formVisible.value = false; ElMessage.success('收储申报已提交') }
</script>

<style scoped>
.storage-manage { padding: 0; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.stats-row, .search-form { margin-bottom: 16px; }
</style>
