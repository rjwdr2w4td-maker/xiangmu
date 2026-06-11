<template>
  <div class="planting-manage">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>青贮饲料种植备案</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增备案
          </el-button>
        </div>
      </template>

      <el-row :gutter="20" class="stats-row">
        <el-col :span="6"><el-statistic title="备案主体" :value="records.length" suffix="家" /></el-col>
        <el-col :span="6"><el-statistic title="种植面积" :value="totalArea" suffix="亩" /></el-col>
        <el-col :span="6"><el-statistic title="预计产量" :value="totalYield" suffix="吨" /></el-col>
        <el-col :span="6"><el-statistic title="待审核" :value="pendingCount" suffix="条" /></el-col>
      </el-row>

      <el-divider />

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="主体名称">
          <el-input v-model="searchForm.keyword" placeholder="请输入主体名称" clearable />
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="searchForm.status" placeholder="全部状态" clearable>
            <el-option label="待审核" value="pending" />
            <el-option label="已审核" value="approved" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="filteredRecords" border style="width: 100%">
        <el-table-column prop="id" label="备案编号" width="150" />
        <el-table-column prop="subjectName" label="备案主体" min-width="180" />
        <el-table-column prop="varietyName" label="种植品种" width="120" />
        <el-table-column prop="area" label="面积(亩)" width="110" sortable />
        <el-table-column prop="expectedYield" label="预计产量(吨)" width="130" sortable />
        <el-table-column prop="plantingDate" label="计划种植日期" width="130" />
        <el-table-column label="中心坐标" width="170">
          <template #default="{ row }">{{ row.plotLocation.join(', ') }}</template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'approved' ? 'success' : 'warning'">{{ row.statusName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="270" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleView(row)">详情</el-button>
            <el-button size="small" type="primary" @click="handleLocate(row)">定位</el-button>
            <el-button size="small" type="success" :disabled="row.status === 'approved'" @click="handleApprove(row)">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="detailVisible" title="种植备案详情" width="780px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="备案编号">{{ currentRecord.id }}</el-descriptions-item>
        <el-descriptions-item label="主体名称">{{ currentRecord.subjectName }}</el-descriptions-item>
        <el-descriptions-item label="种植品种">{{ currentRecord.varietyName }}</el-descriptions-item>
        <el-descriptions-item label="计划种植日期">{{ currentRecord.plantingDate }}</el-descriptions-item>
        <el-descriptions-item label="备案面积">{{ currentRecord.area }}亩</el-descriptions-item>
        <el-descriptions-item label="预计产量">{{ currentRecord.expectedYield }}吨</el-descriptions-item>
        <el-descriptions-item label="上报人">{{ currentRecord.reporter }}</el-descriptions-item>
        <el-descriptions-item label="上报时间">{{ currentRecord.reportTime }}</el-descriptions-item>
        <el-descriptions-item label="审核单位">{{ currentRecord.reviewer || '待审核' }}</el-descriptions-item>
        <el-descriptions-item label="审核时间">{{ currentRecord.reviewTime || '待审核' }}</el-descriptions-item>
      </el-descriptions>
      <el-divider content-position="left">地块勾绘坐标</el-divider>
      <div class="geom-list">
        <el-tag v-for="point in currentRecord.plotGeom" :key="point.join(',')">{{ point.join(', ') }}</el-tag>
      </div>
    </el-dialog>

    <el-dialog v-model="formVisible" title="新增种植备案" width="680px">
      <el-form :model="form" label-width="110px">
        <el-form-item label="备案主体"><el-input v-model="form.subjectName" /></el-form-item>
        <el-form-item label="种植品种"><el-input v-model="form.varietyName" /></el-form-item>
        <el-form-item label="种植面积"><el-input-number v-model="form.area" :min="1" :step="10" /></el-form-item>
        <el-form-item label="预计产量"><el-input-number v-model="form.expectedYield" :min="1" :step="50" /></el-form-item>
        <el-form-item label="种植日期"><el-date-picker v-model="form.plantingDate" type="date" value-format="YYYY-MM-DD" /></el-form-item>
        <el-form-item label="地块中心"><el-input v-model="form.location" placeholder="经度,纬度" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交备案</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="locateVisible" title="地块定位预览" width="760px">
      <div class="map-preview">
        <div class="map-grid"></div>
        <div class="plot-card">
          <h4>{{ currentRecord.subjectName }}</h4>
          <p>中心点：{{ currentRecord.plotLocation?.join(', ') }}</p>
          <p>面积：{{ currentRecord.area }}亩</p>
          <el-tag type="success">已加载青贮地块边界</el-tag>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { silagePlantingRecords } from '@/data/silage'

const records = ref(silagePlantingRecords.map(item => ({ ...item })))
const detailVisible = ref(false)
const formVisible = ref(false)
const locateVisible = ref(false)
const currentRecord = ref({})

const searchForm = reactive({ keyword: '', status: '' })
const form = reactive({ subjectName: '', varietyName: '青贮玉米', area: 100, expectedYield: 400, plantingDate: '', location: '117.36,31.86' })

const filteredRecords = computed(() => records.value.filter(item => {
  const keyword = searchForm.keyword.trim()
  return (!keyword || item.subjectName.includes(keyword)) && (!searchForm.status || item.status === searchForm.status)
}))
const totalArea = computed(() => records.value.reduce((sum, item) => sum + item.area, 0))
const totalYield = computed(() => records.value.reduce((sum, item) => sum + item.expectedYield, 0))
const pendingCount = computed(() => records.value.filter(item => item.status === 'pending').length)

const handleSearch = () => ElMessage.success(`查询到 ${filteredRecords.value.length} 条备案记录`)
const handleReset = () => Object.assign(searchForm, { keyword: '', status: '' })
const handleView = row => {
  currentRecord.value = row
  detailVisible.value = true
}
const handleLocate = row => {
  currentRecord.value = row
  locateVisible.value = true
}
const handleApprove = row => {
  row.status = 'approved'
  row.statusName = '已审核'
  row.reviewer = '县级农业农村局'
  row.reviewTime = '2026-03-23 09:30:00'
  ElMessage.success(`${row.id} 已审核通过`)
}
const handleAdd = () => {
  Object.assign(form, { subjectName: '', varietyName: '青贮玉米', area: 100, expectedYield: 400, plantingDate: '', location: '117.36,31.86' })
  formVisible.value = true
}
const handleSubmit = () => {
  formVisible.value = false
  ElMessage.success('种植备案已提交，等待审核')
}
</script>

<style scoped>
.planting-manage {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stats-row,
.search-form {
  margin-bottom: 16px;
}

.geom-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.map-preview {
  height: 360px;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background: linear-gradient(135deg, #e8f5e9, #f1f8e9);
  border: 1px solid #dcdfe6;
}

.map-grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(103, 194, 58, 0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(103, 194, 58, 0.18) 1px, transparent 1px);
  background-size: 32px 32px;
}

.plot-card {
  position: absolute;
  left: 40px;
  top: 40px;
  width: 260px;
  padding: 18px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
</style>
