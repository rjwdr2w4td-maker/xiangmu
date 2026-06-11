<template>
  <div class="mobile-audit-detail">
    <div class="page-header">
      <el-icon @click="goBack"><ArrowLeft /></el-icon>
      <h3>审核详情</h3>
      <el-icon @click="handleMore"><More /></el-icon>
    </div>

    <div class="detail-content">
      <div class="status-card">
        <el-tag :type="getStatusType(taskDetail.status)" size="large">
          {{ getStatusName(taskDetail.status) }}
        </el-tag>
        <div class="amount-info">
          <span class="amount-value">{{ taskDetail.planArea }}</span>
          <span class="amount-unit">万亩</span>
        </div>
        <p class="amount-label">计划种植面积</p>
      </div>

      <div class="info-section">
        <h3 class="section-title">基本信息</h3>
        <div class="info-item">
          <span class="info-label">计划名称</span>
          <span class="info-value">{{ taskDetail.name }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">计划编号</span>
          <span class="info-value">{{ taskDetail.id }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">作物类型</span>
          <span class="info-value">{{ taskDetail.cropTypeName }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">所属区域</span>
          <span class="info-value">{{ taskDetail.region }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">创建时间</span>
          <span class="info-value">{{ taskDetail.createTime }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">申请单位</span>
          <span class="info-value">{{ taskDetail.applicant }}</span>
        </div>
      </div>

      <div class="info-section">
        <h3 class="section-title">任务分解详情</h3>
        <div class="decomposition-list">
          <div class="decompose-item" v-for="item in taskDetail.decomposition" :key="item.name">
            <div class="decompose-header">
              <span class="decompose-name">{{ item.name }}</span>
              <el-tag size="small" :type="item.progress >= 90 ? 'success' : 'warning'">
                {{ item.progress }}%
              </el-tag>
            </div>
            <div class="decompose-data">
              <span>计划: {{ item.planArea }}亩</span>
              <span>已落实: {{ item.actualArea }}亩</span>
            </div>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h3 class="section-title">附件材料</h3>
        <div class="attachment-list">
          <div class="attachment-item" v-for="file in attachments" :key="file.id" @click="handlePreview(file)">
            <el-icon :size="24" :color="getFileIcon(file.type).color">
              <component :is="getFileIcon(file.type).icon" />
            </el-icon>
            <div class="file-info">
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">{{ file.size }}</span>
            </div>
            <el-icon><Download /></el-icon>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h3 class="section-title">审核记录</h3>
        <el-timeline>
          <el-timeline-item
            v-for="record in auditRecords"
            :key="record.id"
            :timestamp="record.time"
            placement="top"
          >
            <div class="record-content">
              <span class="record-user">{{ record.user }}</span>
              <el-tag :type="record.type" size="small">{{ record.action }}</el-tag>
              <p v-if="record.remark">{{ record.remark }}</p>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>

    <div class="action-bar">
      <el-button size="large" @click="handleReject">驳回</el-button>
      <el-button type="primary" size="large" @click="handleApprove">审核通过</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const route = useRoute()

const taskId = route.params.id

const taskDetail = reactive({
  id: taskId || 'TASK001',
  name: '肥东县2024年小麦种植计划',
  status: 'pending',
  cropTypeName: '小麦',
  region: '合肥市肥东县',
  planArea: 35.5,
  createTime: '2024-01-15',
  applicant: '肥东县农业农村局',
  decomposition: [
    { name: '店埠镇', planArea: 8000, actualArea: 7800, progress: 97 },
    { name: '撮镇镇', planArea: 6500, actualArea: 6200, progress: 95 },
    { name: '梁园镇', planArea: 5000, actualArea: 4800, progress: 96 },
    { name: '桥头集镇', planArea: 4000, actualArea: 4000, progress: 100 },
    { name: '长临河镇', planArea: 3000, actualArea: 2700, progress: 90 }
  ]
})

const attachments = ref([
  { id: 1, name: '种植计划申请书.pdf', type: 'pdf', size: '2.3MB' },
  { id: 2, name: '地块分布图.jpg', type: 'image', size: '1.5MB' },
  { id: 3, name: '主体清单.xlsx', type: 'excel', size: '856KB' }
])

const auditRecords = ref([
  { id: 1, user: '县农业农村局', action: '提交申请', type: 'primary', time: '2024-01-15 09:30', remark: '已提交审核，请审批' },
  { id: 2, user: '市级审核员', action: '审核中', type: 'warning', time: '2024-01-15 10:00', remark: '正在审核材料' }
])

const getStatusType = (status) => {
  const map = { pending: 'warning', approved: 'success', rejected: 'danger' }
  return map[status] || 'info'
}

const getStatusName = (status) => {
  const map = { pending: '待审核', approved: '已通过', rejected: '已驳回' }
  return map[status] || status
}

const getFileIcon = (type) => {
  const map = {
    pdf: { icon: 'Document', color: '#ef4444' },
    image: { icon: 'Picture', color: '#10b981' },
    excel: { icon: 'Document', color: '#3b82f6' }
  }
  return map[type] || { icon: 'Document', color: '#6b7280' }
}

const goBack = () => router.back()
const handleMore = () => ElMessage.info('更多操作开发中')
const handlePreview = (file) => ElMessage.info(`预览文件: ${file.name}`)

const handleApprove = () => {
  ElMessageBox.confirm('确认审核通过该计划吗？', '审核确认', {
    confirmButtonText: '确认通过',
    cancelButtonText: '取消',
    type: 'success'
  }).then(() => {
    taskDetail.status = 'approved'
    ElMessage.success('审核通过')
    router.back()
  }).catch(() => {})
}

const handleReject = () => {
  ElMessageBox.prompt('请输入驳回原因', '驳回原因', {
    confirmButtonText: '确认驳回',
    cancelButtonText: '取消',
    inputPlaceholder: '请详细说明驳回原因'
  }).then(({ value }) => {
    taskDetail.status = 'rejected'
    auditRecords.value.push({
      id: Date.now(),
      user: '当前用户',
      action: '驳回',
      type: 'danger',
      time: new Date().toLocaleString(),
      remark: value
    })
    ElMessage.success('已驳回')
    router.back()
  }).catch(() => {})
}
</script>

<style scoped>
.mobile-audit-detail {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 80px;
}

.page-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
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

.detail-content {
  padding: 16px;
}

.status-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  margin-bottom: 16px;
}

.amount-info {
  margin-top: 16px;
}

.amount-value {
  font-size: 36px;
  font-weight: 700;
  color: #1f2937;
}

.amount-unit {
  font-size: 14px;
  color: #6b7280;
  margin-left: 4px;
}

.amount-label {
  margin: 8px 0 0;
  font-size: 13px;
  color: #9ca3af;
}

.info-section {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.section-title {
  margin: 0 0 12px;
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 14px;
  color: #6b7280;
}

.info-value {
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
}

.decomposition-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.decompose-item {
  background: #f9fafb;
  border-radius: 8px;
  padding: 12px;
}

.decompose-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.decompose-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.decompose-data {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #6b7280;
}

.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  cursor: pointer;
}

.file-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.file-name {
  font-size: 14px;
  color: #1f2937;
}

.file-size {
  font-size: 12px;
  color: #9ca3af;
}

.record-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.record-user {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.record-content p {
  margin: 4px 0 0;
  font-size: 13px;
  color: #6b7280;
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 12px 16px;
  display: flex;
  gap: 12px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}

.action-bar .el-button {
  flex: 1;
}
</style>