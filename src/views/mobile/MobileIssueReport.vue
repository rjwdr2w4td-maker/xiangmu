<template>
  <div class="mobile-issue-report">
    <div class="page-header">
      <el-icon @click="goBack"><ArrowLeft /></el-icon>
      <h3>{{ pageTitle }}</h3>
    </div>

    <div class="form-content">
      <div class="form-section">
        <h3 class="section-title">{{ isWanqitong ? '灾情类型' : '问题类型' }}</h3>
        <div class="issue-types">
          <div
            class="type-item"
            v-for="type in issueTypes"
            :key="type.id"
            :class="{ active: applyForm.issueType === type.id }"
            @click="applyForm.issueType = type.id"
          >
            <el-icon :size="28" :style="{ color: type.color }"><component :is="type.icon" /></el-icon>
            <span>{{ type.name }}</span>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3 class="section-title">{{ isWanqitong ? '灾情描述' : '问题描述' }}</h3>
        <el-form :model="applyForm" label-position="top">
          <el-form-item :label="isWanqitong ? '灾情标题' : '问题标题'">
            <el-input v-model="applyForm.title" :placeholder="isWanqitong ? '请简要描述灾情' : '请简要描述问题'" maxlength="50" show-word-limit />
          </el-form-item>
          <el-form-item label="详细描述">
            <el-input
              v-model="applyForm.description"
              type="textarea"
              :rows="4"
              :placeholder="isWanqitong ? '请详细描述灾情、受灾面积和现场处置情况' : '请详细描述问题情况'"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="发生时间">
            <el-date-picker
              v-model="applyForm.occurTime"
              type="datetime"
              placeholder="选择时间"
              style="width: 100%"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm"
            />
          </el-form-item>
          <el-form-item label="发生地点">
            <div class="location-input">
              <el-input v-model="applyForm.location" placeholder="点击获取当前位置" readonly />
              <el-button type="primary" @click="handleGetLocation">
                <el-icon><Location /></el-icon>
                定位
              </el-button>
            </div>
          </el-form-item>
          <el-form-item label="紧急程度">
            <el-radio-group v-model="applyForm.urgency">
              <el-radio-button label="low">一般</el-radio-button>
              <el-radio-button label="medium">紧急</el-radio-button>
              <el-radio-button label="high">非常紧急</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>

      <div class="form-section">
        <h3 class="section-title">现场照片</h3>
        <div class="photo-grid">
          <div class="photo-item" v-for="(photo, index) in applyForm.photos" :key="index">
            <el-image :src="photo.url" fit="cover" style="width: 100%; height: 100%; border-radius: 8px" />
            <span class="photo-label">{{ photo.label }}</span>
            <el-icon class="remove-btn" @click="removePhoto(index)"><Delete /></el-icon>
          </div>
          <div class="add-photo" @click="handleTakePhoto">
            <el-icon :size="32"><Camera /></el-icon>
            <span>拍照上报</span>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3 class="section-title">GPS信息</h3>
        <div class="gps-info" v-if="gpsStatus === 'located'">
          <div class="gps-row">
            <span class="gps-label">经度</span>
            <span class="gps-value">{{ gpsData.lng.toFixed(6) }}°E</span>
          </div>
          <div class="gps-row">
            <span class="gps-label">纬度</span>
            <span class="gps-value">{{ gpsData.lat.toFixed(6) }}°N</span>
          </div>
          <div class="gps-row">
            <span class="gps-label">精度</span>
            <span class="gps-value">{{ gpsData.accuracy }}米</span>
          </div>
          <div class="gps-row">
            <span class="gps-label">获取时间</span>
            <span class="gps-value">{{ gpsData.time }}</span>
          </div>
        </div>
        <div class="gps-status" v-else>
          <el-icon class="loading"><Loading /></el-icon>
          <span>{{ gpsStatus === 'locating' ? '正在定位...' : '点击获取GPS信息' }}</span>
        </div>
      </div>

      <div class="form-section">
        <h3 class="section-title">联系方式</h3>
        <el-form label-position="top">
          <el-form-item label="上报人">
            <el-input v-model="applyForm.reporter" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="applyForm.phone" placeholder="请输入联系电话" />
          </el-form-item>
        </el-form>
      </div>

      <div class="history-section">
        <h3 class="section-title">
          <el-icon><Clock /></el-icon>
          最近上报记录
        </h3>
        <div class="history-list">
          <div class="history-item" v-for="item in historyRecords" :key="item.id">
            <el-tag :type="getStatusType(item.status)" size="small">{{ getStatusName(item.status) }}</el-tag>
            <div class="history-content">
              <h4>{{ item.title }}</h4>
              <p>{{ item.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-bar">
      <el-button size="large" @click="handleOffline">
        <el-icon><FolderOpened /></el-icon>
        离线保存
      </el-button>
      <el-button type="danger" size="large" @click="handleSubmit">
        <el-icon><Upload /></el-icon>
        立即上报
      </el-button>
    </div>

    <el-dialog v-model="photoDialogVisible" title="拍照" width="100%" fullscreen>
      <div class="photo-label-input">
        <el-input v-model="photoLabel" placeholder="照片说明（如：远景、近景、问题点）" />
      </div>
      <div class="camera-area">
        <div class="camera-placeholder">
          <el-icon :size="64"><Camera /></el-icon>
          <p>相机预览</p>
        </div>
      </div>
      <div class="camera-btn">
        <el-button type="primary" size="large" circle @click="confirmTakePhoto">
          <el-icon :size="32"><Camera /></el-icon>
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const route = useRoute()

const gpsStatus = ref('')
const photoDialogVisible = ref(false)
const photoLabel = ref('')
const isWanqitong = computed(() => route.params.entry === 'wanqitong')
const pageTitle = computed(() => isWanqitong.value ? '灾情上报' : '问题上报')

const issueTypes = computed(() => isWanqitong.value ? [
  { id: 'frost', name: '倒春寒', icon: 'Cloudy', color: '#3b82f6' },
  { id: 'drought', name: '春旱', icon: 'Sunny', color: '#f59e0b' },
  { id: 'flood', name: '洪涝', icon: 'Pouring', color: '#06b6d4' },
  { id: 'pest', name: '病虫害', icon: 'Warning', color: '#ef4444' },
  { id: 'wind', name: '大风倒伏', icon: 'WindPower', color: '#1a3a5c' },
  { id: 'other', name: '其他灾情', icon: 'More', color: '#6b7280' }
] : [
  { id: 'area', name: '面积异常', icon: 'Document', color: '#3b82f6' },
  { id: 'crop', name: '作物不符', icon: 'Crop', color: '#10b981' },
  { id: 'abandoned', name: '耕地抛荒', icon: 'Warning', color: '#ef4444' },
  { id: 'illegal', name: '非法占用', icon: 'Lock', color: '#1a3a5c' },
  { id: 'disaster', name: '灾害损失', icon: 'Cloudy', color: '#f59e0b' },
  { id: 'other', name: '其他问题', icon: 'More', color: '#6b7280' }
])

const applyForm = reactive({
  issueType: '',
  title: '',
  description: '',
  occurTime: '',
  location: '',
  urgency: 'low',
  photos: [],
  reporter: '核查员张三',
  phone: '138****8888'
})

const gpsData = reactive({
  lng: 0,
  lat: 0,
  accuracy: 0,
  time: ''
})

const historyRecords = ref([
  { id: 1, title: '肥东县疑似抛荒地块', status: 'pending', time: '2024-01-14 10:30' },
  { id: 2, title: '长丰县作物类型异常', status: 'processed', time: '2024-01-12 14:20' },
  { id: 3, title: '庐江县面积申报不符', status: 'resolved', time: '2024-01-10 09:00' }
])

const getStatusType = (status) => {
  const map = { pending: 'warning', processed: 'primary', resolved: 'success' }
  return map[status] || 'info'
}

const getStatusName = (status) => {
  const map = { pending: '待处理', processed: '处理中', resolved: '已解决' }
  return map[status] || status
}

const loadMobileDisasterReports = () => {
  try {
    return JSON.parse(localStorage.getItem('mobileDisasterReports') || '[]')
  } catch (error) {
    return []
  }
}

const saveMobileDisasterReports = (reports) => {
  localStorage.setItem('mobileDisasterReports', JSON.stringify(reports))
}

const getIssueTypeName = (typeId) => issueTypes.value.find(item => item.id === typeId)?.name || '其他灾情'

const getDisasterType = (typeId) => {
  const map = {
    frost: 'frost',
    drought: 'drought',
    flood: 'flood',
    pest: 'pest',
    wind: 'wind'
  }
  return map[typeId] || 'other'
}

const getAffectedArea = () => {
  const matched = applyForm.description.match(/(\d+(?:\.\d+)?)\s*亩/)
  return matched ? Number(matched[1]) : 0
}

const goBack = () => router.back()

const handleGetLocation = () => {
  gpsStatus.value = 'locating'
  ElMessage.info('正在获取GPS位置...')
  
  setTimeout(() => {
    gpsData.lng = 117.168456 + (Math.random() - 0.5) * 0.01
    gpsData.lat = 31.987654 + (Math.random() - 0.5) * 0.01
    gpsData.accuracy = Math.round(15 + Math.random() * 10)
    gpsData.time = new Date().toLocaleString()
    applyForm.location = `经度${gpsData.lng.toFixed(4)}°,纬度${gpsData.lat.toFixed(4)}°`
    gpsStatus.value = 'located'
    ElMessage.success('定位成功')
  }, 1500)
}

const handleTakePhoto = () => {
  photoLabel.value = ''
  photoDialogVisible.value = true
}

const confirmTakePhoto = () => {
  if (!photoLabel.value) {
    ElMessage.warning('请输入照片说明')
    return
  }
  
  applyForm.photos.push({
    url: `https://picsum.photos/200/200?random=${Date.now()}`,
    label: photoLabel.value
  })
  photoDialogVisible.value = false
  ElMessage.success('拍照成功')
}

const removePhoto = (index) => {
  applyForm.photos.splice(index, 1)
}

const handleOffline = () => {
  ElMessage.success('已保存到离线数据')
}

const handleSubmit = () => {
  if (!applyForm.issueType) {
    ElMessage.warning(isWanqitong.value ? '请选择灾情类型' : '请选择问题类型')
    return
  }
  if (!applyForm.title) {
    ElMessage.warning(isWanqitong.value ? '请输入灾情标题' : '请输入问题标题')
    return
  }
  if (applyForm.photos.length === 0) {
    ElMessage.warning('请至少上传一张现场照片')
    return
  }

  ElMessageBox.confirm(isWanqitong.value ? '确认立即上报灾情吗？' : '确认立即上报问题吗？', '确认上报', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if (isWanqitong.value) {
      const affectedArea = getAffectedArea()
      const report = {
        id: `MOB-DIS-${Date.now()}`,
        source: 'wanqitong',
        type: getDisasterType(applyForm.issueType),
        typeName: getIssueTypeName(applyForm.issueType),
        level: applyForm.urgency === 'high' ? 'high' : 'medium',
        region: { name: applyForm.location || '皖企通定位区域', counties: [applyForm.location || '皖企通定位区域'] },
        affectedArea,
        disasterArea: Math.round(affectedArea * 0.6),
        estimatedLoss: affectedArea * 120,
        status: 'processing',
        reportTime: new Date().toLocaleString('zh-CN', { hour12: false }),
        occurTime: applyForm.occurTime || new Date().toISOString().split('T')[0],
        reporter: applyForm.reporter,
        phone: applyForm.phone,
        affectedCrops: ['小麦'],
        measures: '移动端灾情上报，待县级核验后制定处置措施',
        location: applyForm.location,
        description: applyForm.description,
        images: applyForm.photos.map(photo => photo.url),
        dispatchFlows: []
      }
      const reports = loadMobileDisasterReports()
      saveMobileDisasterReports([report, ...reports])
      ElMessage.success('灾情上报成功，已同步到防灾减灾管理列表')
    } else {
      ElMessage.success('问题上报成功')
    }
    historyRecords.value.unshift({
      id: Date.now(),
      title: applyForm.title,
      status: 'pending',
      time: new Date().toLocaleString()
    })
    router.back()
  }).catch(() => {})
}
</script>

<style scoped>
.mobile-issue-report {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 80px;
}

.page-header {
  background: #ef4444;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  color: #fff;
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

.form-content {
  padding: 16px;
}

.form-section {
  background: #fff;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px;
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
}

.issue-types {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.type-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 8px;
  background: #f9fafb;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.type-item.active {
  background: #fef2f2;
  border-color: #ef4444;
}

.type-item span {
  font-size: 12px;
  color: #374151;
}

.location-input {
  display: flex;
  gap: 8px;
}

.location-input .el-input {
  flex: 1;
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

.photo-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 11px;
}

.remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(239, 68, 68, 0.9);
  color: #fff;
  border-radius: 50%;
  padding: 4px;
  cursor: pointer;
}

.add-photo {
  aspect-ratio: 1;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #9ca3af;
  cursor: pointer;
}

.add-photo span {
  font-size: 12px;
}

.gps-info {
  background: #f9fafb;
  border-radius: 8px;
  padding: 12px;
}

.gps-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}

.gps-label {
  font-size: 13px;
  color: #6b7280;
}

.gps-value {
  font-size: 13px;
  color: #1f2937;
  font-weight: 500;
}

.gps-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  color: #9ca3af;
}

.loading {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.history-section {
  background: #fff;
  border-radius: 4px;
  padding: 16px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.history-content {
  flex: 1;
}

.history-content h4 {
  margin: 0;
  font-size: 14px;
  color: #1f2937;
}

.history-content p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #9ca3af;
}

.bottom-bar {
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

.bottom-bar .el-button {
  flex: 1;
}

.photo-label-input {
  padding: 16px;
}

.camera-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.camera-placeholder {
  text-align: center;
  color: #9ca3af;
}

.camera-btn {
  padding: 20px;
  display: flex;
  justify-content: center;
}
</style>