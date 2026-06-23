<template>
  <div class="mobile-storage-declare">
    <div class="page-header">
      <el-icon @click="goBack"><ArrowLeft /></el-icon>
      <h3>收储申报</h3>
    </div>

    <div class="info-banner">
      <el-icon><InfoFilled /></el-icon>
      <span>青贮饲料收储补贴标准：50元/吨</span>
    </div>

    <div class="form-content">
      <div class="form-section">
        <h3 class="section-title">企业信息</h3>
        <div class="info-card">
          <div class="info-row">
            <span class="label">企业名称</span>
            <span class="value">{{ enterpriseInfo.name }}</span>
          </div>
          <div class="info-row">
            <span class="label">统一社会信用代码</span>
            <span class="value">{{ enterpriseInfo.creditCode }}</span>
          </div>
          <div class="info-row">
            <span class="label">联系人</span>
            <span class="value">{{ enterpriseInfo.contact }}</span>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3 class="section-title">收储信息</h3>
        <el-form :model="form" label-position="top">
          <el-form-item label="来源主体">
            <el-select v-model="form.sourceFarmer" placeholder="请选择来源农户/合作社" style="width: 100%" filterable>
              <el-option label="张三家庭农场" value="张三家庭农场" />
              <el-option label="李四种植合作社" value="李四种植合作社" />
              <el-option label="王五家庭农场" value="王五家庭农场" />
              <el-option label="其他主体" value="其他" />
            </el-select>
          </el-form-item>
          <el-form-item label="收储品种">
            <el-select v-model="form.varietyName" placeholder="请选择" style="width: 100%">
              <el-option label="青贮玉米" value="青贮玉米" />
              <el-option label="青贮小麦" value="青贮小麦" />
              <el-option label="青贮苜蓿" value="青贮苜蓿" />
            </el-select>
          </el-form-item>
          <el-form-item label="收储单价(元/吨)">
            <el-input-number v-model="form.price" :min="0" :step="10" style="width: 100%" />
          </el-form-item>
          <el-form-item label="收储重量(吨)">
            <el-input-number v-model="form.weight" :min="0" :step="10" style="width: 100%" />
          </el-form-item>
          <el-form-item label="收储日期">
            <el-date-picker
              v-model="form.storageDate"
              type="date"
              placeholder="选择日期"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-form>
      </div>

      <div class="form-section">
        <h3 class="section-title">合同附件</h3>
        <div class="file-list">
          <div class="file-item" v-for="(file, index) in form.files" :key="index">
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
            <span>收储重量</span>
            <span>{{ form.weight }} 吨</span>
          </div>
          <div class="calc-row">
            <span>补贴标准</span>
            <span>50 元/吨</span>
          </div>
          <div class="calc-row">
            <span>收储总金额</span>
            <span>{{ formatAmount(form.price * form.weight) }} 万元</span>
          </div>
          <div class="calc-total">
            <span>预估补贴金额</span>
            <span class="amount">¥{{ (form.weight * 50).toFixed(2) }}</span>
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
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

const enterpriseInfo = reactive({
  name: '合肥奶牛养殖有限公司',
  creditCode: '91340100MA2YYYYYY',
  contact: '刘经理'
})

const form = reactive({
  sourceFarmer: '',
  varietyName: '',
  price: 300,
  weight: 0,
  storageDate: '',
  files: []
})

const goBack = () => router.back()

const formatAmount = (value) => (value / 10000).toFixed(2)

const handleAddFile = () => {
  ElMessage.info('文件上传功能开发中')
  form.files.push({ name: `收储合同_${Date.now()}.pdf` })
}

const removeFile = (index) => {
  form.files.splice(index, 1)
}

const handleSaveDraft = () => {
  ElMessage.success('草稿已保存')
}

const handleSubmit = () => {
  if (!form.sourceFarmer) {
    ElMessage.warning('请选择来源主体')
    return
  }
  if (!form.varietyName) {
    ElMessage.warning('请选择收储品种')
    return
  }
  if (form.weight === 0) {
    ElMessage.warning('请输入收储重量')
    return
  }
  if (!form.storageDate) {
    ElMessage.warning('请选择收储日期')
    return
  }

  ElMessageBox.confirm('确认提交收储申报吗？', '确认提交', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    const record = {
      id: `STORE${Date.now()}`,
      subjectName: enterpriseInfo.name,
      sourceFarmer: form.sourceFarmer,
      varietyName: form.varietyName,
      price: form.price,
      weight: form.weight,
      totalAmount: form.price * form.weight,
      storageDate: form.storageDate,
      status: 'pending',
      statusName: '待审核',
      reviewer: '',
      reviewTime: '',
      source: 'wanqitong',
      files: [...form.files]
    }
    const records = JSON.parse(localStorage.getItem('mobileStorageRecords') || '[]')
    records.unshift(record)
    localStorage.setItem('mobileStorageRecords', JSON.stringify(records))
    ElMessage.success('收储申报提交成功，已同步到PC端')
    router.back()
  }).catch(() => {})
}
</script>

<style scoped>
.mobile-storage-declare {
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
  background: #fef3c7;
  font-size: 13px;
  color: #92400e;
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

.file-list {
  display: grid;
  gap: 12px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.file-item .file-name {
  flex: 1;
  font-size: 14px;
  color: #374151;
}

.file-item .remove {
  color: #9ca3af;
  cursor: pointer;
}

.add-file {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  color: #9ca3af;
  cursor: pointer;
}

.calc-card {
  background: #fffbeb;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
}

.calc-title {
  font-size: 15px;
  font-weight: 600;
  color: #92400e;
  margin-bottom: 12px;
}

.calc-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 14px;
  color: #b45309;
}

.calc-total {
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
  margin-top: 8px;
  border-top: 1px solid rgba(245, 158, 11, 0.3);
  font-size: 15px;
  font-weight: 600;
  color: #92400e;
}

.calc-total .amount {
  font-size: 20px;
  color: #d97706;
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
