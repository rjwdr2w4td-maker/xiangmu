<template>
  <div class="mobile-planting-record">
    <div class="page-header">
      <el-icon @click="goBack"><ArrowLeft /></el-icon>
      <h3>种植备案</h3>
    </div>

    <div class="info-banner">
      <el-icon><InfoFilled /></el-icon>
      <span>青贮饲料种植补贴标准：60元/亩</span>
    </div>

    <div class="form-content">
      <div class="form-section">
        <h3 class="section-title">主体信息</h3>
        <div class="info-card">
          <div class="info-row">
            <span class="label">主体名称</span>
            <span class="value">{{ subjectInfo.name }}</span>
          </div>
          <div class="info-row">
            <span class="label">统一社会信用代码</span>
            <span class="value">{{ subjectInfo.creditCode }}</span>
          </div>
          <div class="info-row">
            <span class="label">联系人</span>
            <span class="value">{{ subjectInfo.contact }}</span>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3 class="section-title">种植信息</h3>
        <el-form :model="form" label-position="top">
          <el-form-item label="种植年份">
            <el-date-picker
              v-model="form.year"
              type="year"
              placeholder="选择年份"
              style="width: 100%"
              value-format="YYYY"
            />
          </el-form-item>
          <el-form-item label="种植品种">
            <el-select v-model="form.varietyName" placeholder="请选择" style="width: 100%">
              <el-option label="青贮玉米" value="青贮玉米" />
              <el-option label="青贮小麦" value="青贮小麦" />
              <el-option label="青贮苜蓿" value="青贮苜蓿" />
              <el-option label="其他青贮作物" value="其他" />
            </el-select>
          </el-form-item>
          <el-form-item label="种植面积(亩)">
            <el-input-number v-model="form.area" :min="0" style="width: 100%" />
          </el-form-item>
          <el-form-item label="预计产量(吨)">
            <el-input-number v-model="form.expectedYield" :min="0" style="width: 100%" />
          </el-form-item>
          <el-form-item label="计划种植日期">
            <el-date-picker
              v-model="form.plantingDate"
              type="date"
              placeholder="选择日期"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item label="地块位置">
            <el-input v-model="form.location" placeholder="请输入地块名称或位置" />
          </el-form-item>
          <el-form-item label="地块中心坐标">
            <el-input v-model="form.plotLocation" placeholder="经度,纬度（如：117.28,31.86）" />
          </el-form-item>
        </el-form>
      </div>

      <div class="form-section">
        <h3 class="section-title">地块照片</h3>
        <div class="photo-grid">
          <div class="photo-item" v-for="(photo, index) in form.photos" :key="index">
            <el-image :src="photo" fit="cover" style="width: 100%; height: 100%; border-radius: 8px" />
            <el-icon class="remove-btn" @click="removePhoto(index)"><Delete /></el-icon>
          </div>
          <div class="add-photo" @click="handleAddPhoto">
            <el-icon :size="28"><Camera /></el-icon>
            <span>上传照片</span>
          </div>
        </div>
      </div>

      <div class="calc-card">
        <div class="calc-title">补贴预估</div>
        <div class="calc-detail">
          <div class="calc-row">
            <span>种植面积</span>
            <span>{{ form.area }} 亩</span>
          </div>
          <div class="calc-row">
            <span>补贴标准</span>
            <span>60 元/亩</span>
          </div>
          <div class="calc-total">
            <span>预估补贴金额</span>
            <span class="amount">¥{{ (form.area * 60).toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-bar">
      <el-button size="large" @click="handleSaveDraft">保存草稿</el-button>
      <el-button type="primary" size="large" @click="handleSubmit">提交备案</el-button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const route = useRoute()

const subjectInfo = reactive({
  name: '张三家庭农场',
  creditCode: '91340100MA2XXXXXX',
  contact: '张三'
})

const form = reactive({
  year: new Date().getFullYear().toString(),
  varietyName: '',
  area: 0,
  expectedYield: 0,
  plantingDate: '',
  location: '',
  plotLocation: '',
  photos: []
})

const goBack = () => router.back()

const handleAddPhoto = () => {
  ElMessage.info('调用相机/相册')
  form.photos.push(`https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=realistic%20agricultural%20silage%20corn%20field%2C%20green%20plants%2C%20sunny%20day%2C%20documentary%20photo&image_size=landscape_4_3`)
}

const removePhoto = (index) => {
  form.photos.splice(index, 1)
}

const handleSaveDraft = () => {
  ElMessage.success('草稿已保存')
}

const handleSubmit = () => {
  if (!form.varietyName) {
    ElMessage.warning('请选择种植品种')
    return
  }
  if (form.area === 0) {
    ElMessage.warning('请输入种植面积')
    return
  }
  if (!form.plantingDate) {
    ElMessage.warning('请选择计划种植日期')
    return
  }

  ElMessageBox.confirm('确认提交种植备案吗？', '确认提交', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    const record = {
      id: `PLANT${Date.now()}`,
      subjectName: subjectInfo.name,
      varietyName: form.varietyName,
      area: form.area,
      expectedYield: form.expectedYield,
      plantingDate: form.plantingDate,
      location: form.location,
      plotLocation: form.plotLocation ? form.plotLocation.split(',').map(Number) : [117.28, 31.86],
      plotGeom: [],
      status: 'pending',
      statusName: '待审核',
      reporter: subjectInfo.contact,
      reportTime: new Date().toLocaleString('zh-CN', { hour12: false }),
      source: 'wanqitong',
      photos: [...form.photos]
    }
    const records = JSON.parse(localStorage.getItem('mobilePlantingRecords') || '[]')
    records.unshift(record)
    localStorage.setItem('mobilePlantingRecords', JSON.stringify(records))
    ElMessage.success('种植备案提交成功，已同步到PC端')
    router.back()
  }).catch(() => {})
}
</script>

<style scoped>
.mobile-planting-record {
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

.info-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #d1fae5;
  font-size: 13px;
  color: #065f46;
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

.info-card {
  background: #f9fafb;
  border-radius: 8px;
  padding: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
}

.info-row .label {
  color: #6b7280;
}

.info-row .value {
  color: #1f2937;
  font-weight: 500;
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

.calc-card {
  background: #ecfdf5;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
}

.calc-title {
  font-size: 15px;
  font-weight: 600;
  color: #065f46;
  margin-bottom: 12px;
}

.calc-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 14px;
  color: #047857;
}

.calc-total {
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
  margin-top: 8px;
  border-top: 1px solid rgba(16, 185, 129, 0.3);
  font-size: 15px;
  font-weight: 600;
  color: #065f46;
}

.calc-total .amount {
  font-size: 20px;
  color: #059669;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  background: #fff;
  display: flex;
  gap: 12px;
}

.bottom-bar .el-button {
  flex: 1;
}
</style>
