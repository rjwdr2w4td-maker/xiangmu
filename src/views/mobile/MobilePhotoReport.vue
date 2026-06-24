<template>
  <div class="mobile-photo-report">
    <div class="page-header">
      <el-icon @click="goBack"><ArrowLeft /></el-icon>
      <h3>图斑核查</h3>
    </div>

    <div class="form-content">
      <div class="form-section">
        <h3 class="section-title">选择图斑</h3>
        <el-form :model="form" label-position="top">
          <el-form-item label="图斑编号">
            <el-select 
              v-model="selectedPlotNo" 
              placeholder="请选择待核查图斑" 
              style="width: 100%"
              @change="handlePlotChange"
              filterable
            >
              <el-option 
                v-for="plot in availablePlots" 
                :key="plot.plotNo" 
                :label="plot.plotNo" 
                :value="plot.plotNo"
              >
                <span style="float: left">{{ plot.plotNo }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ plot.statusName }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <div class="form-section" v-if="selectedPlot">
        <h3 class="section-title">图斑信息</h3>
        <div class="plot-info-card">
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="图斑编号">
              <span class="info-value">{{ selectedPlot.plotNo }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="位置信息">
              <span class="info-value">{{ locationText }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="面积">
              <span class="info-value">{{ selectedPlot.area }} 亩</span>
            </el-descriptions-item>
            <el-descriptions-item label="问题类型">
              <span class="info-value">{{ selectedPlot.problemTypeName }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="风险等级">
              <el-tag 
                :type="selectedPlot.riskLevel === 'high' ? 'danger' : (selectedPlot.riskLevel === 'medium' ? 'warning' : 'info')" 
                size="small"
              >
                {{ selectedPlot.riskLevel === 'high' ? '高风险' : (selectedPlot.riskLevel === 'medium' ? '中风险' : '低风险') }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="风险原因">
              <span class="info-value">{{ selectedPlot.riskReason }}</span>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="image-section">
          <div class="image-item">
            <div class="image-label">变化前图片</div>
            <el-image 
              :src="selectedPlot.beforeImage" 
              fit="cover" 
              style="width: 100%; height: 160px; border-radius: 4px"
              :preview-src-list="[selectedPlot.beforeImage]"
            />
          </div>
          <div class="image-item">
            <div class="image-label">变化后图片</div>
            <el-image 
              :src="selectedPlot.afterImage" 
              fit="cover" 
              style="width: 100%; height: 160px; border-radius: 4px"
              :preview-src-list="[selectedPlot.afterImage]"
            />
          </div>
        </div>
      </div>

      <div class="form-section" v-if="selectedPlot">
        <h3 class="section-title">核查信息</h3>
        <el-form :model="form" label-position="top">
          <el-form-item label="核查结论" required>
            <el-select v-model="form.checkResult" placeholder="请选择核查结论" style="width: 100%">
              <el-option label="问题属实" value="confirmed" />
              <el-option label="问题不属实" value="unconfirmed" />
              <el-option label="需要进一步核实" value="need_more" />
            </el-select>
          </el-form-item>
          <el-form-item label="实际面积(亩)" required>
            <el-input-number v-model="form.actualArea" :min="0" style="width: 100%" />
          </el-form-item>
          <el-form-item label="核查描述" required>
            <el-input 
              v-model="form.description" 
              type="textarea" 
              :rows="4" 
              placeholder="请详细描述核查情况、现场状况、发现问题等" 
            />
          </el-form-item>
        </el-form>
      </div>

      <div class="form-section" v-if="selectedPlot">
        <h3 class="section-title">现场照片</h3>
        <div class="media-grid">
          <div class="media-item" v-for="(photo, index) in form.photos" :key="'photo-'+index">
            <el-image :src="photo" fit="cover" style="width: 100%; height: 100%; border-radius: 4px" />
            <div class="media-badge">照片</div>
            <el-icon class="remove-btn" @click="removePhoto(index)"><Delete /></el-icon>
          </div>
          <div class="add-media" @click="handleAddPhoto" v-if="form.photos.length < 5">
            <el-icon :size="24"><Camera /></el-icon>
            <span>拍照</span>
          </div>
        </div>
        <p class="media-tip">请拍摄现场照片，自动添加时间、地点水印（最多5张）</p>
      </div>

      <div class="form-section" v-if="selectedPlot">
        <h3 class="section-title">现场视频</h3>
        <div class="media-grid">
          <div class="media-item video-item" v-for="(video, index) in form.videos" :key="'video-'+index">
            <div class="video-placeholder">
              <el-icon :size="24"><VideoPlay /></el-icon>
              <span>视频</span>
            </div>
            <div class="media-badge video-badge">视频</div>
            <el-icon class="remove-btn" @click="removeVideo(index)"><Delete /></el-icon>
          </div>
          <div class="add-media" @click="handleRecordVideo" v-if="form.videos.length < 2">
            <el-icon :size="24"><VideoCamera /></el-icon>
            <span>录像</span>
          </div>
        </div>
        <p class="media-tip">可录制现场视频（最多2个）</p>
      </div>

      <div class="form-section" v-if="selectedPlot">
        <h3 class="section-title">GPS定位</h3>
        <div class="location-card">
          <div class="location-display">
            <el-icon><Location /></el-icon>
            <span>{{ form.location || '点击获取当前位置' }}</span>
          </div>
          <el-button type="primary" size="small" @click="handleGetLocation">
            <el-icon><Aim /></el-icon>
            获取定位
          </el-button>
        </div>
      </div>

      <div class="form-section" v-if="selectedPlot">
        <h3 class="section-title">核查人信息</h3>
        <el-form :model="form" label-position="top">
          <el-form-item label="核查人姓名" required>
            <el-input v-model="form.checker" placeholder="请输入核查人姓名" />
          </el-form-item>
          <el-form-item label="联系电话" required>
            <el-input v-model="form.phone" placeholder="请输入联系电话" />
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="bottom-bar" v-if="selectedPlot">
      <el-button type="primary" size="large" @click="handleSubmit" style="width: 100%">
        提交核查结果
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getPlots, savePlots } from '@/data/plotStore'

const router = useRouter()

const selectedPlotNo = ref('')
const selectedPlot = ref(null)

const form = reactive({
  checkResult: '',
  actualArea: 0,
  description: '',
  photos: [],
  videos: [],
  location: '',
  gpsCoords: null,
  checker: '',
  phone: ''
})

const availablePlots = computed(() => {
  const plots = getPlots()
  return plots.filter(p => p.status === 'pending_check' || p.status === 'checking')
})

const locationText = computed(() => {
  if (!selectedPlot.value) return ''
  const loc = selectedPlot.value.location
  return `${loc.county}${loc.town}${loc.village}`
})

const goBack = () => router.back()

const handlePlotChange = (plotNo) => {
  if (!plotNo) {
    selectedPlot.value = null
    resetForm()
    return
  }
  
  const plots = getPlots()
  selectedPlot.value = plots.find(p => p.plotNo === plotNo)
  
  if (selectedPlot.value) {
    form.actualArea = selectedPlot.value.area
    form.checkResult = ''
    form.description = ''
    form.photos = []
    form.videos = []
    form.location = ''
    form.gpsCoords = null
    form.checker = ''
    form.phone = ''
  }
}

const resetForm = () => {
  form.checkResult = ''
  form.actualArea = 0
  form.description = ''
  form.photos = []
  form.videos = []
  form.location = ''
  form.gpsCoords = null
  form.checker = ''
  form.phone = ''
}

const handleGetLocation = () => {
  ElMessage.info('正在获取定位...')
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(4)
        const lng = position.coords.longitude.toFixed(4)
        form.gpsCoords = [parseFloat(lng), parseFloat(lat)]
        form.location = `当前位置 (${lng}, ${lat})`
        ElMessage.success('定位成功')
      },
      () => {
        setTimeout(() => {
          form.location = '模拟定位 (117.4521, 31.8892)'
          form.gpsCoords = [117.4521, 31.8892]
          ElMessage.success('定位成功')
        }, 1000)
      }
    )
  } else {
    setTimeout(() => {
      form.location = '模拟定位 (117.4521, 31.8892)'
      form.gpsCoords = [117.4521, 31.8892]
      ElMessage.success('定位成功')
    }, 1000)
  }
}

const handleAddPhoto = () => {
  if (form.photos.length >= 5) {
    ElMessage.warning('最多上传5张照片')
    return
  }
  const timestamp = new Date().toLocaleString('zh-CN', { hour12: false })
  const watermark = form.location ? `${timestamp} ${form.location}` : timestamp
  ElMessage.info(`拍照并添加水印: ${watermark}`)
  form.photos.push(`https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=realistic%20agricultural%20field%20inspection%2C%20farmland%2C%20rural%20China%2C%20documentary%2C%20daylight&image_size=landscape_4_3&t=${Date.now()}`)
}

const handleRecordVideo = () => {
  if (form.videos.length >= 2) {
    ElMessage.warning('最多录制2个视频')
    return
  }
  ElMessage.info('开始录制视频，结束后自动保存')
  form.videos.push({
    id: `VIDEO${Date.now()}`,
    duration: '15s',
    timestamp: new Date().toLocaleString('zh-CN', { hour12: false })
  })
}

const removePhoto = (index) => {
  form.photos.splice(index, 1)
}

const removeVideo = (index) => {
  form.videos.splice(index, 1)
}

const handleSubmit = () => {
  if (!form.checkResult) {
    ElMessage.warning('请选择核查结论')
    return
  }
  if (!form.description) {
    ElMessage.warning('请填写核查描述')
    return
  }
  if (form.photos.length === 0) {
    ElMessage.warning('请至少上传一张现场照片')
    return
  }
  if (!form.location) {
    ElMessage.warning('请获取GPS定位')
    return
  }
  if (!form.checker) {
    ElMessage.warning('请输入核查人姓名')
    return
  }
  if (!form.phone) {
    ElMessage.warning('请输入联系电话')
    return
  }

  ElMessageBox.confirm('确认提交核查结果吗？提交后图斑状态将更新为"待审核"', '确认提交', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    const plots = getPlots()
    const plotIndex = plots.findIndex(p => p.plotNo === selectedPlotNo.value)
    
    if (plotIndex !== -1) {
      const plot = plots[plotIndex]
      plot.status = 'pending_review'
      plot.statusName = '待审核'
      plot.checkResult = {
        checker: form.checker,
        checkTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
        result: form.checkResult,
        resultName: form.checkResult === 'confirmed' ? '问题属实' : (form.checkResult === 'unconfirmed' ? '问题不属实' : '需要进一步核实'),
        actualArea: form.actualArea,
        description: form.description,
        photos: [...form.photos],
        videos: form.videos.length > 0 ? form.videos : undefined,
        gpsLocation: form.gpsCoords,
        phone: form.phone
      }
      
      if (!plot.flowLogs) plot.flowLogs = []
      plot.flowLogs.push({
        time: plot.checkResult.checkTime,
        action: '移动端核查完成，结果已上报',
        operator: form.checker
      })
      
      savePlots(plots)
      
      ElMessage.success('核查结果已提交，图斑状态已更新为"待审核"')
      router.back()
    }
  }).catch(() => {})
}

onMounted(() => {
  if (availablePlots.value.length === 0) {
    ElMessage.warning('暂无待核查图斑')
  }
})
</script>

<style scoped>
.mobile-photo-report {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 80px;
}

.page-header {
  background: #1a3a5c;
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
  margin: 0 0 16px;
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
}

.plot-info-card {
  margin-bottom: 16px;
}

.info-value {
  color: #1f2937;
  font-weight: 500;
}

.image-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 12px;
}

.image-item {
  flex: 1;
}

.image-label {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 8px;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.media-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 4px;
  overflow: hidden;
  background: #f0f0f0;
}

.media-badge {
  position: absolute;
  top: 4px;
  left: 4px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 2px;
}

.video-badge {
  background: rgba(64, 158, 255, 0.9);
}

.video-item .video-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
  gap: 4px;
}

.video-placeholder span {
  font-size: 12px;
}

.remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(255, 255, 255, 0.9);
  color: #f56c6c;
  border-radius: 50%;
  padding: 4px;
  font-size: 14px;
  cursor: pointer;
}

.add-media {
  aspect-ratio: 1;
  border: 2px dashed #d1d5db;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #9ca3af;
  cursor: pointer;
  background: #fafafa;
}

.add-media span {
  font-size: 12px;
}

.media-tip {
  margin-top: 12px;
  font-size: 12px;
  color: #9ca3af;
}

.location-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #f0f9ff;
  border-radius: 4px;
  border: 1px solid #bae6fd;
}

.location-display {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #0369a1;
  font-size: 14px;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  background: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

:deep(.el-descriptions__label) {
  font-weight: 500;
  color: #606266;
}

:deep(.el-descriptions__content) {
  color: #303133;
}
</style>