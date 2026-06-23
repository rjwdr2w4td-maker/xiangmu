<template>
  <div class="mobile-task-list">
    <div class="page-header">
      <el-icon @click="goBack"><ArrowLeft /></el-icon>
      <h3>{{ pageTitle }}</h3>
      <el-icon @click="handleFilter"><Filter /></el-icon>
    </div>

    <div class="filter-tabs">
      <el-tag
        v-for="tab in statusTabs"
        :key="tab.value"
        :type="activeStatus === tab.value ? '' : 'info'"
        :effect="activeStatus === tab.value ? 'dark' : 'plain'"
        @click="activeStatus = tab.value"
      >
        {{ tab.label }}
        <el-badge v-if="tab.count" :value="tab.count" :max="99" />
      </el-tag>
    </div>

    <div class="task-list">
      <div
        class="task-card"
        v-for="task in filteredTasks"
        :key="task.id"
        @click="handleTaskClick(task)"
      >
        <div class="task-header">
          <el-tag :type="getStatusType(task.status)" size="small">
            {{ getStatusName(task.status) }}
          </el-tag>
          <span class="task-time">{{ task.createTime }}</span>
        </div>
        <h4 class="task-title">{{ task.name }}</h4>
        <div class="task-info">
          <span class="info-item">
            <el-icon><Document /></el-icon>
            {{ task.cropTypeName }}
          </span>
          <span class="info-item">
            <el-icon><Location /></el-icon>
            {{ task.region }}
          </span>
        </div>
        <div class="task-progress" v-if="task.progress !== undefined">
          <el-progress
            :percentage="task.progress"
            :color="getProgressColor(task.progress)"
            :stroke-width="6"
          />
          <span class="progress-text">{{ task.progress }}%</span>
        </div>
        <div class="task-actions" v-if="entryType === 'wanzhengtong'">
          <el-button type="primary" size="small" @click.stop="handleApprove(task)">
            审核通过
          </el-button>
          <el-button size="small" @click.stop="handleReject(task)">
            驳回
          </el-button>
        </div>
      </div>

      <el-empty v-if="filteredTasks.length === 0" description="暂无任务数据" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const route = useRoute()

const entryType = computed(() => route.params.entry || 'wanzhengtong')

const pageTitle = computed(() => {
  const titles = {
    wanzhengtong: '待审核任务',
    wanqitong: '我的任务',
    'field-check': '核查任务'
  }
  return titles[entryType.value] || '任务列表'
})

const activeStatus = ref('pending')

const statusTabs = computed(() => {
  if (entryType.value === 'wanzhengtong') {
    return [
      { label: '待审核', value: 'pending', count: 12 },
      { label: '已通过', value: 'approved', count: 0 },
      { label: '已驳回', value: 'rejected', count: 0 }
    ]
  } else if (entryType.value === 'wanqitong') {
    return [
      { label: '执行中', value: 'active', count: 5 },
      { label: '待提交', value: 'pending', count: 3 },
      { label: '已完成', value: 'completed', count: 0 }
    ]
  } else {
    return [
      { label: '待核查', value: 'pending', count: 8 },
      { label: '核查中', value: 'checking', count: 2 },
      { label: '已完成', value: 'completed', count: 0 }
    ]
  }
})

const allTasks = ref([
  {
    id: 'TASK001',
    name: '肥东县2024年小麦种植计划',
    status: 'pending',
    cropTypeName: '小麦',
    region: '肥东县',
    createTime: '2024-01-15',
    progress: 0,
    area: 50000
  },
  {
    id: 'TASK002',
    name: '长丰县水稻种植任务核查',
    status: 'checking',
    cropTypeName: '水稻',
    region: '长丰县',
    createTime: '2024-01-14',
    progress: 60,
    area: 35000
  },
  {
    id: 'TASK003',
    name: '庐江县青贮玉米种植申报',
    status: 'active',
    cropTypeName: '玉米',
    region: '庐江县',
    createTime: '2024-01-13',
    progress: 75,
    area: 28000
  },
  {
    id: 'TASK004',
    name: '巢湖市大豆种植进度填报',
    status: 'pending',
    cropTypeName: '大豆',
    region: '巢湖市',
    createTime: '2024-01-12',
    progress: 30,
    area: 42000
  },
  {
    id: 'TASK005',
    name: '瑶海区设施农业核查任务',
    status: 'completed',
    cropTypeName: '蔬菜',
    region: '瑶海区',
    createTime: '2024-01-11',
    progress: 100,
    area: 15000
  }
])

const filteredTasks = computed(() => {
  return allTasks.value.filter(task => task.status === activeStatus.value)
})

const getStatusType = (status) => {
  const map = {
    pending: 'warning',
    checking: 'primary',
    active: 'primary',
    approved: 'success',
    rejected: 'danger',
    completed: 'success'
  }
  return map[status] || 'info'
}

const getStatusName = (status) => {
  const map = {
    pending: '待审核',
    checking: '核查中',
    active: '执行中',
    approved: '已通过',
    rejected: '已驳回',
    completed: '已完成'
  }
  return map[status] || status
}

const getProgressColor = (progress) => {
  if (progress >= 90) return '#67C23A'
  if (progress >= 60) return '#409EFF'
  if (progress >= 30) return '#E6A23C'
  return '#F56C6C'
}

const goBack = () => {
  router.back()
}

const handleFilter = () => {
  ElMessage.info('筛选功能开发中')
}

const handleTaskClick = (task) => {
  if (entryType.value === 'wanzhengtong') {
    router.push({ name: 'MobileAuditDetail', params: { entry: entryType.value, id: task.id } })
  } else if (entryType.value === 'wanqitong') {
    router.push({ name: 'MobileProgressReport', params: { entry: entryType.value, id: task.id } })
  } else {
    router.push({ name: 'MobilePhotoCheck', params: { entry: entryType.value, id: task.id } })
  }
}

const handleApprove = (task) => {
  ElMessageBox.confirm('确认审核通过该任务吗？', '审核确认', {
    confirmButtonText: '通过',
    cancelButtonText: '取消',
    type: 'success'
  }).then(() => {
    task.status = 'approved'
    ElMessage.success('审核通过')
  }).catch(() => {})
}

const handleReject = (task) => {
  ElMessageBox.prompt('请输入驳回原因', '驳回原因', {
    confirmButtonText: '确认驳回',
    cancelButtonText: '取消',
    inputPlaceholder: '请输入驳回原因'
  }).then(({ value }) => {
    task.status = 'rejected'
    task.rejectReason = value
    ElMessage.success('已驳回')
  }).catch(() => {})
}
</script>

<style scoped>
.mobile-task-list {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 20px;
}

.page-header {
  background: #1a3a5c;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
}

.page-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.page-header .el-icon {
  font-size: 22px;
  cursor: pointer;
}

.filter-tabs {
  display: flex;
  gap: 10px;
  padding: 12px 20px;
  background: #fff;
  overflow-x: auto;
}

.filter-tabs::-webkit-scrollbar {
  display: none;
}

.filter-tabs .el-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
  white-space: nowrap;
}

.task-list {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-card {
  background: #fff;
  border-radius: 4px;
  padding: 16px;
  }

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.task-time {
  font-size: 12px;
  color: #9ca3af;
}

.task-title {
  margin: 0 0 12px;
  font-size: 16px;
  color: #1f2937;
  font-weight: 600;
}

.task-info {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #6b7280;
}

.info-item .el-icon {
  font-size: 14px;
}

.task-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.task-progress .el-progress {
  flex: 1;
}

.progress-text {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.task-actions {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
}

.task-actions .el-button {
  flex: 1;
}
</style>
