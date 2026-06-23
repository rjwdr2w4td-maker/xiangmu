<template>
  <div class="mobile-photo-check">
    <div class="page-header">
      <el-icon @click="goBack"><ArrowLeft /></el-icon>
      <h3>现场核查</h3>
      <el-icon @click="toggleInfo"><InfoFilled /></el-icon>
    </div>

    <div class="check-content">
      <div class="task-card">
        <div class="task-header">
          <el-tag :type="taskInfo.status === 'checking' ? 'primary' : 'warning'" size="small">
            {{ taskInfo.status === 'checking' ? '核查中' : '待核查' }}
          </el-tag>
          <span class="task-id">{{ taskInfo.id }}</span>
        </div>
        <h4 class="task-name">{{ taskInfo.name }}</h4>
        <div class="task-meta">
          <span><el-icon><Location /></el-icon> {{ taskInfo.location }}</span>
          <span><el-icon><Calendar /></el-icon> {{ taskInfo.deadline }}</span>
        </div>
      </div>

      <div class="location-section">
        <div class="section-header">
          <h3 class="section-title">GPS定位</h3>
          <el-tag v-if="gpsStatus === 'located'" type="success" size="small">已定位</el-tag>
          <el-tag v-else type="warning" size="small">定位中...</el-tag>
        </div>
        <div class="location-info" v-if="gpsStatus === 'located'">
          <div class="coord-item">
            <span class="coord-label">经度</span>
            <span class="coord-value">{{ location.lng.toFixed(6) }}°E</span>
          </div>
          <div class="coord-item">
            <span class="coord-label">纬度</span>
            <span class="coord-value">{{ location.lat.toFixed(6) }}°N</span>
          </div>
          <div class="coord-item">
            <span class="coord-label">精度</span>
            <span class="coord-value">{{ location.accuracy }}m</span>
          </div>
        </div>
        <el-button type="primary" plain style="width: 100%; margin-top: 12px" @click="refreshLocation">
          <el-icon><Refresh /></el-icon> 刷新位置
        </el-button>
      </div>

      <div class="photo-section">
        <h3 class="section-title">现场照片</h3>
        <div class="photo-grid">
          <div class="photo-item" v-for="(photo, index) in photos" :key="index">
            <el-image :src="photo.url" fit="cover" style="width: 100%; height: 100%; border-radius: 8px" />
            <div class="photo-info">
              <span class="photo-type">{{ photo.type }}</span>
              <span class="photo-time">{{ photo.time }}</span>
            </div>
            <el-icon class="remove-btn" @click="removePhoto(index)"><Delete /></el-icon>
          </div>
          <div class="add-photo-card" @click="showCamera = true">
            <el-icon :size="32"><Camera /></el-icon>
            <span>拍照</span>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3 class="section-title">核查结果</h3>
        <el-form :model="checkForm" label-position="top">
          <el-form-item label="核查结论">
            <el-radio-group v-model="checkForm.result">
              <el-radio label="pass">核查通过</el-radio>
              <el-radio label="issue">存在问题</el-radio>
              <el-radio label="reject">核查不通过</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="作物类型">
            <el-select v-model="checkForm.cropType" placeholder="请选择" style="width: 100%">
              <el-option label="小麦" value="wheat" />
              <el-option label="水稻" value="rice" />
              <el-option label="玉米" value="corn" />
              <el-option label="大豆" value="soybean" />
              <el-option label="油菜" value="rapeseed" />
            </el-select>
          </el-form-item>

          <el-form-item label="实际面积(亩)">
            <el-input-number v-model="checkForm.actualArea" :min="0" style="width: 100%" />
          </el-form-item>

          <el-form-item label="问题描述" v-if="checkForm.result === 'issue' || checkForm.result === 'reject'">
            <el-select v-model="checkForm.issues" multiple placeholder="请选择问题类型" style="width: 100%">
              <el-option label="面积不符" value="area_mismatch" />
              <el-option label="作物类型不符" value="crop_mismatch" />
              <el-option label="存在抛荒" value="abandoned" />
              <el-option label="非农用地" value="non_agricultural" />
              <el-option label="其他问题" value="other" />
            </el-select>
          </el-form-item>

          <el-form-item label="备注说明">
            <el-input
              v-model="checkForm.remark"
              type="textarea"
              :rows="3"
              placeholder="请输入核查说明"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="action-bar">
      <el-button size="large" @click="handleOffline">
        <el-icon><FolderOpened /></el-icon>
        离线保存
      </el-button>
      <el-button type="primary" size="large" @click="handleSubmit">
        <el-icon><Upload /></el-icon>
        提交核查
      </el-button>
    </div>

    <el-dialog v-model="showCamera" title="拍照" width="100%" fullscreen>
      <div class="camera-container">
        <div class="camera-preview">
          <div class="camera-placeholder">
            <el-icon :size="64"><Camera /></el-icon>
            <p>相机预览区域</p>
          </div>
        </div>
        <div class="camera-controls">
          <el-button type="primary" size="large" circle @click="takePhoto">
            <el-icon :size="32"><Camera /></el-icon>
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()

const taskId = route.params.id
const showCamera = ref(false)
const gpsStatus = ref('locating')

const taskInfo = reactive({
  id: taskId || 'TASK002',
  name: '长丰县水稻种植任务核查',
  status: 'checking',
  location: '长丰县水湖镇',
  deadline: '2024-01-20',
  planArea: 3500
})

const location = reactive({
  lng: 117.168456,
  lat: 31.987654,
  accuracy: 15
})

const photos = ref([
  { url: 'https://picsum.photos/200/200?random=1', type: '远景', time: '10:30' },
  { url: 'https://picsum.photos/200/200?random=2', type: '近景', time: '10:32' }
])

const checkForm = reactive({
  result: 'pass',
  cropType: '',
  actualArea: 0,
  issues: [],
  remark: ''
})

onMounted(() => {
  setTimeout(() => {
    gpsStatus.value = 'located'
  }, 1500)
})

const goBack = () => router.back()
const toggleInfo = () => ElMessage.info('任务详情信息')

const refreshLocation = () => {
  gpsStatus.value = 'locating'
  ElMessage.info('正在获取GPS位置...')
  setTimeout(() => {
    location.lng += (Math.random() - 0.5) * 0.001
    location.lat += (Math.random() - 0.5) * 0.001
    location.accuracy = Math.round(10 + Math.random() * 20)
    gpsStatus.value = 'located'
    ElMessage.success('位置更新成功')
  }, 1000)
}

const takePhoto = () => {
  const now = new Date()
  photos.value.push({
    url: `https://picsum.photos/200/200?random=${Date.now()}`,
    type: '现场',
    time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
  })
  showCamera.value = false
  ElMessage.success('拍照成功')
}

const removePhoto = (index) => {
  photos.value.splice(index, 1)
}

const handleOffline = () => {
  ElMessage.success('已保存到离线数据')
}

const handleSubmit = () => {
  if (photos.value.length < 2) {
    ElMessage.warning('请至少拍摄2张现场照片')
    return
  }
  if (!checkForm.cropType) {
    ElMessage.warning('请选择作物类型')
    return
  }
  if (checkForm.actualArea === 0) {
    ElMessage.warning('请输入实际面积')
    return
  }
  
  ElMessage.success('核查结果提交成功')
  router.back()
}
</script>

<style scoped>
.mobile-photo-check {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 80px;
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

.check-content {
  padding: 16px;
}

.task-card {
  background: #fff;
  border-radius: 4px;
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
  margin: 0 0 12px;
  font-size: 16px;
  color: #1f2937;
}

.task-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #6b7280;
}

.task-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.location-section, .photo-section, .form-section {
  background: #fff;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  margin: 0 0 12px;
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
}

.section-header .section-title {
  margin-bottom: 0;
}

.location-info {
  display: flex;
  justify-content: space-between;
  background: #f9fafb;
  border-radius: 8px;
  padding: 12px;
}

.coord-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.coord-label {
  font-size: 11px;
  color: #9ca3af;
  margin-bottom: 4px;
}

.coord-value {
  font-size: 13px;
  color: #1f2937;
  font-weight: 500;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.photo-item {
  aspect-ratio: 1;
  position: relative;
  background: #f3f4f6;
  border-radius: 8px;
  overflow: hidden;
}

.photo-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  padding: 20px 8px 8px;
  display: flex;
  flex-direction: column;
}

.photo-type {
  font-size: 11px;
  color: #fff;
  font-weight: 500;
}

.photo-time {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.8);
}

.remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(239, 68, 68, 0.9);
  color: #fff;
  border-radius: 50%;
  padding: 4px;
  font-size: 14px;
  cursor: pointer;
}

.add-photo-card {
  aspect-ratio: 1;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #9ca3af;
  cursor: pointer;
}

.add-photo-card span {
  font-size: 12px;
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

.camera-container {
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
}

.camera-preview {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.camera-placeholder {
  text-align: center;
  color: #9ca3af;
}

.camera-controls {
  padding: 20px;
  display: flex;
  justify-content: center;
}
</style>