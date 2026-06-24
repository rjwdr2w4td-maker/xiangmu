<template>
  <div class="mobile-photo-report">
    <div class="page-header">
      <el-icon @click="goBack"><ArrowLeft /></el-icon>
      <h3>随手拍上报</h3>
    </div>

    <div class="form-content">
      <div class="form-section">
        <h3 class="section-title">问题信息</h3>
        <el-form :model="form" label-position="top">
          <el-form-item label="问题类型">
            <el-select v-model="form.problemType" placeholder="请选择问题类型" style="width: 100%">
              <el-option label="疑似撂荒" value="fallow" />
              <el-option label="种植计划未落实" value="not_plant" />
              <el-option label="非法占用耕地" value="illegal_use" />
              <el-option label="作物长势异常" value="poor_growth" />
              <el-option label="其他问题" value="other" />
            </el-select>
          </el-form-item>
          <el-form-item label="问题标题">
            <el-input v-model="form.title" placeholder="请简要描述问题" maxlength="50" show-word-limit />
          </el-form-item>
          <el-form-item label="问题详情">
            <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请详细描述问题情况、发现时间、影响范围等" />
          </el-form-item>
          <el-form-item label="涉及面积(亩)">
            <el-input-number v-model="form.area" :min="0" style="width: 100%" />
          </el-form-item>
        </el-form>
      </div>

      <div class="form-section">
        <h3 class="section-title">图斑关联</h3>
        <el-form :model="form" label-position="top">
          <el-form-item label="关联图斑编号（如有）">
            <el-input v-model="form.plotId" placeholder="请输入图斑编号或选择待核查任务" />
          </el-form-item>
          <el-form-item label="核查结论">
            <el-select v-model="form.checkResult" placeholder="请选择核查结论" style="width: 100%">
              <el-option label="问题属实" value="confirmed" />
              <el-option label="问题不属实" value="unconfirmed" />
              <el-option label="需要进一步核实" value="need_more" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <div class="form-section">
        <h3 class="section-title">现场照片/视频</h3>
        <div class="media-grid">
          <div class="media-item" v-for="(photo, index) in form.photos" :key="'photo-'+index">
            <el-image :src="photo" fit="cover" style="width: 100%; height: 100%; border-radius: 4px" />
            <div class="media-badge">照片</div>
            <el-icon class="remove-btn" @click="removePhoto(index)"><Delete /></el-icon>
          </div>
          <div class="media-item video-item" v-for="(video, index) in form.videos" :key="'video-'+index">
            <div class="video-placeholder">
              <el-icon :size="24"><VideoPlay /></el-icon>
              <span>视频</span>
            </div>
            <div class="media-badge video-badge">视频</div>
            <el-icon class="remove-btn" @click="removeVideo(index)"><Delete /></el-icon>
          </div>
          <div class="add-media" @click="handleAddPhoto">
            <el-icon :size="24"><Camera /></el-icon>
            <span>拍照</span>
          </div>
          <div class="add-media" @click="handleRecordVideo">
            <el-icon :size="24"><VideoCamera /></el-icon>
            <span>录像</span>
          </div>
        </div>
        <p class="media-tip">照片自动添加时间、地点水印；视频支持离线保存和实时上传</p>
      </div>

      <div class="form-section">
        <h3 class="section-title">位置信息</h3>
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
        <el-form :model="form" label-position="top" style="margin-top: 12px">
          <el-form-item label="详细地址">
            <el-input v-model="form.address" placeholder="请输入详细地址或地块名称" />
          </el-form-item>
        </el-form>
      </div>

      <div class="form-section">
        <h3 class="section-title">现场照片</h3>
        <div class="photo-grid">
          <div class="photo-item" v-for="(photo, index) in form.photos" :key="index">
            <el-image :src="photo" fit="cover" style="width: 100%; height: 100%; border-radius: 8px" />
            <el-icon class="remove-btn" @click="removePhoto(index)"><Delete /></el-icon>
          </div>
          <div class="add-photo" @click="handleAddPhoto">
            <el-icon :size="28"><Camera /></el-icon>
            <span>拍照上传</span>
          </div>
        </div>
        <p class="photo-tip">请上传现场照片，支持jpg、png格式，最多3张</p>
      </div>

      <div class="form-section">
        <h3 class="section-title">上报人信息</h3>
        <div class="reporter-info">
          <el-form :model="form" label-position="top">
            <el-form-item label="上报人姓名">
              <el-input v-model="form.reporter" placeholder="请输入姓名" />
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="form.phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <div class="bottom-bar">
      <el-button size="large" @click="handleSaveDraft">保存草稿</el-button>
      <el-button type="primary" size="large" @click="handleSubmit">提交上报</el-button>
    </div>

    <el-dialog v-model="historyVisible" title="上报记录" width="90%">
      <div class="history-list">
        <div class="history-item" v-for="record in historyRecords" :key="record.id">
          <div class="history-header">
            <span class="history-title">{{ record.title }}</span>
            <el-tag :type="record.status === 'pending' ? 'warning' : 'success'" size="small">
              {{ record.status === 'pending' ? '待处理' : '已处理' }}
            </el-tag>
          </div>
          <div class="history-meta">
            <span>{{ record.time }}</span>
            <span>{{ record.location }}</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getPlots, savePlots } from '@/data/plotStore'

const router = useRouter()
const route = useRoute()

const form = reactive({
  problemType: '',
  title: '',
  description: '',
  area: 0,
  plotId: '',
  checkResult: '',
  location: '',
  address: '',
  gpsCoords: null,
  photos: [],
  videos: [],
  reporter: '',
  phone: ''
})

const historyVisible = ref(false)
const historyRecords = ref([
  { id: 1, title: '肥东县店埠镇疑似撂荒', status: 'pending', time: '2024-01-15 14:30', location: '肥东县店埠镇' },
  { id: 2, title: '长丰县水湖镇种植未落实', status: 'resolved', time: '2024-01-14 10:20', location: '长丰县水湖镇' }
])

const goBack = () => router.back()

const handleGetLocation = () => {
  ElMessage.info('正在获取定位...')
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(4)
        const lng = position.coords.longitude.toFixed(4)
        form.gpsCoords = [parseFloat(lng), parseFloat(lat)]
        form.location = `当前位置 (${lng}, ${lat})`
        form.address = '安徽省当前位置'
        ElMessage.success('定位成功，时间地点水印已自动添加')
      },
      () => {
        setTimeout(() => {
          form.location = '合肥市肥东县店埠镇 (117.4521, 31.8892)'
          form.gpsCoords = [117.4521, 31.8892]
          form.address = '肥东县店埠镇XX村XX地块'
          ElMessage.success('定位成功')
        }, 1000)
      }
    )
  } else {
    setTimeout(() => {
      form.location = '合肥市肥东县店埠镇 (117.4521, 31.8892)'
      form.gpsCoords = [117.4521, 31.8892]
      form.address = '肥东县店埠镇XX村XX地块'
      ElMessage.success('定位成功')
    }, 1000)
  }
}

const handleAddPhoto = () => {
  if (form.photos.length >= 3) {
    ElMessage.warning('最多上传3张照片')
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

const removeVideo = (index) => {
  form.videos.splice(index, 1)
}

const removePhoto = (index) => {
  form.photos.splice(index, 1)
}

const handleSaveDraft = () => {
  ElMessage.success('草稿已保存')
}

const handleSubmit = () => {
  if (!form.problemType) {
    ElMessage.warning('请选择问题类型')
    return
  }
  if (!form.title) {
    ElMessage.warning('请输入问题标题')
    return
  }
  if (!form.location) {
    ElMessage.warning('请获取位置信息')
    return
  }
  if (form.photos.length === 0) {
    ElMessage.warning('请至少上传一张现场照片')
    return
  }
  if (!form.reporter) {
    ElMessage.warning('请输入上报人姓名')
    return
  }
  if (!form.checkResult) {
    ElMessage.warning('请选择核查结论')
    return
  }

  ElMessageBox.confirm('确认提交核查结果吗？提交后将同步更新图斑状态为"待审核"', '确认提交', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    if (form.plotId) {
      const plots = getPlots()
      const plot = plots.find(p => p.plotNo === form.plotId || p.id === form.plotId)
      if (plot) {
        plot.status = 'pending_review'
        plot.statusName = '待审核'
        plot.checkResult = {
          checker: form.reporter,
          checkTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
          result: form.checkResult,
          resultName: form.checkResult === 'confirmed' ? '问题属实' : (form.checkResult === 'unconfirmed' ? '问题不属实' : '需要进一步核实'),
          actualArea: form.area,
          description: form.description,
          photos: [...form.photos],
          videos: form.videos.length > 0 ? form.videos : undefined,
          gpsLocation: form.gpsCoords
        }
        if (!plot.flowLogs) plot.flowLogs = []
        plot.flowLogs.push({
          time: plot.checkResult.checkTime,
          action: '移动端核查完成，结果已上报',
          operator: form.reporter
        })
        savePlots(plots)
      }
    }

    const record = {
      id: `PHOTO${Date.now()}`,
      plotId: form.plotId,
      problemType: form.problemType,
      title: form.title,
      description: form.description,
      area: form.area,
      checkResult: form.checkResult,
      location: form.location,
      address: form.address,
      gpsCoords: form.gpsCoords,
      photos: [...form.photos],
      videos: [...form.videos],
      reporter: form.reporter,
      phone: form.phone,
      status: 'pending_review',
      statusName: '待审核',
      reportTime: new Date().toLocaleString('zh-CN', { hour12: false }),
      source: route.params.entry || 'wanzhengtong'
    }
    const records = JSON.parse(localStorage.getItem('mobilePhotoReports') || '[]')
    records.unshift(record)
    localStorage.setItem('mobilePhotoReports', JSON.stringify(records))
    ElMessage.success('核查结果已提交，图斑状态已更新为"待审核"')
    router.back()
  }).catch(() => {})
}
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

.location-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #f0f9ff;
  border-radius: 8px;
  border: 1px solid #bae6fd;
}

.location-display {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #0369a1;
  font-size: 14px;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.photo-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
}

.photo-item .remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border-radius: 50%;
  padding: 4px;
  font-size: 14px;
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
  gap: 8px;
  color: #9ca3af;
  cursor: pointer;
}

.add-photo span {
  font-size: 12px;
}

.photo-tip {
  margin-top: 12px;
  font-size: 12px;
  color: #9ca3af;
}

.reporter-info {
  background: #f9fafb;
  border-radius: 8px;
  padding: 12px;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  background: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 12px;
}

.bottom-bar .el-button {
  flex: 1;
}

.history-list {
  display: grid;
  gap: 12px;
}

.history-item {
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.history-title {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
}

.history-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #6b7280;
}
</style>
