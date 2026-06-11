<template>
  <div class="mobile-subsidy">
    <div class="page-header">
      <el-icon @click="goBack"><ArrowLeft /></el-icon>
      <h3>补贴申请</h3>
    </div>

    <div class="apply-tabs">
      <el-radio-group v-model="activeTab" size="large">
        <el-radio-button label="apply">申请补贴</el-radio-button>
        <el-radio-button label="records">申请记录</el-radio-button>
      </el-radio-group>
    </div>

    <div class="content-area">
      <template v-if="activeTab === 'apply'">
        <div class="form-section">
          <h3 class="section-title">补贴类型</h3>
          <div class="subsidy-types">
            <div
              class="type-card"
              v-for="type in subsidyTypes"
              :key="type.id"
              :class="{ active: selectedType === type.id }"
              @click="selectedType = type.id"
            >
              <div class="type-icon" :style="{ background: type.color }">
                <el-icon :size="24"><component :is="type.icon" /></el-icon>
              </div>
              <span class="type-name">{{ type.name }}</span>
              <span class="type-amount">{{ type.amount }}/亩</span>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">申请信息</h3>
          <el-form :model="applyForm" label-position="top">
            <el-form-item label="种植主体">
              <el-input v-model="applyForm.subject" placeholder="请输入主体名称" />
            </el-form-item>
            <el-form-item label="作物类型">
              <el-select v-model="applyForm.cropType" placeholder="请选择" style="width: 100%">
                <el-option label="小麦" value="wheat" />
                <el-option label="水稻" value="rice" />
                <el-option label="玉米" value="corn" />
                <el-option label="大豆" value="soybean" />
              </el-select>
            </el-form-item>
            <el-form-item label="种植面积(亩)">
              <el-input-number v-model="applyForm.area" :min="0" style="width: 100%" />
            </el-form-item>
            <el-form-item label="所在地区">
              <el-cascader
                v-model="applyForm.region"
                :options="regionOptions"
                placeholder="请选择地区"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item label="银行账户">
              <el-input v-model="applyForm.bankAccount" placeholder="请输入银行账号" />
            </el-form-item>
            <el-form-item label="开户银行">
              <el-input v-model="applyForm.bankName" placeholder="请输入开户银行" />
            </el-form-item>
            <el-form-item label="上传材料">
              <div class="upload-area">
                <div class="upload-item" v-for="(file, index) in applyForm.files" :key="index">
                  <el-icon><Document /></el-icon>
                  <span>{{ file.name }}</span>
                  <el-icon class="remove" @click="removeFile(index)"><Close /></el-icon>
                </div>
                <div class="upload-btn" @click="handleUpload">
                  <el-icon><Plus /></el-icon>
                  <span>添加材料</span>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>

        <div class="calc-result">
          <div class="calc-item">
            <span>种植面积</span>
            <span class="value">{{ applyForm.area }} 亩</span>
          </div>
          <div class="calc-item">
            <span>补贴标准</span>
            <span class="value">{{ currentSubsidyRate }} 元/亩</span>
          </div>
          <div class="calc-total">
            <span>预计补贴金额</span>
            <span class="amount">{{ estimatedAmount }} 元</span>
          </div>
        </div>

        <div class="submit-bar">
          <el-checkbox v-model="agreeTerms">我已阅读并同意《补贴申请协议》</el-checkbox>
          <el-button type="primary" size="large" style="width: 100%; margin-top: 12px" @click="handleSubmit">
            提交申请
          </el-button>
        </div>
      </template>

      <template v-else>
        <div class="records-list">
          <div class="record-card" v-for="record in applyRecords" :key="record.id">
            <div class="record-header">
              <el-tag :type="getStatusType(record.status)">{{ getStatusName(record.status) }}</el-tag>
              <span class="record-date">{{ record.date }}</span>
            </div>
            <h4 class="record-title">{{ record.type }}补贴</h4>
            <div class="record-info">
              <span>作物：{{ record.crop }}</span>
              <span>面积：{{ record.area }}亩</span>
            </div>
            <div class="record-amount">
              <span>申请金额</span>
              <span class="amount">¥{{ record.amount }}</span>
            </div>
            <el-button v-if="record.status === 'rejected'" type="primary" text size="small">
              查看驳回原因
            </el-button>
          </div>

          <el-empty v-if="applyRecords.length === 0" description="暂无申请记录" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const route = useRoute()

const activeTab = ref('apply')
const selectedType = ref('planting')
const agreeTerms = ref(false)

const subsidyTypes = [
  { id: 'planting', name: '种植补贴', amount: '150元', icon: 'Crop', color: '#3b82f6' },
  { id: 'machinery', name: '农机补贴', amount: '按比例', icon: 'Van', color: '#10b981' },
  { id: 'silage', name: '青贮补贴', amount: '60元', icon: 'Box', color: '#f59e0b' }
]

const currentSubsidyRate = computed(() => {
  const rates = { planting: 150, machinery: 0, silage: 60 }
  return rates[selectedType.value] || 0
})

const estimatedAmount = computed(() => {
  return (applyForm.value.area * currentSubsidyRate.value).toFixed(2)
})

const applyForm = ref({
  subject: '张三家庭农场',
  cropType: '',
  area: 0,
  region: [],
  bankAccount: '',
  bankName: '',
  files: []
})

const regionOptions = [
  {
    value: 'hefei',
    label: '合肥市',
    children: [
      { value: 'feidong', label: '肥东县' },
      { value: 'feixi', label: '肥西县' },
      { value: 'changfeng', label: '长丰县' }
    ]
  },
  {
    value: 'wuhu',
    label: '芜湖市',
    children: [
      { value: 'wuwei', label: '无为市' },
      { value: 'nanling', label: '南陵县' }
    ]
  }
]

const applyRecords = ref([
  {
    id: 1,
    type: '种植',
    crop: '小麦',
    area: 100,
    amount: 15000,
    status: 'approved',
    date: '2024-01-10'
  },
  {
    id: 2,
    type: '青贮',
    crop: '玉米',
    area: 50,
    amount: 3000,
    status: 'pending',
    date: '2024-01-12'
  },
  {
    id: 3,
    type: '农机',
    crop: '-',
    area: 0,
    amount: 8000,
    status: 'rejected',
    date: '2024-01-08'
  }
])

const getStatusType = (status) => {
  const map = { pending: 'warning', approved: 'success', rejected: 'danger' }
  return map[status] || 'info'
}

const getStatusName = (status) => {
  const map = { pending: '审核中', approved: '已通过', rejected: '已驳回' }
  return map[status] || status
}

const goBack = () => router.back()

const handleUpload = () => {
  ElMessage.info('上传功能开发中')
}

const removeFile = (index) => {
  applyForm.value.files.splice(index, 1)
}

const handleSubmit = () => {
  if (!applyForm.value.cropType) {
    ElMessage.warning('请选择作物类型')
    return
  }
  if (applyForm.value.area === 0) {
    ElMessage.warning('请输入种植面积')
    return
  }
  if (!agreeTerms.value) {
    ElMessage.warning('请阅读并同意补贴申请协议')
    return
  }

  ElMessageBox.confirm('确认提交补贴申请吗？', '确认提交', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    ElMessage.success('申请提交成功，请等待审核')
    activeTab.value = 'records'
  }).catch(() => {})
}
</script>

<style scoped>
.mobile-subsidy {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 20px;
}

.page-header {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
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

.apply-tabs {
  background: #fff;
  padding: 12px 16px;
}

.apply-tabs .el-radio-group {
  width: 100%;
  display: flex;
}

.apply-tabs .el-radio-button {
  flex: 1;
}

.content-area {
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

.subsidy-types {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.type-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.type-card.active {
  border-color: #3b82f6;
  background: #eff6ff;
}

.type-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-bottom: 8px;
}

.type-name {
  font-size: 13px;
  color: #1f2937;
  font-weight: 500;
}

.type-amount {
  font-size: 11px;
  color: #6b7280;
  margin-top: 4px;
}

.upload-area {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.upload-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f9fafb;
  border-radius: 8px;
  font-size: 13px;
  color: #374151;
}

.upload-item .remove {
  cursor: pointer;
  color: #ef4444;
}

.upload-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  color: #9ca3af;
  font-size: 13px;
}

.calc-result {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.calc-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
  color: #6b7280;
}

.calc-item .value {
  color: #1f2937;
  font-weight: 500;
}

.calc-total {
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
  margin-top: 8px;
  font-size: 15px;
}

.calc-total .amount {
  font-size: 20px;
  font-weight: 700;
  color: #ef4444;
}

.submit-bar {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.record-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.record-date {
  font-size: 12px;
  color: #9ca3af;
}

.record-title {
  margin: 0 0 12px;
  font-size: 16px;
  color: #1f2937;
}

.record-info {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 12px;
}

.record-amount {
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
  font-size: 14px;
  color: #6b7280;
}

.record-amount .amount {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
}
</style>