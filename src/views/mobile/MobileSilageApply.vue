<template>
  <div class="mobile-silage">
    <div class="page-header">
      <el-icon @click="goBack"><ArrowLeft /></el-icon>
      <h3>青贮申报</h3>
    </div>

    <div class="info-banner">
      <el-icon><InfoFilled /></el-icon>
      <span>青贮饲料种植补贴标准：60元/亩，申报截止日期：2024年3月31日</span>
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
          <div class="info-row">
            <span class="label">联系电话</span>
            <span class="value">{{ subjectInfo.phone }}</span>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3 class="section-title">种植信息</h3>
        <el-form :model="applyForm" label-position="top">
          <el-form-item label="种植年份">
            <el-date-picker
              v-model="applyForm.year"
              type="year"
              placeholder="选择年份"
              style="width: 100%"
              value-format="YYYY"
            />
          </el-form-item>
          <el-form-item label="青贮作物类型">
            <el-select v-model="applyForm.cropType" placeholder="请选择" style="width: 100%">
              <el-option label="青贮玉米" value="silage_corn" />
              <el-option label="青贮小麦" value="silage_wheat" />
              <el-option label="青贮苜蓿" value="alfalfa" />
              <el-option label="其他青贮作物" value="other" />
            </el-select>
          </el-form-item>
          <el-form-item label="种植面积(亩)">
            <el-input-number v-model="applyForm.area" :min="0" style="width: 100%" />
          </el-form-item>
          <el-form-item label="预计产量(吨)">
            <el-input-number v-model="applyForm.estimateYield" :min="0" style="width: 100%" />
          </el-form-item>
          <el-form-item label="种植地块">
            <el-input v-model="applyForm.location" placeholder="请输入地块名称或位置" />
          </el-form-item>
          <el-form-item label="收储企业">
            <el-select v-model="applyForm.storageCompany" placeholder="请选择" style="width: 100%">
              <el-option label="合肥奶牛养殖有限公司" value="company1" />
              <el-option label="安徽牧业集团" value="company2" />
              <el-option label="其他企业" value="other" />
            </el-select>
          </el-form-item>
          <el-form-item label="合同编号">
            <el-input v-model="applyForm.contractNo" placeholder="请输入购销合同编号" />
          </el-form-item>
        </el-form>
      </div>

      <div class="form-section">
        <h3 class="section-title">地块照片</h3>
        <div class="photo-grid">
          <div class="photo-item" v-for="(photo, index) in applyForm.photos" :key="index">
            <el-image :src="photo" fit="cover" style="width: 100%; height: 100%; border-radius: 8px" />
            <el-icon class="remove-btn" @click="removePhoto(index)"><Delete /></el-icon>
          </div>
          <div class="add-photo" @click="handleAddPhoto">
            <el-icon :size="28"><Camera /></el-icon>
            <span>上传照片</span>
          </div>
        </div>
        <p class="photo-tip">请上传地块现场照片，支持jpg、png格式</p>
      </div>

      <div class="form-section">
        <h3 class="section-title">合同附件</h3>
        <div class="file-list">
          <div class="file-item" v-for="(file, index) in applyForm.files" :key="index">
            <el-icon><Document /></el-icon>
            <span class="file-name">{{ file.name }}</span>
            <el-icon class="remove" @click="removeFile(index)"><Close /></el-icon>
          </div>
          <div class="add-file" @click="handleAddFile">
            <el-icon><Upload /></el-icon>
            <span>上传合同</span>
          </div>
        </div>
      </div>

      <div class="calc-card">
        <div class="calc-title">补贴预估</div>
        <div class="calc-detail">
          <div class="calc-row">
            <span>种植面积</span>
            <span>{{ applyForm.area }} 亩</span>
          </div>
          <div class="calc-row">
            <span>补贴标准</span>
            <span>60 元/亩</span>
          </div>
          <div class="calc-total">
            <span>预估补贴金额</span>
            <span class="amount">¥{{ (applyForm.area * 60).toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-bar">
      <el-button size="large" @click="handleSaveDraft">保存草稿</el-button>
      <el-button type="primary" size="large" @click="handleSubmit">提交申报</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const route = useRoute()

const subjectInfo = reactive({
  name: '张三家庭农场',
  creditCode: '91340100MA2XXXXXX',
  contact: '张三',
  phone: '138****8888'
})

const applyForm = reactive({
  year: '2024',
  cropType: '',
  area: 0,
  estimateYield: 0,
  location: '',
  storageCompany: '',
  contractNo: '',
  photos: [],
  files: []
})

const goBack = () => router.back()

const handleAddPhoto = () => {
  ElMessage.info('调用相机/相册')
  applyForm.photos.push(`https://picsum.photos/200/200?random=${Date.now()}`)
}

const removePhoto = (index) => {
  applyForm.photos.splice(index, 1)
}

const handleAddFile = () => {
  ElMessage.info('文件上传功能开发中')
  applyForm.files.push({ name: `购销合同_${Date.now()}.pdf` })
}

const removeFile = (index) => {
  applyForm.files.splice(index, 1)
}

const handleSaveDraft = () => {
  ElMessage.success('已保存草稿')
}

const handleSubmit = () => {
  if (!applyForm.cropType) {
    ElMessage.warning('请选择青贮作物类型')
    return
  }
  if (applyForm.area === 0) {
    ElMessage.warning('请输入种植面积')
    return
  }
  if (!applyForm.storageCompany) {
    ElMessage.warning('请选择收储企业')
    return
  }

  ElMessageBox.confirm('确认提交青贮申报吗？', '确认提交', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    ElMessage.success('申报提交成功')
    router.back()
  }).catch(() => {})
}
</script>

<style scoped>
.mobile-silage {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 80px;
}

.page-header {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
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
  background: #fef3c7;
  font-size: 13px;
  color: #92400e;
}

.form-content {
  padding: 16px;
}

.form-section {
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

.info-card {
  background: #f9fafb;
  border-radius: 8px;
  padding: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
}

.info-row:last-child {
  border-bottom: none;
}

.info-row .label {
  font-size: 13px;
  color: #6b7280;
}

.info-row .value {
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

.photo-tip {
  margin: 12px 0 0;
  font-size: 12px;
  color: #9ca3af;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.file-name {
  flex: 1;
  font-size: 14px;
  color: #374151;
}

.file-item .remove {
  cursor: pointer;
  color: #ef4444;
}

.add-file {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  color: #9ca3af;
  font-size: 14px;
}

.calc-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.calc-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.calc-detail {
  background: #f9fafb;
  border-radius: 8px;
  padding: 12px;
}

.calc-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 14px;
  color: #6b7280;
}

.calc-total {
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
  margin-top: 8px;
  border-top: 1px solid #e5e7eb;
}

.calc-total .amount {
  font-size: 20px;
  font-weight: 700;
  color: #f59e0b;
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
</style>