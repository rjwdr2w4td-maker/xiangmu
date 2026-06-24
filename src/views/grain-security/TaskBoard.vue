<template>
  <div class="task-board">
    <div class="header">
      <h2>任务跟踪看板</h2>
    </div>

    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-label">图斑总数</div>
      </div>
      <div class="stat-card checking">
        <div class="stat-value">{{ stats.checking }}</div>
        <div class="stat-label">核查中</div>
      </div>
      <div class="stat-card pending">
        <div class="stat-value">{{ stats.pending }}</div>
        <div class="stat-label">待审核</div>
      </div>
      <div class="stat-card rectifying">
        <div class="stat-value">{{ stats.rectifying }}</div>
        <div class="stat-label">整改中</div>
      </div>
      <div class="stat-card completed">
        <div class="stat-value">{{ stats.completed }}</div>
        <div class="stat-label">已结案</div>
      </div>
      <div class="stat-card overdue">
        <div class="stat-value">{{ stats.overdue }}</div>
        <div class="stat-label">超期预警</div>
      </div>
    </div>

    <div class="main-content">
      <div class="list-section">
        <el-card>
          <template #header>
            <div class="list-header">
              <span>图斑列表</span>
              <el-select v-model="stageFilter" placeholder="按阶段筛选" clearable size="small" style="width: 140px">
                <el-option label="全部阶段" value="" />
                <el-option label="核查中" value="checking" />
                <el-option label="待审核" value="pending" />
                <el-option label="整改中" value="rectifying" />
                <el-option label="已结案" value="completed" />
              </el-select>
            </div>
          </template>

          <div class="plot-list">
            <div
              v-for="plot in filteredPlots"
              :key="plot.id"
              :class="['plot-item', { 'selected': selectedPlot?.id === plot.id, 'overdue': plot.remainingDays <= 0 }]"
              @click="selectPlot(plot)"
            >
              <div class="plot-header">
                <span class="plot-no">{{ plot.plotNo }}</span>
                <el-tag :type="getStageTagType(plot.stage)" size="small">{{ plot.stageName }}</el-tag>
              </div>
              <div class="plot-info">
                <div class="info-row">
                  <el-icon><Location /></el-icon>
                  <span>{{ plot.location.city }} {{ plot.location.county }}</span>
                </div>
                <div class="info-row">
                  <el-icon><User /></el-icon>
                  <span>{{ plot.assignee }}</span>
                </div>
                <div class="info-row">
                  <el-icon><Clock /></el-icon>
                  <span :class="{ 'overdue-text': plot.remainingDays <= 0 }">
                    {{ plot.remainingDays <= 0 ? '已超期' : `剩余${plot.remainingDays}天` }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <div class="timeline-section">
        <el-card>
          <template #header>
            <div class="timeline-header">
              <span v-if="selectedPlot">{{ selectedPlot.plotNo }} - 全流程跟踪</span>
              <span v-else>请选择图斑查看流程</span>
            </div>
          </template>

          <div v-if="selectedPlot" class="timeline-content">
            <el-timeline>
              <el-timeline-item
                v-for="(stage, index) in timelineStages"
                :key="index"
                :timestamp="stage.time"
                :type="getTimelineItemType(stage)"
                :hollow="!stage.completed"
                size="large"
                @click="handleStageClick(stage)"
              >
                <div class="timeline-stage" :class="{ 'disabled': !stage.completed, 'clickable': stage.completed }">
                  <div class="stage-header">
                    <span class="stage-name">{{ stage.name }}</span>
                    <el-tag v-if="stage.isCurrent" type="success" size="small" effect="dark">当前阶段</el-tag>
                  </div>
                  <div v-if="stage.operator" class="stage-operator">
                    <el-icon><User /></el-icon>
                    <span>{{ stage.operator }}</span>
                  </div>
                  <div v-if="stage.description" class="stage-desc">{{ stage.description }}</div>
                  
                  <div v-if="stage.canClose && stage.isCurrent" class="stage-action">
                    <el-button type="primary" size="small" @click.stop="handleCloseCase">
                      结案
                    </el-button>
                  </div>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
          <div v-else class="empty-state">
            <el-empty description="请从左侧列表选择图斑" />
          </div>
        </el-card>
      </div>
    </div>

    <el-dialog
      v-model="detailDialogVisible"
      :title="currentStage?.name + ' - 详情'"
      width="600px"
      destroy-on-close
    >
      <div v-if="currentStage" class="stage-detail">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="时间">{{ currentStage.time }}</el-descriptions-item>
          <el-descriptions-item label="操作人">{{ currentStage.operator }}</el-descriptions-item>
          <el-descriptions-item v-if="currentStage.description" label="描述">
            {{ currentStage.description }}
          </el-descriptions-item>
        </el-descriptions>

        <div v-if="currentStage.photos?.length" class="detail-photos">
          <h4>现场照片</h4>
          <div class="photo-grid">
            <el-image
              v-for="(photo, idx) in currentStage.photos"
              :key="idx"
              :src="photo"
              :preview-src-list="currentStage.photos"
              fit="cover"
              class="photo-item"
            />
          </div>
        </div>

        <div v-if="currentStage.extraInfo" class="detail-extra">
          <h4>附加信息</h4>
          <el-descriptions :column="1" border>
            <el-descriptions-item
              v-for="(value, key) in currentStage.extraInfo"
              :key="key"
              :label="key"
            >
              {{ value }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Location, User, Clock } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import { getPlots, savePlots } from '@/data/plotStore'

const stageFilter = ref('')
const plots = ref([])
const selectedPlot = ref(null)
const detailDialogVisible = ref(false)
const currentStage = ref(null)

const getStage = (status) => {
  const stageMap = {
    'pending_check': 'checking',
    'checking': 'checking',
    'pending_review': 'pending',
    'rectifying': 'rectifying',
    'completed': 'completed'
  }
  return stageMap[status] || 'checking'
}

const getStageName = (stage) => {
  const nameMap = {
    'checking': '核查中',
    'pending': '待审核',
    'rectifying': '整改中',
    'completed': '已结案'
  }
  return nameMap[stage] || '未知'
}

const plotsWithStage = computed(() => {
  return plots.value.map(plot => {
    const deadline = dayjs(plot.deadline)
    const now = dayjs()
    const remainingDays = deadline.diff(now, 'day')
    const stage = getStage(plot.status)
    return {
      ...plot,
      stage,
      stageName: getStageName(stage),
      remainingDays
    }
  })
})

const stats = computed(() => {
  const data = plotsWithStage.value
  return {
    total: data.length,
    checking: data.filter(p => p.stage === 'checking').length,
    pending: data.filter(p => p.stage === 'pending').length,
    rectifying: data.filter(p => p.stage === 'rectifying').length,
    completed: data.filter(p => p.stage === 'completed').length,
    overdue: data.filter(p => p.remainingDays <= 0).length
  }
})

const filteredPlots = computed(() => {
  if (!stageFilter.value) return plotsWithStage.value
  return plotsWithStage.value.filter(p => p.stage === stageFilter.value)
})

const timelineStages = computed(() => {
  if (!selectedPlot.value) return []
  
  const plot = selectedPlot.value
  const stages = [
    { 
      key: 'detection',
      name: '遥感识别', 
      time: plot.discoveryTime,
      operator: '系统',
      description: `发现${plot.problemTypeName}图斑`,
      completed: true,
      isCurrent: false,
      photos: [plot.beforeImage]
    },
    { 
      key: 'assign',
      name: '任务下发', 
      time: plot.assignTime,
      operator: '省农业农村厅',
      description: `下发至${plot.assignee}`,
      completed: true,
      isCurrent: false
    },
    { 
      key: 'check',
      name: '现场核查', 
      time: plot.checkResult?.checkTime || '',
      operator: plot.checkResult?.checker || '',
      description: plot.checkResult?.description || '',
      completed: !!plot.checkResult,
      isCurrent: plot.stage === 'checking',
      photos: plot.checkResult?.photos || [],
      extraInfo: plot.checkResult ? {
        '核查结果': plot.checkResult.resultName,
        '实际面积': `${plot.checkResult.actualArea}亩`
      } : null
    },
    { 
      key: 'review',
      name: '待审核', 
      time: plot.reviewTime || '',
      operator: plot.reviewer || '',
      description: plot.reviewResult === 'approved' ? '审核通过' : '等待审核',
      completed: !!plot.reviewTime,
      isCurrent: plot.stage === 'pending'
    },
    { 
      key: 'rectify',
      name: '整改中', 
      time: plot.reviewTime || '',
      operator: plot.assignee,
      description: plot.rectifyMeasure || '',
      completed: plot.stage === 'rectifying' || plot.stage === 'completed',
      isCurrent: plot.stage === 'rectifying',
      canClose: plot.stage === 'rectifying' && plot.rectifyCompleteTime,
      extraInfo: plot.rectifyDeadline ? {
        '整改措施': plot.rectifyMeasure,
        '整改期限': plot.rectifyDeadline
      } : null,
      photos: plot.rectifyPhotos || []
    },
    { 
      key: 'complete',
      name: '已结案', 
      time: plot.flowLogs?.find(l => l.action.includes('结案'))?.time || plot.rectifyCompleteTime || '',
      operator: plot.flowLogs?.find(l => l.action.includes('结案'))?.operator || '',
      description: '任务已完成',
      completed: plot.stage === 'completed',
      isCurrent: plot.stage === 'completed',
      photos: plot.rectifyPhotos || []
    }
  ]
  
  return stages
})

const getStageTagType = (stage) => {
  const typeMap = {
    'checking': 'warning',
    'pending': 'info',
    'rectifying': 'primary',
    'completed': 'success'
  }
  return typeMap[stage] || ''
}

const getTimelineItemType = (stage) => {
  if (!stage.completed) return 'info'
  if (stage.isCurrent) return 'primary'
  return 'success'
}

const selectPlot = (plot) => {
  selectedPlot.value = plot
}

const handleStageClick = (stage) => {
  if (!stage.completed) return
  currentStage.value = stage
  detailDialogVisible.value = true
}

const handleCloseCase = async () => {
  try {
    await ElMessageBox.confirm(
      '确认该图斑已完成整改并结案？',
      '结案确认',
      {
        confirmButtonText: '确认结案',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const plotIndex = plots.value.findIndex(p => p.id === selectedPlot.value.id)
    if (plotIndex > -1) {
      const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
      plots.value[plotIndex].status = 'completed'
      plots.value[plotIndex].statusName = '已结案'
      plots.value[plotIndex].rectifyCompleteTime = now
      
      if (!plots.value[plotIndex].flowLogs) {
        plots.value[plotIndex].flowLogs = []
      }
      plots.value[plotIndex].flowLogs.push({
        time: now,
        action: '整改完成，任务结案',
        operator: '系统'
      })
      
      savePlots(plots.value)
      
      selectedPlot.value = {
        ...selectedPlot.value,
        status: 'completed',
        statusName: '已结案',
        stage: 'completed',
        stageName: '已结案',
        rectifyCompleteTime: now
      }
      
      ElMessage.success('结案成功')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('结案失败')
    }
  }
}

plots.value = getPlots()
</script>

<style scoped>
.task-board {
  padding: 0;
}

.header {
  margin-bottom: 20px;
}

.header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.stats-cards {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  flex: 1;
  background: #fff;
  border-radius: 4px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #6b7280;
}

.stat-card.checking {
  border-left-color: #f59e0b;
}

.stat-card.pending {
  border-left-color: #3b82f6;
}

.stat-card.rectifying {
  border-left-color: #8b5cf6;
}

.stat-card.completed {
  border-left-color: #10b981;
}

.stat-card.overdue {
  border-left-color: #ef4444;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
}

.main-content {
  display: flex;
  gap: 16px;
  height: calc(100vh - 280px);
  min-height: 500px;
}

.list-section {
  width: 360px;
  flex-shrink: 0;
}

.list-section :deep(.el-card) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.list-section :deep(.el-card__body) {
  flex: 1;
  overflow: hidden;
  padding: 0;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-header span {
  font-size: 15px;
  font-weight: 500;
}

.plot-list {
  height: 100%;
  overflow-y: auto;
  padding: 8px;
}

.plot-item {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.plot-item:hover {
  border-color: #3b82f6;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
}

.plot-item.selected {
  border-color: #3b82f6;
  background: #eff6ff;
}

.plot-item.overdue {
  background: #fef2f2;
  border-left: 3px solid #ef4444;
}

.plot-item.overdue.selected {
  background: #fee2e2;
}

.plot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.plot-no {
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
}

.plot-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6b7280;
}

.info-row .el-icon {
  font-size: 14px;
}

.overdue-text {
  color: #ef4444;
  font-weight: 600;
}

.timeline-section {
  flex: 1;
}

.timeline-section :deep(.el-card) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.timeline-section :deep(.el-card__body) {
  flex: 1;
  overflow-y: auto;
}

.timeline-header {
  font-size: 15px;
  font-weight: 500;
}

.timeline-content {
  padding: 8px 0;
}

.timeline-stage {
  padding: 4px 0;
}

.timeline-stage.clickable {
  cursor: pointer;
}

.timeline-stage.clickable:hover {
  opacity: 0.8;
}

.timeline-stage.disabled {
  opacity: 0.4;
}

.stage-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.stage-name {
  font-weight: 500;
  color: #1f2937;
}

.stage-operator {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.stage-desc {
  font-size: 12px;
  color: #4b5563;
  line-height: 1.5;
}

.stage-action {
  margin-top: 8px;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.stage-detail {
  padding: 8px 0;
}

.detail-photos {
  margin-top: 16px;
}

.detail-photos h4 {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
  color: #1f2937;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.photo-item {
  width: 100%;
  height: 120px;
  border-radius: 4px;
}

.detail-extra {
  margin-top: 16px;
}

.detail-extra h4 {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
  color: #1f2937;
}

:deep(.el-timeline-item__wrapper) {
  cursor: pointer;
}

:deep(.el-timeline-item__timestamp) {
  font-size: 12px;
}
</style>
