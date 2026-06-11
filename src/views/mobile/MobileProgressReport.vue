<template>
  <div class="mobile-progress-report">
    <div class="page-header">
      <el-icon @click="goBack"><ArrowLeft /></el-icon>
      <h3>进度填报</h3>
      <el-icon @click="handleHistory"><Clock /></el-icon>
    </div>

    <div class="report-content">
      <div class="task-info-card">
        <div class="task-header">
          <el-tag type="primary" size="small">执行中</el-tag>
          <span class="task-id">{{ taskInfo.id }}</span>
        </div>
        <h3 class="task-name">{{ taskInfo.name }}</h3>
        <div class="progress-bar">
          <el-progress :percentage="taskInfo.progress" :stroke-width="8" />
          <span class="progress-text">总体进度 {{ taskInfo.progress }}%</span>
        </div>
      </div>

      <div class="form-section">
        <h3 class="section-title">填报信息</h3>
        
        <el-form :model="reportForm" label-position="top">
          <el-form-item label="填报日期">
            <el-date-picker
              v-model="reportForm.date"
              type="date"
              placeholder="选择日期"
              style="width: 100%"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>

          <el-form-item label="作物生长期">
            <el-select v-model="reportForm.growthStage" placeholder="请选择" style="width: 100%">
              <el-option label="播种期" value="sowing" />
              <el-option label="出苗期" value="seedling" />
              <el-option label="分蘖期" value="tillering" />
              <el-option label="拔节期" value="jointing" />
              <el-option label="抽穗期" value="heading" />
              <el-option label="成熟期" value="maturity" />
              <el-option label="收获期" value="harvest" />
            </el-select>
          </el-form-item>

          <el-form-item label="种植面积(亩)">
            <el-input-number v-model="reportForm.plantingArea" :min="0" style="width: 100%" />
          </el-form-item>

          <el-form-item label="已完成面积(亩)">
            <el-input-number v-model="reportForm.completedArea" :min="0" style="width: 100%" />
          </el-form-item>

          <el-form-item label="长势情况">
            <el-radio-group v-model="reportForm.growthStatus">
              <el-radio-button label="good">长势良好</el-radio-button>
              <el-radio-button label="normal">长势一般</el-radio-button>
              <el-radio-button label="poor">长势偏差</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="上传照片">
            <div class="photo-upload">
              <div class="photo-item" v-for="(photo, index) in reportForm.photos" :key="index">
                <el-image :src="photo" fit="cover" style="width: 80px; height: 80px; border-radius: 8px" />
                <el-icon class="remove-btn" @click="removePhoto(index)"><Close /></el-icon>
              </div>
              <div class="add-photo" @click="handleAddPhoto">
                <el-icon :size="24"><Plus /></el-icon>
                <span>添加照片</span>
              </div>
            </div>
          </el-form-item>

          <el-form-item label="备注说明">
            <el-input
              v-model="reportForm.remark"
              type="textarea"
              :rows="3"
              placeholder="请输入备注说明"
            />
          </el-form-item>
        </el-form>
      </div>

      <div class="history-section">
        <h3 class="section-title">最近填报记录</h3>
        <div class="history-list">
          <div class="history-item" v-for="item in historyRecords" :key="item.id">
            <div class="history-date">{{ item.date }}</div>
            <div class="history-content">
              <span class="history-stage">{{ item.growthStage }}</span>
              <span class="history-area">{{ item.area }}亩</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="action-bar">
      <el-button size="large" @click="handleSaveDraft">保存草稿</el-button>
      <el-button type="primary" size="large" @click="handleSubmit">提交填报</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()

const taskId = route.params.id

const taskInfo = reactive({
  id: taskId || 'TASK003',
  name: '庐江县青贮玉米种植任务',
  progress: 75,
  totalArea: 28000,
  completedArea: 21000
})

const reportForm = reactive({
  date: new Date().toISOString().split('T')[0],
  growthStage: '',
  plantingArea: 0,
  completedArea: 0,
  growthStatus: 'good',
  photos: [],
  remark: ''
})

const historyRecords = ref([
  { id: 1, date: '2024-01-14', growthStage: '拔节期', area: 500 },
  { id: 2, date: '2024-01-10', growthStage: '分蘖期', area: 800 },
  { id: 3, date: '2024-01-05', growthStage: '出苗期', area: 1200 }
])

const goBack = () => router.back()
const handleHistory = () => ElMessage.info('历史记录页面开发中')

const handleAddPhoto = () => {
  ElMessage.info('调用相机或相册')
  reportForm.photos.push('https://picsum.photos/200/200?random=' + Date.now())
}

const removePhoto = (index) => {
  reportForm.photos.splice(index, 1)
}

const handleSaveDraft = () => {
  ElMessage.success('已保存草稿')
}

const handleSubmit = () => {
  if (!reportForm.growthStage) {
    ElMessage.warning('请选择作物生长期')
    return
  }
  if (reportForm.plantingArea === 0) {
    ElMessage.warning('请输入种植面积')
    return
  }
  
  ElMessage.success('填报提交成功')
  router.back()
}
</script>

<style scoped>
.mobile-progress-report {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 80px;
}

.page-header {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
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

.report-content {
  padding: 16px;
}

.task-info-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.task-id {
  font-size: 12px;
  color: #9ca3af;
}

.task-name {
  margin: 0 0 16px;
  font-size: 16px;
  color: #1f2937;
}

.progress-bar {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-text {
  font-size: 13px;
  color: #6b7280;
}

.form-section, .history-section {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.section-title {
  margin: 0 0 16px;
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
}

.photo-upload {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.photo-item {
  position: relative;
}

.remove-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: #fff;
  border-radius: 50%;
  padding: 4px;
  font-size: 12px;
  cursor: pointer;
}

.add-photo {
  width: 80px;
  height: 80px;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #9ca3af;
  cursor: pointer;
}

.add-photo span {
  font-size: 11px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.history-date {
  font-size: 13px;
  color: #6b7280;
}

.history-content {
  display: flex;
  gap: 12px;
}

.history-stage {
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
}

.history-area {
  font-size: 13px;
  color: #10b981;
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