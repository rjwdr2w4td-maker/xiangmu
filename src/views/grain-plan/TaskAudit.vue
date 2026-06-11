<template>
  <div class="task-audit">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>种植计划审核</span>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="年度">
          <el-select v-model="searchForm.year" placeholder="请选择">
            <el-option label="2026年" value="2026" />
            <el-option label="2025年" value="2025" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="审核状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable>
            <el-option label="待审核" value="pending" />
            <el-option label="已通过" value="approved" />
            <el-option label="已驳回" value="rejected" />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="filteredAuditList" border style="width: 100%">
        <el-table-column prop="id" label="计划编号" width="150" />
        <el-table-column prop="name" label="计划名称" min-width="200" />
        <el-table-column prop="year" label="年度" width="80" />
        <el-table-column prop="cropType" label="作物类型" width="100">
          <template #default="{ row }">
            <el-tag>{{ row.cropType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="totalArea" label="总面积(万亩)" width="120">
          <template #default="{ row }">
            {{ (row.totalArea / 10000).toFixed(0) }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="提交时间" width="120" />
        <el-table-column prop="submitter" label="提交人" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)">
              {{ getStatusName(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleView(row)">查看</el-button>
            <el-button
              size="small"
              type="primary"
              @click="handleAudit(row)"
              :disabled="row.status !== 'pending'"
            >
              审核
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="auditDialogVisible"
      title="计划审核"
      width="800px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="计划名称">{{ currentPlan.name }}</el-descriptions-item>
        <el-descriptions-item label="年度">{{ currentPlan.year }}年</el-descriptions-item>
        <el-descriptions-item label="作物类型">{{ currentPlan.cropType }}</el-descriptions-item>
        <el-descriptions-item label="总面积">{{ (currentPlan.totalArea / 10000).toFixed(0) }}万亩</el-descriptions-item>
        <el-descriptions-item label="提交人">{{ currentPlan.submitter }}</el-descriptions-item>
        <el-descriptions-item label="提交时间">{{ currentPlan.createTime }}</el-descriptions-item>
      </el-descriptions>

      <el-divider content-position="left">任务分解详情</el-divider>

      <el-table :data="currentPlan.decomposition" border style="width: 100%">
        <el-table-column prop="name" label="市级名称" min-width="180" />
        <el-table-column prop="planArea" label="计划面积(亩)" min-width="200" />
        <el-table-column label="承担主体类型" min-width="280">
          <template #default="{ row }">
            <el-tag v-for="type in row.undertakerTypes" :key="type" style="margin: 2px">
              {{ getTypeName(type) }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <el-form :model="auditForm" label-width="100px" style="margin-top: 20px">
        <el-form-item label="审核意见">
          <el-radio-group v-model="auditForm.result">
            <el-radio label="approved">通过</el-radio>
            <el-radio label="rejected">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="审核说明">
          <el-input
            v-model="auditForm.comment"
            type="textarea"
            :rows="3"
            placeholder="请输入审核说明"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="auditDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAuditSubmit">提交审核</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({
  year: '2026',
  status: ''
})

const auditList = ref([
  {
    id: 'TASK2026001',
    name: '2026年度小麦播种计划',
    year: 2026,
    cropType: '小麦',
    totalArea: 43000000,
    createTime: '2025-12-01',
    submitter: '省农业农村厅',
    status: 'pending',
    decomposition: [
      { name: '合肥市', planArea: 3500000, undertakerTypes: ['large_farmer', 'family_farm'] },
      { name: '芜湖市', planArea: 2800000, undertakerTypes: ['large_farmer', 'cooperative'] },
      { name: '蚌埠市', planArea: 4200000, undertakerTypes: ['large_farmer', 'family_farm', 'ordinary_farmer'] }
    ]
  }
])

const auditDialogVisible = ref(false)
const currentPlan = ref({})
const auditForm = reactive({
  result: 'approved',
  comment: ''
})

const filteredAuditList = computed(() => {
  let result = auditList.value
  if (searchForm.year) {
    result = result.filter(item => item.year === parseInt(searchForm.year))
  }
  if (searchForm.status) {
    result = result.filter(item => item.status === searchForm.status)
  }
  return result
})

const getStatusTag = (status) => {
  const map = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger'
  }
  return map[status] || ''
}

const getStatusName = (status) => {
  const map = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已驳回'
  }
  return map[status] || status
}

const getTypeName = (type) => {
  const map = {
    large_farmer: '规模大户',
    family_farm: '家庭农场',
    cooperative: '合作社',
    ordinary_farmer: '普通农户'
  }
  return map[type] || type
}

const handleSearch = () => {
  ElMessage.success(`已查询到${filteredAuditList.value.length}条审核记录`)
}

const handleView = (row) => {
  currentPlan.value = row
  auditDialogVisible.value = true
}

const handleAudit = (row) => {
  currentPlan.value = row
  auditForm.result = 'approved'
  auditForm.comment = ''
  auditDialogVisible.value = true
}

const handleAuditSubmit = () => {
  const index = auditList.value.findIndex(item => item.id === currentPlan.value.id)
  if (index !== -1) {
    auditList.value[index].status = auditForm.result
    ElMessage.success('审核完成')
    auditDialogVisible.value = false
  }
}
</script>

<style scoped>
.task-audit {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
}
</style>