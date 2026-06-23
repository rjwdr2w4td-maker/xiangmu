<template>
  <div class="event-discovery">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>事件智能发现（疑似撂荒/种植未落实AI识别）</span>
          <el-button type="primary" @click="handleStartAnalysis">
            <el-icon><VideoPlay /></el-icon>
            启动AI识别分析
          </el-button>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="发现时间">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        
        <el-form-item label="问题类型">
          <el-select v-model="searchForm.problemType" placeholder="全部" clearable>
            <el-option label="疑似撂荒" value="fallow" />
            <el-option label="种植计划未落实" value="not_plant" />
            <el-option label="非法占用" value="illegal_use" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="风险等级">
          <el-select v-model="searchForm.riskLevel" placeholder="全部" clearable>
            <el-option label="高风险" value="high" />
            <el-option label="中风险" value="medium" />
            <el-option label="低风险" value="low" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="处理状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable>
            <el-option label="待核查" value="pending_check" />
            <el-option label="核查中" value="checking" />
            <el-option label="已上报" value="reported" />
            <el-option label="整改中" value="rectifying" />
            <el-option label="已整改" value="completed" />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-statistic title="疑似图斑总数" :value="stats.total" suffix="个">
            <template #suffix>
              <el-tag type="info" size="small">个</el-tag>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="8">
          <el-statistic title="待核查" :value="stats.pending" suffix="个">
            <template #suffix>
              <el-tag type="danger" size="small">个</el-tag>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="8">
          <el-statistic title="高风险图斑" :value="stats.highRisk" suffix="个">
            <template #suffix>
              <el-tag type="warning" size="small">个</el-tag>
            </template>
          </el-statistic>
        </el-col>
      </el-row>

      <el-divider />

      <el-table :data="paginatedPlots" border>
        <el-table-column prop="plotNo" label="图斑编号" min-width="150" />
        <el-table-column label="位置" min-width="200">
          <template #default="{ row }">
            <div>{{ row.location.city }} {{ row.location.county }}</div>
            <div style="font-size: 12px; color: #666">
              {{ row.location.town }} {{ row.location.village }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="problemTypeName" label="问题类型" min-width="120">
          <template #default="{ row }">
            <el-tag :type="getProblemTypeTag(row.problemType)">
              {{ row.problemTypeName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="area" label="面积(亩)" min-width="100" sortable />
        <el-table-column prop="riskLevel" label="风险等级" min-width="100">
          <template #default="{ row }">
            <el-tag :type="getRiskTag(row.riskLevel)">
              {{ getRiskName(row.riskLevel) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="discoveryTime" label="发现时间" min-width="160" />
        <el-table-column prop="statusName" label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)">
              {{ row.statusName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="280">
          <template #default="{ row }">
            <el-button size="small" @click="handleViewPlot(row)">查看详情</el-button>
            <el-button
              size="small"
              type="primary"
              @click="handleAssignTask(row)"
              :disabled="row.status !== 'pending_check'"
            >
              下发任务
            </el-button>
            <el-button
              size="small"
              type="success"
              @click="handleQuickReport(row)"
              :disabled="row.status !== 'pending_check'"
            >
              随手拍上报
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :total="filteredPlots.length"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>

    <el-dialog
      v-model="viewDialogVisible"
      title="图斑详情 - 变化图斑库"
      width="900px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="图斑编号">{{ viewData.plotNo }}</el-descriptions-item>
        <el-descriptions-item label="问题类型">{{ viewData.problemTypeName }}</el-descriptions-item>
        <el-descriptions-item label="面积">{{ viewData.area }}亩</el-descriptions-item>
        <el-descriptions-item label="风险等级">{{ getRiskName(viewData.riskLevel) }}</el-descriptions-item>
        <el-descriptions-item label="风险原因">{{ viewData.riskReason }}</el-descriptions-item>
        <el-descriptions-item label="发现时间">{{ viewData.discoveryTime }}</el-descriptions-item>
        <el-descriptions-item label="位置" :span="2">
          {{ viewData.location.province }} {{ viewData.location.city }}
          {{ viewData.location.county }} {{ viewData.location.town }}
          {{ viewData.location.village }}
        </el-descriptions-item>
        <el-descriptions-item label="坐标" :span="2">
          {{ viewData.location.coordinate[0] }}°E,
          {{ viewData.location.coordinate[1] }}°N
        </el-descriptions-item>
      </el-descriptions>

      <div style="margin-top: 20px">
        <h4>前后对比影像</h4>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-image
              :src="viewData.beforeImage"
              fit="cover"
              style="width: 100%; height: 200px"
            >
              <template #placeholder>
                <div style="display: flex; align-items: center; justify-content: center; height: 200px; background: #f5f7fa">
                  <el-icon><Picture /></el-icon>
                  <span style="margin-left: 10px">前时相影像</span>
                </div>
              </template>
            </el-image>
            <div style="text-align: center; margin-top: 10px">前时相影像（2025年10月）</div>
          </el-col>
          <el-col :span="12">
            <el-image
              :src="viewData.afterImage"
              fit="cover"
              style="width: 100%; height: 200px"
            >
              <template #placeholder>
                <div style="display: flex; align-items: center; justify-content: center; height: 200px; background: #f5f7fa">
                  <el-icon><Picture /></el-icon>
                  <span style="margin-left: 10px">后时相影像</span>
                </div>
              </template>
            </el-image>
            <div style="text-align: center; margin-top: 10px">后时相影像（2026年3月）</div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>

    <el-dialog
      v-model="assignDialogVisible"
      title="任务下发 - 自动分配责任人"
      width="600px"
    >
      <el-form :model="assignForm" label-width="120px">
        <el-form-item label="图斑编号">
          <el-input v-model="assignForm.plotNo" disabled />
        </el-form-item>
        
        <el-form-item label="责任区域">
          <el-input v-model="assignForm.region" disabled />
        </el-form-item>
        
        <el-form-item label="责任人">
          <el-input v-model="assignForm.assignee" disabled />
        </el-form-item>
        
        <el-form-item label="核查时限">
          <el-date-picker
            v-model="assignForm.deadline"
            type="datetime"
            placeholder="选择截止时间"
          />
        </el-form-item>
        
        <el-form-item label="备注">
          <el-input
            v-model="assignForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入下发备注"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="assignDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmAssign">确认下发</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="analysisDialogVisible"
      title="AI智能识别分析"
      width="600px"
    >
      <el-progress
        :percentage="analysisProgress"
        :status="analysisProgress === 100 ? 'success' : ''"
      />
      <div style="margin-top: 20px; text-align: center">
        <div v-if="analysisProgress < 100">
          <el-icon class="is-loading" style="font-size: 24px; color: #409EFF">
            <Loading />
          </el-icon>
          <p style="margin-top: 10px">正在进行遥感影像智能比对...</p>
          <p style="color: #666; font-size: 12px">
            比对时间范围：2025年10月 vs 2026年3月
          </p>
        </div>
        <div v-else>
          <el-icon style="font-size: 24px; color: #67C23A">
            <SuccessFilled />
          </el-icon>
          <p style="margin-top: 10px; color: #67C23A">AI识别完成！</p>
          <p style="color: #666; font-size: 12px">
            共发现 {{ stats.total }} 个疑似图斑，其中高风险 {{ stats.highRisk }} 个
          </p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { changePlots } from '@/data/security'

const searchForm = reactive({
  dateRange: [],
  problemType: '',
  riskLevel: '',
  status: ''
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10
})

const plots = ref([...changePlots])

const viewDialogVisible = ref(false)
const assignDialogVisible = ref(false)
const analysisDialogVisible = ref(false)
const analysisProgress = ref(0)

const viewData = ref({})
const assignForm = reactive({
  plotNo: '',
  region: '',
  assignee: '',
  deadline: '',
  remark: ''
})

const stats = computed(() => {
  return {
    total: plots.value.length,
    pending: plots.value.filter(p => p.status === 'pending_check' || p.status === 'checking').length,
    highRisk: plots.value.filter(p => p.riskLevel === 'high').length
  }
})

const filteredPlots = computed(() => {
  let result = plots.value
  
  if (searchForm.problemType) {
    result = result.filter(p => p.problemType === searchForm.problemType)
  }
  if (searchForm.riskLevel) {
    result = result.filter(p => p.riskLevel === searchForm.riskLevel)
  }
  if (searchForm.status) {
    result = result.filter(p => p.status === searchForm.status)
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
    high: '高风险',
    medium: '中风险',
    low: '低风险'
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
    reported: 'primary',
    rectifying: 'info',
    completed: 'success'
  }
  return map[status] || ''
}

const handleSearch = () => {
  pagination.currentPage = 1
}

const handleReset = () => {
  searchForm.dateRange = []
  searchForm.problemType = ''
  searchForm.riskLevel = ''
  searchForm.status = ''
}

const handleViewPlot = (row) => {
  viewData.value = row
  viewDialogVisible.value = true
}

const handleAssignTask = (row) => {
  assignForm.plotNo = row.plotNo
  assignForm.region = `${row.location.city} ${row.location.county}`
  assignForm.assignee = row.location.county + '农业农村局'
  assignForm.deadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  assignForm.remark = ''
  assignDialogVisible.value = true
}

const handleConfirmAssign = () => {
  const plot = plots.value.find(item => item.plotNo === assignForm.plotNo)
  if (plot) {
    plot.status = 'checking'
    plot.statusName = '核查中'
    plot.assignee = assignForm.assignee
    plot.assignTime = new Date().toISOString().slice(0, 16).replace('T', ' ')
  }
  ElMessage.success('图斑任务已下发至' + assignForm.assignee)
  assignDialogVisible.value = false
}

const handleQuickReport = (row) => {
  row.status = 'reported'
  row.statusName = '已上报'
  row.reportTime = new Date().toISOString().slice(0, 16).replace('T', ' ')
  row.reportSource = '移动端随手拍'
  ElMessage.success(`${row.plotNo}已通过随手拍上报`)
}

const handleStartAnalysis = () => {
  analysisProgress.value = 0
  analysisDialogVisible.value = true
  
  const timer = setInterval(() => {
    analysisProgress.value += 10
    if (analysisProgress.value >= 100) {
      clearInterval(timer)
      ElMessage.success('AI智能识别分析完成')
    }
  }, 300)
}
</script>

<style scoped>
.event-discovery {
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

h4 {
  color: #333;
  font-size: 16px;
  margin: 10px 0;
}
</style>