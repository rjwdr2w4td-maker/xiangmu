<template>
  <div class="change-plot-library">
    <el-card class="main-card">
      <template #header>
        <div class="card-header">
          <span class="title">变化图斑库</span>
          <div class="header-buttons">
            <el-button @click="resetPlots">
              <el-icon><Refresh /></el-icon>
              重置数据
            </el-button>
            <el-button type="primary" @click="handleAutoDispatch">
              <el-icon><Position /></el-icon>
              自动下发
            </el-button>
          </div>
        </div>
      </template>

      <div class="filter-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索图斑编号或位置"
          clearable
          style="width: 240px"
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <el-select v-model="filterStatus" placeholder="状态筛选" clearable style="width: 140px" @change="handleFilter">
          <el-option label="待核查" value="pending_check" />
          <el-option label="核查中" value="checking" />
          <el-option label="待审核" value="pending_review" />
          <el-option label="整改中" value="rectifying" />
          <el-option label="已整改" value="completed" />
          <el-option label="已结案" value="closed" />
        </el-select>

        <el-select v-model="filterRisk" placeholder="风险等级" clearable style="width: 120px" @change="handleFilter">
          <el-option label="高" value="high" />
          <el-option label="中" value="medium" />
          <el-option label="低" value="low" />
        </el-select>

        <el-button @click="handleResetFilter">重置</el-button>
      </div>

      <el-table
        :data="paginatedPlots"
        border
        highlight-current-row
        @row-click="handleRowClick"
        style="width: 100%"
      >
        <el-table-column prop="plotNo" label="图斑编号" min-width="140" />
        <el-table-column label="位置" min-width="180">
          <template #default="{ row }">
            <span>{{ row.location.county }}/{{ row.location.town }}/{{ row.location.village }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="area" label="面积(亩)" width="100" sortable />
        <el-table-column prop="problemTypeName" label="类型" width="130">
          <template #default="{ row }">
            <el-tag :type="getProblemTypeTag(row.problemType)" size="small">
              {{ row.problemTypeName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="风险等级" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="getRiskTag(row.riskLevel)" size="small">
              {{ getRiskName(row.riskLevel) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="statusName" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)" size="small">
              {{ row.statusName }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :total="filteredPlots.length"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next"
        style="margin-top: 16px; justify-content: flex-end"
      />
    </el-card>

    <transition name="slide">
      <el-card v-if="selectedPlot" class="detail-panel">
        <template #header>
          <div class="panel-header">
            <span>图斑详情</span>
            <el-button link @click="selectedPlot = null">
              <el-icon><Close /></el-icon>
            </el-button>
          </div>
        </template>

        <el-descriptions :column="1" border size="small">
          <el-descriptions-item label="图斑编号">{{ selectedPlot.plotNo }}</el-descriptions-item>
          <el-descriptions-item label="位置">
            {{ selectedPlot.location.county }} {{ selectedPlot.location.town }} {{ selectedPlot.location.village }}
          </el-descriptions-item>
          <el-descriptions-item label="面积">{{ selectedPlot.area }} 亩</el-descriptions-item>
          <el-descriptions-item label="风险等级">
            <el-tag :type="getRiskTag(selectedPlot.riskLevel)" size="small">
              {{ getRiskName(selectedPlot.riskLevel) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="风险原因">
            <div style="line-height: 1.6">{{ selectedPlot.riskReason }}</div>
          </el-descriptions-item>
        </el-descriptions>

        <div class="section-title">变化前后对比图</div>
        <el-row :gutter="12">
          <el-col :span="12">
            <div class="image-box">
              <el-image
                :src="selectedPlot.beforeImage"
                fit="cover"
                :preview-src-list="[selectedPlot.beforeImage]"
              >
                <template #error>
                  <div class="image-placeholder">
                    <el-icon><Picture /></el-icon>
                    <span>前时相影像</span>
                  </div>
                </template>
              </el-image>
              <div class="image-label">前时相影像</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="image-box">
              <el-image
                :src="selectedPlot.afterImage"
                fit="cover"
                :preview-src-list="[selectedPlot.afterImage]"
              >
                <template #error>
                  <div class="image-placeholder">
                    <el-icon><Picture /></el-icon>
                    <span>后时相影像</span>
                  </div>
                </template>
              </el-image>
              <div class="image-label">后时相影像</div>
            </div>
          </el-col>
        </el-row>

        <div v-if="selectedPlot.checkResult" class="section-title">核查结果</div>
        <el-descriptions v-if="selectedPlot.checkResult" :column="1" border size="small">
          <el-descriptions-item label="核查人">{{ selectedPlot.checkResult.checker }}</el-descriptions-item>
          <el-descriptions-item label="核查时间">{{ selectedPlot.checkResult.checkTime }}</el-descriptions-item>
          <el-descriptions-item label="核查结论">
            <el-tag :type="selectedPlot.checkResult.result === 'confirmed' ? 'danger' : 'success'" size="small">
              {{ selectedPlot.checkResult.resultName }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="实际面积">{{ selectedPlot.checkResult.actualArea }} 亩</el-descriptions-item>
          <el-descriptions-item label="核查说明">
            <div style="line-height: 1.6">{{ selectedPlot.checkResult.description }}</div>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </transition>

    <el-dialog
      v-model="dispatchDialogVisible"
      title="自动下发确认"
      width="400px"
    >
      <div style="text-align: center; padding: 20px 0">
        <el-icon style="font-size: 48px; color: #E6A23C"><WarningFilled /></el-icon>
        <p style="margin-top: 16px; font-size: 16px">确定要自动下发所有待核查图斑吗?</p>
      </div>
      <template #footer>
        <el-button @click="dispatchDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmDispatch">确认下发</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getPlots, savePlots } from '@/data/plotStore'

const searchKeyword = ref('')
const filterStatus = ref('')
const filterRisk = ref('')
const selectedPlot = ref(null)
const dispatchDialogVisible = ref(false)

const pagination = reactive({
  currentPage: 1,
  pageSize: 10
})

const plots = ref([])

onMounted(() => {
  plots.value = getPlots()
})

const sortedPlots = computed(() => {
  const riskOrder = { high: 0, medium: 1, low: 2 }
  return [...plots.value].sort((a, b) => {
    return riskOrder[a.riskLevel] - riskOrder[b.riskLevel]
  })
})

const filteredPlots = computed(() => {
  let result = sortedPlots.value

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(p => 
      p.plotNo.toLowerCase().includes(keyword) ||
      p.location.county.includes(keyword) ||
      p.location.town.includes(keyword) ||
      p.location.village.includes(keyword)
    )
  }

  if (filterStatus.value) {
    result = result.filter(p => p.status === filterStatus.value)
  }

  if (filterRisk.value) {
    result = result.filter(p => p.riskLevel === filterRisk.value)
  }

  return result
})

const paginatedPlots = computed(() => {
  const start = (pagination.currentPage - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  return filteredPlots.value.slice(start, end)
})

const getProblemTypeTag = (type) => {
  const map = {
    fallow: 'danger',
    not_plant: 'warning',
    illegal_use: 'info'
  }
  return map[type] || ''
}

const getRiskName = (level) => {
  const map = {
    high: '高',
    medium: '中',
    low: '低'
  }
  return map[level] || level
}

const getRiskTag = (level) => {
  const map = {
    high: 'danger',
    medium: 'warning',
    low: 'success'
  }
  return map[level] || ''
}

const getStatusTag = (status) => {
  const map = {
    pending_check: 'danger',
    checking: 'warning',
    pending_review: 'primary',
    rectifying: 'info',
    completed: 'success',
    closed: ''
  }
  return map[status] || ''
}

const handleSearch = () => {
  pagination.currentPage = 1
}

const handleFilter = () => {
  pagination.currentPage = 1
}

const handleResetFilter = () => {
  searchKeyword.value = ''
  filterStatus.value = ''
  filterRisk.value = ''
  pagination.currentPage = 1
}

const handleRowClick = (row) => {
  selectedPlot.value = row
}

const handleAutoDispatch = () => {
  dispatchDialogVisible.value = true
}

const confirmDispatch = () => {
  const pendingPlots = plots.value.filter(p => p.status === 'pending_check')
  if (pendingPlots.length === 0) {
    ElMessage.warning('暂无待核查图斑')
    dispatchDialogVisible.value = false
    return
  }

  const county = pendingPlots[0].location.county
  const now = new Date().toISOString().slice(0, 16).replace('T', ' ')
  pendingPlots.forEach(plot => {
    plot.status = 'checking'
    plot.statusName = '核查中'
    if (!plot.flowLogs) plot.flowLogs = []
    plot.flowLogs.push({
      time: now,
      action: '任务下发，状态变更为核查中',
      operator: '省农业农村厅'
    })
  })
  savePlots(plots.value)

  dispatchDialogVisible.value = false
  ElMessage.success(`已下发至${county}县农业农村局`)
}
</script>

<style scoped>
.change-plot-library {
  display: flex;
  gap: 16px;
  height: calc(100vh - 140px);
}

.main-card {
  flex: 1;
  border-radius: 4px;
}

.main-card :deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #ebeef5;
}

.main-card :deep(.el-card__body) {
  padding: 16px 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header .title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.header-buttons {
  display: flex;
  gap: 12px;
}

.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.detail-panel {
  width: 320px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: auto;
}

.detail-panel :deep(.el-card__header) {
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
}

.detail-panel :deep(.el-card__body) {
  padding: 16px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.section-title {
  margin: 16px 0 12px;
  padding-left: 8px;
  border-left: 3px solid #409EFF;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.image-box {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}

.image-box .el-image {
  width: 100%;
  height: 120px;
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 120px;
  background: #f5f7fa;
  color: #909399;
}

.image-placeholder .el-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.image-label {
  padding: 6px 0;
  text-align: center;
  font-size: 12px;
  color: #606266;
  background: #fafafa;
  border-top: 1px solid #ebeef5;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

:deep(.el-table) {
  --el-table-border-color: #ebeef5;
  background-color: #fff;
}

:deep(.el-table th.el-table__cell) {
  background-color: #fafafa;
  color: #606266;
  font-weight: 600;
}

:deep(.el-table--border .el-table__cell) {
  border-right: 1px solid #ebeef5;
}

:deep(.el-descriptions__label) {
  width: 80px;
  font-weight: 500;
}
</style>
